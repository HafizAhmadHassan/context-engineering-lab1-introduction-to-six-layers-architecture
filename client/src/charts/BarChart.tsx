import React from 'react';
import Plot from 'react-plotly.js';

interface BarChartProps {
  scores: Record<string, number>;
}

export function BarChart({ scores }: BarChartProps) {
  const entries = Object.entries(scores).filter(([key]) => key !== 'overall' && key !== 'reasoning');

  const colors = entries.map(([, v]) =>
    v >= 90 ? '#22c55e' : v >= 70 ? '#eab308' : '#ef4444'
  );

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: entries.map(([label]) =>
            label.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
          ),
          y: entries.map(([, value]) => value),
          marker: { color: colors },
          text: entries.map(([, value]) => String(value)),
          textposition: 'outside',
          textfont: { size: 10 },
        },
      ]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', size: 11 },
        xaxis: { tickangle: -45, gridcolor: 'rgba(148, 163, 184, 0.1)' },
        yaxis: { range: [0, 105], gridcolor: 'rgba(148, 163, 184, 0.1)' },
        margin: { l: 40, r: 20, t: 20, b: 80 },
        height: 300,
        showlegend: false,
        bargap: 0.3,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
    />
  );
}
