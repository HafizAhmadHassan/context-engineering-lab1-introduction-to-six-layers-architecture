import React from 'react';
import Plot from 'react-plotly.js';

interface TokenUsageChartProps {
  promptTokens: number;
  completionTokens: number;
}

export function TokenUsageChart({ promptTokens, completionTokens }: TokenUsageChartProps) {
  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: ['Prompt', 'Completion'],
          y: [promptTokens, completionTokens],
          marker: { color: ['#3b82f6', '#a855f7'] },
          text: [promptTokens.toLocaleString(), completionTokens.toLocaleString()],
          textposition: 'outside',
          textfont: { size: 12 },
        },
      ]}
      layout={{
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', size: 11 },
        yaxis: { gridcolor: 'rgba(148, 163, 184, 0.1)' },
        margin: { l: 40, r: 20, t: 10, b: 40 },
        height: 200,
        showlegend: false,
        bargap: 0.5,
      }}
      config={{ displayModeBar: false, responsive: true }}
      className="w-full"
    />
  );
}
