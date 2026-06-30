"use client";

import { CourseActionsMenu } from "@/components/courses/course-actions-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCourseColorClasses } from "@/lib/course-colors";
import type { CourseWithStats } from "@/types/database";

interface CourseCardProps {
  course: CourseWithStats;
  onEdit: (course: CourseWithStats) => void;
}

export function CourseCard({ course, onEdit }: CourseCardProps) {
  return (
    <Card
      padding="md"
      className="transition-default hover:border-primary/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-[var(--radius)] px-2 py-0.5 text-label ${getCourseColorClasses(course.color_key)}`}
            >
              {course.code}
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-text">{course.name}</h3>
          <p className="mt-1 text-caption">
            {course.instructor || "No instructor listed"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant="outline">
            {course.open_assignments_count} open
          </Badge>
          <CourseActionsMenu course={course} onEdit={onEdit} />
        </div>
      </div>
    </Card>
  );
}
