import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/i18n/use-language";
import { mustPrepareSection, PREPARE_SECTION_NAVIGATION } from "@/lib/portfolio-navigation";

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
    const idleDelay = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches
      ? 18000 : 6000;
    const timer = window.setTimeout(() => setLoaded(true), idleDelay);
    const onHashChange = () => { if (targetsSection(id)) setLoaded(true); };
    const onPrepare = (event: Event) => {
      if (mustPrepareSection(id, (event as CustomEvent<string>).detail)) setLoaded(true);
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener(PREPARE_SECTION_NAVIGATION, onPrepare);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener(PREPARE_SECTION_NAVIGATION, onPrepare);
    };
  }, [id, loaded, rootMargin]);

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
