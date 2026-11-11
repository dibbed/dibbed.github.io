import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

interface GitHubEvent {
  repo: string;
  message: string;
  date: string;
}

function relativeTime(dateStr: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/users/dibbed/events/public?per_page=50", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub activity unavailable");
        return response.json();
      })
      .then((data: unknown) => {
        if (!Array.isArray(data)) throw new Error("Invalid GitHub response");
        const parsed: GitHubEvent[] = data
          .filter((event) => event.type === "PushEvent" && event.repo?.name && event.created_at)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((event) => ({
            repo: event.repo.name,
            message: String(event.payload?.commits?.[0]?.message || `Push to ${String(event.payload?.ref || "branch").replace("refs/heads/", "")} (${String(event.payload?.head || "").slice(0, 7)})`)
              .split("\n")[0].slice(0, 70),
            date: event.created_at,
          }));
        setEvents(parsed);
      })
      .catch(() => { /* Never render fabricated fallback activity. */ })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick((value) => value + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const displayEvents = useMemo(
    () => events.map((event) => ({ ...event, time: relativeTime(event.date) })),
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
        ) : displayEvents.length === 0 ? (
          <a href="https://github.com/dibbed" target="_blank" rel="noopener noreferrer"
            className="font-mono text-[11px] text-muted-foreground underline underline-offset-2 hover:text-primary">
            {lang === "fa" ? "فعالیت عمومی در دسترس نیست؛ مشاهده GitHub" : "Public activity unavailable. View GitHub profile."}
          </a>
        ) : (
          <div className="space-y-1.5" dir="ltr">
            {displayEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground text-left">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <span className="text-primary/90 shrink-0">{event.repo}</span>
                <span className="truncate flex-1 opacity-70">— {event.message}</span>
                <span className="shrink-0 text-muted-foreground/50">[{event.time}]</span>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </motion.div>
  );
}
