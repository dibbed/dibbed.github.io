import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { SpotlightCard } from "@/components/SpotlightCard";

const data = [
  { subject: "Backend", value: 95 },
  { subject: "Frontend", value: 40 },
  { subject: "DevOps", value: 75 },
  { subject: "AI/ML", value: 80 },
  { subject: "System Design", value: 90 },
  { subject: "Psychology", value: 70 },
];

export function SkillRadarChart() {
  return (
    <SpotlightCard className="p-5">
      <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
        Skill Distribution
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
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="hsl(160 84% 39%)"
              fill="hsl(160 84% 39%)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </SpotlightCard>
  );
}
