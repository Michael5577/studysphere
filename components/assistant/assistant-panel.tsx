"use client";

import { AssistantComposer } from "@/components/assistant/assistant-composer";
import { AssistantEmptyState } from "@/components/assistant/assistant-empty-state";
import { AssistantHistoryPanel } from "@/components/assistant/assistant-history";
import { AssistantMessageList } from "@/components/assistant/assistant-message-list";
import { AssistantOfflineBanner } from "@/components/assistant/assistant-offline-banner";
import { AssistantQuizSetup } from "@/components/assistant/assistant-quiz-setup";
import { useAssistant } from "@/components/assistant/assistant-provider";
import { AssistantModeTabs } from "@/components/assistant/assistant-trigger";
import { Button } from "@/components/ui/button";
import { ASSISTANT_MODE_LABELS } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { History, RotateCcw, Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MODE_PLACEHOLDERS = {
  chat: "Ask anything about your coursework…",
  summarize: "Paste notes or describe what to summarize…",
  flashcards: "What topic should I create flashcards for?",
  quiz: "What topic should I quiz you on?",
} as const;

const OFFLINE_BANNER_KEY = "studysphere-assistant-offline-banner-dismissed";

function readOfflineBannerDismissed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(OFFLINE_BANNER_KEY) === "1";
}

export function AssistantPanel() {
  const {
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
    closeAssistant,
    toggleExpanded,
    toggleHistory,
    restoreHistoryEntry,
    removeHistoryEntry,
    clearHistory,
    sendMessage,
    retryLastMessage,
    clearError,
  } = useAssistant();

  const panelRef = useRef<HTMLElement>(null);
  const messages = messagesByMode[mode];
  const [offlineBannerDismissed, setOfflineBannerDismissed] = useState(
    readOfflineBannerDismissed,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    if (window.matchMedia("(max-width: 1023px)").matches) {
      lockBodyScroll();
    }

    return () => {
      cancelAnimationFrame(frame);
      unlockBodyScroll();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const viewport = window.visualViewport;

    if (!viewport) {
      return;
    }

    const visualViewport = viewport;

    function syncKeyboardOffset() {
      const keyboardOffset = Math.max(
        0,
        window.innerHeight - visualViewport.height - visualViewport.offsetTop,
      );

      document.documentElement.style.setProperty(
        "--assistant-keyboard-offset",
        `${keyboardOffset}px`,
      );
    }

    syncKeyboardOffset();
    document.body.dataset.assistantOpen = "true";
    visualViewport.addEventListener("resize", syncKeyboardOffset);
    visualViewport.addEventListener("scroll", syncKeyboardOffset);

    return () => {
      visualViewport.removeEventListener("resize", syncKeyboardOffset);
      visualViewport.removeEventListener("scroll", syncKeyboardOffset);
      document.documentElement.style.setProperty(
        "--assistant-keyboard-offset",
        "0px",
      );
      delete document.body.dataset.assistantOpen;
    };
  }, [open]);

  function dismissOfflineBanner() {
    setOfflineBannerDismissed(true);
    window.sessionStorage.setItem(OFFLINE_BANNER_KEY, "1");
  }

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close AI Assistant"
        className="fixed inset-0 z-[85] bg-black/40 lg:hidden"
        onClick={closeAssistant}
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="StudySphere AI Assistant"
        className={cn(
          "assistant-panel fixed z-[90] flex flex-col overflow-hidden bg-surface outline-none",
          "inset-0 h-[100dvh] max-h-[100dvh] w-full",
          expanded
            ? "lg:inset-0 lg:left-[var(--sidebar-width)] lg:w-auto lg:max-w-none lg:border-l lg:border-border"
            : "lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:max-h-[100dvh] lg:w-[var(--assistant-width)] lg:border-l lg:border-border lg:shadow-[var(--shadow-float)]",
        )}
      >
        <header className="assistant-header shrink-0 border-b border-border bg-surface/95 px-4 pb-2.5 backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top,0px))] lg:pb-3 lg:pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-muted sm:block">
                StudySphere AI
              </p>
              <h2 className="font-serif text-base font-semibold leading-tight text-text sm:text-lg">
                {ASSISTANT_MODE_LABELS[mode]}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 gap-1.5 px-2",
                  historyOpen && "bg-primary-muted text-primary",
                )}
                onClick={toggleHistory}
                aria-label="Study history"
              >
                <History className="h-4 w-4" />
                <span className="text-xs font-semibold">History</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="hidden h-9 w-9 p-0 lg:inline-flex"
                onClick={toggleExpanded}
                aria-label={expanded ? "Exit full screen" : "Open full screen"}
              >
                {expanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 shrink-0 p-0"
                onClick={closeAssistant}
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AssistantModeTabs mode={mode} onChange={setMode} className="mt-2" />

          {!isLive && !offlineBannerDismissed && (
            <AssistantOfflineBanner
              onDismiss={dismissOfflineBanner}
              className="mt-2"
            />
          )}
        </header>

        {historyOpen ? (
          <AssistantHistoryPanel
            entries={historyEntries}
            onRestore={restoreHistoryEntry}
            onDelete={removeHistoryEntry}
            onClearAll={clearHistory}
            onClose={toggleHistory}
          />
        ) : (
        <div className="assistant-body flex min-h-0 flex-1 flex-col overflow-hidden">
          {mode === "quiz" && (
            <AssistantQuizSetup
              settings={quizSettings}
              onChange={setQuizSettings}
              disabled={isLoading}
            />
          )}
          {error && (
            <div
              role="alert"
              className="mx-3 mt-2 flex shrink-0 items-start justify-between gap-2 rounded-lg border border-error/25 bg-error/5 px-3 py-2 text-sm text-error sm:mx-4"
            >
              <span className="min-w-0 leading-snug">{error}</span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => void retryLastMessage()}
                  className="inline-flex items-center gap-1 text-xs font-semibold underline focus-ring"
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </button>
                <button
                  type="button"
                  onClick={clearError}
                  className="text-xs font-semibold underline focus-ring"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {messages.length === 0 ? (
            <AssistantEmptyState
              mode={mode}
              historyEntries={historyEntries}
              onRestoreHistory={restoreHistoryEntry}
              onSelectPrompt={(prompt) => void sendMessage(prompt)}
              disabled={isLoading}
              isOffline={!isLive}
            />
          ) : (
            <AssistantMessageList
              mode={mode}
              messages={messages}
              isLoading={isLoading}
              isStreaming={isStreaming}
              isOffline={!isLive}
            />
          )}
        </div>
        )}

        {!historyOpen && (
          <AssistantComposer
            onSend={sendMessage}
            isLoading={isLoading}
            placeholder={MODE_PLACEHOLDERS[mode]}
          />
        )}
      </aside>
    </>
  );
}
