"use client";

import type { AssistantMessage, AssistantMode } from "@/lib/ai/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface AssistantApiConfig {
  live: boolean;
}

interface AssistantHistoryItem {
  role: "user" | "assistant";
  content: string;
}

interface RetryPayload {
  mode: AssistantMode;
  message: string;
  history: AssistantHistoryItem[];
}

interface AssistantContextValue {
  open: boolean;
  mode: AssistantMode;
  messagesByMode: Record<AssistantMode, AssistantMessage[]>;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  isLive: boolean;
  setMode: (mode: AssistantMode) => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (content: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  clearError: () => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

function createMessage(
  role: AssistantMessage["role"],
  content: string,
  extra?: Partial<AssistantMessage>,
): AssistantMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    ...extra,
  };
}

const emptyMessages = (): Record<AssistantMode, AssistantMessage[]> => ({
  chat: [],
  summarize: [],
  flashcards: [],
  quiz: [],
});

interface AssistantProviderProps {
  children: ReactNode;
}

export function AssistantProvider({ children }: AssistantProviderProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("chat");
  const [messagesByMode, setMessagesByMode] =
    useState<Record<AssistantMode, AssistantMessage[]>>(emptyMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const retryPayloadRef = useRef<RetryPayload | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    void fetch("/api/assistant")
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        return (await response.json()) as AssistantApiConfig;
      })
      .then((data) => {
        if (data) {
          setIsLive(data.live);
        }
      });
  }, []);

  const openAssistant = useCallback(() => setOpen(true), []);
  const closeAssistant = useCallback(() => setOpen(false), []);
  const toggleAssistant = useCallback(() => setOpen((current) => !current), []);
  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const dispatchMessage = useCallback(
    async (activeMode: AssistantMode, trimmed: string, history: AssistantHistoryItem[]) => {
      setError(null);
      retryPayloadRef.current = { mode: activeMode, message: trimmed, history };

      const userMessage = createMessage("user", trimmed);
      const assistantId = createMessage("assistant", "", { streaming: true }).id;

      setMessagesByMode((current) => ({
        ...current,
        [activeMode]: [
          ...current[activeMode],
          userMessage,
          createMessage("assistant", "", { id: assistantId, streaming: true }),
        ],
      }));

      setIsLoading(true);
      setIsStreaming(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: activeMode,
            message: trimmed,
            history,
            stream: true,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Unable to reach the assistant.");
        }

        if (!response.body) {
          throw new Error("No response stream received.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullReply = "";
        let source: "openai" | "unconfigured" = "openai";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) {
              continue;
            }

            const payload = JSON.parse(line.slice(6)) as {
              delta?: string;
              error?: string;
              done?: boolean;
              source?: "openai" | "unconfigured";
            };

            if (payload.source === "unconfigured") {
              source = "unconfigured";
              setIsLive(false);
            }

            if (payload.error) {
              throw new Error(payload.error);
            }

            if (payload.delta) {
              fullReply += payload.delta;

              setMessagesByMode((current) => ({
                ...current,
                [activeMode]: current[activeMode].map((item) =>
                  item.id === assistantId
                    ? { ...item, content: fullReply, streaming: !payload.done }
                    : item,
                ),
              }));
            }

            if (payload.done) {
              setMessagesByMode((current) => ({
                ...current,
                [activeMode]: current[activeMode].map((item) =>
                  item.id === assistantId
                    ? { ...item, content: fullReply, streaming: false }
                    : item,
                ),
              }));
            }
          }
        }

        if (!fullReply.trim()) {
          throw new Error("No response received. Please try again.");
        }

        if (source === "openai") {
          setIsLive(true);
          retryPayloadRef.current = null;
        }
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") {
          return;
        }

        const message =
          cause instanceof Error
            ? cause.message
            : "Unable to reach the assistant. Please try again.";

        setError(message);

        setMessagesByMode((current) => ({
          ...current,
          [activeMode]: current[activeMode]
            .filter((item) => item.id !== assistantId)
            .map((item) =>
              item.id === userMessage.id ? { ...item, error: true } : item,
            ),
        }));
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();

      if (!trimmed || isLoading) {
        return;
      }

      const history = messagesByMode[mode]
        .filter((item) => !item.error && !item.streaming)
        .slice(-12)
        .map((item) => ({
          role: item.role,
          content: item.content,
        }));

      await dispatchMessage(mode, trimmed, history);
    },
    [dispatchMessage, isLoading, mode, messagesByMode],
  );

  const retryLastMessage = useCallback(async () => {
    const payload = retryPayloadRef.current;

    if (!payload || isLoading) {
      return;
    }

    setError(null);

    setMessagesByMode((current) => ({
      ...current,
      [payload.mode]: current[payload.mode].filter(
        (item) => !item.error && !item.streaming,
      ),
    }));

    await dispatchMessage(payload.mode, payload.message, payload.history);
  }, [dispatchMessage, isLoading]);

  const value = useMemo(
    () => ({
      open,
      mode,
      messagesByMode,
      isLoading,
      isStreaming,
      error,
      isLive,
      setMode,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      sendMessage,
      retryLastMessage,
      clearError,
    }),
    [
      open,
      mode,
      messagesByMode,
      isLoading,
      isStreaming,
      error,
      isLive,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      sendMessage,
      retryLastMessage,
      clearError,
    ],
  );

  return (
    <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);

  if (!context) {
    throw new Error("useAssistant must be used within AssistantProvider");
  }

  return context;
}
