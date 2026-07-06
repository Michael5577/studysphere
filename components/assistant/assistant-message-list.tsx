"use client";

import type { AssistantMessage } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface AssistantMessageListProps {
  messages: AssistantMessage[];
  isLoading: boolean;
  isOffline?: boolean;
}

export function AssistantMessageList({
  messages,
  isLoading,
  isOffline = false,
}: AssistantMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <div className="assistant-messages flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-2 [-webkit-overflow-scrolling:touch] sm:px-4 sm:py-3">
      <div className="flex flex-col gap-2.5 pb-2">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "w-fit max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-[1.5] sm:max-w-[85%] sm:px-4 sm:py-3",
                  isUser
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted-surface text-text",
                )}
              >
                {!isUser && isOffline && (
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Offline
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex w-full justify-start" aria-live="polite" aria-busy="true">
            <div className="w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-muted-surface px-3.5 py-2.5 sm:max-w-[85%] sm:px-4 sm:py-3">
              <p className="text-sm font-medium text-text">Thinking…</p>
              <div className="assistant-typing mt-2 flex items-center gap-1.5">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={bottomRef} className="h-24 shrink-0" aria-hidden />
    </div>
  );
}
