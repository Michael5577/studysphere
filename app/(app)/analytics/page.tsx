import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { getAnalyticsSummary } from "@/lib/db/analytics";
import { requireUserId } from "@/lib/db/auth";

export default async function AnalyticsPage() {
  await requireUserId();
  const summary = await getAnalyticsSummary();

  return (
    <PageContainer>
      <div className="section-stack">
        <SectionHeader
          eyebrow="Analytics"
          title="Your rhythm"
          description="Understand how you actually study."
        />
        <AnalyticsDashboard summary={summary} />
      </div>
    </PageContainer>
  );
}
