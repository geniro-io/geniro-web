import { formatDistanceToNow } from 'date-fns';
import {
  MessageCircle,
  Network,
  Pencil,
  Play,
  Square,
  Trash2,
} from 'lucide-react';

import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';

export const GRAPH_STATUS_META: Record<
  string,
  { label: string; className: string }
> = {
  running: {
    label: 'running',
    className: 'bg-blue-100 text-blue-700 border-transparent hover:bg-blue-100',
  },
  compiling: {
    label: 'compiling',
    className: 'bg-blue-50 text-blue-600 border-transparent hover:bg-blue-50',
  },
  created: {
    label: 'created',
    className: 'bg-blue-50 text-blue-600 border-transparent hover:bg-blue-50',
  },
  stopped: {
    label: 'stopped',
    className:
      'bg-muted text-muted-foreground border-transparent hover:bg-muted',
  },
  error: {
    label: 'error',
    className: 'bg-red-100 text-red-700 border-transparent hover:bg-red-100',
  },
  draft: {
    label: 'draft',
    className:
      'bg-amber-100 text-amber-700 border-transparent hover:bg-amber-100',
  },
};

export interface GraphCardProps {
  name: string;
  status: string;
  version?: string | null;
  description?: string | null;
  nodeCount?: number;
  runningThreads?: number;
  totalThreads?: number;
  draftsCount?: number;
  updatedAt?: string | null;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleRun?: () => void;
}

export function GraphCard({
  name,
  status,
  version,
  description,
  nodeCount = 0,
  runningThreads = 0,
  totalThreads = 0,
  draftsCount = 0,
  updatedAt,
  onClick,
  onEdit,
  onDelete,
  onToggleRun,
}: GraphCardProps) {
  const key = status.toLowerCase();
  const meta = GRAPH_STATUS_META[key] ?? {
    label: status,
    className:
      'bg-muted text-muted-foreground border-transparent hover:bg-muted',
  };
  const isRunning = key === 'running';

  return (
    <Card
      className="p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}>
      <div className="flex items-start justify-between">
        {/* Left: info */}
        <div className="flex-1 min-w-0 cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-semibold hover:text-primary transition-colors">
              {name}
            </h3>
            <Badge
              variant={isRunning ? 'default' : 'secondary'}
              className={`text-[10px] px-1.5 py-0.5 font-medium ${meta.className}`}>
              {meta.label}
            </Badge>
            {version && (
              <span className="text-sm text-muted-foreground">{version}</span>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              {nodeCount} nodes
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              {totalThreads} threads
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
              {runningThreads} running
            </span>
            {draftsCount > 0 && (
              <>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {draftsCount} drafts
                </span>
              </>
            )}
          </div>
          {updatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Modified{' '}
              {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Right: actions */}
        {(onToggleRun ?? onEdit ?? onDelete) && (
          <div
            className="flex items-center gap-2 ml-4 shrink-0"
            onClick={(e) => e.stopPropagation()}>
            {onToggleRun && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={onToggleRun}>
                {isRunning ? (
                  <>
                    <Square className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run
                  </>
                )}
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
