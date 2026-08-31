import { z } from 'zod';

export const createExperimentSchema = z.object({
  body: z.object({
    provider: z.string().min(1),
    model: z.string().min(1),
    prompt: z.string().min(1),
    response: z.string(),
    contextLayers: z.array(z.any()),
    evaluation: z.object({
      personaAdherence: z.number(),
      policyAccuracy: z.number(),
      empathyTone: z.number(),
      contextAwareness: z.number(),
      actionability: z.number(),
      personalisation: z.number(),
      noHallucination: z.number(),
      completeness: z.number(),
      overall: z.number(),
      reasoning: z.string(),
    }),
    generationParams: z.object({
      temperature: z.number(),
      maxTokens: z.number(),
      topP: z.number(),
    }),
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
    latencyMs: z.number(),
    estimatedCost: z.number(),
    isFavourite: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const updateExperimentSchema = z.object({
  body: z.object({
    isFavourite: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
