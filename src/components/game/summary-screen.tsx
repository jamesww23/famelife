"use client";

import { useGame, generateSummary } from "@/state/game-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { archetypes } from "@/data/archetypes";
import { formatFollowers, formatMoney } from "@/lib/game/progression";

export function SummaryScreen() {
  const { state, restartGame } = useGame();
  const summary = generateSummary(state);
  const arch = archetypes.find((a) => a.id === summary.archetype);

  const stats = [
    { label: "Weeks Played", value: summary.weeksPlayed },
    { label: "Final Followers", value: formatFollowers(summary.followers) },
    { label: "Career Tier", value: summary.fameTier },
    { label: "Money", value: formatMoney(summary.money) },
    { label: "Brand Deals", value: summary.brandDeals },
    { label: "Scandals", value: summary.scandals },
    { label: "Celebrity Events", value: summary.celebrityEvents },
    { label: "Relationships", value: summary.relationships },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-6">
      <Card className="max-w-md w-full bg-card/90 backdrop-blur">
        <CardHeader className="text-center pb-3">
          <div className="text-4xl mb-2">{arch?.emoji || "🎬"}</div>
          <CardTitle className="text-2xl">Career Over</CardTitle>
          <p className="text-sm text-muted-foreground">{summary.endingReason}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm px-3 py-1">
              {summary.archetypeName}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center p-2 rounded-lg bg-muted/30">
                <div className="text-lg font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {summary.milestones.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
                  Milestones Achieved
                </h3>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {summary.milestones.map((id) => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {id.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <Button
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
            size="lg"
            onClick={restartGame}
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
