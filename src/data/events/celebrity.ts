import { GameEvent } from "@/lib/game/types";

export const celebrityEvents: GameEvent[] = [
  {
    id: "celeb_dm",
    type: "celebrity",
    title: "Celebrity DM",
    text: "A major celebrity just DM'd you saying they love your content.",
    weight: 6,
    minTier: "rising_influencer",
    choices: [
      {
        id: "screenshot_post",
        text: "Screenshot and post it (with permission)",
        effects: { followers: 20000, fame: 12, reputation: -3 },
        setFlags: ["celebrityNoticed"],
      },
      {
        id: "keep_private",
        text: "Keep it private — build a real connection",
        effects: { fame: 5, reputation: 5 },
        setFlags: ["celebrityNoticed"],
      },
    ],
  },
  {
    id: "reality_tv_offer",
    type: "celebrity",
    title: "Reality TV Offer",
    text: "A production company wants you for a new reality show about influencers.",
    weight: 5,
    minTier: "internet_star",
    choices: [
      {
        id: "join_show",
        text: "Join the cast",
        effects: { fame: 15, followers: 50000, money: 20000, reputation: -8, mentalHealth: -15 },
      },
      {
        id: "decline_show",
        text: "Decline — reality TV isn't your thing",
        effects: { reputation: 5, mentalHealth: 5 },
      },
    ],
  },
  {
    id: "award_nomination",
    type: "celebrity",
    title: "Award Nomination",
    text: "You've been nominated for Creator of the Year at a major awards show!",
    weight: 4,
    minTier: "internet_star",
    choices: [
      {
        id: "campaign_win",
        text: "Campaign hard to win — rally your fans",
        effects: { fame: 10, followers: 10000, energy: -15 },
      },
      {
        id: "gracious",
        text: "Be gracious — just enjoy the nomination",
        effects: { fame: 5, reputation: 8 },
        setFlags: ["industryRespected"],
      },
    ],
  },
  {
    id: "talk_show_invite",
    type: "celebrity",
    title: "Talk Show Appearance",
    text: "A late-night talk show wants you as a guest. This is mainstream crossover territory.",
    weight: 4,
    minTier: "celebrity",
    choices: [
      {
        id: "nail_appearance",
        text: "Go on and nail the interview",
        effects: { fame: 15, followers: 30000, reputation: 8 },
      },
      {
        id: "awkward_interview",
        text: "Go on but freeze up on camera",
        effects: { fame: 8, reputation: -5, mentalHealth: -10 },
      },
    ],
  },
  {
    id: "celeb_relationship",
    type: "celebrity",
    title: "Celebrity Romance",
    text: "Paparazzi caught you and a celebrity together. The internet is losing its mind.",
    weight: 4,
    minTier: "internet_star",
    choices: [
      {
        id: "confirm_relationship",
        text: "Confirm the relationship publicly",
        effects: { followers: 40000, fame: 15, mentalHealth: -8 },
        setFlags: ["publicRelationship"],
      },
      {
        id: "deny_relationship",
        text: "Deny everything — keep them guessing",
        effects: { followers: 15000, fame: 10, reputation: 3 },
      },
    ],
  },
  {
    id: "movie_cameo",
    type: "celebrity",
    title: "Movie Cameo Offer",
    text: "A director wants you for a cameo in an upcoming movie.",
    weight: 3,
    minTier: "celebrity",
    choices: [
      {
        id: "accept_cameo",
        text: "Accept the cameo role",
        effects: { fame: 12, money: 15000, followers: 20000, energy: -15 },
      },
      {
        id: "push_bigger",
        text: "Push for a bigger role",
        effects: { fame: 5, energy: -10 },
        followUpText: "They said they'd consider you for something bigger next time.",
      },
    ],
  },
  {
    id: "charity_gala",
    type: "celebrity",
    title: "Charity Gala Invite",
    text: "You've been invited to a high-profile charity event with A-list celebrities.",
    weight: 5,
    minTier: "internet_star",
    choices: [
      {
        id: "attend_gala",
        text: "Attend and make a generous donation",
        effects: { fame: 8, reputation: 12, money: -5000, followers: 5000 },
        setFlags: ["industryRespected"],
      },
      {
        id: "attend_cheap",
        text: "Attend but keep the wallet closed",
        effects: { fame: 5, reputation: 3 },
      },
    ],
  },
];
