"use client";

import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PREMIUM_COLORS = [
  "oklch(0.70 0.22 265)",
  "oklch(0.55 0.04 265)",
  "oklch(0.72 0.20 200)",
  "oklch(0.72 0.18 145)",
];

function PremiumTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "oklch(0.11 0.015 265)",
        border: "1px solid oklch(1 0 0 / 0.12)",
        borderRadius: "12px",
        padding: "10px 14px",
        boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)",
        backdropFilter: "blur(20px)",
      }}
    >
      <p style={{ color: "oklch(0.55 0.04 265)", fontSize: "11px", marginBottom: "4px" }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.fill || "white", fontSize: "13px", fontWeight: "600" }}>
          {typeof entry.value === "number" && entry.value > 1000
            ? entry.value.toLocaleString()
            : entry.value}
        </p>
      ))}
    </div>
  );
}

// Custom rounded top bar shape
function RoundedBar(props: any) {
  const { x, y, width, height, fill } = props;
  const r = Math.min(6, height / 2);
  if (height <= 0) return null;
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
      fill={fill}
    />
  );
}

interface BarChartProps {
  data: Record<string, any>[];
  xAxisKey: string;
  dataKeys: string[];
  colors?: string[];
  layout?: "horizontal" | "vertical";
  height?: number;
}

export function BarChart({
  data,
  xAxisKey,
  dataKeys,
  colors = PREMIUM_COLORS,
  layout = "horizontal",
  height = 280,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartBarChart
        data={data}
        layout={layout}
        margin={{ top: 10, right: 10, left: layout === "vertical" ? 80 : -20, bottom: 0 }}
        barGap={4}
      >
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient
              key={key}
              id={`barGrad-${key}`}
              x1={layout === "vertical" ? "1" : "0"}
              y1={layout === "vertical" ? "0" : "0"}
              x2={layout === "vertical" ? "0" : "0"}
              y2={layout === "vertical" ? "0" : "1"}
            >
              <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={1} />
              <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={layout === "horizontal" ? false : true} horizontal={layout === "horizontal"} />
        {layout === "horizontal" ? (
          <>
            <XAxis dataKey={xAxisKey} tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
          </>
        ) : (
          <>
            <XAxis type="number" tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey={xAxisKey} type="category" tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
          </>
        )}
        <Tooltip content={<PremiumTooltip />} cursor={{ fill: "oklch(1 0 0 / 0.04)", radius: 4 }} />
        {dataKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`url(#barGrad-${key})`}
            radius={layout === "horizontal" ? [6, 6, 0, 0] : [0, 6, 6, 0]}
            animationDuration={1200}
            animationEasing="ease-out"
            maxBarSize={48}
          />
        ))}
      </RechartBarChart>
    </ResponsiveContainer>
  );
}
