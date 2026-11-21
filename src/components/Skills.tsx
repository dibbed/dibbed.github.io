import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/resume-data";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";
import { translations } from "@/i18n/translations";

const SkillRadarChart = lazy(() => import("@/components/RadarChart"));

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const bentoClasses = [
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-1 lg:col-span-2",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-2 lg:col-span-2",
];

interface SkillsProps {
  onFilterProjects?: (area: string) => void;
}

export function Skills({ onFilterProjects }: SkillsProps) {
  const { t, lang } = useLanguage();
  const radarRef = useRef<HTMLDivElement>(null);
  const [radarVisible, setRadarVisible] = useState(false);

  useEffect(() => {
    const container = radarRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      setRadarVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRadarVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "280px 0px" });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  const { isLightweight } = useLightweightMode();

  return (
    <section id="skills" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={isLightweight ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center font-mono text-3xl font-bold"
        >
          {t(translations.sections.technicalSkills)}
        </motion.h2>

        {/* Lazy-loaded interactive project focus map */}
        <motion.div
          initial={isLightweight ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          ref={radarRef}
          className="mx-auto mb-8 max-w-4xl"
        >
          <Suspense
            fallback={
              <div className="h-[420px] w-full rounded-lg border border-border/50 bg-card/50 animate-pulse" role="status" aria-label={lang === "fa" ? "در حال بارگذاری نمودار" : "Loading focus chart"} />
            }
          >
            {radarVisible ? (
              <SkillRadarChart onFilterProjects={onFilterProjects} />
            ) : (
              <div className="h-[420px] w-full rounded-lg border border-border/50 bg-card/50" aria-hidden="true" />
            )}
          </Suspense>
        </motion.div>

        <motion.div
          variants={container}
          initial={isLightweight ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {skills.map((cat, ci) => (
            <motion.div key={cat.category} variants={item} className={bentoClasses[ci] || ""}>
              <SpotlightCard className="h-full p-5">
                <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                  {lang === "fa" ? cat.categoryFa : cat.category}
                </h3>
                <div className="ltr-content flex flex-wrap gap-1.5">
                  {cat.items.map((sk) => (
                    <Badge
                      key={sk.name}
                      variant={sk.level === "Expert" ? "default" : "secondary"}
                      className="font-mono text-[10px]"
                    >
                      {sk.name}
                      {sk.level && (
                        <span className="ml-1.5 text-[9px] opacity-70">• {sk.level}</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
