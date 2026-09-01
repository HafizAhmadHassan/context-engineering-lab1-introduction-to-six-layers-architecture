'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ContextLayerList } from '@/components/ContextLayer';
import { UseCaseSelector } from '@/components/UseCaseSelector';
import { PromptPreview } from '@/components/PromptPreview';
import { ResponsePanel } from '@/components/ResponsePanel';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { RadarChart } from '@/charts/RadarChart';
import { BarChart } from '@/charts/BarChart';
import { GaugeChart } from '@/charts/GaugeChart';
import { TokenUsageChart } from '@/charts/TokenUsageChart';
import { getExperiments } from '@/services/experiment.service';
import { TrendChart } from '@/charts/TrendChart';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';

export default function DashboardPage() {
  const { response, evaluation } = useAppStore();
  const [recentExperiments, setRecentExperiments] = useState<any[]>([]);

  useEffect(() => {
    getExperiments(1, 5)
      .then((data) => setRecentExperiments(data.experiments))
      .catch(() => {});
  }, [response]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <UseCaseSelector />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ContextLayerList />
          <PromptPreview />
        </div>
        <div className="space-y-6">
          <ResponsePanel />
        </div>
      </div>

      {response && evaluation && (
        <>
          <MetricsDashboard />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <BarChart3 className="h-4 w-4" />
                Radar Chart
              </div>
              <RadarChart scores={evaluation} />
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <BarChart3 className="h-4 w-4" />
                Score Breakdown
              </div>
              <BarChart scores={evaluation as unknown as Record<string, number>} />
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <TrendingUp className="h-4 w-4" />
                Overall Quality
              </div>
              <GaugeChart value={evaluation.overall} />
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Layers className="h-4 w-4" />
                Token Usage
              </div>
              <TokenUsageChart
                promptTokens={response.promptTokens}
                completionTokens={response.completionTokens}
              />
            </div>
          </div>

          {recentExperiments.length > 1 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <TrendingUp className="h-4 w-4" />
                Quality Trend
              </div>
              <TrendChart experiments={recentExperiments} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
