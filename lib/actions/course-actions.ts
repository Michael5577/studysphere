"use server";

import {
  archiveCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/lib/db/courses";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import type { Course, CourseColorKey } from "@/types/database";
import { COURSE_COLOR_KEYS } from "@/types/database";

const REVALIDATE_PATHS = ["/courses", "/dashboard", "/assignments"];

function revalidateCoursePaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

export interface CourseFormInput {
  code: string;
  name: string;
  instructor?: string;
  semester?: string;
  color_key?: CourseColorKey;
}

function validateCourseInput(input: CourseFormInput): string | null {
  const code = input.code?.trim();
  const name = input.name?.trim();

  if (!code) {
    return "Course code is required.";
  }

  if (!name) {
    return "Course name is required.";
  }

  if (code.length > 20) {
    return "Course code must be 20 characters or fewer.";
  }

  if (name.length > 200) {
    return "Course name must be 200 characters or fewer.";
  }

  if (input.color_key && !COURSE_COLOR_KEYS.includes(input.color_key)) {
    return "Invalid course color.";
  }

  return null;
}

export async function createCourseAction(
  input: CourseFormInput,
): Promise<ActionResult<Course>> {
  try {
    const validationError = validateCourseInput(input);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const course = await createCourse({
      code: input.code.trim(),
      name: input.name.trim(),
      instructor: input.instructor?.trim() || null,
      semester: input.semester?.trim() || "Current",
      color_key: input.color_key ?? "indigo",
    });

    revalidateCoursePaths();
    return { ok: true, data: course };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create course.",
    };
  }
}

export async function updateCourseAction(
  id: string,
  input: CourseFormInput,
): Promise<ActionResult<Course>> {
  try {
    const validationError = validateCourseInput(input);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const course = await updateCourse(id, {
      code: input.code.trim(),
      name: input.name.trim(),
      instructor: input.instructor?.trim() || null,
      semester: input.semester?.trim() || "Current",
      color_key: input.color_key ?? "indigo",
    });

    revalidateCoursePaths();
    return { ok: true, data: course };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to update course.",
    };
  }
}

export async function deleteCourseAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return { ok: false, message: "Course id is required." };
    }

    await deleteCourse(id);
    revalidateCoursePaths();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete course.",
    };
  }
}

export async function archiveCourseAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return { ok: false, message: "Course id is required." };
    }

    await archiveCourse(id);
    revalidateCoursePaths();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to archive course.",
    };
  }
}
