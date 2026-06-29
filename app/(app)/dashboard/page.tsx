import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { BookOpen, Clock, ListTodo, Timer } from "lucide-react";

const todayAssignments = [
  {
    title: "Problem Set 4 — Integration Techniques",
    course: "MATH 301",
    due: "Today, 11:59 PM",
    priority: "high" as const,
  },
  {
    title: "Research Paper Outline",
    course: "ENG 201",
    due: "Tomorrow",
    priority: "medium" as const,
  },
  {
    title: "Lab Report — Acid-Base Titration",
    course: "CHEM 110",
    due: "Friday",
    priority: "low" as const,
  },
];

const priorityVariant = {
  high: "error" as const,
  medium: "warning" as const,
  low: "default" as const,
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="section-stack">
        <SectionHeader
          title="Good evening, Michael"
          description="Wednesday, June 25 — Fall semester week 8"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Due today", value: "2", icon: ListTodo },
            { label: "Active courses", value: "5", icon: BookOpen },
            { label: "Focus today", value: "1h 45m", icon: Timer },
            { label: "This week", value: "7 tasks", icon: Clock },
          ].map((stat) => (
            <Card key={stat.label} padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-text">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] bg-background text-muted">
                  <stat.icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card padding="none">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle>Due soon</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {todayAssignments.map((assignment) => (
              <div
                key={assignment.title}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">
                    {assignment.title}
                  </p>
                  <p className="mt-0.5 text-caption">{assignment.course}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={priorityVariant[assignment.priority]}>
                    {assignment.priority}
                  </Badge>
                  <span className="hidden text-caption sm:inline">
                    {assignment.due}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
