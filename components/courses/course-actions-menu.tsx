"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import {
  archiveCourseAction,
  deleteCourseAction,
} from "@/lib/actions/course-actions";
import type { CourseWithStats } from "@/types/database";
import { Archive, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseActionsMenuProps {
  course: CourseWithStats;
  onEdit: (course: CourseWithStats) => void;
}

export function CourseActionsMenu({ course, onEdit }: CourseActionsMenuProps) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleArchive() {
    if (
      !window.confirm(
        `Archive ${course.code}? It will be hidden from your course list.`,
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await archiveCourseAction(course.id);
    setLoading(false);
    setOpen(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`${course.code} archived`);
    router.refresh();
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete ${course.code}? This will also remove its assignments.`,
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await deleteCourseAction(course.id);
    setLoading(false);
    setOpen(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`${course.code} deleted`);
    router.refresh();
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setOpen((value) => !value)}
        disabled={loading}
        aria-label="Course actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full right-0 z-20 mt-1 w-40 rounded-[var(--radius)] border border-border bg-surface py-1 shadow-sm">
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-background"
              onClick={() => {
                setOpen(false);
                onEdit(course);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-background"
              onClick={handleArchive}
            >
              <Archive className="h-3.5 w-3.5" />
              Archive
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-error hover:bg-error/5"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
