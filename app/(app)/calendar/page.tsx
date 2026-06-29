import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dates = [23, 24, 25, 26, 27, 28, 29];

const events = [
  {
    day: 2,
    title: "Problem Set 4 due",
    course: "MATH 301",
    type: "deadline" as const,
  },
  {
    day: 2,
    title: "CS 201 Lecture",
    course: "CS 201",
    time: "10:00 AM",
    type: "class" as const,
  },
  {
    day: 3,
    title: "Binary Search Tree due",
    course: "CS 201",
    type: "deadline" as const,
  },
  {
    day: 4,
    title: "CHEM 110 Lab",
    course: "CHEM 110",
    time: "2:00 PM",
    type: "class" as const,
  },
];

const today = 2; // Wednesday index

export default function CalendarPage() {
  return (
    <PageContainer>
      <div className="section-stack">
        <SectionHeader
          title="Calendar"
          description="June 23 – 29, 2026"
        />

        <Card padding="none">
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={`border-r border-border px-2 py-3 text-center last:border-r-0 ${
                  i === today ? "bg-primary-muted/40" : ""
                }`}
              >
                <p className="text-label">{day}</p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    i === today ? "text-primary" : "text-text"
                  }`}
                >
                  {dates[i]}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 min-h-[280px]">
            {weekDays.map((day, i) => {
              const dayEvents = events.filter((e) => e.day === i);
              return (
                <div
                  key={day}
                  className={`border-r border-border p-2 last:border-r-0 ${
                    i === today ? "bg-primary-muted/20" : ""
                  }`}
                >
                  <div className="space-y-1.5">
                    {dayEvents.map((event) => (
                      <div
                        key={event.title}
                        className="rounded-[var(--radius)] border border-border bg-background px-2 py-1.5"
                      >
                        <p className="truncate text-xs font-medium text-text">
                          {event.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <Badge
                            variant={
                              event.type === "deadline" ? "error" : "primary"
                            }
                            className="text-[9px]"
                          >
                            {event.type === "deadline" ? "Due" : "Class"}
                          </Badge>
                          {event.time && (
                            <span className="text-[10px] text-muted">
                              {event.time}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
