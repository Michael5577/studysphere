"use client";

import { importSemesterAction } from "@/lib/actions/semester-import-actions";
import { parseSemesterCsv } from "@/lib/semester/parse-csv";
import { parseSemesterIcs } from "@/lib/semester/parse-ics";
import {
  CSV_TEMPLATE,
  createDraftCourse,
  type DraftCourse,
  type SemesterImportDraft,
  type SemesterImportMethod,
} from "@/lib/semester/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import { COURSE_COLOR_KEYS } from "@/types/database";
import {
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const METHODS: {
  id: SemesterImportMethod;
  label: string;
  description: string;
  icon: typeof Plus;
}[] = [
  {
    id: "manual",
    label: "Add manually",
    description: "Enter courses one by one with meeting times and location.",
    icon: Plus,
  },
  {
    id: "csv",
    label: "Import CSV",
    description: "Download our template and bulk-import courses + assignments.",
    icon: FileSpreadsheet,
  },
  {
    id: "ics",
    label: "Import calendar (.ics)",
    description: "Upload a calendar export and preview events before saving.",
    icon: Calendar,
  },
  {
    id: "syllabus",
    label: "Upload syllabus",
    description: "PDF syllabus upload — AI extraction coming soon.",
    icon: FileText,
  },
];

type WizardStep = "method" | "configure" | "review" | "done";

const EMPTY_DRAFT: SemesterImportDraft = {
  courses: [],
  assignments: [],
  events: [],
};

export function SemesterSetupWizard() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<WizardStep>("method");
  const [method, setMethod] = useState<SemesterImportMethod>("manual");
  const [draft, setDraft] = useState<SemesterImportDraft>(EMPTY_DRAFT);
  const [importing, setImporting] = useState(false);
  const [resultSummary, setResultSummary] = useState<string | null>(null);

  const courseCount = draft.courses.length;
  const assignmentCount = draft.assignments.length;

  const canReview = useMemo(() => {
    if (method === "syllabus") {
      return false;
    }

    return draft.courses.some((course) => course.code.trim() && course.name.trim());
  }, [draft.courses, method]);

  function resetDraftForMethod(next: SemesterImportMethod) {
    setMethod(next);

    if (next === "manual") {
      setDraft({
        courses: [createDraftCourse()],
        assignments: [],
        events: [],
      });
    } else {
      setDraft(EMPTY_DRAFT);
    }
  }

  function updateCourse(id: string, patch: Partial<DraftCourse>) {
    setDraft((current) => ({
      ...current,
      courses: current.courses.map((course) =>
        course.id === id ? { ...course, ...patch } : course,
      ),
    }));
  }

  function removeCourse(id: string) {
    setDraft((current) => ({
      ...current,
      courses: current.courses.filter((course) => course.id !== id),
    }));
  }

  function removeAssignment(id: string) {
    setDraft((current) => ({
      ...current,
      assignments: current.assignments.filter((item) => item.id !== id),
    }));
  }

  async function handleCsvFile(file: File) {
    const text = await file.text();
    const { draft: parsed, errors } = parseSemesterCsv(text);

    if (errors.length > 0) {
      toast.error(errors[0] ?? "Could not parse CSV.");
      return;
    }

    setDraft(parsed);
    setStep("review");
  }

  async function handleIcsFile(file: File) {
    const text = await file.text();
    const { draft: parsed, errors } = parseSemesterIcs(text);

    if (errors.length > 0 && parsed.events.length === 0) {
      toast.error(errors[0] ?? "Could not parse calendar file.");
      return;
    }

    setDraft(parsed);
    setStep("review");
  }

  async function handleImport() {
    setImporting(true);

    const result = await importSemesterAction({
      courses: draft.courses,
      assignments: draft.assignments,
    });

    setImporting(false);

    if (!result.ok || !result.data) {
      toast.error(result.ok ? "Import failed." : result.message);
      return;
    }

    const { coursesCreated, coursesSkipped, assignmentsCreated, assignmentsSkipped } =
      result.data;

    setResultSummary(
      `Imported ${coursesCreated} course${coursesCreated === 1 ? "" : "s"} and ${assignmentsCreated} assignment${assignmentsCreated === 1 ? "" : "s"}.` +
        (coursesSkipped + assignmentsSkipped > 0
          ? ` Skipped ${coursesSkipped + assignmentsSkipped} duplicate or invalid row${coursesSkipped + assignmentsSkipped === 1 ? "" : "s"}.`
          : ""),
    );
    setStep("done");
    toast.success("Semester setup complete.");
  }

  return (
    <div className="section-stack">
      {step === "method" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {METHODS.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  resetDraftForMethod(item.id);
                  setStep("configure");
                }}
                className="surface-card flex items-start gap-3 p-4 text-left transition-default hover:border-primary/30 focus-ring"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {step === "configure" && method === "manual" && (
        <div className="space-y-4">
          {draft.courses.map((course) => (
            <div key={course.id} className="surface-card space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-text">Course details</p>
                {draft.courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    className="text-muted transition-default hover:text-error focus-ring"
                    aria-label="Remove course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Course code">
                  <Input
                    value={course.code}
                    onChange={(event) =>
                      updateCourse(course.id, { code: event.target.value })
                    }
                    placeholder="CSCI 301"
                  />
                </Field>
                <Field label="Course name">
                  <Input
                    value={course.name}
                    onChange={(event) =>
                      updateCourse(course.id, { name: event.target.value })
                    }
                    placeholder="Operating Systems"
                  />
                </Field>
                <Field label="Instructor">
                  <Input
                    value={course.instructor}
                    onChange={(event) =>
                      updateCourse(course.id, { instructor: event.target.value })
                    }
                    placeholder="Dr. Smith"
                  />
                </Field>
                <Field label="Semester">
                  <Input
                    value={course.semester}
                    onChange={(event) =>
                      updateCourse(course.id, { semester: event.target.value })
                    }
                    placeholder="Fall 2026"
                  />
                </Field>
                <Field label="Meeting days">
                  <Input
                    value={course.meeting_days}
                    onChange={(event) =>
                      updateCourse(course.id, { meeting_days: event.target.value })
                    }
                    placeholder="MWF"
                  />
                </Field>
                <Field label="Color">
                  <select
                    value={course.color_key}
                    onChange={(event) =>
                      updateCourse(course.id, {
                        color_key: event.target.value as DraftCourse["color_key"],
                      })
                    }
                    className="h-10 w-full rounded-[var(--radius)] border border-border bg-surface px-3 text-sm text-text focus-ring"
                  >
                    {COURSE_COLOR_KEYS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Start time">
                  <Input
                    value={course.start_time}
                    onChange={(event) =>
                      updateCourse(course.id, { start_time: event.target.value })
                    }
                    placeholder="10:00"
                  />
                </Field>
                <Field label="End time">
                  <Input
                    value={course.end_time}
                    onChange={(event) =>
                      updateCourse(course.id, { end_time: event.target.value })
                    }
                    placeholder="10:50"
                  />
                </Field>
                <Field label="Location" className="sm:col-span-2">
                  <Input
                    value={course.location}
                    onChange={(event) =>
                      updateCourse(course.id, { location: event.target.value })
                    }
                    placeholder="Sage 224"
                  />
                </Field>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  courses: [...current.courses, createDraftCourse()],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add another course
            </Button>
            <Button
              type="button"
              disabled={!canReview}
              onClick={() => setStep("review")}
            >
              Review import
            </Button>
          </div>
        </div>
      )}

      {step === "configure" && method === "csv" && (
        <CsvImportPanel onParsed={handleCsvFile} />
      )}

      {step === "configure" && method === "ics" && (
        <FileImportPanel
          accept=".ics,text/calendar"
          label="Upload .ics calendar file"
          onFile={handleIcsFile}
        />
      )}

      {step === "configure" && method === "syllabus" && (
        <div className="surface-card space-y-4 p-5 text-center">
          <FileText className="mx-auto h-10 w-10 text-primary" />
          <div>
            <p className="font-serif text-lg font-semibold text-text">
              Syllabus AI extraction
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Upload a syllabus PDF and StudySphere will extract courses, exam
              dates, and assignments. This feature is coming soon — use CSV or
              manual setup for now.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm font-semibold text-muted">
            <Upload className="h-4 w-4" />
            Choose PDF (preview only)
            <input
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={() => toast.success("Syllabus saved for future AI extraction.")}
            />
          </label>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <div className="surface-card p-4">
            <p className="text-sm font-semibold text-text">
              {courseCount} course{courseCount === 1 ? "" : "s"} ·{" "}
              {assignmentCount} assignment{assignmentCount === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs text-muted">
              Review everything below. Duplicates are skipped automatically.
            </p>
          </div>

          {draft.courses.map((course) => (
            <div key={course.id} className="surface-card flex items-start justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold text-text">
                  {course.code} · {course.name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {course.instructor || "No instructor"}
                  {course.meeting_days
                    ? ` · ${course.meeting_days} ${course.start_time}-${course.end_time}`
                    : ""}
                  {course.location ? ` · ${course.location}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeCourse(course.id)}
                className="text-muted hover:text-error focus-ring"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {draft.assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="surface-card flex items-start justify-between gap-3 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-text">{assignment.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {assignment.course_code}
                  {assignment.due_at
                    ? ` · due ${new Date(assignment.due_at).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAssignment(assignment.id)}
                className="text-muted hover:text-error focus-ring"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setStep("configure")}>
              Back
            </Button>
            <Button type="button" disabled={importing} onClick={() => void handleImport()}>
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Confirm import
            </Button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="surface-card space-y-4 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <div>
            <p className="font-serif text-lg font-semibold text-text">
              Semester ready
            </p>
            <p className="mt-2 text-sm text-muted">{resultSummary}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button type="button" onClick={() => router.push("/dashboard")}>
              Go to dashboard
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/courses")}>
              View courses
            </Button>
          </div>
        </div>
      )}

      {step !== "done" && step !== "method" && (
        <Button type="button" variant="ghost" onClick={() => setStep("method")}>
          ← Choose a different method
        </Button>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted">{label}</Label>
      {children}
    </div>
  );
}

function CsvImportPanel({
  onParsed,
}: {
  onParsed: (file: File) => Promise<void>;
}) {
  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "studysphere-semester-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="surface-card space-y-4 p-5">
      <p className="text-sm text-muted">
        Download the template, fill in your courses and assignments, then upload
        it here. You&apos;ll preview everything before anything is saved.
      </p>
      <Button type="button" variant="outline" onClick={downloadTemplate}>
        Download CSV template
      </Button>
      <FileImportPanel
        accept=".csv,text/csv"
        label="Upload filled CSV"
        onFile={onParsed}
      />
    </div>
  );
}

function FileImportPanel({
  accept,
  label,
  onFile,
}: {
  accept: string;
  label: string;
  onFile: (file: File) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border bg-background/40 px-4 py-8 text-center transition-default hover:border-primary/40 focus-within:ring-2 focus-within:ring-primary/30">
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : (
        <Upload className="h-6 w-6 text-primary" />
      )}
      <span className="text-sm font-semibold text-text">{label}</span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (!file) {
            return;
          }

          setLoading(true);
          await onFile(file);
          setLoading(false);
          event.target.value = "";
        }}
      />
    </label>
  );
}
