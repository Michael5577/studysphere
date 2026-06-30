import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDueDate } from "@/lib/format";
import type { AssignmentWithCourse } from "@/types/database";
import { ListTodo } from "lucide-react";

const priorityVariant = {
  high: "error" as const,
  medium: "warning" as const,
  low: "default" as const,
};

interface DueSoonListProps {
  assignments: AssignmentWithCourse[];
}

export function DueSoonList({ assignments }: DueSoonListProps) {
  return (
    <Card padding="none">
      <CardHeader className="border-b border-border px-5 py-4">
        <CardTitle>Due soon</CardTitle>
      </CardHeader>
      {assignments.length === 0 ? (
        <div className="px-5 py-8">
          <EmptyState
            icon={ListTodo}
            title="Nothing due soon"
            description="Open assignments with upcoming due dates will appear here."
            className="border-none bg-transparent py-8"
          />
        </div>
      ) : (
        <CardContent className="divide-y divide-border">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">
                  {assignment.title}
                </p>
                <p className="mt-0.5 text-caption">
                  {assignment.course?.code ?? "Unknown course"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={priorityVariant[assignment.priority]}>
                  {assignment.priority}
                </Badge>
                <span className="hidden text-caption sm:inline">
                  {formatDueDate(assignment.due_at)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
