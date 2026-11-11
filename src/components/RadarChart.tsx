import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { SpotlightCard } from "@/components/SpotlightCard";
import { projects } from "@/data/resume-data";
import { useLanguage } from "@/i18n/LanguageContext";

// Each value is the number of featured projects in that area, not an invented proficiency score.
const subjects = ["Backend", "Frontend", "DevOps", "AI/ML", "Automation", "Psychology"];
const data = subjects.map((subject) => ({
  subject,
  value: projects.filter((project) => project.focus?.includes(subject)).length,
}));
const maxValue = Math.max(1, ...data.map((entry) => entry.value));

export function SkillRadarChart() {
  const { lang } = useLanguage();
  return (
    <SpotlightCard className="p-5">
      <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
        {lang === "fa" ? "پوشش حوزه‌ها در پروژه‌های منتخب" : "Featured Project Coverage"}
      </h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="hsl(160 84% 39% / 0.15)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", fill: "hsl(215 16% 50%)" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, maxValue]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Projects"
              dataKey="value"
              stroke="hsl(160 84% 39%)"
              fill="hsl(160 84% 39%)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-muted-foreground text-center">
        {lang === "fa" ? "تعداد پروژه‌ها در هر حوزه؛ نه امتیاز مهارت شخصی." : "Number of featured projects by area. Not a self-rated skill score."}
      </p>
    </SpotlightCard>
  );
}
