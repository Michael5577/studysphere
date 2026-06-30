import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DueSoonList } from "@/components/dashboard/due-soon-list";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import {
  getDashboardStats,
  getDueSoonAssignments,
} from "@/lib/db/dashboard";
import { ensureProfile, getProfile } from "@/lib/db/profile";
import { getGreeting } from "@/lib/format";
import { requireUserId } from "@/lib/db/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const userId = await requireUserId();
  await ensureProfile(userId);

  const [stats, dueSoon, profile, supabase] = await Promise.all([
    getDashboardStats(),
    getDueSoonAssignments(5),
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
          title={`${getGreeting()}, ${displayName}`}
          description={today}
        />

        <DashboardStats stats={stats} />
        <DueSoonList assignments={dueSoon} />
      </div>
    </PageContainer>
  );
}
