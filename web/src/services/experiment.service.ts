'use client';

import type { Experiment, ContextLayer, LLMResponse, EvaluationResult } from '@/types';

const STORAGE_KEY = 'ce_lab_experiments';

function loadAll(): Experiment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Experiment[]) : [];
  } catch {
    return [];
  }
}

function saveAll(experiments: Experiment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
}

export async function getExperiments(page = 1, limit = 20): Promise<{ experiments: Experiment[]; pagination: any }> {
  const all = loadAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const start = (page - 1) * limit;
  return {
    experiments: all.slice(start, start + limit),
    pagination: { page, limit, total: all.length },
  };
}

export async function getExperimentById(id: string): Promise<Experiment> {
  const found = loadAll().find((e) => e._id === id);
  if (!found) throw new Error('Experiment not found');
  return found;
}

export async function deleteExperiment(id: string): Promise<void> {
  saveAll(loadAll().filter((e) => e._id !== id));
}

export async function updateExperiment(id: string, updates: Partial<Experiment>): Promise<Experiment> {
  const all = loadAll();
  const index = all.findIndex((e) => e._id === id);
  if (index === -1) throw new Error('Experiment not found');
  all[index] = { ...all[index], ...updates };
  saveAll(all);
  return all[index];
}

export async function saveExperiment(params: {
  provider: string;
  model: string;
  prompt: string;
  response: LLMResponse;
  contextLayers: ContextLayer[];
  evaluation: EvaluationResult;
}): Promise<Experiment> {
  const all = loadAll();
  const experiment: Experiment = {
    _id: Math.random().toString(36).slice(2, 10),
    userId: 'local',
    provider: params.provider,
    model: params.model,
    prompt: params.prompt,
    response: params.response.content,
    contextLayers: params.contextLayers,
    evaluation: params.evaluation,
    generationParams: { temperature: 0.7, maxTokens: 2000, topP: 1, frequencyPenalty: 0, presencePenalty: 0 },
    promptTokens: params.response.promptTokens,
    completionTokens: params.response.completionTokens,
    totalTokens: params.response.totalTokens,
    latencyMs: params.response.latencyMs,
    estimatedCost: params.response.estimatedCost,
    isFavourite: false,
    tags: [],
    createdAt: new Date().toISOString(),
  };
  saveAll([experiment, ...all]);
  return experiment;
}
