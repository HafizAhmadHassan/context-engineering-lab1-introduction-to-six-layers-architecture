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

interface BarChartProps {
  scores: Record<string, number>;
}

const LABEL_MAP: Record<string, string> = {
  personaAdherence: 'Persona',
  policyAccuracy: 'Policy',
  empathyTone: 'Empathy',
  contextAwareness: 'Context',
  actionability: 'Actionable',
  personalisation: 'Personal',
  noHallucination: 'No Halluc.',
  completeness: 'Complete',
};

export function BarChart({ scores }: BarChartProps) {
  const data = Object.entries(scores)
    .filter(([key]) => key !== 'overall' && key !== 'reasoning')
    .map(([key, value]) => ({
      name: LABEL_MAP[key] || key,
      value,
    }));

  const colorFor = (v: number) => (v >= 90 ? '#22c55e' : v >= 70 ? '#eab308' : '#ef4444');

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BC data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={70} />
        <YAxis domain={[0, 105]} tick={{ fill: '#64748b', fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={colorFor(entry.value)} />
          ))}
        </Bar>
      </BC>
    </ResponsiveContainer>
  );
}
