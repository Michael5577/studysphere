import type { AssignmentWithCourse } from "@/types/database";
import { isAssistantLive } from "@/lib/ai/assistant-config";
import { generateAssistantText } from "@/lib/ai/providers/router";

export interface PlanMyDayResult {
  plan: string;
  source: "openai" | "nvidia-deepseek" | "fallback";
}

const PLAN_INSTRUCTIONS = [
  "You are StudySphere AI, a study strategist for college students.",
  "Given the student's open assignments, create today's prioritized study plan.",
  "Use plain text only — no markdown, no asterisks, no headers.",
  "Return 3–5 dash bullets ordered by urgency.",
  "Each bullet: task name, suggested time block, and why it matters today.",
  "End with one short encouragement line.",
  "Do not invent assignments that are not in the list.",
  "If there are no open assignments, say they are caught up and suggest review or rest.",
].join(" ");

function priorityScore(priority: AssignmentWithCourse["priority"]): number {
  if (priority === "high") {
    return 3;
  }

  if (priority === "medium") {
    return 2;
  }

  return 1;
}

function daysUntilDue(dueAt: string | null): number {
  if (!dueAt) {
    return 999;
  }

  const due = new Date(dueAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
}

function formatAssignmentLine(assignment: AssignmentWithCourse): string {
  const course = assignment.course?.code ?? "General";
  const due = assignment.due_at
    ? new Date(assignment.due_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "no due date";

  return `- ${assignment.title} (${course}, ${assignment.priority} priority, due ${due})`;
}

function buildFallbackPlan(assignments: AssignmentWithCourse[]): string {
  const open = assignments.filter((item) => item.status !== "done");

  if (open.length === 0) {
    return [
      "You're all caught up on assignments.",
      "",
      "Suggested plan for today:",
      "- Review notes from your hardest course (30 min)",
      "- Run one Focus session to stay sharp (25 min)",
      "- Preview next week's readings (20 min)",
      "",
      "Small consistent sessions beat cramming.",
    ].join("\n");
  }

  const sorted = open.slice().sort((a, b) => {
    const dueDiff = daysUntilDue(a.due_at) - daysUntilDue(b.due_at);

    if (dueDiff !== 0) {
      return dueDiff;
    }

    return priorityScore(b.priority) - priorityScore(a.priority);
  });

  const lines = [
    "Offline plan — add NVIDIA_API_KEY or OPENAI_API_KEY for a personalized AI plan.",
    "",
    "Today's priority order:",
  ];

  sorted.slice(0, 5).forEach((assignment, index) => {
    const dueLabel =
      daysUntilDue(assignment.due_at) < 0
        ? "overdue"
        : daysUntilDue(assignment.due_at) === 0
          ? "due today"
          : daysUntilDue(assignment.due_at) === 1
            ? "due tomorrow"
            : `due in ${daysUntilDue(assignment.due_at)} days`;

    lines.push(
      `- ${index + 1}. ${assignment.title} — ${dueLabel}, ${assignment.priority} priority (45–60 min block)`,
    );
  });

  lines.push("", "Start with the first item while your focus is highest.");

  return lines.join("\n");
}

function buildAssignmentContext(assignments: AssignmentWithCourse[]): string {
  const open = assignments.filter((item) => item.status !== "done");

  if (open.length === 0) {
    return "The student has no open assignments.";
  }

  return ["Open assignments:", ...open.slice(0, 20).map(formatAssignmentLine)].join(
    "\n",
  );
}

export async function generatePlanMyDay(
  assignments: AssignmentWithCourse[],
): Promise<PlanMyDayResult> {
  const context = buildAssignmentContext(assignments);

  if (!isAssistantLive()) {
    return {
      plan: buildFallbackPlan(assignments),
      source: "fallback",
    };
  }

  try {
    const { text, source } = await generateAssistantText({
      instructions: PLAN_INSTRUCTIONS,
      prompt: `${context}\n\nCreate today's study plan.`,
      maxTokens: 700,
      temperature: 0.35,
    });

    return {
      plan: text,
      source: source === "unconfigured" ? "fallback" : source,
    };
  } catch {
    return {
      plan: buildFallbackPlan(assignments),
      source: "fallback",
    };
  }
}
