"use client";

import { AssistantInteractiveQuiz } from "@/components/assistant/assistant-interactive-quiz";
import { AssistantMermaid } from "@/components/assistant/assistant-mermaid";
import { parseQuizPayload } from "@/lib/ai/quiz-parse";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

interface AssistantMarkdownProps {
  content: string;
  className?: string;
  mode?: "chat" | "summarize" | "flashcards" | "quiz";
  streaming?: boolean;
  quizPlayMode?: "practice" | "exam";
}

/** Convert \(...\) and \[...\] LaTeX delimiters to $-style for remark-math. */
function normalizeMathDelimiters(content: string): string {
  return content
    .replace(/\\\[([\s\S]*?)\\\]/g, (_match, expr: string) => `\n$$\n${expr}\n$$\n`)
    .replace(/\\\((.*?)\\\)/g, (_match, expr: string) => `$${expr}$`);
}

function looksLikeQuizJson(content: string): boolean {
  const trimmed = content.trim();
  return (
    trimmed.includes('"questions"') &&
    (trimmed.startsWith("{") || trimmed.includes("```"))
  );
}

export function AssistantMarkdown({
  content,
  className,
  mode,
  streaming = false,
  quizPlayMode = "practice",
}: AssistantMarkdownProps) {
  if (mode === "quiz" && !streaming) {
    const quiz = parseQuizPayload(content);

    if (quiz) {
      return (
        <div className={cn("assistant-markdown", className)}>
          <AssistantInteractiveQuiz quiz={quiz} playMode={quizPlayMode} />
        </div>
      );
    }

    // JSON came back malformed — never show raw JSON to students.
    if (looksLikeQuizJson(content)) {
      return (
        <div className={cn("assistant-markdown", className)}>
          <p className="text-sm leading-snug text-muted">
            The quiz didn&apos;t generate cleanly this time. Please send your
            topic again and I&apos;ll rebuild it.
          </p>
        </div>
      );
    }
  }

  return (
    <div className={cn("assistant-markdown break-words text-[15px] leading-[1.55]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-snug">{children}</li>,
          h1: ({ children }) => (
            <h3 className="mb-2 font-serif text-base font-semibold text-text">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 font-serif text-sm font-semibold text-text">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-1.5 text-sm font-semibold text-text">{children}</h4>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-text">{children}</strong>
          ),
          code: ({ className: codeClassName, children }) => {
            const language = codeClassName?.replace("language-", "") ?? "";
            const source = String(children).replace(/\n$/, "");

            if (language === "mermaid") {
              return <AssistantMermaid chart={source} />;
            }

            if (language === "svg") {
              return (
                <div
                  className="assistant-diagram my-3 overflow-x-auto rounded-lg border border-border/60 bg-background/40 p-2"
                  dangerouslySetInnerHTML={{ __html: source }}
                />
              );
            }

            const isBlock = codeClassName?.includes("language-");

            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-lg bg-background/80 px-3 py-2 font-mono text-[13px] leading-relaxed">
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded bg-background/80 px-1 py-0.5 font-mono text-[13px]">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-2 overflow-x-auto rounded-lg last:mb-0 [&:has(.assistant-diagram)]:bg-transparent [&:has(.assistant-diagram)]:p-0">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-2 border-l-2 border-primary/30 pl-3 text-muted last:mb-0">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              {children}
            </a>
          ),
        }}
      >
        {normalizeMathDelimiters(content)}
      </ReactMarkdown>
    </div>
  );
}
