import { useState } from "react";
import { ArrowUpRight, Layers3 } from "lucide-react";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SpotlightCard } from "@/components/SpotlightCard";
import { projects } from "@/data/resume-data";
import { useLanguage } from "@/i18n/LanguageContext";

// Areas are explicit tags on featured projects, not subjective skill percentages.
const areas = [
  { key: "Backend", en: "Backend", fa: "بک‌اند" },
  { key: "Automation", en: "Automation", fa: "اتوماسیون" },
  { key: "DevOps", en: "DevOps", fa: "زیرساخت" },
  { key: "AI/ML", en: "AI / ML", fa: "هوش مصنوعی" },
  { key: "Frontend", en: "Frontend", fa: "فرانت‌اند" },
  { key: "Psychology", en: "Psychology", fa: "روانشناسی" },
] as const;

type AreaKey = (typeof areas)[number]["key"];

const coverage = areas.map((area) => ({
  ...area,
  count: projects.filter((project) => project.focus?.includes(area.key)).length,
}));
const chartData = coverage.map((area) => ({
  subject: area.key,
  projects: area.count,
}));
const maxCoverage = Math.max(1, ...coverage.map((area) => area.count));

export function SkillRadarChart() {
  const { lang } = useLanguage();
  const [selected, setSelected] = useState<AreaKey>("Backend");
  const selectedArea = coverage.find((area) => area.key === selected)!;
  const matchingProjects = projects.filter((project) => project.focus?.includes(selected));

  return (
    <SpotlightCard className="overflow-hidden p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">
            {lang === "fa" ? "مسیر ساخت پروژه‌ها /" : "// ENGINEERING FOOTPRINT"}
          </p>
          <h3 className="font-mono text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {lang === "fa" ? "نقشه تمرکز پروژه‌ها" : "Project Focus Map"}
          </h3>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            {lang === "fa"
              ? "حوزه‌هایی که در پروژه‌های منتشرشده روی آن‌ها کار کرده‌ام. برای دیدن پروژه‌های هر حوزه، آن را انتخاب کن."
              : "Explore the engineering areas represented in my public work. Select an area to see the related projects."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-primary">
          <Layers3 className="h-4 w-4" aria-hidden="true" />
          <span className="font-mono text-sm font-semibold tabular-nums">{projects.length}</span>
          <span className="text-[10px] text-muted-foreground">
            {lang === "fa" ? "پروژه منتخب" : "featured"}
          </span>
        </div>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-[0.95fr_1.05fr] md:gap-6">
        <div
          className="relative h-[268px] min-w-0 rounded-xl border border-border/40 bg-background/30 p-2 sm:h-[300px]"
          role="img"
          aria-label={lang === "fa"
            ? "نمودار راداری تعداد پروژه‌های منتخب در شش حوزه فنی"
            : "Radar chart of featured project counts across six engineering areas"}
        >
          <div className="pointer-events-none absolute inset-x-6 top-1/2 h-px bg-primary/10" />
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart cx="50%" cy="50%" outerRadius="69%" data={chartData}>
              <PolarGrid stroke="hsl(var(--border) / 0.55)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, maxCoverage]}
                tick={false}
                axisLine={false}
                tickCount={maxCoverage + 1}
              />
              <Tooltip
                formatter={(value: number) => [value, lang === "fa" ? "پروژه" : "Projects"]}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "10px",
                  color: "hsl(var(--foreground))",
                  fontSize: 12,
                }}
              />
              <Radar
                name="Featured projects"
                dataKey="projects"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.18}
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-2 gap-2" role="group"
            aria-label={lang === "fa" ? "انتخاب حوزه پروژه‌ها" : "Choose project focus area"}>
            {coverage.map((area) => {
              const active = selected === area.key;
              return (
                <button
                  key={area.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(area.key)}
                  className={`group relative min-w-0 overflow-hidden rounded-lg border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border/50 bg-background/25 text-muted-foreground hover:border-primary/35 hover:bg-primary/5"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-medium">
                      {lang === "fa" ? area.fa : area.en}
                    </span>
                    <span className={`shrink-0 font-mono text-xs font-semibold tabular-nums ${active ? "text-primary" : "text-foreground"}`}>
                      {area.count}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-border/50" aria-hidden="true">
                    <div
                      className={`h-full rounded-full transition-all ${active ? "bg-primary" : "bg-primary/40"}`}
                      style={{ width: `${(area.count / maxCoverage) * 100}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="min-h-[120px] rounded-xl border border-border/40 bg-background/30 p-3.5" aria-live="polite">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">
                {lang === "fa" ? `پروژه‌های ${selectedArea.fa}` : `${selectedArea.en} projects`}
              </p>
              <span className="font-mono text-[10px] text-primary tabular-nums">
                {matchingProjects.length} {lang === "fa" ? "پروژه" : matchingProjects.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <ul className="space-y-1.5" dir="ltr">
              {matchingProjects.slice(0, 3).map((project) => (
                <li key={project.name}>
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                    className="group/link flex min-w-0 items-center justify-between gap-2 rounded-md px-1 py-1 text-left text-xs text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <span className="min-w-0 truncate">{project.name}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            {matchingProjects.length > 3 && (
              <a href="#projects"
                className="mt-2 inline-block text-[11px] font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                {lang === "fa" ? `مشاهده همه ${matchingProjects.length} پروژه` : `Explore all ${matchingProjects.length} projects`}
              </a>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground/80">
        {lang === "fa"
          ? "آمار بر اساس برچسب حوزه‌های ۱۱ پروژه منتخب محاسبه می‌شود؛ هر پروژه ممکن است در چند حوزه باشد. این نمودار امتیاز مهارت نیست."
          : "Counts come from tagged featured projects. A project may span multiple areas; this is not a skill rating."}
      </p>
    </SpotlightCard>
  );
}
