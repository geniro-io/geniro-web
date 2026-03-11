import '@xyflow/react/dist/style.css';

import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  type Node,
  type NodeMouseHandler,
  type NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { Play } from 'lucide-react';
import type { FC } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { getAgentInitials } from '../../../components/ui/agent-avatar';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import {
  GRAPH_HANDLE_STYLE_SOURCE,
  GRAPH_HANDLE_STYLE_TARGET,
  GraphNodeCard,
  graphNodeKindIconMap,
  NodeCollapsedInputSlot,
  NodeCollapsedOutputSlot,
} from '../../../components/ui/graph-node-card';
import { JsonViewer } from '../../../components/ui/json-view';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '../../../components/ui/popover';
import type { ThreadExportData } from './ThreadSnapshotModal';

type SnapshotGraph = NonNullable<ThreadExportData['graph']>;

// ── Kind inference (snapshot-specific: derives kind from template name string) ─

function inferTemplateKind(template: string): string {
  const t = template.toLowerCase();
  if (t.endsWith('-tool') || t === 'tool' || t.includes('-tool-'))
    return 'tool';
  if (t.endsWith('-trigger') || t === 'trigger' || t.includes('trigger'))
    return 'trigger';
  if (t.endsWith('-resource') || t === 'resource') return 'resource';
  if (t.endsWith('-mcp') || t === 'mcp' || t.includes('-mcp-')) return 'mcp';
  if (t.includes('runtime')) return 'runtime';
  if (t.includes('knowledge')) return 'knowledge';
  return 'simpleagent';
}

// ── Snapshot node data type ───────────────────────────────────────────────────

interface EdgeInfo {
  handleId: string;
  /** Template kind of the connected node (e.g. "tool", "runtime", "simpleagent") */
  peerLabel: string;
}

interface SnapshotNodeData extends Record<string, unknown> {
  label: string;
  template: string;
  templateKind: string;
  nodeId: string;
  config: Record<string, unknown>;
  inEdges: EdgeInfo[];
  outEdges: EdgeInfo[];
}

// ── Node renderer ─────────────────────────────────────────────────────────────

const MAX_DESC = 120;

const SnapshotNode: FC<NodeProps<Node<SnapshotNodeData>>> = ({
  id: _id,
  data,
  selected,
}) => {
  const isAgent = data.templateKind === 'simpleagent';

  const avatar = isAgent ? (
    <Avatar className="size-6 shrink-0">
      <AvatarFallback className="bg-primary/20 text-primary text-[9px] font-semibold">
        {getAgentInitials(data.label)}
      </AvatarFallback>
    </Avatar>
  ) : (
    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
      {graphNodeKindIconMap[data.templateKind] ?? <Play className="w-3 h-3" />}
    </div>
  );

  const rawDescription =
    typeof data.config?.description === 'string' &&
    data.config.description.trim()
      ? data.config.description.trim()
      : undefined;
  const description =
    rawDescription && rawDescription.length > MAX_DESC
      ? rawDescription.slice(0, MAX_DESC).trimEnd() + '…'
      : rawDescription;

  // Collapsed (default): compact badge — same as main graph's default state
  const inputsCollapsed =
    data.inEdges.length > 0 ? (
      <NodeCollapsedInputSlot
        count={data.inEdges.length}
        handleSlot={data.inEdges.map((e) => (
          <Handle
            key={e.handleId}
            type="target"
            id={e.handleId}
            position={Position.Left}
            isConnectable={false}
            style={GRAPH_HANDLE_STYLE_TARGET}
          />
        ))}
      />
    ) : null;

  const outputsCollapsed =
    data.outEdges.length > 0 ? (
      <NodeCollapsedOutputSlot
        count={data.outEdges.length}
        handleSlot={data.outEdges.map((e) => (
          <Handle
            key={e.handleId}
            type="source"
            id={e.handleId}
            position={Position.Right}
            isConnectable={false}
            style={GRAPH_HANDLE_STYLE_SOURCE}
          />
        ))}
      />
    ) : null;

  // Expanded: one row per connection showing the peer node's name.
  // overflow-hidden + w-full ensure truncate works when peer labels are long.
  const inputsExpanded =
    data.inEdges.length > 0 ? (
      <div className="flex flex-col gap-1.5 w-full">
        {data.inEdges.map((e) => (
          <div
            key={e.handleId}
            className="relative flex items-center min-w-0"
            style={{ minHeight: 18 }}>
            <Handle
              type="target"
              id={e.handleId}
              position={Position.Left}
              isConnectable={false}
              style={GRAPH_HANDLE_STYLE_TARGET}
            />
            <div
              className="w-full min-w-0 px-2 py-1 rounded"
              style={{ background: 'rgba(107,143,212,0.12)', minHeight: 28 }}>
              <div
                className="text-[10px] font-semibold leading-tight truncate"
                style={{ color: '#4a6fa8' }}>
                {e.peerLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : null;

  const outputsExpanded =
    data.outEdges.length > 0 ? (
      <div className="flex flex-col gap-1.5 items-end w-full">
        {data.outEdges.map((e) => (
          <div
            key={e.handleId}
            className="relative flex items-center justify-end w-full min-w-0"
            style={{ minHeight: 18 }}>
            <div
              className="w-full min-w-0 px-2 py-1 rounded text-right"
              style={{ background: 'rgba(90,158,113,0.12)', minHeight: 28 }}>
              <div
                className="text-[10px] font-semibold leading-tight truncate"
                style={{ color: '#3d7a52' }}>
                {e.peerLabel}
              </div>
            </div>
            <Handle
              type="source"
              id={e.handleId}
              position={Position.Right}
              isConnectable={false}
              style={GRAPH_HANDLE_STYLE_SOURCE}
            />
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div style={{ width: 300, position: 'relative', zIndex: 1 }}>
      <GraphNodeCard
        label={data.label}
        templateKind={data.templateKind}
        template={data.template}
        description={description}
        selected={selected}
        avatar={avatar}
        inputsCollapsed={inputsCollapsed}
        outputsCollapsed={outputsCollapsed}
        inputsExpanded={inputsExpanded}
        outputsExpanded={outputsExpanded}
      />
    </div>
  );
};

const nodeTypes = { snapshotNode: SnapshotNode };

// ── Auto-layout ────────────────────────────────────────────────────────────────

function computeLayout(
  nodes: SnapshotGraph['nodes'],
  edges: SnapshotGraph['edges'] = [],
): Record<string, { x: number; y: number }> {
  const childrenOf: Record<string, string[]> = {};
  const parentsOf: Record<string, string[]> = {};

  for (const node of nodes) {
    childrenOf[node.id] = [];
    parentsOf[node.id] = [];
  }
  for (const edge of edges) {
    childrenOf[edge.from]?.push(edge.to);
    parentsOf[edge.to]?.push(edge.from);
  }

  const levels: Record<string, number> = {};
  const visited = new Set<string>();
  const roots = nodes.filter((n) => parentsOf[n.id].length === 0);
  const queue: { id: string; level: number }[] = (
    roots.length > 0 ? roots : nodes
  ).map((n) => ({ id: n.id, level: 0 }));

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (visited.has(item.id) && (levels[item.id] ?? 0) >= item.level) continue;
    visited.add(item.id);
    levels[item.id] = Math.max(levels[item.id] ?? 0, item.level);
    for (const child of childrenOf[item.id] ?? []) {
      queue.push({ id: child, level: item.level + 1 });
    }
  }

  for (const node of nodes) {
    if (levels[node.id] === undefined) levels[node.id] = 0;
  }

  const byLevel: Record<number, string[]> = {};
  for (const [id, level] of Object.entries(levels)) {
    if (!byLevel[level]) byLevel[level] = [];
    byLevel[level].push(id);
  }

  // Fixed node width=300, truncated descriptions → estimated height ~160px.
  // ROW_HEIGHT=260 gives ~100px breathing room between nodes.
  const COL_WIDTH = 340;
  const ROW_HEIGHT = 260;
  const positions: Record<string, { x: number; y: number }> = {};

  for (const [levelStr, ids] of Object.entries(byLevel)) {
    const x = parseInt(levelStr) * COL_WIDTH;
    ids.forEach((id, i) => {
      const totalH = ids.length * ROW_HEIGHT;
      const startY = -totalH / 2 + ROW_HEIGHT / 2;
      positions[id] = { x, y: startY + i * ROW_HEIGHT };
    });
  }

  return positions;
}

// ── Main component ────────────────────────────────────────────────────────────

interface SnapshotGraphViewProps {
  graph: SnapshotGraph;
  nodeDisplayNames: Record<string, string>;
}

interface SelectedNodeInfo {
  label: string;
  template: string;
  config: Record<string, unknown>;
  /** Screen coordinates of the click — used to position the popover anchor. */
  anchorX: number;
  anchorY: number;
}

const SnapshotGraphViewInner: FC<SnapshotGraphViewProps> = ({
  graph,
  nodeDisplayNames,
}) => {
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );
  // Ref on the outer container so we can compute click position relative to it.
  // position:absolute anchors are immune to the Dialog's CSS transform, unlike
  // position:fixed which gets re-parented by any transformed ancestor.
  const containerRef = useRef<HTMLDivElement>(null);

  const { rfNodes, rfEdges } = useMemo(() => {
    const positions = computeLayout(graph.nodes, graph.edges);

    // Build per-node edge lists with unique handle IDs so each connection row
    // gets its own handle, matching how CustomNode renders inputsExpanded.
    const nodeInEdges: Record<string, EdgeInfo[]> = {};
    const nodeOutEdges: Record<string, EdgeInfo[]> = {};
    for (const n of graph.nodes) {
      nodeInEdges[n.id] = [];
      nodeOutEdges[n.id] = [];
    }

    // Build a map from node ID → template kind for type labels
    const nodeTemplateKinds: Record<string, string> = {};
    for (const n of graph.nodes) {
      nodeTemplateKinds[n.id] = inferTemplateKind(n.template);
    }

    // Track per-edge handle assignments so rfEdges can reference the right IDs
    const edgeHandles: { sourceHandle: string; targetHandle: string }[] = [];

    for (const e of graph.edges ?? []) {
      const inIdx = nodeInEdges[e.to].length;
      const outIdx = nodeOutEdges[e.from].length;
      const sourceHandle = `source-${outIdx}`;
      const targetHandle = `target-${inIdx}`;

      nodeInEdges[e.to].push({
        handleId: targetHandle,
        peerLabel: nodeTemplateKinds[e.from] ?? e.from,
      });
      nodeOutEdges[e.from].push({
        handleId: sourceHandle,
        peerLabel: nodeTemplateKinds[e.to] ?? e.to,
      });
      edgeHandles.push({ sourceHandle, targetHandle });
    }

    const rfNodes: Node<SnapshotNodeData>[] = graph.nodes.map((n) => {
      const templateKind = inferTemplateKind(n.template);
      const displayName = nodeDisplayNames[n.id];
      const label =
        displayName && displayName !== n.id ? displayName : n.template;

      return {
        id: n.id,
        type: 'snapshotNode',
        position: positions[n.id] ?? { x: 0, y: 0 },
        data: {
          label,
          template: n.template,
          templateKind,
          nodeId: n.id,
          config: n.config,
          inEdges: nodeInEdges[n.id] ?? [],
          outEdges: nodeOutEdges[n.id] ?? [],
        },
      };
    });

    const rfEdges = (graph.edges ?? []).map((e, i) => ({
      id: `e-${i}`,
      source: e.from,
      target: e.to,
      sourceHandle: edgeHandles[i].sourceHandle,
      targetHandle: edgeHandles[i].targetHandle,
      label: e.label,
      type: 'smoothstep',
      style: { stroke: '#d9d9d9', strokeWidth: 1.5 },
    }));

    return { rfNodes, rfEdges };
  }, [graph, nodeDisplayNames]);

  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    const data = node.data as SnapshotNodeData;
    // Compute position relative to our container so position:absolute works
    // correctly even when the parent Dialog has a CSS transform applied.
    const rect = containerRef.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
    };
    setSelectedNode({
      label: data.label,
      template: data.template,
      config: data.config,
      anchorX: event.clientX - rect.left,
      anchorY: event.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.1}
        maxZoom={4}
        panOnScroll
        zoomOnScroll={false}
        onNodeClick={handleNodeClick}
        onPaneClick={() => setSelectedNode(null)}
        attributionPosition="bottom-right">
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>

      {/* Popover anchored to the click position */}
      <Popover
        open={selectedNode !== null}
        onOpenChange={(open) => !open && setSelectedNode(null)}>
        <PopoverAnchor
          style={{
            position: 'absolute',
            left: selectedNode?.anchorX ?? 0,
            top: selectedNode?.anchorY ?? 0,
            width: 0,
            height: 0,
            pointerEvents: 'none',
          }}
        />
        <PopoverContent
          className="w-96 max-h-[420px] overflow-y-auto p-3"
          side="right"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}>
          {selectedNode && (
            <>
              <p className="text-xs font-semibold mb-1 truncate">
                {selectedNode.label}
              </p>
              <p className="text-[11px] text-muted-foreground mb-2">
                {selectedNode.template}
              </p>
              <JsonViewer value={selectedNode.config as object} collapsed={2} />
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

// ── Public export ─────────────────────────────────────────────────────────────

export const SnapshotGraphView: FC<SnapshotGraphViewProps> = (props) => (
  <ReactFlowProvider>
    <SnapshotGraphViewInner {...props} />
  </ReactFlowProvider>
);
