"use client";

import {
  CourseForm,
  type CourseFormValues,
} from "@/components/courses/course-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import {
  createCourseAction,
  updateCourseAction,
} from "@/lib/actions/course-actions";
import type { CourseWithStats } from "@/types/database";
import { useRouter } from "next/navigation";

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: CourseWithStats | null;
}

export function CreateCourseDialog({
  open,
  onOpenChange,
  course,
}: CreateCourseDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(course);
  const formId = isEdit ? "edit-course-form" : "create-course-form";

  async function handleSubmit(values: CourseFormValues) {
    const result = isEdit
      ? await updateCourseAction(course!.id, values)
      : await createCourseAction(values);

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
      title={isEdit ? "Edit course" : "Add course"}
      description={
        isEdit
          ? "Update course details."
          : "Add a course to organize your assignments."
      }
    >
      <CourseForm
        key={course?.id ?? "new"}
        formId={formId}
        initialValues={course ?? undefined}
        submitLabel={isEdit ? "Save changes" : "Add course"}
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
        <Button type="submit" form={formId}>
          {isEdit ? "Save changes" : "Add course"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
