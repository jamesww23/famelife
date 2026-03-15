import { MAX_RECENT_EVENTS } from "./constants";
import { clamp } from "./random";
import { getTierForFollowers, checkGameOver } from "./progression";
import {
  GameState,
  Stats,
  StatEffects,
  GameAction,
  EventChoice,
  GameEvent,
  RewardedAd,
  LogEntry,
} from "./types";

/** Apply stat effects to a stats object, clamping bounded stats. */
export function applyEffects(stats: Stats, effects: StatEffects): Stats {
  const next = { ...stats };

  for (const [key, delta] of Object.entries(effects)) {
    const k = key as keyof Stats;
    next[k] += delta as number;
  }

  // Clamp bounded stats
  next.fame = clamp(next.fame, 0, 100);
  next.reputation = clamp(next.reputation, 0, 100);
  next.energy = clamp(next.energy, 0, 100);
  next.mentalHealth = clamp(next.mentalHealth, 0, 100);
  next.followers = Math.max(next.followers, 0);

  return next;
}

/** Process player choosing an action. */
export function applyAction(state: GameState, action: GameAction): GameState {
  const stats = applyEffects(state.stats, action.effects);
  stats.energy = clamp(stats.energy - action.energyCost, 0, 100);

  const logEntry: LogEntry = {
    week: state.week,
    text: `📋 ${action.name}`,
    type: "action",
  };

  return {
    ...state,
    stats,
    lastActionId: action.id,
    log: [...state.log, logEntry],
  };
}

/** Set the current event for the player to respond to. */
export function setCurrentEvent(state: GameState, event: GameEvent): GameState {
  return {
    ...state,
    phase: "event",
    currentEvent: event,
  };
}

/** Process player choosing an event choice. */
export function applyEventChoice(
  state: GameState,
  event: GameEvent,
  choice: EventChoice
): GameState {
  let stats = applyEffects(state.stats, choice.effects);
  let flags = [...state.flags];
  let brandDeals = state.brandDeals;
  let scandals = state.scandals;
  let celebrityEvents = state.celebrityEvents;
  let relationships = state.relationships;

  // Set/remove flags
  if (choice.setFlags) {
    for (const f of choice.setFlags) {
      if (!flags.includes(f)) flags.push(f);
    }
  }
  if (choice.removeFlags) {
    flags = flags.filter((f) => !choice.removeFlags!.includes(f));
  }

  // Track counters based on event type
  if (event.type === "brand") brandDeals++;
  if (event.type === "drama" && (choice.effects.reputation ?? 0) < 0) scandals++;
  if (event.type === "celebrity") celebrityEvents++;
  if (event.id.includes("relationship") || choice.setFlags?.includes("publicRelationship")) {
    relationships++;
  }

  const careerTier = getTierForFollowers(stats.followers);

  const recentEventIds = [...state.recentEventIds, event.id].slice(-MAX_RECENT_EVENTS);

  const logEntry: LogEntry = {
    week: state.week,
    text: `${getEventEmoji(event.type)} ${event.title}: ${choice.text}`,
    type: "event",
  };

  return {
    ...state,
    stats,
    flags,
    careerTier,
    brandDeals,
    scandals,
    celebrityEvents,
    relationships,
    recentEventIds,
    currentEvent: null,
    currentChoiceResult: { choice, event },
    phase: "event_outcome",
    log: [...state.log, logEntry],
  };
}

function getEventEmoji(type: string): string {
  const map: Record<string, string> = {
    viral: "🔥",
    drama: "😱",
    brand: "🤝",
    celebrity: "🌟",
    platform: "📱",
    lifestyle: "🏖️",
    failure: "💔",
    recovery: "🔄",
  };
  return map[type] || "📌";
}

/** Apply rewarded ad effects. */
export function applyRewardedAd(state: GameState, ad: RewardedAd): GameState {
  const stats = applyEffects(state.stats, ad.effects);
  const careerTier = getTierForFollowers(stats.followers);

  const logEntry: LogEntry = {
    week: state.week,
    text: `🎬 ${ad.name} activated!`,
    type: "ad",
  };

  return {
    ...state,
    stats,
    careerTier,
    pendingAd: null,
    log: [...state.log, logEntry],
  };
}

/** Advance to the next week. */
export function advanceWeek(state: GameState): GameState {
  // Natural energy/mental health recovery
  const stats = { ...state.stats };
  stats.energy = clamp(stats.energy + 15, 0, 100);
  stats.mentalHealth = clamp(stats.mentalHealth + 3, 0, 100);

  const gameOverReason = checkGameOver({ ...state, stats });

  return {
    ...state,
    stats,
    week: state.week + 1,
    phase: gameOverReason ? "game_over" : "choose_action",
    gameOverReason,
    currentEvent: null,
    currentChoiceResult: null,
    pendingAd: null,
    pendingMilestones: [],
  };
}

/** Add a milestone to the state. */
export function addMilestone(state: GameState, milestoneId: string, title: string): GameState {
  if (state.milestones.includes(milestoneId)) return state;

  const logEntry: LogEntry = {
    week: state.week,
    text: `🏆 Milestone: ${title}`,
    type: "milestone",
  };

  return {
    ...state,
    milestones: [...state.milestones, milestoneId],
    pendingMilestones: [...state.pendingMilestones, milestoneId],
    log: [...state.log, logEntry],
  };
}
