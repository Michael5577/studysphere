"use client";

import type { AssistantMessage, AssistantMode } from "@/lib/ai/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AssistantApiConfig {
  live: boolean;
}

interface AssistantApiResponse {
  reply: string;
  source: "openai" | "fallback";
}

interface AssistantApiError {
  error: string;
}

interface AssistantContextValue {
  open: boolean;
  mode: AssistantMode;
  messagesByMode: Record<AssistantMode, AssistantMessage[]>;
  isLoading: boolean;
  error: string | null;
  isPreviewMode: boolean;
  setMode: (mode: AssistantMode) => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

function createMessage(role: AssistantMessage["role"], content: string): AssistantMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

const emptyMessages = (): Record<AssistantMode, AssistantMessage[]> => ({
  chat: [],
  summarize: [],
  flashcards: [],
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
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(true);

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
          setIsPreviewMode(!data.live);
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

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();

      if (!trimmed || isLoading) {
        return;
      }

      setError(null);

      const history = messagesByMode[mode]
        .slice(-8)
        .map((item) => ({
          role: item.role,
          content: item.content,
        }));

      const userMessage = createMessage("user", trimmed);

      setMessagesByMode((current) => ({
        ...current,
        [mode]: [...current[mode], userMessage],
      }));

      setIsLoading(true);

      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            message: trimmed,
            history,
          }),
        });

        const payload = (await response.json()) as
          | AssistantApiResponse
          | AssistantApiError;

        if (!response.ok) {
          setError(
            "error" in payload
              ? payload.error
              : "Unable to reach the assistant. Please try again.",
          );
          return;
        }

        if (!("reply" in payload)) {
          setError("No response received. Please try again.");
          return;
        }

        setIsPreviewMode(payload.source === "fallback");

        const assistantMessage = createMessage("assistant", payload.reply);

        setMessagesByMode((current) => ({
          ...current,
          [mode]: [...current[mode], assistantMessage],
        }));
      } catch {
        setError("Unable to reach the assistant. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, mode, messagesByMode],
  );

  const value = useMemo(
    () => ({
      open,
      mode,
      messagesByMode,
      isLoading,
      error,
      isPreviewMode,
      setMode,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      sendMessage,
      clearError,
    }),
    [
      open,
      mode,
      messagesByMode,
      isLoading,
      error,
      isPreviewMode,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      sendMessage,
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
