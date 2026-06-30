"use client";

import { CourseCard } from "@/components/courses/course-card";
import { CreateCourseDialog } from "@/components/courses/create-course-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/layout/section-header";
import type { CourseWithStats } from "@/types/database";
import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";

interface CoursesPageClientProps {
  courses: CourseWithStats[];
}

export function CoursesPageClient({ courses }: CoursesPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseWithStats | null>(
    null,
  );

  function handleEdit(course: CourseWithStats) {
    setEditingCourse(course);
    setDialogOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);

    if (!open) {
      setEditingCourse(null);
    }
  }

  return (
    <div className="section-stack">
      <SectionHeader
        title="Courses"
        description={
          courses.length === 0
            ? "No active courses yet"
            : `${courses.length} active course${courses.length === 1 ? "" : "s"} this semester`
        }
        action={
          <Button
            onClick={() => {
              setEditingCourse(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add course
          </Button>
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Add your first course to start tracking assignments."
          action={
            <Button
              onClick={() => {
                setEditingCourse(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add course
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <CreateCourseDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        course={editingCourse}
      />
    </div>
  );
}
