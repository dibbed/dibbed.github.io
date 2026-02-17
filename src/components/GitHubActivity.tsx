import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

interface GitHubEvent {
  repo: string;
  message: string;
  date: string; // ISO 8601
}

const mockEvents: GitHubEvent[] = [
  { repo: "dibbed/kurigram", message: "fix: Add missing ChatPrivileges import", date: "2025-11-11T17:58:30Z" },
  { repo: "dibbed/TTSKit-multi-engine-tts", message: "fix: correct issues in api.md", date: "2025-09-26T10:00:00Z" },
  { repo: "dibbed/dibbed", message: "docs: Update README.md", date: "2025-09-25T08:00:00Z" },
  { repo: "dibbed/nginx-ssl-auto", message: "docs: Add Persian version of README", date: "2025-09-16T12:00:00Z" },
  { repo: "dibbed/iranconcert_scanner", message: "feat: Playwright-based seat auto-scanner for iranconcert.com", date: "2025-09-13T15:00:00Z" },
];

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>(mockEvents);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("https://api.github.com/users/dibbed/events/public")
      .then((r) => {
        if (!r.ok) throw new Error("rate limited");
        return r.json();
      })
      .then((data: any[]) => {
        const parsed: GitHubEvent[] = data
          .filter((e) => e.type === "PushEvent" && e.payload?.commits?.length)
          .slice(0, 5)
          .map((e) => ({
            repo: e.repo.name,
            message: e.payload.commits[0].message.split("\n")[0].slice(0, 60),
            date: e.created_at,
          }));
        if (parsed.length > 0) setEvents(parsed);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Recompute relative times every minute
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const displayEvents = useMemo(
    () => events.map((ev) => ({ ...ev, time: relativeTime(ev.date) })),
    [events, tick]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-16 max-w-2xl px-4"
    >
      <SpotlightCard className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {t(translations.activity.header)}
          </span>
        </div>

        {loading ? (
          <div className="font-mono text-[11px] text-muted-foreground animate-pulse">
            {t(translations.activity.scanning)}
          </div>
        ) : (
          <div className="space-y-1.5" dir="ltr">
            {displayEvents.map((ev, i) => (
              <div key={i} className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground text-left">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <span className="text-primary/90 shrink-0">{ev.repo}</span>
                <span className="truncate flex-1 opacity-70">— {ev.message}</span>
                <span className="shrink-0 text-muted-foreground/50">[{ev.time}]</span>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </motion.div>
  );
}
