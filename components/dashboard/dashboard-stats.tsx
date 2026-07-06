import { Card } from "@/components/ui/card";
import { formatDurationMinutes } from "@/lib/format";
import type { DashboardStats } from "@/types/database";
import { BookOpen, Clock, ListTodo, Timer } from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    {
      label: "Due today",
      value: String(stats.due_today),
      icon: ListTodo,
      tone: "text-primary bg-primary-muted",
    },
    {
      label: "Active courses",
      value: String(stats.active_courses),
      icon: BookOpen,
      tone: "text-success bg-success/10",
    },
    {
      label: "Focus today",
      value: formatDurationMinutes(stats.focus_minutes_today),
      icon: Timer,
      tone: "text-warning bg-warning/10",
    },
    {
      label: "This week",
      value: `${stats.due_this_week}`,
      suffix: "tasks",
      icon: Clock,
      tone: "text-muted bg-background",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map((stat) => (
        <Card key={stat.label} padding="md" className="stat-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-label">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <p className="text-2xl font-semibold tracking-tight text-text">
                  {stat.value}
                </p>
                {stat.suffix && (
                  <span className="text-caption">{stat.suffix}</span>
                )}
              </div>
            </div>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] ${stat.tone}`}
            >
              <stat.icon className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
