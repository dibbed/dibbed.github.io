import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, FileCheck2, Mail } from "lucide-react";
import { caseStudies, caseStudyUrl } from "@/data/case-studies";
import { profile } from "@/data/resume-data";
import { useLanguage } from "@/i18n/use-language";

/** A three-step, evidence-first path for a hiring manager. No fictional client claims. */
export function HiringTrail() {
  const { lang } = useLanguage();
  const fa = lang === "fa";
  return (
    <section id="for-teams" className="scroll-mt-24 px-4 pt-10 sm:pt-12" aria-label={fa ? "مسیر بررسی برای کارفرما" : "For engineering teams"}>
      <div className="mx-auto max-w-5xl rounded-2xl border border-primary/30 bg-card/65 p-4 lg:hidden">
        <p className="font-mono text-xs font-semibold text-primary">
          {fa ? "برای تیم‌های فنی" : "FOR ENGINEERING TEAMS"}
        </p>
        <p className="mt-2 text-sm leading-7 text-foreground">
          {fa ? "تصمیم‌های واقعی و تست‌ها را مستقیماً در سورس بررسی کن." : "Inspect real architecture and tests, not unsupported claims."}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link to={caseStudyUrl(caseStudies[0].slug)}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-primary px-3 text-center text-xs font-bold text-primary-foreground">
            {fa ? "شواهد فنی" : "View evidence"} <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a href={"mailto:" + profile.email}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-primary/40 px-3 text-center text-xs font-bold text-primary">
            <Mail className="h-4 w-4" />{fa ? "تماس" : "Contact"}
          </a>
        </div>
      </div>
      <div className="mx-auto hidden max-w-5xl rounded-2xl border border-primary/25 bg-card/60 p-5 shadow-[0_12px_55px_-42px_hsl(var(--primary)/0.5)] backdrop-blur-sm sm:p-7 lg:block">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-medium text-primary">{fa ? "// برای تیم‌های فنی" : "// FOR ENGINEERING TEAMS"}</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              {fa ? "به‌جای فهرست مهارت‌ها، کیفیت کد و تصمیم‌ها را بررسی کن." : "Go beyond a skills list. Inspect the engineering."}
            </h2>
          </div>
          <a href={"mailto:" + profile.email} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg border border-primary/35 bg-primary/10 px-4 font-mono text-xs font-semibold text-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {fa ? "گفت‌وگو درباره همکاری" : "Discuss a project"}
          </a>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link to={caseStudyUrl(caseStudies[0].slug)} className="group flex min-w-0 gap-3 rounded-xl border border-border/65 bg-background/55 p-4 transition-colors hover:border-primary/45 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold">{fa ? "۱. مسئله و معماری" : "1. Architecture"}</span>
              <span className="mt-1 block text-xs leading-6 text-muted-foreground">{fa ? "چالش‌ها و تصمیم‌های واقعی در ComputerPilot" : "Read real design choices in ComputerPilot"}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-primary opacity-70" aria-hidden="true" />
          </Link>
          <Link to={caseStudyUrl(caseStudies[1].slug) + "#case-evidence"} className="group flex min-w-0 gap-3 rounded-xl border border-border/65 bg-background/55 p-4 transition-colors hover:border-primary/45 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold">{fa ? "۲. شواهد قابل بررسی" : "2. Verify the work"}</span>
              <span className="mt-1 block text-xs leading-6 text-muted-foreground">{fa ? "تست‌های امنیتی، CI و سورس TenantRAG" : "Inspect TenantRAG security tests and CI"}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-primary opacity-70" aria-hidden="true" />
          </Link>
          <Link to={caseStudyUrl(caseStudies[2].slug)} className="group flex min-w-0 gap-3 rounded-xl border border-border/65 bg-background/55 p-4 transition-colors hover:border-primary/45 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-sm font-semibold">{fa ? "۳. دقت و محدودیت‌ها" : "3. Inspect the limits"}</span>
              <span className="mt-1 block text-xs leading-6 text-muted-foreground">{fa ? "منشأ علمی و مرزهای داده در Psychology Atlas" : "Scientific provenance and rights in Psychology Atlas"}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-primary opacity-70" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
