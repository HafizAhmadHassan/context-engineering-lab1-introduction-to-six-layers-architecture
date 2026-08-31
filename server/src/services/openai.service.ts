import OpenAI from 'openai';
import { IProvider, LLMResponse, GenerationParams } from '../types';
import { estimateCost } from '../utils/costEstimator';
import { countTokens } from '../utils/tokenCounter';

export class OpenAIService implements IProvider {
  readonly name = 'openai';
  private client: OpenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new OpenAI({ apiKey });
  }

  getAvailableModels(): string[] {
    return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  }

  async generate(prompt: string, model: string, params: GenerationParams): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      top_p: params.topP,
      frequency_penalty: params.frequencyPenalty,
      presence_penalty: params.presencePenalty,
      stop: params.stopSequences,
    });

    const latencyMs = Date.now() - startTime;
    const content = response.choices[0]?.message?.content || '';
    const usage = response.usage;

    const promptTokens = usage?.prompt_tokens || (await countTokens(prompt, model));
    const completionTokens = usage?.completion_tokens || (await countTokens(content, model));
    const totalTokens = usage?.total_tokens || promptTokens + completionTokens;
    const estimatedCost = estimateCost(this.name, model, promptTokens, completionTokens);

    return {
      content,
      model,
      provider: this.name,
      promptTokens,
      completionTokens,
      totalTokens,
      latencyMs,
      estimatedCost,
      timestamp: new Date().toISOString(),
      rawResponse: response as unknown as Record<string, unknown>,
    };
  }

  estimateCost(model: string, promptTokens: number, completionTokens: number): number {
    return estimateCost(this.name, model, promptTokens, completionTokens);
  }

  countTokens(text: string, model: string): number {
    return Math.ceil(text.length / 4);
  }
}
