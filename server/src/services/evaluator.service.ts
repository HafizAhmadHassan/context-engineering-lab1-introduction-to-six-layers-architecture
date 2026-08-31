import { EvaluationResult, IProvider, GenerationParams } from '../types';

const EVALUATION_PROMPT = `You are an expert AI quality evaluator. Analyze the following interaction and score it across multiple criteria.

Return ONLY valid JSON. No markdown. No explanation outside the JSON.

Context:
{context}

User Query:
{userQuery}

AI Response:
{response}

Score each criterion from 0 to 100:

- personaAdherence: How well does the response maintain the assigned persona?
- policyAccuracy: How factually and policy-compliant is the response?
- empathyTone: How appropriate is the emotional tone?
- contextAwareness: How well does the response use the provided context?
- actionability: How actionable is the advice or information?
- personalisation: How tailored is the response to the user?
- noHallucination: Does the response avoid making up information?
- completeness: How complete and thorough is the response?

{
  "personaAdherence": 0,
  "policyAccuracy": 0,
  "empathyTone": 0,
  "contextAwareness": 0,
  "actionability": 0,
  "personalisation": 0,
  "noHallucination": 0,
  "completeness": 0,
  "overall": 0,
  "reasoning": "summary of evaluation"
}`;

export async function evaluateResponse(
  provider: IProvider,
  model: string,
  context: string,
  userQuery: string,
  response: string
): Promise<EvaluationResult> {
  const prompt = EVALUATION_PROMPT
    .replace('{context}', context)
    .replace('{userQuery}', userQuery)
    .replace('{response}', response);

  try {
    const llmResponse = await provider.generate(prompt, model, {
      temperature: 0.1,
      maxTokens: 1000,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });

    const parsed = parseEvaluationJson(llmResponse.content);
    return parsed;
  } catch (error) {
    return getDefaultEvaluation(`Evaluation failed: ${(error as Error).message}`);
  }
}

function parseEvaluationJson(content: string): EvaluationResult {
  const cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      personaAdherence: clamp(parsed.personaAdherence ?? 0),
      policyAccuracy: clamp(parsed.policyAccuracy ?? 0),
      empathyTone: clamp(parsed.empathyTone ?? 0),
      contextAwareness: clamp(parsed.contextAwareness ?? 0),
      actionability: clamp(parsed.actionability ?? 0),
      personalisation: clamp(parsed.personalisation ?? 0),
      noHallucination: clamp(parsed.noHallucination ?? 0),
      completeness: clamp(parsed.completeness ?? 0),
      overall: clamp(parsed.overall ?? 0),
      reasoning: parsed.reasoning || 'No reasoning provided',
    };
  } catch {
    return getDefaultEvaluation('Failed to parse evaluation JSON');
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getDefaultEvaluation(reasoning: string): EvaluationResult {
  return {
    personaAdherence: 0,
    policyAccuracy: 0,
    empathyTone: 0,
    contextAwareness: 0,
    actionability: 0,
    personalisation: 0,
    noHallucination: 0,
    completeness: 0,
    overall: 0,
    reasoning,
  };
}
