"use client";

import { LandingSection } from "@/components/landing/landing-section";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Focus,
  LayoutDashboard,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
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
  {
    title: "Research paper draft",
    course: "ENG 201",
    priority: "high",
    due: "Tomorrow",
  },
  {
    title: "Problem set 4",
    course: "MATH 301",
    priority: "medium",
    due: "Fri",
  },
  {
    title: "Lab report",
    course: "CHEM 110",
    priority: "low",
    due: "Next week",
  },
];

const featureRadii = [
  "rounded-[2rem]",
  "rounded-tl-[4rem] rounded-br-[4rem] rounded-[2rem]",
  "rounded-tr-[4rem] rounded-bl-[4rem] rounded-[2rem]",
  "rounded-bl-[3rem] rounded-tr-[3rem] rounded-[2rem]",
  "rounded-tl-[3rem] rounded-br-[3rem] rounded-[2rem]",
  "rounded-[2.5rem]",
] as const;

export function LandingPage() {
  return (
    <main className="flex-1">
      <LandingSection id="hero" tone="hero">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="organic-blob absolute -left-32 top-0 h-[420px] w-[420px] bg-primary/12 blur-3xl" />
          <div className="organic-blob absolute -right-24 top-1/4 h-[320px] w-[320px] bg-secondary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <Badge variant="primary" className="mb-6">
                <Sparkles className="mr-1.5 inline h-3 w-3" />
                Academic command center
              </Badge>

              <h1 className="font-serif text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Your semester,{" "}
                <span className="text-primary">organized beautifully</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl lg:mx-0">
                StudySphere helps college students manage courses, assignments,
                deadlines, and focus time in one polished workspace.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/signup" className={buttonStyles({ size: "lg" })}>
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className={buttonStyles({ variant: "outline", size: "lg" })}
                >
                  See how it works
                </a>
              </div>

              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
                Free for students · No credit card required
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] bg-primary/10 blur-xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-[var(--shadow-float)]">
                <Image
                  src="/images/hero.jpg"
                  alt="Students working together in a bright campus study space"
                  width={1200}
                  height={800}
                  className="h-56 w-full object-cover sm:h-72 lg:h-80"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#124734]/35 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-4xl">
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
      </LandingSection>

      <LandingSection id="features" tone="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text sm:text-4xl">
                Everything you need to stay on top
              </h2>
              <p className="mt-4 text-lg text-muted">
                Built for the way students actually work — fast, focused, and
                beautifully simple.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-[var(--shadow-soft)]">
              <Image
                src="/images/features.jpg"
                alt="Handwritten notes and planner on a study desk"
                width={900}
                height={650}
                className="h-52 w-full object-cover sm:h-64"
              />
            </div>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={cn(
                  "group transition-default hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
                  featureRadii[index % featureRadii.length],
                )}
              >
                <CardHeader>
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-default group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </LandingSection>

      <LandingSection id="how-it-works" tone="steps" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-[var(--shadow-soft)]">
                <Image
                  src="/images/how-it-works.jpg"
                  alt="University library shelves filled with books"
                  width={900}
                  height={700}
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-4">
                How it works
              </Badge>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-text sm:text-4xl">
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
          </div>
        </div>
      </LandingSection>

      <LandingSection id="pricing" tone="pricing" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-primary/20 bg-surface">
            <CardContent className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
              <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-40"
                aria-hidden
              >
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
              </div>

              <Badge variant="primary" className="mb-6">
                Get started today
              </Badge>

              <h2 className="mx-auto max-w-2xl font-serif text-3xl font-bold tracking-tight text-text sm:text-4xl">
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
                <Link href="/signup" className={buttonStyles({ size: "lg" })}>
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className={buttonStyles({ variant: "outline", size: "lg" })}
                >
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </LandingSection>
    </main>
  );
}
