import { CoursesPageClient } from "@/components/courses/courses-page-client";
import { PageContainer } from "@/components/layout/page-container";
import { getCourses } from "@/lib/db/courses";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <PageContainer>
      <CoursesPageClient courses={courses} />
    </PageContainer>
  );
}
