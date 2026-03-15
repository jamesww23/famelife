import { GameEvent } from "@/lib/game/types";

export const viralEvents: GameEvent[] = [
  {
    id: "viral_overnight",
    type: "viral",
    title: "Overnight Viral",
    text: "Your latest video exploded overnight. You wake up to millions of views and thousands of new followers.",
    weight: 10,
    choices: [
      {
        id: "ride_wave",
        text: "Ride the wave — post more immediately",
        effects: { followers: 8000, fame: 8, energy: -15, mentalHealth: -5 },
      },
      {
        id: "play_cool",
        text: "Play it cool — thank followers and plan next move",
        effects: { followers: 4000, fame: 5, reputation: 5 },
      },
    ],
  },
  {
    id: "duet_famous",
    type: "viral",
    title: "Famous Duet",
    text: "A celebrity duetted your video. Their fans are flooding your page.",
    weight: 7,
    minTier: "micro_influencer",
    choices: [
      {
        id: "duet_back",
        text: "Duet them back with your best content",
        effects: { followers: 12000, fame: 10, energy: -10 },
        setFlags: ["celebrityNoticed"],
      },
      {
        id: "thank_humbly",
        text: "Post a humble thank you video",
        effects: { followers: 6000, fame: 5, reputation: 8 },
      },
    ],
  },
  {
    id: "meme_format",
    type: "viral",
    title: "You Became a Meme",
    text: "A screenshot from your video became a viral meme template. You're everywhere.",
    weight: 8,
    choices: [
      {
        id: "lean_into_meme",
        text: "Lean into it — make meme content about yourself",
        effects: { followers: 10000, fame: 7, reputation: -3 },
      },
      {
        id: "ignore_meme",
        text: "Ignore it and keep posting normal content",
        effects: { followers: 3000, fame: 3, reputation: 5 },
      },
    ],
  },
  {
    id: "trending_sound",
    type: "viral",
    title: "Trending Sound Creator",
    text: "A sound you created is being used by thousands of other creators.",
    weight: 8,
    choices: [
      {
        id: "claim_credit",
        text: "Post about being the original creator",
        effects: { followers: 6000, fame: 6, reputation: 2 },
      },
      {
        id: "create_more",
        text: "Quickly create more original sounds",
        effects: { followers: 4000, fame: 4, money: 500, energy: -10 },
      },
    ],
  },
  {
    id: "news_pickup",
    type: "viral",
    title: "News Coverage",
    text: "A major news outlet featured your content in a segment about internet culture.",
    weight: 5,
    minTier: "rising_influencer",
    choices: [
      {
        id: "do_interview",
        text: "Agree to a follow-up interview",
        effects: { followers: 15000, fame: 12, reputation: 5, energy: -10 },
      },
      {
        id: "stay_mysterious",
        text: "Decline press — stay mysterious",
        effects: { followers: 5000, fame: 6, reputation: 8 },
      },
    ],
  },
  {
    id: "algorithm_blessed",
    type: "viral",
    title: "Algorithm Blessed",
    text: "The algorithm is pushing everything you post. Every video is hitting the For You page.",
    weight: 9,
    choices: [
      {
        id: "post_spam",
        text: "Post as much as possible while it lasts",
        effects: { followers: 7000, fame: 5, energy: -20, mentalHealth: -8 },
      },
      {
        id: "quality_content",
        text: "Focus on one high-quality piece",
        effects: { followers: 5000, fame: 4, reputation: 5 },
      },
    ],
  },
  {
    id: "collab_viral",
    type: "viral",
    title: "Collab Goes Viral",
    text: "A collaboration video you did just went massively viral. Both fanbases are going wild.",
    weight: 7,
    choices: [
      {
        id: "series",
        text: "Turn it into a series",
        effects: { followers: 10000, fame: 8, energy: -15 },
      },
      {
        id: "solo_followup",
        text: "Post a solo follow-up to capitalize",
        effects: { followers: 6000, fame: 5, reputation: 3 },
      },
    ],
  },
];
