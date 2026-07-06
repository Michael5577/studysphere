import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, EmptyStateAction } from "@/components/ui/empty-state";
import { getCourseColorClasses } from "@/lib/course-colors";
import type { ActiveCourseSummary } from "@/types/database";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface ActiveCoursesStripProps {
  courses: ActiveCourseSummary[];
}

export function ActiveCoursesStrip({ courses }: ActiveCoursesStripProps) {
  return (
    <Card padding="none" className="surface-card">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <CardTitle>Your semester</CardTitle>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring"
        >
          Manage
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      {courses.length === 0 ? (
        <div className="px-5 py-6">
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Add your classes to organize assignments and focus sessions."
            className="border-none bg-transparent py-6"
            action={
              <Link href="/courses">
                <EmptyStateAction>Create course</EmptyStateAction>
              </Link>
            }
          />
        </div>
      ) : (
        <CardContent className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.slice(0, 8).map((course) => (
            <Link
              key={course.id}
              href={`/assignments?course=${course.id}`}
              className="group rounded-[var(--radius-lg)] border border-border bg-background p-4 transition-default hover:border-primary/30 hover:bg-primary-muted/20 focus-ring"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${getCourseColorClasses(course.color_key).split(" ")[0] ?? "bg-primary"}`}
                  aria-hidden
                />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {course.code}
                </span>
              </div>
              <p className="mt-3 truncate font-medium text-text">{course.name}</p>
              <p className="mt-1 text-xs text-muted">
                {course.open_assignments_count} open task
                {course.open_assignments_count === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
