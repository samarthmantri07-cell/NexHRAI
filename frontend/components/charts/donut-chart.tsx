"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const PREMIUM_COLORS = [
  "oklch(0.70 0.22 265)",
  "oklch(0.68 0.22 300)",
  "oklch(0.72 0.20 200)",
  "oklch(0.72 0.18 145)",
  "oklch(0.76 0.18 75)",
  "oklch(0.68 0.22 25)",
];

function PremiumTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = item.payload.total || 1;
  const pct = ((item.value / total) * 100).toFixed(1);
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
      <p style={{ color: item.payload.fill || "white", fontSize: "12px", fontWeight: "600", marginBottom: "2px" }}>
        {item.name}
      </p>
      <p style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>{item.value.toLocaleString()}</p>
      <p style={{ color: "oklch(0.55 0.04 265)", fontSize: "11px" }}>{pct}% of total</p>
    </div>
  );
}

function PremiumLegend({ payload }: any) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span style={{ color: "oklch(0.65 0.04 265)", fontSize: "11px" }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

interface DonutChartProps {
  data: Record<string, any>[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
  height?: number;
  centerLabel?: string;
}

export function DonutChart({
  data,
  nameKey,
  dataKey,
  colors = PREMIUM_COLORS,
  height = 280,
  centerLabel,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + (d[dataKey] || 0), 0);
  const dataWithTotal = data.map((d) => ({ ...d, total }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <defs>
          {data.map((_, i) => (
            <filter key={i} id={`donut-glow-${i}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
        <Pie
          data={dataWithTotal}
          cx="50%"
          cy="45%"
          innerRadius="52%"
          outerRadius="72%"
          dataKey={dataKey}
          nameKey={nameKey}
          paddingAngle={3}
          animationBegin={0}
          animationDuration={1200}
          animationEasing="ease-out"
          strokeWidth={0}
        >
          {dataWithTotal.map((entry, i) => (
            <Cell
              key={i}
              fill={colors[i % colors.length]}
              opacity={0.9}
            />
          ))}
        </Pie>
        <Tooltip content={<PremiumTooltip />} />
        <Legend content={<PremiumLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
