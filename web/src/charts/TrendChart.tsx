'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendChartProps {
  experiments: Array<{
    createdAt: string;
    evaluation: { overall: number };
  }>;
}

export function TrendChart({ experiments }: TrendChartProps) {
  if (!experiments.length) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        No experiment history yet
      </div>
    );
  }

  const sorted = [...experiments]
    .filter((e) => e.evaluation?.overall)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const data = sorted.map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString(),
    score: e.evaluation.overall,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
        <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
