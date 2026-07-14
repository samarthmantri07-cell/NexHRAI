"use client";

import {
  AreaChart as RechartAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PREMIUM_COLORS = [
  "oklch(0.70 0.22 265)",
  "oklch(0.68 0.22 300)",
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
        <p key={i} style={{ color: entry.color || "white", fontSize: "13px", fontWeight: "600" }}>
          {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
}

interface AreaChartProps {
  data: Record<string, any>[];
  xAxisKey: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

export function AreaChart({
  data,
  xAxisKey,
  dataKeys,
  colors = PREMIUM_COLORS,
  height = 280,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartAreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={`areaGrad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.5} />
              <stop offset="60%" stopColor={colors[i % colors.length]} stopOpacity={0.1} />
              <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "oklch(0.55 0.04 265)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<PremiumTooltip />} />
        {dataKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i % colors.length]}
            strokeWidth={2.5}
            fill={`url(#areaGrad-${key})`}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: colors[i % colors.length] }}
            animationDuration={1400}
            animationEasing="ease-out"
          />
        ))}
      </RechartAreaChart>
    </ResponsiveContainer>
  );
}
