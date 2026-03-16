import { QuarterlyActivity } from "@/lib/game/types";

// ---- Core work activities (always available) ----

export const workActivities: QuarterlyActivity[] = [
  {
    id: "create_content",
    name: "Create Content",
    emoji: "\uD83D\uDCF9",
    description: "Post videos & grow your audience",
    category: "work",
    getEffects: (state) => {
      const base = Math.max(150, Math.floor(state.stats.followers * 0.012));
      const followerGain = Math.min(base, 4000);
      return { followers: followerGain, fame: 1, energy: -8 };
    },
  },
  {
    id: "engage_community",
    name: "Engage Fans",
    emoji: "\uD83D\uDCAC",
    description: "Reply to comments, go live, connect",
    category: "work",
    getEffects: (state) => {
      const repGain = state.stats.fame > 40 ? 6 : 4;
      return { reputation: repGain, fame: 1, mentalHealth: 3, energy: -6 };
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
        state.stats.followers > 5000
          ? -Math.min(Math.floor(state.stats.followers * 0.005), 2000)
          : 0;
      return { energy: 15, mentalHealth: 10, followers: followerLoss };
    },
  },
  {
    id: "hustle",
    name: "Chase Deals",
    emoji: "\uD83D\uDCBC",
    description: "Pitch brands & negotiate sponsorships",
    category: "work",
    getEffects: (state) => {
      const base = Math.max(300, Math.floor(state.stats.followers * 0.004));
      const moneyGain = Math.min(base, 6000);
      const repLoss = state.stats.followers > 50_000 ? -2 : 0;
      return { money: moneyGain, energy: -8, reputation: repLoss };
    },
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
        effects: { money: -1000, mentalHealth: 3, followers: 200 },
      },
      {
        id: "designer",
        name: "Designer Store",
        emoji: "\uD83D\uDC5C",
        effects: { money: -5000, fame: 2, mentalHealth: 5, followers: 800 },
      },
      {
        id: "full_wardrobe",
        name: "Full Wardrobe Overhaul",
        emoji: "\uD83D\uDC51",
        effects: { money: -20000, fame: 5, mentalHealth: 8, followers: 3000 },
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
        effects: { money: -3000, mentalHealth: 8, fame: 2, followers: 500 },
      },
      {
        id: "yacht_date",
        name: "Private Yacht",
        emoji: "\uD83D\uDEF3\uFE0F",
        effects: { money: -15000, mentalHealth: 12, fame: 6, followers: 3000 },
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
    minFollowers: 5000,
    getEffects: () => ({ money: -5000, fame: 1 }),
    tiers: [
      {
        id: "used_car",
        name: "Used Honda",
        emoji: "\uD83D\uDE99",
        effects: { money: -5000, fame: 1, followers: 500 },
      },
      {
        id: "tesla",
        name: "Tesla",
        emoji: "\u26A1",
        effects: { money: -30000, fame: 5, followers: 3000 },
      },
      {
        id: "lambo",
        name: "Lamborghini",
        emoji: "\uD83C\uDFCE\uFE0F",
        effects: { money: -90000, fame: 14, followers: 10000 },
      },
    ],
  },
  {
    id: "upgrade_home",
    name: "Upgrade Home",
    emoji: "\uD83C\uDFE0",
    description: "Better backdrop, better content",
    category: "lifestyle",
    minMoney: 8000,
    minFollowers: 10000,
    getEffects: () => ({ money: -8000, fame: 2 }),
    tiers: [
      {
        id: "nice_apartment",
        name: "Nice Apartment",
        emoji: "\uD83C\uDFE2",
        effects: { money: -8000, fame: 2, mentalHealth: 5, followers: 1000 },
      },
      {
        id: "penthouse",
        name: "Penthouse",
        emoji: "\uD83C\uDF07",
        effects: { money: -50000, fame: 8, mentalHealth: 10, followers: 5000 },
      },
      {
        id: "mansion",
        name: "Mansion",
        emoji: "\uD83C\uDFF0",
        effects: { money: -150000, fame: 18, mentalHealth: 15, followers: 12000 },
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
        effects: { money: -8000, energy: 12, mentalHealth: 10, fame: 3, followers: 1500 },
      },
      {
        id: "private_island",
        name: "Private Island",
        emoji: "\uD83C\uDFDD\uFE0F",
        effects: { money: -35000, energy: 18, mentalHealth: 15, fame: 7, followers: 6000 },
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
    minFollowers: 10000,
    getEffects: () => ({ money: -3000, fame: 2 }),
    tiers: [
      {
        id: "small_gathering",
        name: "Small Gathering",
        emoji: "\uD83C\uDF7B",
        effects: { money: -3000, reputation: 3, followers: 800, energy: -5 },
      },
      {
        id: "club_night",
        name: "VIP Club Night",
        emoji: "\uD83C\uDF7E",
        effects: { money: -12000, fame: 5, reputation: 4, followers: 3000, energy: -8 },
      },
      {
        id: "mansion_party",
        name: "Mansion Blowout",
        emoji: "\uD83E\uDD73",
        effects: { money: -45000, fame: 10, reputation: 6, followers: 8000, energy: -12 },
      },
    ],
  },
];
