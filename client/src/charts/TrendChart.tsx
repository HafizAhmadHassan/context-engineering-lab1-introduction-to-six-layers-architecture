import React from 'react';
import Plot from 'react-plotly.js';

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

  return (
    <Plot
      data={[
        {
          type: 'scatter',
          mode: 'lines+markers',
          x: sorted.map((e) => new Date(e.createdAt).toLocaleDateString()),
          y: sorted.map((e) => e.evaluation.overall),
          line: { color: '#3b82f6', width: 2, shape: 'spline' },
          marker: { color: '#3b82f6', size: 6 },
          fill: 'tozeroy',
          fillcolor: 'rgba(59, 130, 246, 0.1)',
        },
      ]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', size: 11 },
        xaxis: { gridcolor: 'rgba(148, 163, 184, 0.1)' },
        yaxis: { range: [0, 100], gridcolor: 'rgba(148, 163, 184, 0.1)' },
        margin: { l: 40, r: 20, t: 10, b: 50 },
        height: 250,
        showlegend: false,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
    />
  );
}
