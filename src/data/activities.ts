import { QuarterlyActivity } from "@/lib/game/types";

// ---- Core work activities (always available) ----
// Tuned for fast growth:
//   Early (~1K followers):  5K-8K followers/turn
//   Mid (~100K followers):  20K-50K/turn
//   Late (~1M followers):   100K-300K/turn

export const workActivities: QuarterlyActivity[] = [
  {
    id: "create_content",
    name: "Create Content",
    emoji: "\uD83D\uDCF9",
    description: "Post videos & grow your audience",
    category: "work",
    getEffects: (state) => {
      const f = state.stats.followers;
      // Base 5K, scales 5% of followers, soft-caps via diminishing returns
      const base = 5000 + Math.floor(f * 0.05);
      const followerGain = f < 500_000
        ? base
        : Math.floor(base * 0.7 + f * 0.02); // diminish above 500K
      return { followers: followerGain, fame: 2, energy: -8 };
    },
  },
  {
    id: "engage_community",
    name: "Engage Fans",
    emoji: "\uD83D\uDCAC",
    description: "Reply to comments, go live, connect",
    category: "work",
    getEffects: (state) => {
      const repGain = state.stats.fame > 40 ? 8 : 5;
      const followerGain = Math.max(2000, Math.floor(state.stats.followers * 0.02));
      return { followers: followerGain, reputation: repGain, fame: 1, mentalHealth: 3, energy: -6 };
    },
  },
  {
    id: "rest",
    name: "Rest & Recharge",
    emoji: "\uD83D\uDECB\uFE0F",
    description: "Take care of yourself",
    category: "work",
    getEffects: (state) => {
      const followerLoss =
        state.stats.followers > 10000
          ? -Math.min(Math.floor(state.stats.followers * 0.003), 5000)
          : 0;
      return { energy: 18, mentalHealth: 12, followers: followerLoss };
    },
  },
  {
    id: "hustle",
    name: "Chase Deals",
    emoji: "\uD83D\uDCBC",
    description: "Pitch brands & negotiate sponsorships",
    category: "work",
    getEffects: (state) => {
      const f = state.stats.followers;
      // Base $2K, scales with followers
      const base = 2000 + Math.floor(f * 0.02);
      const moneyGain = f < 500_000
        ? base
        : Math.floor(base * 0.6 + f * 0.01);
      const repLoss = f > 100_000 ? -2 : 0;
      return { money: moneyGain, energy: -8, reputation: repLoss };
    },
  },
];

// ---- Flex content activities (require luxury purchases) ----

export const flexActivities: QuarterlyActivity[] = [
  {
    id: "flex_ride",
    name: "Flex Your Ride",
    emoji: "🏎️",
    description: "Film with your sports car",
    category: "lifestyle",
    requiresPurchases: ["sports_car"],
    getEffects: () => ({ followers: 8000, fame: 3, reputation: -3 }),
    tiers: [
      {
        id: "full_flex",
        name: "Full Flex Video",
        emoji: "📹",
        effects: { followers: 15000, fame: 5, reputation: -6, energy: -8 },
      },
      {
        id: "subtle_flex",
        name: "Subtle Background Flex",
        emoji: "😏",
        effects: { followers: 6000, fame: 2, reputation: 3 },
      },
    ],
  },
  {
    id: "flex_penthouse",
    name: "Penthouse Tour",
    emoji: "🌇",
    description: "Tour your luxury penthouse on camera",
    category: "lifestyle",
    requiresPurchases: ["penthouse"],
    getEffects: () => ({ followers: 10000, fame: 4 }),
    tiers: [
      {
        id: "full_tour",
        name: "Full Crib Tour",
        emoji: "🎥",
        effects: { followers: 20000, fame: 6, reputation: -4, energy: -8 },
      },
      {
        id: "tasteful_shots",
        name: "Tasteful Shots Only",
        emoji: "📸",
        effects: { followers: 8000, fame: 3, reputation: 5 },
      },
    ],
  },
  {
    id: "flex_yacht",
    name: "Yacht Day Content",
    emoji: "🛥️",
    description: "Invite creators aboard for content",
    category: "lifestyle",
    requiresPurchases: ["yacht"],
    getEffects: () => ({ followers: 15000, fame: 5 }),
    tiers: [
      {
        id: "yacht_party",
        name: "Yacht Party Video",
        emoji: "🎉",
        effects: { followers: 30000, fame: 8, reputation: -5, energy: -12, money: -5000 },
      },
      {
        id: "yacht_collab",
        name: "Chill Collab Session",
        emoji: "🤝",
        effects: { followers: 15000, fame: 4, reputation: 5, energy: -6 },
      },
    ],
  },
  {
    id: "flex_jet",
    name: "Private Jet Content",
    emoji: "✈️",
    description: "Film from 40,000 feet",
    category: "lifestyle",
    requiresPurchases: ["private_jet"],
    getEffects: () => ({ followers: 25000, fame: 8 }),
    tiers: [
      {
        id: "jet_flex",
        name: "Full Luxury Vlog",
        emoji: "💎",
        effects: { followers: 50000, fame: 10, reputation: -8, energy: -10 },
      },
      {
        id: "jet_travel",
        name: "Travel Content",
        emoji: "🌍",
        effects: { followers: 20000, fame: 5, reputation: 5, energy: -8, mentalHealth: 8 },
      },
    ],
  },
  {
    id: "flex_wardrobe",
    name: "Outfit of the Day",
    emoji: "👗",
    description: "Show off your designer wardrobe",
    category: "lifestyle",
    requiresPurchases: ["designer_wardrobe"],
    getEffects: () => ({ followers: 5000, fame: 2 }),
    tiers: [
      {
        id: "full_haul",
        name: "Designer Haul Video",
        emoji: "🛍️",
        effects: { followers: 10000, fame: 4, reputation: -3, energy: -6 },
      },
      {
        id: "style_tips",
        name: "Style Tips & Fits",
        emoji: "✨",
        effects: { followers: 6000, fame: 2, reputation: 5 },
      },
    ],
  },
];

// ---- Lifestyle spending activities with tiered choices ----

export const lifestyleActivities: QuarterlyActivity[] = [
  {
    id: "go_shopping",
    name: "Go Shopping",
    emoji: "🛍️",
    description: "Treat yourself to new fits",
    category: "lifestyle",
    minMoney: 500,
    getEffects: () => ({ money: -500, mentalHealth: 2 }),
    tiers: [
      { id: "thrift", name: "Thrift Store Haul", emoji: "👚", effects: { money: -500, mentalHealth: 2, followers: 300 } },
      { id: "fast_fashion", name: "Fast Fashion Run", emoji: "🛒", effects: { money: -1500, mentalHealth: 3, followers: 1000 } },
      { id: "mall_spree", name: "Mall Shopping Spree", emoji: "🏬", effects: { money: -3000, mentalHealth: 4, fame: 1, followers: 2000 } },
      { id: "designer_store", name: "Designer Store", emoji: "👜", effects: { money: -6000, mentalHealth: 5, fame: 2, followers: 4000 } },
      { id: "luxury_brands", name: "Luxury Brand Haul", emoji: "✨", effects: { money: -12000, mentalHealth: 6, fame: 4, followers: 8000 } },
      { id: "personal_shopper", name: "Personal Shopper", emoji: "🤵", effects: { money: -25000, mentalHealth: 7, fame: 6, followers: 15000 } },
      { id: "wardrobe_overhaul", name: "Full Wardrobe Overhaul", emoji: "👑", effects: { money: -50000, mentalHealth: 8, fame: 8, followers: 25000 } },
      { id: "couture", name: "Haute Couture Pieces", emoji: "💎", effects: { money: -100000, mentalHealth: 10, fame: 12, followers: 40000 } },
      { id: "jewelry_spree", name: "Jewelry & Watch Spree", emoji: "⌚", effects: { money: -200000, mentalHealth: 12, fame: 16, followers: 60000 } },
      { id: "unlimited_shopping", name: "No-Limit Shopping Day", emoji: "💳", effects: { money: -500000, mentalHealth: 15, fame: 22, followers: 100000 } },
    ],
  },
  {
    id: "date_night",
    name: "Go on a Date",
    emoji: "❤️",
    description: "Hit the town, get spotted",
    category: "lifestyle",
    minMoney: 500,
    getEffects: () => ({ money: -500, mentalHealth: 3 }),
    tiers: [
      { id: "coffee_date", name: "Coffee Date", emoji: "☕", effects: { money: -500, mentalHealth: 4 } },
      { id: "movie_night", name: "Movie Night", emoji: "🎬", effects: { money: -1500, mentalHealth: 5, followers: 500 } },
      { id: "nice_dinner", name: "Nice Restaurant", emoji: "🍽️", effects: { money: -3000, mentalHealth: 6, fame: 1, followers: 1500 } },
      { id: "fancy_dinner", name: "Fine Dining", emoji: "🥂", effects: { money: -8000, mentalHealth: 8, fame: 2, followers: 3000 } },
      { id: "rooftop_date", name: "Rooftop Cocktails", emoji: "🌃", effects: { money: -15000, mentalHealth: 10, fame: 4, followers: 6000 } },
      { id: "helicopter_date", name: "Helicopter Dinner", emoji: "🚁", effects: { money: -30000, mentalHealth: 12, fame: 6, followers: 12000 } },
      { id: "yacht_date", name: "Private Yacht", emoji: "🛳️", effects: { money: -60000, mentalHealth: 14, fame: 8, followers: 20000 } },
      { id: "island_getaway", name: "Island Getaway for Two", emoji: "🏝️", effects: { money: -120000, mentalHealth: 16, fame: 12, followers: 35000 } },
      { id: "world_tour_date", name: "World Tour Date", emoji: "🌍", effects: { money: -250000, mentalHealth: 18, fame: 16, followers: 55000 } },
      { id: "fairy_tale_date", name: "Fairy Tale Experience", emoji: "🏰", effects: { money: -500000, mentalHealth: 22, fame: 22, followers: 80000 } },
    ],
  },
  {
    id: "buy_car",
    name: "Buy a Car",
    emoji: "🚗",
    description: "Flex a new ride for content",
    category: "lifestyle",
    minMoney: 5000,
    minFollowers: 3000,
    getEffects: () => ({ money: -5000, fame: 1 }),
    tiers: [
      { id: "used_car", name: "Used Honda", emoji: "🚙", effects: { money: -5000, fame: 1, followers: 1500 } },
      { id: "new_sedan", name: "New Sedan", emoji: "🚘", effects: { money: -15000, fame: 2, followers: 3000 } },
      { id: "suv", name: "Luxury SUV", emoji: "🚐", effects: { money: -35000, fame: 4, followers: 6000 } },
      { id: "tesla", name: "Tesla", emoji: "⚡", effects: { money: -50000, fame: 6, followers: 10000 } },
      { id: "sports_car", name: "Sports Car", emoji: "🏎️", effects: { money: -80000, fame: 10, followers: 20000 } },
      { id: "lambo", name: "Lamborghini", emoji: "🐂", effects: { money: -150000, fame: 14, followers: 35000 } },
      { id: "ferrari", name: "Ferrari", emoji: "🔴", effects: { money: -250000, fame: 18, followers: 50000 } },
      { id: "rolls_royce", name: "Rolls-Royce", emoji: "👸", effects: { money: -400000, fame: 22, followers: 70000 } },
      { id: "hypercar", name: "Hypercar", emoji: "💨", effects: { money: -750000, fame: 28, followers: 100000 } },
      { id: "car_collection", name: "Full Car Collection", emoji: "🏆", effects: { money: -1500000, fame: 35, followers: 150000 } },
    ],
  },
  {
    id: "upgrade_home",
    name: "Upgrade Home",
    emoji: "🏠",
    description: "Better backdrop, better content",
    category: "lifestyle",
    minMoney: 5000,
    minFollowers: 3000,
    getEffects: () => ({ money: -5000, fame: 1 }),
    tiers: [
      { id: "studio_apt", name: "Studio Apartment", emoji: "🚪", effects: { money: -5000, fame: 1, mentalHealth: 3, followers: 1500 } },
      { id: "nice_apartment", name: "Nice Apartment", emoji: "🏢", effects: { money: -12000, fame: 2, mentalHealth: 5, followers: 3000 } },
      { id: "loft", name: "Downtown Loft", emoji: "🌆", effects: { money: -25000, fame: 4, mentalHealth: 6, followers: 6000 } },
      { id: "condo", name: "Luxury Condo", emoji: "🏙️", effects: { money: -50000, fame: 6, mentalHealth: 8, followers: 10000 } },
      { id: "penthouse", name: "Penthouse", emoji: "🌇", effects: { money: -100000, fame: 10, mentalHealth: 10, followers: 20000 } },
      { id: "house", name: "Modern House", emoji: "🏡", effects: { money: -200000, fame: 14, mentalHealth: 12, followers: 35000 } },
      { id: "mansion", name: "Mansion", emoji: "🏰", effects: { money: -400000, fame: 18, mentalHealth: 14, followers: 55000 } },
      { id: "estate", name: "Gated Estate", emoji: "🏛️", effects: { money: -750000, fame: 24, mentalHealth: 16, followers: 80000 } },
      { id: "compound", name: "Celebrity Compound", emoji: "🌴", effects: { money: -1500000, fame: 30, mentalHealth: 18, followers: 120000 } },
      { id: "mega_mansion", name: "Mega-Mansion", emoji: "👑", effects: { money: -3000000, fame: 40, mentalHealth: 22, followers: 200000 } },
    ],
  },
  {
    id: "vacation",
    name: "Take a Vacation",
    emoji: "✈️",
    description: "Travel content + actual rest",
    category: "lifestyle",
    minMoney: 1500,
    getEffects: () => ({ money: -1500, energy: 5, mentalHealth: 4 }),
    tiers: [
      { id: "staycation", name: "Staycation", emoji: "🛋️", effects: { money: -1500, energy: 6, mentalHealth: 4 } },
      { id: "weekend_trip", name: "Weekend Getaway", emoji: "⛺", effects: { money: -3000, energy: 8, mentalHealth: 6, fame: 1, followers: 1500 } },
      { id: "road_trip", name: "Road Trip", emoji: "🚗", effects: { money: -6000, energy: 10, mentalHealth: 8, fame: 2, followers: 3000 } },
      { id: "beach_resort", name: "Beach Resort", emoji: "🏖️", effects: { money: -12000, energy: 12, mentalHealth: 10, fame: 3, followers: 6000 } },
      { id: "ski_trip", name: "Ski Resort", emoji: "⛷️", effects: { money: -25000, energy: 14, mentalHealth: 12, fame: 5, followers: 10000 } },
      { id: "euro_trip", name: "European Tour", emoji: "🗼", effects: { money: -50000, energy: 16, mentalHealth: 14, fame: 8, followers: 20000 } },
      { id: "luxury_safari", name: "Luxury Safari", emoji: "🦁", effects: { money: -100000, energy: 18, mentalHealth: 16, fame: 12, followers: 35000 } },
      { id: "private_island", name: "Private Island", emoji: "🏝️", effects: { money: -200000, energy: 20, mentalHealth: 18, fame: 16, followers: 55000 } },
      { id: "world_cruise", name: "World Cruise", emoji: "🚢", effects: { money: -400000, energy: 22, mentalHealth: 20, fame: 22, followers: 80000 } },
      { id: "space_tourism", name: "Space Tourism", emoji: "🚀", effects: { money: -1000000, energy: 25, mentalHealth: 25, fame: 35, followers: 150000 } },
    ],
  },
  {
    id: "throw_party",
    name: "Throw a Party",
    emoji: "🎉",
    description: "Invite people, make connections",
    category: "lifestyle",
    minMoney: 2000,
    minFollowers: 3000,
    getEffects: () => ({ money: -2000, fame: 1 }),
    tiers: [
      { id: "small_gathering", name: "Small Gathering", emoji: "🍻", effects: { money: -2000, reputation: 3, followers: 2000, energy: -3 } },
      { id: "house_party", name: "House Party", emoji: "🏠", effects: { money: -5000, fame: 2, reputation: 4, followers: 4000, energy: -5 } },
      { id: "rooftop_party", name: "Rooftop Party", emoji: "🌃", effects: { money: -12000, fame: 4, reputation: 5, followers: 8000, energy: -6 } },
      { id: "club_night", name: "VIP Club Night", emoji: "🍾", effects: { money: -25000, fame: 6, reputation: 6, followers: 15000, energy: -8 } },
      { id: "pool_party", name: "Pool Party Bash", emoji: "🏊", effects: { money: -50000, fame: 8, reputation: 7, followers: 25000, energy: -10 } },
      { id: "mansion_party", name: "Mansion Blowout", emoji: "🥳", effects: { money: -100000, fame: 12, reputation: 8, followers: 40000, energy: -12 } },
      { id: "yacht_party", name: "Yacht Party", emoji: "🛥️", effects: { money: -200000, fame: 16, reputation: 10, followers: 60000, energy: -14 } },
      { id: "festival_party", name: "Private Festival", emoji: "🎪", effects: { money: -400000, fame: 22, reputation: 12, followers: 90000, energy: -16 } },
      { id: "stadium_event", name: "Stadium Event", emoji: "🏟️", effects: { money: -800000, fame: 28, reputation: 15, followers: 130000, energy: -18 } },
      { id: "legendary_bash", name: "Legendary Bash", emoji: "👑", effects: { money: -2000000, fame: 40, reputation: 20, followers: 200000, energy: -22 } },
    ],
  },
];
