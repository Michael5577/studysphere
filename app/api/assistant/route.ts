import {
  generateAssistantReply,
  type AssistantHistoryMessage,
} from "@/lib/ai/provider";
import { getOpenAIErrorMessage, isAssistantLive } from "@/lib/ai/openai-config";
import { ASSISTANT_MODES, type AssistantMode } from "@/lib/ai/types";
import { requireUserId } from "@/lib/db/auth";
import { NextResponse } from "next/server";

const MAX_MESSAGE_LENGTH = 6000;

function isAssistantMode(value: unknown): value is AssistantMode {
  return (
    typeof value === "string" &&
    (ASSISTANT_MODES as readonly string[]).includes(value)
  );
}

function parseHistory(value: unknown): AssistantHistoryMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is AssistantHistoryMessage =>
        typeof item === "object" &&
        item !== null &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string",
    )
    .slice(-8);
}

export async function GET() {
  try {
    await requireUserId();

    return NextResponse.json({
      live: isAssistantLive(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load assistant configuration.",
      },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireUserId();

    const body = (await request.json()) as {
      mode?: unknown;
      message?: unknown;
      history?: unknown;
    };

    if (!isAssistantMode(body.mode)) {
      return NextResponse.json(
        { error: "Invalid assistant mode." },
        { status: 400 },
      );
    }

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "Please enter a message before sending." },
        { status: 400 },
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Your message is too long (${message.length} characters). Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    try {
      const { reply, source } = await generateAssistantReply({
        mode: body.mode,
        message,
        history: parseHistory(body.history),
      });

      return NextResponse.json({ reply, source });
    } catch (error) {
      return NextResponse.json(
        { error: getOpenAIErrorMessage(error) },
        { status: 502 },
      );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    const status = message.includes("signed in") ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
