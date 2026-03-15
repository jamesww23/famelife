import { GameEvent } from "@/lib/game/types";

export const lifestyleEvents: GameEvent[] = [
  // === CELEB ROMANCE CHAIN (step 2 - continues from celebrity.ts) ===
  {
    id: "celeb_paparazzi",
    type: "lifestyle",
    title: "Paparazzi Everywhere",
    emoji: "📸",
    text: "Photos of you and the celeb are EVERYWHERE. TMZ is calling. Your phone has 999+ notifications.",
    weight: 8,
    requiredFlags: ["publicRelationship"],
    chainId: "celeb_romance",
    chainStep: 2,
    choices: [
      {
        id: "go_public",
        text: "Make it Instagram official",
        effects: { followers: 60000, fame: 38, mentalHealth: -10, reputation: 8 },
        socialReaction: { type: "headline", text: "IT'S OFFICIAL: INTERNET STAR AND A-LISTER ARE DATING" },
      },
      {
        id: "break_it_off",
        text: "This is too much, end it",
        effects: { followers: 15000, fame: 20, mentalHealth: -30, reputation: 13 },
        removeFlags: ["publicRelationship"],
        socialReaction: { type: "tweet", text: "they chose peace over clout. actually heartbreaking.", author: "@relationshiptakes" },
      },
    ],
  },

  // === STANDALONE LIFESTYLE EVENTS ===
  {
    id: "burnout_hitting",
    type: "lifestyle",
    title: "Burnout is Real",
    emoji: "😩",
    text: "You haven't left your room in 5 days. The content calendar is screaming. You feel... nothing.",
    weight: 10,
    statConditions: { mentalHealth: { max: 40 } },
    choices: [
      {
        id: "push_through",
        text: "Content doesn't make itself",
        effects: { followers: 6000, energy: -30, mentalHealth: -20 },
        setFlags: ["burnoutRisk"],
        followUpText: "You post through the pain. It works. For now.",
      },
      {
        id: "take_real_break",
        text: "Take a full week off",
        effects: { followers: -9000, energy: 50, mentalHealth: 40 },
        removeFlags: ["burnoutRisk"],
        socialReaction: { type: "comment", text: "take all the time you need, we'll be here ❤️", author: "@supportivefan" },
      },
    ],
  },
  {
    id: "luxury_lifestyle",
    type: "lifestyle",
    title: "Lifestyle Creep",
    emoji: "🏠",
    text: "You just moved into a $8K/month apartment for the aesthetic. Content looks incredible though.",
    weight: 7,
    minTier: "rising_influencer",
    choices: [
      {
        id: "flex_apartment",
        text: "Give the full apartment tour",
        effects: { followers: 18000, fame: 13, money: -9000, reputation: -8 },
        socialReaction: { type: "comment", text: "must be nice... *cries in studio apartment*", author: "@relatable_fan" },
      },
      {
        id: "keep_it_humble",
        text: "Don't flaunt it",
        effects: { money: -9000, reputation: 13 },
      },
    ],
  },
  {
    id: "therapy_session",
    type: "lifestyle",
    title: "Going to Therapy",
    emoji: "🧠",
    text: "Your therapist says you need to separate your self-worth from your follower count. Easier said than done.",
    weight: 8,
    statConditions: { mentalHealth: { max: 50 } },
    isSwipeable: true,
    choices: [
      {
        id: "commit_to_therapy",
        text: "Take it seriously",
        effects: { mentalHealth: 40, energy: 20, money: -1500 },
        removeFlags: ["burnoutRisk"],
        followUpText: "It's not a quick fix but you feel lighter already.",
      },
      {
        id: "skip_therapy",
        text: "No time, too busy posting",
        effects: { mentalHealth: -10, energy: -10 },
        setFlags: ["burnoutRisk"],
      },
    ],
  },
  {
    id: "fan_meetup",
    type: "lifestyle",
    title: "Fan Meetup",
    emoji: "🤗",
    text: "You're doing your first IRL fan meetup. 500 people showed up. Some are crying.",
    weight: 8,
    minTier: "rising_influencer",
    choices: [
      {
        id: "stay_for_everyone",
        text: "Meet every single person",
        effects: { followers: 15000, reputation: 25, energy: -40, mentalHealth: 20 },
        socialReaction: { type: "tweet", text: "they stayed 4 EXTRA HOURS to meet everyone. that's a real one.", author: "@attendee_fan" },
      },
      {
        id: "set_boundaries",
        text: "Do a quick meet then bounce",
        effects: { followers: 6000, reputation: 8, energy: -10 },
      },
    ],
  },
  {
    id: "family_concerned",
    type: "lifestyle",
    title: "Family Intervention",
    emoji: "👨‍👩‍👧",
    text: "Your parents sat you down. 'This influencer thing... is it a real job?' Thanksgiving is ruined.",
    weight: 9,
    choices: [
      {
        id: "show_the_numbers",
        text: "Show them your income",
        effects: { mentalHealth: 10, reputation: 8 },
        followUpText: "Dad is now your biggest fan. Mom wants you to post more.",
      },
      {
        id: "get_frustrated",
        text: "They'll never understand",
        effects: { mentalHealth: -20 },
        followUpText: "The argument didn't help anyone. Maybe next Thanksgiving.",
      },
    ],
  },
  {
    id: "creator_house",
    type: "lifestyle",
    title: "Creator House Invite",
    emoji: "🏡",
    text: "You got invited to move into a content house with 6 other creators. 24/7 content machine.",
    weight: 7,
    minTier: "micro_influencer",
    choices: [
      {
        id: "move_in",
        text: "Move in, let's go!",
        effects: { followers: 24000, fame: 13, mentalHealth: -16, energy: -20 },
        socialReaction: { type: "tweet", text: "THEY JOINED THE HOUSE OMG the content is about to be insane", author: "@housefandom" },
      },
      {
        id: "value_sanity",
        text: "I need my own space",
        effects: { mentalHealth: 10, reputation: 8 },
        followUpText: "Introvert wins. Your peace of mind is non-negotiable.",
      },
    ],
  },
  {
    id: "hate_comments",
    type: "lifestyle",
    title: "Hate Comment Spiral",
    emoji: "💔",
    text: "You made the mistake of reading the comments. 'Ugly.' 'Overrated.' 'Should quit.' It stings.",
    weight: 10,
    choices: [
      {
        id: "respond_with_humor",
        text: "Make a video clapping back",
        effects: { followers: 12000, fame: 8, mentalHealth: -10 },
        socialReaction: { type: "comment", text: "the way they turned hate into content 😂 UNBOTHERED", author: "@supportive_army" },
      },
      {
        id: "turn_off_comments",
        text: "Turn off comments, heal",
        effects: { mentalHealth: 20, followers: -3000 },
        followUpText: "Silence. Sweet silence. You didn't realize how much you needed this.",
      },
    ],
  },
];
