"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
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
        fontFamily: "system-ui",
      }}
    >
      <p style={{ color: "oklch(0.55 0.04 265)", fontSize: "11px", marginBottom: "4px" }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || "white", fontSize: "13px", fontWeight: "600" }}>
          {typeof entry.value === "number" && entry.value > 1000
            ? entry.value.toLocaleString()
            : entry.value}
        </p>
      ))}
    </div>
  );
}

function PremiumDot(props: any) {
  const { cx, cy, stroke } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={stroke} opacity={0.9} />
      <circle cx={cx} cy={cy} r={8} fill={stroke} opacity={0.15} />
    </g>
  );
}

interface LineChartProps {
  data: Record<string, any>[];
  xAxisKey: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

export function LineChart({
  data,
  xAxisKey,
  dataKeys,
  colors = PREMIUM_COLORS,
  height = 280,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={`lineGrad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(1 0 0 / 0.05)"
          vertical={false}
        />
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
            fill={`url(#lineGrad-${key})`}
            dot={<PremiumDot />}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
