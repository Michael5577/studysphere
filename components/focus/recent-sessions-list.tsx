import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, EmptyStateAction } from "@/components/ui/empty-state";
import { formatDurationSeconds, formatRelativeSessionDate } from "@/lib/format";
import type { StudySessionWithCourse } from "@/lib/db/study-sessions";
import { Timer } from "lucide-react";
import Link from "next/link";

interface RecentSessionsListProps {
  sessions: StudySessionWithCourse[];
}

export function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  return (
    <Card padding="none" className="surface-card">
      <CardHeader className="border-b border-border px-5 py-4">
        <CardTitle>Recent sessions</CardTitle>
      </CardHeader>

      {sessions.length === 0 ? (
        <div className="px-5 py-8">
          <EmptyState
            icon={Timer}
            title="No focus sessions yet"
            description="Start a focus session above and your study time will appear here."
            className="border-none bg-transparent py-6"
            action={
              <Link href="/focus">
                <EmptyStateAction>Start focusing</EmptyStateAction>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition-default hover:bg-background/60"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">
                  {session.course?.code ?? "General focus"}
                </p>
                <p className="mt-0.5 text-caption">
                  {formatRelativeSessionDate(session.started_at)}
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm text-muted">
                {formatDurationSeconds(session.duration_seconds)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
