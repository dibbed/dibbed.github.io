import { useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness, Code2, Ellipsis, FileDown, FolderGit2, GraduationCap,
  Home, Mail, Search, Terminal, Zap,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { useLanguage } from "@/i18n/use-language";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";
import { translations } from "@/i18n/translations";
import { getResumeUrl } from "@/lib/utils";

type SectionId = "hero" | "skills" | "experience" | "projects" | "education" | "contact";
const SECTION_IDS: SectionId[] = ["hero", "projects", "skills", "experience", "education", "contact"];

interface MobileBottomNavigationProps {
  onOpenTerminal: () => void;
  onOpenSearch: () => void;
}

/** Persistent touch navigation with an accessible secondary-actions sheet. */
export function MobileBottomNavigation({ onOpenTerminal, onOpenSearch }: MobileBottomNavigationProps) {
  const { t, lang } = useLanguage();
  const { isLightweight, manualLightweight, prefersReducedMotion, toggleLightweight } =
    useLightweightMode();
  const [active, setActive] = useState<SectionId>("hero");
  const [moreOpen, setMoreOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    let pending = 0;
    const updateActive = () => {
      pending = 0;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 30) {
        setActive("contact");
        return;
      }
      const marker = Math.min(window.innerHeight * 0.39, 350);
      let current: SectionId = "hero";
      for (const id of SECTION_IDS) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= marker) current = id;
      }
      setActive(current);
    };
    const scheduleUpdate = () => {
      if (!pending) pending = window.requestAnimationFrame(updateActive);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (pending) window.cancelAnimationFrame(pending);
    };
  }, []);

  useEffect(() => {
    const isTyping = (element: Element | null) =>
      element instanceof HTMLElement &&
      (element.matches("textarea,[contenteditable='true']") ||
        (element instanceof HTMLInputElement &&
          !["button", "checkbox", "radio", "submit", "reset", "range"].includes(element.type)));
    let timer = 0;
    const updateInput = () => {
      window.cancelAnimationFrame(timer);
      timer = window.requestAnimationFrame(() => setInputFocused(isTyping(document.activeElement)));
    };
    document.addEventListener("focusin", updateInput);
    document.addEventListener("focusout", updateInput);
    return () => {
      document.removeEventListener("focusin", updateInput);
      document.removeEventListener("focusout", updateInput);
      window.cancelAnimationFrame(timer);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (desktop.matches) setMoreOpen(false); };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback((id: SectionId) => {
    setMoreOpen(false);
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: isLightweight ? "instant" : "smooth",
      block: "start",
    });
  }, [isLightweight]);

  const doAction = (handler: () => void) => {
    setMoreOpen(false);
    window.setTimeout(handler, 180);
  };

  const tabs = [
    { id: "hero" as const, icon: Home, label: t(translations.nav.home) },
    { id: "projects" as const, icon: FolderGit2, label: t(translations.nav.projects) },
    { id: "skills" as const, icon: Code2, label: t(translations.nav.skills) },
    { id: "contact" as const, icon: Mail, label: t(translations.nav.contact) },
  ];
  const moreSelected = moreOpen || active === "education" || active === "experience";
  const actionClass =
    "flex min-h-12 w-full items-center gap-3 rounded-xl border border-border/55 bg-card/60 px-3 py-2.5 text-start text-sm text-foreground transition-colors active:scale-[0.98] hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <>
      <nav
        id="mobile-bottom-nav"
        aria-label={t(translations.nav.mobileNavLabel)}
        className={"fixed inset-x-0 bottom-0 z-40 border-t border-primary/20 bg-background/95 shadow-[0_-12px_40px_-22px_hsl(var(--primary)/0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 lg:hidden transition-[opacity,transform] duration-200" +
          (inputFocused ? " pointer-events-none translate-y-full opacity-0" : "")}
      >
        <div
          className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-2 pt-1.5"
          dir={lang === "fa" ? "rtl" : "ltr"}
          style={{ paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom, 0px))" }}
        >
          {tabs.map(({ id, icon: Icon, label }) => {
            const selected = active === id && !moreOpen;
            return (
              <button
                key={id}
                type="button"
                onClick={() => goTo(id)}
                aria-current={selected ? "location" : undefined}
                aria-label={label}
                className={"relative flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 transition-[background-color,color,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" +
                  (selected ? " bg-primary/10 text-primary" : " text-muted-foreground hover:bg-primary/5 hover:text-foreground")}
              >
                <Icon aria-hidden="true" className="h-[19px] w-[19px] shrink-0" strokeWidth={selected ? 2.4 : 1.8} />
                <span className={"max-w-full truncate text-[11px] leading-4" + (selected ? " font-bold" : " font-medium")}>
                  {label}
                </span>
                {selected && <span aria-hidden="true" className="absolute bottom-0.5 h-[3px] w-4 rounded-full bg-primary" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            aria-controls="mobile-more-sheet"
            aria-label={t(translations.nav.more)}
            aria-current={moreSelected ? "location" : undefined}
            className={"relative flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 transition-[background-color,color,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" +
              (moreSelected ? " bg-primary/10 text-primary" : " text-muted-foreground hover:bg-primary/5 hover:text-foreground")}
          >
            <Ellipsis aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={moreSelected ? 2.4 : 1.8} />
            <span className={"text-[11px] leading-4" + (moreSelected ? " font-bold" : " font-medium")}>
              {t(translations.nav.more)}
            </span>
            {moreSelected && <span aria-hidden="true" className="absolute bottom-0.5 h-[3px] w-4 rounded-full bg-primary" />}
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          id="mobile-more-sheet"
          side="bottom"
          dir={lang === "fa" ? "rtl" : "ltr"}
          className="max-h-[min(78dvh,640px)] overflow-y-auto rounded-t-[24px] border-primary/25 bg-background/95 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-5 backdrop-blur-xl lg:hidden"
        >
          <div aria-hidden="true" className="mx-auto mb-4 h-1 w-12 rounded-full bg-border" />
          <SheetHeader className="mb-4 text-start">
            <SheetTitle className="font-mono text-base">{t(translations.nav.moreTitle)}</SheetTitle>
            <SheetDescription className="text-xs">{t(translations.nav.moreDescription)}</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => goTo("education")} className={actionClass}>
              <GraduationCap aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary" />
              {t(translations.nav.education)}
            </button>
            <button type="button" onClick={() => goTo("experience")} className={actionClass}>
              <BriefcaseBusiness aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary" />
              {t(translations.nav.experience)}
            </button>
            <button type="button" onClick={() => doAction(onOpenSearch)} className={actionClass}>
              <Search aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary" />
              {t(translations.nav.search)}
            </button>
            <button type="button" onClick={() => doAction(onOpenTerminal)} className={actionClass}>
              <Terminal aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary" />
              {t(translations.nav.terminalShort)}
            </button>
            <a href={getResumeUrl()} download="Ali_Khalili_CV.pdf" onClick={() => setMoreOpen(false)} className={actionClass}>
              <FileDown aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary" />
              {t(translations.hero.downloadCv)}
            </a>
            <button
              type="button"
              onClick={() => { if (!prefersReducedMotion) toggleLightweight(); }}
              disabled={prefersReducedMotion}
              aria-pressed={manualLightweight}
              className={actionClass}
              title={prefersReducedMotion ? t(translations.nav.systemReducedMotion) : undefined}
            >
              <Zap aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary" />
              {t(translations.nav.lightweightShort)}
              <span className="ms-auto text-[10px] text-muted-foreground">
                {prefersReducedMotion ? t(translations.nav.alwaysOn) : isLightweight ? "ON" : "OFF"}
              </span>
            </button>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground">
            {t(translations.nav.moreHint)}
          </p>
        </SheetContent>
      </Sheet>
    </>
  );
}
