import { GameEvent } from "@/lib/game/types";

export const platformEvents: GameEvent[] = [
  {
    id: "algorithm_nerf",
    type: "platform",
    title: "Algorithm Apocalypse",
    emoji: "📉",
    text: "The platform just changed the algorithm. Your reach dropped 80% overnight. Nobody can see you.",
    weight: 10,
    minTier: "micro_influencer",
    choices: [
      {
        id: "adapt_content",
        text: "Study the new algo, adapt",
        effects: { followers: 6000, fame: 5, energy: -30, reputation: 8 },
        followUpText: "You crack the code. Your reach slowly comes back.",
      },
      {
        id: "complain_publicly",
        text: "Rant about it publicly",
        effects: { followers: 12000, fame: 8, reputation: -8, energy: -10 },
        socialReaction: { type: "tweet", text: "every creator rn: 'WHY DID MY VIEWS DROP' 😂", author: "@algorithm_watch" },
      },
    ],
  },
  {
    id: "new_platform_launch",
    type: "platform",
    title: "New Platform Just Dropped",
    emoji: "📱",
    text: "A new social app is blowing up. Early creators are getting massive organic reach. Jump in?",
    weight: 9,
    choices: [
      {
        id: "early_adopter",
        text: "Be an early adopter",
        effects: { followers: 24000, fame: 13, energy: -20 },
        followUpText: "You're one of the first big accounts. The OG advantage is real.",
        socialReaction: { type: "comment", text: "they're already huge on here lol first mover wins", author: "@newplatformfan" },
      },
      {
        id: "wait_and_see",
        text: "Wait, could be another Vine",
        effects: { reputation: 8 },
        followUpText: "Three months later the app has 200M users. Oops.",
      },
    ],
  },
  {
    id: "shadowban_scare",
    type: "platform",
    title: "Shadowbanned?!",
    emoji: "👻",
    text: "Your last 5 posts got zero engagement. Either the algorithm hates you or you're shadowbanned.",
    weight: 9,
    choices: [
      {
        id: "take_break_shadowban",
        text: "Take a 3-day break",
        effects: { energy: 30, mentalHealth: 20, followers: -3000 },
        followUpText: "You come back and your reach is normal. The algorithm is fickle.",
      },
      {
        id: "post_more",
        text: "Post 10x more to fight it",
        effects: { followers: 9000, energy: -40, mentalHealth: -20 },
        setFlags: ["burnoutRisk"],
      },
    ],
  },
  {
    id: "verification_badge",
    type: "platform",
    title: "Verified! (Maybe)",
    emoji: "✅",
    text: "The platform is offering verification for $8/month. Your fans expect the blue check.",
    weight: 8,
    minTier: "micro_influencer",
    isSwipeable: true,
    choices: [
      {
        id: "pay_for_check",
        text: "Fine, take my money",
        effects: { money: -600, fame: 8, followers: 6000 },
        socialReaction: { type: "comment", text: "can't believe they actually paid for the check 💀", author: "@freebadge_era" },
      },
      {
        id: "refuse_to_pay",
        text: "Checks are meaningless now",
        effects: { reputation: 13, followers: 3000 },
        socialReaction: { type: "tweet", text: "honestly respect for not paying for clout", author: "@realtalk" },
      },
    ],
  },
  {
    id: "platform_outage",
    type: "platform",
    title: "Platform is Down",
    emoji: "🔧",
    text: "The whole platform is down. Millions of creators are in withdrawal. You have free time for once.",
    weight: 8,
    choices: [
      {
        id: "touch_grass",
        text: "Go outside for once",
        effects: { energy: 40, mentalHealth: 30 },
        followUpText: "You see the sun. You forgot what that looked like.",
      },
      {
        id: "flood_other_platforms",
        text: "Post everywhere else",
        effects: { followers: 9000, fame: 5, energy: -20 },
        socialReaction: { type: "tweet", text: "all the creators migrating rn is chaos 😂", author: "@platformwars" },
      },
    ],
  },
  {
    id: "content_strike",
    type: "platform",
    title: "Copyright Strike",
    emoji: "⚠️",
    text: "You got a copyright strike on your most popular video. One more and your account is toast.",
    weight: 8,
    minTier: "micro_influencer",
    choices: [
      {
        id: "appeal_strike",
        text: "Appeal it with proof",
        effects: { energy: -20, reputation: 8 },
        followUpText: "After 2 weeks of stress, the appeal works. You're safe.",
      },
      {
        id: "delete_and_repost",
        text: "Delete and re-edit it",
        effects: { followers: -6000, energy: -20 },
        followUpText: "You lose the view count but at least your account survives.",
      },
    ],
  },
  {
    id: "creator_fund",
    type: "platform",
    title: "Creator Fund Payout",
    emoji: "💸",
    text: "The platform's creator fund just paid you. For 2 million views you got... $47.",
    weight: 9,
    minTier: "micro_influencer",
    choices: [
      {
        id: "rant_about_pay",
        text: "Post about how insulting this is",
        effects: { followers: 15000, fame: 8, reputation: 8 },
        socialReaction: { type: "tweet", text: "2M views = $47 this is actually criminal 😭", author: "@creatoreconomy" },
      },
      {
        id: "diversify_income",
        text: "Focus on other revenue",
        effects: { money: 3000, reputation: 8, energy: -10 },
        followUpText: "Patreon, merch, sponsors. The real money was never in the fund.",
      },
    ],
  },
];
