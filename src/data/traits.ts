import { Trait } from "@/lib/game/types";

export const traits: Trait[] = [
  {
    id: "rich_family",
    name: "Rich Family",
    emoji: "💸",
    description: "Born into money. You start with extra cash and connections.",
    modifiers: { money: 3000, reputation: 5 },
  },
  {
    id: "street_smart",
    name: "Street Smart",
    emoji: "🧠",
    description: "You know how to hustle. Better reputation and survival instincts.",
    modifiers: { reputation: 15, mentalHealth: 5 },
  },
  {
    id: "natural_talent",
    name: "Natural Talent",
    emoji: "✨",
    description: "People notice you. You start with a head start on fame.",
    modifiers: { fame: 10, followers: 500 },
  },
  {
    id: "hard_worker",
    name: "Hard Worker",
    emoji: "💪",
    description: "Grind is your middle name. Extra energy to power through.",
    modifiers: { energy: 20, fame: 3 },
  },
  {
    id: "thick_skin",
    name: "Thick Skin",
    emoji: "🛡️",
    description: "Haters don't faze you. Strong mental health from day one.",
    modifiers: { mentalHealth: 20, reputation: 5 },
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    emoji: "🦋",
    description: "Everyone knows your name. You start with a bigger audience.",
    modifiers: { followers: 1000, fame: 5 },
  },
];
