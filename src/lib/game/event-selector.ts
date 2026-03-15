import { archetypes } from "@/data/archetypes";
import { GameEvent, GameState, EventCategory } from "./types";
import { isTierAtLeast, isTierAtMost } from "./progression";
import { weightedRandom } from "./random";

interface ScoredEvent {
  event: GameEvent;
  weight: number;
}

/** Check if a game event is eligible given the current state. */
function isEligible(event: GameEvent, state: GameState): boolean {
  // Career tier gate
  if (event.minTier && !isTierAtLeast(state.careerTier, event.minTier)) return false;
  if (event.maxTier && !isTierAtMost(state.careerTier, event.maxTier)) return false;

  // Flag requirements
  if (event.requiredFlags?.some((f) => !state.flags.includes(f))) return false;
  if (event.excludedFlags?.some((f) => state.flags.includes(f))) return false;

  // Stat conditions
  if (event.statConditions) {
    for (const [key, cond] of Object.entries(event.statConditions)) {
      const val = state.stats[key as keyof typeof state.stats];
      if (cond.min !== undefined && val < cond.min) return false;
      if (cond.max !== undefined && val > cond.max) return false;
    }
  }

  // Chain step check: if event is part of a chain, only eligible if chain is at the right step
  if (event.chainId && event.chainStep !== undefined) {
    const currentStep = state.activeChains[event.chainId] ?? 0;
    if (event.chainStep !== currentStep) return false;
  }

  return true;
}

/** Score an event given the state and archetype. */
function scoreEvent(event: GameEvent, state: GameState): number {
  let weight = event.weight;

  // Archetype modifier
  const arch = archetypes.find((a) => a.id === state.archetype);
  if (arch?.eventWeightModifiers[event.type]) {
    weight *= arch.eventWeightModifiers[event.type]!;
  }

  // Anti-repetition penalty
  if (state.recentEventIds.includes(event.id)) {
    weight *= 0.05;
  }

  // Chain events get a boost when they're eligible (they already passed the step check)
  if (event.chainId) {
    weight *= 2.5;
  }

  // Drama boost when things are going too well (creates drama)
  if (state.stats.fame > 60 && state.stats.reputation > 60) {
    if (event.type === "drama" || event.type === "failure") {
      weight *= 1.5;
    }
  }

  // Recovery boost when struggling
  if (state.stats.mentalHealth < 30 || state.stats.reputation < 30) {
    if (event.type === "recovery") {
      weight *= 2.0;
    }
  }

  // Viral boost for low-follower players (keep early game exciting)
  if (state.stats.followers < 10000 && event.type === "viral") {
    weight *= 1.4;
  }

  // Celebrity boost for high-fame players
  if (state.stats.fame > 50 && event.type === "celebrity") {
    weight *= 1.3;
  }

  // Prevent too many of the same category in a row
  const recentTypes = state.log.slice(-3).map(l => l.type as string);
  const eventTypeCount = recentTypes.filter(t => t === event.type).length;
  if (eventTypeCount >= 2) {
    weight *= 0.3;
  }

  return Math.max(weight, 0.01);
}

/** Select one random event from all available events. */
export function selectEvent(
  allEvents: GameEvent[],
  state: GameState,
): GameEvent {
  const eligible = allEvents.filter((e) => isEligible(e, state));

  if (eligible.length === 0) {
    // Fallback: return any event ignoring chain conditions
    const fallback = allEvents.filter(e => !e.chainId || e.chainStep === 0);
    const scored: ScoredEvent[] = fallback.map((event) => ({
      event,
      weight: scoreEvent(event, state),
    }));
    return weightedRandom(scored).event;
  }

  const scored: ScoredEvent[] = eligible.map((event) => ({
    event,
    weight: scoreEvent(event, state),
  }));

  return weightedRandom(scored).event;
}
