import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import type { ArchitectureData } from "@/data/resume-data";

interface Props {
  data: ArchitectureData;
  projectName: string;
}

export function ArchitectureModal({ data, projectName }: Props) {
  const [open, setOpen] = useState(false);
  const { t, lang } = useLanguage();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 font-mono text-[10px] text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
      >
        {t(translations.architecture.viewArchitecture)}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              {projectName} — {t(translations.architecture.systemArchitecture)}
            </DialogTitle>
          </DialogHeader>

          <MermaidDiagram chart={data.mermaid} className="py-4" />

          <div className="border-t border-border/30 pt-3">
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              {lang === "fa" && data.summaryFa ? data.summaryFa : data.summary}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
