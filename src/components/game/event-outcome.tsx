"use client";

import { useGame } from "@/state/game-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STAT_ICONS } from "@/lib/game/constants";
import { StatKey } from "@/lib/game/types";

export function EventOutcome() {
  const { state, proceedFromOutcome } = useGame();
  const result = state.currentChoiceResult;

  if (!result) return null;

  const { choice, event } = result;

  return (
    <Card className="max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{event.title} — Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {choice.followUpText || `You chose: "${choice.text}"`}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries(choice.effects).map(([key, val]) => {
            if (val === 0) return null;
            const icon = STAT_ICONS[key as StatKey] || "";
            return (
              <div
                key={key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  val > 0
                    ? "bg-green-900/20 text-green-400"
                    : "bg-red-900/20 text-red-400"
                }`}
              >
                <span>{icon}</span>
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="ml-auto font-semibold">
                  {val > 0 ? "+" : ""}
                  {val.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        <Button className="w-full" onClick={proceedFromOutcome}>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
