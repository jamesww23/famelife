"use client";

import { useEffect } from "react";
import { useGame } from "@/state/game-context";
import { milestones } from "@/data/milestones";
import { toast } from "sonner";

export function MilestoneWatcher() {
  const { state, proceedFromMilestone } = useGame();

  useEffect(() => {
    if (state.phase === "milestone" && state.pendingMilestones.length > 0) {
      for (const id of state.pendingMilestones) {
        const m = milestones.find((ms) => ms.id === id);
        if (m) {
          toast.success(m.title, {
            description: m.description,
            duration: 3000,
          });
        }
      }
      // Auto-proceed after showing milestones
      const timer = setTimeout(proceedFromMilestone, 500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.pendingMilestones, proceedFromMilestone]);

  return null;
}
