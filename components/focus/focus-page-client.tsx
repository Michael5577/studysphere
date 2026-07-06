"use client";

import { RecentSessionsList } from "@/components/focus/recent-sessions-list";
import { FocusTimer } from "@/components/focus/focus-timer";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import type { Course, UserPreferences } from "@/types/database";
import type { StudySessionWithCourse } from "@/lib/db/study-sessions";

interface FocusPageClientProps {
  courses: Course[];
  preferences: UserPreferences;
  recentSessions: StudySessionWithCourse[];
}

export function FocusPageClient({
  courses,
  preferences,
  recentSessions,
}: FocusPageClientProps) {
  return (
    <PageContainer size="narrow">
      <div className="section-stack">
        <SectionHeader
          title="Focus"
          description="Choose a focus block, pick your study atmosphere, then unlock breaks with brain teasers"
        />

        <FocusTimer
          key={`${preferences.work_duration_minutes}-${preferences.break_duration_minutes}-${preferences.long_break_duration_minutes}`}
          courses={courses}
          preferences={preferences}
        />

        <RecentSessionsList sessions={recentSessions} />
      </div>
    </PageContainer>
  );
}
