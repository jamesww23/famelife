import { archetypes } from "@/data/archetypes";
import { getTierName } from "./progression";
import { GameState, GameSummary } from "./types";

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
  };
}
