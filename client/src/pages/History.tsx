import React, { useEffect, useState } from 'react';
import { getExperiments, deleteExperiment, updateExperiment } from '@/services/experiment.service';
import { useAppStore } from '@/store/useAppStore';
import { formatDate, formatLatency, formatCost, formatTokens } from '@/utils/format';
import { Star, Trash2, Eye, Clock, DollarSign, FileText, TrendingUp } from 'lucide-react';
import type { Experiment } from '@/types';

export function History() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const setLayersFromExperiment = useAppStore((s) => s.setLayersFromExperiment);

  const loadExperiments = async () => {
    try {
      const data = await getExperiments(1, 50);
      setExperiments(data.experiments);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experiment?')) return;
    try {
      await deleteExperiment(id);
      setExperiments((prev) => prev.filter((e) => e._id !== id));
    } catch {
      // ignore
    }
  };

  const handleFavourite = async (id: string, current: boolean) => {
    try {
      await updateExperiment(id, { isFavourite: !current } as any);
      setExperiments((prev) =>
        prev.map((e) => (e._id === id ? { ...e, isFavourite: !current } : e))
      );
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Experiment History</h1>

      {experiments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No experiments yet. Run a generation to see history.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiments.map((exp) => (
            <div
              key={exp._id}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {exp.provider}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-muted-foreground">
                      {exp.model}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(exp.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground truncate">
                    {exp.prompt.slice(0, 200)}...
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {exp.evaluation?.overall ?? '—'}/100
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatLatency(exp.latencyMs)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {formatTokens(exp.totalTokens)}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCost(exp.estimatedCost)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFavourite(exp._id, exp.isFavourite)}
                    className={`p-2 rounded-lg hover:bg-accent transition-colors ${
                      exp.isFavourite ? 'text-yellow-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setLayersFromExperiment(exp.contextLayers)}
                    className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                    title="Load layers"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
