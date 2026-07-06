import { CalendarPageClient } from "@/components/calendar/calendar-page-client";
import { PageContainer } from "@/components/layout/page-container";
import { getDatedAssignments } from "@/lib/db/assignments";

export default async function CalendarPage() {
  const assignments = await getDatedAssignments();

  return (
    <PageContainer>
      <CalendarPageClient assignments={assignments} />
    </PageContainer>
  );
}
