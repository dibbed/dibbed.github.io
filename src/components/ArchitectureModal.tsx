import { useState } from "react";
import { Terminal, Network } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import type { ArchitectureData, TerminalPreviewData } from "@/data/resume-data";

interface Props {
  data: ArchitectureData;
  projectName: string;
  terminalPreview?: TerminalPreviewData;
}

export function ArchitectureModal({ data, projectName, terminalPreview }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"diagram" | "preview">("diagram");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    data.nodes?.[0]?.id ?? null
  );
  const { t, lang } = useLanguage();

  const selectedNode = data.nodes?.find((n) => n.id === selectedNodeId) ?? data.nodes?.[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 font-mono text-[11px] font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {t(translations.architecture.viewArchitecture)}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-border/60 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              {projectName} — {t(translations.architecture.systemArchitecture)}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {lang === "fa" && data.summaryFa ? data.summaryFa : data.summary}
            </DialogDescription>
          </DialogHeader>

          {terminalPreview && (
            <div className="flex items-center gap-2 border-b border-border/40 pb-2" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "diagram"}
                onClick={() => setActiveTab("diagram")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                  activeTab === "diagram"
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Network className="h-3.5 w-3.5" aria-hidden="true" />
                {t(translations.architecture.diagramTab)}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "preview"}
                onClick={() => setActiveTab("preview")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                  activeTab === "preview"
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                {t(translations.architecture.previewTab)}
              </button>
            </div>
          )}

          {activeTab === "diagram" ? (
            <div className="space-y-4">
              <MermaidDiagram chart={data.mermaid} className="rounded-lg border border-border/40 bg-background/50 p-4" />

              {data.nodes && data.nodes.length > 0 && (
                <div className="space-y-2.5 rounded-lg border border-border/40 bg-background/40 p-3.5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {t(translations.architecture.inspectNodesHint)}
                  </p>
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {data.nodes.map((node) => {
                      const active = selectedNode?.id === node.id;
                      return (
                        <button
                          key={node.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            active
                              ? "border-primary/60 bg-primary/15 text-primary font-semibold"
                              : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {node.label}
                        </button>
                      );
                    })}
                  </div>
                  {selectedNode && (
                    <div className="rounded-md border border-border/40 bg-card/70 p-3" aria-live="polite">
                      <p className="mb-1 font-mono text-xs font-semibold text-primary" dir="ltr">
                        {selectedNode.label}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {lang === "fa" ? selectedNode.roleFa : selectedNode.role}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            terminalPreview && (
              <div
                className="overflow-x-auto rounded-lg border border-border/60 bg-slate-950 p-4 font-mono text-xs text-slate-200"
                dir="ltr"
              >
                <div className="mb-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-2">{projectName}</span>
                </div>
                <div className="mb-2 text-emerald-400">
                  <span className="select-none text-slate-500">$ </span>
                  {terminalPreview.command}
                </div>
                <div className="space-y-1 text-slate-300">
                  {terminalPreview.output.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
