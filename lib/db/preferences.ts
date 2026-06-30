import { requireUserId } from "@/lib/db/auth";
import { formatDbError } from "@/lib/db/errors";
import { createClient } from "@/lib/supabase/server";
import type { UserPreferences, UserPreferencesUpdate } from "@/types/database";

const DEFAULT_PREFERENCES = {
  work_duration_minutes: 25,
  break_duration_minutes: 5,
  long_break_duration_minutes: 15,
  compact_mode: false,
  show_completed_assignments: true,
  assignment_reminders: true,
  daily_summary_email: false,
  focus_session_alerts: true,
};

export async function ensureUserPreferences(
  userId: string,
): Promise<UserPreferences> {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    throw new Error(formatDbError(existingError));
  }

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .insert({
      user_id: userId,
      ...DEFAULT_PREFERENCES,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function updateUserPreferences(
  input: UserPreferencesUpdate,
): Promise<UserPreferences> {
  const userId = await requireUserId();
  const supabase = await createClient();

  await ensureUserPreferences(userId);

  const { data, error } = await supabase
    .from("user_preferences")
    .update(input)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}
