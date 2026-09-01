'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { estimateTokens } from '@/utils/format';
import { ToggleLeft, ToggleRight, Copy, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import type { ContextLayer as ContextLayerType } from '@/types';

interface ContextLayerProps {
  layer: ContextLayerType;
  index: number;
}

export function ContextLayerCard({ layer }: ContextLayerProps) {
  const { updateLayer, toggleLayer } = useAppStore();
  const [expanded, setExpanded] = useState(true);
  const tokenCount = estimateTokens(layer.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(layer.content);
  };

  const handleReset = () => {
    updateLayer(layer.id, { content: '', tokenCount: 0 });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30">
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50">
        <button
          onClick={() => toggleLayer(layer.id)}
          className="text-muted-foreground hover:text-primary transition-colors"
          title={layer.enabled ? 'Disable layer' : 'Enable layer'}
        >
          {layer.enabled ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5" />}
        </button>

        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 flex-1">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium text-sm">{layer.label}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{layer.content.length} chars</span>
          <span>|</span>
          <span>~{tokenCount} tokens</span>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground">{layer.description}</p>

          <div className="rounded-lg overflow-hidden border border-border bg-black/40">
            <textarea
              value={layer.content}
              onChange={(e) => updateLayer(layer.id, { content: e.target.value })}
              rows={5}
              placeholder="Enter content for this context layer..."
              className="w-full bg-transparent p-3 text-sm font-mono text-foreground resize-y focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 rounded bg-secondary hover:bg-accent transition-colors flex items-center gap-1"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
            <button
              onClick={handleReset}
              className="text-xs px-2 py-1 rounded bg-secondary hover:bg-accent transition-colors flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ContextLayerList() {
  const { layerStates } = useAppStore();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        Context Layers
        <span className="text-xs text-muted-foreground font-normal">
          {layerStates.filter((l) => l.enabled).length} / {layerStates.length} enabled
        </span>
      </h2>
      {layerStates.map((layer, index) => (
        <ContextLayerCard key={layer.id} layer={layer} index={index} />
      ))}
    </div>
  );
}
