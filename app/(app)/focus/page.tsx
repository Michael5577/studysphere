import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Play, RotateCcw, SkipForward } from "lucide-react";

const recentSessions = [
  { course: "CS 201", duration: "50 min", date: "Today" },
  { course: "MATH 301", duration: "25 min", date: "Today" },
  { course: "ENG 201", duration: "25 min", date: "Yesterday" },
];

export default function FocusPage() {
  return (
    <PageContainer size="narrow">
      <div className="section-stack">
        <SectionHeader
          title="Focus"
          description="Pomodoro timer for deep study sessions"
        />

        <Card padding="lg" className="text-center">
          <Badge variant="primary" className="mb-6">
            Focus session
          </Badge>

          <p className="font-mono text-6xl font-semibold tracking-tight text-text sm:text-7xl">
            25:00
          </p>

          <p className="mt-3 text-caption">
            CS 201 — Data Structures & Algorithms
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button variant="outline" size="lg" aria-label="Reset timer">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="lg" className="h-12 w-12 rounded-full p-0" aria-label="Start timer">
              <Play className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" aria-label="Skip session">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-caption">
            <span>Session 2 of 4</span>
            <span className="text-border">·</span>
            <span>5 min break next</span>
          </div>
        </Card>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text">
            Recent sessions
          </h3>
          <Card padding="none">
            <div className="divide-y divide-border">
              {recentSessions.map((session) => (
                <div
                  key={`${session.course}-${session.date}`}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium text-text">
                      {session.course}
                    </p>
                    <p className="text-caption">{session.date}</p>
                  </div>
                  <span className="font-mono text-sm text-muted">
                    {session.duration}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
