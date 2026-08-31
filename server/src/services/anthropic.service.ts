import Anthropic from '@anthropic-ai/sdk';
import { IProvider, LLMResponse, GenerationParams } from '../types';
import { estimateCost } from '../utils/costEstimator';
import { countTokens } from '../utils/tokenCounter';

export class AnthropicService implements IProvider {
  readonly name = 'anthropic';
  private client: Anthropic;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Anthropic({ apiKey });
  }

  getAvailableModels(): string[] {
    return ['claude-sonnet-4-20250514', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'];
  }

  async generate(prompt: string, model: string, params: GenerationParams): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await this.client.messages.create({
      model,
      max_tokens: params.maxTokens,
      temperature: params.temperature,
      top_p: params.topP,
      stop_sequences: params.stopSequences,
      messages: [{ role: 'user', content: prompt }],
    });

    const latencyMs = Date.now() - startTime;
    const content = response.content.map((block) => ('text' in block ? block.text : '')).join('');
    const usage = response.usage;

    const promptTokens = usage?.input_tokens || (await countTokens(prompt, model));
    const completionTokens = usage?.output_tokens || (await countTokens(content, model));
    const totalTokens = promptTokens + completionTokens;
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
      rawResponse: { id: response.id, stopReason: response.stop_reason, type: response.type },
    };
  }

  estimateCost(model: string, promptTokens: number, completionTokens: number): number {
    return estimateCost(this.name, model, promptTokens, completionTokens);
  }

  countTokens(text: string, model: string): number {
    return Math.ceil(text.length / 4);
  }
}
