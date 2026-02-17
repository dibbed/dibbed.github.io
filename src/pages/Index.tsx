import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { CommandPalette } from "@/components/CommandPalette";
import { GitHubActivity } from "@/components/GitHubActivity";
import { MatrixRain } from "@/components/MatrixRain";
import { BootSequence } from "@/components/BootSequence";
import { useKonamiCode } from "@/hooks/use-konami-code";

const Index = () => {
  const [matrixActive, setMatrixActive] = useState(false);
  const [booted, setBooted] = useState(false);

  const triggerMatrix = useCallback(() => {
    setMatrixActive(true);
    setTimeout(() => setMatrixActive(false), 5500);
  }, []);

  useKonamiCode(triggerMatrix);

  return (
    <>
      <AnimatePresence>{!booted && <BootSequence onComplete={() => setBooted(true)} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-background"
      >
        <Navbar />
        <CommandPalette />
        <MatrixRain active={matrixActive} />
        <main className="relative">
          <Hero />
          <GitHubActivity />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </main>
      </motion.div>
    </>
  );
};

export default Index;
