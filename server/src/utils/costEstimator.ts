import { PRICING } from '../types';

export function estimateCost(
  provider: string,
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = PRICING[provider]?.[model];
  if (!pricing) return 0;

  const inputCost = (promptTokens / 1000) * pricing.inputPer1k;
  const outputCost = (completionTokens / 1000) * pricing.outputPer1k;
  return Number((inputCost + outputCost).toFixed(6));
}
