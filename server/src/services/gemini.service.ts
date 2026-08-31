import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IProvider, LLMResponse, GenerationParams } from '../types';
import { estimateCost } from '../utils/costEstimator';
import { countTokens } from '../utils/tokenCounter';

export class GeminiService implements IProvider {
  readonly name = 'gemini';
  private genAI: GoogleGenerativeAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  getAvailableModels(): string[] {
    return ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
  }

  private getModel(modelName: string): GenerativeModel {
    return this.genAI.getGenerativeModel({ model: modelName });
  }

  async generate(prompt: string, model: string, params: GenerationParams): Promise<LLMResponse> {
    const startTime = Date.now();
    const geminiModel = this.getModel(model);

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: params.temperature,
        maxOutputTokens: params.maxTokens,
        topP: params.topP,
        stopSequences: params.stopSequences,
      },
    });

    const latencyMs = Date.now() - startTime;
    const response = result.response;
    const content = response.text();
    const usageMetadata = response.usageMetadata;

    const promptTokens = usageMetadata?.promptTokenCount || (await countTokens(prompt, model));
    const completionTokens = usageMetadata?.candidatesTokenCount || (await countTokens(content, model));
    const totalTokens = usageMetadata?.totalTokenCount || promptTokens + completionTokens;
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
      rawResponse: { finishReason: response.candidates?.[0]?.finishReason },
    };
  }

  estimateCost(model: string, promptTokens: number, completionTokens: number): number {
    return estimateCost(this.name, model, promptTokens, completionTokens);
  }

  countTokens(text: string, model: string): number {
    return Math.ceil(text.length / 4);
  }
}
