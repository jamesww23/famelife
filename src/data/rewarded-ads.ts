import { RewardedAd } from "@/lib/game/types";

export const rewardedAds: RewardedAd[] = [
  {
    id: "algorithm_boost",
    name: "Algorithm Boost",
    description: "Push your content to the For You page!",
    effects: { followers: 5000, fame: 5 },
    triggerCondition: "post_content",
  },
  {
    id: "pr_team",
    name: "PR Team",
    description: "Hire a crisis management team to reduce scandal damage.",
    effects: { reputation: 15, fame: 3 },
    triggerCondition: "post_scandal",
  },
  {
    id: "talent_manager",
    name: "Talent Manager",
    description: "Unlock exclusive celebrity opportunities.",
    effects: { fame: 10, money: 2000, reputation: 5 },
    triggerCondition: "celebrity_threshold",
  },
  {
    id: "double_brand_reward",
    name: "Double Brand Deal Reward",
    description: "Double the payout from your latest brand deal!",
    effects: { money: 3000, reputation: 3 },
    triggerCondition: "brand_deal",
  },
  {
    id: "energy_recovery",
    name: "Energy Recovery",
    description: "Recharge with a sponsored wellness retreat.",
    effects: { energy: 40, mentalHealth: 10 },
    triggerCondition: "low_energy",
  },
];
