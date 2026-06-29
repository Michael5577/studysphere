import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";

const settingsSections = [
  {
    title: "Notifications",
    description: "Manage how StudySphere keeps you informed",
    fields: [
      { label: "Assignment reminders", type: "toggle" as const, enabled: true },
      { label: "Daily summary email", type: "toggle" as const, enabled: false },
      { label: "Focus session alerts", type: "toggle" as const, enabled: true },
    ],
  },
  {
    title: "Focus timer",
    description: "Customize your Pomodoro sessions",
    fields: [
      { label: "Work duration (minutes)", type: "input" as const, value: "25" },
      { label: "Break duration (minutes)", type: "input" as const, value: "5" },
      { label: "Long break (minutes)", type: "input" as const, value: "15" },
    ],
  },
  {
    title: "Appearance",
    description: "Personalize your workspace",
    fields: [
      { label: "Compact mode", type: "toggle" as const, enabled: false },
      { label: "Show completed assignments", type: "toggle" as const, enabled: true },
    ],
  },
];

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-default ${
        enabled ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-surface transition-layout ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <PageContainer size="narrow">
      <div className="section-stack">
        <SectionHeader
          title="Settings"
          description="Preferences and account configuration"
        />

        {settingsSections.map((section) => (
          <Card key={section.title} padding="none">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-text">
                {section.title}
              </h3>
              <p className="mt-0.5 text-caption">{section.description}</p>
            </div>
            <div className="divide-y divide-border">
              {section.fields.map((field) => (
                <div
                  key={field.label}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <span className="text-sm text-text">{field.label}</span>
                  {field.type === "toggle" ? (
                    <Toggle enabled={field.enabled} />
                  ) : (
                    <Input
                      defaultValue={field.value}
                      className="w-20 text-right"
                      aria-label={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
