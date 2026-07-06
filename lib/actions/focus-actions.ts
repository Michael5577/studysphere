"use server";

import { createStudySession } from "@/lib/db/study-sessions";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import type { StudySession } from "@/types/database";

export interface SaveFocusSessionInput {
  course_id: string | null;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
}

export async function saveFocusSessionAction(
  input: SaveFocusSessionInput,
): Promise<ActionResult<StudySession>> {
  try {
    if (!input.started_at || !input.ended_at) {
      return { ok: false, message: "Session timestamps are required." };
    }

    if (input.duration_seconds < 1) {
      return { ok: false, message: "Session must be at least 1 second." };
    }

    const started = new Date(input.started_at);
    const ended = new Date(input.ended_at);

    if (Number.isNaN(started.getTime()) || Number.isNaN(ended.getTime())) {
      return { ok: false, message: "Invalid session timestamps." };
    }

    if (ended < started) {
      return { ok: false, message: "Session end must be after start." };
    }

    const session = await createStudySession({
      course_id: input.course_id,
      session_type: "focus",
      started_at: input.started_at,
      ended_at: input.ended_at,
      duration_seconds: input.duration_seconds,
    });

    revalidatePath("/focus");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath("/calendar");

    return { ok: true, data: session };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to save focus session.",
    };
  }
}
