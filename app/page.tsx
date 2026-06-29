import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Focus,
  LayoutDashboard,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "Course Management",
    description:
      "Organize every class in one place. Track syllabi, schedules, and materials without the clutter.",
  },
  {
    icon: Target,
    title: "Assignment Tracking",
    description:
      "Never miss a deadline. Prioritize tasks, set statuses, and see what's due at a glance.",
  },
  {
    icon: Timer,
    title: "Focus Timer",
    description:
      "Built-in Pomodoro sessions help you study with intention. Track focus time per course.",
  },
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    description:
      "Your academic command center. Everything you need to stay on top of the semester.",
  },
  {
    icon: Calendar,
    title: "Deadline Calendar",
    description:
      "Visualize your week and month. Plan ahead and avoid last-minute cram sessions.",
  },
  {
    icon: TrendingUp,
    title: "Progress Insights",
    description:
      "See how you're spending your time and where your energy goes across courses.",
  },
];

const steps = [
  {
    step: "01",
    title: "Add your courses",
    description: "Import or create your semester schedule in seconds.",
  },
  {
    step: "02",
    title: "Track assignments",
    description: "Add deadlines, set priorities, and mark progress as you go.",
  },
  {
    step: "03",
    title: "Focus and finish",
    description: "Use the built-in timer to study smarter, not longer.",
  },
];

const previewAssignments = [
  { title: "Research paper draft", course: "ENG 201", priority: "high", due: "Tomorrow" },
  { title: "Problem set 4", course: "MATH 301", priority: "medium", due: "Fri" },
  { title: "Lab report", course: "CHEM 110", priority: "low", due: "Next week" },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-primary/3 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="primary" className="mb-6">
                <Sparkles className="mr-1.5 inline h-3 w-3" />
                Academic command center
              </Badge>

              <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Your semester,{" "}
                <span className="text-primary">organized beautifully</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
                StudySphere helps college students manage courses, assignments,
                deadlines, and focus time in one polished workspace.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  See how it works
                </Button>
              </div>

              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
                Free for students · No credit card required
              </p>
            </div>

            {/* Dashboard preview */}
            <div className="relative mx-auto mt-16 max-w-4xl">
              <div className="absolute inset-0 -z-10 translate-y-4 scale-[0.97] rounded-2xl bg-primary/10 blur-sm" />
              <Card className="overflow-hidden" padding="none">
                <div className="flex items-center gap-2 border-b border-border bg-background/50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  </div>
                  <span className="ml-2 font-mono text-xs text-muted">
                    studysphere.app/dashboard
                  </span>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
                  <div className="rounded-xl border border-border bg-background p-4 sm:col-span-1">
                    <div className="mb-3 flex items-center gap-2">
                      <Focus className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-text">
                        Focus Session
                      </span>
                    </div>
                    <p className="font-mono text-3xl font-semibold tracking-tight text-text">
                      25:00
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                      CS 101 · Deep work
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4 sm:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-text">
                        Upcoming assignments
                      </span>
                      <Badge variant="primary">3 due soon</Badge>
                    </div>
                    <div className="space-y-2">
                      {previewAssignments.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center justify-between rounded-lg border border-border/60 bg-surface px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-text">
                              {item.title}
                            </p>
                            <p className="font-mono text-xs text-muted">
                              {item.course}
                            </p>
                          </div>
                          <div className="ml-3 flex shrink-0 items-center gap-2">
                            <Badge
                              variant={
                                item.priority === "high"
                                  ? "error"
                                  : item.priority === "medium"
                                    ? "warning"
                                    : "default"
                              }
                            >
                              {item.priority}
                            </Badge>
                            <span className="hidden font-mono text-xs text-muted sm:inline">
                              {item.due}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border bg-surface/50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                Everything you need to stay on top
              </h2>
              <p className="mt-4 text-lg text-muted">
                Built for the way students actually work — fast, focused, and
                beautifully simple.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group transition-default hover:border-primary/20">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-muted text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Badge variant="outline" className="mb-4">
                  How it works
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                  From chaos to clarity in three steps
                </h2>
                <p className="mt-4 text-lg text-muted">
                  Set up your workspace in minutes. StudySphere adapts to your
                  semester, not the other way around.
                </p>

                <div className="mt-10 space-y-8">
                  {steps.map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="font-semibold text-text">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-b border-border bg-primary-muted/50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-text">
                          Today&apos;s focus
                        </p>
                        <p className="font-mono text-xs text-muted">
                          2h 15m studied
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 p-6">
                    {[
                      { label: "Assignments completed", value: "4 / 7" },
                      { label: "Courses active", value: "5" },
                      { label: "Focus streak", value: "12 days" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                      >
                        <span className="text-sm text-muted">{stat.label}</span>
                        <span className="font-mono text-sm font-semibold text-text">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section id="pricing" className="border-t border-border bg-surface/50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden border-primary/20 bg-surface">
              <CardContent className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
                <div
                  className="pointer-events-none absolute inset-0 -z-10 opacity-40"
                  aria-hidden="true"
                >
                  <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
                </div>

                <Badge variant="primary" className="mb-6">
                  Get started today
                </Badge>

                <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                  Ready to take control of your semester?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
                  Join students who study smarter with a workspace designed for
                  focus, clarity, and momentum.
                </p>

                <ul className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left sm:mx-auto sm:inline-flex sm:flex-col sm:items-start">
                  {[
                    "Unlimited courses and assignments",
                    "Built-in Pomodoro focus timer",
                    "Priority and status tracking",
                    "Clean, distraction-free interface",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button size="lg">
                    Create free account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Log in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
              S
            </span>
            <span className="text-sm font-semibold text-text">StudySphere</span>
          </div>

          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} StudySphere. Built for students.
          </p>

          <nav className="flex gap-6">
            <Link
              href="#features"
              className="text-sm text-muted transition-colors hover:text-text"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted transition-colors hover:text-text"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted transition-colors hover:text-text"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
