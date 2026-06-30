import { requireUserId } from "@/lib/db/auth";
import { formatDbError } from "@/lib/db/errors";
import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileUpdate } from "@/types/database";

export async function ensureProfile(userId: string): Promise<Profile> {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (existingError) {
    throw new Error(formatDbError(existingError));
  }

  if (existing) {
    return existing;
  }

  const { data: authData } = await supabase.auth.getUser();
  const email = authData.user?.email ?? "";
  const fallbackName = email.split("@")[0] || "Student";

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name: fallbackName,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function getProfile(): Promise<Profile | null> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function updateProfile(input: ProfileUpdate): Promise<Profile> {
  const userId = await requireUserId();
  const supabase = await createClient();

  await ensureProfile(userId);

  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}
