'use client';

import { useAppStore } from '@/store/useAppStore';
import { estimateTokens } from '@/utils/format';
import { FileText } from 'lucide-react';

export function PromptPreview() {
  const { layerStates } = useAppStore();

  const prompt = layerStates
    .filter((l) => l.enabled && l.content.trim())
    .map((l) => `=== ${l.label} ===\n${l.content.trim()}`)
    .join('\n\n');

  const wordCount = prompt.split(/\s+/).filter(Boolean).length;
  const charCount = prompt.length;
  const tokenCount = estimateTokens(prompt);

  if (!prompt.trim()) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
        <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Enable layers and add content to build a prompt</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Prompt Preview
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{charCount.toLocaleString()} chars</span>
          <span className="font-mono">~{tokenCount.toLocaleString()} tokens</span>
        </div>
      </div>
      <div className="max-h-48 overflow-auto bg-black/40">
        <pre className="p-3 text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">{prompt}</pre>
      </div>
    </div>
  );
}
