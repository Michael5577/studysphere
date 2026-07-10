"use client";

import type { AssistantMessage, AssistantMode } from "@/lib/ai/types";
import type { AssistantSource } from "@/lib/ai/providers/types";
import {
  deleteAssistantHistoryEntry,
  clearAssistantHistory,
  readAssistantHistory,
  upsertAssistantHistoryEntry,
  type AssistantHistoryEntry,
} from "@/lib/ai/history";
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

export interface QuizSettings {
  questionCount: 5 | 10 | 20;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  playMode: "practice" | "exam";
}

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  questionCount: 5,
  difficulty: "mixed",
  playMode: "practice",
};

interface AssistantContextValue {
  open: boolean;
  expanded: boolean;
  mode: AssistantMode;
  messagesByMode: Record<AssistantMode, AssistantMessage[]>;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  isLive: boolean;
  quizSettings: QuizSettings;
  historyEntries: AssistantHistoryEntry[];
  historyOpen: boolean;
  setMode: (mode: AssistantMode) => void;
  setQuizSettings: (settings: QuizSettings) => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  toggleExpanded: () => void;
  collapseExpanded: () => void;
  toggleHistory: () => void;
  restoreHistoryEntry: (id: string) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;
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

function historyTitle(message: string): string {
  const clean = message.replace(/\s+/g, " ").trim();
  return clean.length > 60 ? `${clean.slice(0, 57)}…` : clean;
}

interface AssistantProviderProps {
  children: ReactNode;
}

export function AssistantProvider({ children }: AssistantProviderProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("chat");
  const [messagesByMode, setMessagesByMode] =
    useState<Record<AssistantMode, AssistantMessage[]>>(emptyMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>(
    DEFAULT_QUIZ_SETTINGS,
  );
  const [historyEntries, setHistoryEntries] = useState<AssistantHistoryEntry[]>([]);
  const retryPayloadRef = useRef<RetryPayload | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdsRef = useRef<Partial<Record<AssistantMode, string>>>({});

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

  const openAssistant = useCallback(() => {
    setHistoryEntries(readAssistantHistory());
    setOpen(true);
  }, []);
  const closeAssistant = useCallback(() => {
    setOpen(false);
    setHistoryOpen(false);
  }, []);
  const toggleAssistant = useCallback(() => setOpen((current) => !current), []);
  const toggleExpanded = useCallback(() => setExpanded((current) => !current), []);
  const collapseExpanded = useCallback(() => setExpanded(false), []);
  const toggleHistory = useCallback(() => {
    setHistoryOpen((current) => {
      if (!current) {
        setHistoryEntries(readAssistantHistory());
      }

      return !current;
    });
  }, []);
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
      if (event.key !== "Escape") {
        return;
      }

      // Esc steps back: history → fullscreen → close.
      setHistoryOpen((historyWasOpen) => {
        if (historyWasOpen) {
          return false;
        }

        setExpanded((wasExpanded) => {
          if (wasExpanded) {
            return false;
          }

          setOpen(false);
          return false;
        });

        return false;
      });
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const persistSession = useCallback(
    (activeMode: AssistantMode, messages: AssistantMessage[]) => {
      const clean = messages.filter((item) => !item.error && item.content.trim());

      if (clean.length === 0) {
        return;
      }

      const firstUser = clean.find((item) => item.role === "user");

      const sessionId =
        sessionIdsRef.current[activeMode] ??
        `${activeMode}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionIdsRef.current[activeMode] = sessionId;

      const entry: AssistantHistoryEntry = {
        id: sessionId,
        mode: activeMode,
        title: historyTitle(firstUser?.content ?? "Study session"),
        updatedAt: Date.now(),
        messages: clean.map((item) => ({
          role: item.role,
          content: item.content,
        })),
      };

      upsertAssistantHistoryEntry(entry);
      setHistoryEntries(readAssistantHistory());
    },
    [],
  );

  const restoreHistoryEntry = useCallback((id: string) => {
    const entry = readAssistantHistory().find((item) => item.id === id);

    if (!entry) {
      return;
    }

    sessionIdsRef.current[entry.mode] = entry.id;
    setMode(entry.mode);
    setMessagesByMode((current) => ({
      ...current,
      [entry.mode]: entry.messages.map((item) =>
        createMessage(item.role, item.content),
      ),
    }));
    setHistoryOpen(false);
  }, []);

  const removeHistoryEntry = useCallback((id: string) => {
    deleteAssistantHistoryEntry(id);
    setHistoryEntries(readAssistantHistory());
  }, []);

  const clearHistory = useCallback(() => {
    clearAssistantHistory();
    setHistoryEntries([]);
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
        let source: AssistantSource = "openai";

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
              source?: AssistantSource;
            };

            if (payload.source === "unconfigured") {
              source = "unconfigured";
              setIsLive(false);
            } else if (
              payload.source === "openai" ||
              payload.source === "nvidia-deepseek" ||
              payload.source === "openrouter"
            ) {
              source = payload.source;
              setIsLive(true);
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

        if (
          source === "openai" ||
          source === "nvidia-deepseek" ||
          source === "openrouter"
        ) {
          setIsLive(true);
          retryPayloadRef.current = null;
        }

        setMessagesByMode((current) => {
          persistSession(activeMode, current[activeMode]);
          return current;
        });
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
    [persistSession],
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

      let outbound = trimmed;

      if (mode === "quiz") {
        outbound = [
          trimmed,
          `Quiz settings: ${quizSettings.questionCount} questions, difficulty ${quizSettings.difficulty}.`,
        ].join("\n\n");
      }

      await dispatchMessage(mode, outbound, history);
    },
    [dispatchMessage, isLoading, mode, messagesByMode, quizSettings],
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
      expanded,
      mode,
      messagesByMode,
      isLoading,
      isStreaming,
      error,
      isLive,
      quizSettings,
      historyEntries,
      historyOpen,
      setMode,
      setQuizSettings,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      toggleExpanded,
      collapseExpanded,
      toggleHistory,
      restoreHistoryEntry,
      removeHistoryEntry,
      clearHistory,
      sendMessage,
      retryLastMessage,
      clearError,
    }),
    [
      open,
      expanded,
      mode,
      messagesByMode,
      isLoading,
      isStreaming,
      error,
      isLive,
      quizSettings,
      historyEntries,
      historyOpen,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      toggleExpanded,
      collapseExpanded,
      toggleHistory,
      restoreHistoryEntry,
      removeHistoryEntry,
      clearHistory,
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
