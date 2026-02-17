import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { AnimatePresence, motion } from "framer-motion";
import { getResumeUrl } from "@/lib/utils";
import { Command, FileDown, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, toggleLang, lang } = useLanguage();

  const navLinks = [
    { label: t(translations.nav.home), href: "#hero" },
    { label: t(translations.nav.skills), href: "#skills" },
    { label: t(translations.nav.experience), href: "#experience" },
    { label: t(translations.nav.projects), href: "#projects" },
    { label: t(translations.nav.education), href: "#education" },
    { label: t(translations.nav.contact), href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={() => scrollTo("#hero")} className="font-mono text-lg font-bold tracking-wider text-foreground">
          AliKhalili<span className="text-primary">.</span>
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <button key={l.href} onClick={() => scrollTo(l.href)} className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary">
              {l.label}
            </button>
          ))}
          <Button variant="ghost" size="icon" onClick={openCommandPalette} title="Command Palette (⌘K)">
            <Command className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={getResumeUrl()} download title="Download CV">
              <FileDown className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLang}
            title={lang === "en" ? "فارسی" : "English"}
            className="relative"
          >
            <Languages className="h-4 w-4" />
            <span className="absolute -bottom-0.5 -right-0.5 font-mono text-[8px] font-bold text-primary">
              {lang === "en" ? "FA" : "EN"}
            </span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleLang}>
            <Languages className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/30 bg-background/80 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              {navLinks.map((l) => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="py-2 text-left font-mono text-sm text-muted-foreground transition-colors hover:text-primary rtl:text-right">
                  {l.label}
                </button>
              ))}
              <a href={getResumeUrl()} download className="flex items-center gap-2 py-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary">
                <FileDown className="h-4 w-4" /> {t(translations.hero.downloadCv)}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
