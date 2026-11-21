import { useState } from "react";
import { ExternalLink, FileCode2, Network, Terminal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { useLanguage } from "@/i18n/use-language";
import { translations } from "@/i18n/translations";
import type { ArchitectureData, ProjectCaseStudy, TerminalPreviewData } from "@/data/resume-data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ArchitectureData;
  projectName: string;
  terminalPreview?: TerminalPreviewData;
  caseStudy?: ProjectCaseStudy;
}

export function ArchitectureModal({ open, onOpenChange, data, projectName, terminalPreview, caseStudy }: Props) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    data.nodes?.[0]?.id ?? null
  );
  const { t, lang } = useLanguage();
  const selectedNode = data.nodes?.find((node) => node.id === selectedNodeId) ?? data.nodes?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto border-border/60 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              {projectName} — {t(translations.architecture.systemArchitecture)}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {lang === "fa" && data.summaryFa ? data.summaryFa : data.summary}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="diagram" className="min-w-0">
            <TabsList className="mb-3 flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
              <TabsTrigger value="diagram" className="gap-1.5 text-xs">
                <Network className="h-3.5 w-3.5" aria-hidden="true" />
                {t(translations.architecture.diagramTab)}
              </TabsTrigger>
              {caseStudy && (
                <TabsTrigger value="study" className="gap-1.5 text-xs">
                  <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {t(translations.architecture.caseStudyTab)}
                </TabsTrigger>
              )}
              {terminalPreview && (
                <TabsTrigger value="preview" className="gap-1.5 text-xs">
                  <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                  {t(translations.architecture.previewTab)}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="diagram" className="space-y-4">
              <MermaidDiagram
                chart={data.mermaid}
                className="rounded-lg border border-border/40 bg-background/50 p-4"
              />

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
                          className={
                            "rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
                            (active
                              ? "border-primary/60 bg-primary/15 font-semibold text-primary"
                              : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground")
                          }
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
            </TabsContent>

            {caseStudy && (
              <TabsContent value="study" className="space-y-3">
                <div className="rounded-lg border border-border/50 bg-background/45 p-4">
                  <h3 className="mb-2 text-xs font-semibold text-primary">
                    {t(translations.architecture.caseProblem)}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {lang === "fa" ? caseStudy.problemFa : caseStudy.problem}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-background/45 p-4">
                  <h3 className="mb-2 text-xs font-semibold text-primary">
                    {t(translations.architecture.caseApproach)}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {lang === "fa" ? caseStudy.approachFa : caseStudy.approach}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-background/45 p-4">
                  <h3 className="mb-3 text-xs font-semibold text-primary">
                    {t(translations.architecture.caseEvidence)}
                  </h3>
                  <div className="flex flex-col gap-2" dir="ltr">
                    {caseStudy.evidence.map((entry) => (
                      <a
                        key={entry.url}
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                        {entry.label}
                      </a>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}

            {terminalPreview && (
              <TabsContent value="preview" className="space-y-3">
                <p className="rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-foreground/90" role="note">
                  {t(translations.architecture.demoDisclaimer)}
                </p>
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
                  <div className="mb-2 break-all text-emerald-400">
                    <span className="select-none text-slate-500">$ </span>
                    {terminalPreview.command}
                  </div>
                  <div className="space-y-1 text-slate-300">
                    {terminalPreview.output.map((line, index) => (
                      <div key={index} className="whitespace-pre-wrap break-words">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
    </Dialog>
  );
}
