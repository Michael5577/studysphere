import type { AssignmentPriority, AssignmentStatus } from "@/types/database";
import {
  COLOR_CYCLE,
  createDraftCourse,
  type DraftAssignment,
  type DraftCourse,
  type SemesterImportDraft,
} from "@/lib/semester/types";

const VALID_PRIORITIES = new Set<AssignmentPriority>(["low", "medium", "high"]);
const VALID_STATUSES = new Set<AssignmentStatus>(["todo", "in_progress", "done"]);

function normalizeStatus(value: string): AssignmentStatus {
  const normalized = value.trim().toLowerCase().replace(/-/g, "_");

  if (normalized === "not_started") {
    return "todo";
  }

  return VALID_STATUSES.has(normalized as AssignmentStatus)
    ? (normalized as AssignmentStatus)
    : "todo";
}

function normalizePriority(value: string): AssignmentPriority {
  const normalized = value.trim().toLowerCase();
  return VALID_PRIORITIES.has(normalized as AssignmentPriority)
    ? (normalized as AssignmentPriority)
    : "medium";
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

export function parseSemesterCsv(content: string): {
  draft: SemesterImportDraft;
  errors: string[];
} {
  const errors: string[] = [];
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return {
      draft: { courses: [], assignments: [], events: [] },
      errors: ["CSV must include a header row and at least one data row."],
    };
  }

  const header = parseCsvLine(lines[0]).map((cell) => cell.toLowerCase());
  const required = ["type", "course_code", "course_name"];

  for (const column of required) {
    if (!header.includes(column)) {
      errors.push(`Missing required column: ${column}`);
    }
  }

  if (errors.length > 0) {
    return { draft: { courses: [], assignments: [], events: [] }, errors };
  }

  const courses: DraftCourse[] = [];
  const assignments: DraftAssignment[] = [];
  const courseCodes = new Set<string>();
  let colorIndex = 0;

  for (let rowIndex = 1; rowIndex < lines.length; rowIndex += 1) {
    const cells = parseCsvLine(lines[rowIndex]);
    const row: Record<string, string> = {};

    header.forEach((key, index) => {
      row[key] = cells[index] ?? "";
    });

    const type = row.type?.toLowerCase();
    const code = row.course_code?.trim().toUpperCase();

    if (!code) {
      errors.push(`Row ${rowIndex + 1}: course_code is required.`);
      continue;
    }

    if (type === "course") {
      if (courseCodes.has(code)) {
        errors.push(`Row ${rowIndex + 1}: duplicate course ${code} in CSV.`);
        continue;
      }

      courseCodes.add(code);
      courses.push(
        createDraftCourse({
          code,
          name: row.course_name?.trim() || code,
          instructor: row.instructor?.trim() ?? "",
          semester: "Fall 2026",
          color_key: COLOR_CYCLE[colorIndex % COLOR_CYCLE.length],
          meeting_days: row.meeting_days?.trim() ?? "",
          start_time: row.start_time?.trim() ?? "",
          end_time: row.end_time?.trim() ?? "",
          location: row.location?.trim() ?? "",
        }),
      );
      colorIndex += 1;
      continue;
    }

    if (type === "assignment") {
      const title = row.title?.trim();

      if (!title) {
        errors.push(`Row ${rowIndex + 1}: assignment title is required.`);
        continue;
      }

      assignments.push({
        id: crypto.randomUUID(),
        course_code: code,
        title,
        due_at: row.due_date?.trim() ? `${row.due_date.trim()}T12:00:00` : null,
        priority: normalizePriority(row.priority ?? "medium"),
        status: normalizeStatus(row.status ?? "todo"),
        description: "",
      });
      continue;
    }

    errors.push(`Row ${rowIndex + 1}: type must be course or assignment.`);
  }

  return { draft: { courses, assignments, events: [] }, errors };
}
