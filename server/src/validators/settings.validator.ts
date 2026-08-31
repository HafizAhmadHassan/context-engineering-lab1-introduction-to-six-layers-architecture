import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    defaultProvider: z.enum(['openai', 'gemini']).optional(),
    favouriteModel: z.string().optional(),
    theme: z.enum(['dark', 'light']).optional(),
    evaluationEnabled: z.boolean().optional(),
    autoSave: z.boolean().optional(),
    defaultSystemPrompt: z.string().optional(),
  }),
});
