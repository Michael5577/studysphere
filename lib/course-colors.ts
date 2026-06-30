import type { CourseColorKey } from "@/types/database";

export const COURSE_COLOR_CLASSES: Record<CourseColorKey, string> = {
  indigo: "bg-primary-muted text-primary",
  violet: "bg-violet-100 text-violet-700",
  slate: "bg-slate-100 text-slate-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
};

export function getCourseColorClasses(colorKey: CourseColorKey): string {
  return COURSE_COLOR_CLASSES[colorKey];
}
