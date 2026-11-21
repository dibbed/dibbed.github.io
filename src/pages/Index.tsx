import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { CommandPalette } from "@/components/CommandPalette";
import { MiniTerminal } from "@/components/MiniTerminal";
import { GitHubActivity } from "@/components/GitHubActivity";
import { MatrixRain } from "@/components/MatrixRain";
import { BootSequence } from "@/components/BootSequence";
import { useKonamiCode } from "@/hooks/use-konami-code";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

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
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
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
        className="relative z-10 min-h-screen"
      >
        <Navbar onOpenTerminal={() => setTerminalOpen(true)} />
        <CommandPalette
          onOpenTerminal={() => setTerminalOpen(true)}
          onSelectProject={handleSelectProjectFromPalette}
        />
        <MiniTerminal
          open={terminalOpen}
          onOpenChange={setTerminalOpen}
          onFilterProjects={handleFilterProjectsFromMap}
        />
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
