import { DEFAULT_STATS } from "./constants";
import { getTierForFollowers } from "./progression";
import { archetypes } from "@/data/archetypes";
import { allEvents } from "@/data/events";
import { allActions } from "@/data/actions";
import { rewardedAds } from "@/data/rewarded-ads";
import { milestones } from "@/data/milestones";
import { selectEvent } from "./event-selector";
import {
  applyAction,
  setCurrentEvent,
  applyEventChoice,
  applyRewardedAd,
  advanceWeek,
  addMilestone,
  applyEffects,
} from "./reducers";
import { isTierAtLeast } from "./progression";
import {
  ArchetypeId,
  GameState,
  GameAction,
  EventChoice,
  RewardedAd,
} from "./types";

// ---- Initial State ----

export function createInitialState(archetypeId: ArchetypeId): GameState {
  const arch = archetypes.find((a) => a.id === archetypeId)!;
  const stats = applyEffects({ ...DEFAULT_STATS }, arch.startingModifiers);

  return {
    phase: "choose_action",
    week: 1,
    archetype: archetypeId,
    stats,
    flags: [],
    careerTier: getTierForFollowers(stats.followers),
    log: [{ week: 1, text: `🎬 Started career as ${arch.name}`, type: "system" }],
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
}

// ---- Available Actions ----

export function getAvailableActions(state: GameState): GameAction[] {
  return allActions.filter((a) => {
    if (a.minTier && !isTierAtLeast(state.careerTier, a.minTier)) return false;
    if (a.energyCost > state.stats.energy) return false;
    return true;
  });
}

// ---- Turn Steps ----

export function performAction(state: GameState, action: GameAction): GameState {
  // 1. Apply action
  let next = applyAction(state, action);

  // 2. Select and present event
  const event = selectEvent(allEvents, next, action.eventBias);
  next = setCurrentEvent(next, event);

  return next;
}

export function resolveEventChoice(state: GameState, choice: EventChoice): GameState {
  if (!state.currentEvent) return state;
  let next = applyEventChoice(state, state.currentEvent, choice);

  // Check milestones
  next = checkMilestones(next);

  // Check for rewarded ad opportunity
  const ad = findEligibleAd(next);
  if (ad) {
    next = { ...next, pendingAd: ad };
  }

  return next;
}

export function acceptRewardedAd(state: GameState): GameState {
  if (!state.pendingAd) return state;
  let next = applyRewardedAd(state, state.pendingAd);
  next = checkMilestones(next);
  return next;
}

export function declineRewardedAd(state: GameState): GameState {
  return { ...state, pendingAd: null };
}

export function endTurn(state: GameState): GameState {
  return advanceWeek(state);
}

// ---- Helpers ----

function checkMilestones(state: GameState): GameState {
  let next = state;
  for (const m of milestones) {
    if (!next.milestones.includes(m.id) && m.check(next)) {
      next = addMilestone(next, m.id, m.title);
    }
  }
  return next;
}

function findEligibleAd(state: GameState): RewardedAd | null {
  const lastEvent = state.currentChoiceResult?.event;
  if (!lastEvent) return null;

  // Only show ads ~40% of the time
  if (Math.random() > 0.4) return null;

  const candidates = rewardedAds.filter((ad) => {
    switch (ad.triggerCondition) {
      case "post_content":
        return lastEvent.type === "viral" || state.lastActionId?.includes("post") || state.lastActionId?.includes("livestream");
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
