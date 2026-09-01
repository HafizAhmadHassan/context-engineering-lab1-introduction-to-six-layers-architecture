'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { generate } from '@/services/generation.service';
import { saveExperiment } from '@/services/experiment.service';
import { estimateTokens } from '@/utils/format';
import { Play, RotateCcw, Save, Key, Settings2 } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', label: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'gemini', label: 'Gemini', models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'] },
  { id: 'anthropic', label: 'Anthropic', models: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'] },
  { id: 'groq', label: 'Groq (Free)', models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it', 'deepseek-r1-distill-llama-70b'] },
];

export function Sidebar() {
  const {
    layerStates,
    isGenerating,
    setGenerating,
    setResponse,
    setEvaluation,
    setError,
    clearGeneration,
    resetLayers,
  } = useAppStore();

  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [topP, setTopP] = useState(1);

  const currentProvider = PROVIDERS.find((p) => p.id === provider);
  const models = currentProvider?.models || [];

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const prov = PROVIDERS.find((p) => p.id === newProvider);
    if (prov?.models.length) setModel(prov.models[0]);
  };

  const handleGenerate = async () => {
    const userInput = layerStates.find((l) => l.id === 'user_input')?.content;
    if (!userInput?.trim()) {
      setError('Please enter a user input');
      return;
    }

    setGenerating(true);
    setError(null);
    clearGeneration();

    try {
      const prompt = layerStates
        .filter((l) => l.enabled && l.content.trim())
        .map((l) => `=== ${l.label} ===\n${l.content.trim()}`)
        .join('\n\n');

      const result = await generate({
        provider,
        model,
        apiKey,
        prompt,
        contextLayers: layerStates,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty: 0,
        presencePenalty: 0,
      });

      setResponse(result.response);
      setEvaluation(result.evaluation);

      try {
        await saveExperiment({
          provider,
          model,
          prompt,
          response: result.response,
          contextLayers: layerStates,
          evaluation: result.evaluation,
        });
        result.experimentId = 'saved';
      } catch {}
    } catch (err: any) {
      setError(err?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    const { response, evaluation } = useAppStore.getState();
    if (!response || !evaluation) return;
    try {
      await saveExperiment({
        provider: response.provider,
        model: response.model,
        prompt: layerStates
          .filter((l) => l.enabled && l.content.trim())
          .map((l) => `=== ${l.label} ===\n${l.content.trim()}`)
          .join('\n\n'),
        response,
        contextLayers: layerStates,
        evaluation,
      });
      setError(null);
    } catch {}
  };

  const totalTokenEstimate = layerStates
    .filter((l) => l.enabled)
    .reduce((sum, l) => sum + estimateTokens(l.content), 0);

  return (
    <div className="p-4 space-y-4 h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Provider</label>
        <select
          value={provider}
          onChange={(e) => handleProviderChange(e.target.value)}
          className="w-full p-2 rounded-lg bg-secondary border border-input text-foreground"
        >
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 rounded-lg bg-secondary border border-input text-foreground"
        >
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          <Key className="h-3 w-3" /> API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Optional — demo mode"
          className="w-full p-2 rounded-lg bg-secondary border border-input text-foreground text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">
          Temperature: {temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">
          Max Tokens: {maxTokens}
        </label>
        <input
          type="range"
          min="100"
          max="8000"
          step="100"
          value={maxTokens}
          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">
          Top P: {topP.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={topP}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="pt-2 space-y-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={resetLayers}
            className="flex-1 py-2 px-3 bg-secondary rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-accent transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-3 bg-secondary rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-accent transition-colors"
          >
            <Save className="h-3 w-3" /> Save
          </button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
        <div className="flex justify-between">
          <span>Context Tokens</span>
          <span className="font-mono">{totalTokenEstimate.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Layers Enabled</span>
          <span className="font-mono">{layerStates.filter((l) => l.enabled).length}/6</span>
        </div>
        <div className="pt-1 text-[10px]">
          <Settings2 className="h-3 w-3 inline mr-1" />
          Demo mode — responses are simulated locally
        </div>
      </div>
    </div>
  );
}
