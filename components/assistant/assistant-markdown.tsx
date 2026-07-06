"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AssistantMarkdownProps {
  content: string;
  className?: string;
}

export function AssistantMarkdown({ content, className }: AssistantMarkdownProps) {
  return (
    <div className={cn("assistant-markdown break-words text-[15px] leading-[1.55]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
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
          <pre className="mb-2 overflow-x-auto rounded-lg last:mb-0">{children}</pre>
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
