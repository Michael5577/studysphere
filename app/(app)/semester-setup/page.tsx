import { SemesterSetupWizard } from "@/components/semester-setup/semester-setup-wizard";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";

export default function SemesterSetupPage() {
  return (
    <PageContainer size="narrow">
      <div className="section-stack">
        <SectionHeader
          eyebrow="Onboarding"
          title="Set up your semester"
          description="Import your schedule in minutes — courses, assignments, and calendar events."
        />
        <SemesterSetupWizard />
      </div>
    </PageContainer>
  );
}
