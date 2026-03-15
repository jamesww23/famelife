import { GameEvent } from "@/lib/game/types";

export const brandEvents: GameEvent[] = [
  {
    id: "brand_deal_offer",
    type: "brand",
    title: "Brand Deal Offer",
    text: "A mid-tier brand wants to sponsor your next three posts. The money's decent.",
    weight: 10,
    minTier: "micro_influencer",
    choices: [
      {
        id: "accept_deal",
        text: "Accept the deal",
        effects: { money: 2000, reputation: 3, followers: 500 },
        setFlags: ["brandSafe"],
      },
      {
        id: "negotiate_higher",
        text: "Negotiate for a higher rate",
        effects: { money: 4000, reputation: 2, energy: -5 },
        followUpText: "They agreed to your higher rate. Nice negotiation.",
      },
    ],
  },
  {
    id: "luxury_brand",
    type: "brand",
    title: "Luxury Brand Partnership",
    text: "A luxury fashion brand wants you as an ambassador. This is huge for your image.",
    weight: 5,
    minTier: "internet_star",
    choices: [
      {
        id: "accept_luxury",
        text: "Accept — become a brand ambassador",
        effects: { money: 10000, fame: 8, reputation: 10, followers: 5000 },
        setFlags: ["brandSafe", "industryRespected"],
      },
      {
        id: "too_corporate",
        text: "Decline — it feels too corporate for your brand",
        effects: { reputation: 5, mentalHealth: 3 },
      },
    ],
  },
  {
    id: "scam_brand",
    type: "brand",
    title: "Sketchy Brand Deal",
    text: "A brand is offering you a lot of money, but the product seems... questionable.",
    weight: 8,
    minTier: "micro_influencer",
    choices: [
      {
        id: "take_money",
        text: "Take the money — a deal is a deal",
        effects: { money: 5000, reputation: -12, followers: -2000 },
        setFlags: ["scandalProne"],
      },
      {
        id: "decline_sketch",
        text: "Decline — protect your reputation",
        effects: { reputation: 8, money: 0 },
        setFlags: ["brandSafe"],
      },
    ],
  },
  {
    id: "brand_trip",
    type: "brand",
    title: "Brand Trip Invite",
    text: "You've been invited on an all-expenses-paid brand trip to Bali with other influencers.",
    weight: 7,
    minTier: "rising_influencer",
    choices: [
      {
        id: "go_trip",
        text: "Go on the trip",
        effects: { money: 3000, fame: 5, followers: 3000, energy: -10, mentalHealth: 5 },
      },
      {
        id: "skip_trip",
        text: "Skip it — too much drama on brand trips",
        effects: { energy: 10, reputation: 3 },
      },
    ],
  },
  {
    id: "merch_success",
    type: "brand",
    title: "Merch Sells Out",
    text: "Your merchandise drop sold out in 2 hours. Your fans are dedicated.",
    weight: 6,
    minTier: "rising_influencer",
    choices: [
      {
        id: "restock",
        text: "Announce a restock with new designs",
        effects: { money: 8000, followers: 2000, fame: 5, energy: -10 },
      },
      {
        id: "limited_edition",
        text: "Keep it limited edition — build hype",
        effects: { money: 3000, fame: 8, reputation: 5 },
      },
    ],
  },
  {
    id: "brand_backlash",
    type: "brand",
    title: "Brand Deal Backlash",
    text: "Fans are calling your latest sponsored post inauthentic. The comments are rough.",
    weight: 7,
    requiredFlags: ["brandSafe"],
    choices: [
      {
        id: "defend_brand",
        text: "Defend the partnership — you genuinely use the product",
        effects: { reputation: -3, money: 500, followers: -1000 },
      },
      {
        id: "drop_brand",
        text: "End the partnership publicly",
        effects: { reputation: 8, money: -2000, followers: 1000 },
        removeFlags: ["brandSafe"],
      },
    ],
  },
  {
    id: "podcast_sponsor",
    type: "brand",
    title: "Podcast Launch Sponsor",
    text: "A major brand wants to sponsor your new podcast. It's a 6-figure deal.",
    weight: 4,
    minTier: "internet_star",
    choices: [
      {
        id: "launch_podcast",
        text: "Launch the podcast with their sponsorship",
        effects: { money: 15000, fame: 7, followers: 5000, energy: -20 },
      },
      {
        id: "not_ready",
        text: "You're not ready for a podcast — pass",
        effects: { energy: 5, mentalHealth: 3 },
      },
    ],
  },
];
