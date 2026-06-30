"use server";

import { ensureProfile, updateProfile } from "@/lib/db/profile";
import { requireUserId } from "@/lib/db/auth";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import type { Profile } from "@/types/database";

export interface ProfileFormInput {
  full_name?: string;
  major?: string;
  university?: string;
  year_level?: string;
}

function validateProfileInput(input: ProfileFormInput): string | null {
  if (input.full_name && input.full_name.trim().length > 120) {
    return "Name must be 120 characters or fewer.";
  }

  if (input.major && input.major.trim().length > 120) {
    return "Major must be 120 characters or fewer.";
  }

  if (input.university && input.university.trim().length > 120) {
    return "University must be 120 characters or fewer.";
  }

  if (input.year_level && input.year_level.trim().length > 60) {
    return "Year level must be 60 characters or fewer.";
  }

  return null;
}

export async function updateProfileAction(
  input: ProfileFormInput,
): Promise<ActionResult<Profile>> {
  try {
    const validationError = validateProfileInput(input);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const userId = await requireUserId();
    await ensureProfile(userId);

    const profile = await updateProfile({
      full_name: input.full_name?.trim() || null,
      major: input.major?.trim() || null,
      university: input.university?.trim() || null,
      year_level: input.year_level?.trim() || null,
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { ok: true, data: profile };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update profile.",
    };
  }
}
