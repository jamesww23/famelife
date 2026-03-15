"use client";

import { useGame } from "@/state/game-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STAT_ICONS } from "@/lib/game/constants";
import { StatKey } from "@/lib/game/types";

const TYPE_COLORS: Record<string, string> = {
  viral: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  drama: "bg-red-500/10 text-red-400 border-red-500/30",
  brand: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  celebrity: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  platform: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  lifestyle: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  failure: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  recovery: "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

function EffectPreview({ effects }: { effects: Record<string, number> }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(effects).map(([key, val]) => {
        if (val === 0) return null;
        const icon = STAT_ICONS[key as StatKey] || "";
        return (
          <span
            key={key}
            className={`text-xs px-1.5 py-0.5 rounded ${
              val > 0 ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
            }`}
          >
            {icon} {val > 0 ? "+" : ""}{val}
          </span>
        );
      })}
    </div>
  );
}

export function EventCard() {
  const { state, chooseEventOption } = useGame();
  const event = state.currentEvent;

  if (!event) return null;

  return (
    <Card className="max-w-lg mx-auto border-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={TYPE_COLORS[event.type] || ""}>
            {event.type.toUpperCase()}
          </Badge>
        </div>
        <CardTitle className="text-xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{event.text}</p>
        <div className="space-y-2">
          {event.choices.map((choice) => (
            <Button
              key={choice.id}
              variant="outline"
              className="w-full text-left h-auto py-3 px-4 hover:bg-accent justify-start"
              onClick={() => chooseEventOption(choice)}
            >
              <div className="space-y-1.5 w-full">
                <div className="text-sm font-medium">{choice.text}</div>
                <EffectPreview effects={choice.effects} />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
