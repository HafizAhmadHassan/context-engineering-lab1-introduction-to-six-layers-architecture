import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { formatCost, formatLatency, formatTokens, formatDate } from '@/utils/format';
import { Clock, DollarSign, FileText, Zap, CheckCircle, XCircle } from 'lucide-react';

export function ResponsePanel() {
  const { response, evaluation, error, isGenerating } = useAppStore();

  if (isGenerating) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        <p className="text-muted-foreground animate-pulse">Generating response...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-5 w-5" />
          <span className="font-medium">Error</span>
        </div>
        <p className="mt-2 text-sm text-destructive/80">{error}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Configure the context layers and press Generate</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm">Response</h3>
          <span className="text-xs text-muted-foreground">
            {response.provider} / {response.model}
          </span>
        </div>
        <div className="p-4 prose prose-invert max-w-none text-sm leading-relaxed">
          {response.content}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Latency" value={formatLatency(response.latencyMs)} icon={<Clock className="h-4 w-4" />} />
        <MetricCard label="Total Tokens" value={formatTokens(response.totalTokens)} icon={<FileText className="h-4 w-4" />} />
        <MetricCard label="Est. Cost" value={formatCost(response.estimatedCost)} icon={<DollarSign className="h-4 w-4" />} />
        <MetricCard label="Timestamp" value={formatDate(response.timestamp)} icon={<Clock className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Prompt Tokens" value={response.promptTokens.toLocaleString()} />
        <MetricCard label="Completion Tokens" value={response.completionTokens.toLocaleString()} />
      </div>

      {evaluation && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center gap-2">
            <CheckCircle className={`h-4 w-4 ${evaluation.overall >= 70 ? 'text-green-500' : evaluation.overall >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
            <h3 className="font-semibold text-sm">Quality Evaluation</h3>
            <span className={`ml-auto text-lg font-bold ${
              evaluation.overall >= 90 ? 'text-green-500' : evaluation.overall >= 70 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {evaluation.overall}/100
            </span>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">{evaluation.reasoning}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <ScoreBadge label="Persona" score={evaluation.personaAdherence} />
              <ScoreBadge label="Policy" score={evaluation.policyAccuracy} />
              <ScoreBadge label="Empathy" score={evaluation.empathyTone} />
              <ScoreBadge label="Context" score={evaluation.contextAwareness} />
              <ScoreBadge label="Actionable" score={evaluation.actionability} />
              <ScoreBadge label="Personal" score={evaluation.personalisation} />
              <ScoreBadge label="No Halluc." score={evaluation.noHallucination} />
              <ScoreBadge label="Complete" score={evaluation.completeness} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3 space-y-1">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm font-mono font-medium">{value}</p>
    </div>
  );
}

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const color = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/30 text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={`font-mono font-medium ${color}`}>{score}</span>
    </div>
  );
}
