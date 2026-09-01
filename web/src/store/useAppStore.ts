'use client';

import { create } from 'zustand';
import type { ContextLayer, LLMResponse, EvaluationResult, User, UserSettings } from '@/types';
import { DEFAULT_LAYERS, estimateTokens, type UseCasePreset, type PresetLayer } from '@/utils/format';

interface AppState {
  user: User | null;
  settings: UserSettings | null;
  isAuthenticated: boolean;
  isGenerating: boolean;
  layerStates: ContextLayer[];
  response: LLMResponse | null;
  evaluation: EvaluationResult | null;
  error: string | null;

  setUser: (user: User | null) => void;
  setSettings: (settings: UserSettings | null) => void;
  setAuthenticated: (value: boolean) => void;
  setGenerating: (value: boolean) => void;
  setError: (error: string | null) => void;
  setResponse: (response: LLMResponse | null) => void;
  setEvaluation: (evaluation: EvaluationResult | null) => void;

  updateLayer: (id: string, updates: Partial<ContextLayer>) => void;
  toggleLayer: (id: string) => void;
  resetLayers: () => void;
  setLayersFromExperiment: (layers: ContextLayer[]) => void;
  loadUseCase: (preset: UseCasePreset) => void;

  clearGeneration: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  settings: null,
  isAuthenticated: false,
  isGenerating: false,
  layerStates: DEFAULT_LAYERS.map((l) => ({ ...l, tokenCount: estimateTokens(l.content) })),
  response: null,
  evaluation: null,
  error: null,

  setUser: (user) => set({ user }),
  setSettings: (settings) => set({ settings }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setGenerating: (value) => set({ isGenerating: value }),
  setError: (error) => set({ error }),
  setResponse: (response) => set({ response }),
  setEvaluation: (evaluation) => set({ evaluation }),

  updateLayer: (id, updates) =>
    set((state) => ({
      layerStates: state.layerStates.map((layer) =>
        layer.id === id ? { ...layer, ...updates, tokenCount: updates.content !== undefined ? estimateTokens(updates.content) : layer.tokenCount } : layer
      ),
    })),

  toggleLayer: (id) =>
    set((state) => ({
      layerStates: state.layerStates.map((layer) =>
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      ),
    })),

  resetLayers: () =>
    set({
      layerStates: DEFAULT_LAYERS.map((l) => ({ ...l, tokenCount: estimateTokens(l.content) })),
    }),

  setLayersFromExperiment: (layers) => set({ layerStates: layers }),

  loadUseCase: (preset) =>
    set({
      layerStates: preset.layers.map((l) => {
        const defaults = DEFAULT_LAYERS.find((d) => d.id === l.id);
        return { ...defaults, ...l, description: l.description || defaults?.description || '', tokenCount: estimateTokens(l.content) };
      }),
      response: null,
      evaluation: null,
      error: null,
    }),

  clearGeneration: () => set({ response: null, evaluation: null, error: null }),
}));
