import type { AssignmentPriority, AssignmentStatus, CourseColorKey } from "@/types/database";

export type SemesterImportMethod = "manual" | "csv" | "ics" | "syllabus";

export interface DraftCourse {
  id: string;
  code: string;
  name: string;
  instructor: string;
  semester: string;
  color_key: CourseColorKey;
  meeting_days: string;
  start_time: string;
  end_time: string;
  location: string;
}

export interface DraftAssignment {
  id: string;
  course_code: string;
  title: string;
  due_at: string | null;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  description: string;
}

export interface DraftCalendarEvent {
  id: string;
  title: string;
  start_at: string | null;
  end_at: string | null;
  location: string;
  course_code: string;
  selected: boolean;
}

export interface SemesterImportDraft {
  courses: DraftCourse[];
  assignments: DraftAssignment[];
  events: DraftCalendarEvent[];
}

export const CSV_TEMPLATE = `type,course_code,course_name,title,instructor,meeting_days,start_time,end_time,location,due_date,priority,status
course,CSCI301,Operating Systems,,Dr. Smith,MWF,10:00,10:50,Sage 224,,,
assignment,CSCI301,Operating Systems,Project 1,,,,,,2026-09-12,high,todo`;

export const COLOR_CYCLE: CourseColorKey[] = [
  "indigo",
  "violet",
  "slate",
  "amber",
  "rose",
];

export function createDraftCourse(partial?: Partial<DraftCourse>): DraftCourse {
  return {
    id: crypto.randomUUID(),
    code: "",
    name: "",
    instructor: "",
    semester: "Fall 2026",
    color_key: "indigo",
    meeting_days: "",
    start_time: "",
    end_time: "",
    location: "",
    ...partial,
  };
}

export function formatCourseSchedule(course: DraftCourse): string | null {
  const parts = [
    course.meeting_days,
    course.start_time && course.end_time
      ? `${course.start_time}-${course.end_time}`
      : course.start_time,
    course.location,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}
