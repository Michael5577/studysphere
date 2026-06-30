"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { COURSE_COLOR_KEYS } from "@/types/database";
import type { Course, CourseColorKey } from "@/types/database";
import { useState } from "react";

export interface CourseFormValues {
  code: string;
  name: string;
  instructor: string;
  semester: string;
  color_key: CourseColorKey;
}

interface CourseFormProps {
  initialValues?: Partial<Course>;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  submitLabel: string;
  formId: string;
}

const COLOR_LABELS: Record<CourseColorKey, string> = {
  indigo: "Indigo",
  violet: "Violet",
  slate: "Slate",
  amber: "Amber",
  rose: "Rose",
};

export function CourseForm({
  initialValues,
  onSubmit,
  submitLabel,
  formId,
}: CourseFormProps) {
  const [code, setCode] = useState(initialValues?.code ?? "");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [instructor, setInstructor] = useState(initialValues?.instructor ?? "");
  const [semester, setSemester] = useState(initialValues?.semester ?? "Current");
  const [colorKey, setColorKey] = useState<CourseColorKey>(
    initialValues?.color_key ?? "indigo",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        code,
        name,
        instructor,
        semester,
        color_key: colorKey,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-[var(--radius)] border border-error/30 bg-error/5 px-3 py-2.5 text-sm text-error"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-code`} required>
            Course code
          </Label>
          <Input
            id={`${formId}-code`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CS 201"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-semester`}>Semester</Label>
          <Input
            id={`${formId}-semester`}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Fall 2026"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-name`} required>
          Course name
        </Label>
        <Input
          id={`${formId}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Data Structures & Algorithms"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-instructor`}>Instructor</Label>
        <Input
          id={`${formId}-instructor`}
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          placeholder="Dr. Patel"
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-color`}>Color</Label>
        <Select
          id={`${formId}-color`}
          value={colorKey}
          onChange={(e) => setColorKey(e.target.value as CourseColorKey)}
          disabled={loading}
        >
          {COURSE_COLOR_KEYS.map((key) => (
            <option key={key} value={key}>
              {COLOR_LABELS[key]}
            </option>
          ))}
        </Select>
      </div>

      <button type="submit" className="sr-only" disabled={loading}>
        {submitLabel}
      </button>
    </form>
  );
}
