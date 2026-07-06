"use server";

import {
  createAssignment,
  deleteAssignment,
  markAssignmentComplete,
  updateAssignment,
  updateAssignmentPriority,
  updateAssignmentStatus,
} from "@/lib/db/assignments";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import type {
  Assignment,
  AssignmentPriority,
  AssignmentStatus,
} from "@/types/database";
import {
  ASSIGNMENT_PRIORITIES,
  ASSIGNMENT_STATUSES,
} from "@/types/database";

const REVALIDATE_PATHS = ["/assignments", "/dashboard", "/courses", "/calendar"];

function revalidateAssignmentPaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

export interface AssignmentFormInput {
  title: string;
  description?: string;
  course_id: string;
  due_at?: string | null;
  status?: AssignmentStatus;
  priority?: AssignmentPriority;
}

function validateAssignmentInput(input: AssignmentFormInput): string | null {
  const title = input.title?.trim();

  if (!title) {
    return "Assignment title is required.";
  }

  if (title.length > 300) {
    return "Assignment title must be 300 characters or fewer.";
  }

  if (!input.course_id) {
    return "Course is required.";
  }

  if (input.status && !ASSIGNMENT_STATUSES.includes(input.status)) {
    return "Invalid assignment status.";
  }

  if (input.priority && !ASSIGNMENT_PRIORITIES.includes(input.priority)) {
    return "Invalid assignment priority.";
  }

  return null;
}

export async function createAssignmentAction(
  input: AssignmentFormInput,
): Promise<ActionResult<Assignment>> {
  try {
    const validationError = validateAssignmentInput(input);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const status = input.status ?? "todo";

    const assignment = await createAssignment({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      course_id: input.course_id,
      due_at: input.due_at || null,
      status,
      priority: input.priority ?? "medium",
      completed_at: status === "done" ? new Date().toISOString() : null,
    });

    revalidateAssignmentPaths();
    return { ok: true, data: assignment };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to create assignment.",
    };
  }
}

export async function updateAssignmentAction(
  id: string,
  input: AssignmentFormInput,
): Promise<ActionResult<Assignment>> {
  try {
    const validationError = validateAssignmentInput(input);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const status = input.status ?? "todo";

    const assignment = await updateAssignment(id, {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      course_id: input.course_id,
      due_at: input.due_at || null,
      status,
      priority: input.priority ?? "medium",
    });

    revalidateAssignmentPaths();
    return { ok: true, data: assignment };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update assignment.",
    };
  }
}

export async function deleteAssignmentAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return { ok: false, message: "Assignment id is required." };
    }

    await deleteAssignment(id);
    revalidateAssignmentPaths();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to delete assignment.",
    };
  }
}

export async function markAssignmentCompleteAction(
  id: string,
): Promise<ActionResult<Assignment>> {
  try {
    if (!id) {
      return { ok: false, message: "Assignment id is required." };
    }

    const assignment = await markAssignmentComplete(id);
    revalidateAssignmentPaths();
    return { ok: true, data: assignment };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to mark assignment complete.",
    };
  }
}

export async function updateAssignmentStatusAction(
  id: string,
  status: AssignmentStatus,
): Promise<ActionResult<Assignment>> {
  try {
    if (!id) {
      return { ok: false, message: "Assignment id is required." };
    }

    if (!ASSIGNMENT_STATUSES.includes(status)) {
      return { ok: false, message: "Invalid assignment status." };
    }

    const assignment = await updateAssignmentStatus(id, status);
    revalidateAssignmentPaths();
    return { ok: true, data: assignment };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update status.",
    };
  }
}

export async function updateAssignmentPriorityAction(
  id: string,
  priority: AssignmentPriority,
): Promise<ActionResult<Assignment>> {
  try {
    if (!id) {
      return { ok: false, message: "Assignment id is required." };
    }

    if (!ASSIGNMENT_PRIORITIES.includes(priority)) {
      return { ok: false, message: "Invalid assignment priority." };
    }

    const assignment = await updateAssignmentPriority(id, priority);
    revalidateAssignmentPaths();
    return { ok: true, data: assignment };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to update priority.",
    };
  }
}
