import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/use-language";
import { translations } from "@/i18n/translations";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";
import { getResumeUrl } from "@/lib/utils";
import { Command, FileDown, Languages, Moon, Search, Sun, Terminal, Zap } from "lucide-react";
import { useTheme } from "next-themes";

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenTerminal?: () => void;
}

export function Navbar({ onOpenTerminal, onOpenCommandPalette }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t, toggleLang, lang } = useLanguage();
  const { isLightweight, manualLightweight, prefersReducedMotion, toggleLightweight } = useLightweightMode();

  const navLinks = [
    { label: t(translations.nav.home), href: "#hero" },
    { label: t(translations.nav.projects), href: "#projects" },
    { label: t(translations.nav.skills), href: "#skills" },
    { label: t(translations.nav.experience), href: "#experience" },
    { label: t(translations.nav.education), href: "#education" },
    { label: t(translations.nav.contact), href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: isLightweight ? "auto" : "smooth" });
  };

  const openCommandPalette = onOpenCommandPalette;

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
                download="Ali_Khalili_CV.pdf"
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

        {/* Compact mobile header; touch navigation lives at the bottom. */}
        <div className="flex items-center gap-1 lg:hidden">
          <Button variant="ghost" size="icon" onClick={openCommandPalette}
            aria-label={t(translations.nav.search)} className="h-11 w-11">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLang}
            aria-label={t(translations.nav.switchLangLabel)}
            className="relative h-11 w-11"
          >
            <Languages className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -bottom-0.5 -right-0.5 font-mono text-[8px] font-bold text-primary">
              {lang === "en" ? "FA" : "EN"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleColorTheme}
            aria-label={t(translations.nav.toggleThemeLabel)}
            className="h-11 w-11"
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

    </nav>
  );
}
