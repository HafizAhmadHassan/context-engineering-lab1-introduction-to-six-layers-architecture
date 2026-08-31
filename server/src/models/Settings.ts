import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  userId: mongoose.Types.ObjectId;
  defaultProvider: string;
  favouriteModel: string;
  theme: 'dark' | 'light';
  evaluationEnabled: boolean;
  autoSave: boolean;
  defaultSystemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    defaultProvider: { type: String, default: 'openai' },
    favouriteModel: { type: String, default: 'gpt-4o' },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    evaluationEnabled: { type: Boolean, default: true },
    autoSave: { type: Boolean, default: true },
    defaultSystemPrompt: {
      type: String,
      default: 'You are an expert AI tutor.\n\nAlways answer clearly.\n\nNever hallucinate.\n\nBe factual.\n\nUse markdown.',
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
