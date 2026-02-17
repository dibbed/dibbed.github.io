import { motion } from "framer-motion";
import { Github, Send, Mail, Globe, MapPin } from "lucide-react";
import { profile } from "@/data/resume-data";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const links = [
  { icon: Github, label: "GitHub", href: `https://${profile.github}` },
  { icon: Send, label: "Telegram", href: `https://${profile.telegram}` },
  { icon: Mail, label: "Email", href: `mailto:${profile.email}` },
];

export function Contact() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="border-t border-border/40 px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-6 font-mono text-3xl font-bold"
        >
          {t(translations.sections.getInTouch)}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap items-center justify-center gap-6" dir="ltr"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-2 text-sm text-muted-foreground"
        >
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-3 w-3" />
            <span>{t(translations.contact.languages)}</span>
          </div>
          <div className="mt-4 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 font-mono text-xs text-primary">
            {t(translations.contact.available)}
          </div>
        </motion.div>

        <p className="mt-12 font-mono text-xs text-muted-foreground/50">
          {t({
            en: translations.contact.copyright.en(new Date().getFullYear()),
            fa: translations.contact.copyright.fa(new Date().getFullYear()),
          })}
        </p>
      </div>
    </footer>
  );
}
