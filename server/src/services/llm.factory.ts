import { IProvider } from '../types';
import { OpenAIService } from './openai.service';
import { GeminiService } from './gemini.service';
import { AnthropicService } from './anthropic.service';
import { GroqService } from './groq.service';

const providers: Record<string, new (apiKey: string) => IProvider> = {
  openai: OpenAIService,
  gemini: GeminiService,
  anthropic: AnthropicService,
  groq: GroqService,
};

export function createProvider(providerName: string, apiKey: string): IProvider {
  const ProviderClass = providers[providerName];
  if (!ProviderClass) {
    throw new Error(`Unknown provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
  }
  return new ProviderClass(apiKey);
}

export function getAvailableProviders(): string[] {
  return Object.keys(providers);
}

export function getModelsForProvider(providerName: string): string[] {
  const ProviderClass = providers[providerName];
  if (!ProviderClass) return [];
  const instance = new ProviderClass('dummy-key');
  return instance.getAvailableModels();
}
