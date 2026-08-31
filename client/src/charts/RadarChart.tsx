import React from 'react';
import Plot from 'react-plotly.js';

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
  const categories = [
    'Persona\nAdherence',
    'Policy\nAccuracy',
    'Empathy\nTone',
    'Context\nAwareness',
    'Actionability',
    'Personalisation',
    'No\nHallucination',
    'Completeness',
  ];

  const values = [
    scores.personaAdherence,
    scores.policyAccuracy,
    scores.empathyTone,
    scores.contextAwareness,
    scores.actionability,
    scores.personalisation,
    scores.noHallucination,
    scores.completeness,
  ];

  const data: any[] = [
    {
      type: 'scatterpolar',
      r: [...values, values[0]],
      theta: [...categories, categories[0]],
      fill: 'toself',
      name: 'Current',
      line: { color: '#3b82f6', width: 2 },
      fillcolor: 'rgba(59, 130, 246, 0.2)',
    },
    {
      type: 'scatterpolar',
      r: Array(9).fill(100),
      theta: [...categories, categories[0]],
      name: 'Target',
      line: { color: '#22c55e', width: 1, dash: 'dot' },
      fillcolor: 'rgba(34, 197, 94, 0.05)',
    },
  ];

  return (
    <Plot
      data={data}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', size: 10 },
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 100],
            tickfont: { size: 9 },
            gridcolor: 'rgba(148, 163, 184, 0.2)',
          },
          bgcolor: 'rgba(0,0,0,0)',
          gridshape: 'circular',
        },
        margin: { l: 60, r: 60, t: 20, b: 20 },
        showlegend: false,
        height: 350,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
    />
  );
}
