"use client";

import { AssignmentList } from "@/components/assignments/assignment-list";
import { CreateAssignmentDialog } from "@/components/assignments/create-assignment-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/layout/section-header";
import type { AssignmentWithCourse, Course } from "@/types/database";
import { ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AssignmentsPageClientProps {
  assignments: AssignmentWithCourse[];
  courses: Course[];
  totalCount: number;
  openCount: number;
  completedCount: number;
}

export function AssignmentsPageClient({
  assignments,
  courses,
  totalCount,
  openCount,
  completedCount,
}: AssignmentsPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<AssignmentWithCourse | null>(null);

  function handleEdit(assignment: AssignmentWithCourse) {
    setEditingAssignment(assignment);
    setDialogOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);

    if (!open) {
      setEditingAssignment(null);
    }
  }

  const description =
    totalCount === 0
      ? "No assignments yet"
      : `${totalCount} total · ${openCount} open · ${completedCount} completed`;

  return (
    <div className="section-stack">
      <SectionHeader
        title="Assignments"
        description={description}
        action={
          courses.length > 0 ? (
            <Button
              onClick={() => {
                setEditingAssignment(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New assignment
            </Button>
          ) : undefined
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="Create a course first"
          description="Assignments belong to a course. Add a course before creating assignments."
          action={
            <Link href="/courses">
              <Button type="button">Go to courses</Button>
            </Link>
          }
        />
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No assignments yet"
          description="Add your first assignment to start tracking deadlines."
          action={
            <Button
              onClick={() => {
                setEditingAssignment(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New assignment
            </Button>
          }
        />
      ) : (
        <Card padding="none">
          <AssignmentList assignments={assignments} onEdit={handleEdit} />
        </Card>
      )}

      <CreateAssignmentDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        courses={courses}
        assignment={editingAssignment}
      />
    </div>
  );
}
