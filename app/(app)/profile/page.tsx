import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { BookOpen, Calendar, GraduationCap, Mail } from "lucide-react";

const profileStats = [
  { label: "Courses", value: "5" },
  { label: "Assignments done", value: "24" },
  { label: "Focus hours", value: "38h" },
  { label: "Streak", value: "12 days" },
];

export default function ProfilePage() {
  return (
    <PageContainer size="narrow">
      <div className="section-stack">
        <SectionHeader
          title="Profile"
          description="Your academic identity"
        />

        <Card padding="lg">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary-muted text-xl font-semibold text-primary">
              MS
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-text">
                Michael Serbeh
              </h2>
              <p className="mt-0.5 text-caption">Computer Science · Junior</p>
              <Badge variant="primary" className="mt-3">
                State University
              </Badge>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {profileStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius)] border border-border bg-background px-3 py-3 text-center"
              >
                <p className="text-label">{stat.label}</p>
                <p className="mt-1 text-lg font-semibold text-text">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className="divide-y divide-border">
            {[
              { icon: Mail, label: "Email", value: "michael.serbeh@university.edu" },
              { icon: GraduationCap, label: "Major", value: "Computer Science" },
              { icon: BookOpen, label: "Semester", value: "Fall 2026" },
              { icon: Calendar, label: "Member since", value: "August 2025" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-background text-muted">
                  <item.icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-label">{item.label}</p>
                  <p className="mt-0.5 text-sm text-text">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button variant="outline" className="w-full sm:w-auto">
          Edit profile
        </Button>
      </div>
    </PageContainer>
  );
}
