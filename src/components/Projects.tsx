import { useMemo } from "react";
import { Link } from "react-router-dom";
import { caseStudies, caseStudyUrl } from "@/data/case-studies";
import { motion } from "framer-motion";
import { Github, ExternalLink, Search, Sparkles, X, CheckCircle2, Link2 } from "lucide-react";
import { projects } from "@/data/resume-data";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/SpotlightCard";
import { ArchitectureLauncher } from "@/components/ArchitectureLauncher";
import { toast } from "sonner";
import { projectAnchor, projectShareUrl } from "@/lib/project-links";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";
import { translations } from "@/i18n/translations";

const FOCUS_AREAS = [
  { key: "All", en: "All", fa: "همه" },
  { key: "Backend", en: "Backend", fa: "بک‌اند" },
  { key: "Automation", en: "Automation", fa: "اتوماسیون" },
  { key: "AI/ML", en: "AI / ML", fa: "هوش مصنوعی" },
  { key: "DevOps", en: "DevOps", fa: "زیرساخت" },
  { key: "Frontend", en: "Frontend", fa: "فرانت‌اند" },
  { key: "Psychology", en: "Psychology", fa: "روانشناسی" },
] as const;

interface ProjectsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Projects({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: ProjectsProps) {
  const { t, lang } = useLanguage();
  const { isLightweight } = useLightweightMode();

  const isFiltered = activeFilter !== "All" || searchQuery.trim().length > 0;

  const copyProjectLink = async (name: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(projectShareUrl(name, window.location.href));
      toast.success(t(translations.projects.linkCopied));
    } catch {
      toast.error(t(translations.projects.linkCopyFailed));
    }
  };

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured),
    []
  );

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesArea =
        activeFilter === "All" || project.focus?.includes(activeFilter);
      if (!matchesArea) return false;
      if (!query) return true;
      const haystack = [
        project.name,
        project.description,
        project.descriptionFa ?? "",
        ...project.tech,
        ...(project.focus ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [activeFilter, searchQuery]);

  const secondaryProjects = useMemo(
    () => (isFiltered ? filteredProjects : projects.filter((p) => !p.featured)),
    [filteredProjects, isFiltered]
  );

  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={isLightweight ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-8 text-center font-mono text-3xl font-bold"
        >
          {t(translations.sections.projects)}
        </motion.h2>

        {/* Interactive Filter Bar & Quick Search */}
        <div className="mb-10 flex flex-col gap-3 rounded-xl border border-border/60 bg-card/55 p-3.5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div
            className="mobile-filter-rail -mx-1 flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
            role="group"
            aria-label={lang === "fa" ? "فیلتر پروژه‌ها بر اساس حوزه" : "Filter projects by area"}
          >
            {FOCUS_AREAS.map((area) => {
              const count =
                area.key === "All"
                  ? projects.length
                  : projects.filter((p) => p.focus?.includes(area.key)).length;
              const active = activeFilter === area.key;
              return (
                <button
                  key={area.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onFilterChange(area.key)}
                  className={`inline-flex min-h-9 shrink-0 whitespace-nowrap items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active
                      ? "border-primary/60 bg-primary/15 font-semibold text-primary"
                      : "border-border/50 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span>{lang === "fa" ? area.fa : area.en}</span>
                  <span className="text-[10px] opacity-75 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="relative flex min-w-0 items-center md:w-64">
            <Search
              className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground rtl:left-auto rtl:right-2.5"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t(translations.projects.searchPlaceholder)}
              aria-label={t(translations.projects.searchPlaceholder)}
              className="h-11 w-full rounded-md border border-border/60 bg-background/60 pl-9 pr-9 text-base md:h-9 md:text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rtl:pl-8 rtl:pr-8"
            />
            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  onFilterChange("All");
                  onSearchChange("");
                }}
                aria-label={t(translations.projects.clearFilter)}
                className="absolute right-2 rounded p-0.5 text-muted-foreground hover:text-primary rtl:left-2 rtl:right-auto"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Flagship Featured Projects Tier (shown in default unfiltered view) */}
        {!isFiltered && featuredProjects.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                {t(translations.projects.featuredLabel)}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {featuredProjects.map((p) => (
                <SpotlightCard id={projectAnchor(p.name)} key={p.name} className="flex h-full scroll-mt-24 flex-col border-primary/30 bg-card/75">
                  <div className="flex h-full flex-col justify-between space-y-4 p-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-mono text-base font-bold text-foreground" dir="ltr">
                          {p.name}
                        </h3>
                        <div className="flex flex-wrap gap-1" dir="ltr">
                          {p.focus?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-muted-foreground sm:text-xs sm:leading-relaxed">
                        {lang === "fa" && p.descriptionFa ? p.descriptionFa : p.description}
                      </p>
                      {caseStudies.filter((caseStudy) => caseStudy.projectName === p.name).map((caseStudy) => (
                        <div key={caseStudy.slug} className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                            {lang === "fa" ? "چالش مهندسی" : "ENGINEERING CHALLENGE"}
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                            {caseStudy.headline[lang]}
                          </p>
                          <p className="mt-2 text-xs leading-6 text-muted-foreground">
                            {caseStudy.honestLimit[lang]}
                          </p>
                        </div>
                      ))}

                      {(lang === "fa" ? p.highlightsFa : p.highlights) && (
                        <ul className="space-y-1.5 border-t border-border/40 pt-3">
                          {(lang === "fa" ? p.highlightsFa : p.highlights)!.map((hl, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs leading-relaxed text-foreground/90 sm:text-[11px] sm:leading-snug">
                              <CheckCircle2
                                className="mt-0.5 h-3 w-3 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="ltr-content flex flex-wrap gap-1.5">
                        {p.tech.map((tc) => (
                          <Badge key={tc} variant="secondary" className="font-mono text-[10px]">
                            {tc}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-2">
                        {caseStudies.filter((caseStudy) => caseStudy.projectName === p.name).map((caseStudy) => (
                          <Link
                            key={caseStudy.slug}
                            to={caseStudyUrl(caseStudy.slug)}
                            className="inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-lg bg-primary px-4 font-mono text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <span>{lang === "fa" ? "بررسی کامل نمونه‌کار" : "Explore full case study"}</span>
                            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                          </Link>
                        ))}
                        {p.architecture && (
                          <ArchitectureLauncher
                            data={p.architecture}
                            projectName={p.name}
                            terminalPreview={p.terminalPreview}
                          caseStudy={p.caseStudy}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => void copyProjectLink(p.name)}
                          aria-label={t(translations.projects.copyLink) + ": " + p.name}
                          title={t(translations.projects.copyLink)}
                          className="mt-1 inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 font-mono text-xs font-medium text-primary transition-colors active:scale-[0.98] hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:mt-2 sm:min-h-0 sm:px-0 sm:text-[11px]"
                        >
                          <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {t(translations.projects.copyLink)}
                        </button>
                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                          >
                            <Github className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                            {t(translations.projects.source)}
                          </a>
                        )}
                        {p.demoUrl && (
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                          >
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                            {t(translations.projects.liveDemo)}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        )}

        {/* Active filter notice */}
        {isFiltered && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {t(translations.projects.filteredBy)}{" "}
              <strong className="font-mono text-primary">
                {activeFilter !== "All" ? activeFilter : ""}
                {activeFilter !== "All" && searchQuery.trim() ? " · " : ""}
                {searchQuery.trim() ? `"${searchQuery.trim()}"` : ""}
              </strong>{" "}
              ({secondaryProjects.length})
            </span>
            <button
              type="button"
              onClick={() => {
                onFilterChange("All");
                onSearchChange("");
              }}
              className="font-mono text-xs text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {t(translations.projects.clearFilter)}
            </button>
          </div>
        )}

        {/* Main / Secondary Projects Grid */}
        {secondaryProjects.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/50 p-10 text-center">
            <p className="mb-3 text-sm text-muted-foreground">{t(translations.projects.noMatches)}</p>
            <button
              type="button"
              onClick={() => {
                onFilterChange("All");
                onSearchChange("");
              }}
              className="font-mono text-xs text-primary underline underline-offset-2"
            >
              {t(translations.projects.clearFilter)}
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryProjects.map((p) => (
              <SpotlightCard id={projectAnchor(p.name)} key={p.name} className="h-full scroll-mt-24">
                <div className="flex h-full flex-col justify-between space-y-3 p-5">
                  <div className="space-y-2.5">
                    <h3 className="font-mono text-base font-semibold text-foreground sm:text-sm" dir="ltr">
                      {p.name}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground sm:text-xs sm:leading-relaxed">
                      {lang === "fa" && p.descriptionFa ? p.descriptionFa : p.description}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="ltr-content flex flex-wrap gap-1.5">
                      {p.tech.map((tc) => (
                        <Badge key={tc} variant="secondary" className="font-mono text-[10px]">
                          {tc}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {caseStudies.filter((caseStudy) => caseStudy.projectName === p.name).map((caseStudy) => (
                        <Link key={caseStudy.slug} to={caseStudyUrl(caseStudy.slug)}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 font-mono text-xs font-semibold text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                          {lang === "fa" ? "جزئیات مهندسی" : "Full case study"}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      ))}
                      {p.architecture && (
                        <ArchitectureLauncher
                          data={p.architecture}
                          projectName={p.name}
                          terminalPreview={p.terminalPreview}
                          caseStudy={p.caseStudy}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => void copyProjectLink(p.name)}
                        aria-label={t(translations.projects.copyLink) + ": " + p.name}
                        title={t(translations.projects.copyLink)}
                        className="mt-1 inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 font-mono text-xs font-medium text-primary transition-colors active:scale-[0.98] hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:mt-2 sm:min-h-0 sm:px-0 sm:text-[11px]"
                      >
                        <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                        {t(translations.projects.copyLink)}
                      </button>
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                        >
                          <Github className="h-3 w-3" aria-hidden="true" />{" "}
                          {t(translations.projects.source)}
                        </a>
                      )}
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                        >
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />{" "}
                          {t(translations.projects.liveDemo)}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
