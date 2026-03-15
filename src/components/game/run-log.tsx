"use client";

import { useGame } from "@/state/game-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { milestones as allMilestones } from "@/data/milestones";

export function RunLog() {
  const { state } = useGame();

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* Milestones */}
      {state.milestones.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
            Milestones
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {state.milestones.map((id) => {
              const m = allMilestones.find((ms) => ms.id === id);
              return (
                <Badge key={id} variant="secondary" className="text-xs">
                  {m?.title || id}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="flex-1 min-h-0">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-1.5">
          Activity Log
        </h3>
        <ScrollArea className="h-[calc(100vh-380px)]">
          <div className="space-y-1 pr-3">
            {[...state.log].reverse().map((entry, i) => (
              <div
                key={i}
                className="text-xs py-1.5 px-2 rounded bg-muted/30 flex items-start gap-2"
              >
                <span className="text-muted-foreground shrink-0 tabular-nums">
                  W{entry.week}
                </span>
                <span className="text-foreground/80">{entry.text}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
