import { archetypes } from "@/data/archetypes";
import { getTierName } from "./progression";
import { GameState, GameSummary } from "./types";

/** Calculate a composite fame score (0-1000) based on all stats and achievements. */
function calculateFameScore(state: GameState): number {
  let score = 0;

  // Followers (max ~300 points)
  if (state.stats.followers >= 5_000_000) score += 300;
  else if (state.stats.followers >= 1_000_000) score += 250;
  else if (state.stats.followers >= 500_000) score += 200;
  else if (state.stats.followers >= 100_000) score += 150;
  else if (state.stats.followers >= 10_000) score += 80;
  else score += Math.floor(state.stats.followers / 200);

  // Money (max ~200 points)
  if (state.stats.money >= 500_000) score += 200;
  else if (state.stats.money >= 100_000) score += 150;
  else if (state.stats.money >= 50_000) score += 100;
  else if (state.stats.money >= 10_000) score += 60;
  else if (state.stats.money > 0) score += Math.floor(state.stats.money / 250);

  // Fame stat (max ~150 points)
  score += Math.floor(state.stats.fame * 1.5);

  // Reputation (max ~100 points)
  score += state.stats.reputation;

  // Milestones (max ~100 points, 10 per milestone)
  score += Math.min(state.milestones.length * 10, 100);

  // Viral moments (max ~50 points)
  score += Math.min(state.viralMoments * 12, 50);

  // Brand deals (max ~50 points)
  score += Math.min(state.brandDeals * 8, 50);

  // Celebrity events (max ~50 points)
  score += Math.min(state.celebrityEvents * 10, 50);

  // Survival bonus — how many quarters played (max ~50 points)
  score += Math.min(Math.floor(state.week * 1.25), 50);

  // Penalties
  if (state.gameOverReason?.includes("burned out")) score -= 50;
  if (state.gameOverReason?.includes("cancelled")) score -= 75;
  if (state.gameOverReason?.includes("Bankruptcy")) score -= 100;
  if (state.gameOverReason?.includes("exhaustion")) score -= 60;

  return Math.max(0, Math.min(1000, score));
}

/** Get fame rank title based on score. */
function getFameRank(score: number): { rank: string; emoji: string } {
  if (score >= 900) return { rank: "Living Legend", emoji: "👑" };
  if (score >= 800) return { rank: "A-List Icon", emoji: "🌟" };
  if (score >= 700) return { rank: "Culture Shaper", emoji: "🔥" };
  if (score >= 600) return { rank: "Fan Favorite", emoji: "💫" };
  if (score >= 500) return { rank: "Rising Star", emoji: "⭐" };
  if (score >= 400) return { rank: "Trending Creator", emoji: "📈" };
  if (score >= 300) return { rank: "Known Face", emoji: "🎭" };
  if (score >= 200) return { rank: "Up & Coming", emoji: "🌱" };
  if (score >= 100) return { rank: "Small Creator", emoji: "📱" };
  return { rank: "Forgotten", emoji: "👻" };
}

/** Estimate percentile based on score using a simulated distribution curve. */
function estimatePercentile(score: number): number {
  // Simulate a bell-curve distribution where most players land 200-500
  // This uses a rough sigmoid mapping
  if (score >= 900) return 99;
  if (score >= 800) return 96;
  if (score >= 700) return 90;
  if (score >= 600) return 80;
  if (score >= 500) return 65;
  if (score >= 400) return 48;
  if (score >= 300) return 32;
  if (score >= 200) return 18;
  if (score >= 100) return 8;
  return 3;
}

/** Generate a shareable headline based on the run. */
function generateHeadline(state: GameState): string {
  const arch = archetypes.find((a) => a.id === state.archetype);
  const archName = arch?.name ?? "Creator";
  const followers = state.stats.followers;
  const tier = getTierName(state.careerTier);
  const years = Math.ceil(state.week / 4);

  const parts: string[] = [];

  // Opening
  if (followers >= 5_000_000) {
    parts.push(`Started with 500 followers, became a Global Icon`);
  } else if (followers >= 1_000_000) {
    parts.push(`Rose from nothing to ${tier}`);
  } else if (followers >= 100_000) {
    parts.push(`Grinded to ${tier} as a ${archName}`);
  } else {
    parts.push(`Tried to make it as a ${archName}`);
  }

  // Drama
  if (state.scandals >= 3) {
    parts.push(`survived ${state.scandals} scandals`);
  } else if (state.scandals === 1) {
    parts.push(`survived a scandal`);
  }

  // Relationships
  if (state.relationships >= 2) {
    parts.push(`had ${state.relationships} public relationships`);
  } else if (state.relationships === 1) {
    parts.push(`found love`);
  }

  // Money
  if (state.stats.money >= 100_000) {
    parts.push(`banked $${Math.floor(state.stats.money / 1000)}K`);
  } else if (state.stats.money < 0) {
    parts.push(`went broke`);
  }

  // Viral
  if (state.viralMoments >= 3) {
    parts.push(`went viral ${state.viralMoments} times`);
  }

  // Ending flavor
  if (state.gameOverReason?.includes("cancelled")) {
    parts.push(`and got cancelled`);
  } else if (state.gameOverReason?.includes("burned out")) {
    parts.push(`then burned out`);
  } else if (state.gameOverReason?.includes("Bankruptcy")) {
    parts.push(`and went bankrupt`);
  } else if (state.comebacks >= 1) {
    parts.push(`and made a comeback`);
  }

  if (parts.length === 1) {
    parts.push(`over ${years} ${years === 1 ? "year" : "years"}`);
  }

  // Join with commas and periods
  const headline = parts[0] + (parts.length > 1 ? ", " + parts.slice(1).join(", ") : "") + ".";
  return headline;
}

export function generateSummary(state: GameState): GameSummary {
  const arch = archetypes.find((a) => a.id === state.archetype);
  const years = Math.ceil(state.week / 4);
  const fameScore = calculateFameScore(state);
  const { rank, emoji } = getFameRank(fameScore);
  const percentile = estimatePercentile(fameScore);

  return {
    archetype: state.archetype,
    archetypeName: arch?.name ?? "Unknown",
    archetypeEmoji: arch?.emoji ?? "🎬",
    quartersPlayed: state.week,
    yearsPlayed: years,
    followers: state.stats.followers,
    fameTier: getTierName(state.careerTier),
    money: state.stats.money,
    brandDeals: state.brandDeals,
    scandals: state.scandals,
    celebrityEvents: state.celebrityEvents,
    relationships: state.relationships,
    viralMoments: state.viralMoments,
    comebacks: state.comebacks,
    endingReason: state.gameOverReason ?? "Still playing",
    milestones: [...state.milestones],
    headline: generateHeadline(state),
    fameScore,
    fameRank: rank,
    fameRankEmoji: emoji,
    percentile,
  };
}
