import { AssignmentsPageClient } from "@/components/assignments/assignments-page-client";
import { PageContainer } from "@/components/layout/page-container";
import { getAssignments } from "@/lib/db/assignments";
import { getCourses } from "@/lib/db/courses";
import { getUserPreferences } from "@/lib/db/preferences";

export default async function AssignmentsPage() {
  const [assignments, allAssignments, courses, preferences] = await Promise.all([
    getAssignments(),
    getAssignments(true),
    getCourses(),
    getUserPreferences(),
  ]);

  const showCompleted = preferences?.show_completed_assignments ?? true;

  const openCount = allAssignments.filter(
    (assignment) => assignment.status !== "done",
  ).length;
  const completedCount = allAssignments.filter(
    (assignment) => assignment.status === "done",
  ).length;

  return (
    <PageContainer>
      <AssignmentsPageClient
        assignments={assignments}
        courses={courses}
        totalCount={allAssignments.length}
        openCount={openCount}
        completedCount={completedCount}
        showCompleted={showCompleted}
      />
    </PageContainer>
  );
}
