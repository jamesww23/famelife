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
  applyActivity,
  applyPurchase,
  advanceWeek,
  addMilestone,
} from "./reducers";
import {
  ArchetypeId,
  CharacterBuild,
  GameState,
  EventChoice,
  RewardedBoost,
  QuarterlyActivity,
  ShopItem,
} from "./types";
import { traits } from "@/data/traits";

// ---- Initial State ----

export function createInitialState(archetypeId: ArchetypeId, character: CharacterBuild): GameState {
  const arch = archetypes.find((a) => a.id === archetypeId)!;
  const trait = traits.find((t) => t.id === character.traitId);
  let stats = applyEffectsSimple({ ...DEFAULT_STATS }, arch.startingModifiers);
  if (trait) {
    stats = applyEffectsSimple(stats, trait.modifiers);
  }

  return {
    phase: "activity",
    week: 1,
    mode: "full",
    archetype: archetypeId,
    character,
    stats,
    flags: [],
    careerTier: getTierForFollowers(stats.followers),
    log: [{ week: 1, text: `${character.name} started their career as ${arch.name}`, type: "system", emoji: "\uD83C\uDFAC" }],
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
}

// ---- Serve next event (Reigns-style: events come to you) ----

export function serveNextEvent(state: GameState): GameState {
  // Check for scheduled (delayed consequence) events first
  const dueEvent = state.scheduledEvents.find(se => se.triggerWeek <= state.week);
  if (dueEvent) {
    const scheduledEvent = allEvents.find(e => e.id === dueEvent.eventId);
    if (scheduledEvent) {
      const scheduledEvents = state.scheduledEvents.filter(se => se !== dueEvent);
      return {
        ...state,
        phase: "event",
        currentEvent: scheduledEvent,
        scheduledEvents,
      };
    }
  }

  const event = selectEvent(allEvents, state);
  return {
    ...state,
    phase: "event",
    currentEvent: event,
  };
}

// ---- Handle shop purchase (stays in activity phase) ----

export function purchaseItem(state: GameState, item: ShopItem): GameState {
  let next = applyPurchase(state, item);
  next = checkMilestones(next);
  return next;
}

// ---- Resolve activity selection (new turn phase) ----

export function handleActivitySelection(state: GameState, activity: QuarterlyActivity): GameState {
  const next = applyActivity(state, activity);
  // After picking an activity, serve the random event for this quarter
  return serveNextEvent(next);
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
  // advanceWeek sets phase to "activity" (or "game_over")
  // The next event is served after the player picks their activity
  return advanceWeek(state);
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

  // Risky choices have higher boost chance (reward the risk-taker with ad opportunities)
  const lastChoice = state.currentChoiceResult?.choice;
  const riskBonus = lastChoice?.riskTag ? 0.15 : 0;
  if (Math.random() > BOOST_CHANCE + riskBonus) return null;

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
