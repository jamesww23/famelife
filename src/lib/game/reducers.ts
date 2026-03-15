import { MAX_RECENT_EVENTS, ENERGY_RECOVERY, MENTAL_HEALTH_RECOVERY, QUICK_GAME_TURNS } from "./constants";
import { clamp } from "./random";
import { getTierForFollowers, checkGameOver } from "./progression";
import {
  GameState,
  Stats,
  StatEffects,
  StatDelta,
  EventChoice,
  GameEvent,
  RewardedBoost,
  LogEntry,
} from "./types";
import { EVENT_EMOJI } from "./constants";

/** Apply stat effects to a stats object, clamping bounded stats. Returns new stats + deltas. */
export function applyEffects(stats: Stats, effects: StatEffects): { stats: Stats; deltas: StatDelta[] } {
  const next = { ...stats };
  const deltas: StatDelta[] = [];

  for (const [key, delta] of Object.entries(effects)) {
    const k = key as keyof Stats;
    if (delta !== 0) {
      deltas.push({ stat: k, delta: delta as number });
    }
    next[k] += delta as number;
  }

  // Clamp bounded stats
  next.fame = clamp(next.fame, 0, 100);
  next.reputation = clamp(next.reputation, 0, 100);
  next.energy = clamp(next.energy, 0, 100);
  next.mentalHealth = clamp(next.mentalHealth, 0, 100);
  next.followers = Math.max(next.followers, 0);

  return { stats: next, deltas };
}

/** Apply just the effects without tracking deltas (for simple operations). */
export function applyEffectsSimple(stats: Stats, effects: StatEffects): Stats {
  return applyEffects(stats, effects).stats;
}

/** Process player choosing an event choice. */
export function applyEventChoice(
  state: GameState,
  event: GameEvent,
  choice: EventChoice
): GameState {
  const { stats, deltas } = applyEffects(state.stats, choice.effects);
  let flags = [...state.flags];
  let brandDeals = state.brandDeals;
  let scandals = state.scandals;
  let celebrityEvents = state.celebrityEvents;
  let relationships = state.relationships;
  let viralMoments = state.viralMoments;
  let comebacks = state.comebacks;
  let activeChains = { ...state.activeChains };

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
  if (event.type === "viral") viralMoments++;
  if (event.type === "recovery") comebacks++;
  if (event.id.includes("relationship") || choice.setFlags?.includes("publicRelationship")) {
    relationships++;
  }

  // Advance chain if applicable
  if (choice.triggerChain) {
    activeChains[choice.triggerChain] = (activeChains[choice.triggerChain] ?? -1) + 1;
  } else if (event.chainId) {
    activeChains[event.chainId] = (activeChains[event.chainId] ?? 0) + 1;
  }

  const careerTier = getTierForFollowers(stats.followers);
  const recentEventIds = [...state.recentEventIds, event.id].slice(-MAX_RECENT_EVENTS);

  const emoji = EVENT_EMOJI[event.type] || "📌";
  const logEntry: LogEntry = {
    week: state.week,
    text: `${event.title}: ${choice.text}`,
    type: "event",
    emoji,
  };

  const logEntries: LogEntry[] = [logEntry];

  // Add social reaction to log if present
  if (choice.socialReaction) {
    logEntries.push({
      week: state.week,
      text: choice.socialReaction.text,
      type: "social",
      emoji: choice.socialReaction.type === "tweet" ? "🐦" : choice.socialReaction.type === "headline" ? "📰" : "💬",
    });
  }

  return {
    ...state,
    stats,
    flags,
    careerTier,
    brandDeals,
    scandals,
    celebrityEvents,
    relationships,
    viralMoments,
    comebacks,
    activeChains,
    recentEventIds,
    currentEvent: null,
    currentChoiceResult: { choice, event, deltas },
    phase: "outcome",
    log: [...state.log, ...logEntries],
  };
}

/** Apply rewarded boost effects. */
export function applyBoost(state: GameState, boost: RewardedBoost): GameState {
  const { stats } = applyEffects(state.stats, boost.effects);
  const careerTier = getTierForFollowers(stats.followers);

  const logEntry: LogEntry = {
    week: state.week,
    text: `${boost.name} activated!`,
    type: "boost",
    emoji: boost.emoji,
  };

  return {
    ...state,
    stats,
    careerTier,
    pendingBoost: null,
    log: [...state.log, logEntry],
  };
}

/** Advance to the next week. */
export function advanceWeek(state: GameState): GameState {
  const stats = { ...state.stats };
  stats.energy = clamp(stats.energy + ENERGY_RECOVERY, 0, 100);
  stats.mentalHealth = clamp(stats.mentalHealth + MENTAL_HEALTH_RECOVERY, 0, 100);

  const newWeek = state.week + 1;

  // At the end of quick mode, offer to extend instead of ending
  if (state.mode === "quick" && newWeek > QUICK_GAME_TURNS) {
    return {
      ...state,
      stats,
      week: newWeek,
      phase: "extend_offer",
      currentEvent: null,
      currentChoiceResult: null,
      pendingBoost: null,
      pendingMilestones: [],
    };
  }

  const gameOverReason = checkGameOver({ ...state, stats, week: newWeek });

  return {
    ...state,
    stats,
    week: newWeek,
    phase: gameOverReason ? "game_over" : "event",
    gameOverReason,
    currentEvent: null,
    currentChoiceResult: null,
    pendingBoost: null,
    pendingMilestones: [],
  };
}

/** Add a milestone to the state. */
export function addMilestone(state: GameState, milestoneId: string, title: string, emoji: string): GameState {
  if (state.milestones.includes(milestoneId)) return state;

  const logEntry: LogEntry = {
    week: state.week,
    text: `Milestone: ${title}`,
    type: "milestone",
    emoji,
  };

  return {
    ...state,
    milestones: [...state.milestones, milestoneId],
    pendingMilestones: [...state.pendingMilestones, milestoneId],
    log: [...state.log, logEntry],
  };
}
