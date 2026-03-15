"use client";

import { useState } from "react";
import { useGame } from "@/state/game-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { STAT_ICONS } from "@/lib/game/constants";
import { StatKey } from "@/lib/game/types";

export function RewardedAdModal() {
  const { state, onAcceptAd, onDeclineAd } = useGame();
  const [watching, setWatching] = useState(false);
  const ad = state.pendingAd;
  const isOpen = state.phase === "rewarded_ad" && !!ad;

  if (!ad) return null;

  const handleWatch = () => {
    setWatching(true);
    // Simulate ad watching
    setTimeout(() => {
      setWatching(false);
      onAcceptAd();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        {watching ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Watching ad...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {ad.name}
              </DialogTitle>
              <DialogDescription>{ad.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Rewards
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ad.effects).map(([key, val]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 text-sm bg-green-900/20 text-green-400 px-2.5 py-1 rounded-lg"
                  >
                    {STAT_ICONS[key as StatKey]} +{val}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onDeclineAd}>
                Skip
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600"
                onClick={handleWatch}
              >
                Watch Ad
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
