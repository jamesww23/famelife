/**
 * Trait–Archetype Synergy System (Hidden Buffs)
 *
 * Each Background Trait provides passive bonuses that vary depending on the
 * chosen Archetype/Profession. These are never shown to the player — they
 * just feel the difference across playthroughs.
 *
 * Three layers of synergy:
 * 1. Stat multipliers — boost gains, protect against losses
 * 2. Income bonuses — boost specific revenue streams
 * 3. Event affinity — shift which event types appear more/less often
 */

import { ArchetypeId, TraitId, StatEffects, EventCategory, CareerPhase } from "./types";

export interface SynergyBonus {
  // --- Stat multipliers (applied to events + activities) ---
  /** Multiplier on follower gains (positive effects only) */
  followerGain?: number;
  /** Multiplier on money gains (positive effects only) */
  moneyGain?: number;
  /** Multiplier on fame gains (positive effects only) */
  fameGain?: number;
  /** Multiplier on reputation gains (positive effects only) */
  reputationGain?: number;
  /** Reduction to reputation losses (0.2 = 20% less damage) */
  reputationProtection?: number;
  /** Reduction to mental health losses */
  mentalProtection?: number;
  /** Bonus energy recovery per turn */
  energyRecovery?: number;
  /** Bonus mental health recovery per turn */
  mentalRecovery?: number;

  // --- Income stream bonuses (applied in income.ts) ---
  /** Multiplier on ad revenue (0.2 = +20%) */
  adRevenueBonus?: number;
  /** Multiplier on sponsorship income */
  sponsorshipBonus?: number;
  /** Multiplier on donation/livestream income */
  donationBonus?: number;
  /** Multiplier on subscription income */
  subscriptionBonus?: number;
  /** Flat quarterly income bonus */
  flatIncomeBonus?: number;

  // --- Event affinity (applied in event-selector.ts) ---
  /** Weight multipliers for specific event types */
  eventAffinity?: Partial<Record<EventCategory, number>>;

  // --- Phase unlock bonuses (stronger effects that activate at certain phases) ---
  /** Extra bonuses that activate at a career phase */
  phaseBonus?: {
    phase: CareerPhase;
    followerGain?: number;
    moneyGain?: number;
    fameGain?: number;
    reputationGain?: number;
    incomeBonus?: number;
  };
}

/**
 * Synergy matrix: trait → archetype → bonuses.
 * Each combination is unique, rewarding players who discover good combos.
 */
const SYNERGY_MAP: Record<TraitId, Record<ArchetypeId, SynergyBonus>> = {
  // ================================================================
  // RICH FAMILY — money advantages, brand connections, PR protection
  // ================================================================
  rich_family: {
    beauty: {
      moneyGain: 0.20, followerGain: 0.10,
      sponsorshipBonus: 0.25,                                       // family brand connections
      eventAffinity: { brand: 1.3, drama: 0.85 },                  // brands love you, less drama
      phaseBonus: { phase: "breakout", moneyGain: 0.15, incomeBonus: 2000 },
    },
    lifestyle: {
      followerGain: 0.15, moneyGain: 0.10,
      adRevenueBonus: 0.15,                                         // better production value
      eventAffinity: { lifestyle: 1.2, celebrity: 1.15 },           // luxury content opens doors
      phaseBonus: { phase: "famous", followerGain: 0.12, incomeBonus: 3000 },
    },
    comedy: {
      fameGain: 0.12, moneyGain: 0.08,
      adRevenueBonus: 0.12,                                         // invest in production quality
      eventAffinity: { brand: 1.15 },                               // brand-safe comedy
      phaseBonus: { phase: "breakout", moneyGain: 0.20 },
    },
    drama: {
      reputationProtection: 0.15, moneyGain: 0.10,
      sponsorshipBonus: 0.10,                                        // some connections survive drama
      eventAffinity: { drama: 0.9, brand: 1.1 },                    // family PR team dampens drama
      phaseBonus: { phase: "famous", moneyGain: 0.18 },
    },
    gaming: {
      moneyGain: 0.18, followerGain: 0.08,
      donationBonus: 0.20, subscriptionBonus: 0.15,                  // best setup money can buy
      eventAffinity: { brand: 1.2 },                                 // tech brand connections
      phaseBonus: { phase: "breakout", incomeBonus: 2500 },
    },
    fitness: {
      moneyGain: 0.12, reputationGain: 0.10,
      sponsorshipBonus: 0.20,                                        // premium brand partnerships
      eventAffinity: { brand: 1.25, lifestyle: 1.1 },               // luxury fitness brands
      phaseBonus: { phase: "famous", incomeBonus: 3000 },
    },
  },

  // ================================================================
  // STREET SMART — hustle, negotiation, survival instincts
  // ================================================================
  street_smart: {
    drama: {
      reputationProtection: 0.22, fameGain: 0.10,
      adRevenueBonus: 0.10,
      eventAffinity: { drama: 1.15, failure: 0.8 },                 // thrives in chaos, avoids failure
      phaseBonus: { phase: "breakout", fameGain: 0.15 },
    },
    comedy: {
      fameGain: 0.15, reputationProtection: 0.10,
      donationBonus: 0.18,                                           // reads the room → better tips
      eventAffinity: { viral: 1.2, failure: 0.85 },                 // street smarts find viral angles
      phaseBonus: { phase: "famous", fameGain: 0.12 },
    },
    gaming: {
      energyRecovery: 3, followerGain: 0.10,
      subscriptionBonus: 0.20,                                       // efficient grinder, loyal subs
      eventAffinity: { platform: 1.15, failure: 0.85 },             // knows how to game the system
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    beauty: {
      moneyGain: 0.15, reputationGain: 0.08,
      sponsorshipBonus: 0.15,                                        // hard negotiator on deals
      eventAffinity: { brand: 1.2 },                                 // negotiation skills
      phaseBonus: { phase: "famous", moneyGain: 0.15 },
    },
    lifestyle: {
      mentalRecovery: 3, reputationGain: 0.10,
      adRevenueBonus: 0.12,
      eventAffinity: { recovery: 1.2, drama: 0.9 },                 // resilient, avoids unnecessary drama
      phaseBonus: { phase: "breakout", followerGain: 0.12 },
    },
    fitness: {
      reputationGain: 0.15, fameGain: 0.08,
      subscriptionBonus: 0.15,                                       // disciplined hustle
      eventAffinity: { brand: 1.15, viral: 1.1 },                   // street-credible fitness content
      phaseBonus: { phase: "famous", fameGain: 0.12 },
    },
  },

  // ================================================================
  // NATURAL TALENT — born to shine, faster growth, viral magnetism
  // ================================================================
  natural_talent: {
    comedy: {
      followerGain: 0.22, fameGain: 0.12,
      adRevenueBonus: 0.15,
      eventAffinity: { viral: 1.35, celebrity: 1.15 },              // viral magnet
      phaseBonus: { phase: "emerging", followerGain: 0.18, fameGain: 0.10 },
    },
    beauty: {
      fameGain: 0.18, followerGain: 0.10,
      sponsorshipBonus: 0.15,
      eventAffinity: { celebrity: 1.25, lifestyle: 1.1 },           // born to be seen
      phaseBonus: { phase: "breakout", fameGain: 0.15 },
    },
    lifestyle: {
      followerGain: 0.18, fameGain: 0.08,
      donationBonus: 0.15,
      eventAffinity: { viral: 1.2, celebrity: 1.15 },               // magnetic personality
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    drama: {
      fameGain: 0.15, followerGain: 0.10,
      adRevenueBonus: 0.12,
      eventAffinity: { viral: 1.2, drama: 1.1 },                    // captivating storyteller
      phaseBonus: { phase: "famous", fameGain: 0.18 },
    },
    gaming: {
      followerGain: 0.20, fameGain: 0.10,
      donationBonus: 0.20, subscriptionBonus: 0.10,                  // naturally entertaining streams
      eventAffinity: { viral: 1.25, platform: 1.1 },                // algorithm loves natural talent
      phaseBonus: { phase: "emerging", followerGain: 0.20 },
    },
    fitness: {
      fameGain: 0.12, followerGain: 0.15,
      sponsorshipBonus: 0.12,
      eventAffinity: { viral: 1.2, brand: 1.1 },                    // photogenic results go viral
      phaseBonus: { phase: "breakout", fameGain: 0.15, followerGain: 0.10 },
    },
  },

  // ================================================================
  // HARD WORKER — grindset, stamina, consistency beats talent
  // ================================================================
  hard_worker: {
    fitness: {
      energyRecovery: 4, followerGain: 0.15,
      subscriptionBonus: 0.20,                                       // peak grindset synergy
      eventAffinity: { recovery: 0.7, viral: 1.15 },                // doesn't need recovery, earns viral
      phaseBonus: { phase: "breakout", followerGain: 0.18, incomeBonus: 1500 },
    },
    gaming: {
      followerGain: 0.18, energyRecovery: 2,
      donationBonus: 0.18, subscriptionBonus: 0.15,                  // marathon streamer
      eventAffinity: { platform: 1.2, viral: 1.1 },                 // grind gets noticed by algorithm
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    comedy: {
      fameGain: 0.12, energyRecovery: 2,
      adRevenueBonus: 0.15,
      eventAffinity: { viral: 1.15, failure: 0.9 },                 // quantity breeds quality
      phaseBonus: { phase: "famous", fameGain: 0.15 },
    },
    beauty: {
      moneyGain: 0.15, followerGain: 0.10,
      adRevenueBonus: 0.12, sponsorshipBonus: 0.10,                  // consistent uploads pay off
      eventAffinity: { brand: 1.2 },                                 // brands love consistency
      phaseBonus: { phase: "breakout", moneyGain: 0.15 },
    },
    lifestyle: {
      followerGain: 0.12, fameGain: 0.08,
      adRevenueBonus: 0.15,
      eventAffinity: { lifestyle: 1.15, platform: 1.1 },            // daily vlogger hustle
      phaseBonus: { phase: "famous", followerGain: 0.12, incomeBonus: 2000 },
    },
    drama: {
      fameGain: 0.10, energyRecovery: 2,
      adRevenueBonus: 0.10,
      eventAffinity: { drama: 1.15, viral: 1.1 },                   // relentless researcher
      phaseBonus: { phase: "breakout", fameGain: 0.12 },
    },
  },

  // ================================================================
  // THICK SKIN — mental fortress, drama-proof, late-game survivor
  // ================================================================
  thick_skin: {
    drama: {
      mentalProtection: 0.25, reputationProtection: 0.15,
      adRevenueBonus: 0.08,
      eventAffinity: { drama: 1.25, failure: 0.75 },                // born for drama, immune to failure
      phaseBonus: { phase: "famous", fameGain: 0.15, moneyGain: 0.10 },
    },
    comedy: {
      mentalProtection: 0.15, reputationProtection: 0.12,
      donationBonus: 0.12,
      eventAffinity: { viral: 1.15, failure: 0.85 },                // handles bombed jokes, tries again
      phaseBonus: { phase: "breakout", fameGain: 0.12 },
    },
    gaming: {
      mentalRecovery: 4, mentalProtection: 0.12,
      subscriptionBonus: 0.15,
      eventAffinity: { platform: 1.15, drama: 0.85 },               // shrugs off toxicity
      phaseBonus: { phase: "breakout", followerGain: 0.12 },
    },
    beauty: {
      reputationGain: 0.12, mentalProtection: 0.10,
      sponsorshipBonus: 0.10,
      eventAffinity: { brand: 1.15, drama: 0.9 },                   // ignores haters, stays brand-safe
      phaseBonus: { phase: "famous", moneyGain: 0.12 },
    },
    lifestyle: {
      mentalRecovery: 4, mentalProtection: 0.15,
      adRevenueBonus: 0.10,
      eventAffinity: { recovery: 0.7, lifestyle: 1.2 },             // zen creator, doesn't need recovery
      phaseBonus: { phase: "famous", followerGain: 0.12 },
    },
    fitness: {
      reputationGain: 0.12, mentalRecovery: 2,
      subscriptionBonus: 0.12,
      eventAffinity: { brand: 1.15, failure: 0.85 },                // disciplined, unshakeable
      phaseBonus: { phase: "breakout", reputationGain: 0.10 },      // reputation snowball
    },
  },

  // ================================================================
  // SOCIAL BUTTERFLY — networking, community, word-of-mouth growth
  // ================================================================
  social_butterfly: {
    lifestyle: {
      followerGain: 0.22, fameGain: 0.12,
      donationBonus: 0.18, subscriptionBonus: 0.12,                  // networking superpower
      eventAffinity: { celebrity: 1.25, lifestyle: 1.15 },           // everyone invites you
      phaseBonus: { phase: "breakout", followerGain: 0.18, fameGain: 0.10 },
    },
    beauty: {
      fameGain: 0.18, followerGain: 0.12,
      sponsorshipBonus: 0.18,                                        // connections = brand deals
      eventAffinity: { brand: 1.2, celebrity: 1.15 },               // social scene opens brand doors
      phaseBonus: { phase: "famous", moneyGain: 0.15 },
    },
    comedy: {
      followerGain: 0.18, reputationGain: 0.08,
      donationBonus: 0.15,
      eventAffinity: { viral: 1.2, celebrity: 1.1 },                // word of mouth king
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    drama: {
      followerGain: 0.12, fameGain: 0.10,
      adRevenueBonus: 0.10,
      eventAffinity: { drama: 1.15, celebrity: 1.15 },              // everyone knows the tea
      phaseBonus: { phase: "famous", fameGain: 0.12 },
    },
    gaming: {
      fameGain: 0.12, followerGain: 0.10,
      donationBonus: 0.20,                                           // community builder, loyal tippers
      eventAffinity: { platform: 1.15, viral: 1.1 },                // collabs and raids
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    fitness: {
      followerGain: 0.18, reputationGain: 0.10,
      subscriptionBonus: 0.18,                                       // workout buddies become subs
      eventAffinity: { brand: 1.15, lifestyle: 1.15 },              // fitness social circle
      phaseBonus: { phase: "breakout", followerGain: 0.15, fameGain: 0.08 },
    },
  },
};

/** Get the synergy bonus for a trait+archetype combo. */
export function getSynergyBonus(traitId: TraitId, archetypeId: ArchetypeId): SynergyBonus {
  return SYNERGY_MAP[traitId]?.[archetypeId] ?? {};
}

/**
 * Apply synergy multipliers to stat effects.
 * Only boosts gains (positive values) — doesn't make losses worse.
 * Protection values reduce losses (negative values become less negative).
 * Phase bonuses stack on top when the player reaches the required phase.
 */
export function applySynergyToEffects(
  effects: StatEffects,
  synergy: SynergyBonus,
  currentPhase?: CareerPhase,
): StatEffects {
  const result = { ...effects };

  // Combine base + phase bonuses
  let followerMul = synergy.followerGain ?? 0;
  let moneyMul = synergy.moneyGain ?? 0;
  let fameMul = synergy.fameGain ?? 0;

  let repMul = synergy.reputationGain ?? 0;

  if (currentPhase && synergy.phaseBonus && isPhaseReached(currentPhase, synergy.phaseBonus.phase)) {
    followerMul += synergy.phaseBonus.followerGain ?? 0;
    moneyMul += synergy.phaseBonus.moneyGain ?? 0;
    fameMul += synergy.phaseBonus.fameGain ?? 0;
    repMul += synergy.phaseBonus.reputationGain ?? 0;
  }

  // Boost gains
  if (followerMul && result.followers && result.followers > 0) {
    result.followers = Math.round(result.followers * (1 + followerMul));
  }
  if (moneyMul && result.money && result.money > 0) {
    result.money = Math.round(result.money * (1 + moneyMul));
  }
  if (fameMul && result.fame && result.fame > 0) {
    result.fame = Math.round(result.fame * (1 + fameMul));
  }
  if (repMul && result.reputation && result.reputation > 0) {
    result.reputation = Math.round(result.reputation * (1 + repMul));
  }

  // Protect against losses
  if (synergy.reputationProtection && result.reputation && result.reputation < 0) {
    result.reputation = Math.round(result.reputation * (1 - synergy.reputationProtection));
  }
  if (synergy.mentalProtection && result.mentalHealth && result.mentalHealth < 0) {
    result.mentalHealth = Math.round(result.mentalHealth * (1 - synergy.mentalProtection));
  }

  return result;
}

/**
 * Get the event weight multiplier for a given event type from synergy.
 * Returns 1.0 (no change) if no affinity defined.
 */
export function getSynergyEventWeight(
  synergy: SynergyBonus,
  eventType: EventCategory,
): number {
  return synergy.eventAffinity?.[eventType] ?? 1.0;
}

/**
 * Get the income multiplier for a specific income stream from synergy.
 * Also includes phase-based flat income bonus.
 */
export function getSynergyIncomeBonus(
  synergy: SynergyBonus,
  currentPhase?: CareerPhase,
): {
  adRevenue: number;
  sponsorships: number;
  donations: number;
  subscriptions: number;
  flatBonus: number;
} {
  let flatBonus = synergy.flatIncomeBonus ?? 0;
  if (currentPhase && synergy.phaseBonus && isPhaseReached(currentPhase, synergy.phaseBonus.phase)) {
    flatBonus += synergy.phaseBonus.incomeBonus ?? 0;
  }

  return {
    adRevenue: synergy.adRevenueBonus ?? 0,
    sponsorships: synergy.sponsorshipBonus ?? 0,
    donations: synergy.donationBonus ?? 0,
    subscriptions: synergy.subscriptionBonus ?? 0,
    flatBonus,
  };
}

/** Phase ordering for comparison */
const PHASE_ORDER: CareerPhase[] = [
  "early_creator", "emerging", "breakout", "famous", "celebrity", "empire",
];

function isPhaseReached(current: CareerPhase, required: CareerPhase): boolean {
  return PHASE_ORDER.indexOf(current) >= PHASE_ORDER.indexOf(required);
}
