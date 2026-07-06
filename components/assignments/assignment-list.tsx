"use client";

import { AssignmentActionsMenu } from "@/components/assignments/assignment-actions-menu";
import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/lib/format";
import type { AssignmentWithCourse } from "@/types/database";

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const statusVariant = {
  todo: "outline" as const,
  in_progress: "primary" as const,
  done: "success" as const,
};

const priorityVariant = {
  high: "error" as const,
  medium: "warning" as const,
  low: "default" as const,
};

interface AssignmentListProps {
  assignments: AssignmentWithCourse[];
  onEdit: (assignment: AssignmentWithCourse) => void;
}

export function AssignmentList({ assignments, onEdit }: AssignmentListProps) {
  return (
    <div className="divide-y divide-border">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="list-row flex items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">
              {assignment.title}
            </p>
            <p className="mt-0.5 text-caption">
              {assignment.course?.code ?? "Unknown course"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Badge variant={statusVariant[assignment.status]} className="hidden sm:inline-flex">
              {statusLabels[assignment.status]}
            </Badge>
            <Badge variant={priorityVariant[assignment.priority]}>
              {assignment.priority}
            </Badge>
            <span className="hidden w-24 text-right text-caption md:inline">
              {formatDueDate(assignment.due_at)}
            </span>
            <AssignmentActionsMenu
              assignment={assignment}
              onEdit={onEdit}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
