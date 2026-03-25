import { ShopItem, PassiveEffects } from "@/lib/game/types";

// ============================================================
// Shop Items — categorized purchases with gameplay effects
// ============================================================

export const shopItems: ShopItem[] = [
  // ========== GROWTH / CONTENT ==========
  {
    id: "ring_light",
    name: "Ring Light Setup",
    emoji: "💡",
    description: "Better lighting = better content",
    category: "growth",
    cost: 1200,
    upkeep: 0,
    passiveEffects: { followerGainMultiplier: 0.05 },
  },
  {
    id: "better_phone",
    name: "Better Phone",
    emoji: "📱",
    description: "4K camera, better mic, content machine",
    category: "growth",
    cost: 3000,
    upkeep: 0,
    passiveEffects: { followerGainMultiplier: 0.08 },
  },
  {
    id: "pro_camera",
    name: "Pro Camera",
    emoji: "📸",
    description: "Cinema-quality content. Your videos look Hollywood.",
    category: "growth",
    cost: 10000,
    upkeep: 0,
    passiveEffects: { followerGainMultiplier: 0.12, adRevenueMultiplier: 0.05 },
    requires: { minFollowers: 5000 },
  },
  {
    id: "hired_editor",
    name: "Hired Editor",
    emoji: "🎬",
    description: "Someone else cuts the videos. You just create.",
    category: "growth",
    cost: 18000,
    upkeep: 2000,
    passiveEffects: { followerGainMultiplier: 0.15, adRevenueMultiplier: 0.10 },
    requires: { minFollowers: 20000 },
  },
  {
    id: "content_team",
    name: "Content Team",
    emoji: "👥",
    description: "Full team: shooters, editors, thumbnail artists",
    category: "growth",
    cost: 45000,
    upkeep: 5000,
    passiveEffects: { followerGainMultiplier: 0.25, incomeMultiplier: 0.15 },
    requires: { minFollowers: 100000, purchases: ["hired_editor"] },
  },
  {
    id: "production_studio",
    name: "Production Studio",
    emoji: "🏢",
    description: "Your own studio. Soundstages, edit bays, everything.",
    category: "growth",
    cost: 120000,
    upkeep: 8000,
    passiveEffects: { followerGainMultiplier: 0.35, incomeMultiplier: 0.25 },
    requires: { minFollowers: 250000, purchases: ["content_team"] },
    setFlags: ["ownsStudio"],
  },

  // ========== BUSINESS ==========
  {
    id: "manager",
    name: "Manager",
    emoji: "📋",
    description: "Handles your schedule, deals, and headaches",
    category: "business",
    cost: 12000,
    upkeep: 1500,
    passiveEffects: { sponsorshipMultiplier: 0.20, energyRecoveryBonus: 5 },
    requires: { minFollowers: 10000 },
    setFlags: ["hasManager"],
  },
  {
    id: "pr_team",
    name: "PR Team",
    emoji: "🛡️",
    description: "Damage control when things go south",
    category: "business",
    cost: 22000,
    upkeep: 2500,
    passiveEffects: { scandalReduction: 0.50 },
    requires: { minFollowers: 50000 },
  },
  {
    id: "merch_line",
    name: "Merch Line",
    emoji: "👕",
    description: "Your name on hoodies, hats, and everything else",
    category: "business",
    cost: 25000,
    upkeep: 2000,
    passiveEffects: { businessIncome: 4000 },
    requires: { minFollowers: 30000 },
  },
  {
    id: "sponsorship_agent",
    name: "Sponsorship Agent",
    emoji: "🤝",
    description: "Finds the deals you'd never find yourself",
    category: "business",
    cost: 18000,
    upkeep: 1500,
    passiveEffects: { sponsorshipMultiplier: 0.30 },
    requires: { minFollowers: 25000 },
  },
  {
    id: "creator_house",
    name: "Creator House",
    emoji: "🏠",
    description: "Move in with top creators. Content factory.",
    category: "business",
    cost: 80000,
    upkeep: 6000,
    passiveEffects: { followerGainMultiplier: 0.20, sponsorshipMultiplier: 0.10 },
    requires: { minFollowers: 200000, purchases: ["manager"] },
  },
  {
    id: "talent_agency",
    name: "Talent Agency",
    emoji: "⭐",
    description: "Hollywood-level representation. TV, movies, everything.",
    category: "business",
    cost: 55000,
    upkeep: 5000,
    passiveEffects: { incomeMultiplier: 0.15, energyRecoveryBonus: 8 },
    requires: { minFollowers: 500000, purchases: ["manager"] },
  },

  // ========== LUXURY / STATUS ==========
  {
    id: "designer_wardrobe",
    name: "Designer Wardrobe",
    emoji: "👗",
    description: "Head-to-toe drip. Every thumbnail is a flex.",
    category: "luxury",
    cost: 8000,
    upkeep: 0,
    onPurchaseEffects: { fame: 3 },
    enablesFlex: true,
  },
  {
    id: "luxury_watch",
    name: "Luxury Watch",
    emoji: "⌚",
    description: "A Rolex says 'I made it' without a word",
    category: "luxury",
    cost: 25000,
    upkeep: 0,
    onPurchaseEffects: { fame: 3 },
    enablesFlex: true,
    requires: { minFame: 15 },
  },
  {
    id: "sports_car",
    name: "Sports Car",
    emoji: "🏎️",
    description: "Lamborghini content hits different",
    category: "luxury",
    cost: 65000,
    upkeep: 1000,
    onPurchaseEffects: { fame: 5 },
    enablesFlex: true,
    requires: { minFame: 25 },
  },
  {
    id: "penthouse",
    name: "Penthouse",
    emoji: "🌇",
    description: "City skyline backdrop. Every vlog starts here.",
    category: "luxury",
    cost: 120000,
    upkeep: 3500,
    onPurchaseEffects: { fame: 8 },
    passiveEffects: { mentalHealthRecoveryBonus: 5 },
    enablesFlex: true,
    requires: { minFame: 35 },
  },
  {
    id: "yacht",
    name: "Yacht",
    emoji: "🛥️",
    description: "Float content. The ultimate flex machine.",
    category: "luxury",
    cost: 300000,
    upkeep: 8000,
    onPurchaseEffects: { fame: 10 },
    enablesFlex: true,
    requires: { minFame: 50 },
  },
  {
    id: "private_jet",
    name: "Private Jet",
    emoji: "✈️",
    description: "Skip the airport. You ARE the airport.",
    category: "luxury",
    cost: 600000,
    upkeep: 15000,
    onPurchaseEffects: { fame: 15 },
    enablesFlex: true,
    requires: { minFame: 65 },
  },

  // ========== ACCESS / CELEBRITY ==========
  {
    id: "vip_club",
    name: "VIP Club Access",
    emoji: "🎫",
    description: "Celebrity spotting, networking, clout",
    category: "access",
    cost: 5000,
    upkeep: 1000,
    onPurchaseEffects: { fame: 2, reputation: 3 },
    requires: { minFame: 10 },
  },
  {
    id: "fashion_week",
    name: "Fashion Week Pass",
    emoji: "👠",
    description: "Front row seats. Your outfit will be photographed.",
    category: "access",
    cost: 15000,
    upkeep: 0,
    onPurchaseEffects: { fame: 5, reputation: 5, followers: 3000 },
    requires: { minFame: 20 },
  },
  {
    id: "luxury_retreat",
    name: "Luxury Retreat",
    emoji: "🏝️",
    description: "Exclusive creator retreat. Connections and content.",
    category: "access",
    cost: 25000,
    upkeep: 0,
    onPurchaseEffects: { energy: 15, mentalHealth: 12, fame: 3, followers: 2000 },
    requires: { minFame: 25 },
  },
  {
    id: "award_circuit",
    name: "Award Season Circuit",
    emoji: "🏆",
    description: "Red carpets, afterparties, magazine covers",
    category: "access",
    cost: 40000,
    upkeep: 0,
    onPurchaseEffects: { fame: 8, reputation: 8, followers: 5000 },
    requires: { minFame: 40 },
  },
  {
    id: "elite_network",
    name: "Elite Network",
    emoji: "💎",
    description: "Private group of A-listers. Invitation only.",
    category: "access",
    cost: 30000,
    upkeep: 2000,
    passiveEffects: { sponsorshipMultiplier: 0.10 },
    onPurchaseEffects: { reputation: 5 },
    requires: { minFame: 35, purchases: ["vip_club"] },
  },

  // ========== RISK PLAYS ==========
  {
    id: "luxury_flex_video",
    name: "Luxury Flex Video",
    emoji: "💸",
    description: "Show off everything you own. Bold move.",
    category: "risk",
    cost: 10000,
    upkeep: 0,
    onPurchaseEffects: { followers: 8000, fame: 5, reputation: -8 },
  },
  {
    id: "shock_stunt",
    name: "Shock Content Stunt",
    emoji: "🤯",
    description: "Dangerous, controversial, and incredibly viral",
    category: "risk",
    cost: 20000,
    upkeep: 0,
    onPurchaseEffects: { followers: 15000, fame: 8, reputation: -15, energy: -10 },
    requires: { minFollowers: 50000 },
  },
  {
    id: "fake_feud",
    name: "Fake Feud Campaign",
    emoji: "🎭",
    description: "Stage a public beef for clout. Risky if exposed.",
    category: "risk",
    cost: 15000,
    upkeep: 0,
    onPurchaseEffects: { followers: 12000, fame: 10, reputation: -20 },
    requires: { minFollowers: 30000 },
  },
  {
    id: "massive_giveaway",
    name: "Massive Giveaway",
    emoji: "🎁",
    description: "Cars, cash, dream vacations. Break the internet.",
    category: "risk",
    cost: 50000,
    upkeep: 0,
    onPurchaseEffects: { followers: 25000, fame: 10, reputation: 5 },
    requires: { minFollowers: 100000 },
  },
  {
    id: "viral_event_production",
    name: "Viral Event Production",
    emoji: "🎪",
    description: "Rent a stadium. Hire a crew. Make history.",
    category: "risk",
    cost: 35000,
    upkeep: 0,
    onPurchaseEffects: { followers: 20000, fame: 12, energy: -15 },
    requires: { minFollowers: 200000 },
  },
];

// ---- Helpers ----

export const SHOP_CATEGORIES: { id: string; name: string; emoji: string }[] = [
  { id: "growth", name: "Growth", emoji: "📹" },
  { id: "business", name: "Business", emoji: "💼" },
  { id: "luxury", name: "Luxury", emoji: "✨" },
  { id: "access", name: "Access", emoji: "🎫" },
  { id: "risk", name: "Risk Plays", emoji: "🎲" },
];

/** Sum passive effects from all owned items. */
export function computePassiveEffects(purchases: string[]): PassiveEffects {
  const result: PassiveEffects = {};
  for (const id of purchases) {
    const item = shopItems.find((i) => i.id === id);
    if (!item?.passiveEffects) continue;
    for (const [key, val] of Object.entries(item.passiveEffects)) {
      const k = key as keyof PassiveEffects;
      result[k] = ((result[k] as number) || 0) + (val as number);
    }
  }
  return result;
}

/** Total quarterly upkeep from all owned items. */
export function computeUpkeep(purchases: string[]): number {
  return purchases.reduce((sum, id) => {
    const item = shopItems.find((i) => i.id === id);
    return sum + (item?.upkeep || 0);
  }, 0);
}

/** Check if a player can buy an item. */
export function canPurchase(
  item: ShopItem,
  money: number,
  followers: number,
  fame: number,
  purchases: string[],
): boolean {
  if (purchases.includes(item.id)) return false;
  if (money < item.cost) return false;
  if (item.requires?.minFollowers && followers < item.requires.minFollowers) return false;
  if (item.requires?.minFame && fame < item.requires.minFame) return false;
  if (item.requires?.purchases) {
    for (const req of item.requires.purchases) {
      if (!purchases.includes(req)) return false;
    }
  }
  return true;
}
