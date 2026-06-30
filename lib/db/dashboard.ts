import { requireUserId } from "@/lib/db/auth";
import { formatDbError } from "@/lib/db/errors";
import { createClient } from "@/lib/supabase/server";
import type {
  ActiveCourseSummary,
  DashboardStats,
} from "@/types/database";
import { getDueSoonAssignments } from "@/lib/db/assignments";
import { getCourses } from "@/lib/db/courses";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function endOfWeek(date: Date): Date {
  const end = endOfDay(date);
  const day = end.getDay();
  const daysUntilSunday = 7 - day;
  end.setDate(end.getDate() + daysUntilSunday);
  return end;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const userId = await requireUserId();
  const supabase = await createClient();
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const todayEnd = endOfDay(now).toISOString();
  const weekEnd = endOfWeek(now).toISOString();

  const [
    coursesResult,
    dueTodayResult,
    dueWeekResult,
    completedResult,
    focusTodayResult,
    focusTotalResult,
  ] = await Promise.all([
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_archived", false),
    supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("status", "done")
      .gte("due_at", todayStart)
      .lte("due_at", todayEnd),
    supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("status", "done")
      .gte("due_at", todayStart)
      .lte("due_at", weekEnd),
    supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "done"),
    supabase
      .from("study_sessions")
      .select("duration_seconds")
      .eq("user_id", userId)
      .eq("session_type", "focus")
      .gte("started_at", todayStart)
      .lte("started_at", todayEnd),
    supabase
      .from("study_sessions")
      .select("duration_seconds")
      .eq("user_id", userId)
      .eq("session_type", "focus"),
  ]);

  if (coursesResult.error) throw new Error(formatDbError(coursesResult.error));
  if (dueTodayResult.error) throw new Error(formatDbError(dueTodayResult.error));
  if (dueWeekResult.error) throw new Error(formatDbError(dueWeekResult.error));
  if (completedResult.error) {
    throw new Error(formatDbError(completedResult.error));
  }
  if (focusTodayResult.error) {
    throw new Error(formatDbError(focusTodayResult.error));
  }
  if (focusTotalResult.error) {
    throw new Error(formatDbError(focusTotalResult.error));
  }

  const focusSecondsToday = (focusTodayResult.data ?? []).reduce(
    (sum, row) => sum + row.duration_seconds,
    0,
  );
  const focusSecondsTotal = (focusTotalResult.data ?? []).reduce(
    (sum, row) => sum + row.duration_seconds,
    0,
  );

  return {
    active_courses: coursesResult.count ?? 0,
    due_today: dueTodayResult.count ?? 0,
    due_this_week: dueWeekResult.count ?? 0,
    completed_assignments: completedResult.count ?? 0,
    focus_minutes_today: Math.floor(focusSecondsToday / 60),
    total_focus_minutes: Math.floor(focusSecondsTotal / 60),
  };
}

export { getDueSoonAssignments };

export async function getActiveCoursesSummary(): Promise<
  ActiveCourseSummary[]
> {
  const courses = await getCourses();

  return courses.map((course) => ({
    id: course.id,
    code: course.code,
    name: course.name,
    color_key: course.color_key,
    open_assignments_count: course.open_assignments_count,
  }));
}
