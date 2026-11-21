
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { profile, projects } from "@/data/resume-data";
import { getResumeUrl } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Home,
  Code2,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Mail,
  Sun,
  Moon,
  FileDown,
  Copy,
  Languages,
  Terminal,
  Zap,
  ExternalLink,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTerminal?: () => void;
  onSelectProject?: (projectName: string) => void;
}

export function CommandPalette({ open, onOpenChange, onOpenTerminal, onSelectProject }: CommandPaletteProps) {
  const setOpen = onOpenChange;
  const { resolvedTheme, setTheme } = useTheme();
  const { t, toggleLang } = useLanguage();
  const { isLightweight, manualLightweight, prefersReducedMotion, toggleLightweight } = useLightweightMode();

  const navItems = [
    { label: t(translations.nav.home), href: "#hero", icon: Home },
    { label: t(translations.nav.skills), href: "#skills", icon: Code2 },
    { label: t(translations.nav.experience), href: "#experience", icon: Briefcase },
    { label: t(translations.nav.projects), href: "#projects", icon: FolderGit2 },
    { label: t(translations.nav.education), href: "#education", icon: GraduationCap },
    { label: t(translations.nav.contact), href: "#contact", icon: Mail },
  ];

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: isLightweight ? "auto" : "smooth" });
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setOpen(false);
  };

  const handleToggleLang = () => {
    toggleLang();
    setOpen(false);
  };

  const handleToggleLightweight = () => {
    if (prefersReducedMotion) return;
    const next = !manualLightweight;
    toggleLightweight();
    toast.success(
      next
        ? t(translations.commandPalette.lightweightEnabled)
        : t(translations.commandPalette.lightweightDisabled)
    );
    setOpen(false);
  };

  const handleOpenTerminal = () => {
    setOpen(false);
    onOpenTerminal?.();
  };

  const downloadCV = () => {
    setOpen(false);
    const a = document.createElement("a");
    a.href = getResumeUrl();
    a.download = "resume.pdf";
    a.click();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success(t(translations.commandPalette.emailCopied));
      setOpen(false);
    } catch {
      toast.error(t(translations.commandPalette.emailCopyFailed));
    }
  };

  const handleSelectProject = (projectName: string, repoUrl?: string) => {
    setOpen(false);
    if (onSelectProject) {
      onSelectProject(projectName);
      return;
    }
    if (repoUrl) {
      window.open(repoUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t(translations.commandPalette.dialogTitle)}
      description={t(translations.commandPalette.dialogDescription)}
    >
      <CommandInput placeholder={t(translations.commandPalette.placeholder)} />
      <CommandList>
        <CommandEmpty>{t(translations.commandPalette.empty)}</CommandEmpty>
        <CommandGroup heading={t(translations.commandPalette.navigateGroup)}>
          {navItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => scrollTo(item.href)}>
              <item.icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading={t(translations.commandPalette.projectsGroup)}>
          {projects.map((project) => (
            <CommandItem
              key={project.name}
              value={`${project.name} ${project.tech.join(" ")} ${(project.focus || []).join(" ")}`}
              onSelect={() => handleSelectProject(project.name, project.repoUrl)}
            >
              <ExternalLink className="mr-2 h-4 w-4 shrink-0 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
              <span className="truncate">{project.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading={t(translations.commandPalette.actionsGroup)}>
          {onOpenTerminal && (
            <CommandItem onSelect={handleOpenTerminal}>
              <Terminal className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
              <span>{t(translations.commandPalette.openTerminal)}</span>
              <CommandShortcut>Ctrl+`</CommandShortcut>
            </CommandItem>
          )}
          <CommandItem onSelect={toggleTheme}>
            {resolvedTheme === "dark" ? (
              <Sun className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
            ) : (
              <Moon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
            )}
            <span>{t(translations.commandPalette.toggleTheme)}</span>
          </CommandItem>
          <CommandItem onSelect={handleToggleLang}>
            <Languages className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
            <span>{t(translations.commandPalette.toggleLanguage)}</span>
          </CommandItem>
          <CommandItem onSelect={handleToggleLightweight} disabled={prefersReducedMotion}>
            <Zap className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
            <span>{prefersReducedMotion
              ? t(translations.nav.systemReducedMotion)
              : t(translations.commandPalette.toggleLightweight)}</span>
          </CommandItem>
          <CommandItem onSelect={downloadCV}>
            <FileDown className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
            <span>{t(translations.commandPalette.downloadCv)}</span>
          </CommandItem>
          <CommandItem onSelect={copyEmail}>
            <Copy className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" aria-hidden="true" />
            <span>{t(translations.commandPalette.copyEmail)}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
