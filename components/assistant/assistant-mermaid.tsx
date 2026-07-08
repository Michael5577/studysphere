"use client";

import { cn } from "@/lib/utils";
import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

interface AssistantMermaidProps {
  chart: string;
  className?: string;
}

let mermaidInitialized = false;

function initMermaid() {
  if (mermaidInitialized) {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#5d7052",
      primaryTextColor: "#f3f4f1",
      primaryBorderColor: "#4d6344",
      lineColor: "#78786c",
      secondaryColor: "#e6dccd",
      tertiaryColor: "#124734",
      fontFamily: "inherit",
    },
    flowchart: {
      htmlLabels: true,
      curve: "basis",
    },
  });

  mermaidInitialized = true;
}

export function AssistantMermaid({ chart, className }: AssistantMermaidProps) {
  const reactId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        initMermaid();
        const { svg: rendered } = await mermaid.render(
          `studysphere-mermaid-${reactId}`,
          chart.trim(),
        );

        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not render diagram.");
          setSvg(null);
        }
      }
    }

    void renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <pre className="assistant-diagram-fallback overflow-x-auto rounded-lg bg-background/80 p-3 font-mono text-xs">
        {chart}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="assistant-diagram my-3 h-24 animate-pulse rounded-lg bg-background/50" />
    );
  }

  return (
    <div
      className={cn(
        "assistant-diagram my-3 overflow-x-auto rounded-lg border border-border/60 bg-background/40 p-3",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
