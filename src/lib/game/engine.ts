import { DEFAULT_STATS, BOOST_CHANCE } from "./constants";
import { getTierForFollowers } from "./progression";
import { archetypes } from "@/data/archetypes";
import { allEvents } from "@/data/events";
import { rewardedBoosts } from "@/data/rewarded-boosts";
import { milestones } from "@/data/milestones";
import { selectEvent } from "./event-selector";
import {
  applyEffectsSimple,
  applyEventChoice,
  applyBoost,
  advanceWeek,
  addMilestone,
} from "./reducers";
import {
  ArchetypeId,
  GameState,
  GameMode,
  EventChoice,
  RewardedBoost,
} from "./types";

// ---- Initial State ----

export function createInitialState(archetypeId: ArchetypeId, mode: GameMode): GameState {
  const arch = archetypes.find((a) => a.id === archetypeId)!;
  const stats = applyEffectsSimple({ ...DEFAULT_STATS }, arch.startingModifiers);

  return {
    phase: "event",
    week: 1,
    mode,
    archetype: archetypeId,
    stats,
    flags: [],
    careerTier: getTierForFollowers(stats.followers),
    log: [{ week: 1, text: `Started career as ${arch.name}`, type: "system", emoji: "🎬" }],
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
}

// ---- Serve next event (Reigns-style: events come to you) ----

export function serveNextEvent(state: GameState): GameState {
  const event = selectEvent(allEvents, state);
  return {
    ...state,
    phase: "event",
    currentEvent: event,
  };
}

// ---- Resolve player choice ----

export function resolveEventChoice(state: GameState, choice: EventChoice): GameState {
  if (!state.currentEvent) return state;
  let next = applyEventChoice(state, state.currentEvent, choice);

  // Check milestones
  next = checkMilestones(next);

  // Check for boost opportunity
  const boost = findEligibleBoost(next);
  if (boost) {
    next = { ...next, pendingBoost: boost };
  }

  return next;
}

// ---- Boost handling ----

export function acceptBoost(state: GameState): GameState {
  if (!state.pendingBoost) return state;
  let next = applyBoost(state, state.pendingBoost);
  next = checkMilestones(next);
  return next;
}

export function declineBoost(state: GameState): GameState {
  return { ...state, pendingBoost: null };
}

// ---- End turn ----

export function endTurn(state: GameState): GameState {
  const next = advanceWeek(state);
  // If not game over, serve the next event automatically
  if (next.phase === "event") {
    return serveNextEvent(next);
  }
  return next;
}

// ---- Helpers ----

function checkMilestones(state: GameState): GameState {
  let next = state;
  for (const m of milestones) {
    if (!next.milestones.includes(m.id) && m.check(next)) {
      next = addMilestone(next, m.id, m.title, m.emoji);
    }
  }
  return next;
}

function findEligibleBoost(state: GameState): RewardedBoost | null {
  const lastEvent = state.currentChoiceResult?.event;
  if (!lastEvent) return null;

  // Only show boosts some of the time
  if (Math.random() > BOOST_CHANCE) return null;

  const candidates = rewardedBoosts.filter((boost) => {
    switch (boost.triggerCondition) {
      case "post_content":
        return lastEvent.type === "viral";
      case "post_scandal":
        return lastEvent.type === "drama" || lastEvent.type === "failure";
      case "celebrity_threshold":
        return lastEvent.type === "celebrity";
      case "brand_deal":
        return lastEvent.type === "brand";
      case "low_energy":
        return state.stats.energy < 30;
      case "any":
        return true;
      default:
        return false;
    }
  });

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
