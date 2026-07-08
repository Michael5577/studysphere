"use server";

import { generatePlanMyDay } from "@/lib/ai/plan-my-day";
import { requireUserId } from "@/lib/db/auth";
import { getAssignments } from "@/lib/db/assignments";
import type { ActionResult } from "@/types/actions";

export interface PlanMyDayResult {
  plan: string;
  source: "openai" | "nvidia-deepseek" | "openrouter" | "fallback";
}

export async function generatePlanMyDayAction(): Promise<
  ActionResult<PlanMyDayResult>
> {
  try {
    await requireUserId();

    const assignments = await getAssignments(false);
    const { plan, source } = await generatePlanMyDay(assignments);

    return {
      ok: true,
      data: { plan, source },
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to generate today's plan.",
    };
  }
}
