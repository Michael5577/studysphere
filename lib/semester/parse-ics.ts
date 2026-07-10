import {
  COLOR_CYCLE,
  createDraftCourse,
  type DraftCalendarEvent,
  type SemesterImportDraft,
} from "@/lib/semester/types";

function unfoldIcs(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .reduce((accumulator, line) => {
      if (line.startsWith(" ") || line.startsWith("\t")) {
        const last = accumulator.pop() ?? "";
        return [...accumulator, last + line.trimStart()];
      }

      return [...accumulator, line];
    }, [] as string[])
    .join("\n");
}

function parseIcsDate(value: string): string | null {
  const trimmed = value.trim();

  if (/^\d{8}T\d{6}Z?$/.test(trimmed)) {
    const year = trimmed.slice(0, 4);
    const month = trimmed.slice(4, 6);
    const day = trimmed.slice(6, 8);
    const hour = trimmed.slice(9, 11);
    const minute = trimmed.slice(11, 13);
    const second = trimmed.slice(13, 15);
    const suffix = trimmed.endsWith("Z") ? "Z" : "";
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${suffix}`;
  }

  if (/^\d{8}$/.test(trimmed)) {
    const year = trimmed.slice(0, 4);
    const month = trimmed.slice(4, 6);
    const day = trimmed.slice(6, 8);
    return `${year}-${month}-${day}T12:00:00`;
  }

  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function guessCourseCode(summary: string): string {
  const match = summary.match(/\b([A-Z]{2,4}\s?\d{3}[A-Z]?)\b/);
  return match ? match[1].replace(/\s+/g, "") : "";
}

export function parseSemesterIcs(content: string): {
  draft: SemesterImportDraft;
  errors: string[];
} {
  const unfolded = unfoldIcs(content);
  const blocks = unfolded.split("BEGIN:VEVENT").slice(1);
  const events: DraftCalendarEvent[] = [];
  const errors: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    const fields: Record<string, string> = {};

    for (const line of lines) {
      if (!line.includes(":")) {
        continue;
      }

      const [rawKey, ...rest] = line.split(":");
      const key = rawKey.split(";")[0].toUpperCase();
      fields[key] = rest.join(":").trim();
    }

    const title = fields.SUMMARY?.trim();

    if (!title) {
      continue;
    }

    const startAt = fields.DTSTART ? parseIcsDate(fields.DTSTART) : null;
    const endAt = fields.DTEND ? parseIcsDate(fields.DTEND) : null;
    const courseCode = guessCourseCode(title);

    events.push({
      id: crypto.randomUUID(),
      title,
      start_at: startAt,
      end_at: endAt,
      location: fields.LOCATION?.trim() ?? "",
      course_code: courseCode,
      selected: true,
    });
  }

  if (events.length === 0) {
    errors.push("No calendar events found in this .ics file.");
  }

  const courseCodes = [
    ...new Set(events.map((event) => event.course_code).filter(Boolean)),
  ];

  const courses = courseCodes.map((code, index) =>
    createDraftCourse({
      code,
      name: code,
      color_key: COLOR_CYCLE[index % COLOR_CYCLE.length],
    }),
  );

  const assignments = events
    .filter((event) => event.start_at)
    .map((event) => ({
      id: crypto.randomUUID(),
      course_code: event.course_code || "GENERAL",
      title: event.title,
      due_at: event.start_at,
      priority: "medium" as const,
      status: "todo" as const,
      description: event.location ? `Location: ${event.location}` : "",
    }));

  if (!courseCodes.length && events.length > 0) {
    courses.push(
      createDraftCourse({
        code: "GENERAL",
        name: "Imported calendar",
        color_key: "slate",
      }),
    );
  }

  return {
    draft: { courses, assignments, events },
    errors,
  };
}
