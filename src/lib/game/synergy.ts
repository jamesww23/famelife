/**
 * Trait–Archetype Synergy System (Hidden Buffs & Debuffs)
 *
 * Each Background Trait provides passive bonuses AND penalties that vary
 * depending on the chosen Archetype/Profession. These are never shown to
 * the player — they just feel each combo plays differently.
 *
 * Four layers of synergy:
 * 1. Stat buffs — boost gains, protect against losses
 * 2. Stat debuffs — reduce certain gains, amplify certain losses
 * 3. Income bonuses/penalties — boost or reduce specific revenue streams
 * 4. Event affinity — shift which event types appear more/less often
 * 5. Phase unlock bonuses — power spikes at career milestones
 */

import { ArchetypeId, TraitId, StatEffects, EventCategory, CareerPhase } from "./types";

export interface SynergyBonus {
  // --- Stat BUFFS (applied to events + activities) ---
  followerGain?: number;
  moneyGain?: number;
  fameGain?: number;
  reputationGain?: number;
  reputationProtection?: number;
  mentalProtection?: number;
  energyRecovery?: number;
  mentalRecovery?: number;

  // --- Stat DEBUFFS (negative values = penalties) ---
  /** Reduces follower gains (-0.10 = -10% follower gains) */
  followerPenalty?: number;
  /** Reduces money gains */
  moneyPenalty?: number;
  /** Reduces fame gains */
  famePenalty?: number;
  /** Reduces reputation gains */
  reputationPenalty?: number;
  /** Amplifies reputation losses (-0.15 = 15% more rep damage) */
  reputationVulnerability?: number;
  /** Amplifies mental health losses */
  mentalVulnerability?: number;
  /** Reduces energy recovery per turn */
  energyDrain?: number;
  /** Reduces mental health recovery per turn */
  mentalDrain?: number;

  // --- Income stream bonuses (positive) or penalties (negative) ---
  adRevenueBonus?: number;
  sponsorshipBonus?: number;
  donationBonus?: number;
  subscriptionBonus?: number;
  flatIncomeBonus?: number;

  // --- Event affinity ---
  eventAffinity?: Partial<Record<EventCategory, number>>;

  // --- Phase unlock bonuses ---
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
 * Full synergy matrix with buffs AND debuffs for all 36 combos.
 * Every combo has a meaningful trade-off — no free rides.
 */
const SYNERGY_MAP: Record<TraitId, Record<ArchetypeId, SynergyBonus>> = {
  // ================================================================
  // RICH FAMILY — money advantages, brand connections
  // Weakness: seen as privileged/inauthentic, pressure to maintain image
  // ================================================================
  rich_family: {
    beauty: {
      moneyGain: 0.20, followerGain: 0.10,
      sponsorshipBonus: 0.25,
      mentalVulnerability: 0.12,                                     // pressure to maintain perfect image
      mentalDrain: 1,                                                 // constant anxiety about appearance
      eventAffinity: { brand: 1.3, drama: 0.85 },
      phaseBonus: { phase: "breakout", moneyGain: 0.15, incomeBonus: 2000 },
    },
    lifestyle: {
      followerGain: 0.15, moneyGain: 0.10,
      adRevenueBonus: 0.15,
      reputationPenalty: 0.12,                                       // people think success is handed to you
      eventAffinity: { lifestyle: 1.2, celebrity: 1.15, drama: 1.1 }, // privilege invites jealousy
      phaseBonus: { phase: "famous", followerGain: 0.12, incomeBonus: 3000 },
    },
    comedy: {
      fameGain: 0.12, moneyGain: 0.08,
      adRevenueBonus: 0.12,
      reputationPenalty: 0.10,                                       // "rich kid comedy" doesn't land the same
      followerPenalty: 0.08,                                         // relatable? not really
      eventAffinity: { brand: 1.15, viral: 0.9 },                   // harder to go viral as rich comedian
      phaseBonus: { phase: "breakout", moneyGain: 0.20 },
    },
    drama: {
      reputationProtection: 0.15, moneyGain: 0.10,
      sponsorshipBonus: 0.10,
      followerPenalty: 0.12,                                         // audiences distrust rich drama creators
      famePenalty: 0.08,                                             // "easy for you to stir drama from a mansion"
      eventAffinity: { drama: 0.9, brand: 1.1, failure: 1.15 },     // privilege makes failures more public
      phaseBonus: { phase: "famous", moneyGain: 0.18 },
    },
    gaming: {
      moneyGain: 0.18, followerGain: 0.08,
      donationBonus: 0.20, subscriptionBonus: 0.15,
      famePenalty: 0.10,                                             // "pay-to-win" perception
      reputationPenalty: 0.08,                                       // gaming community distrusts privilege
      eventAffinity: { brand: 1.2, platform: 0.9 },                 // algorithm doesn't care about money
      phaseBonus: { phase: "breakout", incomeBonus: 2500 },
    },
    fitness: {
      moneyGain: 0.12, reputationGain: 0.10,
      sponsorshipBonus: 0.20,
      followerPenalty: 0.08,                                         // "genetics + money" privilege accusations
      mentalVulnerability: 0.10,                                     // high expectations from wealthy background
      eventAffinity: { brand: 1.25, lifestyle: 1.1, drama: 1.1 },   // privilege invites scrutiny
      phaseBonus: { phase: "famous", incomeBonus: 3000 },
    },
  },

  // ================================================================
  // STREET SMART — hustle, negotiation, survival instincts
  // Weakness: rough edges, trust issues, imposter syndrome at top
  // ================================================================
  street_smart: {
    drama: {
      reputationProtection: 0.22, fameGain: 0.10,
      adRevenueBonus: 0.10,
      moneyPenalty: 0.10,                                            // brands wary of street drama
      sponsorshipBonus: -0.10,                                       // sponsors keep distance
      eventAffinity: { drama: 1.15, failure: 0.8, brand: 0.85 },    // hard to get brand deals
      phaseBonus: { phase: "breakout", fameGain: 0.15 },
    },
    comedy: {
      fameGain: 0.15, reputationProtection: 0.10,
      donationBonus: 0.18,
      reputationPenalty: 0.10,                                       // edgy humor crosses lines
      mentalDrain: 1,                                                 // pressure to stay "real"
      eventAffinity: { viral: 1.2, failure: 0.85, drama: 1.1 },     // edginess invites controversy
      phaseBonus: { phase: "famous", fameGain: 0.12 },
    },
    gaming: {
      energyRecovery: 3, followerGain: 0.10,
      subscriptionBonus: 0.20,
      famePenalty: 0.10,                                             // seen as tryhard, not organic
      reputationPenalty: 0.08,                                       // trash talk goes too far
      eventAffinity: { platform: 1.15, failure: 0.85 },
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    beauty: {
      moneyGain: 0.15, reputationGain: 0.08,
      sponsorshipBonus: 0.15,
      followerPenalty: 0.10,                                         // doesn't fit the typical beauty aesthetic
      mentalVulnerability: 0.10,                                     // imposter syndrome in beauty world
      eventAffinity: { brand: 1.2, celebrity: 0.85 },               // excluded from celeb beauty circles
      phaseBonus: { phase: "famous", moneyGain: 0.15 },
    },
    lifestyle: {
      mentalRecovery: 3, reputationGain: 0.10,
      adRevenueBonus: 0.12,
      famePenalty: 0.08,                                             // lifestyle content feels inauthentic
      followerPenalty: 0.06,                                         // audience mismatch
      eventAffinity: { recovery: 1.2, drama: 0.9 },
      phaseBonus: { phase: "breakout", followerGain: 0.12 },
    },
    fitness: {
      reputationGain: 0.15, fameGain: 0.08,
      subscriptionBonus: 0.15,
      mentalDrain: 1,                                                 // always on guard, can't relax
      moneyPenalty: 0.08,                                            // not great at monetizing
      eventAffinity: { brand: 1.15, viral: 1.1 },
      phaseBonus: { phase: "famous", fameGain: 0.12 },
    },
  },

  // ================================================================
  // NATURAL TALENT — born to shine, viral magnetism
  // Weakness: crushing expectations, jealousy from peers, burnout
  // ================================================================
  natural_talent: {
    comedy: {
      followerGain: 0.22, fameGain: 0.12,
      adRevenueBonus: 0.15,
      mentalVulnerability: 0.15,                                     // pressure to always be funny
      mentalDrain: 2,                                                 // "what if people find out I'm not that talented"
      eventAffinity: { viral: 1.35, celebrity: 1.15, failure: 1.15 }, // higher highs, harder falls
      phaseBonus: { phase: "emerging", followerGain: 0.18, fameGain: 0.10 },
    },
    beauty: {
      fameGain: 0.18, followerGain: 0.10,
      sponsorshipBonus: 0.15,
      reputationPenalty: 0.10,                                       // jealousy from peers, seen as effortless
      energyDrain: 1,                                                 // maintaining the "effortless" look is exhausting
      eventAffinity: { celebrity: 1.25, lifestyle: 1.1, drama: 1.1 }, // jealousy breeds drama
      phaseBonus: { phase: "breakout", fameGain: 0.15 },
    },
    lifestyle: {
      followerGain: 0.18, fameGain: 0.08,
      donationBonus: 0.15,
      moneyPenalty: 0.10,                                            // not business-minded, focused on art
      sponsorshipBonus: -0.08,                                       // turns down deals that don't feel right
      eventAffinity: { viral: 1.2, celebrity: 1.15 },
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    drama: {
      fameGain: 0.15, followerGain: 0.10,
      adRevenueBonus: 0.12,
      reputationVulnerability: 0.12,                                 // expected to be above drama — falls harder
      mentalVulnerability: 0.10,                                     // drama hits talented people differently
      eventAffinity: { viral: 1.2, drama: 1.1, failure: 1.1 },      // talent doesn't protect from consequences
      phaseBonus: { phase: "famous", fameGain: 0.18 },
    },
    gaming: {
      followerGain: 0.20, fameGain: 0.10,
      donationBonus: 0.20, subscriptionBonus: 0.10,
      mentalDrain: 2,                                                 // burnout from constant performance expectations
      energyDrain: 1,                                                 // talent doesn't mean limitless energy
      eventAffinity: { viral: 1.25, platform: 1.1, failure: 1.1 },  // high expectations = bigger failures
      phaseBonus: { phase: "emerging", followerGain: 0.20 },
    },
    fitness: {
      fameGain: 0.12, followerGain: 0.15,
      sponsorshipBonus: 0.12,
      moneyPenalty: 0.10,                                            // focused on content, not business
      reputationPenalty: 0.08,                                       // "gifted genetics" undermines credibility
      eventAffinity: { viral: 1.2, brand: 1.1 },
      phaseBonus: { phase: "breakout", fameGain: 0.15, followerGain: 0.10 },
    },
  },

  // ================================================================
  // HARD WORKER — grindset, stamina, consistency
  // Weakness: boring perception, burnout risk, no personality
  // ================================================================
  hard_worker: {
    fitness: {
      energyRecovery: 4, followerGain: 0.15,
      subscriptionBonus: 0.20,
      famePenalty: 0.10,                                             // "boring" — same routine every day
      mentalDrain: 1,                                                 // grindset masks emotional needs
      eventAffinity: { recovery: 0.7, viral: 1.15, drama: 0.85 },   // too boring for drama, too consistent for recovery
      phaseBonus: { phase: "breakout", followerGain: 0.18, incomeBonus: 1500 },
    },
    gaming: {
      followerGain: 0.18, energyRecovery: 2,
      donationBonus: 0.18, subscriptionBonus: 0.15,
      reputationPenalty: 0.10,                                       // "quantity over quality" perception
      famePenalty: 0.08,                                             // grinding isn't glamorous
      eventAffinity: { platform: 1.2, viral: 1.1, celebrity: 0.85 }, // not celebrity material
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    comedy: {
      fameGain: 0.12, energyRecovery: 2,
      adRevenueBonus: 0.15,
      followerPenalty: 0.10,                                         // try-hard energy isn't funny
      mentalVulnerability: 0.10,                                     // takes failure personally
      eventAffinity: { viral: 1.15, failure: 0.9 },
      phaseBonus: { phase: "famous", fameGain: 0.15 },
    },
    beauty: {
      moneyGain: 0.15, followerGain: 0.10,
      adRevenueBonus: 0.12, sponsorshipBonus: 0.10,
      famePenalty: 0.08,                                             // workaholic, not glamorous enough
      mentalDrain: 1,                                                 // never stops, never recharges
      eventAffinity: { brand: 1.2, celebrity: 0.9 },                // brands like consistency, celebs don't care
      phaseBonus: { phase: "breakout", moneyGain: 0.15 },
    },
    lifestyle: {
      followerGain: 0.12, fameGain: 0.08,
      adRevenueBonus: 0.15,
      mentalDrain: 2,                                                 // daily vlogging destroys mental health
      reputationPenalty: 0.06,                                       // content feels forced when you never rest
      eventAffinity: { lifestyle: 1.15, platform: 1.1, recovery: 1.2 }, // needs recovery events
      phaseBonus: { phase: "famous", followerGain: 0.12, incomeBonus: 2000 },
    },
    drama: {
      fameGain: 0.10, energyRecovery: 2,
      adRevenueBonus: 0.10,
      followerPenalty: 0.08,                                         // too methodical, drama needs spontaneity
      reputationVulnerability: 0.10,                                 // when you slip, it hits hard (perfectionist)
      eventAffinity: { drama: 1.15, viral: 1.1 },
      phaseBonus: { phase: "breakout", fameGain: 0.12 },
    },
  },

  // ================================================================
  // THICK SKIN — mental fortress, drama-proof, unshakeable
  // Weakness: emotionally distant, tone-deaf, insensitive
  // ================================================================
  thick_skin: {
    drama: {
      mentalProtection: 0.25, reputationProtection: 0.15,
      adRevenueBonus: 0.08,
      moneyPenalty: 0.12,                                            // brands avoid controversy magnets
      sponsorshipBonus: -0.15,                                       // sponsors flee from thick-skin drama creators
      eventAffinity: { drama: 1.25, failure: 0.75, brand: 0.8 },    // drama central, but brands run away
      phaseBonus: { phase: "famous", fameGain: 0.15, moneyGain: 0.10 },
    },
    comedy: {
      mentalProtection: 0.15, reputationProtection: 0.12,
      donationBonus: 0.12,
      followerPenalty: 0.08,                                         // comes across as cold and distant
      reputationPenalty: 0.08,                                       // insensitive jokes cross lines
      eventAffinity: { viral: 1.15, failure: 0.85, drama: 1.1 },    // controversy magnet
      phaseBonus: { phase: "breakout", fameGain: 0.12 },
    },
    gaming: {
      mentalRecovery: 4, mentalProtection: 0.12,
      subscriptionBonus: 0.15,
      reputationPenalty: 0.10,                                       // insensitive to community issues
      followerPenalty: 0.06,                                         // cold personality loses casual viewers
      eventAffinity: { platform: 1.15, drama: 0.85 },
      phaseBonus: { phase: "breakout", followerGain: 0.12 },
    },
    beauty: {
      reputationGain: 0.12, mentalProtection: 0.10,
      sponsorshipBonus: 0.10,
      followerPenalty: 0.08,                                         // not emotionally relatable
      famePenalty: 0.06,                                             // beauty industry rewards vulnerability
      eventAffinity: { brand: 1.15, drama: 0.9, celebrity: 0.9 },   // closed off from celeb inner circles
      phaseBonus: { phase: "famous", moneyGain: 0.12 },
    },
    lifestyle: {
      mentalRecovery: 4, mentalProtection: 0.15,
      adRevenueBonus: 0.10,
      famePenalty: 0.10,                                             // too detached for emotional lifestyle content
      followerPenalty: 0.08,                                         // people want vulnerability, you give walls
      eventAffinity: { recovery: 0.7, lifestyle: 1.2, celebrity: 0.85 },
      phaseBonus: { phase: "famous", followerGain: 0.12 },
    },
    fitness: {
      reputationGain: 0.12, mentalRecovery: 2,
      subscriptionBonus: 0.12,
      famePenalty: 0.10,                                             // intimidating, not approachable
      followerPenalty: 0.06,                                         // cold vibe scares casual audience
      eventAffinity: { brand: 1.15, failure: 0.85, viral: 0.9 },    // hard to go viral when you're stone-faced
      phaseBonus: { phase: "breakout", reputationGain: 0.10 },
    },
  },

  // ================================================================
  // SOCIAL BUTTERFLY — networking, community, word-of-mouth
  // Weakness: spread thin, superficial, unreliable, people-pleaser
  // ================================================================
  social_butterfly: {
    lifestyle: {
      followerGain: 0.22, fameGain: 0.12,
      donationBonus: 0.18, subscriptionBonus: 0.12,
      moneyPenalty: 0.10,                                            // spends on socializing instead of saving
      energyDrain: 2,                                                 // social events drain your battery
      eventAffinity: { celebrity: 1.25, lifestyle: 1.15, failure: 1.1 }, // overpromise, underdeliver
      phaseBonus: { phase: "breakout", followerGain: 0.18, fameGain: 0.10 },
    },
    beauty: {
      fameGain: 0.18, followerGain: 0.12,
      sponsorshipBonus: 0.18,
      mentalDrain: 2,                                                 // always performing socially
      energyDrain: 1,                                                 // exhausting social calendar
      eventAffinity: { brand: 1.2, celebrity: 1.15, drama: 1.1 },   // social circles breed drama
      phaseBonus: { phase: "famous", moneyGain: 0.15 },
    },
    comedy: {
      followerGain: 0.18, reputationGain: 0.08,
      donationBonus: 0.15,
      moneyPenalty: 0.10,                                            // gives too much away, bad with money
      mentalVulnerability: 0.10,                                     // people-pleaser can't handle criticism
      eventAffinity: { viral: 1.2, celebrity: 1.1, failure: 1.1 },  // overexposure risk
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    drama: {
      followerGain: 0.12, fameGain: 0.10,
      adRevenueBonus: 0.10,
      reputationPenalty: 0.10,                                       // seen as a gossip, not genuine
      reputationVulnerability: 0.10,                                 // word spreads fast when YOU fall
      eventAffinity: { drama: 1.15, celebrity: 1.15, failure: 1.15 }, // live by connections, die by connections
      phaseBonus: { phase: "famous", fameGain: 0.12 },
    },
    gaming: {
      fameGain: 0.12, followerGain: 0.10,
      donationBonus: 0.20,
      mentalDrain: 2,                                                 // can't be alone, can't focus
      energyDrain: 1,                                                 // constant collabs exhaust you
      eventAffinity: { platform: 1.15, viral: 1.1, recovery: 1.15 }, // needs recovery from social exhaustion
      phaseBonus: { phase: "breakout", followerGain: 0.15 },
    },
    fitness: {
      followerGain: 0.18, reputationGain: 0.10,
      subscriptionBonus: 0.18,
      moneyPenalty: 0.08,                                            // too many collabs, not enough focus on business
      energyDrain: 1,                                                 // social obligations eat into training time
      eventAffinity: { brand: 1.15, lifestyle: 1.15, failure: 1.1 }, // overcommitted
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
 * Buffs boost gains, debuffs reduce gains or amplify losses.
 * Phase bonuses stack on top when the player reaches the required phase.
 */
export function applySynergyToEffects(
  effects: StatEffects,
  synergy: SynergyBonus,
  currentPhase?: CareerPhase,
): StatEffects {
  const result = { ...effects };

  // Combine base + phase bonuses for gains
  let followerMul = (synergy.followerGain ?? 0) - (synergy.followerPenalty ?? 0);
  let moneyMul = (synergy.moneyGain ?? 0) - (synergy.moneyPenalty ?? 0);
  let fameMul = (synergy.fameGain ?? 0) - (synergy.famePenalty ?? 0);
  let repMul = (synergy.reputationGain ?? 0) - (synergy.reputationPenalty ?? 0);

  if (currentPhase && synergy.phaseBonus && isPhaseReached(currentPhase, synergy.phaseBonus.phase)) {
    followerMul += synergy.phaseBonus.followerGain ?? 0;
    moneyMul += synergy.phaseBonus.moneyGain ?? 0;
    fameMul += synergy.phaseBonus.fameGain ?? 0;
    repMul += synergy.phaseBonus.reputationGain ?? 0;
  }

  // Apply gain multipliers (can be positive or negative net)
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

  // Protect against losses (buff)
  if (synergy.reputationProtection && result.reputation && result.reputation < 0) {
    result.reputation = Math.round(result.reputation * (1 - synergy.reputationProtection));
  }
  if (synergy.mentalProtection && result.mentalHealth && result.mentalHealth < 0) {
    result.mentalHealth = Math.round(result.mentalHealth * (1 - synergy.mentalProtection));
  }

  // Amplify losses (debuff) — makes negative effects worse
  if (synergy.reputationVulnerability && result.reputation && result.reputation < 0) {
    result.reputation = Math.round(result.reputation * (1 + synergy.reputationVulnerability));
  }
  if (synergy.mentalVulnerability && result.mentalHealth && result.mentalHealth < 0) {
    result.mentalHealth = Math.round(result.mentalHealth * (1 + synergy.mentalVulnerability));
  }

  return result;
}

/**
 * Get the event weight multiplier for a given event type from synergy.
 */
export function getSynergyEventWeight(
  synergy: SynergyBonus,
  eventType: EventCategory,
): number {
  return synergy.eventAffinity?.[eventType] ?? 1.0;
}

/**
 * Get the income multiplier for a specific income stream from synergy.
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
