import { lazy, Suspense, useState } from "react";
import { useLanguage } from "@/i18n/use-language";
import { translations } from "@/i18n/translations";
import type { ArchitectureData, ProjectCaseStudy, TerminalPreviewData } from "@/data/resume-data";

// The Radix tab dialog and Mermaid rendering code load only after a user opens one.
const ArchitectureModal = lazy(() =>
  import("@/components/ArchitectureModal").then((module) => ({ default: module.ArchitectureModal })),
);

interface Props {
  data: ArchitectureData;
  projectName: string;
  terminalPreview?: TerminalPreviewData;
  caseStudy?: ProjectCaseStudy;
}

export function ArchitectureLauncher({ data, projectName, terminalPreview, caseStudy }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center rounded-lg px-2 font-mono text-xs font-semibold text-primary underline underline-offset-2 transition-colors active:scale-[0.98] hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-0 sm:px-0 sm:font-medium"
      >
        {t(translations.architecture.viewArchitecture)}
      </button>
      {open && (
        <Suspense fallback={<span role="status" className="text-xs text-muted-foreground">{t(translations.architecture.rendering)}</span>}>
          <ArchitectureModal
            open={open}
            onOpenChange={setOpen}
            data={data}
            projectName={projectName}
            terminalPreview={terminalPreview}
            caseStudy={caseStudy}
          />
        </Suspense>
      )}
    </>
  );
}
