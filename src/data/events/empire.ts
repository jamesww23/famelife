import { GameEvent } from "@/lib/game/types";

export const empireEvents: GameEvent[] = [
  {
    id: "production_studio_launch",
    type: "empire",
    title: "Production Studio Launch",
    emoji: "🎬",
    text: "You've outgrown your home setup. A real estate agent just showed you a 10,000 sq ft warehouse that could become the ultimate content studio — soundstages, editing bays, the works.",
    weight: 7,
    minPhase: "celebrity",
    choices: [
      {
        id: "invest_big_studio",
        text: "Go all in — build the dream studio",
        effects: { money: -45000, fame: 20, followers: 50000, energy: -15 },
        setFlags: ["ownsStudio"],
        followUpText:
          "Construction starts next week. You just signed a 5-year lease and hired a full build-out crew. This is either your empire's HQ or the most expensive mistake of your life.",
        socialReaction: {
          type: "headline",
          text: "INFLUENCER DROPS MILLIONS ON MASSIVE PRODUCTION STUDIO",
          author: "Business Insider",
        },
      },
      {
        id: "start_small_studio",
        text: "Start with a modest rental space",
        effects: { money: -12000, fame: 8, followers: 15000, energy: -5 },
        followUpText:
          "A clean 2,000 sq ft space with good lighting and decent acoustics. Not flashy, but it gets the job done without draining your accounts.",
        socialReaction: {
          type: "comment",
          text: "Smart move not overextending. Respect the hustle 💪",
          author: "@business_creator",
        },
      },
    ],
  },
  {
    id: "creator_house",
    type: "empire",
    title: "Creator House",
    emoji: "🏠",
    text: "The creator house trend isn't dead — it's evolved. You've got the clout and the cash to either build your own or join an established one with some of the biggest names in the game.",
    weight: 6,
    minPhase: "famous",
    choices: [
      {
        id: "build_own_house",
        text: "Build your own creator house",
        effects: { money: -35000, fame: 22, followers: 40000, reputation: 10, energy: -20 },
        setFlags: ["ownsStudio"],
        followUpText:
          "You bought a mansion, hired a house manager, and moved in five up-and-coming creators. Welcome to the content factory. Every room is a set.",
        socialReaction: {
          type: "headline",
          text: "NEW CREATOR HOUSE LAUNCHES WITH ALL-STAR LINEUP",
          author: "Dexerto",
        },
      },
      {
        id: "join_existing_house",
        text: "Join an established creator house",
        effects: { money: -8000, fame: 10, followers: 60000, reputation: 5, energy: -10 },
        followUpText:
          "You moved into the house and immediately got pulled into three collabs. The algorithm loves this kind of crossover content.",
        socialReaction: {
          type: "tweet",
          text: "WAIT THEY JUST JOINED THE HOUSE??? Content is about to be INSANE 🔥",
          author: "@contentfan",
        },
      },
    ],
  },
  {
    id: "merch_empire",
    type: "empire",
    title: "Merch Empire",
    emoji: "👕",
    text: "Your audience has been begging for merch. You've got two paths: a premium streetwear-style brand with limited drops, or a mass-market line that ships fast and sells volume.",
    weight: 8,
    minPhase: "breakout",
    choices: [
      {
        id: "premium_brand",
        text: "Launch a premium brand — limited drops only",
        effects: { money: -20000, fame: 12, reputation: 15, followers: 20000 },
        followUpText:
          "The first drop sold out in 90 seconds. Resellers are already flipping your hoodies for 3x retail. The brand feels real — not just merch with your face on it.",
        socialReaction: {
          type: "tweet",
          text: "Their merch actually goes hard?? This isn't just influencer garbage, it's legit streetwear 🔥",
          author: "@fashiontwt",
        },
      },
      {
        id: "fast_fashion_merch",
        text: "Mass market — high volume, low price",
        effects: { money: 15000, fame: 5, reputation: -8, followers: 10000 },
        followUpText:
          "The margins are thin but the volume is massive. Unfortunately someone on Twitter found the same blanks on AliExpress for $2 and the replies are rough.",
        socialReaction: {
          type: "tweet",
          text: "Not them charging $40 for a $3 Alibaba tee with a logo slapped on 💀",
          author: "@exposinginfluencers",
        },
      },
    ],
  },
  {
    id: "big_giveaway_stunt",
    type: "empire",
    title: "Big Giveaway Stunt",
    emoji: "🎁",
    text: "Your team pitched a massive giveaway — cars, cash, dream vacations. The kind of stunt that breaks the internet. But it's going to cost a fortune.",
    weight: 7,
    minPhase: "famous",
    choices: [
      {
        id: "go_all_out_giveaway",
        text: "Go nuclear — $500K giveaway",
        effects: { money: -50000, followers: 100000, fame: 25, energy: -20, reputation: 5 },
        followUpText:
          "The video hit 80 million views. You gave away 10 cars, paid off someone's student loans, and the internet lost its mind. Your subscriber count is climbing faster than ever.",
        socialReaction: {
          type: "headline",
          text: "INFLUENCER'S INSANE GIVEAWAY BREAKS PLATFORM RECORDS",
          author: "Philip DeFranco",
        },
      },
      {
        id: "modest_giveaway",
        text: "Keep it reasonable — $50K giveaway",
        effects: { money: -12000, followers: 25000, fame: 10, energy: -8 },
        followUpText:
          "A solid giveaway that made some people's day without bankrupting you. The comments are positive and the engagement spike is real, even if it's not headline material.",
        socialReaction: {
          type: "comment",
          text: "This is so wholesome!! You deserve all the love 😭❤️",
          author: "@loyalfan_2019",
        },
      },
    ],
  },
  {
    id: "foundation_launch",
    type: "empire",
    title: "Foundation Launch",
    emoji: "🌍",
    text: "You've got the platform and the resources. Your accountant says a charitable foundation could do real good — and also help with taxes. The question is how genuine you want to make it.",
    weight: 6,
    minPhase: "celebrity",
    choices: [
      {
        id: "genuine_foundation",
        text: "Build something real — fund a cause you believe in",
        effects: { money: -30000, reputation: 20, fame: 10, mentalHealth: 12, followers: 15000 },
        setFlags: ["charityPersona"],
        followUpText:
          "You partnered with established nonprofits, hired a real executive director, and committed to transparency reports. The first grant cycle funded 12 community projects. This actually matters.",
        socialReaction: {
          type: "headline",
          text: "CREATOR LAUNCHES FOUNDATION, PLEDGES MILLIONS TO EDUCATION",
          author: "Forbes",
        },
      },
      {
        id: "pr_foundation",
        text: "Make it a PR vehicle with some charity on the side",
        effects: { money: -10000, reputation: 5, fame: 15, followers: 20000 },
        followUpText:
          "The launch event was beautiful. The press coverage was excellent. But a few journalists are already asking where the money actually goes. You'll need to be careful.",
        socialReaction: {
          type: "tweet",
          text: "Something about this foundation feels very 'tax write-off coded' idk 🤷",
          author: "@mediacritic",
        },
      },
    ],
  },
  {
    id: "talent_team_expansion",
    type: "empire",
    title: "Talent Team Expansion",
    emoji: "📋",
    text: "You're drowning in emails, brand deals, scheduling conflicts, and content deadlines. You need help — or you need to admit you're a control freak and keep grinding solo.",
    weight: 9,
    minPhase: "breakout",
    choices: [
      {
        id: "hire_manager",
        text: "Hire a professional manager",
        effects: { money: -15000, energy: 20, fame: 8, mentalHealth: 10, followers: 10000 },
        setFlags: ["hasManager"],
        followUpText:
          "Your new manager took one look at your inbox and almost quit on the spot. But within a week, your schedule is clean, your brand deals are better, and you actually slept 8 hours for the first time in months.",
        socialReaction: {
          type: "comment",
          text: "The production quality jump lately is crazy. They definitely leveled up the team",
          author: "@contentanalyst",
        },
      },
      {
        id: "stay_solo",
        text: "Keep doing it all yourself",
        effects: { money: 5000, energy: -20, mentalHealth: -10, reputation: 5 },
        followUpText:
          "You saved money, sure. But you're answering emails at 3 AM, missing deadlines, and your last three videos were rushed. The dark circles are becoming part of your brand.",
        socialReaction: {
          type: "tweet",
          text: "Are they okay?? The last few uploads have been... different",
          author: "@concerned_viewer",
        },
      },
    ],
  },
  {
    id: "global_campaign",
    type: "empire",
    title: "Global Campaign",
    emoji: "🌐",
    text: "Your studio is up and running. Your team wants to go global — localized content for international markets, translated channels, the whole operation. This is how empires scale.",
    weight: 5,
    minPhase: "empire",
    requiredFlags: ["ownsStudio"],
    choices: [
      {
        id: "go_international",
        text: "Launch internationally — translate everything",
        effects: { money: -40000, followers: 80000, fame: 22, energy: -25, reputation: 10 },
        followUpText:
          "You hired translation teams for six languages, launched regional channels, and started collaborating with international creators. Your content is being watched on every continent. The logistics are insane but the growth is unprecedented.",
        socialReaction: {
          type: "headline",
          text: "CREATOR GOES GLOBAL: LAUNCHES IN 6 LANGUAGES SIMULTANEOUSLY",
          author: "TubeFilter",
        },
      },
      {
        id: "domestic_focus",
        text: "Stay focused on the domestic market",
        effects: { money: -10000, followers: 25000, fame: 10, energy: -10 },
        followUpText:
          "You doubled down on what works — deeper content, better engagement, stronger community. Not as flashy as going global, but the foundation is rock solid.",
        socialReaction: {
          type: "comment",
          text: "Quality over quantity. This is why they're still at the top 👑",
          author: "@longtime_subscriber",
        },
      },
    ],
  },
  {
    id: "reality_show_offer",
    type: "empire",
    title: "Reality Show Offer",
    emoji: "📺",
    text: "A major network just offered you your own reality series. Cameras follow you 24/7, your life becomes content. The money is huge but your reputation is on the line.",
    weight: 7,
    minPhase: "famous",
    choices: [
      {
        id: "take_reality_show",
        text: "Sign the deal — let the cameras roll",
        effects: { money: 35000, fame: 25, reputation: -12, energy: -25, followers: 45000, mentalHealth: -10 },
        followUpText:
          "Episode one drops and trends worldwide. The producers are pushing drama hard — manufactured fights, misleading edits. You're famous, but the version of you on screen isn't really you. The comments section is a warzone.",
        socialReaction: {
          type: "headline",
          text: "INFLUENCER REALITY SHOW PREMIERES TO RECORD RATINGS AND INSTANT CONTROVERSY",
          author: "Variety",
        },
      },
      {
        id: "decline_reality_show",
        text: "Pass — protect your image",
        effects: { reputation: 12, mentalHealth: 8, energy: 5 },
        followUpText:
          "Your team thought you were crazy to turn down that kind of money. But you've seen what reality TV does to people's reputations. Some doors are better left closed.",
        socialReaction: {
          type: "tweet",
          text: "Respect for turning down the reality show bag. Not everyone sells out 👏",
          author: "@realones",
        },
      },
    ],
  },
  {
    id: "media_company_acquisition",
    type: "empire",
    title: "Media Company Acquisition",
    emoji: "🏢",
    text: "A struggling digital media company with solid infrastructure and a back catalog of content is up for sale. Meanwhile, a larger media conglomerate has been quietly asking about acquiring YOUR brand.",
    weight: 5,
    minPhase: "empire",
    choices: [
      {
        id: "acquire_company",
        text: "Buy the media company — expand your empire",
        effects: { money: -50000, fame: 20, followers: 30000, reputation: 12, energy: -15 },
        setFlags: ["ownsStudio"],
        followUpText:
          "You just became a media mogul. The acquisition gives you a production pipeline, a content library, and a team of 40 experienced creators. The integration will be brutal but the upside is massive.",
        socialReaction: {
          type: "headline",
          text: "CREATOR ECONOMY SHAKEUP: INFLUENCER ACQUIRES DIGITAL MEDIA COMPANY",
          author: "The Verge",
        },
      },
      {
        id: "sell_brand",
        text: "Sell your brand to the conglomerate",
        effects: { money: 50000, fame: -10, followers: -20000, reputation: -8, mentalHealth: -8 },
        followUpText:
          "The check cleared and it was life-changing money. But you're now an employee of your own brand, reporting to a board that doesn't understand creators. The golden handcuffs are tight.",
        socialReaction: {
          type: "tweet",
          text: "They really sold out huh. Corporate influencer era. Unfollowed.",
          author: "@og_supporter",
        },
      },
    ],
  },
  {
    id: "investor_pitch",
    type: "empire",
    title: "Investor Pitch",
    emoji: "💰",
    text: "Three venture capital firms are fighting to invest in your brand. They see you as the next media empire. The term sheets are on the table — big money, but they want a board seat and creative oversight.",
    weight: 6,
    minPhase: "celebrity",
    choices: [
      {
        id: "take_investment",
        text: "Take the VC money — $10M for 20% equity",
        effects: { money: 40000, fame: 12, reputation: -10, followers: 15000, energy: 10 },
        followUpText:
          "The wire hit your account and suddenly you have a board of directors. The investors are already suggesting 'content pivots' and 'audience optimization strategies.' You have resources but every creative decision now goes through a committee.",
        socialReaction: {
          type: "headline",
          text: "CREATOR CLOSES $10M FUNDING ROUND, SIGNALS MAJOR EXPANSION",
          author: "TechCrunch",
        },
      },
      {
        id: "bootstrap_brand",
        text: "Turn them down — stay independent",
        effects: { reputation: 15, mentalHealth: 10, fame: 5, energy: -10 },
        followUpText:
          "The VCs couldn't believe it. Nobody turns down that kind of money. But your audience noticed — and they respect it. You're growing slower, but every piece of content is yours. No compromises.",
        socialReaction: {
          type: "tweet",
          text: "They turned down $10M to stay independent. That's the most creator thing ever. Real ones know 🙌",
          author: "@indie_creator",
        },
      },
    ],
  },
];
