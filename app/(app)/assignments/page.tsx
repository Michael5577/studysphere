import { AssignmentsPageClient } from "@/components/assignments/assignments-page-client";
import { PageContainer } from "@/components/layout/page-container";
import { getAssignments } from "@/lib/db/assignments";
import { getCourses } from "@/lib/db/courses";

export default async function AssignmentsPage() {
  const [assignments, allAssignments, courses] = await Promise.all([
    getAssignments(),
    getAssignments(true),
    getCourses(),
  ]);

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
      />
    </PageContainer>
  );
}
