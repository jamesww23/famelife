import { Archetype } from "@/lib/game/types";

export const archetypes: Archetype[] = [
  {
    id: "comedy",
    name: "Comedy Creator",
    emoji: "😂",
    portraitUrl: "/ui/archetypes/comedy.png",
    description: "You make people laugh. High viral potential, but one bad joke can ruin you.",
    startingModifiers: { followers: 200, fame: 3, reputation: 5 },
    eventWeightModifiers: { viral: 1.4, drama: 1.1, failure: 0.8 },
  },
  {
    id: "beauty",
    name: "Beauty Influencer",
    emoji: "💄",
    portraitUrl: "/ui/archetypes/beauty.png",
    description: "Tutorials, reviews, and brand deals. Lucrative but competitive.",
    startingModifiers: { money: 300, reputation: 10, fame: 2 },
    eventWeightModifiers: { brand: 1.5, lifestyle: 1.2, drama: 0.9, empire: 1.3 },
  },
  {
    id: "lifestyle",
    name: "Lifestyle Vlogger",
    emoji: "🌴",
    portraitUrl: "/ui/archetypes/lifestyle.png",
    description: "Your life is the content. Everything is aesthetic, until it gets real.",
    startingModifiers: { followers: 150, mentalHealth: -5, fame: 5 },
    eventWeightModifiers: { lifestyle: 1.5, celebrity: 1.2, recovery: 1.1, empire: 1.2 },
  },
  {
    id: "drama",
    name: "Drama Storyteller",
    emoji: "🎭",
    // No portrait — drama doesn't have a matching generated asset. Emoji fallback.
    description: "Tea channels, exposés, and hot takes. Drama is your currency.",
    startingModifiers: { fame: 8, reputation: -10 },
    eventWeightModifiers: { drama: 1.6, viral: 1.2, brand: 0.7 },
  },
  {
    id: "gaming",
    name: "Gaming Streamer",
    emoji: "🎮",
    portraitUrl: "/ui/archetypes/gaming.png",
    description: "Streams, clips, and rage moments. Loyal fans, unpredictable fame.",
    startingModifiers: { energy: 10, mentalHealth: -5, followers: 300 },
    eventWeightModifiers: { viral: 1.3, platform: 1.3, celebrity: 0.8 },
  },
  {
    id: "fitness",
    name: "Fitness Influencer",
    emoji: "💪",
    portraitUrl: "/ui/archetypes/fitness.png",
    description: "Workouts, transformations, and discipline. Brand safe, but the niche is crowded.",
    // Net positive but not a free lunch: starts with a follower deficit (crowded niche)
    // and below-average viral weight (fitness rarely breaks containment).
    startingModifiers: { energy: 15, reputation: 10, mentalHealth: 5, followers: -500 },
    eventWeightModifiers: { brand: 1.3, recovery: 0.7, lifestyle: 1.2, viral: 0.75, drama: 0.85 },
  },
];
