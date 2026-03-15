"use client";

import { useGame } from "@/state/game-context";
import { archetypes } from "@/data/archetypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchetypeId } from "@/lib/game/types";
import { useState } from "react";

export function StartScreen() {
  const { startGame } = useGame();
  const [selected, setSelected] = useState<ArchetypeId | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 p-6">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Influencer Life
          </h1>
          <p className="text-lg text-slate-400">
            Rise from nobody to global celebrity. Every choice shapes your story.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider">
            Choose Your Archetype
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {archetypes.map((arch) => (
              <Card
                key={arch.id}
                className={`cursor-pointer transition-all hover:scale-[1.02] ${
                  selected === arch.id
                    ? "ring-2 ring-violet-500 bg-violet-950/50"
                    : "bg-slate-900/50 hover:bg-slate-900/80"
                }`}
                onClick={() => setSelected(arch.id)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{arch.emoji}</span>
                    <span className="font-semibold text-white text-sm">
                      {arch.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {arch.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            disabled={!selected}
            onClick={() => selected && startGame(selected)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-10 py-6 text-lg font-semibold"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
