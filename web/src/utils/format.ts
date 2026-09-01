import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ContextLayer } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCost(cost: number): string {
  if (cost < 0.001) return '$0.0000';
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatTokens(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export type PresetLayer = Omit<ContextLayer, 'description'> & { description?: string };

export interface UseCasePreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  layers: PresetLayer[];
}

export const USE_CASE_PRESETS: UseCasePreset[] = [
  {
    id: 'customer_support',
    label: 'Customer Support',
    description: 'Refund request with policy lookup',
    icon: '🎧',
    layers: [
      {
        id: 'system_prompt',
        label: 'System Prompt',
        description: 'Foundation instructions that define the AI\'s behaviour, persona, and constraints.',
        content: 'You are a professional customer support agent for ShopEase.\n\nBe empathetic, polite, and solution-oriented.\n\nFollow company policies at all times.\n\nNever make promises outside the stated policy.\n\nAlways verify customer details before processing requests.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'user_input',
        label: 'User Input',
        description: 'The primary user query or instruction.',
        content: 'I ordered a pair of running shoes (order #SH-98472) 10 days ago but they arrived with a torn seam. I want a full refund or replacement. This is the second defective product I have received from your store this month.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'conversation_history',
        label: 'Conversation History',
        description: 'Prior exchanges between the user and AI providing conversation continuity.',
        content: 'User: What is your return policy for defective items?\nAgent: We accept returns within 30 days of delivery for defective items. You can get a full refund or replacement.\nUser: I have a defective product I received today.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'retrieved_knowledge',
        label: 'Retrieved Knowledge (RAG)',
        description: 'Relevant documents or data retrieved from external knowledge sources.',
        content: 'Company Return Policy (v3.2):\n- Defective items: Full refund or replacement within 30 days\n- Refunds processed within 5-7 business days\n- Customer must provide photo evidence\n- Repeat defect cases (>1 in 6 months): Escalate to senior support\n- VIP customers (Tier 2+): Priority replacement shipping\n\nProduct Info: Shoe Model "SwiftRun Pro" — known defect rate: 0.3%',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'recent_conversation',
        label: 'Recent Conversation',
        description: 'Latest exchanges providing immediate conversation context.',
        content: 'Agent: I am sorry to hear about the defect. Let me look up your order SH-98472.\nAgent: I can see this is the second defective item for you this month. I will escalate this to our senior team.\nUser: I really want a smooth resolution this time.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'state_memory',
        label: 'State & Memory',
        description: 'User profile, preferences, session memory, and runtime state.',
        content: 'Customer Profile:\n- Name: Sarah Chen\n- Membership: VIP Tier 2 (Gold)\n- Joined: 14 months ago\n- Total Orders: 23\n- Previous Returns: 2 (both resolved)\n- Preferred Contact: Email\n- Language: English\n\nSession: Support ticket #TK-88231 | Open 12m',
        enabled: true,
        tokenCount: 0,
      },
    ],
  },
  {
    id: 'code_review',
    label: 'Code Review',
    description: 'Python bug fix with style guide',
    icon: '💻',
    layers: [
      {
        id: 'system_prompt',
        label: 'System Prompt',
        content: 'You are a senior Python code reviewer.\n\nAnalyse code for bugs, performance issues, and style violations.\n\nProvide actionable, specific feedback.\n\nFollow PEP 8 and modern Python best practices.\n\nSuggest concrete fixes with code examples.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'user_input',
        label: 'User Input',
        content: 'def process_data(items, threshold):\n    result = []\n    for i in range(len(items)):\n        if items[i] > threshold:\n            result.append(items[i] * 2)\n        else:\n            result.append(items[i])\n    return sorted(result, reverse=True)[:10]',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'conversation_history',
        label: 'Conversation History',
        content: 'Author: I wrote this function to filter and sort data but it is slow for large lists.\nReviewer: The loop pattern can be optimised. Let me look at the full context.\nAuthor: It takes ~3 seconds for a list of 100k items.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'retrieved_knowledge',
        label: 'Retrieved Knowledge (RAG)',
        content: 'PEP 8 Style Guide:\n- Use list comprehensions over map/filter\n- Maximum line length: 79 characters\n- Use descriptive variable names\n\nProject Conventions:\n- Type hints required for all public functions\n- Use pathlib over os.path\n- NumPy optional for numerical operations\n\nTeam Standards v2.1:\n- All PRs require 2 approvals\n- Unit tests mandatory for new functions',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'recent_conversation',
        label: 'Recent Conversation',
        content: 'Reviewer: The main concern here is O(n log n) sorting on every call.\nAuthor: Would memoization help?\nReviewer: Possibly, but algorithmic improvement is better.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'state_memory',
        label: 'State & Memory',
        content: 'Project: DataPipeline v2.4\nRepository: github.com/company/data-pipeline\nBranch: feature/optimise-processing\n\nDeveloper: Alex M. (Mid-level, 2 yrs at company)\nLast Review: 3 days ago — API endpoint optimisation (approved)\n\nPriority: Medium | Deadline: Next sprint (Fri)',
        enabled: true,
        tokenCount: 0,
      },
    ],
  },
  {
    id: 'medical_info',
    label: 'Medical Triage',
    description: 'Symptom assessment with guidelines',
    icon: '🏥',
    layers: [
      {
        id: 'system_prompt',
        label: 'System Prompt',
        content: 'You are a medical triage assistant.\n\nIMPORTANT: You are NOT a doctor. This is not medical advice.\n\nAlways include a disclaimer to seek professional medical help for emergencies.\n\nUse the provided medical guidelines to assess symptom urgency.\n\nBe thorough but clear. Err on the side of caution.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'user_input',
        label: 'User Input',
        content: 'I have had a persistent headache for 3 days. It is on the right side of my head, behind my eye. I also feel nauseous and am sensitive to light. I have never had migraines before. I am 34 years old, generally healthy.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'conversation_history',
        label: 'Conversation History',
        content: 'Patient: I have been having headaches.\nNurse: When did they start?\nPatient: About 3 days ago.\nNurse: Any other symptoms like fever or vision changes?',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'retrieved_knowledge',
        label: 'Retrieved Knowledge (RAG)',
        content: 'Clinical Triage Guidelines (v5.1):\n\nRed Flag Symptoms (Seek Emergency):\n- Sudden severe thunderclap headache\n- Headache with fever and neck stiffness\n- Headache after head injury\n- New neurological symptoms\n\nMigraine Diagnostic Criteria (ICHD-3):\n- Headache lasting 4-72 hours\n- Unilateral location\n- Pulsating quality\n- Nausea/vomiting\n- Photophobia/phonophobia\n\nCommon Triggers: stress, dehydration, sleep deprivation, hormonal changes',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'recent_conversation',
        label: 'Recent Conversation',
        content: 'Nurse: Are you taking any medication?\nPatient: I tried ibuprofen but it does not help much.\nNurse: Any family history of migraines?\nPatient: My mother gets them.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'state_memory',
        label: 'State & Memory',
        content: 'Patient Profile:\n- Age: 34\n- Sex: Female\n- Known Conditions: None\n- Allergies: Penicillin\n- Medications: None regular\n- Last Visit: Annual checkup 6 months ago (normal)\n\nSession: Triage chat initiated | Duration: 8m\nUrgency Assessment: Non-emergent (scheduled consult)',
        enabled: true,
        tokenCount: 0,
      },
    ],
  },
  {
    id: 'creative_writing',
    label: 'Creative Writing',
    description: 'Story feedback with literary analysis',
    icon: '✍️',
    layers: [
      {
        id: 'system_prompt',
        label: 'System Prompt',
        content: 'You are an experienced creative writing coach and editor.\n\nProvide constructive, encouraging feedback on creative writing.\n\nAnalyse narrative structure, character development, pacing, and prose style.\n\nSuggest improvements while preserving the writer\'s unique voice.\n\nReference literary techniques and devices where relevant.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'user_input',
        label: 'User Input',
        content: 'CHAPTER 1: THE LAST TRAIN\n\nElara stepped onto the platform as the 9:15 pulled away, its headlight dissolving into the fog like a dying star. She had missed it. Again. \n\nHer phone buzzed — Mother. She let it ring.\n\nThe station clock read 9:17. The next train was at 5:47 AM. Seven hours in this godforsaken waiting room with its flickering fluorescent lights and the smell of stale coffee.\n\n"Rough night?"\n\nShe turned. A man in a weathered coat stood by the ticket machine, holding a paper cup. Steam curled from it like a question mark.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'conversation_history',
        label: 'Conversation History',
        content: 'Writer: This is the opening chapter of my novel "The Distance Between Us."\nEditor: The atmosphere is strong. Let us focus on pacing in the first draft.\nWriter: I am worried the opening is too slow.\nEditor: Slow openings work if the prose carries it.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'retrieved_knowledge',
        label: 'Retrieved Knowledge (RAG)',
        content: 'Literary Techniques Reference:\n- In medias res: Starting in the middle of action\n- Showing vs Telling: Use sensory details over exposition\n- Chekhov\'s Gun: Every element should be necessary\n- Pacing: Short sentences = tension, long sentences = reflection\n\nGenre: Literary Fiction / Contemporary Drama\nTone: Melancholic, atmospheric, introspective\n\nMarket Trends 2026:\n- Openings under 300 words preferred by agents\n- Strong voice sells more than plot\n- Dual timeline narratives are popular',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'recent_conversation',
        label: 'Recent Conversation',
        content: 'Editor: The imagery is evocative. "Steam curled like a question mark" — excellent.\nWriter: Thank you. I want the stranger to be a catalyst.\nEditor: Good instinct. Introduce the central conflict through interaction, not exposition.',
        enabled: true,
        tokenCount: 0,
      },
      {
        id: 'state_memory',
        label: 'State & Memory',
        content: 'Writer Profile:\n- Name: James K.\n- Experience: 3 years writing (1st novel attempt)\n- Genre: Literary fiction\n- Goal: Submit to literary agents in 6 months\n- Previous Feedback: "Strong prose, needs plot structure"\n\nProject: "The Distance Between Us"\n- Word Count So Far: 14,200 / 80,000 target\n- Current Chapter: 1 (4th draft revision)\n- Deadline: Self-imposed, 3 months',
        enabled: true,
        tokenCount: 0,
      },
    ],
  },
];

export const DEFAULT_LAYERS: ContextLayer[] = [
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
