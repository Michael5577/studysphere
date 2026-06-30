"use server";

import {
  ensureUserPreferences,
  updateUserPreferences,
} from "@/lib/db/preferences";
import { requireUserId } from "@/lib/db/auth";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import type { UserPreferences } from "@/types/database";

export interface PreferencesFormInput {
  work_duration_minutes?: number;
  break_duration_minutes?: number;
  long_break_duration_minutes?: number;
  compact_mode?: boolean;
  show_completed_assignments?: boolean;
  assignment_reminders?: boolean;
  daily_summary_email?: boolean;
  focus_session_alerts?: boolean;
}

function validatePreferencesInput(input: PreferencesFormInput): string | null {
  if (
    input.work_duration_minutes !== undefined &&
    (input.work_duration_minutes < 1 || input.work_duration_minutes > 180)
  ) {
    return "Work duration must be between 1 and 180 minutes.";
  }

  if (
    input.break_duration_minutes !== undefined &&
    (input.break_duration_minutes < 1 || input.break_duration_minutes > 60)
  ) {
    return "Break duration must be between 1 and 60 minutes.";
  }

  if (
    input.long_break_duration_minutes !== undefined &&
    (input.long_break_duration_minutes < 1 ||
      input.long_break_duration_minutes > 120)
  ) {
    return "Long break duration must be between 1 and 120 minutes.";
  }

  return null;
}

export async function updatePreferencesAction(
  input: PreferencesFormInput,
): Promise<ActionResult<UserPreferences>> {
  try {
    const validationError = validatePreferencesInput(input);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const userId = await requireUserId();
    await ensureUserPreferences(userId);

    const preferences = await updateUserPreferences(input);

    revalidatePath("/settings");
    revalidatePath("/assignments");
    return { ok: true, data: preferences };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update preferences.",
    };
  }
}
