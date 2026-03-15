import { archetypes } from "@/data/archetypes";
import { getTierName } from "./progression";
import { GameState, GameSummary } from "./types";

export function generateSummary(state: GameState): GameSummary {
  const arch = archetypes.find((a) => a.id === state.archetype);

  return {
    archetype: state.archetype,
    archetypeName: arch?.name ?? "Unknown",
    weeksPlayed: state.week,
    followers: state.stats.followers,
    fameTier: getTierName(state.careerTier),
    money: state.stats.money,
    brandDeals: state.brandDeals,
    scandals: state.scandals,
    celebrityEvents: state.celebrityEvents,
    relationships: state.relationships,
    endingReason: state.gameOverReason ?? "Still playing",
    milestones: [...state.milestones],
  };
}
