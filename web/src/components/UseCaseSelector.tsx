'use client';

import { useAppStore } from '@/store/useAppStore';
import { USE_CASE_PRESETS } from '@/utils/format';
import { FlaskConical } from 'lucide-react';

export function UseCaseSelector() {
  const loadUseCase = useAppStore((s) => s.loadUseCase);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Quick Start Presets</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Click a use case to auto-fill all 6 context layers with realistic data
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {USE_CASE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => loadUseCase(preset)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/40 hover:bg-secondary transition-all text-center group"
          >
            <span className="text-xl">{preset.icon}</span>
            <span className="text-xs font-medium leading-tight">{preset.label}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{preset.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
