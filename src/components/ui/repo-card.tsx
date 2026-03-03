import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  ExternalLink,
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
    <div className="space-y-1">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor[status]} ${status === 'in_progress' ? 'animate-pulse' : ''}`}
          style={{
            width: `${Math.max(pct, status === 'not_indexed' ? 0 : 2)}%`,
          }}
        />
      </div>
      {index &&
        (index.status === 'completed' || index.status === 'in_progress') && (
          <p className="text-[11px] text-muted-foreground">
            {fmtTokens(index.indexedTokens)} /{' '}
            {fmtTokens(index.estimatedTokens)} tokens
          </p>
        )}
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
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Github className="w-4 h-4 text-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              <span className="text-muted-foreground">{repo.owner}/</span>
              {repo.repo}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {repo.provider}
              </span>
              <span className="text-muted-foreground text-[10px]">·</span>
              <GitBranch className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground truncate">
                {repo.defaultBranch}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(repo)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
          aria-label="Delete repository">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* URL */}
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group truncate">
        <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:text-foreground" />
        <span className="truncate">{repo.url.replace('https://', '')}</span>
      </a>

      {/* Commit SHA */}
      {repo.index?.lastIndexedCommit && (
        <p className="text-[11px] font-mono text-muted-foreground -mt-2">
          Last commit:{' '}
          <span className="text-foreground">
            {repo.index.lastIndexedCommit}
          </span>
        </p>
      )}

      {/* Status + progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <IndexStatusBadge status={status} />
        </div>
        <RepoProgressBar index={repo.index} />
      </div>

      {/* Error */}
      {repo.index?.errorMessage && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-relaxed">
            {repo.index.errorMessage}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
        <span className="text-[11px] text-muted-foreground">
          {repo.index
            ? `Updated ${formatRelativeDate(repo.index.updatedAt)}`
            : `Added ${formatRelativeDate(repo.createdAt)}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5 px-2.5"
          onClick={() => onReindex(repo.id)}
          disabled={isReindexing || status === 'in_progress'}>
          {isReindexing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {isReindexing ? 'Starting…' : 'Reindex'}
        </Button>
      </div>
    </div>
  );
}
