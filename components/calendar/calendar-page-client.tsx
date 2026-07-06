"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/layout/section-header";
import { getCourseColorClasses } from "@/lib/course-colors";
import {
  addDays,
  formatWeekRange,
  getWeekDays,
  getWeekStart,
  isToday,
  toDateKey,
} from "@/lib/calendar";
import { formatDueTime } from "@/lib/format";
import type { AssignmentWithCourse } from "@/types/database";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

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

interface CalendarPageClientProps {
  assignments: AssignmentWithCourse[];
}

function AssignmentEvent({ assignment }: { assignment: AssignmentWithCourse }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-background px-2.5 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text">
            {assignment.title}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted">
            {assignment.course?.code ?? "Unknown course"}
          </p>
        </div>
        <span className="shrink-0 text-[11px] text-muted">
          {formatDueTime(assignment.due_at)}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <Badge variant={statusVariant[assignment.status]} className="text-[10px]">
          {statusLabels[assignment.status]}
        </Badge>
        <Badge variant={priorityVariant[assignment.priority]} className="text-[10px]">
          {assignment.priority}
        </Badge>
      </div>
    </div>
  );
}

export function CalendarPageClient({ assignments }: CalendarPageClientProps) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const assignmentsByDate = useMemo(() => {
    const map = new Map<string, AssignmentWithCourse[]>();

    for (const assignment of assignments) {
      if (!assignment.due_at) {
        continue;
      }

      const key = toDateKey(new Date(assignment.due_at));
      const existing = map.get(key) ?? [];
      existing.push(assignment);
      map.set(key, existing);
    }

    return map;
  }, [assignments]);

  const weekAssignments = useMemo(() => {
    return weekDays.flatMap((day) => assignmentsByDate.get(toDateKey(day)) ?? []);
  }, [weekDays, assignmentsByDate]);

  const weekHasAssignments = weekAssignments.length > 0;

  function goToPreviousWeek() {
    setWeekStart((current) => addDays(current, -7));
  }

  function goToNextWeek() {
    setWeekStart((current) => addDays(current, 7));
  }

  function goToToday() {
    setWeekStart(getWeekStart(new Date()));
  }

  return (
    <div className="section-stack">
      <SectionHeader
        title="Calendar"
        description={formatWeekRange(weekStart)}
        action={
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous week</span>
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next week</span>
            </Button>
          </div>
        }
      />

      {assignments.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No dated assignments"
          description="Add due dates to your assignments and they will appear on your calendar."
        />
      ) : !weekHasAssignments ? (
        <Card padding="lg" className="surface-card text-center">
          <p className="text-sm font-medium text-text">Nothing due this week</p>
          <p className="mt-1 text-caption">
            Navigate to another week or add assignments with due dates.
          </p>
        </Card>
      ) : (
        <>
          {/* Mobile: agenda list grouped by day */}
          <div className="space-y-3 lg:hidden">
            {weekDays.map((day) => {
              const dayAssignments =
                assignmentsByDate.get(toDateKey(day)) ?? [];

              if (dayAssignments.length === 0) {
                return null;
              }

              return (
                <Card key={toDateKey(day)} padding="none" className="surface-card">
                  <div
                    className={`border-b border-border px-4 py-3 ${
                      isToday(day) ? "bg-primary-muted/40" : ""
                    }`}
                  >
                    <p className="text-label">
                      {day.toLocaleDateString("en-US", { weekday: "long" })}
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-semibold ${
                        isToday(day) ? "text-primary" : "text-text"
                      }`}
                    >
                      {day.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="space-y-2 p-3">
                    {dayAssignments.map((assignment) => (
                      <AssignmentEvent
                        key={assignment.id}
                        assignment={assignment}
                      />
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop: week grid */}
          <Card padding="none" className="surface-card hidden overflow-hidden lg:block">
            <div className="grid grid-cols-7 border-b border-border">
              {weekDays.map((day) => (
                <div
                  key={toDateKey(day)}
                  className={`border-r border-border px-3 py-3 text-center last:border-r-0 ${
                    isToday(day) ? "bg-primary-muted/40" : ""
                  }`}
                >
                  <p className="text-label">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isToday(day) ? "text-primary" : "text-text"
                    }`}
                  >
                    {day.getDate()}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid min-h-[320px] grid-cols-7">
              {weekDays.map((day) => {
                const dayAssignments =
                  assignmentsByDate.get(toDateKey(day)) ?? [];

                return (
                  <div
                    key={toDateKey(day)}
                    className={`border-r border-border p-2 last:border-r-0 ${
                      isToday(day) ? "bg-primary-muted/20" : ""
                    }`}
                  >
                    <div className="space-y-2">
                      {dayAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className={`rounded-[var(--radius)] border border-border bg-background px-2 py-1.5 ${
                            assignment.course
                              ? getCourseColorClasses(assignment.course.color_key)
                              : ""
                          }`}
                        >
                          <p className="truncate text-xs font-medium text-text">
                            {assignment.title}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] opacity-80">
                            {assignment.course?.code ?? "—"}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            <Badge
                              variant={statusVariant[assignment.status]}
                              className="text-[9px]"
                            >
                              {statusLabels[assignment.status]}
                            </Badge>
                            <span className="text-[10px] text-muted">
                              {formatDueTime(assignment.due_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
