import { BarChart2, BarChart3, Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TokenInfo = {
  input?: number;
  cachedInput?: number;
  output?: number;
  reasoning?: number;
  total: number;
  cost: string;
  duration?: string;
  currentContext?: number;
};

// ─── Raw usage shape (matches ThreadMessageDtoRequestTokenUsage) ─────────────

export interface RawTokenUsage {
  inputTokens?: number;
  outputTokens?: number;
  cachedInputTokens?: number;
  reasoningTokens?: number;
  totalTokens?: number;
  totalPrice?: number;
  currentContext?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function fmtK(n: number) {
  return n >= 1000
    ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
    : String(n);
}

export function formatUsd(amount?: number | null): string {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return '$—';
  const truncated = Math.floor(amount * 1000) / 1000;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(truncated);
}

export function formatDuration(ms?: number): string | undefined {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0)
    return undefined;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const totalSeconds = ms / 1000;
  const rounded = Math.round(totalSeconds * 10) / 10;
  if (rounded < 60) return `${rounded}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

// ─── Adapter ──────────────────────────────────────────────────────────────────

/**
 * Converts a raw usage object (from ThreadMessageDtoRequestTokenUsage)
 * into a `TokenInfo` suitable for TokenBadge / TokenUsageDetail.
 */
export function toTokenInfo(
  usage: RawTokenUsage,
  durationMs?: number,
): TokenInfo {
  return {
    input: usage.inputTokens,
    cachedInput: usage.cachedInputTokens,
    output: usage.outputTokens,
    reasoning: usage.reasoningTokens,
    total: usage.totalTokens ?? 0,
    cost: formatUsd(usage.totalPrice),
    duration: formatDuration(durationMs),
    currentContext: usage.currentContext,
  };
}

// ─── StatRow ──────────────────────────────────────────────────────────────────

export function StatRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span
        className={
          bold ? 'font-semibold text-foreground' : 'font-medium text-foreground'
        }>
        {value}
      </span>
    </div>
  );
}

// ─── TokenBadge ───────────────────────────────────────────────────────────────

export function TokenBadge({
  tokens,
  light,
  additionalUsage,
  additionalLabel,
  messageKind,
}: {
  tokens: TokenInfo;
  light?: boolean;
  /** Optional additional token usage (e.g. from outputFocus LLM call). */
  additionalUsage?: RawTokenUsage | null;
  /** Label for the additional usage section (default: "Additional Token Usage"). */
  additionalLabel?: string;
  /** Contextual note about what the token usage represents. */
  messageKind?: 'tool' | 'text';
}) {
  const textCls = light
    ? 'text-[#888] hover:text-[#ccc]'
    : 'text-muted-foreground hover:text-foreground';
  return (
    <Popover>
      <PopoverTrigger
        className={`flex items-center gap-1 text-[10px] transition-colors cursor-pointer ${textCls}`}>
        <BarChart2 className="w-2.5 h-2.5" />
        <span>
          {fmtK(tokens.total)} ({tokens.cost})
          {tokens.duration ? ` · ${tokens.duration}` : ''}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3 text-xs space-y-1" align="start">
        <p className="font-semibold text-foreground mb-2">Token Usage</p>
        {tokens.input !== undefined && (
          <StatRow
            label="Context window"
            value={tokens.input.toLocaleString()}
          />
        )}
        {!!tokens.cachedInput && (
          <StatRow
            label="Cached context"
            value={tokens.cachedInput.toLocaleString()}
          />
        )}
        {tokens.output !== undefined && (
          <StatRow
            label="Generated tokens"
            value={tokens.output.toLocaleString()}
          />
        )}
        {!!tokens.reasoning && (
          <StatRow
            label="Reasoning"
            value={tokens.reasoning.toLocaleString()}
          />
        )}
        {tokens.currentContext !== undefined && (
          <StatRow
            label="Running context size"
            value={tokens.currentContext.toLocaleString()}
          />
        )}
        <div className="border-t border-border my-1" />
        <StatRow label="Total" value={tokens.total.toLocaleString()} bold />
        <StatRow label="Cost" value={tokens.cost} bold />
        {tokens.duration && (
          <StatRow label="LLM response time" value={tokens.duration} />
        )}
        {additionalUsage && (
          <>
            <div className="border-t border-border my-1" />
            <UsageSection
              usage={additionalUsage}
              label={`${additionalLabel || 'Additional Token Usage'}:`}
            />
          </>
        )}
        {messageKind && (
          <p className="text-[10px] text-muted-foreground/70 leading-tight border-t border-border pt-1.5 mt-1">
            {messageKind === 'tool'
              ? "Reflects the LLM generating this tool call, not the tool's execution time."
              : 'Reflects the LLM generating this response.'}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ─── TokenUsageDetail ─────────────────────────────────────────────────────────

/** Returns true when two token-usage objects carry identical numeric values. */
function isSameUsage(a?: RawTokenUsage | null, b?: RawTokenUsage | null) {
  if (!a || !b) return false;
  return (
    a.totalTokens === b.totalTokens &&
    a.inputTokens === b.inputTokens &&
    a.outputTokens === b.outputTokens &&
    a.totalPrice === b.totalPrice
  );
}

export function UsageSection({
  usage,
  label,
}: {
  usage: RawTokenUsage;
  label: string;
}) {
  const fmt = (n?: number) =>
    typeof n === 'number' ? n.toLocaleString() : '—';
  return (
    <>
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="text-xs text-muted-foreground">
        Total: {fmtK(usage.totalTokens ?? 0)} ({formatUsd(usage.totalPrice)})
      </span>
      <span className="text-xs text-muted-foreground">
        Context window: {fmt(usage.inputTokens)}
      </span>
      {typeof usage.cachedInputTokens === 'number' && (
        <span className="text-xs text-muted-foreground">
          Cached context: {fmt(usage.cachedInputTokens)}
        </span>
      )}
      <span className="text-xs text-muted-foreground">
        Generated tokens: {fmt(usage.outputTokens)}
      </span>
      {typeof usage.reasoningTokens === 'number' && (
        <span className="text-xs text-muted-foreground">
          Reasoning tokens: {fmt(usage.reasoningTokens)}
        </span>
      )}
      {typeof usage.currentContext === 'number' && (
        <span className="text-xs text-muted-foreground">
          Running context size: {fmt(usage.currentContext)}
        </span>
      )}
    </>
  );
}

/**
 * Dual In/Out token usage popover — replaces the custom TokenUsagePopoverIcon.
 * Renders a BarChart3 icon that opens a popover with one or two stat sections.
 */
export function TokenUsageDetail({
  usageIn,
  usageOut,
  durationMs,
  label,
  iconClassName,
}: {
  usageIn?: RawTokenUsage | null;
  usageOut?: RawTokenUsage | null;
  durationMs?: number;
  /** Custom label prefix (default: "Request Token Usage"). */
  label?: string;
  /** Extra CSS class for the trigger icon. */
  iconClassName?: string;
}) {
  const effectiveIn = usageIn;
  const effectiveOut =
    usageOut && !isSameUsage(usageIn, usageOut) ? usageOut : null;

  if (!effectiveIn && !effectiveOut) return null;

  const base = label || 'Request Token Usage';
  const showBoth = !!effectiveIn && !!effectiveOut;
  const inLabel = showBoth ? `${base} (Input):` : `${base}:`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span
          className="inline-flex items-center cursor-help"
          aria-label="View token usage details"
          title="View token usage details">
          <BarChart3 className={`w-3 h-3 ${iconClassName || ''}`} />
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[340px]">
        <div className="flex flex-col gap-1">
          {effectiveIn && <UsageSection usage={effectiveIn} label={inLabel} />}
          {effectiveOut && (
            <UsageSection usage={effectiveOut} label={`${base} (Output):`} />
          )}
          {typeof durationMs === 'number' && durationMs > 0 && (
            <span className="text-xs text-muted-foreground">
              LLM response time: {formatDuration(durationMs)}
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── StatisticsBar ────────────────────────────────────────────────────────────

/**
 * Horizontal row of stats for subagent/communication footers.
 * Replaces the custom StatisticsFooter component.
 */
export function StatisticsBar({
  tokens,
  toolCount,
  model,
  usageIn,
  usageOut,
  durationMs,
}: {
  tokens?: {
    totalTokens?: number;
    totalPrice?: number;
    durationMs?: number;
  };
  toolCount?: number;
  model?: string;
  usageIn?: RawTokenUsage | null;
  usageOut?: RawTokenUsage | null;
  durationMs?: number;
}) {
  const items: { label: string; value: string }[] = [];

  if (tokens?.totalTokens) {
    items.push({ label: 'Tokens', value: fmtK(tokens.totalTokens) });
  }
  if (typeof tokens?.totalPrice === 'number' && tokens.totalPrice > 0) {
    items.push({ label: 'Cost', value: formatUsd(tokens.totalPrice) });
  }
  if (typeof tokens?.durationMs === 'number' && tokens.durationMs > 0) {
    const dur = formatDuration(tokens.durationMs);
    if (dur) items.push({ label: 'LLM response time', value: dur });
  }
  if (typeof toolCount === 'number') {
    items.push({
      label: 'Tools',
      value: String(toolCount),
    });
  }
  if (model) {
    items.push({ label: 'Model', value: model });
  }

  if (items.length === 0 && !usageIn && !usageOut) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-muted-foreground">
      {items.map((item) => (
        <span key={item.label}>
          <span className="font-semibold">{item.label}:</span> {item.value}
        </span>
      ))}
      {(usageIn || usageOut) && (
        <TokenUsageDetail
          usageIn={usageIn}
          usageOut={usageOut}
          durationMs={durationMs}
        />
      )}
    </div>
  );
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="hover:text-foreground transition-colors"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}>
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}
