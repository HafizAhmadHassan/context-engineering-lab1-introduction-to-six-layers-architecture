import { z } from 'zod';

export const generateSchema = z.object({
  body: z.object({
    provider: z.enum(['openai', 'gemini', 'anthropic', 'groq']),
    model: z.string().min(1),
    apiKey: z.string().optional(),
    prompt: z.string().min(1, 'Prompt is required'),
    contextLayers: z.array(z.object({
      id: z.string(),
      label: z.string(),
      content: z.string(),
      enabled: z.boolean(),
      tokenCount: z.number(),
    })),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(100).max(8000).default(2000),
    topP: z.number().min(0).max(1).default(1),
    frequencyPenalty: z.number().min(-2).max(2).default(0),
    presencePenalty: z.number().min(-2).max(2).default(0),
  }),
});
