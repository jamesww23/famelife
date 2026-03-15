"use client";

import { useGame } from "@/state/game-context";
import { StatBar } from "./stat-bar";
import { ActionPanel } from "./action-panel";
import { EventCard } from "./event-card";
import { EventOutcome } from "./event-outcome";
import { RunLog } from "./run-log";
import { RewardedAdModal } from "./rewarded-ad-modal";
import { MilestoneWatcher } from "./milestone-toast";

export function GameScreen() {
  const { state } = useGame();

  const renderCenter = () => {
    switch (state.phase) {
      case "event":
        return <EventCard />;
      case "event_outcome":
        return <EventOutcome />;
      case "choose_action":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2 text-muted-foreground">
              <p className="text-4xl">📱</p>
              <p className="text-sm">Choose an action to start your week</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <StatBar />
      <div className="flex-1 flex min-h-0">
        {/* Left: Run Log */}
        <div className="w-64 border-r p-3 bg-card/30 hidden lg:block">
          <RunLog />
        </div>

        {/* Center: Event Area */}
        <div className="flex-1 p-6 overflow-y-auto flex items-start justify-center">
          <div className="w-full max-w-lg pt-8">{renderCenter()}</div>
        </div>

        {/* Right: Action Panel */}
        <div className="w-72 border-l p-3 bg-card/30">
          {state.phase === "choose_action" ? (
            <ActionPanel />
          ) : (
            <div className="text-center text-sm text-muted-foreground pt-8">
              Resolve the current event first...
            </div>
          )}
        </div>
      </div>

      <RewardedAdModal />
      <MilestoneWatcher />
    </div>
  );
}
