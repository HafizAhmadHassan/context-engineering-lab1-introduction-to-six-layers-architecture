import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  reasoning: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'In the LLM-as-an-OS analogy, what corresponds to RAM?',
    options: [
      'System prompt',
      'The context window',
      'Training data',
      'Model weights',
    ],
    correctIndex: 1,
    reasoning: 'The context window is analogous to RAM because it holds the working memory available to the LLM during a single inference call.',
  },
  {
    id: 2,
    question: 'What corresponds to the file system — accessed on demand?',
    options: [
      'System prompt',
      'Model parameters',
      'RAG databases and vector stores',
      'Tokenizer vocabulary',
    ],
    correctIndex: 2,
    reasoning: 'RAG databases and vector stores are retrieved on demand rather than always loaded, similar to how a file system pages data in when needed.',
  },
  {
    id: 3,
    question: 'Traditional Prompt Engineering primarily optimizes:',
    options: [
      'System prompt',
      'The user prompt',
      'Model architecture',
      'Training data',
    ],
    correctIndex: 1,
    reasoning: 'Traditional prompt engineering focuses on crafting the user prompt to elicit better responses, rather than the broader context layer.',
  },
  {
    id: 4,
    question: 'Which is not one of the six context elements?',
    options: [
      'System prompts',
      'Conversation history',
      'RAG',
      'Model temperature',
    ],
    correctIndex: 3,
    reasoning: 'Model temperature controls output randomness and is part of decoding parameters, not a context element.',
  },
  {
    id: 5,
    question: 'Why can an LLM application degrade over time without code changes?',
    options: [
      'Model drift',
      'Data leakage',
      'Context Rot',
      'Token fragmentation',
    ],
    correctIndex: 2,
    reasoning: 'Even before the context window overflows, accumulated irrelevant or conflicting information can reduce response quality — this is Context Rot.',
  },
  {
    id: 6,
    question: 'What is the approximate token count for a short phrase like "context engineering"?',
    options: [
      '1 token',
      '2 tokens',
      '5 tokens',
      '10 tokens',
    ],
    correctIndex: 1,
    reasoning: 'Using Byte Pair Encoding (BPE), roughly 1 word ≈ 1 token, so "context engineering" would be about 2 tokens.',
  },
  {
    id: 7,
    question: 'How large is a 1-million-token context window approximately?',
    options: [
      '7,000 words — 30 pages',
      '70,000 words — 300 pages',
      '700,000 words — ~3,000 pages',
      '7,000,000 words — 30,000 pages',
    ],
    correctIndex: 2,
    reasoning: 'A 1-million-token context window holds roughly 700,000 words or approximately 3,000 pages of text.',
  },
  {
    id: 8,
    question: 'What happens if you fill a 128K-token context with 120K tokens of retrieved documents?',
    options: [
      'Improved accuracy across all tasks',
      'Increased noise, degraded response quality, higher latency',
      'Reduced computational cost',
      'The model automatically summarizes the excess',
    ],
    correctIndex: 1,
    reasoning: 'Simply adding more context does not guarantee better results — more retrieved documents often introduce noise, degrade quality, and increase latency.',
  },
  {
    id: 9,
    question: 'Which of the following is not a common cause of Context Rot?',
    options: [
      'Stale information',
      'Mixed tokenization schemes',
      'Contradictory instructions',
      'Irrelevant context reducing the signal-to-noise ratio',
    ],
    correctIndex: 1,
    reasoning: 'Common causes of Context Rot include stale information, contradictory instructions, and irrelevant context — mixed tokenization schemes are not a primary cause.',
  },
  {
    id: 10,
    question: 'Which statement best differentiates Context Engineering from Prompt Engineering?',
    options: [
      'Prompt Engineering uses more tokens overall',
      'Context Engineering includes dynamic components such as RAG, memory, and tool outputs',
      'Context Engineering only works with large models',
      'Prompt Engineering is fully automated',
    ],
    correctIndex: 1,
    reasoning: 'Context Engineering encompasses multiple dynamic components (system prompts, conversation history, RAG, tool outputs, memory, structured context), while Prompt Engineering mainly focuses on crafting the user prompt.',
  },
  {
    id: 11,
    question: 'Why can a chatbot become less empathetic after many conversation turns?',
    options: [
      'The model forgets how to be empathetic',
      'The system prompt gets diluted as more conversation accumulates in context',
      'Empathy requires a larger model than the one deployed',
      'The token limit causes the model to respond faster',
    ],
    correctIndex: 1,
    reasoning: 'As conversation history grows, the system prompt occupies a smaller fraction of the context window, reducing its influence on the model\'s behavior.',
  },
  {
    id: 12,
    question: 'Which retrieved document is most vulnerable to the Lost-in-the-Middle Effect?',
    options: [
      'Documents placed at the very beginning of the prompt',
      'Documents placed at the very end of the prompt',
      'Documents placed near the middle of the prompt',
      'Short documents regardless of position',
    ],
    correctIndex: 2,
    reasoning: 'Information placed near the middle of the prompt typically receives less attention from the model, making it the most vulnerable position.',
  },
  {
    id: 13,
    question: 'What does a RAG pipeline primarily do?',
    options: [
      'Generate responses entirely from the model\'s parameters',
      'Select relevant information from a larger corpus to include in the prompt',
      'Fine-tune the model on new training data',
      'Re-rank all model outputs before returning them',
    ],
    correctIndex: 1,
    reasoning: 'A RAG pipeline is fundamentally a retrieval and selection mechanism — it finds relevant information from a corpus and includes it in the prompt for the LLM.',
  },
];

export function Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: optionIndex };
      return next;
    });
    setShowResults(prev => ({ ...prev, [questionId]: true }));
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(q => answers[q.id] === q.correctIndex).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Context Engineering Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Review the main concepts from the lecture.
          </p>
        </div>
        {answeredCount > 0 && (
          <div className="text-sm font-medium px-4 py-2 rounded-lg bg-primary/10 text-primary">
            {correctCount} / {answeredCount} correct
          </div>
        )}
      </div>

      {questions.map(q => {
        const selected = answers[q.id];
        const show = showResults[q.id];

        return (
          <div key={q.id} className="border border-border rounded-xl p-5 space-y-4 bg-card">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                {q.id}
              </span>
              <p className="font-medium leading-relaxed">{q.question}</p>
            </div>

            <div className="space-y-2 pl-10">
              {q.options.map((opt, idx) => {
                let variant = 'border-border bg-transparent hover:bg-accent';

                if (show) {
                  if (idx === q.correctIndex) {
                    variant = 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400';
                  } else if (idx === selected && idx !== q.correctIndex) {
                    variant = 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400';
                  } else {
                    variant = 'border-border/50 bg-transparent opacity-60';
                  }
                } else if (idx === selected) {
                  variant = 'border-primary bg-primary/5';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, idx)}
                    disabled={show}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors flex items-center gap-3 ${variant}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                    {show && idx === q.correctIndex && (
                      <CheckCircle2 className="h-4 w-4 ml-auto text-green-500 flex-shrink-0" />
                    )}
                    {show && idx === selected && idx !== q.correctIndex && (
                      <XCircle className="h-4 w-4 ml-auto text-red-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {show && (
              <div className="pl-10 pt-2 border-t border-border/50">
                <div className="flex gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{q.reasoning}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
