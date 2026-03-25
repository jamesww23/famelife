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
  // ---- Empire & Comeback milestones ----
  {
    id: "empire_builder",
    title: "Empire Builder",
    emoji: "🏰",
    description: "You own a production studio!",
    check: (s: GameState) => s.flags.includes("ownsStudio"),
  },
  {
    id: "managed_talent",
    title: "Managed Talent",
    emoji: "🤵",
    description: "You hired a manager. Big moves only.",
    check: (s: GameState) => s.flags.includes("hasManager"),
  },
  {
    id: "comeback_kid",
    title: "Comeback Kid",
    emoji: "🦅",
    description: "Made 2+ comebacks. You never stay down.",
    check: (s: GameState) => s.comebacks >= 2,
  },
  {
    id: "charity_hero",
    title: "Charity Hero",
    emoji: "💝",
    description: "Known for genuine charitable work.",
    check: (s: GameState) => s.flags.includes("charityPersona"),
  },
  {
    id: "feud_starter",
    title: "Drama Starter",
    emoji: "⚔️",
    description: "Started a public feud. The internet chose sides.",
    check: (s: GameState) => s.flags.includes("startedFeud"),
  },
  {
    id: "half_million",
    title: "Half a Million",
    emoji: "🌟",
    description: "500K followers. You're a star.",
    check: (s: GameState) => s.stats.followers >= 500_000,
  },
  {
    id: "millionaire_money",
    title: "Actual Millionaire",
    emoji: "💎",
    description: "You have $1M+ in the bank!",
    check: (s: GameState) => s.stats.money >= 1_000_000,
  },
  {
    id: "industry_respect",
    title: "Industry Respected",
    emoji: "🎖️",
    description: "The industry sees you as a serious player.",
    check: (s: GameState) => s.flags.includes("industryRespected"),
  },
  // ---- Economy & Luxury milestones ----
  {
    id: "first_purchase",
    title: "First Upgrade",
    emoji: "🛒",
    description: "You bought your first item. The grind is real.",
    check: (s: GameState) => s.purchases.length >= 1,
  },
  {
    id: "luxury_life",
    title: "Luxury Life",
    emoji: "✨",
    description: "You own 3+ luxury items. Living the dream.",
    check: (s: GameState) => {
      const luxuryIds = ["designer_wardrobe", "luxury_watch", "sports_car", "penthouse", "yacht", "private_jet"];
      return s.purchases.filter(p => luxuryIds.includes(p)).length >= 3;
    },
  },
  {
    id: "business_mogul",
    title: "Business Mogul",
    emoji: "💼",
    description: "Manager, merch line, and a studio. You're a brand.",
    check: (s: GameState) =>
      s.purchases.includes("manager") && s.purchases.includes("merch_line") && s.purchases.includes("production_studio"),
  },
  {
    id: "quarter_mil",
    title: "Quarter Millionaire",
    emoji: "💰",
    description: "$250K in the bank. Money moves.",
    check: (s: GameState) => s.stats.money >= 250_000,
  },
];
