import { RewardedBoost } from "@/lib/game/types";

export const rewardedBoosts: RewardedBoost[] = [
  {
    id: "algorithm_boost",
    name: "Algorithm Boost",
    emoji: "🚀",
    description: "Push your content to the For You page!",
    effects: { followers: 8000, fame: 8 },
    triggerCondition: "post_content",
  },
  {
    id: "pr_team",
    name: "PR Crisis Team",
    emoji: "🛡️",
    description: "Hire a crisis team to save your reputation.",
    effects: { reputation: 20, fame: 5 },
    triggerCondition: "post_scandal",
  },
  {
    id: "talent_manager",
    name: "Talent Manager",
    emoji: "🌟",
    description: "Unlock exclusive celebrity opportunities.",
    effects: { fame: 15, money: 4000, reputation: 8 },
    triggerCondition: "celebrity_threshold",
  },
  {
    id: "double_brand_reward",
    name: "Double Deal",
    emoji: "💎",
    description: "Double the payout from your latest brand deal!",
    effects: { money: 6000, reputation: 5 },
    triggerCondition: "brand_deal",
  },
  {
    id: "energy_recovery",
    name: "Energy Boost",
    emoji: "⚡",
    description: "Recharge with a sponsored wellness retreat.",
    effects: { energy: 35, mentalHealth: 15 },
    triggerCondition: "low_energy",
  },
  // Risk recovery boosts — offered after risky choices
  {
    id: "pr_recovery",
    name: "PR Recovery",
    emoji: "🧹",
    description: "A crisis PR firm can spin this in your favor.",
    effects: { reputation: 25, mentalHealth: 10, fame: 3 },
    triggerCondition: "post_scandal",
  },
  {
    id: "viral_momentum",
    name: "Viral Momentum",
    emoji: "📈",
    description: "Ride the controversy wave — all press is good press.",
    effects: { followers: 15000, fame: 12 },
    triggerCondition: "post_content",
  },
];
