import { GameEvent } from "@/lib/game/types";

export const lifestyleEvents: GameEvent[] = [
  {
    id: "new_apartment",
    type: "lifestyle",
    title: "Luxury Apartment Tour",
    text: "You moved into a new place. Your apartment tour video is getting crazy views.",
    weight: 7,
    minTier: "rising_influencer",
    choices: [
      {
        id: "flex_apartment",
        text: "Go all out — show everything, flex the lifestyle",
        effects: { followers: 8000, fame: 5, money: -3000, reputation: -3 },
      },
      {
        id: "cozy_tour",
        text: "Keep it cozy and relatable",
        effects: { followers: 4000, fame: 3, reputation: 5 },
      },
    ],
  },
  {
    id: "surprise_vacation",
    type: "lifestyle",
    title: "Surprise Vacation Content",
    text: "You went on a spontaneous trip and the travel content is performing amazingly.",
    weight: 8,
    choices: [
      {
        id: "full_series",
        text: "Turn it into a full travel series",
        effects: { followers: 6000, fame: 4, money: -2000, energy: -10, mentalHealth: 10 },
      },
      {
        id: "highlight_reel",
        text: "Post a highlight reel and get back to work",
        effects: { followers: 3000, fame: 2, mentalHealth: 8 },
      },
    ],
  },
  {
    id: "fitness_journey",
    type: "lifestyle",
    title: "Fitness Transformation",
    text: "You started a public fitness journey and the weekly updates are getting huge engagement.",
    weight: 7,
    choices: [
      {
        id: "commit_fitness",
        text: "Go all in — daily fitness content",
        effects: { followers: 5000, fame: 3, energy: -15, mentalHealth: 5 },
      },
      {
        id: "casual_updates",
        text: "Keep it casual with weekly check-ins",
        effects: { followers: 2000, fame: 2, mentalHealth: 8, reputation: 3 },
      },
    ],
  },
  {
    id: "pet_content",
    type: "lifestyle",
    title: "Pet Goes Viral",
    text: "You adopted a pet and the internet is obsessed. People are following just for the pet content.",
    weight: 8,
    choices: [
      {
        id: "pet_account",
        text: "Create a separate account for your pet",
        effects: { followers: 10000, fame: 3, energy: -5 },
      },
      {
        id: "integrate_pet",
        text: "Feature the pet in your regular content",
        effects: { followers: 5000, fame: 2, reputation: 5, mentalHealth: 5 },
      },
    ],
  },
  {
    id: "friendship_drama",
    type: "lifestyle",
    title: "Friend Group Drama",
    text: "Your creator friend group is falling apart. Fans are picking sides in the comments.",
    weight: 7,
    choices: [
      {
        id: "stay_neutral",
        text: "Stay neutral — don't pick sides publicly",
        effects: { reputation: 5, followers: -1000, mentalHealth: -5 },
      },
      {
        id: "pick_side",
        text: "Pick a side and make content about it",
        effects: { followers: 5000, fame: 4, reputation: -5, mentalHealth: -8 },
        setFlags: ["startedFeud"],
      },
    ],
  },
  {
    id: "mental_health_moment",
    type: "lifestyle",
    title: "Mental Health Opens Up",
    text: "You posted a vulnerable video about struggling with mental health. The response is overwhelming.",
    weight: 6,
    statConditions: { mentalHealth: { max: 50 } },
    choices: [
      {
        id: "continue_sharing",
        text: "Continue sharing your journey openly",
        effects: { followers: 5000, fame: 3, reputation: 10, mentalHealth: 8 },
        setFlags: ["burnoutRisk"],
      },
      {
        id: "step_back",
        text: "Step back from the spotlight to heal",
        effects: { reputation: 8, mentalHealth: 15, followers: -2000 },
      },
    ],
  },
  {
    id: "fomo_event",
    type: "lifestyle",
    title: "Major Creator Event",
    text: "Every big creator is at this event except you. Your fans are asking why you're not there.",
    weight: 7,
    minTier: "micro_influencer",
    choices: [
      {
        id: "show_up",
        text: "Drop everything and show up",
        effects: { fame: 5, money: -1500, energy: -15, followers: 3000 },
      },
      {
        id: "content_at_home",
        text: "Make content about FOMO and staying true to yourself",
        effects: { followers: 2000, reputation: 5, mentalHealth: 5 },
      },
    ],
  },
];
