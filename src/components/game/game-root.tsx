"use client";

import { useGame } from "@/state/game-context";
import { StartScreen } from "./start-screen";
import { GameScreen } from "./game-screen";
import { SummaryScreen } from "./summary-screen";

export function GameRoot() {
  const { state } = useGame();

  if (state.phase === "start") return <StartScreen />;
  if (state.phase === "game_over") return <SummaryScreen />;
  return <GameScreen />;
}
