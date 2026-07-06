import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileStats } from "@/components/profile/profile-stats";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { getAnalyticsSummary } from "@/lib/db/analytics";
import { getDashboardStats } from "@/lib/db/dashboard";
import { ensureProfile } from "@/lib/db/profile";
import { formatMemberSince, getInitials } from "@/lib/format";
import { requireUserId } from "@/lib/db/auth";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Calendar, GraduationCap, Mail } from "lucide-react";

export default async function ProfilePage() {
  const userId = await requireUserId();
  const profile = await ensureProfile(userId);

  const [stats, analytics, supabase] = await Promise.all([
    getDashboardStats(),
    getAnalyticsSummary(),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const displayName = profile.full_name?.trim() || email.split("@")[0] || "Student";
  const subtitle = [profile.major, profile.year_level]
    .filter(Boolean)
    .join(" · ");

  const details = [
    { icon: Mail, label: "Email", value: email || "—" },
    { icon: GraduationCap, label: "Major", value: profile.major || "—" },
    {
      icon: BookOpen,
      label: "Year level",
      value: profile.year_level || "—",
    },
    {
      icon: Calendar,
      label: "Member since",
      value: formatMemberSince(profile.created_at),
    },
  ];

  return (
    <PageContainer size="narrow">
      <div className="section-stack">
        <SectionHeader title="Profile" description="Your academic identity" />

        <Card padding="lg" className="surface-card overflow-hidden">
          <div className="border-b border-border bg-primary-muted/40 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary text-lg font-semibold text-white shadow-sm">
                {getInitials(displayName)}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-text">{displayName}</h2>
                <p className="mt-0.5 text-caption">
                  {subtitle || "Add your major and year level"}
                </p>
                {profile.university && (
                  <Badge variant="primary" className="mt-3">
                    {profile.university}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <ProfileStats stats={stats} streakDays={analytics.streak_days} />
          </div>
        </Card>

        <Card padding="none" className="surface-card">
          <div className="divide-y divide-border">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-background text-muted">
                  <item.icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-label">{item.label}</p>
                  <p className="mt-0.5 text-sm text-text">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <ProfileForm profile={profile} />
      </div>
    </PageContainer>
  );
}
