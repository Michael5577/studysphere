import { SettingsForm } from "@/components/settings/settings-form";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import {
  ensureUserPreferences,
  getUserPreferences,
} from "@/lib/db/preferences";
import { requireUserId } from "@/lib/db/auth";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const preferences =
    (await getUserPreferences()) ?? (await ensureUserPreferences(userId));

  return (
    <PageContainer size="narrow">
      <div className="section-stack">
        <SectionHeader
          title="Settings"
          description="Preferences and account configuration"
        />

        <SettingsForm preferences={preferences} />
      </div>
    </PageContainer>
  );
}
