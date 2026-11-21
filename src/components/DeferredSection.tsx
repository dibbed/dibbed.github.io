import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface DeferredSectionProps {
  id: string;
  label: string;
  minHeight: number;
  children: ReactNode;
  rootMargin?: string;
}

function targetsSection(id: string): boolean {
  if (typeof window === "undefined") return false;
  const hash = decodeURIComponent(window.location.hash.slice(1));
  return hash === id || (id === "projects" && hash.startsWith("project-"));
}

/**
 * Keep below-the-fold chunks out of the critical loading path.
 * The placeholder remains a keyboard-accessible anchor, while IntersectionObserver,
 * direct hashes and a bounded idle fallback ensure the real content is available.
 */
export function DeferredSection({ id, label, minHeight, children, rootMargin = "1500px 0px" }: DeferredSectionProps) {
  const { lang } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(() =>
    typeof window === "undefined" || !("IntersectionObserver" in window) || targetsSection(id)
  );

  useEffect(() => {
    if (loaded) return;
    const host = hostRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setLoaded(true);
    }, { rootMargin });
    if (host) observer.observe(host);

    // Allow non-scrolling users, screen readers and crawlers to reach the full DOM.
    const timer = window.setTimeout(() => setLoaded(true), 6000);
    const onHashChange = () => { if (targetsSection(id)) setLoaded(true); };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [id, loaded, rootMargin]);

  // If a project anchor is requested directly, wait for its lazy chunk before scrolling.
  useEffect(() => {
    if (!loaded || !targetsSection(id) || !hostRef.current) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const scrollToTarget = () => {
      const target = document.getElementById(hash);
      if (!target || target.hasAttribute("data-deferred-placeholder")) return false;
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return true;
    };
    if (scrollToTarget()) return;
    const observer = new MutationObserver(() => {
      if (scrollToTarget()) observer.disconnect();
    });
    observer.observe(hostRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [id, loaded]);

  const placeholder = (
    <section
      id={id}
      data-deferred-placeholder=""
      aria-label={label}
      style={{ minHeight }}
      className="flex flex-col items-center justify-center gap-3 px-4 py-16"
    >
      <p className="font-mono text-sm text-muted-foreground">
        {lang === "fa" ? `در حال آماده سازی ${label}` : `Loading ${label}`}
      </p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="min-h-11 rounded-lg border border-primary/40 px-4 py-2 font-mono text-xs text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {lang === "fa" ? "نمایش بخش" : "Show section"}
      </button>
    </section>
  );

  return (
    <div ref={hostRef} data-deferred-section={id} className="relative">
      {loaded ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  );
}
