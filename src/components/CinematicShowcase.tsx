import { useRef, useState } from "react";
import {
  motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, BrainCircuit, ChevronRight, GitBranch, ShieldCheck, TerminalSquare } from "lucide-react";
import { caseStudies, caseStudyUrl, type CaseStudy } from "@/data/case-studies";
import { useLanguage } from "@/i18n/use-language";
import { useCinematicMotion } from "@/hooks/use-cinematic-motion";
import { ScrollStage } from "@/components/ScrollStage";

const ICONS = [TerminalSquare, ShieldCheck, BrainCircuit];

function StoryCard({
  study, index, progress, active, onSelect,
}: {
  study: CaseStudy;
  index: number;
  progress: MotionValue<number>;
  active: boolean;
  onSelect: (index: number) => void;
}) {
  const { lang } = useLanguage();
  const Icon = ICONS[index];
  const offset = useTransform(progress, (p) => index - p * 2);
  const x = useTransform(offset, (distance) => distance * 335);
  const z = useTransform(offset, (distance) => -Math.abs(distance) * 230);
  const rotateY = useTransform(offset, (distance) => -distance * 24);
  const rotateX = useTransform(offset, (distance) => Math.abs(distance) * 3.5);
  const scale = useTransform(offset, (distance) => 1 - Math.abs(distance) * 0.14);
  const opacity = useTransform(offset, (distance) => Math.max(0.28, 1 - Math.abs(distance) * 0.38));
  const zIndex = useTransform(offset, (distance) => Math.round(20 - Math.abs(distance) * 9));

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.article
        data-depth-card={study.slug}
        data-active={active}
        aria-hidden={!active}
        onClick={!active ? () => onSelect(index) : undefined}
        style={{ x, z, rotateY, rotateX, scale, opacity, zIndex, transformPerspective: 1150, transformStyle: "preserve-3d" }}
        className={"pointer-events-auto relative flex " + (!active ? "cursor-pointer " : "") + "h-[min(460px,62dvh)] w-[min(440px,44vw)] min-w-[350px] flex-col justify-between overflow-hidden rounded-[28px] border border-primary/30 bg-gradient-to-br from-card via-card to-emerald-950/15 p-7 shadow-[0_36px_100px_-45px_rgba(1,14,13,0.85)] ring-1 ring-white/5 dark:from-[#0b121b] dark:via-[#0b141c] dark:to-[#09221e]"}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-primary/15 bg-primary/5 shadow-[0_0_100px_20px_rgba(16,185,129,0.09)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/35 bg-primary/10 text-primary">
            <Icon className="h-7 w-7" aria-hidden="true" strokeWidth={1.5} />
          </div>
          <div className="text-end font-mono text-xs tracking-[0.17em] text-primary" dir="ltr">
            <div>{String(index + 1).padStart(2, "0")} / 03</div>
            <div className="mt-2 text-[10px] text-muted-foreground">ENGINEERING / SYSTEMS</div>
          </div>
        </div>
        <div className="relative mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-primary">{study.category[lang]}</p>
          <h3 className="mt-3 font-mono text-[clamp(1.5rem,2.25vw,2.15rem)] font-bold tracking-tight text-foreground" dir="ltr">
            {study.projectName}
          </h3>
          <p className="mt-3 text-base font-semibold leading-7 text-foreground/95">{study.headline[lang]}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
            {study.deck[lang]}
          </p>
        </div>
        <div className="relative mt-6 border-t border-primary/20 pt-5">
          <div className="mb-4 flex flex-wrap gap-2" dir="ltr">
            {study.tech.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-md border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{tech}</span>
            ))}
          </div>
          <Link
            to={caseStudyUrl(study.slug)}
            tabIndex={active ? 0 : -1}
            onClick={(event) => {
              if (!active) {
                event.preventDefault();
                onSelect(index);
              }
            }}
            className="inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-primary/45 bg-primary/15 px-4 font-mono text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {lang === "fa" ? "دیدن معماری و شواهد" : "Explore architecture & evidence"}
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </motion.article>
    </div>
  );
}

function AccessibleCard({ study, index }: { study: CaseStudy; index: number }) {
  const { lang } = useLanguage();
  const Icon = ICONS[index];
  return (
    <ScrollStage>
      <article className="relative min-w-0 overflow-hidden rounded-2xl border border-primary/25 bg-card/85 p-5 shadow-lg sm:p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-mono text-xs text-primary" dir="ltr">0{index + 1} / 03</span>
        </div>
        <h3 className="relative mt-5 font-mono text-xl font-bold" dir="ltr">{study.projectName}</h3>
        <p className="relative mt-3 text-sm font-medium leading-7">{study.headline[lang]}</p>
        <p className="relative mt-2 text-xs leading-6 text-muted-foreground">{study.deck[lang]}</p>
        <Link to={caseStudyUrl(study.slug)} className="relative mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-lg bg-primary/10 px-4 font-mono text-xs font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {lang === "fa" ? "بررسی نمونه‌کار" : "Open case study"}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </article>
    </ScrollStage>
  );
}

/**
 * A native-scroll 3D chapter sequence:
 * - desktop fine-pointer: sticky perspective stage, scroll-scrubbed card carousel
 * - mobile / reduced motion / lightweight: normal document-flow cards
 * No Three.js/WebGL, wheel hijacking, heavy textures, layout thrash or scroll snapping.
 */
export function CinematicShowcase() {
  const { lang } = useLanguage();
  const { depthEnabled } = useCinematicMotion();
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 105, damping: 30, mass: 0.4 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.max(0, Math.min(2, Math.round(value * 2)));
    setActive((previous) => previous === next ? previous : next);
  });

  const jumpTo = (index: number) => {
    if (!target.current) return;
    const top = target.current.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, target.current.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + (range * index) / 2, behavior: "smooth" });
  };

  const stageHeading = lang === "fa" ? "سه سیستم. سه مسئله واقعی." : "Three systems. Real engineering decisions.";
  const stageSubline = depthEnabled
    ? (lang === "fa"
      ? "با اسکرول از میان پروژه‌ها عبور کن؛ هر مرحله معماری و شواهد قابل بررسی داره."
      : "Scroll through three flagship systems. Every story opens into real architecture, decisions and source evidence.")
    : (lang === "fa"
      ? "سه پروژه منتخب همراه با معماری، تصمیم‌های فنی و شواهد واقعی."
      : "Three flagship projects with inspectable architecture, technical decisions and source evidence.");

  return (
    <section
      ref={target}
      id="depth-showcase"
      data-cinematic-mode={depthEnabled ? "3d" : "accessible"}
      aria-label={lang === "fa" ? "نمایش پروژه‌های سه‌بعدی" : "Immersive project showcase"}
      className={depthEnabled ? "relative h-[225vh]" : "relative px-4 py-16 sm:py-20"}
    >
      {depthEnabled ? (
        <div className="sticky top-16 flex h-[calc(100dvh-4rem)] min-h-[540px] w-full flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="depth-stage-grid absolute inset-x-[-25%] bottom-[-46%] h-[85%] opacity-70" />
            <div className="absolute left-1/2 top-[48%] h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 shadow-[0_0_150px_-25px_rgba(16,185,129,0.12)]" />
            <div className="absolute left-1/2 top-[48%] h-[630px] w-[630px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
            <div className="absolute inset-x-0 top-[50%] h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-6xl items-start justify-between gap-7 px-8 pt-7">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.23em] text-primary">
                {lang === "fa" ? "فصل‌های مهندسی / ۰۱ تا ۰۳" : "ENGINEERING STORIES / 01—03"}
              </p>
              <h2 className="mt-3 max-w-xl text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{stageHeading}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{stageSubline}</p>
            </div>
            <div className="shrink-0 pt-5 text-end font-mono text-[10px] tracking-widest text-muted-foreground" dir="ltr">
              <span className="block text-xl font-bold text-primary">0{active + 1}<span className="text-sm text-muted-foreground"> / 03</span></span>
              <span className="mt-2 flex items-center justify-end gap-1.5"><ArrowDown className="h-3.5 w-3.5" /> {lang === "fa" ? "برای دیدن بعدی اسکرول کن" : "SCROLL TO EXPLORE"}</span>
            </div>
          </div>

          <div className="pointer-events-none relative min-h-0 flex-1 overflow-hidden" style={{ perspective: "1200px", perspectiveOrigin: "50% 47%" }}>
            {caseStudies.map((study, index) => (
              <StoryCard key={study.slug} study={study} index={index} progress={progress} active={active === index} onSelect={jumpTo} />
            ))}
          </div>

          <div className="relative z-20 mx-auto mb-10 flex max-w-full items-center gap-3 rounded-full border border-border/60 bg-background/85 px-5 py-3 shadow-lg backdrop-blur-xl" role="group" aria-label={lang === "fa" ? "انتخاب فصل پروژه" : "Select a project chapter"}>
            {caseStudies.map((study, index) => (
              <button
                key={study.slug}
                type="button"
                onClick={() => jumpTo(index)}
                aria-label={(lang === "fa" ? "نمایش " : "Show ") + study.projectName}
                aria-pressed={active === index}
                className={"flex min-h-8 items-center gap-2 rounded-full px-3 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
                  (active === index ? "bg-primary/15 font-bold text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground")}
              >
                <span className="tabular-nums">0{index + 1}</span>
                {active === index && <span className="hidden sm:inline">{study.projectName}</span>}
              </button>
            ))}
            <ChevronRight className="h-4 w-4 text-primary/65 rtl:rotate-180" aria-hidden="true" />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
            {lang === "fa" ? "پروژه‌های شاخص / ۰۱ تا ۰۳" : "FLAGSHIP PROJECTS / 01—03"}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{stageHeading}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{stageSubline}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {caseStudies.map((study, index) => <AccessibleCard key={study.slug} study={study} index={index} />)}
          </div>
        </div>
      )}
    </section>
  );
}
