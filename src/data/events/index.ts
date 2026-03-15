import { GameEvent } from "@/lib/game/types";
import { viralEvents } from "./viral";
import { dramaEvents } from "./drama";
import { brandEvents } from "./brand";
import { celebrityEvents } from "./celebrity";
import { platformEvents } from "./platform";
import { lifestyleEvents } from "./lifestyle";
import { failureEvents } from "./failure";
import { recoveryEvents } from "./recovery";

export const allEvents: GameEvent[] = [
  ...viralEvents,
  ...dramaEvents,
  ...brandEvents,
  ...celebrityEvents,
  ...platformEvents,
  ...lifestyleEvents,
  ...failureEvents,
  ...recoveryEvents,
];

export {
  viralEvents,
  dramaEvents,
  brandEvents,
  celebrityEvents,
  platformEvents,
  lifestyleEvents,
  failureEvents,
  recoveryEvents,
};
