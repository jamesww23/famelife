import { RewardedBoost } from "@/lib/game/types";

export const rewardedBoosts: RewardedBoost[] = [
  {
    id: "algorithm_boost",
    name: "Algorithm Boost",
    emoji: "🚀",
    description: "Push your content to the For You page!",
    effects: { followers: 15000, fame: 12 },
    triggerCondition: "post_content",
  },
  {
    id: "pr_team",
    name: "PR Crisis Team",
    emoji: "🛡️",
    description: "Hire a crisis team to save your reputation.",
    effects: { reputation: 35, fame: 8 },
    triggerCondition: "post_scandal",
  },
  {
    id: "talent_manager",
    name: "Talent Manager",
    emoji: "🌟",
    description: "Unlock exclusive celebrity opportunities.",
    effects: { fame: 25, money: 6000, reputation: 12 },
    triggerCondition: "celebrity_threshold",
  },
  {
    id: "double_brand_reward",
    name: "Double Deal",
    emoji: "💎",
    description: "Double the payout from your latest brand deal!",
    effects: { money: 9000, reputation: 8 },
    triggerCondition: "brand_deal",
  },
  {
    id: "energy_recovery",
    name: "Energy Boost",
    emoji: "⚡",
    description: "Recharge with a sponsored wellness retreat.",
    effects: { energy: 50, mentalHealth: 20 },
    triggerCondition: "low_energy",
  },
];
