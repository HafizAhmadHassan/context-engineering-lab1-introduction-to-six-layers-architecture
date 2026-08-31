import api from './api';
import type { Experiment, LayerStats, LLMResponse, EvaluationResult } from '@/types';

export interface GeneratePayload {
  provider: string;
  model: string;
  apiKey: string;
  prompt: string;
  contextLayers: any[];
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface GenerateResponse {
  response: LLMResponse;
  evaluation: EvaluationResult;
  prompt: string;
  promptTokens: number;
  layerStats: LayerStats;
  experimentId?: string;
}

export async function generate(payload: GeneratePayload): Promise<GenerateResponse> {
  const { data } = await api.post('/generate', payload);
  return data;
}

export async function getExperiments(page = 1, limit = 20): Promise<{ experiments: Experiment[]; pagination: any }> {
  const { data } = await api.get(`/experiments?page=${page}&limit=${limit}`);
  return data;
}

export async function getExperimentById(id: string): Promise<Experiment> {
  const { data } = await api.get(`/experiments/${id}`);
  return data.experiment;
}

export async function deleteExperiment(id: string): Promise<void> {
  await api.delete(`/experiments/${id}`);
}

export async function updateExperiment(id: string, updates: Partial<Experiment>): Promise<Experiment> {
  const { data } = await api.patch(`/experiments/${id}`, updates);
  return data.experiment;
}
