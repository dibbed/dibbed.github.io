import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

interface Props {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    setError(false);
    setLoading(true);

    const isDark = resolvedTheme !== "light";
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    const renderDiagram = async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;

        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: isDark
            ? {
                primaryColor: "#0f2e26",
                primaryTextColor: "#e2e8f0",
                primaryBorderColor: "#10b98180",
                lineColor: "#10b981aa",
                secondaryColor: "#1e293b",
                tertiaryColor: "#0f172a",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                nodeBorder: "#10b98180",
                mainBkg: "#0f172a",
                clusterBkg: "#0f172a",
                edgeLabelBackground: "#0f172a",
              }
            : {
                primaryColor: "#ecfdf5",
                primaryTextColor: "#0f172a",
                primaryBorderColor: "#077351",
                lineColor: "#077351",
                secondaryColor: "#f1f5f9",
                tertiaryColor: "#ffffff",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                nodeBorder: "#077351",
                mainBkg: "#f8fafc",
                clusterBkg: "#f1f5f9",
                edgeLabelBackground: "#ffffff",
              },
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            padding: 12,
            nodeSpacing: 30,
            rankSpacing: 40,
          },
        });

        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setLoading(false);
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      void renderDiagram();
    }, 40);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [chart, resolvedTheme]);

  if (error) {
    return (
      <div className={`p-4 font-mono text-xs text-destructive ${className}`}>
        {t(translations.architecture.renderError)}
      </div>
    );
  }

  return (
    <div className={`relative min-h-[120px] overflow-x-auto ${className}`} dir="ltr">
      {loading && (
        <div className="flex min-h-[120px] items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">
          {t(translations.architecture.rendering)}
        </div>
      )}
      <div
        ref={containerRef}
        className={`flex items-center justify-center [&_svg]:mx-auto [&_svg]:max-w-full ${loading ? "hidden" : ""}`}
      />
    </div>
  );
}
