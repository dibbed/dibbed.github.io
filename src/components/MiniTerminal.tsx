import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { profile, projects, skills } from "@/data/resume-data";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";

interface TerminalEntry {
  command?: string;
  lines: string[];
}

interface MiniTerminalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterProjects?: (area: string) => void;
}

const QUICK_COMMANDS = ["help", "whoami", "projects", "skills", "contact"];

export function MiniTerminal({ open, onOpenChange, onFilterProjects }: MiniTerminalProps) {
  const { t, toggleLang, lang } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { isLightweight, toggleLightweight } = useLightweightMode();

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { lines: [t(translations.terminal.welcome)] },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const execute = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setHistory((prev) => [trimmed, ...prev.slice(0, 29)]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const arg = args.join(" ");
    const lower = cmd.toLowerCase();

    if (lower === "clear") {
      setEntries([]);
      return;
    }

    if (lower === "exit" || lower === "quit") {
      onOpenChange(false);
      return;
    }

    let lines: string[] = [];

    switch (lower) {
      case "help":
        lines = [
          "Available commands:",
          "  whoami              — profile summary",
          "  projects [area]     — list projects (e.g. projects backend, projects ai)",
          "  skills              — list technical skill categories",
          "  contact             — GitHub, Telegram, Email",
          "  theme               — toggle light / dark theme",
          "  lang                — switch English / Persian",
          "  lightweight         — toggle lightweight visual mode",
          "  clear | exit        — clear screen or close terminal",
        ];
        break;
      case "whoami":
        lines = [
          `${profile.name} — ${profile.title}`,
          `Location: ${profile.location}`,
          profile.summary,
        ];
        break;
      case "projects": {
        const filterQuery = arg.toLowerCase();
        const matches = filterQuery
          ? projects.filter(
              (p) =>
                p.name.toLowerCase().includes(filterQuery) ||
                (p.focus ?? []).some((f) => f.toLowerCase().includes(filterQuery)) ||
                p.tech.some((tc) => tc.toLowerCase().includes(filterQuery))
            )
          : projects;

        if (matches.length === 0) {
          lines = [`No projects matched "${arg}". Try: projects backend`];
        } else {
          lines = matches.map(
            (p) => `• ${p.name} [${(p.focus ?? []).join(", ")}] -> ${p.repoUrl}`
          );
          if (filterQuery && onFilterProjects) {
            const matchedArea = ["Backend", "Automation", "DevOps", "AI/ML", "Frontend", "Psychology"].find(
              (a) => a.toLowerCase().includes(filterQuery)
            );
            if (matchedArea) {
              onFilterProjects(matchedArea);
              lines.push(`(Applied "${matchedArea}" filter to Projects section)`);
            }
          }
        }
        break;
      }
      case "skills":
        lines = skills.map(
          (cat) => `${cat.category}: ${cat.items.map((item) => item.name).join(", ")}`
        );
        break;
      case "contact":
        lines = [
          `GitHub:   https://${profile.github}`,
          `Telegram: https://${profile.telegram}`,
          `Email:    ${profile.email}`,
        ];
        break;
      case "theme": {
        const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        lines = [`Switched theme to ${nextTheme}.`];
        break;
      }
      case "lang":
        toggleLang();
        lines = [`Switched language to ${lang === "en" ? "fa" : "en"}.`];
        break;
      case "lightweight":
        toggleLightweight();
        lines = [`Lightweight mode is now ${!isLightweight ? "ON" : "OFF"}.`];
        break;
      default:
        lines = [`Command not found: ${cmd}. Type "help" to see available commands.`];
    }

    setEntries((prev) => [...prev, { command: trimmed, lines }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIdx);
      setInput(history[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/60 bg-slate-950 p-0 text-slate-100 shadow-2xl">
        <DialogHeader className="border-b border-slate-800 px-4 py-3 text-left" dir="ltr">
          <DialogTitle className="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            {t(translations.terminal.title)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t(translations.terminal.description)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5 border-b border-slate-800/80 px-4 py-2" dir="ltr">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => execute(cmd)}
              className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[11px] text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
            >
              {cmd}
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="h-72 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
          dir="ltr"
        >
          {entries.map((entry, idx) => (
            <div key={idx} className="mb-3">
              {entry.command && (
                <div className="text-emerald-400">
                  <span className="select-none text-slate-500">dibbed@portfolio:~$ </span>
                  {entry.command}
                </div>
              )}
              {entry.lines.map((line, li) => (
                <div key={li} className="whitespace-pre-wrap break-words text-slate-300">
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-slate-800 px-4 py-2.5 font-mono text-xs"
          dir="ltr"
        >
          <span className="select-none text-emerald-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(translations.terminal.placeholder)}
            aria-label={t(translations.terminal.placeholder)}
            className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
