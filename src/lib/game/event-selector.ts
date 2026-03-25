import { archetypes } from "@/data/archetypes";
import { GameEvent, GameState, EventCategory } from "./types";
import { isTierAtLeast, isTierAtMost, getPhaseForState, isPhaseAtLeast, isPhaseAtMost } from "./progression";
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

  // Career phase gate
  const phase = getPhaseForState(state);
  if (event.minPhase && !isPhaseAtLeast(phase, event.minPhase)) return false;
  if (event.maxPhase && !isPhaseAtMost(phase, event.maxPhase)) return false;

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
  const phase = getPhaseForState(state);

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

  // ---- Phase-based weighting ----

  // Empire events get huge boost when in empire phase
  if (phase === "empire" && event.type === "empire") {
    weight *= 2.0;
  }
  // Celebrity events boost in celebrity/empire phases
  if ((phase === "celebrity" || phase === "empire") && event.type === "celebrity") {
    weight *= 1.5;
  }
  // Brand events boost in breakout/famous phases (prime sponsorship era)
  if ((phase === "breakout" || phase === "famous") && event.type === "brand") {
    weight *= 1.3;
  }
  // Early-phase viral boost (getting discovered)
  if ((phase === "early_creator" || phase === "emerging") && event.type === "viral") {
    weight *= 1.4;
  }

  // ---- Flag-based dynamic weighting ----
  // Track per-type multipliers separately to cap stacking
  let dramaMultiplier = 1.0;
  let failureMultiplier = 1.0;

  // Feud consequences: more drama/failure events when feuding
  if (state.flags.includes("startedFeud")) {
    if (event.type === "drama") dramaMultiplier += 0.5;
    if (event.type === "failure") failureMultiplier += 0.25;
  }

  // Public relationship: more lifestyle events, paparazzi risk
  if (state.flags.includes("publicRelationship")) {
    if (event.type === "lifestyle") weight *= 1.3;
    if (event.type === "celebrity") weight *= 1.15;
  }

  // Controversial: more drama and failure
  if (state.flags.includes("controversial")) {
    if (event.type === "drama") dramaMultiplier += 0.4;
    if (event.type === "failure") failureMultiplier += 0.3;
    if (event.type === "brand") weight *= 0.6; // brands avoid controversy
  }

  // Brand safe: more brand opportunities
  if (state.flags.includes("brandSafe")) {
    if (event.type === "brand") weight *= 1.4;
  }

  // Burnout risk: more failure/recovery events
  if (state.flags.includes("burnoutRisk")) {
    if (event.type === "failure") failureMultiplier += 0.4;
    if (event.type === "recovery") weight *= 1.6;
    if (event.type === "viral") weight *= 0.5; // hard to go viral when burning out
  }

  // Has manager: more celebrity and brand opportunities
  if (state.flags.includes("hasManager")) {
    if (event.type === "celebrity") weight *= 1.3;
    if (event.type === "brand") weight *= 1.2;
    if (event.type === "empire") weight *= 1.3;
  }

  // Scandal magnet: attracts drama (additive, not multiplicative)
  if (state.flags.includes("scandalMagnet")) {
    if (event.type === "drama") dramaMultiplier += 0.5;
  }

  // Industry respected: more celebrity and empire events
  if (state.flags.includes("industryRespected")) {
    if (event.type === "celebrity") weight *= 1.25;
    if (event.type === "empire") weight *= 1.3;
  }

  // Owns studio: empire events heavily boosted
  if (state.flags.includes("ownsStudio")) {
    if (event.type === "empire") weight *= 1.6;
  }

  // Apply capped drama/failure multipliers (max 2.5x to prevent snowball)
  if (event.type === "drama") weight *= Math.min(dramaMultiplier, 2.5);
  if (event.type === "failure") weight *= Math.min(failureMultiplier, 2.0);

  // ---- Dynamic state-based boosts ----

  // Overexposure: drama/failure boost when fame AND followers very high
  if (state.stats.fame > 70 && state.stats.followers > 500_000) {
    if (event.type === "drama" || event.type === "failure") {
      weight *= 1.3;
    }
  }

  // Recovery boost when struggling
  if (state.stats.mentalHealth < 30 || state.stats.reputation < 30) {
    if (event.type === "recovery") {
      weight *= 1.8;
    }
  }

  // Viral boost for low-follower players (keep early game exciting)
  if (state.stats.followers < 10000 && event.type === "viral") {
    weight *= 1.3;
  }

  // Celebrity boost for high-fame players
  if (state.stats.fame > 50 && event.type === "celebrity") {
    weight *= 1.2;
  }

  // Prevent too many of the same category in a row
  const recentTypes = state.log.slice(-3).map(l => l.type as string);
  const eventTypeCount = recentTypes.filter(t => t === event.type).length;
  if (eventTypeCount >= 2) {
    weight *= 0.25;
  }

  // ---- Risk level amplification ----
  // High risk level attracts more volatile events
  if (state.riskLevel > 30) {
    const riskMul = 1 + (state.riskLevel - 30) * 0.015; // up to 1.0x extra at max risk
    if (event.type === "drama" || event.type === "failure") {
      weight *= riskMul;
    }
    // Also boost high-reward events at high risk
    if (event.type === "celebrity" || event.type === "empire") {
      weight *= 1 + (state.riskLevel - 30) * 0.008;
    }
  }

  // ---- Chaos injection: small chance of wild card events ----
  // 6% chance to boost a random drama/failure/celebrity event
  if (Math.random() < 0.06) {
    if (event.type === "drama" || event.type === "celebrity" || event.type === "failure") {
      weight *= 2.0;
    }
  }

  return Math.max(weight, 0.01);
}

/** Check eligibility with relaxed rules (ignores stat conditions, keeps tier/phase/flag gates). */
function isEligibleRelaxed(event: GameEvent, state: GameState): boolean {
  // Still respect tier gates
  if (event.minTier && !isTierAtLeast(state.careerTier, event.minTier)) return false;
  if (event.maxTier && !isTierAtMost(state.careerTier, event.maxTier)) return false;

  // Still respect phase gates
  const phase = getPhaseForState(state);
  if (event.minPhase && !isPhaseAtLeast(phase, event.minPhase)) return false;
  if (event.maxPhase && !isPhaseAtMost(phase, event.maxPhase)) return false;

  // Skip chain events (they have complex gating)
  if (event.chainId) return false;

  // Skip flag-gated events (don't show impossible storylines)
  if (event.requiredFlags?.some((f) => !state.flags.includes(f))) return false;
  if (event.excludedFlags?.some((f) => state.flags.includes(f))) return false;

  // Relaxed: ignore stat conditions
  return true;
}

/** Last-resort fallback: only basic non-chain, non-gated events. */
const SAFE_FALLBACK_TYPES: EventCategory[] = ["viral", "platform", "lifestyle", "recovery"];

function isSafeFallback(event: GameEvent): boolean {
  return (
    !event.chainId &&
    !event.requiredFlags?.length &&
    !event.minTier &&
    !event.minPhase &&
    SAFE_FALLBACK_TYPES.includes(event.type)
  );
}

/** Select one random event from all available events. */
export function selectEvent(
  allEvents: GameEvent[],
  state: GameState,
): GameEvent {
  // Primary: fully eligible events
  const eligible = allEvents.filter((e) => isEligible(e, state));

  if (eligible.length > 0) {
    const scored: ScoredEvent[] = eligible.map((event) => ({
      event,
      weight: scoreEvent(event, state),
    }));
    return weightedRandom(scored).event;
  }

  // Fallback 1: relax stat conditions but keep tier/phase/flag gates
  const relaxed = allEvents.filter((e) => isEligibleRelaxed(e, state));
  if (relaxed.length > 0) {
    const scored: ScoredEvent[] = relaxed.map((event) => ({
      event,
      weight: scoreEvent(event, state),
    }));
    return weightedRandom(scored).event;
  }

  // Fallback 2: safe, ungated events only (should always have candidates)
  const safe = allEvents.filter(isSafeFallback);
  const scored: ScoredEvent[] = safe.map((event) => ({
    event,
    weight: scoreEvent(event, state),
  }));
  return weightedRandom(scored).event;
}
