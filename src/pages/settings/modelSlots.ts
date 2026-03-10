export type ModelSlotKey =
  | 'llmLargeModel'
  | 'llmLargeCodeModel'
  | 'llmMiniCodeModel'
  | 'llmCodeExplorerSubagentModel'
  | 'llmMiniModel'
  | 'llmEmbeddingModel';

export interface ModelSlotDefinition {
  key: ModelSlotKey;
  label: string;
  description: string;
  embeddingOnly: boolean;
}

export const MODEL_SLOTS: ModelSlotDefinition[] = [
  {
    key: 'llmLargeModel',
    label: 'Large Model',
    description:
      'Primary model for AI suggestions, complex reasoning, and general-purpose tasks.',
    embeddingOnly: false,
  },
  {
    key: 'llmLargeCodeModel',
    label: 'Large Code Model',
    description:
      'Main model for code generation, code editing, and programming tasks.',
    embeddingOnly: false,
  },
  {
    key: 'llmMiniCodeModel',
    label: 'Mini Code Model',
    description:
      'Fast model for code-related subtasks, quick completions, and lightweight operations.',
    embeddingOnly: false,
  },
  {
    key: 'llmCodeExplorerSubagentModel',
    label: 'Code Explorer Subagent',
    description:
      'Model used by code explorer subagents for codebase analysis and navigation.',
    embeddingOnly: false,
  },
  {
    key: 'llmMiniModel',
    label: 'Mini Model',
    description:
      'Lightweight model for summarization, naming, and simple text processing.',
    embeddingOnly: false,
  },
  {
    key: 'llmEmbeddingModel',
    label: 'Embedding Model',
    description:
      'Embedding model for knowledge base indexing and semantic search.',
    embeddingOnly: true,
  },
];
