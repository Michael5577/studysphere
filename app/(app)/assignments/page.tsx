import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Plus } from "lucide-react";

const assignments = [
  {
    title: "Problem Set 4 — Integration Techniques",
    course: "MATH 301",
    due: "Jun 25",
    status: "in_progress" as const,
    priority: "high" as const,
  },
  {
    title: "Binary Search Tree Implementation",
    course: "CS 201",
    due: "Jun 26",
    status: "todo" as const,
    priority: "high" as const,
  },
  {
    title: "Research Paper Outline",
    course: "ENG 201",
    due: "Jun 27",
    status: "todo" as const,
    priority: "medium" as const,
  },
  {
    title: "Lab Report — Acid-Base Titration",
    course: "CHEM 110",
    due: "Jun 28",
    status: "todo" as const,
    priority: "low" as const,
  },
  {
    title: "Midterm Review Notes",
    course: "HIST 150",
    due: "Jun 30",
    status: "done" as const,
    priority: "medium" as const,
  },
];

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

export default function AssignmentsPage() {
  return (
    <PageContainer>
      <div className="section-stack">
        <SectionHeader
          title="Assignments"
          description="12 total · 7 open · 5 completed"
          action={
            <Button>
              <Plus className="h-4 w-4" />
              New assignment
            </Button>
          }
        />

        <Card padding="none">
          <div className="divide-y divide-border">
            {assignments.map((assignment) => (
              <div
                key={assignment.title}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-default hover:bg-background/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">
                    {assignment.title}
                  </p>
                  <p className="mt-0.5 text-caption">{assignment.course}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={statusVariant[assignment.status]}>
                    {statusLabels[assignment.status]}
                  </Badge>
                  <Badge variant={priorityVariant[assignment.priority]}>
                    {assignment.priority}
                  </Badge>
                  <span className="hidden w-14 text-right text-caption sm:inline">
                    {assignment.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
