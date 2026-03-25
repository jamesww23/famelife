import { MAX_RECENT_EVENTS, ENERGY_RECOVERY, MENTAL_HEALTH_RECOVERY, RISK_INCREASE_PER_CHOICE, RISK_DECAY_PER_TURN } from "./constants";
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
  QuarterlyActivity,
  LogEntry,
  ShopItem,
} from "./types";
import { calculateQuarterlyIncome } from "./income";
import { EVENT_EMOJI } from "./constants";
import { computePassiveEffects } from "@/data/shop";

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

/**
 * Apply outcome variance for risky choices.
 * Lucky: amplify positive effects, soften negatives.
 * Unlucky: amplify negative effects, soften positives.
 */
function applyRiskVariance(
  effects: StatEffects,
  riskLevel: number,
): { effects: StatEffects; outcome: "lucky" | "unlucky" } {
  // Higher risk level makes luck less likely (45% base → down to 25% at max risk)
  const luckChance = 0.45 - (riskLevel * 0.002);
  const isLucky = Math.random() < luckChance;

  // Variance range widens with risk level
  const spread = 1.3 + (riskLevel * 0.007); // 1.3x to 2.0x at max risk

  const varied: StatEffects = {};
  for (const [key, val] of Object.entries(effects)) {
    if (val === undefined || val === 0) { varied[key as keyof StatEffects] = val; continue; }
    if (isLucky) {
      // Lucky: amplify positive, soften negative
      varied[key as keyof StatEffects] = val > 0
        ? Math.round(val * spread)
        : Math.round(val * 0.5);
    } else {
      // Unlucky: soften positive, amplify negative
      varied[key as keyof StatEffects] = val > 0
        ? Math.round(val * 0.5)
        : Math.round(val * spread);
    }
  }
  return { effects: varied, outcome: isLucky ? "lucky" : "unlucky" };
}

/** Process player choosing an event choice. */
export function applyEventChoice(
  state: GameState,
  event: GameEvent,
  choice: EventChoice
): GameState {
  // Apply risk variance for high-risk choices
  let finalEffects = { ...choice.effects };
  let riskOutcome: "lucky" | "unlucky" | null = null;
  if (choice.riskTag === "high_risk") {
    const result = applyRiskVariance(choice.effects, state.riskLevel);
    finalEffects = result.effects;
    riskOutcome = result.outcome;
  }

  // PR Team: reduce reputation damage from scandal events
  const passive = computePassiveEffects(state.purchases);
  if (passive.scandalReduction && finalEffects.reputation && finalEffects.reputation < 0) {
    finalEffects.reputation = Math.round(finalEffects.reputation * (1 - passive.scandalReduction));
  }

  const { stats, deltas } = applyEffects(state.stats, finalEffects);
  let flags = [...state.flags];
  let brandDeals = state.brandDeals;
  let scandals = state.scandals;
  let celebrityEvents = state.celebrityEvents;
  let relationships = state.relationships;
  let viralMoments = state.viralMoments;
  let comebacks = state.comebacks;
  const activeChains = { ...state.activeChains };

  // Risk level increases for risky choices
  let riskLevel = state.riskLevel;
  if (choice.riskTag) {
    riskLevel = clamp(riskLevel + RISK_INCREASE_PER_CHOICE, 0, 100);
  }

  // Schedule delayed events
  const scheduledEvents = [...state.scheduledEvents];
  if (choice.scheduledEvent) {
    scheduledEvents.push({
      eventId: choice.scheduledEvent.eventId,
      triggerWeek: state.week + choice.scheduledEvent.delay,
    });
  }

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
  if (event.type === "empire") brandDeals++; // empire events count as brand milestones too
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
    riskLevel,
    scheduledEvents,
    currentEvent: null,
    currentChoiceResult: { choice, event, deltas, riskOutcome },
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

/** Apply a quarterly activity choice. */
export function applyActivity(state: GameState, activity: QuarterlyActivity): GameState {
  const effects = { ...activity.getEffects(state) };
  // Apply follower gain multiplier from purchases
  if (effects.followers && effects.followers > 0) {
    const passive = computePassiveEffects(state.purchases);
    if (passive.followerGainMultiplier) {
      effects.followers = Math.floor(effects.followers * (1 + passive.followerGainMultiplier));
    }
  }
  const { stats } = applyEffects(state.stats, effects);
  const careerTier = getTierForFollowers(stats.followers);

  const logEntry: LogEntry = {
    week: state.week,
    text: `${activity.name}`,
    type: "system",
    emoji: activity.emoji,
  };

  return {
    ...state,
    stats,
    careerTier,
    log: [...state.log, logEntry],
  };
}

/** Apply a shop purchase. */
export function applyPurchase(state: GameState, item: ShopItem): GameState {
  const purchases = [...state.purchases, item.id];
  const { stats } = item.onPurchaseEffects
    ? applyEffects(state.stats, { ...item.onPurchaseEffects, money: -(item.cost) })
    : applyEffects(state.stats, { money: -(item.cost) });

  const flags = [...state.flags];
  if (item.setFlags) {
    for (const f of item.setFlags) {
      if (!flags.includes(f)) flags.push(f);
    }
  }

  const careerTier = getTierForFollowers(stats.followers);
  const logEntry: LogEntry = {
    week: state.week,
    text: `Purchased ${item.name}`,
    type: "system",
    emoji: item.emoji,
  };

  return {
    ...state,
    stats,
    flags,
    purchases,
    careerTier,
    log: [...state.log, logEntry],
  };
}

/** Advance to the next week. Applies per-turn pressure mechanics. */
export function advanceWeek(state: GameState): GameState {
  const stats = { ...state.stats };
  let flags = [...state.flags];

  // Decay risk level
  const riskLevel = clamp(state.riskLevel - RISK_DECAY_PER_TURN, 0, 100);

  // ---- Quarterly Income (calculated before recovery) ----
  const income = calculateQuarterlyIncome(state);
  stats.money += income.net;

  // ---- Per-turn recovery (with purchase bonuses) ----
  const passive = computePassiveEffects(state.purchases);
  const energyBonus = passive.energyRecoveryBonus || 0;
  const mentalBonus = passive.mentalHealthRecoveryBonus || 0;
  stats.energy = clamp(stats.energy + ENERGY_RECOVERY + energyBonus, 0, 100);
  stats.mentalHealth = clamp(stats.mentalHealth + MENTAL_HEALTH_RECOVERY + mentalBonus, 0, 100);

  // ---- Overexposure pressure: high fame drains mental health ----
  if (stats.fame > 75 && state.stats.followers > 500_000) {
    stats.mentalHealth = clamp(stats.mentalHealth - 5, 0, 100);
  }
  // Moderate fame pressure (creates mid-game tension)
  else if (stats.fame > 55 && state.stats.followers > 200_000) {
    stats.mentalHealth = clamp(stats.mentalHealth - 2, 0, 100);
  }

  // ---- Auto-flag: burnoutRisk when mental health or energy chronically low ----
  if (stats.mentalHealth < 25 || stats.energy < 20) {
    if (!flags.includes("burnoutRisk")) flags.push("burnoutRisk");
  } else if (stats.mentalHealth > 60 && stats.energy > 50) {
    flags = flags.filter(f => f !== "burnoutRisk");
  }

  // ---- Auto-flag: controversial when scandals pile up ----
  if (state.scandals >= 3 && !flags.includes("controversial")) {
    flags.push("controversial");
  }

  // ---- Auto-flag: scandalMagnet at 5+ scandals ----
  if (state.scandals >= 5 && !flags.includes("scandalMagnet")) {
    flags.push("scandalMagnet");
  }

  const newWeek = state.week + 1;
  const nextState = { ...state, stats, flags, week: newWeek };
  const gameOverReason = checkGameOver(nextState);

  // Income log entry
  const logEntries: LogEntry[] = [];
  if (income.net !== 0) {
    logEntries.push({
      week: newWeek,
      text: income.net >= 0
        ? `Earned $${income.net.toLocaleString()} this quarter`
        : `Lost $${Math.abs(income.net).toLocaleString()} in expenses`,
      type: "system",
      emoji: income.net >= 0 ? "\uD83D\uDCB0" : "\uD83D\uDCC9",
    });
  }

  return {
    ...state,
    stats,
    flags,
    week: newWeek,
    riskLevel,
    phase: gameOverReason ? "game_over" : "activity",
    gameOverReason,
    quarterlyIncome: income,
    currentEvent: null,
    currentChoiceResult: null,
    pendingBoost: null,
    pendingMilestones: [],
    log: [...state.log, ...logEntries],
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
