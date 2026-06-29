import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Plus } from "lucide-react";

const courses = [
  {
    code: "CS 201",
    name: "Data Structures & Algorithms",
    instructor: "Dr. Patel",
    assignments: 4,
    color: "bg-primary-muted text-primary",
  },
  {
    code: "MATH 301",
    name: "Multivariable Calculus",
    instructor: "Prof. Nguyen",
    assignments: 3,
    color: "bg-success/10 text-success",
  },
  {
    code: "ENG 201",
    name: "Academic Writing",
    instructor: "Dr. Williams",
    assignments: 2,
    color: "bg-warning/10 text-warning",
  },
  {
    code: "CHEM 110",
    name: "General Chemistry I",
    instructor: "Dr. Chen",
    assignments: 5,
    color: "bg-error/10 text-error",
  },
  {
    code: "HIST 150",
    name: "World History Since 1500",
    instructor: "Prof. Morrison",
    assignments: 1,
    color: "bg-background text-muted",
  },
];

export default function CoursesPage() {
  return (
    <PageContainer>
      <div className="section-stack">
        <SectionHeader
          title="Courses"
          description="5 active courses this semester"
          action={
            <Button>
              <Plus className="h-4 w-4" />
              Add course
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((course) => (
            <Card
              key={course.code}
              padding="md"
              className="transition-default hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-[var(--radius)] px-2 py-0.5 text-label ${course.color}`}
                    >
                      {course.code}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-text">
                    {course.name}
                  </h3>
                  <p className="mt-1 text-caption">{course.instructor}</p>
                </div>
                <Badge variant="outline">
                  {course.assignments} open
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
