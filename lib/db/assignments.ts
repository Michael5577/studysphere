import { requireUserId } from "@/lib/db/auth";
import { formatDbError } from "@/lib/db/errors";
import { getUserPreferences } from "@/lib/db/preferences";
import { createClient } from "@/lib/supabase/server";
import type {
  Assignment,
  AssignmentInsert,
  AssignmentPriority,
  AssignmentStatus,
  AssignmentUpdate,
  AssignmentWithCourse,
  CourseColorKey,
} from "@/types/database";

type CourseRelation = {
  code: string;
  name: string;
  color_key: CourseColorKey;
};

function mapAssignmentRow(
  row: Assignment & { courses: CourseRelation | null },
): AssignmentWithCourse {
  const { courses, ...assignment } = row;

  return {
    ...assignment,
    course: courses
      ? {
          code: courses.code,
          name: courses.name,
          color_key: courses.color_key,
        }
      : null,
  };
}

export async function getAssignments(
  includeCompleted?: boolean,
): Promise<AssignmentWithCourse[]> {
  const userId = await requireUserId();
  const supabase = await createClient();

  let showCompleted = includeCompleted;

  if (showCompleted === undefined) {
    const prefs = await getUserPreferences();
    showCompleted = prefs?.show_completed_assignments ?? true;
  }

  let query = supabase
    .from("assignments")
    .select("*, courses(code, name, color_key)")
    .eq("user_id", userId)
    .order("due_at", { ascending: true, nullsFirst: false });

  if (!showCompleted) {
    query = query.neq("status", "done");
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(formatDbError(error));
  }

  return (data ?? []).map((row) =>
    mapAssignmentRow(row as Assignment & { courses: CourseRelation | null }),
  );
}

export async function getAssignmentById(
  id: string,
): Promise<AssignmentWithCourse | null> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*, courses(code, name, color_key)")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(formatDbError(error));
  }

  if (!data) {
    return null;
  }

  return mapAssignmentRow(data as Assignment & { courses: CourseRelation | null });
}

export async function createAssignment(
  input: Omit<AssignmentInsert, "user_id">,
): Promise<Assignment> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const payload: AssignmentInsert = {
    ...input,
    user_id: userId,
    completed_at: input.status === "done" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("assignments")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function updateAssignment(
  id: string,
  input: AssignmentUpdate,
): Promise<Assignment> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const updatePayload: AssignmentUpdate = { ...input };

  if (input.status === "done") {
    updatePayload.completed_at = new Date().toISOString();
  } else if (input.status) {
    updatePayload.completed_at = null;
  }

  const { data, error } = await supabase
    .from("assignments")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(formatDbError(error));
  }

  return data;
}

export async function deleteAssignment(id: string): Promise<void> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(formatDbError(error));
  }
}

export async function markAssignmentComplete(id: string): Promise<Assignment> {
  return updateAssignment(id, {
    status: "done",
    completed_at: new Date().toISOString(),
  });
}

export async function getUpcomingAssignments(
  limit = 5,
): Promise<AssignmentWithCourse[]> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*, courses(code, name, color_key)")
    .eq("user_id", userId)
    .neq("status", "done")
    .order("due_at", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) {
    throw new Error(formatDbError(error));
  }

  return (data ?? []).map((row) =>
    mapAssignmentRow(row as Assignment & { courses: CourseRelation | null }),
  );
}

export async function getDueSoonAssignments(
  limit = 5,
): Promise<AssignmentWithCourse[]> {
  return getUpcomingAssignments(limit);
}

export async function getDatedAssignments(): Promise<AssignmentWithCourse[]> {
  const userId = await requireUserId();
  const supabase = await createClient();
  const prefs = await getUserPreferences();
  const showCompleted = prefs?.show_completed_assignments ?? true;

  let query = supabase
    .from("assignments")
    .select("*, courses(code, name, color_key)")
    .eq("user_id", userId)
    .not("due_at", "is", null)
    .order("due_at", { ascending: true });

  if (!showCompleted) {
    query = query.neq("status", "done");
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(formatDbError(error));
  }

  return (data ?? []).map((row) =>
    mapAssignmentRow(row as Assignment & { courses: CourseRelation | null }),
  );
}

export async function updateAssignmentStatus(
  id: string,
  status: AssignmentStatus,
): Promise<Assignment> {
  return updateAssignment(id, { status });
}

export async function updateAssignmentPriority(
  id: string,
  priority: AssignmentPriority,
): Promise<Assignment> {
  return updateAssignment(id, { priority });
}
