import { Response, NextFunction } from 'express';
import { AuthRequest, ContextLayer } from '../types';
import { createProvider } from '../services/llm.factory';
import { buildPrompt, getLayerStats } from '../services/prompt.service';
import { evaluateResponse } from '../services/evaluator.service';
import { Experiment } from '../models/Experiment';
import { env } from '../config/env';
import { logger } from '../utils/logger';

function getServerApiKey(providerName: string): string {
  switch (providerName) {
    case 'openai': return env.openaiApiKey;
    case 'gemini': return env.geminiApiKey;
    case 'anthropic': return env.anthropicApiKey;
    case 'groq': return env.groqApiKey;
    default: return '';
  }
}

export async function generate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const startTime = Date.now();

  try {
    const {
      provider: providerName,
      model,
      apiKey: clientApiKey,
      contextLayers,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
    } = req.body;

    const apiKey = clientApiKey || getServerApiKey(providerName);
    const provider = createProvider(providerName, apiKey);

    const layers: ContextLayer[] = contextLayers;
    const prompt = buildPrompt(layers);
    const promptTokens = await provider.countTokens(prompt, model);

    const response = await provider.generate(prompt, model, {
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
    });

    const evaluatorProvider = createProvider(providerName, clientApiKey || getServerApiKey(providerName));
    const contextPreview = layers
      .filter((l) => l.enabled)
      .map((l) => `${l.label}: ${l.content.slice(0, 200)}`)
      .join('\n');
    const userInput = layers.find((l) => l.id === 'user_input')?.content || '';

    const evaluation = await evaluateResponse(evaluatorProvider, model, contextPreview, userInput, response.content);

    const layerStats = getLayerStats(layers);

    let experimentId: string | undefined;
    if (req.user) {
      const experiment = await Experiment.create({
        userId: req.user.userId,
        provider: providerName,
        modelName: model,
        prompt,
        response: response.content,
        contextLayers: layers,
        evaluation,
        generationParams: { temperature, maxTokens, topP },
        promptTokens: response.promptTokens,
        completionTokens: response.completionTokens,
        totalTokens: response.totalTokens,
        latencyMs: response.latencyMs,
        estimatedCost: response.estimatedCost,
      });
      experimentId = String(experiment._id);
    }

    const totalTime = Date.now() - startTime;
    logger.info('Generation completed', {
      provider: providerName,
      model,
      latency: response.latencyMs,
      tokens: response.totalTokens,
      cost: response.estimatedCost,
      evaluationTime: totalTime,
    });

    res.json({
      response,
      evaluation,
      prompt,
      promptTokens,
      layerStats,
      experimentId,
    });
  } catch (error) {
    logger.error('Generation failed:', error);
    next(error);
  }
}
