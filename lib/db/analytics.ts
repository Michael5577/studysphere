import { requireUserId } from "@/lib/db/auth";
import { formatDbError } from "@/lib/db/errors";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsSummary, CourseColorKey } from "@/types/database";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

function computeStreak(minutesByDay: Map<string, number>, today: Date): number {
  let streak = 0;

  for (let offset = 0; offset < 365; offset++) {
    const day = new Date(today);
    day.setDate(day.getDate() - offset);
    const key = toDateKey(day);
    const minutes = minutesByDay.get(key) ?? 0;

    if (minutes > 0) {
      streak += 1;
      continue;
    }

    if (offset === 0) {
      return 0;
    }

    break;
  }

  return streak;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const userId = await requireUserId();
  const supabase = await createClient();
  const today = startOfDay(new Date());

  const [sessionsResult, assignmentsResult, coursesResult] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("started_at, duration_seconds")
      .eq("user_id", userId)
      .eq("session_type", "focus")
      .order("started_at", { ascending: false })
      .limit(500),
    supabase
      .from("assignments")
      .select("id, status, course_id, courses(code, name, color_key)")
      .eq("user_id", userId),
    supabase
      .from("courses")
      .select("id, code, name, color_key")
      .eq("user_id", userId)
      .eq("is_archived", false),
  ]);

  if (sessionsResult.error) {
    throw new Error(formatDbError(sessionsResult.error));
  }

  if (assignmentsResult.error) {
    throw new Error(formatDbError(assignmentsResult.error));
  }

  if (coursesResult.error) {
    throw new Error(formatDbError(coursesResult.error));
  }

  const sessions = sessionsResult.data ?? [];
  const assignments = assignmentsResult.data ?? [];

  const minutesByDay = new Map<string, number>();

  for (const session of sessions) {
    const key = toDateKey(new Date(session.started_at));
    minutesByDay.set(
      key,
      (minutesByDay.get(key) ?? 0) + Math.floor(session.duration_seconds / 60),
    );
  }

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(day.getDate() - (6 - index));
    const date = toDateKey(day);

    return {
      date,
      minutes: minutesByDay.get(date) ?? 0,
    };
  });

  const openAssignments = assignments.filter((item) => item.status !== "done");
  const completedAssignments = assignments.filter((item) => item.status === "done");
  const totalFocusMinutes = sessions.reduce(
    (sum, session) => sum + Math.floor(session.duration_seconds / 60),
    0,
  );

  const workloadMap = new Map<
    string,
    { code: string; name: string; color_key: CourseColorKey; count: number }
  >();

  for (const assignment of openAssignments) {
    const courseRelation = assignment.courses as
      | { code: string; name: string; color_key: CourseColorKey }
      | { code: string; name: string; color_key: CourseColorKey }[]
      | null;

    const course = Array.isArray(courseRelation)
      ? courseRelation[0] ?? null
      : courseRelation;

    if (!assignment.course_id || !course) {
      continue;
    }

    const existing = workloadMap.get(assignment.course_id);

    if (existing) {
      existing.count += 1;
    } else {
      workloadMap.set(assignment.course_id, {
        code: course.code,
        name: course.name,
        color_key: course.color_key,
        count: 1,
      });
    }
  }

  const completionRate =
    assignments.length > 0
      ? Math.round((completedAssignments.length / assignments.length) * 100)
      : 0;

  return {
    total_focus_minutes: totalFocusMinutes,
    total_sessions: sessions.length,
    streak_days: computeStreak(minutesByDay, today),
    completion_rate: completionRate,
    open_assignments: openAssignments.length,
    completed_assignments: completedAssignments.length,
    last_7_days: last7Days,
    workload_by_course: Array.from(workloadMap.entries()).map(
      ([course_id, item]) => ({
        course_id,
        ...item,
      }),
    ),
  };
}

export async function getFocusStreakDays(): Promise<number> {
  const summary = await getAnalyticsSummary();
  return summary.streak_days;
}
