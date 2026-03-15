import { GameEvent } from "@/lib/game/types";

export const failureEvents: GameEvent[] = [
  {
    id: "flop_video",
    type: "failure",
    title: "Total Flop",
    text: "Your latest video got almost no views. The algorithm completely ignored you.",
    weight: 9,
    choices: [
      {
        id: "try_harder",
        text: "Immediately try again with a new video",
        effects: { energy: -15, mentalHealth: -8, followers: -500 },
      },
      {
        id: "analyze_learn",
        text: "Analyze what went wrong and adjust",
        effects: { mentalHealth: -3, reputation: 2 },
      },
    ],
  },
  {
    id: "sponsor_fallthrough",
    type: "failure",
    title: "Brand Deal Falls Through",
    text: "A major brand deal you were counting on just fell through at the last minute.",
    weight: 7,
    minTier: "micro_influencer",
    choices: [
      {
        id: "vent_online",
        text: "Vent about brands online (without naming them)",
        effects: { followers: 1000, fame: 2, reputation: -5, money: -500 },
      },
      {
        id: "move_on",
        text: "Move on professionally",
        effects: { mentalHealth: -5, reputation: 3, money: -500 },
      },
    ],
  },
  {
    id: "cringe_moment",
    type: "failure",
    title: "Cringe Compilation",
    text: "Someone made a cringe compilation featuring your content. It has more views than your actual videos.",
    weight: 8,
    choices: [
      {
        id: "laugh_along",
        text: "Laugh along — react to it yourself",
        effects: { followers: 3000, fame: 3, reputation: -2 },
      },
      {
        id: "ignore_cringe",
        text: "Pretend it doesn't exist",
        effects: { mentalHealth: -8, reputation: -1 },
      },
    ],
  },
  {
    id: "burnout_hits",
    type: "failure",
    title: "Burnout Hits Hard",
    text: "You can barely open the camera app. The pressure to constantly create is crushing you.",
    weight: 7,
    statConditions: { mentalHealth: { max: 40 } },
    choices: [
      {
        id: "push_through",
        text: "Push through — your audience needs you",
        effects: { mentalHealth: -15, energy: -20, followers: 1000 },
        setFlags: ["burnoutRisk"],
      },
      {
        id: "take_week_off",
        text: "Take the week off completely",
        effects: { mentalHealth: 10, energy: 20, followers: -3000 },
      },
    ],
  },
  {
    id: "failed_merch",
    type: "failure",
    title: "Merch Disaster",
    text: "Your merch launch flopped. Fans are posting about the terrible quality.",
    weight: 6,
    minTier: "rising_influencer",
    choices: [
      {
        id: "full_refund",
        text: "Offer full refunds and apologize",
        effects: { money: -5000, reputation: 5, mentalHealth: -8 },
      },
      {
        id: "blame_manufacturer",
        text: "Blame the manufacturer publicly",
        effects: { reputation: -8, money: -2000 },
      },
    ],
  },
  {
    id: "impersonator",
    type: "failure",
    title: "Impersonator Scam",
    text: "Someone is impersonating you and scamming your fans. They're losing trust in you.",
    weight: 6,
    minTier: "rising_influencer",
    choices: [
      {
        id: "address_scam",
        text: "Address it immediately and report the impersonator",
        effects: { reputation: 3, followers: -1000, energy: -10 },
      },
      {
        id: "legal_action",
        text: "Pursue legal action",
        effects: { money: -3000, reputation: 5, followers: -500 },
      },
    ],
  },
  {
    id: "comparison_spiral",
    type: "failure",
    title: "Comparison Spiral",
    text: "You've been comparing yourself to other creators all week. Everyone seems to be growing faster.",
    weight: 8,
    choices: [
      {
        id: "double_effort",
        text: "Double your effort — post more, work harder",
        effects: { energy: -20, mentalHealth: -12, followers: 2000 },
        setFlags: ["burnoutRisk"],
      },
      {
        id: "focus_self",
        text: "Unfollow competitors and focus on your own path",
        effects: { mentalHealth: 5, reputation: 3 },
      },
    ],
  },
];
