import { QuarterlyActivity } from "@/lib/game/types";

// ---- Core work activities (always available) ----
// Tuned for fast growth:
//   Early (~1K followers):  5K-8K followers/turn
//   Mid (~100K followers):  20K-50K/turn
//   Late (~1M followers):   100K-300K/turn

export const workActivities: QuarterlyActivity[] = [
  {
    id: "create_content",
    name: "Create Content",
    emoji: "\uD83D\uDCF9",
    description: "Post videos & grow your audience",
    category: "work",
    getEffects: (state) => {
      const f = state.stats.followers;
      // Base 5K, scales 5% of followers, soft-caps via diminishing returns
      const base = 5000 + Math.floor(f * 0.05);
      const followerGain = f < 500_000
        ? base
        : Math.floor(base * 0.7 + f * 0.02); // diminish above 500K
      return { followers: followerGain, fame: 2, energy: -8 };
    },
  },
  {
    id: "engage_community",
    name: "Engage Fans",
    emoji: "\uD83D\uDCAC",
    description: "Reply to comments, go live, connect",
    category: "work",
    getEffects: (state) => {
      const repGain = state.stats.fame > 40 ? 8 : 5;
      const followerGain = Math.max(2000, Math.floor(state.stats.followers * 0.02));
      return { followers: followerGain, reputation: repGain, fame: 1, mentalHealth: 3, energy: -6 };
    },
  },
  {
    id: "rest",
    name: "Rest & Recharge",
    emoji: "\uD83D\uDECB\uFE0F",
    description: "Take care of yourself",
    category: "work",
    getEffects: (state) => {
      const followerLoss =
        state.stats.followers > 10000
          ? -Math.min(Math.floor(state.stats.followers * 0.003), 5000)
          : 0;
      return { energy: 18, mentalHealth: 12, followers: followerLoss };
    },
  },
  {
    id: "hustle",
    name: "Chase Deals",
    emoji: "\uD83D\uDCBC",
    description: "Pitch brands & negotiate sponsorships",
    category: "work",
    getEffects: (state) => {
      const f = state.stats.followers;
      // Base $2K, scales with followers
      const base = 2000 + Math.floor(f * 0.02);
      const moneyGain = f < 500_000
        ? base
        : Math.floor(base * 0.6 + f * 0.01);
      const repLoss = f > 100_000 ? -2 : 0;
      return { money: moneyGain, energy: -8, reputation: repLoss };
    },
  },
];

// ---- Flex content activities (require luxury purchases) ----

export const flexActivities: QuarterlyActivity[] = [
  {
    id: "flex_ride",
    name: "Flex Your Ride",
    emoji: "🏎️",
    description: "Film with your sports car",
    category: "lifestyle",
    requiresPurchases: ["sports_car"],
    getEffects: () => ({ followers: 8000, fame: 3, reputation: -3 }),
    tiers: [
      {
        id: "full_flex",
        name: "Full Flex Video",
        emoji: "📹",
        effects: { followers: 15000, fame: 5, reputation: -6, energy: -8 },
      },
      {
        id: "subtle_flex",
        name: "Subtle Background Flex",
        emoji: "😏",
        effects: { followers: 6000, fame: 2, reputation: 3 },
      },
    ],
  },
  {
    id: "flex_penthouse",
    name: "Penthouse Tour",
    emoji: "🌇",
    description: "Tour your luxury penthouse on camera",
    category: "lifestyle",
    requiresPurchases: ["penthouse"],
    getEffects: () => ({ followers: 10000, fame: 4 }),
    tiers: [
      {
        id: "full_tour",
        name: "Full Crib Tour",
        emoji: "🎥",
        effects: { followers: 20000, fame: 6, reputation: -4, energy: -8 },
      },
      {
        id: "tasteful_shots",
        name: "Tasteful Shots Only",
        emoji: "📸",
        effects: { followers: 8000, fame: 3, reputation: 5 },
      },
    ],
  },
  {
    id: "flex_yacht",
    name: "Yacht Day Content",
    emoji: "🛥️",
    description: "Invite creators aboard for content",
    category: "lifestyle",
    requiresPurchases: ["yacht"],
    getEffects: () => ({ followers: 15000, fame: 5 }),
    tiers: [
      {
        id: "yacht_party",
        name: "Yacht Party Video",
        emoji: "🎉",
        effects: { followers: 30000, fame: 8, reputation: -5, energy: -12, money: -5000 },
      },
      {
        id: "yacht_collab",
        name: "Chill Collab Session",
        emoji: "🤝",
        effects: { followers: 15000, fame: 4, reputation: 5, energy: -6 },
      },
    ],
  },
  {
    id: "flex_jet",
    name: "Private Jet Content",
    emoji: "✈️",
    description: "Film from 40,000 feet",
    category: "lifestyle",
    requiresPurchases: ["private_jet"],
    getEffects: () => ({ followers: 25000, fame: 8 }),
    tiers: [
      {
        id: "jet_flex",
        name: "Full Luxury Vlog",
        emoji: "💎",
        effects: { followers: 50000, fame: 10, reputation: -8, energy: -10 },
      },
      {
        id: "jet_travel",
        name: "Travel Content",
        emoji: "🌍",
        effects: { followers: 20000, fame: 5, reputation: 5, energy: -8, mentalHealth: 8 },
      },
    ],
  },
  {
    id: "flex_wardrobe",
    name: "Outfit of the Day",
    emoji: "👗",
    description: "Show off your designer wardrobe",
    category: "lifestyle",
    requiresPurchases: ["designer_wardrobe"],
    getEffects: () => ({ followers: 5000, fame: 2 }),
    tiers: [
      {
        id: "full_haul",
        name: "Designer Haul Video",
        emoji: "🛍️",
        effects: { followers: 10000, fame: 4, reputation: -3, energy: -6 },
      },
      {
        id: "style_tips",
        name: "Style Tips & Fits",
        emoji: "✨",
        effects: { followers: 6000, fame: 2, reputation: 5 },
      },
    ],
  },
];

// ---- Lifestyle spending activities with tiered choices ----

export const lifestyleActivities: QuarterlyActivity[] = [
  {
    id: "go_shopping",
    name: "Go Shopping",
    emoji: "\uD83D\uDECD\uFE0F",
    description: "Treat yourself to new fits",
    category: "lifestyle",
    minMoney: 1000,
    getEffects: () => ({ money: -1000, mentalHealth: 3 }),
    tiers: [
      {
        id: "thrift",
        name: "Thrift Store Haul",
        emoji: "\uD83D\uDC5A",
        effects: { money: -1000, mentalHealth: 3, followers: 500 },
      },
      {
        id: "designer",
        name: "Designer Store",
        emoji: "\uD83D\uDC5C",
        effects: { money: -5000, fame: 2, mentalHealth: 5, followers: 3000 },
      },
      {
        id: "full_wardrobe",
        name: "Full Wardrobe Overhaul",
        emoji: "\uD83D\uDC51",
        effects: { money: -15000, fame: 5, mentalHealth: 8, followers: 10000 },
      },
    ],
  },
  {
    id: "date_night",
    name: "Go on a Date",
    emoji: "\u2764\uFE0F",
    description: "Hit the town, get spotted",
    category: "lifestyle",
    minMoney: 500,
    getEffects: () => ({ money: -500, mentalHealth: 4 }),
    tiers: [
      {
        id: "coffee_date",
        name: "Coffee Date",
        emoji: "\u2615",
        effects: { money: -500, mentalHealth: 5 },
      },
      {
        id: "fancy_dinner",
        name: "Fancy Dinner",
        emoji: "\uD83C\uDF7D\uFE0F",
        effects: { money: -3000, mentalHealth: 8, fame: 2, followers: 2000 },
      },
      {
        id: "yacht_date",
        name: "Private Yacht",
        emoji: "\uD83D\uDEF3\uFE0F",
        effects: { money: -12000, mentalHealth: 12, fame: 6, followers: 10000 },
      },
    ],
  },
  {
    id: "buy_car",
    name: "Buy a Car",
    emoji: "\uD83D\uDE97",
    description: "Flex a new ride for content",
    category: "lifestyle",
    minMoney: 5000,
    minFollowers: 3000,
    getEffects: () => ({ money: -5000, fame: 1 }),
    tiers: [
      {
        id: "used_car",
        name: "Used Honda",
        emoji: "\uD83D\uDE99",
        effects: { money: -5000, fame: 1, followers: 2000 },
      },
      {
        id: "tesla",
        name: "Tesla",
        emoji: "\u26A1",
        effects: { money: -25000, fame: 5, followers: 10000 },
      },
      {
        id: "lambo",
        name: "Lamborghini",
        emoji: "\uD83C\uDFCE\uFE0F",
        effects: { money: -80000, fame: 14, followers: 40000 },
      },
    ],
  },
  {
    id: "upgrade_home",
    name: "Upgrade Home",
    emoji: "\uD83C\uDFE0",
    description: "Better backdrop, better content",
    category: "lifestyle",
    minMoney: 6000,
    minFollowers: 5000,
    getEffects: () => ({ money: -6000, fame: 2 }),
    tiers: [
      {
        id: "nice_apartment",
        name: "Nice Apartment",
        emoji: "\uD83C\uDFE2",
        effects: { money: -6000, fame: 2, mentalHealth: 5, followers: 3000 },
      },
      {
        id: "penthouse",
        name: "Penthouse",
        emoji: "\uD83C\uDF07",
        effects: { money: -40000, fame: 8, mentalHealth: 10, followers: 15000 },
      },
      {
        id: "mansion",
        name: "Mansion",
        emoji: "\uD83C\uDFF0",
        effects: { money: -120000, fame: 18, mentalHealth: 15, followers: 50000 },
      },
    ],
  },
  {
    id: "vacation",
    name: "Take a Vacation",
    emoji: "\u2708\uFE0F",
    description: "Travel content + actual rest",
    category: "lifestyle",
    minMoney: 2000,
    getEffects: () => ({ money: -2000, energy: 5, mentalHealth: 5 }),
    tiers: [
      {
        id: "weekend_trip",
        name: "Weekend Getaway",
        emoji: "\u26FA",
        effects: { money: -2000, energy: 8, mentalHealth: 6, fame: 1 },
      },
      {
        id: "beach_resort",
        name: "Beach Resort",
        emoji: "\uD83C\uDFD6\uFE0F",
        effects: { money: -6000, energy: 12, mentalHealth: 10, fame: 3, followers: 5000 },
      },
      {
        id: "private_island",
        name: "Private Island",
        emoji: "\uD83C\uDFDD\uFE0F",
        effects: { money: -25000, energy: 18, mentalHealth: 15, fame: 7, followers: 20000 },
      },
    ],
  },
  {
    id: "throw_party",
    name: "Throw a Party",
    emoji: "\uD83C\uDF89",
    description: "Invite people, make connections",
    category: "lifestyle",
    minMoney: 3000,
    minFollowers: 5000,
    getEffects: () => ({ money: -3000, fame: 2 }),
    tiers: [
      {
        id: "small_gathering",
        name: "Small Gathering",
        emoji: "\uD83C\uDF7B",
        effects: { money: -3000, reputation: 3, followers: 3000, energy: -5 },
      },
      {
        id: "club_night",
        name: "VIP Club Night",
        emoji: "\uD83C\uDF7E",
        effects: { money: -10000, fame: 5, reputation: 4, followers: 10000, energy: -8 },
      },
      {
        id: "mansion_party",
        name: "Mansion Blowout",
        emoji: "\uD83E\uDD73",
        effects: { money: -35000, fame: 10, reputation: 6, followers: 30000, energy: -12 },
      },
    ],
  },
];
