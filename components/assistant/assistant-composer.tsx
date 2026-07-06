"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";

interface AssistantComposerProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function AssistantComposer({
  onSend,
  isLoading,
  placeholder = "Ask anything about your coursework…",
}: AssistantComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event?: FormEvent) {
    event?.preventDefault();

    const trimmed = value.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setValue("");
    await onSend(trimmed);
    textareaRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="assistant-composer shrink-0 border-t border-border bg-surface px-3 pt-2.5 backdrop-blur-md lg:px-4 lg:pt-3"
    >
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          aria-label="Message StudySphere AI"
          className={cn(
            "min-h-[2.75rem] max-h-28 flex-1 resize-none rounded-2xl border-border bg-background px-3.5 py-2.5 text-[16px] leading-snug sm:text-[15px]",
            "focus-visible:ring-primary/30",
          )}
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !value.trim()}
          aria-label={isLoading ? "Sending message" : "Send message"}
          className="mb-0.5 h-11 w-11 shrink-0 rounded-2xl p-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
