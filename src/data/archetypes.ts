import { Archetype } from "@/lib/game/types";

export const archetypes: Archetype[] = [
  {
    id: "comedy",
    name: "Comedy Creator",
    emoji: "😂",
    description: "You make people laugh. High viral potential, but one bad joke can ruin you.",
    startingModifiers: { followers: 200, fame: 3, reputation: 5 },
    eventWeightModifiers: { viral: 1.4, drama: 1.1, failure: 0.8 },
  },
  {
    id: "beauty",
    name: "Beauty Influencer",
    emoji: "💄",
    description: "Tutorials, reviews, and brand deals. Lucrative but competitive.",
    startingModifiers: { money: 300, reputation: 10, fame: 2 },
    eventWeightModifiers: { brand: 1.5, lifestyle: 1.2, drama: 0.9 },
  },
  {
    id: "lifestyle",
    name: "Lifestyle Vlogger",
    emoji: "🌴",
    description: "Your life is the content. Everything is aesthetic, until it gets real.",
    startingModifiers: { followers: 150, mentalHealth: -5, fame: 5 },
    eventWeightModifiers: { lifestyle: 1.5, celebrity: 1.2, recovery: 1.1 },
  },
  {
    id: "drama",
    name: "Drama Storyteller",
    emoji: "🎭",
    description: "Tea channels, exposés, and hot takes. Drama is your currency.",
    startingModifiers: { fame: 8, reputation: -10 },
    eventWeightModifiers: { drama: 1.6, viral: 1.2, brand: 0.7 },
  },
  {
    id: "gaming",
    name: "Gaming Streamer",
    emoji: "🎮",
    description: "Streams, clips, and rage moments. Loyal fans, unpredictable fame.",
    startingModifiers: { energy: 10, mentalHealth: -5, followers: 300 },
    eventWeightModifiers: { viral: 1.3, platform: 1.3, celebrity: 0.8 },
  },
  {
    id: "fitness",
    name: "Fitness Influencer",
    emoji: "💪",
    description: "Workouts, transformations, and discipline. Brand safe, but expectations are high.",
    startingModifiers: { energy: 15, reputation: 10, mentalHealth: 5 },
    eventWeightModifiers: { brand: 1.3, recovery: 0.7, lifestyle: 1.2 },
  },
];
