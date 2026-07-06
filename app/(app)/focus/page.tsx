import { FocusPageClient } from "@/components/focus/focus-page-client";
import { getCourses } from "@/lib/db/courses";
import {
  ensureUserPreferences,
  getUserPreferences,
} from "@/lib/db/preferences";
import { getRecentStudySessions } from "@/lib/db/study-sessions";
import { requireUserId } from "@/lib/db/auth";

export default async function FocusPage() {
  const userId = await requireUserId();

  const [courses, preferences, recentSessions] = await Promise.all([
    getCourses(),
    getUserPreferences().then(
      (value) => value ?? ensureUserPreferences(userId),
    ),
    getRecentStudySessions(8),
  ]);

  return (
    <FocusPageClient
      courses={courses}
      preferences={preferences}
      recentSessions={recentSessions}
    />
  );
}
