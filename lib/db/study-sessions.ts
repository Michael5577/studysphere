import { requireUserId } from "@/lib/db/auth";
import { formatDbError } from "@/lib/db/errors";
import { createClient } from "@/lib/supabase/server";
import type {
  StudySession,
  StudySessionInsert,
  SessionType,
} from "@/types/database";

export type StudySessionWithCourse = StudySession & {
  course: { code: string; name: string } | null;
};

export async function createStudySession(
  input: Omit<StudySessionInsert, "user_id">,
): Promise<StudySession> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_sessions")
    .insert({
      ...input,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function getRecentStudySessions(
  limit = 10,
  sessionType: SessionType = "focus",
): Promise<StudySessionWithCourse[]> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("study_sessions")
    .select("*, courses(code, name)")
    .eq("user_id", userId)
    .eq("session_type", sessionType)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(formatDbError(error));
  }

  return (data ?? []).map((row) => {
    const { courses, ...session } = row as StudySession & {
      courses: { code: string; name: string } | null;
    };

    return {
      ...session,
      course: courses,
    };
  });
}
