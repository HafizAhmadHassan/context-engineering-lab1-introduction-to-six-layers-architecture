import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { formatCost, formatLatency, formatTokens } from '@/utils/format';
import { TrendingUp, Clock, FileText, DollarSign, Layers, AlignLeft } from 'lucide-react';

export function MetricsDashboard() {
  const { response, evaluation, layerStates, isGenerating } = useAppStore();

  const enabledLayers = layerStates.filter((l) => l.enabled);
  const contextSize = enabledLayers.reduce((sum, l) => sum + l.content.length, 0);
  const totalTokenEstimate = enabledLayers.reduce((sum, l) => sum + Math.ceil(l.content.length / 4), 0);

  const metrics = [
    {
      label: 'Overall Quality',
      value: evaluation ? `${evaluation.overall}/100` : '—',
      icon: <TrendingUp className="h-4 w-4" />,
      color: evaluation && evaluation.overall >= 90 ? 'text-green-500' : evaluation && evaluation.overall >= 70 ? 'text-yellow-500' : 'text-muted-foreground',
    },
    {
      label: 'Latency',
      value: response ? formatLatency(response.latencyMs) : '—',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'Input Tokens',
      value: response ? response.promptTokens.toLocaleString() : '—',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: 'Output Tokens',
      value: response ? response.completionTokens.toLocaleString() : '—',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: 'Est. Cost',
      value: response ? formatCost(response.estimatedCost) : '—',
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      label: 'Context Size',
      value: contextSize ? `${formatTokens(contextSize)} chars` : '—',
      icon: <Layers className="h-4 w-4" />,
    },
    {
      label: 'Prompt Length',
      value: totalTokenEstimate ? `~${totalTokenEstimate} tokens` : '—',
      icon: <AlignLeft className="h-4 w-4" />,
    },
    {
      label: 'Completion Length',
      value: response ? `${response.content.length.toLocaleString()} chars` : '—',
      icon: <AlignLeft className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            {metric.icon}
            {metric.label}
          </div>
          <p className={`text-lg font-semibold font-mono ${metric.color || ''}`}>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
