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
  color_scheme: "system",
  background_style: "vivid",
};

/**
 * Columns added in supabase/migrations/20260701_appearance_preferences.sql.
 * Databases that haven't run the migration yet reject writes that include
 * them, so we retry without these keys instead of failing the whole request.
 */
const APPEARANCE_COLUMNS = ["color_scheme", "background_style"] as const;

function isMissingColumnError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST204" ||
    /could not find the '.+' column/i.test(error.message ?? "")
  );
}

function withoutAppearanceColumns(input: object): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...input };

  for (const column of APPEARANCE_COLUMNS) {
    delete clone[column];
  }

  return clone;
}

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

  if (error && isMissingColumnError(error)) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("user_preferences")
      .insert({
        user_id: userId,
        ...withoutAppearanceColumns(DEFAULT_PREFERENCES),
      })
      .select("*")
      .single();

    if (fallbackError) {
      throw new Error(formatDbError(fallbackError));
    }

    return fallbackData;
  }

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

  if (error && isMissingColumnError(error)) {
    const fallbackInput = withoutAppearanceColumns(input);

    // The update contained only appearance columns — nothing else to save.
    if (Object.keys(fallbackInput).length === 0) {
      const { data: current, error: readError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (readError) {
        throw new Error(formatDbError(readError));
      }

      return current;
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("user_preferences")
      .update(fallbackInput)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (fallbackError) {
      throw new Error(formatDbError(fallbackError));
    }

    return fallbackData;
  }

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}
