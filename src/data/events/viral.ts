import { GameEvent } from "@/lib/game/types";

export const viralEvents: GameEvent[] = [
  {
    id: "viral_overnight",
    type: "viral",
    title: "Overnight Viral",
    emoji: "🔥",
    text: "You wake up to 2M views. Your phone won't stop buzzing. This is it.",
    weight: 10,
    isSwipeable: true,
    choices: [
      {
        id: "ride_wave",
        text: "Post 5 more videos NOW",
        effects: { followers: 25000, fame: 20, energy: -30, mentalHealth: -10 },
        socialReaction: { type: "comment", text: "OMG you're literally EVERYWHERE rn", author: "@viralwatcher" },
      },
      {
        id: "play_cool",
        text: "Thank fans, plan next move",
        effects: { followers: 12000, fame: 12, reputation: 12 },
        socialReaction: { type: "tweet", text: "love how they're not letting the fame go to their head", author: "@cultured_takes" },
      },
    ],
  },
  {
    id: "duet_famous",
    type: "viral",
    title: "Celebrity Duet",
    emoji: "🤩",
    text: "A celeb with 20M followers just duetted your video. Their fans are flooding in.",
    weight: 7,
    minTier: "micro_influencer",
    choices: [
      {
        id: "duet_back",
        text: "Duet them back, go all in",
        effects: { followers: 35000, fame: 25, energy: -20 },
        setFlags: ["celebrityNoticed"],
        socialReaction: { type: "headline", text: "RISING CREATOR CATCHES CELEBRITY'S EYE" },
      },
      {
        id: "thank_humbly",
        text: "Post a humble thank you",
        effects: { followers: 18000, fame: 12, reputation: 20 },
      },
    ],
  },
  {
    id: "meme_format",
    type: "viral",
    title: "You're a Meme Now",
    emoji: "😂",
    text: "Your face is a meme template. It's on every platform. You can't escape yourself.",
    weight: 8,
    isSwipeable: true,
    choices: [
      {
        id: "lean_into_meme",
        text: "Lean into it HARD",
        effects: { followers: 30000, fame: 18, reputation: -8 },
        socialReaction: { type: "tweet", text: "they really said 'if you can't beat em' 💀", author: "@memepages" },
      },
      {
        id: "ignore_meme",
        text: "Pretend it's not happening",
        effects: { followers: 9000, fame: 8, reputation: 12 },
      },
    ],
  },
  {
    id: "trending_sound",
    type: "viral",
    title: "Your Sound is Trending",
    emoji: "🎵",
    text: "A sound you made is being used by 50K+ creators. You're the origin.",
    weight: 8,
    choices: [
      {
        id: "claim_credit",
        text: "Post about being the OG",
        effects: { followers: 18000, fame: 15, reputation: 5 },
      },
      {
        id: "create_more",
        text: "Drop 3 more sounds",
        effects: { followers: 12000, fame: 10, money: 1500, energy: -20 },
      },
    ],
  },
  {
    id: "news_pickup",
    type: "viral",
    title: "You're on the News",
    emoji: "📺",
    text: "A news outlet is running a segment about you. Your mom just texted a screenshot.",
    weight: 5,
    minTier: "rising_influencer",
    choices: [
      {
        id: "do_interview",
        text: "Accept the interview",
        effects: { followers: 45000, fame: 30, reputation: 12, energy: -20 },
        socialReaction: { type: "headline", text: "INTERNET CREATOR GOES MAINSTREAM" },
      },
      {
        id: "stay_mysterious",
        text: "Decline — stay mysterious",
        effects: { followers: 15000, fame: 15, reputation: 20 },
      },
    ],
  },
  {
    id: "algorithm_blessed",
    type: "viral",
    title: "Algorithm Loves You",
    emoji: "✨",
    text: "Every. Single. Video. Is hitting the FYP. The algorithm chose you today.",
    weight: 9,
    isSwipeable: true,
    choices: [
      {
        id: "post_spam",
        text: "Post everything you have",
        effects: { followers: 20000, fame: 12, energy: -40, mentalHealth: -16 },
      },
      {
        id: "quality_content",
        text: "Drop one perfect video",
        effects: { followers: 15000, fame: 10, reputation: 12 },
      },
    ],
  },
  {
    id: "collab_viral",
    type: "viral",
    title: "Collab Explosion",
    emoji: "💥",
    text: "Your collab just hit 10M views. Both fanbases are going wild.",
    weight: 7,
    choices: [
      {
        id: "series",
        text: "Turn it into a series",
        effects: { followers: 30000, fame: 20, energy: -30 },
        triggerChain: "collab_series",
        socialReaction: { type: "comment", text: "PART 2 WHEN??? 😭", author: "@fan_accounts" },
      },
      {
        id: "solo_followup",
        text: "Post a solo follow-up",
        effects: { followers: 18000, fame: 12, reputation: 8 },
      },
    ],
  },
  {
    id: "react_video_blowup",
    type: "viral",
    title: "React Video Goes Crazy",
    emoji: "😮",
    text: "You reacted to a random video and your reaction is now more viral than the original.",
    weight: 8,
    isSwipeable: true,
    choices: [
      {
        id: "credit_original",
        text: "Credit the original creator",
        effects: { followers: 15000, fame: 10, reputation: 20 },
        setFlags: ["industryRespected"],
      },
      {
        id: "milk_it",
        text: "Make it all about you",
        effects: { followers: 25000, fame: 15, reputation: -12 },
      },
    ],
  },
  {
    id: "challenge_creator",
    type: "viral",
    title: "You Started a Challenge",
    emoji: "🏆",
    text: "A challenge you invented is spreading like wildfire. Even celebs are doing it.",
    weight: 6,
    choices: [
      {
        id: "trademark_it",
        text: "Trademark the name",
        effects: { followers: 25000, fame: 20, money: 6000 },
        socialReaction: { type: "headline", text: "VIRAL CHALLENGE CREATOR CASHES IN" },
      },
      {
        id: "keep_it_free",
        text: "Keep it organic",
        effects: { followers: 35000, fame: 25, reputation: 20 },
        setFlags: ["industryRespected"],
      },
    ],
  },
];
