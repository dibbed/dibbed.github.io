import { motion } from "framer-motion";
import { Github, ArrowUpRight, Mail, ChevronDown, FileDown } from "lucide-react";
import { profile, achievements } from "@/data/resume-data";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/TypewriterText";
import { CountUp } from "@/components/CountUp";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { getResumeUrl } from "@/lib/utils";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function Hero() {
  const { t } = useLanguage();
  const { isLightweight } = useLightweightMode();

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      {/* Ambient glowing orbs (disabled in lightweight / reduced-motion mode) */}
      {!isLightweight && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-orb-pulse absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
          <div className="animate-orb-pulse-delayed absolute left-1/3 top-2/3 h-[350px] w-[350px] rounded-full bg-accent/15 blur-[120px]" />
          <div className="animate-orb-pulse absolute right-1/4 top-1/4 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[100px]" />
        </div>
      )}

      <motion.div
        variants={container}
        initial={isLightweight ? false : "hidden"}
        animate="show"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div variants={fadeUp} className="mb-4 inline-block rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5">
          <span className="font-mono text-xs font-medium tracking-widest text-primary">
            {t(translations.hero.badge)}
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="mb-4 font-mono text-5xl font-bold tracking-tight sm:text-7xl" dir="ltr">
          {isLightweight ? profile.name : <TypewriterText text={profile.name} />}
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          {t(translations.hero.subtitle)}
        </motion.p>

        {/* Stats */}
        <motion.div variants={fadeUp} className="mb-10 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8">
          {achievements.slice(0, 4).map((a) => (
            <div key={a.label} className="text-center">
              <div className="font-mono text-3xl font-bold tabular-nums text-foreground">
                {isLightweight ? a.value : <CountUp value={a.value} />}
              </div>
              <div className="text-xs text-muted-foreground">
                {translations.achievements[a.label]
                  ? t(translations.achievements[a.label])
                  : a.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Employer-first: links to real evidence, code and contact. */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3" dir="ltr">
          <Button asChild className="min-h-11 gap-2 font-mono text-xs sm:text-sm">
            <a href="#projects">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              {t(translations.hero.exploreWork)}
            </a>
          </Button>
          <Button asChild variant="outline" className="min-h-11 gap-2 border-border/60 bg-card/50 font-mono text-xs backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 sm:text-sm">
            <a href={getResumeUrl()} download>
              <FileDown className="h-4 w-4" aria-hidden="true" />
              {t(translations.hero.downloadCv)}
            </a>
          </Button>
          <Button variant="outline" asChild className="min-h-11 gap-2 border-border/60 bg-card/50 font-mono text-xs backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 sm:text-sm">
            <a href={"https://" + profile.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" aria-hidden="true" /> GitHub
            </a>
          </Button>
          <Button variant="outline" asChild className="min-h-11 gap-2 border-border/60 bg-card/50 font-mono text-xs backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 sm:text-sm">
            <a href={"mailto:" + profile.email}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {t(translations.hero.contactMe)}
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={isLightweight ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 lg:bottom-8"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {t(translations.hero.scroll)}
        </span>
        <ChevronDown className="h-4 w-4 animate-scroll-bounce text-muted-foreground" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
