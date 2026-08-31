import { ContextLayer } from '../types';
import { estimateTokens } from '../utils/tokenCounter';

const DEFAULT_LAYERS: ContextLayer[] = [
  {
    id: 'system_prompt',
    label: 'System Prompt',
    description: 'Foundation instructions that define the AI\'s behaviour, persona, and constraints.',
    content: 'You are an expert AI tutor.\n\nAlways answer clearly.\n\nNever hallucinate.\n\nBe factual.\n\nUse markdown.',
    enabled: true,
    tokenCount: 0,
  },
  {
    id: 'user_input',
    label: 'User Input',
    description: 'The primary user query or instruction.',
    content: '',
    enabled: true,
    tokenCount: 0,
  },
  {
    id: 'conversation_history',
    label: 'Conversation History',
    description: 'Prior exchanges between the user and AI providing conversation continuity.',
    content: '',
    enabled: false,
    tokenCount: 0,
  },
  {
    id: 'retrieved_knowledge',
    label: 'Retrieved Knowledge (RAG)',
    description: 'Relevant documents or data retrieved from external knowledge sources.',
    content: '',
    enabled: false,
    tokenCount: 0,
  },
  {
    id: 'recent_conversation',
    label: 'Recent Conversation',
    description: 'Latest exchanges providing immediate conversation context.',
    content: '',
    enabled: false,
    tokenCount: 0,
  },
  {
    id: 'state_memory',
    label: 'State & Memory',
    description: 'User profile, preferences, session memory, and runtime state.',
    content: '',
    enabled: false,
    tokenCount: 0,
  },
];

export function getDefaultLayers(): ContextLayer[] {
  return DEFAULT_LAYERS.map((layer) => ({
    ...layer,
    tokenCount: estimateTokens(layer.content),
  }));
}

export function buildPrompt(layers: ContextLayer[]): string {
  return layers
    .filter((l) => l.enabled && l.content.trim())
    .map((l) => `=== ${l.label} ===\n${l.content.trim()}`)
    .join('\n\n');
}

export function getLayerStats(layers: ContextLayer[]): {
  enabledCount: number;
  totalTokens: number;
  totalChars: number;
} {
  const enabled = layers.filter((l) => l.enabled);
  return {
    enabledCount: enabled.length,
    totalTokens: enabled.reduce((sum, l) => sum + l.tokenCount, 0),
    totalChars: enabled.reduce((sum, l) => sum + l.content.length, 0),
  };
}
