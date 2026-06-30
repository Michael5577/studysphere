"use client";

import { Button } from "@/components/ui/button";
import {
  deleteAssignmentAction,
  markAssignmentCompleteAction,
  updateAssignmentPriorityAction,
  updateAssignmentStatusAction,
} from "@/lib/actions/assignment-actions";
import type {
  AssignmentPriority,
  AssignmentStatus,
  AssignmentWithCourse,
} from "@/types/database";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AssignmentActionsMenuProps {
  assignment: AssignmentWithCourse;
  onEdit: (assignment: AssignmentWithCourse) => void;
}

export function AssignmentActionsMenu({
  assignment,
  onEdit,
}: AssignmentActionsMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function runAction(action: () => Promise<{ ok: boolean; message?: string }>) {
    setLoading(true);
    const result = await action();
    setLoading(false);
    setOpen(false);

    if (!result.ok) {
      window.alert(result.message);
      return;
    }

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
        aria-label="Assignment actions"
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
          <div className="absolute top-full right-0 z-20 mt-1 w-44 rounded-[var(--radius)] border border-border bg-surface py-1 shadow-sm">
            {assignment.status !== "done" && (
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-background"
                onClick={() =>
                  runAction(() => markAssignmentCompleteAction(assignment.id))
                }
              >
                <Check className="h-3.5 w-3.5" />
                Mark complete
              </button>
            )}
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-background"
              onClick={() => {
                setOpen(false);
                onEdit(assignment);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <div className="my-1 border-t border-border" />
            <p className="px-3 py-1 text-label">Status</p>
            {(["todo", "in_progress", "done"] as AssignmentStatus[]).map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  className="flex w-full px-3 py-1.5 text-left text-sm text-text hover:bg-background disabled:opacity-50"
                  disabled={assignment.status === value}
                  onClick={() =>
                    runAction(() =>
                      updateAssignmentStatusAction(assignment.id, value),
                    )
                  }
                >
                  {value.replace("_", " ")}
                </button>
              ),
            )}
            <div className="my-1 border-t border-border" />
            <p className="px-3 py-1 text-label">Priority</p>
            {(["low", "medium", "high"] as AssignmentPriority[]).map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  className="flex w-full px-3 py-1.5 text-left text-sm text-text hover:bg-background disabled:opacity-50"
                  disabled={assignment.priority === value}
                  onClick={() =>
                    runAction(() =>
                      updateAssignmentPriorityAction(assignment.id, value),
                    )
                  }
                >
                  {value}
                </button>
              ),
            )}
            <div className="my-1 border-t border-border" />
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-error hover:bg-error/5"
              onClick={() => {
                if (!window.confirm(`Delete "${assignment.title}"?`)) {
                  return;
                }

                runAction(() => deleteAssignmentAction(assignment.id));
              }}
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
