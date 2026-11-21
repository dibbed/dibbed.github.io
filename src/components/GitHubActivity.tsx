import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useLanguage } from "@/i18n/use-language";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";
import { translations, type Lang } from "@/i18n/translations";

interface GitHubEvent {
  repo: string;
  repoUrl: string;
  message: string;
  date: string;
}

interface RawGitHubEvent {
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: {
    ref?: string;
    head?: string;
    commits?: Array<{ message?: string }>;
  };
}

interface RawGitHubRepo {
  full_name?: string;
  html_url?: string;
  description?: string | null;
  pushed_at?: string;
  fork?: boolean;
}

function relativeTime(dateStr: string, lang: Lang, now: number): string {
  const seconds = Math.max(0, Math.floor((now - new Date(dateStr).getTime()) / 1000));
  if (lang === "fa") {
    if (seconds < 60) return "همین الان";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    return `${Math.floor(seconds / 86400)} روز پیش`;
  }
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [sourceMode, setSourceMode] = useState<"events" | "repos">("events");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(() => Date.now());
  const { t, lang } = useLanguage();
  const { isLightweight } = useLightweightMode();

  const fetchActivity = useCallback(async (signal?: AbortSignal, isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const response = await fetch(
        "https://api.github.com/users/dibbed/events/public?per_page=50",
        { signal }
      );
      if (response.ok) {
        const data: unknown = await response.json();
        if (Array.isArray(data)) {
          const parsed: GitHubEvent[] = (data as RawGitHubEvent[])
            .filter((event) => event.type === "PushEvent" && event.repo?.name && event.created_at)
            .sort(
              (a, b) =>
                new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
            )
            .slice(0, 5)
            .map((event) => {
              const repoName = event.repo!.name!;
              const rawMsg =
                event.payload?.commits?.[0]?.message ||
                `Push to ${String(event.payload?.ref || "branch").replace("refs/heads/", "")} (${String(event.payload?.head || "").slice(0, 7)})`;
              return {
                repo: repoName,
                repoUrl: `https://github.com/${repoName}`,
                message: rawMsg.split("\n")[0].slice(0, 70),
                date: event.created_at!,
              };
            });

          if (parsed.length > 0) {
            setEvents(parsed);
            setSourceMode("events");
            return;
          }
        }
      }

      // Live fallback to recently pushed public repositories (GitHub Events API only keeps 90 days).
      const reposRes = await fetch(
        "https://api.github.com/users/dibbed/repos?sort=pushed&per_page=5",
        { signal }
      );
      if (reposRes.ok) {
        const reposData: unknown = await reposRes.json();
        if (Array.isArray(reposData)) {
          const parsedRepos: GitHubEvent[] = (reposData as RawGitHubRepo[])
            .filter((r) => r.full_name && r.pushed_at)
            .slice(0, 5)
            .map((r) => ({
              repo: r.full_name!,
              repoUrl: r.html_url || `https://github.com/${r.full_name}`,
              message: (r.description || "Updated repository").slice(0, 70),
              date: r.pushed_at!,
            }));
          if (parsedRepos.length > 0) {
            setEvents(parsedRepos);
            setSourceMode("repos");
          }
        }
      }
    } catch {
      // Never render fabricated fallback activity.
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchActivity(controller.signal);

    // Periodic refresh every 5 minutes when tab is visible.
    const pollInterval = setInterval(() => {
      if (!document.hidden) {
        void fetchActivity(controller.signal);
      }
    }, 5 * 60_000);

    return () => {
      controller.abort();
      clearInterval(pollInterval);
    };
  }, [fetchActivity]);

  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const displayEvents = useMemo(
    () => events.map((event) => ({ ...event, time: relativeTime(event.date, lang, tick) })),
    [events, tick, lang]
  );

  return (
    <motion.div
      id="github-activity"
      className="scroll-mt-24 mx-auto mt-16 max-w-2xl px-4"
      initial={isLightweight ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <SpotlightCard className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              {t(translations.activity.header)}
            </span>
            {sourceMode === "repos" && displayEvents.length > 0 && (
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                · {t(translations.activity.recentReposFallback)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void fetchActivity(undefined, true)}
            disabled={refreshing}
            aria-label={t(translations.activity.refreshLabel)}
            title={t(translations.activity.refreshLabel)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="font-mono text-[11px] text-muted-foreground animate-pulse">
            {t(translations.activity.scanning)}
          </div>
        ) : displayEvents.length === 0 ? (
          <a
            href="https://github.com/dibbed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded font-mono text-xs text-muted-foreground underline underline-offset-2 hover:text-primary"
          >
            {t(translations.activity.unavailable)}
          </a>
        ) : (
          <div className="space-y-1.5" dir="ltr">
            {displayEvents.map((event, index) => (
              <div
                key={`${event.repo}-${event.date}-${index}`}
                className="flex items-start gap-2 text-left font-mono text-[11px] text-muted-foreground"
              >
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                <a
                  href={event.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center rounded px-1 font-medium text-primary hover:underline"
                >
                  {event.repo}
                </a>
                <span className="flex-1 truncate opacity-80">— {event.message}</span>
                <span className="shrink-0 text-muted-foreground/75">[{event.time}]</span>
              </div>
            ))}
          </div>
        )}
      </SpotlightCard>
    </motion.div>
  );
}
