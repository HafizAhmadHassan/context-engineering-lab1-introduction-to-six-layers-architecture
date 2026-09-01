'use client';

import {
  BarChart as BC,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface TokenUsageChartProps {
  promptTokens: number;
  completionTokens: number;
}

export function TokenUsageChart({ promptTokens, completionTokens }: TokenUsageChartProps) {
  const data = [
    { name: 'Prompt', value: promptTokens },
    { name: 'Completion', value: completionTokens },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BC data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          <Cell fill="#3b82f6" />
          <Cell fill="#a855f7" />
        </Bar>
      </BC>
    </ResponsiveContainer>
  );
}
