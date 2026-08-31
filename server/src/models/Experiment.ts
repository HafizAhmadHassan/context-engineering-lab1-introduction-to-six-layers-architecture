import mongoose, { Document, Schema } from 'mongoose';

export interface IExperiment extends Document {
  userId: mongoose.Types.ObjectId;
  provider: string;
  modelName: string;
  prompt: string;
  response: string;
  contextLayers: {
    id: string;
    label: string;
    content: string;
    enabled: boolean;
    tokenCount: number;
  }[];
  evaluation: {
    personaAdherence: number;
    policyAccuracy: number;
    empathyTone: number;
    contextAwareness: number;
    actionability: number;
    personalisation: number;
    noHallucination: number;
    completeness: number;
    overall: number;
    reasoning: string;
  };
  generationParams: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCost: number;
  isFavourite: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const experimentSchema = new Schema<IExperiment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: { type: String, required: true },
    modelName: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String, default: '' },
    contextLayers: [
      {
        id: String,
        label: String,
        content: String,
        enabled: Boolean,
        tokenCount: Number,
      },
    ],
    evaluation: {
      personaAdherence: { type: Number, default: 0 },
      policyAccuracy: { type: Number, default: 0 },
      empathyTone: { type: Number, default: 0 },
      contextAwareness: { type: Number, default: 0 },
      actionability: { type: Number, default: 0 },
      personalisation: { type: Number, default: 0 },
      noHallucination: { type: Number, default: 0 },
      completeness: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
      reasoning: { type: String, default: '' },
    },
    generationParams: {
      temperature: { type: Number, default: 0.7 },
      maxTokens: { type: Number, default: 2000 },
      topP: { type: Number, default: 1.0 },
    },
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    latencyMs: { type: Number, default: 0 },
    estimatedCost: { type: Number, default: 0 },
    isFavourite: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

experimentSchema.index({ userId: 1, createdAt: -1 });
experimentSchema.index({ userId: 1, isFavourite: 1 });

export const Experiment = mongoose.model<IExperiment>('Experiment', experimentSchema);
