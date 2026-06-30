import { requireUserId } from "@/lib/db/auth";
import { formatDbError } from "@/lib/db/errors";
import { createClient } from "@/lib/supabase/server";
import type {
  Course,
  CourseInsert,
  CourseUpdate,
  CourseWithStats,
} from "@/types/database";

async function attachOpenAssignmentCounts(
  courses: Course[],
): Promise<CourseWithStats[]> {
  if (courses.length === 0) {
    return [];
  }

  const userId = await requireUserId();
  const supabase = await createClient();

  const { data: assignments, error } = await supabase
    .from("assignments")
    .select("course_id")
    .eq("user_id", userId)
    .neq("status", "done");

  if (error) {
    throw new Error(formatDbError(error));
  }

  const counts = new Map<string, number>();

  for (const row of assignments ?? []) {
    counts.set(row.course_id, (counts.get(row.course_id) ?? 0) + 1);
  }

  return courses.map((course) => ({
    ...course,
    open_assignments_count: counts.get(course.id) ?? 0,
  }));
}

export async function getCourses(): Promise<CourseWithStats[]> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("code", { ascending: true });

  if (error) {
    throw new Error(formatDbError(error));
  }

  return attachOpenAssignmentCounts(data ?? []);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function createCourse(
  input: Omit<CourseInsert, "user_id">,
): Promise<Course> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
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

export async function updateCourse(
  id: string,
  input: CourseUpdate,
): Promise<Course> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function deleteCourse(id: string): Promise<void> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(formatDbError(error));
  }
}

export async function archiveCourse(id: string): Promise<Course> {
  return updateCourse(id, { is_archived: true });
}
