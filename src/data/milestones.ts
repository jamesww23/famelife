import { Milestone, GameState } from "@/lib/game/types";

export const milestones: Milestone[] = [
  {
    id: "first_10k",
    title: "First 10K Followers",
    description: "You're officially a micro influencer!",
    check: (s: GameState) => s.stats.followers >= 10_000,
  },
  {
    id: "first_100k",
    title: "First 100K Followers",
    description: "You're a rising influencer now!",
    check: (s: GameState) => s.stats.followers >= 100_000,
  },
  {
    id: "first_1m",
    title: "First 1M Followers",
    description: "One million! You're a celebrity!",
    check: (s: GameState) => s.stats.followers >= 1_000_000,
  },
  {
    id: "first_brand_deal",
    title: "First Brand Deal",
    description: "Your first sponsored content. The money's starting to roll in.",
    check: (s: GameState) => s.brandDeals >= 1,
  },
  {
    id: "first_scandal",
    title: "First Scandal",
    description: "Welcome to fame. It comes with drama.",
    check: (s: GameState) => s.scandals >= 1,
  },
  {
    id: "first_celebrity_event",
    title: "First Celebrity Moment",
    description: "You crossed over from influencer to celebrity.",
    check: (s: GameState) => s.celebrityEvents >= 1,
  },
  {
    id: "rich",
    title: "Made It Rich",
    description: "Over $100K in the bank!",
    check: (s: GameState) => s.stats.money >= 100_000,
  },
  {
    id: "burnout_survivor",
    title: "Burnout Survivor",
    description: "Mental health dropped below 20 and you recovered.",
    check: (s: GameState) =>
      s.stats.mentalHealth >= 50 && s.flags.includes("burnoutRisk"),
  },
];
