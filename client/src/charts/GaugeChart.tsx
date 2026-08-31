import React from 'react';
import Plot from 'react-plotly.js';

interface GaugeChartProps {
  value: number;
  title?: string;
}

export function GaugeChart({ value, title = 'Overall Quality' }: GaugeChartProps) {
  const color = value >= 90 ? '#22c55e' : value >= 70 ? '#eab308' : '#ef4444';

  return (
    <Plot
      data={[
        {
          type: 'indicator',
          mode: 'gauge+number+delta',
          value,
          number: { font: { color, size: 36 }, suffix: '/100' },
          gauge: {
            axis: { range: [0, 100], tickwidth: 1, tickcolor: '#94a3b8', gridcolor: 'rgba(148, 163, 184, 0.2)' },
            bar: { color, thickness: 0.3 },
            bgcolor: 'rgba(0,0,0,0)',
            borderwidth: 0,
            steps: [
              { range: [0, 50], color: 'rgba(239, 68, 68, 0.15)' },
              { range: [50, 70], color: 'rgba(234, 179, 8, 0.15)' },
              { range: [70, 90], color: 'rgba(234, 179, 8, 0.1)' },
              { range: [90, 100], color: 'rgba(34, 197, 94, 0.1)' },
            ],
            threshold: {
              line: { color: '#64748b', width: 2 },
              thickness: 0.75,
              value: 90,
            },
          },
          title: {
            text: title,
            font: { color: '#94a3b8', size: 14 },
          },
        },
      ]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8' },
        margin: { l: 30, r: 30, t: 40, b: 20 },
        height: 280,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
    />
  );
}
