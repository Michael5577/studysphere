import { ActiveCoursesStrip } from "@/components/dashboard/active-courses-strip";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DueSoonList } from "@/components/dashboard/due-soon-list";
import { PlanMyDayCard } from "@/components/dashboard/plan-my-day-card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { buttonStyles } from "@/components/ui/button";
import {
  getActiveCoursesSummary,
  getDashboardStats,
  getDueSoonAssignments,
} from "@/lib/db/dashboard";
import { ensureProfile, getProfile } from "@/lib/db/profile";
import { getGreeting } from "@/lib/format";
import { requireUserId } from "@/lib/db/auth";
import { createClient } from "@/lib/supabase/server";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const userId = await requireUserId();
  await ensureProfile(userId);

  const [stats, dueSoon, courses, profile, supabase] = await Promise.all([
    getDashboardStats(),
    getDueSoonAssignments(5),
    getActiveCoursesSummary(),
    getProfile(),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const displayName =
    profile?.full_name?.trim() || email.split("@")[0] || "Student";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <PageContainer>
      <div className="section-stack">
        <SectionHeader
          eyebrow="Dashboard"
          title={`${getGreeting()}, ${displayName}`}
          description={today}
          action={
            <Link
              href="/semester-setup"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              <CalendarPlus className="h-4 w-4" />
              Set up semester
            </Link>
          }
        />

        {courses.length === 0 && (
          <div className="surface-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-lg font-semibold text-text">
                Welcome to StudySphere
              </p>
              <p className="mt-1 text-sm text-muted">
                Import your courses and assignments to get your semester running
                in minutes.
              </p>
            </div>
            <Link href="/semester-setup" className={buttonStyles({ size: "md" })}>
              Set up semester
            </Link>
          </div>
        )}

        <DashboardStats stats={stats} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DueSoonList assignments={dueSoon} />
          </div>
          <PlanMyDayCard />
        </div>

        <ActiveCoursesStrip courses={courses} />
      </div>
    </PageContainer>
  );
}
