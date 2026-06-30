"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updatePreferencesAction } from "@/lib/actions/preferences-actions";
import type { UserPreferences } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SettingsFormProps {
  preferences: UserPreferences;
}

function Toggle({
  enabled,
  onChange,
  disabled,
  label,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-default disabled:opacity-50 ${
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

export function SettingsForm({ preferences }: SettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    assignment_reminders: preferences.assignment_reminders,
    daily_summary_email: preferences.daily_summary_email,
    focus_session_alerts: preferences.focus_session_alerts,
    work_duration_minutes: String(preferences.work_duration_minutes),
    break_duration_minutes: String(preferences.break_duration_minutes),
    long_break_duration_minutes: String(
      preferences.long_break_duration_minutes,
    ),
    compact_mode: preferences.compact_mode,
    show_completed_assignments: preferences.show_completed_assignments,
  });

  async function save(patch: Parameters<typeof updatePreferencesAction>[0]) {
    setSaving(true);
    setError(null);

    const result = await updatePreferencesAction(patch);

    setSaving(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.refresh();
  }

  async function handleToggle(
    key:
      | "assignment_reminders"
      | "daily_summary_email"
      | "focus_session_alerts"
      | "compact_mode"
      | "show_completed_assignments",
    value: boolean,
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    await save({ [key]: value });
  }

  async function handleNumberBlur(
    key:
      | "work_duration_minutes"
      | "break_duration_minutes"
      | "long_break_duration_minutes",
  ) {
    const parsed = Number(values[key]);

    if (Number.isNaN(parsed)) {
      setError("Please enter a valid number.");
      return;
    }

    await save({ [key]: parsed });
  }

  const sections = [
    {
      title: "Notifications",
      description: "Manage how StudySphere keeps you informed",
      fields: [
        {
          type: "toggle" as const,
          key: "assignment_reminders" as const,
          label: "Assignment reminders",
        },
        {
          type: "toggle" as const,
          key: "daily_summary_email" as const,
          label: "Daily summary email",
        },
        {
          type: "toggle" as const,
          key: "focus_session_alerts" as const,
          label: "Focus session alerts",
        },
      ],
    },
    {
      title: "Focus timer",
      description: "Customize your Pomodoro sessions",
      fields: [
        {
          type: "input" as const,
          key: "work_duration_minutes" as const,
          label: "Work duration (minutes)",
        },
        {
          type: "input" as const,
          key: "break_duration_minutes" as const,
          label: "Break duration (minutes)",
        },
        {
          type: "input" as const,
          key: "long_break_duration_minutes" as const,
          label: "Long break (minutes)",
        },
      ],
    },
    {
      title: "Appearance",
      description: "Personalize your workspace",
      fields: [
        {
          type: "toggle" as const,
          key: "compact_mode" as const,
          label: "Compact mode",
        },
        {
          type: "toggle" as const,
          key: "show_completed_assignments" as const,
          label: "Show completed assignments",
        },
      ],
    },
  ];

  return (
    <div className="section-stack">
      {error && (
        <div
          role="alert"
          className="rounded-[var(--radius)] border border-error/30 bg-error/5 px-3 py-2.5 text-sm text-error"
        >
          {error}
        </div>
      )}

      {sections.map((section) => (
        <Card key={section.title} padding="none">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-text">{section.title}</h3>
            <p className="mt-0.5 text-caption">{section.description}</p>
          </div>
          <div className="divide-y divide-border">
            {section.fields.map((field) => (
              <div
                key={field.key}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <span className="text-sm text-text">{field.label}</span>
                {field.type === "toggle" ? (
                  <Toggle
                    label={field.label}
                    enabled={values[field.key]}
                    disabled={saving}
                    onChange={(value) => handleToggle(field.key, value)}
                  />
                ) : (
                  <Input
                    value={values[field.key]}
                    onChange={(e) =>
                      setValues((current) => ({
                        ...current,
                        [field.key]: e.target.value,
                      }))
                    }
                    onBlur={() => handleNumberBlur(field.key)}
                    className="w-20 text-right"
                    aria-label={field.label}
                    disabled={saving}
                    inputMode="numeric"
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
