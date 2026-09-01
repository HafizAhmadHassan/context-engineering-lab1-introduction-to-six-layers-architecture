export interface ContextLayer {
  id: string;
  label: string;
  description: string;
  content: string;
  enabled: boolean;
  tokenCount: number;
}

export interface GenerationParams {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
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

export interface Experiment {
  _id: string;
  userId: string;
  provider: string;
  model: string;
  prompt: string;
  response: string;
  contextLayers: ContextLayer[];
  evaluation: EvaluationResult;
  generationParams: GenerationParams;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCost: number;
  isFavourite: boolean;
  tags: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserSettings {
  _id: string;
  userId: string;
  defaultProvider: string;
  favouriteModel: string;
  theme?: 'dark' | 'light';
  evaluationEnabled: boolean;
  autoSave: boolean;
  defaultSystemPrompt: string;
}

export interface LayerStats {
  enabledCount: number;
  totalTokens: number;
  totalChars: number;
}
