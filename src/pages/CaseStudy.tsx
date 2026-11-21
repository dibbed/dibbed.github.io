import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Braces, CheckCircle2,
  Code2, ExternalLink, FileCheck2, FileDown, GitBranch, Github, Languages,
  Layers3, Mail, Moon, Scale, ShieldCheck, Sun, TestTubeDiagonal,
} from "lucide-react";
import { caseStudies, caseStudyForSlug, caseStudyUrl, evidenceUrl, type CaseStudy, type Localized } from "@/data/case-studies";
import { useLanguage } from "@/i18n/use-language";
import { getResumeUrl } from "@/lib/utils";
import { profile } from "@/data/resume-data";
import NotFound from "@/pages/NotFound";
import { ScrollStage } from "@/components/ScrollStage";
import { ScrollProgress } from "@/components/ScrollProgress";

function EvidenceIcon({ kind }: { kind: CaseStudy["evidence"][number]["kind"] }) {
  if (kind === "test") return <TestTubeDiagonal className="h-4 w-4" aria-hidden="true" />;
  if (kind === "workflow") return <GitBranch className="h-4 w-4" aria-hidden="true" />;
  if (kind === "rights") return <Scale className="h-4 w-4" aria-hidden="true" />;
  if (kind === "audit") return <FileCheck2 className="h-4 w-4" aria-hidden="true" />;
  return <Layers3 className="h-4 w-4" aria-hidden="true" />;
}

function CaseStudyContent({ item }: { item: CaseStudy }) {
  const { lang, toggleLang } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const isFa = lang === "fa";
  const t = (value: Localized) => value[lang];
  const currentIndex = caseStudies.findIndex((entry) => entry.slug === item.slug);
  const next = caseStudies[(currentIndex + 1) % caseStudies.length];
  const repoUrl = "https://github.com/dibbed/" + item.repo;
  const labels = useMemo(() => ({
    back: isFa ? "بازگشت به نمونه‌کارها" : "Back to work",
    overview: isFa ? "خلاصه" : "Overview",
    architecture: isFa ? "مسیر سیستم" : "System flow",
    decisions: isFa ? "تصمیم‌های فنی" : "Engineering decisions",
    evidence: isFa ? "شواهد قابل بررسی" : "Inspect the evidence",
    constraint: isFa ? "محدودیت‌ها و دامنه ادعا" : "What this does not claim",
    challenge: isFa ? "مسئله چه بود؟" : "The problem",
    solution: isFa ? "چه چیزی ساخته شد؟" : "The implementation",
    result: isFa ? "حاصل کار" : "What the repository shows",
    tradeoff: isFa ? "ملاحظه و هزینه تصمیم" : "The trade-off",
    source: isFa ? "مشاهده پیاده‌سازی" : "Read implementation",
    repo: isFa ? "مشاهده سورس" : "Inspect source",
    cv: isFa ? "رزومه" : "Resume",
    contact: isFa ? "گفت‌وگو درباره همکاری" : "Discuss working together",
    next: isFa ? "نمونه‌کار بعدی" : "Next case study",
    snapshot: isFa ? "منابع بررسی‌شده" : "Source-backed",
    inspect: isFa ? "باز کردن سند در گیت‌هاب" : "Open on GitHub",
  }), [isFa]);

  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    document.title = item.projectName + " | Case Study | Ali Khalili";
    if (meta) meta.setAttribute("content", item.deck[lang]);
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null && previousDescription !== undefined) {
        meta.setAttribute("content", previousDescription);
      }
    };
  }, [item, lang]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = window.location.hash.slice(1);
      if (target.startsWith("case-") && document.getElementById(target)) {
        document.getElementById(target)?.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [item.slug]);

  return (
    <div className="relative z-10 min-h-screen bg-background/40 text-foreground">
      <ScrollProgress />
      <a href="#case-content" className="sr-only fixed left-4 top-2 z-[110] rounded-md bg-primary p-3 font-semibold text-primary-foreground focus:not-sr-only">
        {isFa ? "رفتن به محتوای اصلی" : "Skip to main content"}
      </a>

      <header className="sticky top-0 z-30 border-b border-border/55 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6" aria-label={isFa ? "ناوبری نمونه‌کار" : "Case study navigation"}>
          <Link to="/#projects" className="inline-flex min-h-11 items-center gap-2 rounded-lg font-mono text-xs font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm">
            {isFa ? <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />}
            <span>{labels.back}</span>
          </Link>
          <div className="flex items-center gap-1">
            <a href={getResumeUrl()} download="Ali_Khalili_CV.pdf" className="hidden min-h-10 items-center gap-2 rounded-lg px-3 font-mono text-xs text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex">
              <FileDown className="h-4 w-4" aria-hidden="true" />{labels.cv}
            </a>
            <button type="button" onClick={toggleLang} aria-label={isFa ? "Switch to English" : "تغییر زبان به فارسی"} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Languages className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label={isFa ? "تغییر تم" : "Toggle theme"} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {resolvedTheme === "dark" ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <main id="case-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="pt-10 sm:pt-16">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-primary">
            <span className="rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5">{t(item.category)}</span>
            <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-muted-foreground">{labels.snapshot}</span>
          </div>
          <p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground" dir="ltr">
            CASE STUDY / {String(currentIndex + 1).padStart(2, "0")} OF 03
          </p>
          <p className="mt-4 font-mono text-sm font-semibold text-primary" dir="ltr">{item.projectName}</p>
          <h1 className="mt-4 max-w-4xl font-mono text-[clamp(1.8rem,5vw,3.5rem)] font-bold leading-[1.28] tracking-tight">
            {t(item.headline)}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {t(item.deck)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-mono text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <Github className="h-4 w-4" aria-hidden="true" />{labels.repo}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#case-evidence" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border/70 bg-card/70 px-5 font-mono text-xs font-semibold text-foreground hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <BookOpen className="h-4 w-4" aria-hidden="true" />{labels.evidence}
            </a>
            <a href={"mailto:" + profile.email} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 font-mono text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Mail className="h-4 w-4" aria-hidden="true" />{labels.contact}
            </a>
          </div>
        </div>

        <div className="mt-11 grid gap-3 sm:grid-cols-3">
          {item.stats.map((stat) => (
            <div key={stat.value} className="min-w-0 rounded-xl border border-border/60 bg-card/65 px-5 py-5">
              <p className="font-mono text-3xl font-bold text-primary" dir="ltr">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{t(stat.label)}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(stat.detail)}</p>
            </div>
          ))}
        </div>

        <ScrollStage>
        <section aria-labelledby="challenge-heading" className="mt-20 grid gap-5 lg:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-border/65 bg-card/65 p-6 sm:p-8">
            <span className="font-mono text-xs text-primary">01 / WHY</span>
            <h2 id="challenge-heading" className="mt-4 text-2xl font-bold">{labels.challenge}</h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">{t(item.challenge)}</p>
          </div>
          <div className="min-w-0 rounded-2xl border border-primary/25 bg-primary/5 p-6 sm:p-8">
            <span className="font-mono text-xs text-primary">02 / HOW</span>
            <h2 className="mt-4 text-2xl font-bold">{labels.solution}</h2>
            <p className="mt-4 text-sm leading-8 text-foreground/85 sm:text-base">{t(item.implementation)}</p>
          </div>
        </section>

        </ScrollStage>
        <ScrollStage>
        <section className="mt-10 rounded-2xl border border-border/65 bg-card/45 p-6 sm:p-8" aria-label={labels.result}>
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            <h2 className="text-lg font-bold">{labels.result}</h2>
          </div>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">{t(item.outcome)}</p>
          <div className="mt-5 flex flex-wrap gap-2" dir="ltr">
            {item.tech.map((tech) => (
              <span key={tech} className="rounded-md border border-border/70 bg-background/65 px-3 py-1.5 font-mono text-[11px] text-foreground">{tech}</span>
            ))}
          </div>
        </section>

        </ScrollStage>
        <ScrollStage>
        <section id="case-architecture" className="mt-20 scroll-mt-24" aria-labelledby="architecture-heading">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <Braces className="h-5 w-5" aria-hidden="true" />
            <h2 id="architecture-heading" className="text-2xl font-bold text-foreground">{labels.architecture}</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-5" dir={isFa ? "rtl" : "ltr"}>
            {item.flow.map((node, index) => (
              <div key={index} className="relative min-w-0 rounded-xl border border-primary/25 bg-card/70 p-4">
                <div className="flex items-center justify-between font-mono text-xs text-primary">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{t(node.name)}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{t(node.role)}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {isFa ? "نمای مفهومی مسیر سیستم بر اساس مستندات، نه مانیتورینگ زنده." : "Conceptual system flow based on source documentation, not a live trace."}
          </p>
        </section>

        </ScrollStage>
        <ScrollStage>
        <section id="case-decisions" className="mt-20 scroll-mt-24" aria-labelledby="decisions-heading">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <Code2 className="h-5 w-5" aria-hidden="true" />
            <h2 id="decisions-heading" className="text-2xl font-bold text-foreground">{labels.decisions}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {item.decisions.map((decision, index) => (
              <article key={index} className="flex min-w-0 flex-col rounded-xl border border-border/65 bg-card/65 p-5 sm:p-6">
                <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-bold">{t(decision.title)}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/90">{t(decision.choice)}</p>
                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="mb-2 text-xs font-semibold text-primary">{labels.tradeoff}</p>
                  <p className="text-xs leading-7 text-muted-foreground">{t(decision.tradeoff)}</p>
                </div>
                <a href={evidenceUrl(item, decision.source)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-xs font-semibold text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />{labels.source}
                </a>
              </article>
            ))}
          </div>
        </section>

        </ScrollStage>
        <ScrollStage>
        <section id="case-evidence" className="mt-20 scroll-mt-24" aria-labelledby="evidence-heading">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <FileCheck2 className="h-5 w-5" aria-hidden="true" />
            <h2 id="evidence-heading" className="text-2xl font-bold text-foreground">{labels.evidence}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {item.evidence.map((entry) => (
              <a key={entry.path} href={evidenceUrl(item, entry.path)} target="_blank" rel="noopener noreferrer" className="group flex min-h-28 items-start gap-3 rounded-xl border border-border/65 bg-card/65 p-5 transition-colors hover:border-primary/55 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <EvidenceIcon kind={entry.kind} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{t(entry.label)}</span>
                  <span className="mt-1 block text-xs leading-6 text-muted-foreground">{t(entry.description)}</span>
                  <span className="mt-2 block break-all font-mono text-[10px] text-primary" dir="ltr">{entry.path}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        </ScrollStage>
        <ScrollStage>
        <section className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-7" aria-label={labels.constraint}>
          <div className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-base font-bold">{labels.constraint}</h2>
          </div>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">{t(item.honestLimit)}</p>
          <p className="mt-4 border-t border-border/50 pt-3 text-xs leading-6 text-muted-foreground">{t(item.scopeNote)}</p>
          <a
            href={"https://github.com/dibbed/" + item.repo + "/tree/" + item.sourceCommit}
            target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-10 items-center gap-2 font-mono text-xs font-medium text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            dir="ltr"
          >
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            Reviewed source commit: {item.sourceCommit.slice(0, 7)}
          </a>
        </section>

        </ScrollStage>
        <div className="mt-16 flex flex-col gap-5 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-lg">
            <p className="font-mono text-xs text-primary">{isFa ? "برای همکاری فنی" : "FOR ENGINEERING TEAMS"}</p>
            <h2 className="mt-2 text-xl font-bold">{isFa ? "بیایید درباره مسئله واقعی صحبت کنیم." : "Have a problem worth solving?"}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {isFa ? "سورس و تصمیم‌های مهندسی بالا قابل بررسی‌اند. برای گفت‌وگو درباره پروژه یا همکاری پیام بده." : "Review the source and design choices above, then get in touch to discuss an engineering project."}
            </p>
          </div>
          <a href={"mailto:" + profile.email} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-mono text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Mail className="h-4 w-4" aria-hidden="true" />{labels.contact}
          </a>
        </div>

        <Link to={caseStudyUrl(next.slug)} className="mt-8 flex min-h-20 items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/55 px-5 py-4 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span>
            <span className="block font-mono text-[11px] text-muted-foreground">{labels.next}</span>
            <span className="mt-1 block text-lg font-semibold text-foreground" dir="ltr">{next.projectName}</span>
          </span>
          {isFa ? <ArrowLeft className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> : <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
        </Link>
      </main>
      <footer className="border-t border-border/50 py-7 text-center font-mono text-xs text-muted-foreground">
        <Link to="/" className="text-primary underline underline-offset-4">{labels.back}</Link>
        <span className="mx-2">·</span> Ali Khalili © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default function CaseStudyPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const item = caseStudyForSlug(slug);
  if (!item) return <NotFound />;
  return <CaseStudyContent key={item.slug} item={item} />;
}
