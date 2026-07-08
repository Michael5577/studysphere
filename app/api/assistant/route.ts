import {
  generateAssistantReply,
  streamAssistantReply,
  type AssistantHistoryMessage,
} from "@/lib/ai/provider";
import {
  getAIErrorMessage,
  getAIProviderPreference,
  getNvidiaApiKey,
  getOpenRouterApiKey,
  getOpenAIApiKey,
  getPrimaryProviderLabel,
  isAssistantLive,
} from "@/lib/ai/assistant-config";
import { getAssistantUnavailableReply } from "@/lib/ai/unavailable";
import type { AssistantSource } from "@/lib/ai/providers/types";
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
    .slice(-12);
}

function sseData(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function GET() {
  try {
    await requireUserId();

    return NextResponse.json({
      live: isAssistantLive(),
      provider: getPrimaryProviderLabel(),
      preference: getAIProviderPreference(),
      nvidiaConfigured: Boolean(getNvidiaApiKey()),
      openrouterConfigured: Boolean(getOpenRouterApiKey()),
      openaiConfigured: Boolean(getOpenAIApiKey()),
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
      stream?: unknown;
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

    const mode = body.mode;
    const history = parseHistory(body.history);
    const wantsStream = body.stream === true;
    const input = { mode, message, history };

    if (!isAssistantLive()) {
      const reply = getAssistantUnavailableReply();

      if (wantsStream) {
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              sseData({ delta: reply, source: "unconfigured", done: true }),
            );
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      }

      return NextResponse.json({ reply, source: "unconfigured" });
    }

    if (wantsStream) {
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let activeSource: AssistantSource | undefined;

            for await (const chunk of streamAssistantReply(input)) {
              if (!activeSource && chunk.source !== "unconfigured") {
                activeSource = chunk.source;
                controller.enqueue(sseData({ source: activeSource }));
              }

              controller.enqueue(sseData({ delta: chunk.delta }));
            }

            controller.enqueue(sseData({ done: true }));
          } catch (error) {
            console.error("[assistant] stream failed", error);
            controller.enqueue(
              sseData({ error: getAIErrorMessage(error), done: true }),
            );
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    try {
      const { reply, source } = await generateAssistantReply(input);

      return NextResponse.json({ reply, source });
    } catch (error) {
      console.error("[assistant] completion failed", error);
      return NextResponse.json(
        { error: getAIErrorMessage(error) },
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
