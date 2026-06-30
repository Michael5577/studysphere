"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "@/lib/format";
import type {
  Assignment,
  AssignmentPriority,
  AssignmentStatus,
  Course,
} from "@/types/database";
import {
  ASSIGNMENT_PRIORITIES,
  ASSIGNMENT_STATUSES,
} from "@/types/database";
import { useState } from "react";

export interface AssignmentFormValues {
  title: string;
  description: string;
  course_id: string;
  due_at: string | null;
  status: AssignmentStatus;
  priority: AssignmentPriority;
}

interface AssignmentFormProps {
  courses: Course[];
  initialValues?: Partial<Assignment>;
  onSubmit: (values: AssignmentFormValues) => Promise<void>;
  submitLabel: string;
  formId: string;
}

const STATUS_LABELS: Record<AssignmentStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const PRIORITY_LABELS: Record<AssignmentPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function AssignmentForm({
  courses,
  initialValues,
  onSubmit,
  submitLabel,
  formId,
}: AssignmentFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [courseId, setCourseId] = useState(
    initialValues?.course_id ?? courses[0]?.id ?? "",
  );
  const [dueAt, setDueAt] = useState(
    toDatetimeLocalValue(initialValues?.due_at ?? null),
  );
  const [status, setStatus] = useState<AssignmentStatus>(
    initialValues?.status ?? "todo",
  );
  const [priority, setPriority] = useState<AssignmentPriority>(
    initialValues?.priority ?? "medium",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        title,
        description,
        course_id: courseId,
        due_at: fromDatetimeLocalValue(dueAt),
        status,
        priority,
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

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-title`} required>
          Title
        </Label>
        <Input
          id={`${formId}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Problem Set 4"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-description`}>Description</Label>
        <Textarea
          id={`${formId}-description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-course`} required>
          Course
        </Label>
        <Select
          id={`${formId}-course`}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
          disabled={loading || courses.length === 0}
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} — {course.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-due`}>Due date</Label>
        <Input
          id={`${formId}-due`}
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-status`}>Status</Label>
          <Select
            id={`${formId}-status`}
            value={status}
            onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
            disabled={loading}
          >
            {ASSIGNMENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${formId}-priority`}>Priority</Label>
          <Select
            id={`${formId}-priority`}
            value={priority}
            onChange={(e) => setPriority(e.target.value as AssignmentPriority)}
            disabled={loading}
          >
            {ASSIGNMENT_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {PRIORITY_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <button type="submit" className="sr-only" disabled={loading}>
        {submitLabel}
      </button>
    </form>
  );
}
