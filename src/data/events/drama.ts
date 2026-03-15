import { GameEvent } from "@/lib/game/types";

export const dramaEvents: GameEvent[] = [
  {
    id: "cancelled_tweet",
    type: "drama",
    title: "Old Tweet Resurfaces",
    text: "Someone dug up an embarrassing tweet from years ago. It's spreading fast.",
    weight: 8,
    choices: [
      {
        id: "apologize",
        text: "Post a sincere apology",
        effects: { reputation: -5, fame: 3, mentalHealth: -10 },
        setFlags: ["scandalProne"],
      },
      {
        id: "double_down",
        text: "Double down and say it was taken out of context",
        effects: { reputation: -15, fame: 8, followers: 3000 },
        setFlags: ["scandalProne"],
      },
    ],
  },
  {
    id: "rival_callout",
    type: "drama",
    title: "Rival Calls You Out",
    text: "Another creator posted a callout video about you. The comments are brutal.",
    weight: 9,
    choices: [
      {
        id: "respond_video",
        text: "Fire back with a response video",
        effects: { followers: 5000, fame: 6, reputation: -8 },
        setFlags: ["startedFeud"],
      },
      {
        id: "take_high_road",
        text: "Take the high road — don't respond",
        effects: { reputation: 5, mentalHealth: -5, followers: -1000 },
      },
    ],
  },
  {
    id: "fake_rumor",
    type: "drama",
    title: "Fake Rumor Spreads",
    text: "A completely false rumor about you is going viral on gossip accounts.",
    weight: 8,
    choices: [
      {
        id: "deny_publicly",
        text: "Deny it publicly with receipts",
        effects: { reputation: 5, fame: 4, energy: -10 },
      },
      {
        id: "let_it_go",
        text: "Ignore it and let it die down",
        effects: { reputation: -3, mentalHealth: -8 },
      },
    ],
  },
  {
    id: "exposed_dm",
    type: "drama",
    title: "Private DMs Leaked",
    text: "Someone leaked your private messages. They're not great.",
    weight: 6,
    minTier: "micro_influencer",
    choices: [
      {
        id: "own_it",
        text: "Own it — post about privacy violations",
        effects: { reputation: -5, fame: 5, followers: 2000 },
      },
      {
        id: "deny_fake",
        text: "Claim the DMs are fabricated",
        effects: { reputation: -10, fame: 3 },
        setFlags: ["scandalProne"],
      },
    ],
  },
  {
    id: "public_breakup",
    type: "drama",
    title: "Public Breakup",
    text: "Your relationship just ended and the internet is picking sides.",
    weight: 6,
    requiredFlags: ["publicRelationship"],
    choices: [
      {
        id: "emotional_video",
        text: "Post an emotional breakup video",
        effects: { followers: 8000, fame: 5, mentalHealth: -15 },
        removeFlags: ["publicRelationship"],
      },
      {
        id: "stay_private",
        text: "Keep it private — post a brief statement",
        effects: { reputation: 5, mentalHealth: -8 },
        removeFlags: ["publicRelationship"],
      },
    ],
  },
  {
    id: "plagiarism_accusation",
    type: "drama",
    title: "Plagiarism Accusation",
    text: "A smaller creator says you copied their content concept. Their fans are angry.",
    weight: 7,
    minTier: "rising_influencer",
    choices: [
      {
        id: "credit_them",
        text: "Credit them publicly and collaborate",
        effects: { reputation: 10, followers: 1000, money: -200 },
        setFlags: ["industryRespected"],
      },
      {
        id: "dismiss",
        text: "Dismiss it — ideas aren't original",
        effects: { reputation: -8, fame: 2, followers: -500 },
      },
    ],
  },
  {
    id: "feud_escalation",
    type: "drama",
    title: "Feud Goes Nuclear",
    text: "Your ongoing feud just escalated. They posted a full exposé video about you.",
    weight: 7,
    requiredFlags: ["startedFeud"],
    choices: [
      {
        id: "expose_back",
        text: "Post your own exposé with receipts",
        effects: { followers: 15000, fame: 10, reputation: -15, mentalHealth: -10 },
      },
      {
        id: "end_feud",
        text: "End it — post a reconciliation video",
        effects: { reputation: 12, mentalHealth: 5, fame: 3 },
        removeFlags: ["startedFeud"],
        setFlags: ["industryRespected"],
      },
    ],
  },
  {
    id: "cancel_mob",
    type: "drama",
    title: "Cancel Culture Strikes",
    text: "A coordinated group is trying to get you cancelled. Hashtags are trending.",
    weight: 5,
    minTier: "rising_influencer",
    choices: [
      {
        id: "address_head_on",
        text: "Go live and address everything directly",
        effects: { fame: 8, reputation: -5, energy: -15, mentalHealth: -12 },
      },
      {
        id: "go_dark",
        text: "Go dark for a week — let it blow over",
        effects: { followers: -5000, reputation: 3, mentalHealth: -5 },
      },
    ],
  },
];
