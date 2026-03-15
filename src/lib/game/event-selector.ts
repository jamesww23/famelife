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

  return true;
}

/** Score an event given the state, action bias, and archetype. */
function scoreEvent(
  event: GameEvent,
  state: GameState,
  actionBias?: Partial<Record<EventCategory, number>>
): number {
  let weight = event.weight;

  // Archetype modifier
  const arch = archetypes.find((a) => a.id === state.archetype);
  if (arch?.eventWeightModifiers[event.type]) {
    weight *= arch.eventWeightModifiers[event.type]!;
  }

  // Action bias
  if (actionBias?.[event.type]) {
    weight *= actionBias[event.type]!;
  }

  // Anti-repetition penalty
  if (state.recentEventIds.includes(event.id)) {
    weight *= 0.1;
  }

  // Chaos: slightly boost drama/failure when things are going too well
  if (state.stats.fame > 60 && state.stats.reputation > 60) {
    if (event.type === "drama" || event.type === "failure") {
      weight *= 1.3;
    }
  }

  // Boost recovery when struggling
  if (state.stats.mentalHealth < 30 || state.stats.reputation < 30) {
    if (event.type === "recovery") {
      weight *= 1.5;
    }
  }

  return Math.max(weight, 0.01);
}

/** Select one random event from all available events. */
export function selectEvent(
  allEvents: GameEvent[],
  state: GameState,
  actionBias?: Partial<Record<EventCategory, number>>
): GameEvent {
  const eligible = allEvents.filter((e) => isEligible(e, state));

  if (eligible.length === 0) {
    // Fallback: return any event ignoring conditions
    const scored: ScoredEvent[] = allEvents.map((event) => ({
      event,
      weight: scoreEvent(event, state, actionBias),
    }));
    return weightedRandom(scored).event;
  }

  const scored: ScoredEvent[] = eligible.map((event) => ({
    event,
    weight: scoreEvent(event, state, actionBias),
  }));

  return weightedRandom(scored).event;
}
