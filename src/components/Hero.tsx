import { motion } from "framer-motion";
import { Github, Send, Mail, ChevronDown, FileDown } from "lucide-react";
import { profile, achievements } from "@/data/resume-data";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/TypewriterText";
import { CountUp } from "@/components/CountUp";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { getResumeUrl } from "@/lib/utils";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      {/* Glowing orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-orb-pulse absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="animate-orb-pulse-delayed absolute left-1/3 top-2/3 h-[350px] w-[350px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="animate-orb-pulse absolute right-1/4 top-1/4 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div variants={fadeUp} className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
          <span className="font-mono text-xs tracking-widest text-primary">{t(translations.hero.badge)}</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="mb-4 font-mono text-5xl font-bold tracking-tight sm:text-7xl" dir="ltr">
          <TypewriterText text={profile.name} />
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          {t(translations.hero.subtitle)}
        </motion.p>

        {/* Stats */}
        <motion.div variants={fadeUp} className="mb-10 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8">
          {achievements.slice(0, 4).map((a) => (
            <div key={a.label} className="text-center">
              <div className="font-mono text-3xl font-bold text-foreground">
                <CountUp value={a.value} />
              </div>
              <div className="text-xs text-muted-foreground">
                {translations.achievements[a.label]
                  ? t(translations.achievements[a.label])
                  : a.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Links */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3" dir="ltr">
          <Button variant="outline" asChild className="gap-2 font-mono border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5">
            <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </Button>
          <Button variant="outline" asChild className="gap-2 font-mono border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5">
            <a href={`https://${profile.telegram}`} target="_blank" rel="noopener noreferrer">
              <Send className="h-4 w-4" /> Telegram
            </a>
          </Button>
          <Button variant="outline" asChild className="gap-2 font-mono border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5">
            <a href={`mailto:${profile.email}`}>
              <Mail className="h-4 w-4" /> Email
            </a>
          </Button>
          <Button asChild className="gap-2 font-mono">
            <a href={getResumeUrl()} download>
              <FileDown className="h-4 w-4" /> {t(translations.hero.downloadCv)}
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t(translations.hero.scroll)}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground animate-scroll-bounce" />
      </motion.div>
    </section>
  );
}
