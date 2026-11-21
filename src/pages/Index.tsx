import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { GitHubActivity } from "@/components/GitHubActivity";
import { MatrixRain } from "@/components/MatrixRain";
import { BootSequence } from "@/components/BootSequence";
import { useKonamiCode } from "@/hooks/use-konami-code";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { projectAnchor } from "@/lib/project-links";
import { projects } from "@/data/resume-data";

// Command UIs and their dependencies are loaded only on first use.
const CommandPalette = lazy(() => import("@/components/CommandPalette").then((m) => ({ default: m.CommandPalette })));
const MiniTerminal = lazy(() => import("@/components/MiniTerminal").then((m) => ({ default: m.MiniTerminal })));

const BOOT_STORAGE_KEY = "portfolio-boot-seen";

function hasSeenBoot(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(BOOT_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

const Index = () => {
  const { isLightweight } = useLightweightMode();
  const { t } = useLanguage();
  const [matrixActive, setMatrixActive] = useState(false);
  const [booted, setBooted] = useState<boolean>(() => isLightweight || hasSeenBoot());
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [projectSearch, setProjectSearch] = useState<string>("");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalLoaded, setTerminalLoaded] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);

  const openTerminal = useCallback(() => {
    setTerminalLoaded(true);
    setTerminalOpen(true);
  }, []);
  const openPalette = useCallback(() => {
    setPaletteLoaded(true);
    setPaletteOpen(true);
  }, []);

  const handleBootComplete = useCallback(() => {
    try {
      window.sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
    } catch {
      // Ignore storage errors.
    }
    setBooted(true);
  }, []);

  useEffect(() => {
    if (isLightweight && !booted) {
      handleBootComplete();
    }
  }, [isLightweight, booted, handleBootComplete]);

  useEffect(() => {
    if (!booted || !window.location.hash.startsWith("#project-")) return;
    const anchor = decodeURIComponent(window.location.hash.slice(1));
    if (!projects.some((project) => projectAnchor(project.name) === anchor)) return;
    // Let React mount its cards, then restore the anchored view after the intro.
    const frame = window.requestAnimationFrame(() =>
      document.getElementById(anchor)?.scrollIntoView({ behavior: "auto", block: "start" })
    );
    return () => window.cancelAnimationFrame(frame);
  }, [booted]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteLoaded(true);
        setPaletteOpen((current) => !current);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setTerminalLoaded(true);
        setTerminalOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const triggerMatrix = useCallback(() => {
    if (isLightweight) return;
    setMatrixActive(true);
    setTimeout(() => setMatrixActive(false), 5500);
  }, [isLightweight]);

  useKonamiCode(triggerMatrix);

  const handleFilterProjectsFromMap = useCallback((area: string) => {
    setProjectFilter(area);
    setProjectSearch("");
  }, []);

  const handleSelectProjectFromPalette = useCallback(
    (projectName: string) => {
      setProjectFilter("All");
      setProjectSearch(projectName);
      document
        .querySelector("#projects")
        ?.scrollIntoView({ behavior: isLightweight ? "auto" : "smooth" });
    },
    [isLightweight]
  );

  return (
    <>
      <AnimatePresence>
        {!booted && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      <a
        href="#main-content"
        className="sr-only fixed left-4 top-3 z-[110] rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only"
      >
        {t(translations.nav.skipToContent)}
      </a>

      {/* No opaque bg-background here so OrbitalVoid canvas stays visible behind sections */}
      <motion.div
        initial={isLightweight ? false : { opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: isLightweight ? 0 : 0.45 }}
        className="relative z-10 min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom,0px))] lg:pb-0"
      >
        <Navbar onOpenTerminal={openTerminal} onOpenCommandPalette={openPalette} />
        <MobileBottomNavigation
          onOpenTerminal={openTerminal}
          onOpenSearch={openPalette}
        />
        <Suspense fallback={null}>
          {paletteLoaded && (
            <CommandPalette
              open={paletteOpen}
              onOpenChange={setPaletteOpen}
              onOpenTerminal={openTerminal}
              onSelectProject={handleSelectProjectFromPalette}
            />
          )}
          {terminalLoaded && (
            <MiniTerminal
              open={terminalOpen}
              onOpenChange={setTerminalOpen}
              onFilterProjects={handleFilterProjectsFromMap}
            />
          )}
        </Suspense>
        <MatrixRain active={matrixActive} />
        <main id="main-content" tabIndex={-1} className="relative">
          <Hero />
          <GitHubActivity />
          <Skills onFilterProjects={handleFilterProjectsFromMap} />
          <Experience />
          <Projects
            activeFilter={projectFilter}
            onFilterChange={setProjectFilter}
            searchQuery={projectSearch}
            onSearchChange={setProjectSearch}
          />
          <Education />
          <Contact />
        </main>
      </motion.div>
    </>
  );
};

export default Index;
