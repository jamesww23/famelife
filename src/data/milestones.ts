import { Milestone, GameState } from "@/lib/game/types";

export const milestones: Milestone[] = [
  {
    id: "first_10k",
    title: "10K Club",
    emoji: "📈",
    description: "You hit 10,000 followers!",
    check: (s: GameState) => s.stats.followers >= 10_000,
  },
  {
    id: "first_100k",
    title: "100K Creator",
    emoji: "🚀",
    description: "100K followers. You're officially rising!",
    check: (s: GameState) => s.stats.followers >= 100_000,
  },
  {
    id: "first_1m",
    title: "Millionaire (Followers)",
    emoji: "👑",
    description: "One MILLION followers!",
    check: (s: GameState) => s.stats.followers >= 1_000_000,
  },
  {
    id: "first_brand_deal",
    title: "First Bag",
    emoji: "💰",
    description: "Your first brand deal. The money's real now.",
    check: (s: GameState) => s.brandDeals >= 1,
  },
  {
    id: "first_scandal",
    title: "First Scandal",
    emoji: "🔥",
    description: "Welcome to fame. It comes with drama.",
    check: (s: GameState) => s.scandals >= 1,
  },
  {
    id: "first_celebrity_event",
    title: "Celebrity Status",
    emoji: "🌟",
    description: "You crossed over into celebrity territory.",
    check: (s: GameState) => s.celebrityEvents >= 1,
  },
  {
    id: "rich",
    title: "Cashed Out",
    emoji: "🤑",
    description: "Over $100K in the bank!",
    check: (s: GameState) => s.stats.money >= 100_000,
  },
  {
    id: "burnout_survivor",
    title: "Burnout Survivor",
    emoji: "💪",
    description: "You hit rock bottom and came back.",
    check: (s: GameState) =>
      s.stats.mentalHealth >= 50 && s.flags.includes("burnoutRisk"),
  },
  {
    id: "triple_scandal",
    title: "Teflon Creator",
    emoji: "🛡️",
    description: "Survived 3+ scandals. Nothing can stop you.",
    check: (s: GameState) => s.scandals >= 3,
  },
  {
    id: "viral_king",
    title: "Viral Machine",
    emoji: "⚡",
    description: "Went viral 5+ times!",
    check: (s: GameState) => s.viralMoments >= 5,
  },
];
