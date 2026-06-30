import { Card } from "@/components/ui/card";
import { formatDurationMinutes } from "@/lib/format";
import type { DashboardStats } from "@/types/database";
import { BookOpen, Clock, ListTodo, Timer } from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    { label: "Due today", value: String(stats.due_today), icon: ListTodo },
    {
      label: "Active courses",
      value: String(stats.active_courses),
      icon: BookOpen,
    },
    {
      label: "Focus today",
      value: formatDurationMinutes(stats.focus_minutes_today),
      icon: Timer,
    },
    {
      label: "This week",
      value: `${stats.due_this_week} tasks`,
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((stat) => (
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
  );
}
