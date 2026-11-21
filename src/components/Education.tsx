import { motion } from "framer-motion";
import { education } from "@/data/resume-data";
import { GraduationCap } from "lucide-react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";
import { translations } from "@/i18n/translations";

export function Education() {
  const { t, lang } = useLanguage();
  const { isLightweight } = useLightweightMode();

  return (
    <section id="education" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={isLightweight ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center font-mono text-3xl font-bold"
        >
          {t(translations.sections.education)}
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((ed, i) => (
            <motion.div
              key={ed.degree}
              initial={isLightweight ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <SpotlightCard className="h-full p-5">
                <div className="mb-2 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <h3 className="font-mono text-base font-semibold text-foreground">
                    {lang === "fa" && ed.degreeFa ? ed.degreeFa : ed.degree}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === "fa" && ed.institutionFa ? ed.institutionFa : ed.institution}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {lang === "fa" && ed.periodFa ? ed.periodFa : ed.period}
                </p>
                {(lang === "fa" && ed.focusFa ? ed.focusFa : ed.focus) && (
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    {lang === "fa" && ed.focusFa ? ed.focusFa : ed.focus}
                  </p>
                )}
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
