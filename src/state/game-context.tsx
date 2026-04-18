"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import {
  GameState,
  ArchetypeId,
  CharacterBuild,
  EventChoice,
  QuarterlyActivity,
  GamePhase,
  ShopItem,
} from "@/lib/game/types";
import {
  createInitialState,
  handleActivitySelection,
  resolveEventChoice,
  acceptBoost,
  declineBoost,
  endTurn,
  purchaseItem,
} from "@/lib/game/engine";
import { generateSummary } from "@/lib/game/summary";
import { loadLegacyAsync } from "@/lib/game/legacy";
import { STORAGE_KEY, SAVE_VERSION } from "@/lib/game/constants";
import {
  getItem,
  setItem,
  removeItem,
  initNativeServices,
  reportMilestoneAchievement,
  maybeShowInterstitial,
  resetAdState,
  trackEvent,
} from "@/lib/native";
import { captureError } from "@/lib/native/analytics";

// ── Save envelope ─────────────────────────────────────────
// We wrap GameState in a small envelope so we can detect schema changes
// at parse time and start fresh rather than corrupt the player's run.
interface SaveEnvelope {
  version: number;
  state: GameState;
}

/** Loose runtime guard — checks the shape, not every field. */
function isPlausibleGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.phase === "string" &&
    typeof v.week === "number" &&
    typeof v.archetype === "string" &&
    typeof v.character === "object" && v.character !== null &&
    typeof v.stats === "object" && v.stats !== null &&
    Array.isArray(v.flags) &&
    Array.isArray(v.milestones)
  );
}

/** Decode a saved blob, returning null if it's stale, corrupt, or wrong version. */
function decodeSave(raw: string): GameState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    // Versioned envelope (v1+)
    if ("version" in parsed && "state" in parsed) {
      const env = parsed as SaveEnvelope;
      if (env.version !== SAVE_VERSION) return null;
      if (!isPlausibleGameState(env.state)) return null;
      return env.state;
    }

    // No envelope — reject. (Old "influencer-life-save-v6" key has been retired,
    // so any unwrapped blob here is from a pre-release dev session and should be discarded.)
    return null;
  } catch {
    return null;
  }
}

function encodeSave(state: GameState): string {
  const envelope: SaveEnvelope = { version: SAVE_VERSION, state };
  return JSON.stringify(envelope);
}

type GameContextValue = {
  state: GameState;
  startGame: (archetype: ArchetypeId, character: CharacterBuild) => void;
  selectActivity: (activity: QuarterlyActivity) => void;
  chooseEventOption: (choice: EventChoice) => void;
  buyItem: (item: ShopItem) => void;
  onAcceptBoost: () => void;
  onDeclineBoost: () => void;
  proceedFromOutcome: () => void;
  proceedFromMilestone: () => void;
  restartGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type Action =
  | { type: "SET_STATE"; state: GameState }
  | { type: "START_GAME"; archetype: ArchetypeId; character: CharacterBuild }
  | { type: "SELECT_ACTIVITY"; activity: QuarterlyActivity }
  | { type: "CHOOSE_EVENT"; choice: EventChoice }
  | { type: "BUY_ITEM"; item: ShopItem }
  | { type: "ACCEPT_BOOST" }
  | { type: "DECLINE_BOOST" }
  | { type: "PROCEED_OUTCOME" }
  | { type: "PROCEED_MILESTONE" }
  | { type: "RESTART" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_STATE":
      return action.state;
    case "START_GAME": {
      // Start in activity phase — player picks their first action
      return createInitialState(action.archetype, action.character);
    }
    case "SELECT_ACTIVITY": {
      // Apply activity effects, then serve the quarter's random event
      return handleActivitySelection(state, action.activity);
    }
    case "CHOOSE_EVENT":
      return resolveEventChoice(state, action.choice);
    case "BUY_ITEM":
      return purchaseItem(state, action.item);
    case "ACCEPT_BOOST":
      return acceptBoost(state);
    case "DECLINE_BOOST":
      return declineBoost(state);
    case "PROCEED_OUTCOME": {
      // After seeing outcome, check boost -> milestone -> next turn
      if (state.pendingBoost) {
        return { ...state, phase: "boost_offer" as GamePhase };
      }
      if (state.pendingMilestones.length > 0) {
        return { ...state, phase: "milestone" as GamePhase };
      }
      return endTurn(state);
    }
    case "PROCEED_MILESTONE": {
      // Pop the first milestone; if more remain, stay in milestone phase
      const remaining = state.pendingMilestones.slice(1);
      if (remaining.length > 0) {
        return { ...state, pendingMilestones: remaining, phase: "milestone" as GamePhase };
      }
      return endTurn(state);
    }
    case "RESTART":
      return { ...INITIAL };
    default:
      return state;
  }
}

const INITIAL: GameState = {
  phase: "start",
  week: 0,
  mode: "full",
  archetype: "comedy",
  character: { name: "", avatar: "\uD83D\uDE0E", traitId: "street_smart" },
  stats: { followers: 0, fame: 0, reputation: 0, money: 0, energy: 0, mentalHealth: 0 },
  flags: [],
  careerTier: "new_creator",
  log: [],
  milestones: [],
  currentEvent: null,
  currentChoiceResult: null,
  pendingBoost: null,
  pendingMilestones: [],
  recentEventIds: [],
  activeChains: {},
  brandDeals: 0,
  scandals: 0,
  celebrityEvents: 0,
  relationships: 0,
  viralMoments: 0,
  comebacks: 0,
  riskLevel: 0,
  scheduledEvents: [],
  purchases: [],
  quarterlyIncome: null,
  gameOverReason: null,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const initialized = useRef(false);
  // Suppress the persist effect until the load attempt has completed,
  // otherwise the first render writes INITIAL on top of any saved game.
  const hydrated = useRef(false);
  const prevMilestones = useRef<string[]>([]);

  // Initialize native services + warm legacy cache on mount
  useEffect(() => {
    initNativeServices().catch((e) => {
      // Native services are optional — game works without them, but log so we know.
      captureError(e, { context: "initNativeServices" });
    });
    // Eagerly load legacy from Preferences (UserDefaults) so that
    // synchronous `loadLegacy()` reads from a warm cache on native.
    loadLegacyAsync().catch((e) => {
      captureError(e, { context: "loadLegacyAsync" });
    });
  }, []);

  // Load saved state on mount — async for native storage
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        const saved = await getItem(STORAGE_KEY);
        if (saved) {
          const decoded = decodeSave(saved);
          if (decoded && decoded.phase !== "start" && decoded.week > 0) {
            dispatch({ type: "SET_STATE", state: decoded });
          } else if (saved && !decoded) {
            // Stale / corrupt save — clear it so the next write is clean.
            await removeItem(STORAGE_KEY).catch(() => {});
          }
        }
      } catch (e) {
        captureError(e, { context: "loadSave", key: STORAGE_KEY });
      } finally {
        // Allow persist effect to write only after we've finished trying to load.
        hydrated.current = true;
      }
    })();
  }, []);

  // Persist state on change — async for native storage
  useEffect(() => {
    if (!hydrated.current) return;
    if (state.phase === "start" || state.week === 0) return;
    setItem(STORAGE_KEY, encodeSave(state)).catch((e) => {
      captureError(e, { context: "persistSave", key: STORAGE_KEY });
    });
  }, [state]);

  // Report new milestones to Game Center
  useEffect(() => {
    if (state.milestones.length > prevMilestones.current.length) {
      const newMilestones = state.milestones.filter(
        (m) => !prevMilestones.current.includes(m)
      );
      for (const milestoneId of newMilestones) {
        reportMilestoneAchievement(milestoneId).catch((e) => {
          captureError(e, { context: "reportMilestoneAchievement", milestoneId });
        });
      }
    }
    prevMilestones.current = state.milestones;
  }, [state.milestones]);

  // Show interstitial ad between turns
  useEffect(() => {
    if (state.phase === "activity" && state.week > 1) {
      maybeShowInterstitial().catch((e) => {
        captureError(e, { context: "maybeShowInterstitial" });
      });
    }
  }, [state.phase, state.week]);

  const startGame = useCallback((archetype: ArchetypeId, character: CharacterBuild) => {
    removeItem(STORAGE_KEY).catch((e) => {
      captureError(e, { context: "startGame:removeItem" });
    });
    resetAdState();
    trackEvent("game_start", { archetype, character: character.name });
    dispatch({ type: "START_GAME", archetype, character });
  }, []);

  const selectActivity = useCallback((activity: QuarterlyActivity) => {
    dispatch({ type: "SELECT_ACTIVITY", activity });
  }, []);

  const chooseEventOption = useCallback((choice: EventChoice) => {
    dispatch({ type: "CHOOSE_EVENT", choice });
  }, []);

  const buyItem = useCallback((item: ShopItem) => {
    dispatch({ type: "BUY_ITEM", item });
  }, []);

  const onAcceptBoost = useCallback(() => {
    dispatch({ type: "ACCEPT_BOOST" });
    // After boost, proceed to milestone or end turn
    setTimeout(() => {
      dispatch({ type: "PROCEED_OUTCOME" });
    }, 0);
  }, []);

  const onDeclineBoost = useCallback(() => {
    dispatch({ type: "DECLINE_BOOST" });
    setTimeout(() => {
      dispatch({ type: "PROCEED_OUTCOME" });
    }, 0);
  }, []);

  const proceedFromOutcome = useCallback(() => {
    dispatch({ type: "PROCEED_OUTCOME" });
  }, []);

  const proceedFromMilestone = useCallback(() => {
    dispatch({ type: "PROCEED_MILESTONE" });
  }, []);

  const restartGame = useCallback(() => {
    removeItem(STORAGE_KEY).catch(() => {});
    trackEvent("game_restart");
    dispatch({ type: "RESTART" });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        selectActivity,
        chooseEventOption,
        buyItem,
        onAcceptBoost,
        onDeclineBoost,
        proceedFromOutcome,
        proceedFromMilestone,
        restartGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export { generateSummary };
