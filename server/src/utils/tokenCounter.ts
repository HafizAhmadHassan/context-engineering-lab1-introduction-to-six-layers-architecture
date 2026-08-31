const MODEL_ENCODINGS: Record<string, string> = {
  'gpt-4o': 'o200k_base',
  'gpt-4o-mini': 'o200k_base',
  'gpt-4-turbo': 'cl100k_base',
  'gpt-3.5-turbo': 'cl100k_base',
};

let tiktokenModule: any = null;

async function getTiktoken(): Promise<any> {
  if (!tiktokenModule) {
    try {
      tiktokenModule = await import('tiktoken');
    } catch {
      return null;
    }
  }
  return tiktokenModule;
}

export async function countTokens(text: string, model: string): Promise<number> {
  const tk = await getTiktoken();
  if (!tk) {
    return Math.ceil(text.length / 4);
  }

  const encodingName = MODEL_ENCODINGS[model] || 'cl100k_base';
  try {
    const encoding = tk.get_encoding(encodingName);
    const tokens = encoding.encode(text);
    return tokens.length;
  } catch {
    return Math.ceil(text.length / 4);
  }
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
