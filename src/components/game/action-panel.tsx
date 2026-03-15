"use client";

import { useGame } from "@/state/game-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionCategory, GameAction } from "@/lib/game/types";

const CATEGORY_CONFIG: Record<ActionCategory, { label: string; emoji: string }> = {
  content: { label: "Content", emoji: "📹" },
  career: { label: "Career", emoji: "💼" },
  social: { label: "Social", emoji: "🤝" },
  recovery: { label: "Recovery", emoji: "🧘" },
};

function ActionButton({ action, onClick }: { action: GameAction; onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-accent"
      onClick={onClick}
    >
      <div className="space-y-0.5">
        <div className="font-medium text-sm">{action.name}</div>
        <div className="text-xs text-muted-foreground">{action.description}</div>
      </div>
    </Button>
  );
}

export function ActionPanel() {
  const { availableActions, chooseAction } = useGame();

  const grouped = (["content", "career", "social", "recovery"] as ActionCategory[]).map(
    (cat) => ({
      category: cat,
      ...CATEGORY_CONFIG[cat],
      actions: availableActions.filter((a) => a.category === cat),
    })
  );

  return (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
        Choose Action
      </h2>
      {grouped.map(
        ({ category, label, emoji, actions }) =>
          actions.length > 0 && (
            <Card key={category} className="bg-card/50">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <span>{emoji}</span>
                  {label}
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4">
                    {actions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0 space-y-1.5">
                {actions.map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    onClick={() => chooseAction(action)}
                  />
                ))}
              </CardContent>
            </Card>
          )
      )}
    </div>
  );
}
