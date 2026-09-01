'use client';

import type { ContextLayer, LLMResponse, EvaluationResult } from '@/types';

export interface GeneratePayload {
  provider: string;
  model: string;
  apiKey: string;
  prompt: string;
  contextLayers: ContextLayer[];
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
  layerStats: {
    enabledCount: number;
    totalTokens: number;
    totalChars: number;
  };
  experimentId?: string;
}

const SAMPLE_RESPONSE_POOL = [
  {
    provider: 'openai',
    model: 'gpt-4o',
    content: `I understand your situation, and I want to help you get this resolved smoothly.

Based on our return policy (v3.2), since the item arrived defective, you qualify for a full refund or replacement within 30 days of delivery.

Here is what I can do for you:

1. **Replacement**: I can ship a new pair of SwiftRun Pro shoes with priority express shipping — you should receive them within 2-3 business days at no extra cost.

2. **Full Refund**: Alternatively, I can process a full refund to your original payment method within 5-7 business days.

Since this is your second defective product this month, I have escalated your case to our senior support team (as per our repeat-defect policy). You will also receive a 10% loyalty discount on your next order as a goodwill gesture.

To move forward, could you please confirm whether you would prefer a replacement or a refund?`,
  },
  {
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    content: `Thank you for reaching out, and I'm sorry your SwiftRun Pro arrived with a torn seam. That's not the experience we want for you.

Good news: since the item is defective, you're covered under our 30-day policy for a full refund or replacement. Here's what I recommend:

**Replacement (recommended)** — Because this is a repeat-defect case, I've escalated to senior support and arranged priority shipping. A new pair would arrive in 2-3 business days at zero cost.

**Refund** — If you'd prefer, a full refund will land back on your card within 5-7 business days.

To process either option, I just need you to confirm your preference. I also want to make sure this hasn't impacted your shopping experience overall — would you like me to apply the loyalty discount I've noted on your account?`,
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomScore(base: number, variance = 8): number {
  return Math.max(55, Math.min(98, Math.round(base + (Math.random() * 2 - 1) * variance)));
}

function buildEvaluation(): EvaluationResult {
  const persona = randomScore(85);
  const policy = randomScore(88);
  const empathy = randomScore(90);
  const context = randomScore(86);
  const action = randomScore(87);
  const personal = randomScore(82);
  const noH = randomScore(92);
  const complete = randomScore(84);
  const overall = Math.round((persona + policy + empathy + context + action + personal + noH + complete) / 8);
  const reasoning =
    'The generated response accurately follows the provided system prompt and policy constraints. It demonstrates strong persona adherence, empathetic tone, and uses the retrieved knowledge to provide concrete, actionable options aligned with company policy.';
  return {
    personaAdherence: persona,
    policyAccuracy: policy,
    empathyTone: empathy,
    contextAwareness: context,
    actionability: action,
    personalisation: personal,
    noHallucination: noH,
    completeness: complete,
    overall,
    reasoning,
  };
}

export async function generate(payload: GeneratePayload): Promise<GenerateResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const sample = pickRandom(SAMPLE_RESPONSE_POOL);
  const promptTokens = Math.ceil(payload.prompt.length / 4);
  const completionTokens = Math.ceil(sample.content.length / 4);
  const latencyMs = 800 + Math.floor(Math.random() * 2500);

  const response: LLMResponse = {
    content: sample.content,
    model: payload.model,
    provider: payload.provider,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    latencyMs,
    estimatedCost: (promptTokens / 1000) * 0.0025 + (completionTokens / 1000) * 0.01,
    timestamp: new Date().toISOString(),
  };

  const enabled = payload.contextLayers.filter((l) => l.enabled);
  const layerStats = {
    enabledCount: enabled.length,
    totalTokens: enabled.reduce((s, l) => s + Math.ceil(l.content.length / 4), 0),
    totalChars: enabled.reduce((s, l) => s + l.content.length, 0),
  };

  return {
    response,
    evaluation: buildEvaluation(),
    prompt: payload.prompt,
    promptTokens,
    layerStats,
  };
}
