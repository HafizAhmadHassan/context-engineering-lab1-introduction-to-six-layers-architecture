'use client';

import {
  RadialBarChart as RDC,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface GaugeChartProps {
  value: number;
  title?: string;
}

export function GaugeChart({ value, title = 'Overall Quality' }: GaugeChartProps) {
  const color = value >= 90 ? '#22c55e' : value >= 70 ? '#eab308' : '#ef4444';
  const data = [{ name: title, value, fill: color }];

  return (
    <div className="relative w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RDC innerRadius="70%" outerRadius="90%" startAngle={200} endAngle={-20} data={data}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: 'rgba(148, 163, 184, 0.15)' }} dataKey="value" cornerRadius={10} />
        </RDC>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold font-mono" style={{ color }}>{value}</span>
        <span className="text-xs text-muted-foreground mt-1">out of 100</span>
      </div>
      <div className="absolute bottom-2 w-full text-center text-sm text-muted-foreground">{title}</div>
    </div>
  );
}
