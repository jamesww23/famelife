import { GameEvent } from "@/lib/game/types";

export const platformEvents: GameEvent[] = [
  {
    id: "shadowban",
    type: "platform",
    title: "Shadowbanned",
    text: "Your reach dropped overnight. You think you've been shadowbanned.",
    weight: 8,
    choices: [
      {
        id: "wait_out",
        text: "Wait it out and post carefully",
        effects: { followers: -2000, mentalHealth: -8 },
      },
      {
        id: "new_account",
        text: "Start a backup account",
        effects: { followers: -5000, energy: -15, reputation: 3 },
      },
    ],
  },
  {
    id: "platform_feature",
    type: "platform",
    title: "Featured by Platform",
    text: "The platform selected you for their official spotlight feature!",
    weight: 6,
    choices: [
      {
        id: "leverage_feature",
        text: "Post daily to maximize the spotlight",
        effects: { followers: 15000, fame: 8, energy: -20 },
      },
      {
        id: "steady_feature",
        text: "Keep your normal posting schedule",
        effects: { followers: 8000, fame: 5, reputation: 5 },
      },
    ],
  },
  {
    id: "new_feature_beta",
    type: "platform",
    title: "Beta Feature Access",
    text: "You got early access to a new platform feature. Being first could mean massive growth.",
    weight: 7,
    choices: [
      {
        id: "go_all_in",
        text: "Go all-in on the new feature",
        effects: { followers: 10000, fame: 5, energy: -10 },
      },
      {
        id: "cautious_test",
        text: "Test it cautiously first",
        effects: { followers: 3000, fame: 2, reputation: 3 },
      },
    ],
  },
  {
    id: "copyright_strike",
    type: "platform",
    title: "Copyright Strike",
    text: "You got a copyright strike on your most popular video. It's been taken down.",
    weight: 7,
    choices: [
      {
        id: "appeal",
        text: "File an appeal",
        effects: { followers: -1000, energy: -10, mentalHealth: -5 },
        followUpText: "The appeal process is slow. You're stuck waiting.",
      },
      {
        id: "repost_edited",
        text: "Re-edit and repost the video",
        effects: { followers: -500, energy: -15 },
      },
    ],
  },
  {
    id: "verification",
    type: "platform",
    title: "Verification Badge",
    text: "You just got verified! The blue checkmark is yours.",
    weight: 5,
    minTier: "rising_influencer",
    choices: [
      {
        id: "celebrate_verify",
        text: "Celebrate publicly with your fans",
        effects: { fame: 8, reputation: 5, followers: 5000 },
      },
      {
        id: "humble_verify",
        text: "Play it cool — just update your bio",
        effects: { fame: 5, reputation: 8 },
      },
    ],
  },
  {
    id: "multi_platform",
    type: "platform",
    title: "Cross-Platform Expansion",
    text: "Your content is starting to get reposted on other platforms. Time to expand?",
    weight: 7,
    minTier: "micro_influencer",
    choices: [
      {
        id: "expand",
        text: "Launch on multiple platforms",
        effects: { followers: 8000, fame: 5, energy: -20, mentalHealth: -8 },
      },
      {
        id: "stay_focused",
        text: "Stay focused on one platform",
        effects: { followers: 2000, energy: 5, reputation: 3 },
      },
    ],
  },
  {
    id: "platform_controversy",
    type: "platform",
    title: "Platform Policy Change",
    text: "The platform changed its monetization policy. Creators are furious.",
    weight: 6,
    choices: [
      {
        id: "protest_video",
        text: "Post a protest video rallying creators",
        effects: { followers: 5000, fame: 5, reputation: 5 },
        setFlags: ["industryRespected"],
      },
      {
        id: "adapt_quietly",
        text: "Adapt quietly and keep posting",
        effects: { money: -500, reputation: -2 },
      },
    ],
  },
];
