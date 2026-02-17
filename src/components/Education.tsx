import { motion } from "framer-motion";
import { education } from "@/data/resume-data";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export function Education() {
  const { t, lang } = useLanguage();

  return (
    <section id="education" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <CardTitle className="font-mono text-base">
                      {lang === "fa" && ed.degreeFa ? ed.degreeFa : ed.degree}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {lang === "fa" && ed.institutionFa ? ed.institutionFa : ed.institution}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">{ed.period}</p>
                  {(lang === "fa" && ed.focusFa ? ed.focusFa : ed.focus) && (
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      {lang === "fa" && ed.focusFa ? ed.focusFa : ed.focus}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
