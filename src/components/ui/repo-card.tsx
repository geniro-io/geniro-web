import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  GitBranch,
  Github,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import { Badge } from './badge';
import { Button } from './button';

// ─── Types ────────────────────────────────────────────────────────────────────

export type IndexStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'not_indexed';

export interface RepoIndex {
  status: IndexStatus;
  lastIndexedCommit: string | null;
  indexedTokens: number;
  estimatedTokens: number;
  errorMessage: string | null;
  updatedAt: string;
}

export interface Repository {
  id: string;
  owner: string;
  repo: string;
  url: string;
  provider: 'GITHUB';
  defaultBranch: string;
  createdAt: string;
  index?: RepoIndex;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

function getProgress(index?: RepoIndex): number {
  if (!index) return 0;
  if (index.status === 'completed') return 100;
  if (index.status === 'in_progress' && index.estimatedTokens > 0) {
    return Math.round((index.indexedTokens / index.estimatedTokens) * 100);
  }
  return 0;
}

function fmtTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}

// ─── Status badge ─────────────────────────────────────────────────────────────

export function IndexStatusBadge({ status }: { status: IndexStatus }) {
  const map: Record<IndexStatus, { label: string; className: string }> = {
    completed: {
      label: 'Indexed',
      className: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    },
    in_progress: {
      label: 'Indexing',
      className: 'text-blue-600 border-blue-200 bg-blue-50',
    },
    pending: {
      label: 'Pending',
      className: 'text-amber-600 border-amber-200 bg-amber-50',
    },
    failed: {
      label: 'Failed',
      className: 'text-red-600 border-red-200 bg-red-50',
    },
    not_indexed: {
      label: 'Not indexed',
      className: 'text-muted-foreground border-border',
    },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={`text-[11px] ${className}`}>
      {label}
    </Badge>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

export function RepoProgressBar({ index }: { index?: RepoIndex }) {
  const pct = getProgress(index);
  const status = index?.status ?? 'not_indexed';

  const barColor: Record<IndexStatus, string> = {
    completed: 'bg-emerald-500',
    in_progress: 'bg-blue-500',
    pending: 'bg-amber-400',
    failed: 'bg-red-500',
    not_indexed: 'bg-muted',
  };

  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${barColor[status]} ${status === 'in_progress' ? 'animate-pulse' : ''}`}
        style={{
          width: `${Math.max(pct, status === 'not_indexed' ? 0 : 2)}%`,
        }}
      />
    </div>
  );
}

// ─── Repository card ──────────────────────────────────────────────────────────

export interface RepoCardProps {
  repo: Repository;
  onDelete: (repo: Repository) => void;
  onReindex: (id: string) => void;
  reindexing: string | null;
}

export function RepoCard({
  repo,
  onDelete,
  onReindex,
  reindexing,
}: RepoCardProps) {
  const status = repo.index?.status ?? 'not_indexed';
  const isReindexing = reindexing === repo.id;

  return (
    <div className="grid grid-cols-[auto_1fr_auto_10rem_6rem_9rem_auto] items-center gap-x-3 px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group">
      {/* Icon */}
      <Github className="w-3.5 h-3.5 text-muted-foreground" />

      {/* Name — grows to fill available space */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium truncate hover:underline min-w-0">
        <span className="text-muted-foreground font-normal">{repo.owner}/</span>
        {repo.repo}
      </a>

      {/* Branch */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <GitBranch className="w-3 h-3 flex-shrink-0" />
        <span className="text-xs truncate max-w-16">{repo.defaultBranch}</span>
      </div>

      {/* Progress bar + tokens */}
      <div className="flex items-center gap-2">
        <div className="w-20 flex-shrink-0">
          <RepoProgressBar index={repo.index} />
        </div>
        {repo.index &&
        (repo.index.status === 'completed' ||
          repo.index.status === 'in_progress' ||
          repo.index.status === 'pending') ? (
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            {repo.index.status === 'completed'
              ? `${fmtTokens(repo.index.indexedTokens)}/${fmtTokens(repo.index.indexedTokens)}`
              : repo.index.estimatedTokens > 0
                ? `${fmtTokens(repo.index.indexedTokens)}/~${fmtTokens(repo.index.estimatedTokens)}`
                : repo.index.indexedTokens > 0
                  ? fmtTokens(repo.index.indexedTokens)
                  : 'Calculating…'}
          </span>
        ) : null}
      </div>

      {/* Status badge */}
      <div>
        <IndexStatusBadge status={status} />
      </div>

      {/* Timestamp + actions */}
      <div className="flex items-center justify-end gap-1">
        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
          {repo.index
            ? formatRelativeDate(repo.index.updatedAt)
            : formatRelativeDate(repo.createdAt)}
        </span>
        {repo.index?.errorMessage && (
          <div title={repo.index.errorMessage}>
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </div>
        )}
      </div>

      {/* Actions — reveal on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs gap-1 px-2"
          onClick={() => onReindex(repo.id)}
          disabled={isReindexing || status === 'in_progress'}>
          {isReindexing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {isReindexing ? 'Starting…' : 'Reindex'}
        </Button>
        <button
          onClick={() => onDelete(repo)}
          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Delete repository">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
