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

// ---- Lifestyle spending activities (unlock with money/fame) ----

export const lifestyleActivities: QuarterlyActivity[] = [
  {
    id: "go_shopping",
    name: "Go Shopping",
    emoji: "\uD83D\uDECD\uFE0F",
    description: "Designer clothes & accessories",
    category: "lifestyle",
    minMoney: 3000,
    getEffects: () => {
      return { money: -3000, fame: 2, mentalHealth: 5, followers: 500 };
    },
  },
  {
    id: "date_night",
    name: "Date Night",
    emoji: "\u2764\uFE0F",
    description: "Hit the town, get spotted",
    category: "lifestyle",
    minMoney: 1500,
    getEffects: (state) => {
      const fameGain = state.stats.fame > 30 ? 3 : 1;
      return { money: -1500, mentalHealth: 8, fame: fameGain, energy: -4 };
    },
  },
  {
    id: "buy_car",
    name: "Buy a Car",
    emoji: "\uD83D\uDE97",
    description: "Flex a new ride for content",
    category: "lifestyle",
    minMoney: 15000,
    minFollowers: 10000,
    getEffects: () => {
      return { money: -15000, fame: 5, followers: 3000 };
    },
  },
  {
    id: "upgrade_home",
    name: "Upgrade Home",
    emoji: "\uD83C\uDFE0",
    description: "Better backdrop, better content",
    category: "lifestyle",
    minMoney: 25000,
    minFollowers: 50000,
    getEffects: () => {
      return { money: -25000, fame: 6, mentalHealth: 10, followers: 4000 };
    },
  },
  {
    id: "vacation",
    name: "Take a Vacation",
    emoji: "\u2708\uFE0F",
    description: "Travel content + actual rest",
    category: "lifestyle",
    minMoney: 5000,
    getEffects: () => {
      return { money: -5000, energy: 12, mentalHealth: 10, fame: 2, followers: 1000 };
    },
  },
  {
    id: "throw_party",
    name: "Throw a Party",
    emoji: "\uD83C\uDF89",
    description: "Invite creators, make connections",
    category: "lifestyle",
    minMoney: 8000,
    minFollowers: 25000,
    getEffects: () => {
      return { money: -8000, fame: 4, reputation: 5, followers: 2500, energy: -8 };
    },
  },
];
