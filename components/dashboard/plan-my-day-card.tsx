"use client";

import { generatePlanMyDayAction } from "@/lib/actions/plan-my-day-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function PlanMyDayCard() {
  const [plan, setPlan] = useState<string | null>(null);
  const [source, setSource] = useState<"openai" | "fallback" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    const result = await generatePlanMyDayAction();

    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    if (!result.data) {
      setError("No plan received. Please try again.");
      return;
    }

    setPlan(result.data.plan);
    setSource(result.data.source);
  }

  return (
    <Card
      id="plan-my-day"
      padding="none"
      className="surface-card overflow-hidden border-primary/20 bg-gradient-to-br from-primary-muted/50 via-surface to-surface"
    >
      <CardHeader className="border-b border-primary/10 px-5 py-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          Plan my day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5">
        {error && (
          <p className="rounded-[var(--radius)] border border-error/25 bg-error/5 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        {plan ? (
          <div className="rounded-[var(--radius)] border border-border/60 bg-surface/80 px-4 py-3">
            {source === "fallback" && (
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                Offline plan
              </p>
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
              {plan}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Let StudySphere AI prioritize your open assignments and suggest a
            focused plan for today.
          </p>
        )}

        <Button
          type="button"
          size="sm"
          onClick={() => void handleGenerate()}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Thinking…" : plan ? "Refresh plan" : "Generate plan"}
        </Button>
      </CardContent>
    </Card>
  );
}
