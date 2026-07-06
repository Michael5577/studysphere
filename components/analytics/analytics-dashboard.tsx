import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDurationMinutes } from "@/lib/format";
import { getCourseColorClasses } from "@/lib/course-colors";
import type { AnalyticsSummary } from "@/types/database";
import { Flame, Target, Timer, TrendingUp } from "lucide-react";

interface AnalyticsDashboardProps {
  summary: AnalyticsSummary;
}

export function AnalyticsDashboard({ summary }: AnalyticsDashboardProps) {
  const maxMinutes = Math.max(
    1,
    ...summary.last_7_days.map((day) => day.minutes),
  );

  return (
    <div className="section-stack">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <MetricCard
          label="Total focus"
          value={formatDurationMinutes(summary.total_focus_minutes)}
          icon={Timer}
        />
        <MetricCard
          label="Sessions"
          value={String(summary.total_sessions)}
          icon={TrendingUp}
        />
        <MetricCard
          label="Streak"
          value={`${summary.streak_days}d`}
          icon={Flame}
          accent
        />
        <MetricCard
          label="Completion"
          value={`${summary.completion_rate}%`}
          icon={Target}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="none" className="surface-card">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle>Focus trend</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-5">
            <div className="flex h-44 items-end gap-2">
              {summary.last_7_days.map((day) => {
                const height = Math.max(8, (day.minutes / maxMinutes) * 100);
                const label = new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                });

                return (
                  <div
                    key={day.date}
                    className="flex min-w-0 flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex h-32 w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-primary/80 transition-default"
                        style={{ height: `${height}%` }}
                        title={`${day.minutes} minutes`}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-muted">
                      {label}
                    </span>
                    <span className="text-[10px] text-muted">{day.minutes}m</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card padding="none" className="surface-card">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle>Workload by course</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-5">
            {summary.workload_by_course.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted">
                No open assignments to analyze.
              </p>
            ) : (
              <ul className="space-y-3">
                {summary.workload_by_course.map((course) => {
                  const maxCount = Math.max(
                    ...summary.workload_by_course.map((item) => item.count),
                  );
                  const width = Math.max(12, (course.count / maxCount) * 100);

                  return (
                    <li key={course.course_id}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-text">
                          {course.code}
                        </span>
                        <span className="shrink-0 text-muted">
                          {course.count} open
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-background">
                        <div
                          className={`h-2 rounded-full ${getCourseColorClasses(course.color_key).split(" ")[0] ?? "bg-primary"}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card padding="none" className="surface-card">
        <CardHeader className="border-b border-border px-5 py-4">
          <CardTitle>Weekly heatmap</CardTitle>
        </CardHeader>
        <CardContent className="grid max-w-md grid-cols-7 gap-2 px-5 py-5">
          {summary.last_7_days.map((day) => {
            const intensity = Math.min(1, day.minutes / 90);

            return (
              <div
                key={day.date}
                className="flex aspect-square flex-col items-center justify-center rounded-[var(--radius)] border border-border/50 text-center"
                style={{
                  background: `color-mix(in srgb, var(--primary) ${Math.round(12 + intensity * 55)}%, transparent)`,
                }}
              >
                <span className="text-[10px] font-semibold text-text">
                  {new Date(day.date).getDate()}
                </span>
                <span className="text-[10px] text-muted">{day.minutes}m</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: typeof Timer;
  accent?: boolean;
}) {
  return (
    <Card
      padding="md"
      className={accent ? "stat-card border-primary/20 bg-primary-muted/30" : "stat-card"}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-label">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-text">
            {value}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] bg-background text-primary">
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>
    </Card>
  );
}
