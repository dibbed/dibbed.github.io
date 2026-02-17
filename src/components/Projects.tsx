import { motion } from "framer-motion";
import { projects } from "@/data/resume-data";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/SpotlightCard";
import { ArchitectureModal } from "@/components/ArchitectureModal";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Projects() {
  const { t, lang } = useLanguage();

  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center font-mono text-3xl font-bold"
        >
          {t(translations.sections.projects)}
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <motion.div key={p.name} variants={item}>
              <SpotlightCard className="h-full">
                <div className="p-5 space-y-3">
                  <h3 className="font-mono text-sm font-semibold text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "fa" && p.descriptionFa ? p.descriptionFa : p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 ltr-content">
                    {p.tech.map((tc) => (
                      <Badge key={tc} variant="secondary" className="font-mono text-[10px]">
                        {tc}
                      </Badge>
                    ))}
                  </div>
                  {p.architecture && (
                    <ArchitectureModal data={p.architecture} projectName={p.name} />
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
