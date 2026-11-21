/**
 * Centralizes programmatic scrolling across sections that hydrate lazily.
 *
 * An early scrollIntoView on a deferred placeholder can land thousands of
 * pixels away after earlier sections mount and change document height.
 * Mount preceding sections first; then scroll once their geometry settles.
 */
export const PREPARE_SECTION_NAVIGATION = "portfolio:prepare-navigation";

export const DEFERRED_SECTION_ORDER = [
  "projects", "skills", "experience", "github-activity", "education", "contact",
] as const;

function sectionOf(anchor: string): string {
  return anchor.startsWith("project-") ? "projects" : anchor;
}

export function mustPrepareSection(section: string, destination: string): boolean {
  const target = DEFERRED_SECTION_ORDER.indexOf(
    sectionOf(destination) as (typeof DEFERRED_SECTION_ORDER)[number],
  );
  const source = DEFERRED_SECTION_ORDER.indexOf(
    section as (typeof DEFERRED_SECTION_ORDER)[number],
  );
  return target >= 0 && source >= 0 && source <= target;
}

/** CSS scroll-behavior: smooth overrides scrollIntoView(behavior: auto).
 * Temporarily remove it for immediate long-distance jumps. */
function scrollToTarget(target: HTMLElement, requested: ScrollBehavior): void {
  const far = Math.abs(target.getBoundingClientRect().top) > window.innerHeight * 1.5;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (requested === "smooth" && !far && !reducedMotion) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  if (target.id === "contact") {
    // The last section cannot always align to 96px on a tall phone.
    // Showing its full content above the safe-area nav is more useful.
    window.scrollTo({ top: root.scrollHeight, behavior: "auto" });
  } else {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }
  root.style.scrollBehavior = previous;
}

/** Re-anchor after late API content (for example GitHub activity) changes page height.
 * Never fight user-initiated wheel, touch, pointer, or keyboard navigation. */
function correctLateLayout(anchor: string, token: number): void {
  let canceled = false;
  const stop = () => { canceled = true; };
  const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  events.forEach((name) => window.addEventListener(name, stop, { once: true, passive: true }));
  const correct = () => {
    if (canceled || token !== currentNavigation) return;
    const target = document.getElementById(anchor);
    if (!target) return;
    if (anchor === "contact") {
      const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (remaining > 12) scrollToTarget(target, "auto");
      return;
    }
    const margin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    const offset = target.getBoundingClientRect().top - margin;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (Math.abs(offset) > 32 && window.scrollY + offset < maxScroll) {
      scrollToTarget(target, "auto");
    }
  };
  const timeouts = [250, 650, 1350].map((delay) => window.setTimeout(correct, delay));
  window.setTimeout(() => {
    timeouts.forEach(window.clearTimeout);
    events.forEach((name) => window.removeEventListener(name, stop));
  }, 1500);
}

let currentNavigation = 0;

export function navigateToPortfolioSection(
  anchor: string,
  requestedBehavior: ScrollBehavior = "auto",
): void {
  if (typeof window === "undefined") return;
  const token = ++currentNavigation;
  const destination = sectionOf(anchor);
  const index = DEFERRED_SECTION_ORDER.indexOf(
    destination as (typeof DEFERRED_SECTION_ORDER)[number],
  );

  if (index < 0) {
    const target = document.getElementById(anchor);
    if (target) scrollToTarget(target, requestedBehavior);
    return;
  }

  window.dispatchEvent(new CustomEvent(PREPARE_SECTION_NAVIGATION, { detail: destination }));
  const requiredIds = DEFERRED_SECTION_ORDER.slice(0, index + 1);
  const started = performance.now();
  let previousHeight = -1;
  let stableFrames = 0;

  const tick = () => {
    if (token !== currentNavigation) return;
    const target = document.getElementById(anchor);
    const ready = !!target && requiredIds.every((id) => {
      const host = document.querySelector<HTMLElement>(`[data-deferred-section="${id}"]`);
      return host && !host.querySelector("[data-deferred-placeholder]");
    });
    const height = document.documentElement.scrollHeight;

    if (ready && height === previousHeight) stableFrames++;
    else stableFrames = 0;
    previousHeight = height;

    if ((ready && stableFrames >= 2) || performance.now() - started > 6500) {
      if (!target) return;
      scrollToTarget(target, requestedBehavior);
      correctLateLayout(anchor, token);
      return;
    }
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}
