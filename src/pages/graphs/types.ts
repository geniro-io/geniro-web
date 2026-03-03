import type { Edge, Node } from '@xyflow/react';
import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from 'json-schema';

export interface GraphNodeData {
  label: string;
  template: string;
  templateKind?: string;
  templateSchema?: TemplateSchema;
  config: Record<string, unknown>;
}

export type GraphNode = Node;
export type GraphEdge = Edge;

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface NodeMetadata {
  id: string;
  x: number;
  y: number;
  name?: string;
}

export interface GraphMetadata {
  nodes?: NodeMetadata[];
  zoom?: number;
  x?: number;
  y?: number;
}

type UiSchemaExtensions = {
  'x-ui:show-on-node'?: boolean;
  'x-ui:label'?: string;
  'x-ui:textarea'?: boolean;
  'x-ui:ai-suggestions'?: boolean;
  'x-ui:litellm-models-list-select'?: boolean;
};

type NonBooleanSchema = Exclude<JSONSchema7Definition, boolean>;

export type SchemaTypeName = JSONSchema7TypeName;
export type SchemaProperty = NonBooleanSchema & UiSchemaExtensions;

export type TemplateSchema = JSONSchema7 & {
  properties: Record<string, SchemaProperty>;
  definitions?: Record<string, NonBooleanSchema>;
};
