import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { Hero } from "@/components/Hero";
import { HiringTrail } from "@/components/HiringTrail";
import { DeferredSection } from "@/components/DeferredSection";
import { CinematicShowcase } from "@/components/CinematicShowcase";
import { ScrollStage } from "@/components/ScrollStage";
import { ScrollProgress } from "@/components/ScrollProgress";
import { MatrixRain } from "@/components/MatrixRain";
import { BootSequence } from "@/components/BootSequence";
import { useKonamiCode } from "@/hooks/use-konami-code";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";
import { useLanguage } from "@/i18n/use-language";
import { translations } from "@/i18n/translations";
import { projectAnchor } from "@/lib/project-links";
import { projects } from "@/data/resume-data";
import { shouldSkipIntro } from "@/lib/mobile-ux";
import { navigateToPortfolioSection } from "@/lib/portfolio-navigation";

// Command UIs and their dependencies are loaded only on first use.
const CommandPalette = lazy(() => import("@/components/CommandPalette").then((m) => ({ default: m.CommandPalette })));
const MiniTerminal = lazy(() => import("@/components/MiniTerminal").then((m) => ({ default: m.MiniTerminal })));
// Independent below-the-fold sections do not compete with the hero on first load.
const Projects = lazy(() => import("@/components/Projects").then((m) => ({ default: m.Projects })));
const Skills = lazy(() => import("@/components/Skills").then((m) => ({ default: m.Skills })));
const Experience = lazy(() => import("@/components/Experience").then((m) => ({ default: m.Experience })));
const GitHubActivity = lazy(() => import("@/components/GitHubActivity").then((m) => ({ default: m.GitHubActivity })));
const Education = lazy(() => import("@/components/Education").then((m) => ({ default: m.Education })));
const Contact = lazy(() => import("@/components/Contact").then((m) => ({ default: m.Contact })));

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
  const [booted, setBooted] = useState<boolean>(() => shouldSkipIntro(isLightweight, hasSeenBoot()));
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
    if (!booted) return;
    const scrollToHash = () => {
      if (!window.location.hash.startsWith("#")) return;
      const anchor = decodeURIComponent(window.location.hash.slice(1));
      const sections = ["hero", "for-teams", "projects", "skills", "experience", "github-activity", "education", "contact"];
      const sharedProject = projects.some((project) => projectAnchor(project.name) === anchor);
      if (!sections.includes(anchor) && !sharedProject) return;
      navigateToPortfolioSection(anchor, "auto");
    };
    // Direct links must hydrate all preceding chunks before final positioning.
    const frame = window.requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToHash);
    };
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
      navigateToPortfolioSection("projects", isLightweight ? "auto" : "smooth");
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
        <ScrollProgress />
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
          <CinematicShowcase />
          <ScrollStage><HiringTrail /></ScrollStage>
          <DeferredSection id="projects" label="Projects" minHeight={1700} rootMargin="1800px 0px">
            <ScrollStage>
              <Projects
                activeFilter={projectFilter}
                onFilterChange={setProjectFilter}
                searchQuery={projectSearch}
                onSearchChange={setProjectSearch}
              />
            </ScrollStage>
          </DeferredSection>
          <DeferredSection id="skills" label="Technical Skills" minHeight={1100}>
            <ScrollStage><Skills onFilterProjects={handleFilterProjectsFromMap} /></ScrollStage>
          </DeferredSection>
          <DeferredSection id="experience" label="Experience" minHeight={800}>
            <ScrollStage><Experience /></ScrollStage>
          </DeferredSection>
          <DeferredSection id="github-activity" label="GitHub activity" minHeight={500}>
            <ScrollStage><GitHubActivity /></ScrollStage>
          </DeferredSection>
          <DeferredSection id="education" label="Education" minHeight={440}>
            <ScrollStage><Education /></ScrollStage>
          </DeferredSection>
          <DeferredSection id="contact" label="Contact" minHeight={420}>
            <ScrollStage><Contact /></ScrollStage>
          </DeferredSection>
        </main>
      </motion.div>
    </>
  );
};

export default Index;
