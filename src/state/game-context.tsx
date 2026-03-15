"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import {
  GameState,
  ArchetypeId,
  GameAction,
  EventChoice,
  GamePhase,
} from "@/lib/game/types";
import {
  createInitialState,
  getAvailableActions,
  performAction,
  resolveEventChoice,
  acceptRewardedAd,
  declineRewardedAd,
  endTurn,
} from "@/lib/game/engine";
import { generateSummary } from "@/lib/game/summary";
import { STORAGE_KEY } from "@/lib/game/constants";

type GameContextValue = {
  state: GameState;
  availableActions: GameAction[];
  startGame: (archetype: ArchetypeId) => void;
  chooseAction: (action: GameAction) => void;
  chooseEventOption: (choice: EventChoice) => void;
  onAcceptAd: () => void;
  onDeclineAd: () => void;
  proceedFromOutcome: () => void;
  proceedFromMilestone: () => void;
  restartGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type Action =
  | { type: "SET_STATE"; state: GameState }
  | { type: "START_GAME"; archetype: ArchetypeId }
  | { type: "CHOOSE_ACTION"; action: GameAction }
  | { type: "CHOOSE_EVENT"; choice: EventChoice }
  | { type: "ACCEPT_AD" }
  | { type: "DECLINE_AD" }
  | { type: "PROCEED_OUTCOME" }
  | { type: "PROCEED_MILESTONE" }
  | { type: "RESTART" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_STATE":
      return action.state;
    case "START_GAME":
      return createInitialState(action.archetype);
    case "CHOOSE_ACTION":
      return performAction(state, action.action);
    case "CHOOSE_EVENT":
      return resolveEventChoice(state, action.choice);
    case "ACCEPT_AD":
      return acceptRewardedAd(state);
    case "DECLINE_AD":
      return declineRewardedAd(state);
    case "PROCEED_OUTCOME": {
      // After seeing outcome, check if we need to show ad or milestones, or end turn
      if (state.pendingAd) {
        return { ...state, phase: "rewarded_ad" as GamePhase };
      }
      if (state.pendingMilestones.length > 0) {
        return { ...state, phase: "milestone" as GamePhase };
      }
      return endTurn(state);
    }
    case "PROCEED_MILESTONE": {
      return endTurn(state);
    }
    case "RESTART":
      return { ...createInitialState("comedy"), phase: "start" as GamePhase };
    default:
      return state;
  }
}

const INITIAL: GameState = {
  phase: "start",
  week: 0,
  archetype: "comedy",
  stats: { followers: 0, fame: 0, reputation: 0, money: 0, energy: 0, mentalHealth: 0 },
  flags: [],
  careerTier: "new_creator",
  log: [],
  milestones: [],
  currentEvent: null,
  currentChoiceResult: null,
  pendingAd: null,
  pendingMilestones: [],
  lastActionId: null,
  recentEventIds: [],
  brandDeals: 0,
  scandals: 0,
  celebrityEvents: 0,
  relationships: 0,
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

  const availableActions = state.phase === "choose_action" ? getAvailableActions(state) : [];

  const startGame = useCallback((archetype: ArchetypeId) => {
    dispatch({ type: "START_GAME", archetype });
  }, []);

  const chooseAction = useCallback((action: GameAction) => {
    dispatch({ type: "CHOOSE_ACTION", action });
  }, []);

  const chooseEventOption = useCallback((choice: EventChoice) => {
    dispatch({ type: "CHOOSE_EVENT", choice });
  }, []);

  const onAcceptAd = useCallback(() => {
    dispatch({ type: "ACCEPT_AD" });
    // After ad, check milestones then end turn
    setTimeout(() => {
      dispatch({ type: "PROCEED_OUTCOME" });
    }, 0);
  }, []);

  const onDeclineAd = useCallback(() => {
    dispatch({ type: "DECLINE_AD" });
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
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESTART" });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        availableActions,
        startGame,
        chooseAction,
        chooseEventOption,
        onAcceptAd,
        onDeclineAd,
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
