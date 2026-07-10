"use server";

import { createAssignment } from "@/lib/db/assignments";
import { createCourse, getCourses } from "@/lib/db/courses";
import { formatCourseSchedule, type DraftAssignment, type DraftCourse } from "@/lib/semester/types";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";

const REVALIDATE_PATHS = [
  "/dashboard",
  "/courses",
  "/assignments",
  "/calendar",
  "/semester-setup",
];

function revalidateSemesterPaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

export interface SemesterImportPayload {
  courses: DraftCourse[];
  assignments: DraftAssignment[];
}

export interface SemesterImportResult {
  coursesCreated: number;
  coursesSkipped: number;
  assignmentsCreated: number;
  assignmentsSkipped: number;
}

function buildInstructor(course: DraftCourse): string | null {
  const schedule = formatCourseSchedule(course);
  const base = course.instructor.trim();

  if (base && schedule) {
    return `${base} · ${schedule}`;
  }

  return base || schedule;
}

export async function importSemesterAction(
  payload: SemesterImportPayload,
): Promise<ActionResult<SemesterImportResult>> {
  try {
    const existing = await getCourses();
    const existingCodes = new Set(
      existing.map((course) => `${course.code}:${course.semester}`),
    );

    const codeToId = new Map<string, string>();
    let coursesCreated = 0;
    let coursesSkipped = 0;

    for (const course of payload.courses) {
      const code = course.code.trim().toUpperCase();
      const semester = course.semester.trim() || "Current";
      const key = `${code}:${semester}`;

      if (!code || !course.name.trim()) {
        coursesSkipped += 1;
        continue;
      }

      if (existingCodes.has(key)) {
        const match = existing.find(
          (item) => item.code === code && item.semester === semester,
        );

        if (match) {
          codeToId.set(code, match.id);
        }

        coursesSkipped += 1;
        continue;
      }

      const created = await createCourse({
        code,
        name: course.name.trim(),
        instructor: buildInstructor(course),
        semester,
        color_key: course.color_key,
      });

      codeToId.set(code, created.id);
      existingCodes.add(key);
      coursesCreated += 1;
    }

    let assignmentsCreated = 0;
    let assignmentsSkipped = 0;

    for (const assignment of payload.assignments) {
      const code = assignment.course_code.trim().toUpperCase();
      const courseId = codeToId.get(code);

      if (!courseId || !assignment.title.trim()) {
        assignmentsSkipped += 1;
        continue;
      }

      await createAssignment({
        course_id: courseId,
        title: assignment.title.trim(),
        description: assignment.description.trim() || null,
        due_at: assignment.due_at,
        status: assignment.status,
        priority: assignment.priority,
      });

      assignmentsCreated += 1;
    }

    revalidateSemesterPaths();

    return {
      ok: true,
      data: {
        coursesCreated,
        coursesSkipped,
        assignmentsCreated,
        assignmentsSkipped,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to import semester data.",
    };
  }
}
