import { motion } from "framer-motion";
import { experiences } from "@/data/resume-data";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45 } },
};

export function Experience() {
  const { t, lang } = useLanguage();

  return (
    <section id="experience" className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center font-mono text-3xl font-bold"
        >
          {t(translations.sections.experience)}
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-0 hidden h-full w-px bg-border md:block rtl:left-auto rtl:right-4"
          />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp.title}
                variants={item}
                className="relative md:pl-12 rtl:md:pl-0 rtl:md:pr-12"
              >
                {/* Timeline dot */}
                <div
                  aria-hidden="true"
                  className="absolute left-2.5 top-6 hidden h-3 w-3 rounded-full border-2 border-primary bg-background md:block rtl:left-auto rtl:right-2.5"
                />

                <SpotlightCard>
                  <div className="space-y-4 p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-mono text-base font-semibold text-foreground">
                        {lang === "fa" && exp.titleFa ? exp.titleFa : exp.title}
                      </h3>
                      <span className="font-mono text-xs text-muted-foreground">
                        {lang === "fa" && exp.periodFa ? exp.periodFa : exp.period}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {lang === "fa" && exp.roleFa ? exp.roleFa : exp.role} — {exp.company}
                    </p>

                    <ul className="space-y-2">
                      {(lang === "fa" && exp.bulletsFa ? exp.bulletsFa : exp.bullets).map((b, bi) => (
                        <li key={bi} className="flex gap-2 text-sm text-muted-foreground">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {exp.metrics && (
                      <div className="ltr-content flex flex-wrap gap-2">
                        {exp.metrics.map((m) => (
                          <Badge key={m} variant="outline" className="border-primary/30 font-mono text-[10px] text-primary">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="ltr-content flex flex-wrap gap-1.5">
                      {exp.tech.map((tc) => (
                        <Badge key={tc} variant="secondary" className="font-mono text-[10px]">
                          {tc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
