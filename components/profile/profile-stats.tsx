import { formatDurationMinutes } from "@/lib/format";
import type { DashboardStats } from "@/types/database";

interface ProfileStatsProps {
  stats: DashboardStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const focusHours = formatDurationMinutes(stats.total_focus_minutes);

  const items = [
    { label: "Courses", value: String(stats.active_courses) },
    { label: "Assignments done", value: String(stats.completed_assignments) },
    { label: "Focus hours", value: focusHours },
    { label: "Streak", value: "—" },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[var(--radius)] border border-border bg-background px-3 py-3 text-center"
        >
          <p className="text-label">{stat.label}</p>
          <p className="mt-1 text-lg font-semibold text-text">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
