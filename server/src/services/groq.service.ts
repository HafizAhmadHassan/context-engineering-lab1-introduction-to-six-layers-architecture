import OpenAI from 'openai';
import { IProvider, LLMResponse, GenerationParams } from '../types';
import { estimateCost } from '../utils/costEstimator';
import { countTokens } from '../utils/tokenCounter';

export class GroqService implements IProvider {
  readonly name = 'groq';
  private client: OpenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  getAvailableModels(): string[] {
    return ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it', 'deepseek-r1-distill-llama-70b'];
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
    const estimatedCost = 0;

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

  estimateCost(_model: string, _promptTokens: number, _completionTokens: number): number {
    return 0;
  }

  countTokens(text: string, _model: string): number {
    return Math.ceil(text.length / 4);
  }
}
