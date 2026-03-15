import { GameEvent } from "@/lib/game/types";

export const recoveryEvents: GameEvent[] = [
  {
    id: "comeback_video",
    type: "recovery",
    title: "Comeback Video",
    text: "After time away, you posted a comeback video. Your loyal fans are rallying behind you.",
    weight: 7,
    statConditions: { mentalHealth: { min: 40 } },
    choices: [
      {
        id: "emotional_return",
        text: "Be raw and emotional — share everything",
        effects: { followers: 10000, fame: 5, reputation: 8, mentalHealth: -5 },
        removeFlags: ["burnoutRisk"],
      },
      {
        id: "fresh_start",
        text: "Fresh start — new content direction",
        effects: { followers: 5000, fame: 3, reputation: 5, mentalHealth: 5 },
        removeFlags: ["burnoutRisk", "scandalProne"],
      },
    ],
  },
  {
    id: "charity_stream",
    type: "recovery",
    title: "Charity Stream",
    text: "You organized a charity livestream. It's your chance to rebuild goodwill.",
    weight: 7,
    choices: [
      {
        id: "all_night",
        text: "Go all night — 24-hour charity stream",
        effects: { reputation: 15, followers: 8000, fame: 5, energy: -25, mentalHealth: -5 },
        setFlags: ["industryRespected"],
      },
      {
        id: "modest_stream",
        text: "Keep it modest but genuine",
        effects: { reputation: 10, followers: 3000, fame: 3, energy: -10 },
      },
    ],
  },
  {
    id: "fan_support",
    type: "recovery",
    title: "Fan Community Rally",
    text: "Your fan community created a support hashtag for you. The love is real.",
    weight: 8,
    choices: [
      {
        id: "thank_fans",
        text: "Post a heartfelt thank you",
        effects: { mentalHealth: 12, reputation: 5, followers: 3000 },
      },
      {
        id: "fan_meetup",
        text: "Organize a fan meetup",
        effects: { mentalHealth: 8, followers: 5000, fame: 3, energy: -10, money: -500 },
      },
    ],
  },
  {
    id: "mentor_opportunity",
    type: "recovery",
    title: "Mentor Figure",
    text: "An established creator reached out to mentor you. They see potential.",
    weight: 6,
    choices: [
      {
        id: "accept_mentor",
        text: "Accept the mentorship",
        effects: { reputation: 8, fame: 5, mentalHealth: 8, money: 1000 },
        setFlags: ["industryRespected"],
      },
      {
        id: "go_alone",
        text: "Thank them but go your own way",
        effects: { reputation: 3, mentalHealth: 3 },
      },
    ],
  },
  {
    id: "rebrand_success",
    type: "recovery",
    title: "Rebrand Success",
    text: "Your rebrand is working. New audience, new energy, and people are taking notice.",
    weight: 6,
    choices: [
      {
        id: "lean_new",
        text: "Double down on the new direction",
        effects: { followers: 8000, fame: 5, reputation: 8, mentalHealth: 5 },
        removeFlags: ["scandalProne"],
      },
      {
        id: "blend_old_new",
        text: "Blend old and new — keep your OG fans too",
        effects: { followers: 5000, fame: 3, reputation: 5, mentalHealth: 3 },
      },
    ],
  },
  {
    id: "therapy_breakthrough",
    type: "recovery",
    title: "Therapy Breakthrough",
    text: "Something clicked in therapy this week. You feel clearer about who you are beyond the content.",
    weight: 6,
    statConditions: { mentalHealth: { max: 60 } },
    choices: [
      {
        id: "share_journey",
        text: "Share your growth journey with followers",
        effects: { mentalHealth: 15, reputation: 8, followers: 3000 },
        removeFlags: ["burnoutRisk"],
      },
      {
        id: "keep_private",
        text: "Keep it private — this is just for you",
        effects: { mentalHealth: 20, energy: 10 },
        removeFlags: ["burnoutRisk"],
      },
    ],
  },
  {
    id: "collab_redemption",
    type: "recovery",
    title: "Redemption Collab",
    text: "A major creator who publicly supported you wants to collaborate. This could change everything.",
    weight: 5,
    requiredFlags: ["scandalProne"],
    choices: [
      {
        id: "accept_collab",
        text: "Accept — this is your redemption arc",
        effects: { followers: 15000, fame: 8, reputation: 10 },
        removeFlags: ["scandalProne"],
      },
      {
        id: "earn_it_first",
        text: "Say you want to earn it on your own first",
        effects: { reputation: 12, mentalHealth: 5, fame: 3 },
      },
    ],
  },
];
