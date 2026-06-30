"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type AuthResult =
  | { ok: true; needsEmailConfirmation?: boolean }
  | { ok: false; message: string };

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return {
      ok: false,
      message:
        "Could not reach Supabase. Check your connection and try again.",
    };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Supabase signUp error:", error);
      return { ok: false, message: error.message };
    }

    if (data.session) {
      revalidatePath("/", "layout");
      return { ok: true };
    }

    return { ok: true, needsEmailConfirmation: true };
  } catch (err) {
    console.error("Supabase signUp failed:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Could not reach Supabase. Check your connection and try again.";
    return { ok: false, message };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
