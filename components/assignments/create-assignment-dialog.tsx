"use client";

import {
  AssignmentForm,
  type AssignmentFormValues,
} from "@/components/assignments/assignment-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import {
  createAssignmentAction,
  updateAssignmentAction,
} from "@/lib/actions/assignment-actions";
import type { AssignmentWithCourse, Course } from "@/types/database";
import { useRouter } from "next/navigation";

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  assignment?: AssignmentWithCourse | null;
}

export function CreateAssignmentDialog({
  open,
  onOpenChange,
  courses,
  assignment,
}: CreateAssignmentDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(assignment);
  const formId = isEdit ? "edit-assignment-form" : "create-assignment-form";

  async function handleSubmit(values: AssignmentFormValues) {
    const result = isEdit
      ? await updateAssignmentAction(assignment!.id, values)
      : await createAssignmentAction(values);

    if (!result.ok) {
      throw new Error(result.message);
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit assignment" : "New assignment"}
      description={
        isEdit
          ? "Update assignment details."
          : "Track a new assignment for one of your courses."
      }
    >
      <AssignmentForm
        key={assignment?.id ?? "new"}
        formId={formId}
        courses={courses}
        initialValues={assignment ?? undefined}
        submitLabel={isEdit ? "Save changes" : "Create assignment"}
        onSubmit={handleSubmit}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="submit" form={formId} disabled={courses.length === 0}>
          {isEdit ? "Save changes" : "Create assignment"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
