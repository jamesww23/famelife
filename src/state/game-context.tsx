"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import {
  GameState,
  ArchetypeId,
  GameMode,
  EventChoice,
  GamePhase,
} from "@/lib/game/types";
import {
  createInitialState,
  serveNextEvent,
  resolveEventChoice,
  acceptBoost,
  declineBoost,
  endTurn,
} from "@/lib/game/engine";
import { generateSummary } from "@/lib/game/summary";
import { STORAGE_KEY } from "@/lib/game/constants";

type GameContextValue = {
  state: GameState;
  startGame: (archetype: ArchetypeId, mode: GameMode) => void;
  chooseEventOption: (choice: EventChoice) => void;
  onAcceptBoost: () => void;
  onDeclineBoost: () => void;
  proceedFromOutcome: () => void;
  proceedFromMilestone: () => void;
  extendGame: () => void;
  declineExtend: () => void;
  restartGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type Action =
  | { type: "SET_STATE"; state: GameState }
  | { type: "START_GAME"; archetype: ArchetypeId; mode: GameMode }
  | { type: "CHOOSE_EVENT"; choice: EventChoice }
  | { type: "ACCEPT_BOOST" }
  | { type: "DECLINE_BOOST" }
  | { type: "PROCEED_OUTCOME" }
  | { type: "PROCEED_MILESTONE" }
  | { type: "EXTEND_GAME" }
  | { type: "DECLINE_EXTEND" }
  | { type: "RESTART" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_STATE":
      return action.state;
    case "START_GAME": {
      const initial = createInitialState(action.archetype, action.mode);
      // Immediately serve the first event
      return serveNextEvent(initial);
    }
    case "CHOOSE_EVENT":
      return resolveEventChoice(state, action.choice);
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
      return endTurn(state);
    }
    case "EXTEND_GAME": {
      // Switch to full mode and continue playing
      const extended = { ...state, mode: "full" as GameMode, phase: "event" as GamePhase };
      return serveNextEvent(extended);
    }
    case "DECLINE_EXTEND": {
      const years = Math.ceil(state.week / 4);
      return {
        ...state,
        phase: "game_over" as GamePhase,
        gameOverReason: `After ${years} years, you stepped away from the spotlight.`,
      };
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
  gameOverReason: null,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const initialized = useRef(false);

  // Load saved state on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        if (parsed.phase !== "start" && parsed.week > 0) {
          dispatch({ type: "SET_STATE", state: parsed });
        }
      }
    } catch {
      // Ignore invalid saves
    }
  }, []);

  // Persist state on change
  useEffect(() => {
    if (state.phase !== "start" && state.week > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage full
      }
    }
  }, [state]);

  const startGame = useCallback((archetype: ArchetypeId, mode: GameMode) => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "START_GAME", archetype, mode });
  }, []);

  const chooseEventOption = useCallback((choice: EventChoice) => {
    dispatch({ type: "CHOOSE_EVENT", choice });
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

  const extendGame = useCallback(() => {
    dispatch({ type: "EXTEND_GAME" });
  }, []);

  const declineExtend = useCallback(() => {
    dispatch({ type: "DECLINE_EXTEND" });
  }, []);

  const restartGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESTART" });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        chooseEventOption,
        onAcceptBoost,
        onDeclineBoost,
        proceedFromOutcome,
        proceedFromMilestone,
        extendGame,
        declineExtend,
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
