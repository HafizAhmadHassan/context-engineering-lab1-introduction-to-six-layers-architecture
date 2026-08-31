import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCost: number;
  timestamp: string;
  rawResponse?: Record<string, unknown>;
}

export interface GenerationParams {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences?: string[];
}

export interface ContextLayer {
  id: string;
  label: string;
  content: string;
  enabled: boolean;
  tokenCount: number;
  description: string;
}

export interface EvaluationResult {
  personaAdherence: number;
  policyAccuracy: number;
  empathyTone: number;
  contextAwareness: number;
  actionability: number;
  personalisation: number;
  noHallucination: number;
  completeness: number;
  overall: number;
  reasoning: string;
}

export interface IProvider {
  readonly name: string;
  generate(prompt: string, model: string, params: GenerationParams): Promise<LLMResponse>;
  getAvailableModels(): string[];
  estimateCost(model: string, promptTokens: number, completionTokens: number): number;
  countTokens(text: string, model: string): number;
}

export interface PricingConfig {
  [provider: string]: {
    [model: string]: {
      inputPer1k: number;
      outputPer1k: number;
    };
  };
}

export const PRICING: PricingConfig = {
  openai: {
    'gpt-4o': { inputPer1k: 0.01, outputPer1k: 0.03 },
    'gpt-4o-mini': { inputPer1k: 0.0015, outputPer1k: 0.006 },
    'gpt-4-turbo': { inputPer1k: 0.01, outputPer1k: 0.03 },
    'gpt-3.5-turbo': { inputPer1k: 0.0005, outputPer1k: 0.0015 },
  },
  gemini: {
    'gemini-2.0-flash': { inputPer1k: 0.0001, outputPer1k: 0.0004 },
    'gemini-2.0-flash-lite': { inputPer1k: 0.000075, outputPer1k: 0.0003 },
    'gemini-1.5-flash': { inputPer1k: 0.000075, outputPer1k: 0.0003 },
  },
  anthropic: {
    'claude-sonnet-4-20250514': { inputPer1k: 0.003, outputPer1k: 0.015 },
    'claude-3-5-haiku-latest': { inputPer1k: 0.0008, outputPer1k: 0.004 },
    'claude-3-opus-latest': { inputPer1k: 0.015, outputPer1k: 0.075 },
  },
  groq: {
    'llama-3.3-70b-versatile': { inputPer1k: 0, outputPer1k: 0 },
    'mixtral-8x7b-32768': { inputPer1k: 0, outputPer1k: 0 },
    'gemma2-9b-it': { inputPer1k: 0, outputPer1k: 0 },
    'deepseek-r1-distill-llama-70b': { inputPer1k: 0, outputPer1k: 0 },
  },
};
