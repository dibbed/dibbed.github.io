import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";
import { AnimatePresence, motion } from "framer-motion";
import { getResumeUrl } from "@/lib/utils";
import { Command, FileDown, Languages, Menu, Moon, Sun, Terminal, X, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

interface NavbarProps {
  onOpenTerminal?: () => void;
}

export function Navbar({ onOpenTerminal }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, toggleLang, lang } = useLanguage();
  const { isLightweight, manualLightweight, prefersReducedMotion, toggleLightweight } = useLightweightMode();

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
    el?.scrollIntoView({ behavior: isLightweight ? "auto" : "smooth" });
  };

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  const toggleColorTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav
      aria-label={t(translations.nav.primaryNav)}
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          className="font-mono text-lg font-bold tracking-wider text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          dir="ltr"
        >
          AliKhalili<span className="text-primary">.</span>
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-5">
          {navLinks.map((l) => (
            <button
              type="button"
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {l.label}
            </button>
          ))}

          <div className="flex items-center gap-1 border-l border-border/50 pl-3 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={openCommandPalette}
              title={`${t(translations.nav.commandPaletteLabel)} (Ctrl/⌘ K)`}
              aria-label={t(translations.nav.commandPaletteLabel)}
            >
              <Command className="h-4 w-4" aria-hidden="true" />
            </Button>

            {onOpenTerminal && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenTerminal}
                title={`${t(translations.nav.terminalLabel)} (Ctrl+\`)`}
                aria-label={t(translations.nav.terminalLabel)}
              >
                <Terminal className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}

            <Button variant="ghost" size="icon" asChild>
              <a
                href={getResumeUrl()}
                download
                title={t(translations.nav.downloadCvLabel)}
                aria-label={t(translations.nav.downloadCvLabel)}
              >
                <FileDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLightweight}
              disabled={prefersReducedMotion}
              aria-pressed={manualLightweight}
              title={prefersReducedMotion ? t(translations.nav.systemReducedMotion) :
                isLightweight
                  ? t(translations.nav.lightweightOnLabel)
                  : t(translations.nav.lightweightOffLabel)
              }
              aria-label={prefersReducedMotion ? t(translations.nav.systemReducedMotion) :
                isLightweight
                  ? t(translations.nav.lightweightOnLabel)
                  : t(translations.nav.lightweightOffLabel)
              }
              className={isLightweight ? "text-primary" : ""}
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLang}
              title={lang === "en" ? "فارسی" : "English"}
              aria-label={t(translations.nav.switchLangLabel)}
              className="relative"
            >
              <Languages className="h-4 w-4" aria-hidden="true" />
              <span className="absolute -bottom-0.5 -right-0.5 font-mono text-[8px] font-bold text-primary">
                {lang === "en" ? "FA" : "EN"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleColorTheme}
              title={t(translations.nav.toggleThemeLabel)}
              aria-label={t(translations.nav.toggleThemeLabel)}
            >
              <Sun
                className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                aria-hidden="true"
              />
              <Moon
                className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLang}
            aria-label={t(translations.nav.switchLangLabel)}
            className="relative"
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            <span className="absolute -bottom-0.5 -right-0.5 font-mono text-[8px] font-bold text-primary">
              {lang === "en" ? "FA" : "EN"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleColorTheme}
            aria-label={t(translations.nav.toggleThemeLabel)}
          >
            <Sun
              className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              aria-hidden="true"
            />
            <Moon
              className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-portfolio-menu"
            aria-label={t(translations.nav.toggleMenuLabel)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-portfolio-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/30 bg-background/90 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              {navLinks.map((l) => (
                <button
                  type="button"
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="py-2 text-left font-mono text-sm text-muted-foreground transition-colors hover:text-primary rtl:text-right"
                >
                  {l.label}
                </button>
              ))}
              <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-border/40 pt-3">
                <a
                  href={getResumeUrl()}
                  download
                  className="inline-flex items-center gap-2 py-1 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <FileDown className="h-4 w-4" aria-hidden="true" /> {t(translations.hero.downloadCv)}
                </a>
                {onOpenTerminal && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenTerminal();
                    }}
                    className="inline-flex items-center gap-2 py-1 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Terminal className="h-4 w-4" aria-hidden="true" /> {t(translations.nav.terminalShort)}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    toggleLightweight();
                    setMobileOpen(false);
                  }}
                  disabled={prefersReducedMotion}
                  className={`inline-flex items-center gap-2 py-1 font-mono text-sm transition-colors hover:text-primary ${
                    isLightweight ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  <Zap className="h-4 w-4" aria-hidden="true" /> {t(translations.nav.lightweightShort)}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
