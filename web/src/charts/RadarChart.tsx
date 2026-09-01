'use client';

import {
  Radar,
  RadarChart as RC,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  scores: {
    personaAdherence: number;
    policyAccuracy: number;
    empathyTone: number;
    contextAwareness: number;
    actionability: number;
    personalisation: number;
    noHallucination: number;
    completeness: number;
  };
}

export function RadarChart({ scores }: RadarChartProps) {
  const data = [
    { subject: 'Persona', value: scores.personaAdherence },
    { subject: 'Policy', value: scores.policyAccuracy },
    { subject: 'Empathy', value: scores.empathyTone },
    { subject: 'Context', value: scores.contextAwareness },
    { subject: 'Action', value: scores.actionability },
    { subject: 'Personal', value: scores.personalisation },
    { subject: 'No Halluc.', value: scores.noHallucination },
    { subject: 'Complete', value: scores.completeness },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RC data={data} outerRadius={110}>
        <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} tickCount={5} />
        <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
      </RC>
    </ResponsiveContainer>
  );
}
