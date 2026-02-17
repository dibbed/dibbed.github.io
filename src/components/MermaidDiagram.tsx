import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;

function initMermaid() {
  if (initialized) return;
  initialized = true;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#0d9668",
      primaryTextColor: "#e2e8f0",
      primaryBorderColor: "#0d966850",
      lineColor: "#0d966880",
      secondaryColor: "#1e293b",
      tertiaryColor: "#0f172a",
      fontFamily: "JetBrains Mono, monospace",
      fontSize: "12px",
      nodeBorder: "#0d966850",
      mainBkg: "#1e293b",
      clusterBkg: "#0f172a",
      edgeLabelBackground: "#0f172a",
    },
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      padding: 12,
      nodeSpacing: 30,
      rankSpacing: 40,
    },
  });
}

interface Props {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    initMermaid();
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    // Use a timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      mermaid
        .render(id, chart)
        .then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        })
        .catch((err) => {
          console.error("Mermaid render error:", err);
          setError(true);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, [chart]);

  if (error) {
    return (
      <div className={`font-mono text-xs text-destructive p-4 ${className}`}>
        Failed to render diagram
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto min-h-[100px] flex items-center justify-center [&_svg]:mx-auto [&_svg]:max-w-full ${className}`}
    >
      <div className="font-mono text-xs text-muted-foreground animate-pulse">
        Rendering diagram...
      </div>
    </div>
  );
}
