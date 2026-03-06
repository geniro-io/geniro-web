import { AnsiUp } from 'ansi_up';
import {
  AlertCircle,
  ArrowRight,
  ArrowRightLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Terminal,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useReasoningReveal } from '../../hooks/useReasoningReveal';
import { getAgentInitials } from '../../pages/chats/utils/chatsPageUtils';
import { getStatusBadgeClass } from '../../utils/statusColors';
import { MarkdownContent } from '../markdown/MarkdownContent';
import { Avatar, AvatarFallback } from './avatar';
import { Badge } from './badge';
import { JsonViewer } from './json-view';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { SyntaxHighlighter } from './syntax-highlighter';
import {
  CopyButton,
  fmtK,
  formatDuration,
  formatUsd,
  type RawTokenUsage,
  StatRow,
  TokenBadge,
  type TokenInfo,
  TokenUsageDetail,
  toTokenInfo,
} from './token-display';

export type { TokenInfo } from './token-display';
export { fmtK, StatRow, TokenBadge } from './token-display';

export type InnerMsg =
  | { type: 'reasoning'; content: string }
  | {
      type: 'shell';
      command: string;
      stdout: string;
      stderr?: string;
      focusResult?: string;
      exitCode: number;
      status: 'executing' | 'executed' | 'error';
      tokens?: TokenInfo;
    }
  | {
      type: 'tool';
      toolName: string;
      status: 'running' | 'done' | 'error';
      args: Record<string, unknown>;
      result?: string;
      tokens?: TokenInfo;
    }
  | {
      type: 'chat';
      sender: string;
      role: 'ai';
      agentRole?: string;
      content: string;
      timestamp?: string;
      color: string;
      tokens?: TokenInfo;
    }
  | {
      type: 'subagent';
      agentName: string;
      agentRole: string;
      agentColor: string;
      purpose: string;
      status: 'running' | 'done' | 'error';
      task: string;
      result?: string;
      innerMessages: InnerMsg[];
      tokens?: TokenInfo & { toolCount?: number; model?: string };
    };

// ─── Constants ────────────────────────────────────────────────────────────────

export const RESULT_CLASS =
  'bg-[#f6ffed] border border-[#b7eb8f] text-[#135200]';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function tryParseJsonObject(
  s: string,
): Record<string, unknown> | unknown[] | null {
  try {
    const v: unknown = JSON.parse(s) as unknown;
    if (typeof v === 'object' && v !== null)
      return v as Record<string, unknown>;
    return null;
  } catch {
    return null;
  }
}

/**
 * Maps tool call statuses used by ThreadMessagesView ('calling'|'executed'|'stopped')
 * to the standard display statuses ('running'|'done'|'error').
 */
export function mapToolStatus(
  status: 'calling' | 'executed' | 'stopped',
  hasError?: boolean,
): 'running' | 'done' | 'error' {
  if (status === 'calling') return 'running';
  if (status === 'executed' && hasError) return 'error';
  if (status === 'stopped') return 'error';
  return 'done';
}

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const ansiUp = (() => {
  const instance = new AnsiUp();
  (instance as unknown as Record<string, unknown>).escape_html = true;
  (instance as unknown as Record<string, unknown>).escape_for_html = true;
  return instance;
})();

const normalizeShellText = (text: string): string =>
  text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

const containsAnsi = (text: string): boolean =>
  text.includes('\u001b[') || text.includes('\u009b[');

const stripAnsiSgr = (text: string): string => {
  const esc = '\u001b';
  const csi = '\u009b';
  const sgr = new RegExp(`(?:${esc}|${csi})\\[[0-9;]*m`, 'g');
  return text.replace(sgr, '');
};

const renderAnsiHtml = (text: string): string =>
  ansiUp.ansi_to_html(normalizeShellText(text));

const truncateToLines = (
  text: string,
  maxLines: number,
): { truncated: string; full: string; isTruncated: boolean } => {
  const lines = text.split('\n');
  const isTruncated = lines.length > maxLines;
  const truncated = lines.slice(0, maxLines).join('\n');
  return { truncated, full: text, isTruncated };
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────

export function StatusBadge({
  status,
}: {
  status: 'running' | 'done' | 'error' | 'stopped';
}) {
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getStatusBadgeClass(status)}`}>
      {status}
    </span>
  );
}

// ─── StatusTag ───────────────────────────────────────────────────────────────

const TAG_STYLE: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  lineHeight: '18px',
};

/**
 * Status tag for SubagentBlock / CommunicationBlock headers.
 * Maps 'calling'|'executed'|'stopped' → appropriate Badge variant.
 */
export function StatusTag({
  status,
  hasError,
}: {
  status: 'calling' | 'executed' | 'stopped';
  hasError?: boolean;
}) {
  if (status === 'executed' && !hasError) {
    return (
      <Badge
        variant="outline"
        className="border-green-300 bg-green-50 text-green-700"
        style={TAG_STYLE}>
        done
      </Badge>
    );
  }
  if (status === 'executed' && hasError) {
    return (
      <Badge variant="destructive" style={TAG_STYLE}>
        error
      </Badge>
    );
  }
  if (status === 'stopped') {
    return (
      <Badge variant="outline" style={TAG_STYLE}>
        stopped
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-blue-300 bg-blue-50 text-blue-700"
      style={TAG_STYLE}>
      running
    </Badge>
  );
}

// ─── JsonDisplay ─────────────────────────────────────────────────────────────

export function JsonDisplay({
  data,
  maxH = 'max-h-44',
}: {
  data: unknown;
  maxH?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white overflow-auto ${maxH} text-[10px] p-1.5`}>
      <JsonViewer value={data as object} fontSize="10px" />
    </div>
  );
}

// ─── InlineText ───────────────────────────────────────────────────────────────

export function InlineText({
  text,
  lines = 3,
  accentClass,
}: {
  text: string;
  lines?: number;
  accentClass?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const lineCount = text.split('\n').length;
  const isLong = lineCount > lines || text.length > lines * 80;
  // Account for markdown paragraph margins (~2.4em per visible "line")
  const collapsedMaxH = `${lines * 2.4}em`;
  return (
    <div
      className={`text-[11px] rounded-lg px-3 py-2.5 leading-relaxed ${accentClass ?? 'bg-muted/40 border border-border/50 text-foreground font-mono'}`}>
      <div
        className={!expanded && isLong ? 'overflow-hidden' : undefined}
        style={
          !expanded && isLong
            ? {
                maxHeight: collapsedMaxH,
                maskImage: 'linear-gradient(to bottom, black 40%, transparent)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 40%, transparent)',
              }
            : undefined
        }>
        <MarkdownContent
          content={text}
          style={{ fontSize: '11px', lineHeight: '1.5' }}
        />
      </div>
      {isLong && (
        <button
          className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground mt-1.5 transition-colors"
          onClick={() => setExpanded((v) => !v)}>
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Show more
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
      {children}
    </p>
  );
}

// ─── ReasoningBlock ───────────────────────────────────────────────────────────

export function ReasoningBlock({
  content,
  isStreaming,
  children,
}: {
  content?: string;
  isStreaming?: boolean;
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (content?.length ?? 0) > 130;

  if (isStreaming) {
    return (
      <div className="bg-muted/40 border border-border/50 rounded-lg px-3 py-2.5 text-[12px] text-muted-foreground italic">
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className="text-[10px] not-italic text-muted-foreground/50"
            style={{
              animation:
                'messages-tab-thinking-pulse 1.6s ease-in-out infinite',
            }}>
            reasoning…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 border border-border/50 rounded-lg px-3 py-2.5 text-[12px] text-muted-foreground italic">
      {children ? (
        <div className="leading-relaxed">{children}</div>
      ) : (
        <p
          className={`leading-relaxed ${!expanded && isLong ? 'line-clamp-2' : 'whitespace-pre-wrap'}`}>
          {content}
        </p>
      )}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] not-italic text-muted-foreground/50">
          reasoning
        </span>
        {isLong && !children && (
          <button
            className="text-[10px] not-italic hover:text-foreground transition-colors"
            onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── StreamingReasoningBlock ──────────────────────────────────────────────────

export function StreamingReasoningBlock({
  content,
  isStreaming,
  markdownStyle,
}: {
  content: string;
  isStreaming: boolean;
  markdownStyle?: React.CSSProperties;
}) {
  const { displayContent, isRevealing } = useReasoningReveal(
    content,
    isStreaming,
  );
  const active = isStreaming || isRevealing;
  return (
    <ReasoningBlock content={displayContent} isStreaming={active}>
      {!active && markdownStyle ? (
        <MarkdownContent content={displayContent} style={markdownStyle} />
      ) : undefined}
    </ReasoningBlock>
  );
}

// ─── ToolPopoverPanel ─────────────────────────────────────────────────────────

/** Renders a RawTokenUsage as two-column StatRow entries matching the header popover style. */
function UsageRows({ usage, label }: { usage: RawTokenUsage; label?: string }) {
  const fmt = (n?: number) =>
    typeof n === 'number' ? n.toLocaleString() : '—';
  return (
    <>
      {label && (
        <p className="font-semibold text-muted-foreground text-[11px]">
          {label}
        </p>
      )}
      {typeof usage.inputTokens === 'number' && (
        <StatRow label="Input" value={fmt(usage.inputTokens)} />
      )}
      {typeof usage.cachedInputTokens === 'number' && (
        <StatRow label="Cached input" value={fmt(usage.cachedInputTokens)} />
      )}
      {typeof usage.outputTokens === 'number' && (
        <StatRow label="Output" value={fmt(usage.outputTokens)} />
      )}
      {typeof usage.reasoningTokens === 'number' &&
        usage.reasoningTokens > 0 && (
          <StatRow label="Reasoning" value={fmt(usage.reasoningTokens)} />
        )}
      {typeof usage.currentContext === 'number' && (
        <StatRow label="Current context" value={fmt(usage.currentContext)} />
      )}
      <div className="border-t border-border my-1" />
      <StatRow label="Total" value={fmtK(usage.totalTokens ?? 0)} bold />
      <StatRow label="Cost" value={formatUsd(usage.totalPrice)} bold />
    </>
  );
}

/**
 * Shared popover content panel for tool call inspection.
 * Renders tool label, input args, output, and token usage using shared
 * sub-components (SectionLabel, JsonDisplay, StatusBadge, TokenUsageDetail).
 *
 * Used inside ToolBlock popover and as pre-rendered popoverContent for
 * SubagentBlock / CommunicationBlock.
 */
export function ToolPopoverPanel({
  toolLabel,
  status,
  args,
  resultContent,
  resultString,
  tokens,
  usageIn,
  usageOut,
  durationMs,
}: {
  toolLabel?: string;
  status?: 'running' | 'done' | 'error';
  args?: Record<string, unknown>;
  /** Raw result content (object, string, or primitive) from consumer mode. */
  resultContent?: unknown;
  /** Pre-stringified result from storybook mode. */
  resultString?: string;
  tokens?: TokenInfo;
  usageIn?: RawTokenUsage | null;
  usageOut?: RawTokenUsage | null;
  durationMs?: number;
}) {
  // Resolve result to displayable form
  const resolvedResult = useMemo((): {
    parsed: Record<string, unknown> | unknown[] | null;
    raw: string | null;
  } => {
    // Prefer resultString (storybook mode)
    if (resultString) {
      return { parsed: tryParseJsonObject(resultString), raw: resultString };
    }
    // Consumer mode: resultContent can be object, string, or primitive
    if (resultContent === undefined || resultContent === null) {
      return { parsed: null, raw: null };
    }
    if (typeof resultContent === 'string') {
      const p = tryParseJsonObject(resultContent);
      return { parsed: p, raw: resultContent };
    }
    if (typeof resultContent === 'object') {
      return { parsed: resultContent as Record<string, unknown>, raw: null };
    }
    return { parsed: null, raw: String(resultContent) };
  }, [resultString, resultContent]);

  const hasUsage = usageIn || usageOut;
  const hasContent = args || resolvedResult.parsed || resolvedResult.raw;

  if (!hasContent && !tokens && !hasUsage) return null;

  const effectiveOut =
    usageOut && usageIn
      ? usageOut.totalTokens !== usageIn.totalTokens ||
        usageOut.inputTokens !== usageIn.inputTokens ||
        usageOut.outputTokens !== usageIn.outputTokens ||
        usageOut.totalPrice !== usageIn.totalPrice
        ? usageOut
        : null
      : (usageOut ?? null);

  return (
    <div className="max-w-[520px]">
      {(toolLabel || status) && (
        <div className="px-3 pt-3 pb-1 border-b border-border flex items-center gap-2">
          {status === 'error' && (
            <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          )}
          {toolLabel && (
            <p className="font-semibold text-sm font-mono">{toolLabel}</p>
          )}
          {status && <StatusBadge status={status} />}
        </div>
      )}
      <div className="p-3 space-y-3 max-h-[520px] overflow-y-auto">
        {args && Object.keys(args).length > 0 && (
          <div>
            <SectionLabel>Input</SectionLabel>
            <JsonDisplay data={args} />
          </div>
        )}
        {(resolvedResult.parsed || resolvedResult.raw) && (
          <div>
            <SectionLabel>Output</SectionLabel>
            {resolvedResult.parsed ? (
              <JsonDisplay data={resolvedResult.parsed} />
            ) : (
              <pre
                className={`rounded-lg p-2.5 text-[10px] overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap ${status === 'error' ? 'bg-red-50 text-red-700' : 'bg-muted'}`}>
                {resolvedResult.raw}
              </pre>
            )}
          </div>
        )}
        {tokens && (
          <div>
            <SectionLabel>Statistics</SectionLabel>
            <div className="text-xs space-y-1">
              {tokens.input !== undefined && (
                <StatRow label="Input" value={tokens.input.toLocaleString()} />
              )}
              {tokens.output !== undefined && (
                <StatRow
                  label="Output"
                  value={tokens.output.toLocaleString()}
                />
              )}
              <div className="border-t border-border my-1" />
              <StatRow
                label="Total"
                value={tokens.total.toLocaleString()}
                bold
              />
              <StatRow label="Cost" value={tokens.cost} bold />
              {tokens.duration && (
                <StatRow label="Duration" value={tokens.duration} />
              )}
            </div>
          </div>
        )}
        {!tokens && (usageIn || effectiveOut) && (
          <div>
            <SectionLabel>Statistics</SectionLabel>
            <div className="text-xs space-y-1">
              {usageIn && (
                <UsageRows
                  usage={usageIn}
                  label={effectiveOut ? 'Input' : undefined}
                />
              )}
              {effectiveOut && (
                <UsageRows usage={effectiveOut} label="Output" />
              )}
              {typeof durationMs === 'number' && durationMs > 0 && (
                <StatRow
                  label="Duration"
                  value={
                    durationMs < 1000
                      ? `${Math.round(durationMs)}ms`
                      : `${(durationMs / 1000).toFixed(1)}s`
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ToolBlock ────────────────────────────────────────────────────────────────

export interface ToolBlockProps {
  // --- Storybook mode (self-contained) ---
  toolName: string;
  status: 'running' | 'done' | 'error';
  args?: Record<string, unknown>;
  result?: string;
  tokens?: TokenInfo;

  // --- Consumer mode (ThreadMessagesView) ---
  /** Raw status from the thread message ('calling'|'executed'|'stopped'). Mapped internally. */
  rawStatus?: 'calling' | 'executed' | 'stopped';
  /** Raw result content (object, string, or primitive). Alternative to `result` string. */
  resultContent?: unknown;
  /** Tool options / arguments object. Alternative to `args`. */
  toolOptions?: Record<string, unknown>;
  /** Custom display title override (replaces the default "toolName is status" text). */
  titleText?: string;
  /** Token usage from the AI request (input side). */
  requestTokenUsageIn?: RawTokenUsage | null;
  /** Token usage from the tool result (output side). */
  requestTokenUsageOut?: RawTokenUsage | null;
  /** LLM request duration in milliseconds. */
  durationMs?: number;
  /** Text alignment for the trigger line. */
  align?: 'left' | 'center';
  /** Error text extraction function (consumer provides). */
  errorText?: string;
}

export function ToolBlock(props: ToolBlockProps) {
  const {
    toolName,
    args,
    result,
    tokens,
    // Consumer-mode props
    rawStatus,
    resultContent,
    toolOptions,
    titleText,
    requestTokenUsageIn,
    requestTokenUsageOut,
    durationMs,
    align,
    errorText,
  } = props;

  const isConsumerMode = rawStatus !== undefined;

  // Resolve status: consumer-mode rawStatus mapped, or direct status prop
  const resolvedStatus: 'running' | 'done' | 'error' = isConsumerMode
    ? mapToolStatus(rawStatus, Boolean(errorText))
    : props.status;

  // Resolve args/options
  const resolvedArgs = args ?? toolOptions;

  // Determine if the trigger should have popover
  const hasPopoverContent = isConsumerMode
    ? (rawStatus !== 'calling' && resultContent !== undefined) ||
      (resolvedArgs && Object.keys(resolvedArgs).length > 0)
    : true; // storybook mode always has popover

  // Build status text for trigger
  const statusText =
    resolvedStatus === 'running'
      ? 'executing\u2026'
      : resolvedStatus === 'error'
        ? 'failed'
        : undefined;

  // Build display title for consumer mode
  const displayTitle = useMemo(() => {
    if (!isConsumerMode) return undefined;

    const base =
      titleText ??
      (toolOptions?.purpose
        ? `${toolName} | ${String(toolOptions.purpose)}`
        : undefined);

    if (base) {
      const withError = errorText ? `${base} - ${errorText}` : base;
      const firstNewline = withError.indexOf('\n');
      return firstNewline >= 0
        ? `${withError.slice(0, firstNewline)}\u2026`
        : withError;
    }

    return undefined;
  }, [isConsumerMode, titleText, toolOptions, toolName, errorText]);

  const isFinish = toolName === 'finish';
  const hasError = resolvedStatus === 'error';

  const trigger = (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
        hasPopoverContent ? 'cursor-pointer' : 'cursor-default'
      } ${
        hasError
          ? 'bg-red-50 border-red-200 hover:bg-red-100'
          : resolvedStatus === 'running'
            ? 'bg-muted/40 border-border/50 hover:bg-muted/70 animate-[messages-tab-thinking-pulse_1.6s_ease-in-out_infinite]'
            : 'bg-muted/40 border-border/50 hover:bg-muted/70'
      } ${align === 'left' ? 'justify-start' : ''}`}>
      {resolvedStatus === 'running' ? (
        <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin flex-shrink-0" />
      ) : resolvedStatus === 'done' ? (
        <CheckCircle2
          className={`w-3.5 h-3.5 flex-shrink-0 ${isFinish ? 'text-green-600' : 'text-green-500'}`}
        />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
      )}
      <span
        className={`text-xs font-mono truncate ${
          isFinish
            ? 'font-semibold text-foreground'
            : hasError
              ? 'text-red-700 font-semibold'
              : 'text-foreground'
        }`}>
        {displayTitle ?? toolName}
      </span>
      {statusText && !displayTitle && (
        <span
          className={`text-[10px] italic ${hasError ? 'text-red-500' : 'text-muted-foreground'}`}>
          {statusText}
        </span>
      )}
    </div>
  );

  if (!hasPopoverContent) {
    return trigger;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[420px] p-0 overflow-hidden" align="start">
        <ToolPopoverPanel
          toolLabel={toolName}
          status={resolvedStatus}
          args={resolvedArgs}
          resultContent={isConsumerMode ? resultContent : undefined}
          resultString={!isConsumerMode ? result : undefined}
          tokens={tokens}
          usageIn={requestTokenUsageIn}
          usageOut={requestTokenUsageOut}
          durationMs={durationMs}
        />
      </PopoverContent>
    </Popover>
  );
}

// ─── ShellBlock ───────────────────────────────────────────────────────────────

export interface ShellBlockProps {
  command: string;
  stdout: string;
  stderr?: string;
  focusResult?: string;
  exitCode: number;
  status: 'executing' | 'executed' | 'error';
  tokens?: TokenInfo;
  /** Custom header label (defaults to "$ <command>"). */
  title?: string;
  /** ANSI-aware rendering for stdout/stderr. Auto-detected when present. */
  ansi?: boolean;
  /** Dual token usage for the footer popover. */
  usageIn?: RawTokenUsage | null;
  usageOut?: RawTokenUsage | null;
  /** LLM request duration in milliseconds. */
  durationMs?: number;
  /** Tool options object for popover inspection. */
  toolOptions?: Record<string, unknown>;
  /** Tool popover content (pre-rendered). */
  popoverContent?: React.ReactNode;
}

export function ShellBlock({
  command,
  stdout,
  stderr,
  focusResult,
  exitCode,
  status,
  tokens,
  title,
  usageIn,
  usageOut,
  durationMs,
  popoverContent,
}: ShellBlockProps) {
  const [commandExpanded, setCommandExpanded] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const isError = status === 'error' || exitCode !== 0;
  const headerBg =
    status === 'executing'
      ? 'bg-[#2b2b2b]'
      : isError
        ? 'bg-[#2b1a1a]'
        : 'bg-[#1a2b1d]';

  const commandTruncated = truncateToLines(command, 3);
  const stdoutTruncated = stdout ? truncateToLines(stdout, 3) : undefined;
  const stderrTruncated = stderr ? truncateToLines(stderr, 3) : undefined;
  const isAnyOutputTruncated =
    stdoutTruncated?.isTruncated || stderrTruncated?.isTruncated;

  const outputTextForCopy = useMemo(
    () =>
      [
        stdout ? `STDOUT:\n${stripAnsiSgr(stdout)}` : null,
        stderr ? `STDERR:\n${stripAnsiSgr(stderr)}` : null,
      ]
        .filter(Boolean)
        .join('\n\n'),
    [stdout, stderr],
  );

  const headerLabel = title || command;
  const hasUsage = usageIn || usageOut;

  const renderOutputText = (
    text: string,
    color: string,
    truncatedInfo?: ReturnType<typeof truncateToLines>,
  ) => {
    const displayText =
      outputExpanded || !truncatedInfo?.isTruncated
        ? text
        : (truncatedInfo?.truncated ?? text);

    if (containsAnsi(text)) {
      return (
        <pre
          style={{
            margin: 0,
            fontSize: '12px',
            color,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.5',
          }}>
          <span
            dangerouslySetInnerHTML={{ __html: renderAnsiHtml(displayText) }}
          />
        </pre>
      );
    }

    return (
      <SyntaxHighlighter
        language="bash"
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'transparent',
          fontSize: '12px',
        }}
        preTag="div"
        codeTagProps={{
          style: { fontFamily: 'inherit', color },
        }}>
        {displayText}
      </SyntaxHighlighter>
    );
  };

  const renderOutputBlock = (
    label: string,
    text: string,
    color: string,
    truncatedInfo?: ReturnType<typeof truncateToLines>,
  ) => (
    <div style={{ marginBottom: 8 }}>
      <span
        style={{
          fontSize: '11px',
          color: '#c4c4c4',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 4,
        }}>
        {label}
      </span>
      {renderOutputText(text, color, truncatedInfo)}
    </div>
  );

  const shellContent = (
    <div
      className={`rounded-lg overflow-hidden border font-mono text-[11px] ${isError ? 'border-[#5c2b2b] bg-[#1e1e1e]' : 'border-[#333] bg-[#1e1e1e]'}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 ${headerBg}`}>
        <div className="flex items-center gap-2 min-w-0">
          {status === 'executing' ? (
            <Loader2 className="w-3 h-3 text-gray-400 animate-spin flex-shrink-0" />
          ) : (
            <Terminal
              className={`w-3 h-3 flex-shrink-0 ${isError ? 'text-red-400' : 'text-gray-500'}`}
            />
          )}
          <span className="text-[#e8e8e8] truncate">$ {headerLabel}</span>
        </div>
        <span
          className={`text-[10px] ml-3 flex-shrink-0 ${status === 'executing' ? 'text-gray-400 italic' : isError ? 'text-red-400' : 'text-green-400'}`}>
          {status === 'executing' ? 'executing…' : `exit ${exitCode}`}
        </span>
      </div>

      {/* Command (collapsible if > 3 lines) */}
      {command && (
        <div style={{ padding: '5px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span
              style={{
                color: '#a0a0a0',
                paddingRight: '10px',
                flexShrink: 0,
              }}>
              $
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  maxHeight:
                    commandExpanded || !commandTruncated.isTruncated
                      ? 'none'
                      : '4.5em',
                  overflow:
                    commandExpanded || !commandTruncated.isTruncated
                      ? 'visible'
                      : 'hidden',
                  position: 'relative',
                }}>
                <SyntaxHighlighter
                  language="bash"
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: '1.5',
                  }}
                  preTag="div"
                  codeTagProps={{
                    style: {
                      fontFamily: 'inherit',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    },
                  }}>
                  {command}
                </SyntaxHighlighter>
                {commandTruncated.isTruncated && !commandExpanded && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1.5em',
                      background:
                        'linear-gradient(to bottom, transparent, #1e1e1e)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
              {commandTruncated.isTruncated && (
                <div
                  style={{
                    color: '#1890ff',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginTop: '4px',
                    textDecoration: 'underline',
                  }}
                  onClick={() => setCommandExpanded(!commandExpanded)}>
                  {commandExpanded ? 'Show less' : 'Show more...'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Output */}
      {status !== 'executing' && (stdout || stderr) && (
        <div style={{ borderTop: '1px solid #333' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 10px',
              borderBottom: '1px solid #333',
              background: '#1a1a1a',
            }}>
            <span style={{ fontSize: '11px', color: '#c4c4c4' }}>Output</span>
            <Copy
              style={{
                color: '#c4c4c4',
                cursor: 'pointer',
                width: 14,
                height: 14,
              }}
              onClick={async () => {
                if (!outputTextForCopy) {
                  toast.warning('No output to copy');
                  return;
                }
                try {
                  await navigator.clipboard.writeText(outputTextForCopy);
                  toast.success('Copied to clipboard');
                } catch {
                  toast.error('Failed to copy to clipboard');
                }
              }}
            />
          </div>
          <div
            style={{
              padding: '5px 10px',
              maxHeight: outputExpanded ? '200px' : 'none',
              overflowY: outputExpanded ? 'scroll' : 'visible',
              overflowX: 'hidden',
              scrollbarWidth: 'thin',
              scrollbarColor: '#555 #2a2a2a',
            }}
            className="shell-output-container">
            {stdout &&
              renderOutputBlock('stdout', stdout, '#e8e8e8', stdoutTruncated)}
            {stderr &&
              renderOutputBlock('stderr', stderr, '#ff7875', stderrTruncated)}
            {isAnyOutputTruncated && (
              <div
                style={{
                  color: '#1890ff',
                  cursor: 'pointer',
                  fontSize: '11px',
                  marginTop: '4px',
                  textDecoration: 'underline',
                }}
                onClick={() => setOutputExpanded(!outputExpanded)}>
                {outputExpanded ? 'Show less' : 'Show more...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Focus Result */}
      {status !== 'executing' && focusResult && (
        <div style={{ borderTop: '1px solid #333' }}>
          <div
            style={{
              padding: '5px 10px',
              borderBottom: '1px solid #333',
              background: '#1a1a1a',
            }}>
            <span style={{ fontSize: '11px', color: '#c4c4c4' }}>
              Focus Result
            </span>
          </div>
          <div style={{ padding: '5px 10px' }}>
            {containsAnsi(focusResult) ? (
              <pre
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#b5cea8',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: '1.5',
                }}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderAnsiHtml(focusResult),
                  }}
                />
              </pre>
            ) : (
              focusResult.split('\n').map((line, i) => (
                <div key={i} className="text-[#b5cea8] leading-5">
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Token footer */}
      {(tokens || hasUsage) && (
        <div className="px-3 py-1.5 border-t border-[#2e2e2e] flex justify-end items-center gap-2">
          {tokens && <TokenBadge tokens={tokens} light />}
          {hasUsage && (
            <TokenUsageDetail
              usageIn={usageIn}
              usageOut={usageOut}
              durationMs={durationMs}
            />
          )}
        </div>
      )}
    </div>
  );

  // Wrap in popover if content provided
  if (popoverContent) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="cursor-pointer hover:opacity-90 transition-opacity">
            {shellContent}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto max-w-[560px] p-4"
          onClick={(e) => e.stopPropagation()}>
          {popoverContent}
        </PopoverContent>
      </Popover>
    );
  }

  return shellContent;
}

// ─── InnerMessages ────────────────────────────────────────────────────────────

export function InnerMessages({
  messages,
  hideNames,
}: {
  messages: InnerMsg[];
  hideNames?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const limit = 4;
  const shown = expanded ? messages : messages.slice(0, limit);
  return (
    <div className="space-y-2">
      {shown.map((msg, i) => {
        if (msg.type === 'reasoning')
          return <ReasoningBlock key={i} content={msg.content} />;
        if (msg.type === 'shell') return <ShellBlock key={i} {...msg} />;
        if (msg.type === 'tool') return <ToolBlock key={i} {...msg} />;
        if (msg.type === 'subagent') return <SubagentBlock key={i} {...msg} />;
        if (msg.type === 'chat')
          return (
            <div key={i} className="flex gap-2 items-start">
              {!hideNames && (
                <div
                  className={`w-5 h-5 rounded-full ${msg.color} flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 mt-0.5`}>
                  {getAgentInitials(msg.sender)}
                </div>
              )}
              <div className="text-[11px] flex-1 min-w-0">
                {!hideNames && (
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="font-medium text-foreground">
                      {msg.sender}
                    </span>
                    {msg.agentRole && (
                      <span className="text-muted-foreground text-[10px]">
                        {msg.agentRole}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-foreground leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        return null;
      })}
      {messages.length > limit && (
        <button
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          onClick={() => setExpanded((v) => !v)}>
          <ChevronDown
            className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? 'Show less' : `${messages.length - limit} more messages`}
        </button>
      )}
    </div>
  );
}

// ─── SubagentBlock ────────────────────────────────────────────────────────────

export interface SubagentBlockProps {
  // --- Storybook mode (self-contained) ---
  agentName?: string;
  agentRole?: string;
  agentColor?: string;
  purpose?: string;
  status: 'running' | 'done' | 'error';
  task?: string;
  result?: string;
  innerMessages?: InnerMsg[];
  tokens?: TokenInfo & { toolCount?: number; model?: string };

  // --- Consumer mode (ThreadMessagesView) ---
  /** Pre-rendered children replace innerMessages self-rendering. */
  children?: React.ReactNode;
  taskDescription?: string;
  model?: string;
  errorText?: string;
  resultText?: string;
  statistics?: {
    usage?: {
      totalTokens?: number;
      totalPrice?: number;
      durationMs?: number;
    };
    toolCallsMade?: number;
    totalPrice?: number;
  };
  /** Pre-rendered popover content for header click. */
  popoverContent?: React.ReactNode;
  usageIn?: RawTokenUsage | null;
  usageOut?: RawTokenUsage | null;
  /** Show "Agent is thinking..." indicator. */
  showThinkingIndicator?: boolean;
  /** Number of hidden messages (collapsed). -1 = auto-collapse. */
  collapsedCount?: number;
}

export function SubagentBlock(props: SubagentBlockProps) {
  const {
    purpose,
    status,
    task,
    result,
    innerMessages,
    tokens,
    children,
    taskDescription,
    model,
    errorText,
    resultText,
    statistics,
    popoverContent,
    usageIn,
    usageOut: _usageOut, // not displayed in consumer mode
    showThinkingIndicator,
  } = props;

  // If children are provided, use consumer mode
  if (children !== undefined) {
    const headerLabel = purpose ? `Subagent: ${purpose}` : 'Subagent';
    const displayStatus: 'running' | 'done' | 'error' =
      status === 'running' ? 'running' : errorText ? 'error' : status;
    const isClickable = status !== 'running' && !!popoverContent;

    // Build TokenInfo from raw consumer stats for StatFooter
    const footerTokens: TokenInfo | undefined = usageIn
      ? toTokenInfo(usageIn, statistics?.usage?.durationMs)
      : statistics?.usage?.totalTokens
        ? {
            total: statistics.usage.totalTokens,
            cost: formatUsd(statistics.usage.totalPrice),
            duration: formatDuration(statistics.usage.durationMs),
          }
        : undefined;

    const header = (
      <BlockHeader left={null} label={headerLabel} status={displayStatus} />
    );

    return (
      <div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5 ml-0.5">
          <Bot className="w-3 h-3" />
          <span>Subagent</span>
        </div>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {isClickable ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer">{header}</div>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto max-w-[520px]">
                {popoverContent}
              </PopoverContent>
            </Popover>
          ) : (
            header
          )}

          <div className="p-3 space-y-2.5">
            {taskDescription && (
              <div>
                <SectionLabel>Task</SectionLabel>
                <InlineText
                  text={taskDescription}
                  lines={3}
                  accentClass="bg-purple-50 border border-purple-200/60 text-muted-foreground not-italic"
                />
              </div>
            )}

            {children}

            {errorText && (
              <div>
                <SectionLabel>Error</SectionLabel>
                <InlineText
                  text={errorText}
                  lines={3}
                  accentClass="bg-red-50 border border-red-200 text-red-700 not-italic"
                />
              </div>
            )}

            {resultText && !errorText && (
              <div>
                <SectionLabel>Result</SectionLabel>
                <InlineText
                  text={resultText}
                  lines={3}
                  accentClass={RESULT_CLASS}
                />
              </div>
            )}

            {showThinkingIndicator && status === 'running' ? (
              <div className="flex items-baseline gap-2.5">
                <StatFooter
                  tokens={footerTokens}
                  toolCount={statistics?.toolCallsMade}
                  model={model}
                />
                <span
                  className="text-[11px] italic text-muted-foreground"
                  style={{
                    animation:
                      'messages-tab-thinking-pulse 1.6s ease-in-out infinite',
                  }}>
                  Agent is thinking...
                </span>
              </div>
            ) : (
              <StatFooter
                tokens={footerTokens}
                toolCount={statistics?.toolCallsMade}
                model={model}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Storybook mode (self-contained with innerMessages)
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5 ml-0.5">
        <Bot className="w-3 h-3" />
        <span>Subagent</span>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <BlockHeader
          left={null}
          label={purpose ?? 'Subagent'}
          status={status}
        />
        <div className="p-3 space-y-2.5">
          {task && (
            <div>
              <SectionLabel>Task</SectionLabel>
              <InlineText
                text={task}
                lines={3}
                accentClass="bg-purple-50 border border-purple-200/60 text-muted-foreground not-italic"
              />
            </div>
          )}
          {innerMessages && (
            <InnerMessages messages={innerMessages} hideNames />
          )}
          {result && (
            <div>
              <SectionLabel>Result</SectionLabel>
              <InlineText text={result} lines={3} accentClass={RESULT_CLASS} />
            </div>
          )}
          <StatFooter
            tokens={tokens}
            toolCount={tokens?.toolCount}
            model={tokens?.model}
          />
        </div>
      </div>
    </div>
  );
}

// ─── StatFooter ───────────────────────────────────────────────────────────────

export function StatFooter({
  tokens,
  toolCount,
  model,
}: {
  tokens?: TokenInfo;
  toolCount?: number;
  model?: string;
}) {
  if (!tokens) return null;
  return (
    <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap pt-0.5">
      <TokenBadge tokens={tokens} />
      {toolCount !== undefined && (
        <span>
          {toolCount} tool{toolCount !== 1 ? 's' : ''}
        </span>
      )}
      {model && (
        <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
          {model}
        </span>
      )}
    </div>
  );
}

// ─── BlockHeader ──────────────────────────────────────────────────────────────

export function BlockHeader({
  left,
  label,
  status,
}: {
  left?: React.ReactNode;
  label: string;
  status: 'running' | 'done' | 'error';
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border">
      {left && left}
      <span className="text-xs font-medium text-foreground flex-1 min-w-0 truncate">
        {label}
      </span>
      {status === 'running' && (
        <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin flex-shrink-0" />
      )}
      <StatusBadge status={status} />
    </div>
  );
}

// ─── AgentAvatars ─────────────────────────────────────────────────────────────

export function AgentAvatars({
  a,
  colorA,
  b,
  colorB,
}: {
  a: string;
  colorA: string;
  b: string;
  colorB: string;
}) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <div
        className={`w-5 h-5 rounded-full ${colorA} flex items-center justify-center text-white text-[8px] font-bold`}>
        {getAgentInitials(a)}
      </div>
      <ArrowRight className="w-3 h-3 text-muted-foreground" />
      <div
        className={`w-5 h-5 rounded-full ${colorB} flex items-center justify-center text-white text-[8px] font-bold`}>
        {getAgentInitials(b)}
      </div>
    </div>
  );
}

// ─── CommunicationBlock ───────────────────────────────────────────────────────

export interface CommunicationBlockProps {
  // --- Storybook mode ---
  fromAgent?: string;
  toAgent?: string;
  fromColor?: string;
  toColor?: string;
  status: 'running' | 'done' | 'error';
  instructions?: string;
  result?: string;
  innerMessages?: InnerMsg[];
  tokens?: TokenInfo & { toolCount?: number };
  model?: string;

  // --- Consumer mode (ThreadMessagesView) ---
  children?: React.ReactNode;
  targetAgentName?: string;
  /** Sending (parent) agent name — used to render AgentAvatars in consumer mode. */
  sourceAgentName?: string;
  /** Tailwind bg color class for the source agent avatar (e.g. "bg-green-500"). */
  sourceColor?: string;
  /** Tailwind bg color class for the target agent avatar (e.g. "bg-red-500"). */
  targetColor?: string;
  parentContent?: React.ReactNode;
  instructionContent?: string;
  instructionLabel?: string;
  errorText?: string;
  resultText?: string;
  resultLabel?: string;
  statistics?: {
    usage?: {
      totalTokens?: number;
      totalPrice?: number;
      durationMs?: number;
    };
    toolCallsMade?: number;
    totalPrice?: number;
  };
  popoverContent?: React.ReactNode;
  usageIn?: RawTokenUsage | null;
  usageOut?: RawTokenUsage | null;
  showThinkingIndicator?: boolean;
  thinkingText?: string;
}

export function CommunicationBlock(props: CommunicationBlockProps) {
  const {
    status,
    children,
    targetAgentName,
    sourceAgentName,
    sourceColor,
    targetColor,
    parentContent,
    instructionContent,
    instructionLabel,
    errorText,
    resultText,
    resultLabel,
    statistics,
    model,
    popoverContent,
    usageIn,
    usageOut: _usageOut, // not displayed in consumer mode
    showThinkingIndicator,
    thinkingText,
    // storybook mode
    fromAgent,
    toAgent,
    fromColor,
    toColor,
    instructions,
    result,
    innerMessages,
    tokens,
  } = props;

  // Consumer mode
  if (children !== undefined) {
    // Strip parenthetical role from names, e.g. "Samantha Hale (Engineering Manager)" → "Samantha Hale"
    const stripRole = (name: string) => name.replace(/\s*\(.*?\)\s*$/, '');
    const cleanSource = sourceAgentName
      ? stripRole(sourceAgentName)
      : undefined;
    const cleanTarget = targetAgentName
      ? stripRole(targetAgentName)
      : undefined;

    const displayStatus: 'running' | 'done' | 'error' =
      status === 'running' ? 'running' : errorText ? 'error' : status;
    const isClickable = status !== 'running' && !!popoverContent;

    const errorLbl = cleanTarget ? `Error from ${cleanTarget}` : 'Error';
    const resultLbl =
      resultLabel || (cleanTarget ? `Result from ${cleanTarget}` : 'Result');
    const instrLabel =
      instructionLabel ||
      (cleanTarget
        ? `Providing Instructions for ${cleanTarget}`
        : 'Providing Instructions');

    // Build TokenInfo from raw consumer stats for StatFooter
    const footerTokens: TokenInfo | undefined = usageIn
      ? toTokenInfo(usageIn, statistics?.usage?.durationMs)
      : statistics?.usage?.totalTokens
        ? {
            total: statistics.usage.totalTokens,
            cost: formatUsd(statistics.usage.totalPrice),
            duration: formatDuration(statistics.usage.durationMs),
          }
        : undefined;

    const hasAgentPair = !!(cleanSource && cleanTarget);

    const headerLeft =
      hasAgentPair && sourceColor && targetColor ? (
        <AgentAvatars
          a={cleanSource}
          colorA={sourceColor}
          b={cleanTarget}
          colorB={targetColor}
        />
      ) : null;

    const headerLabelText = hasAgentPair
      ? `${cleanSource} \u2192 ${cleanTarget}`
      : cleanTarget
        ? `Communication: ${cleanTarget}`
        : 'Agent Communication';

    const header = (
      <BlockHeader
        left={headerLeft}
        label={headerLabelText}
        status={displayStatus}
      />
    );

    return (
      <div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5 ml-0.5">
          <ArrowRightLeft className="w-3 h-3" />
          <span>Agent communication</span>
        </div>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {isClickable ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer">{header}</div>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto max-w-[520px]">
                {popoverContent}
              </PopoverContent>
            </Popover>
          ) : (
            header
          )}

          <div className="p-3 space-y-2.5">
            {parentContent && (
              <div className="px-2.5 py-1.5 text-xs text-muted-foreground bg-muted/40 rounded-md border border-border/60 leading-relaxed">
                {parentContent}
              </div>
            )}

            {instructionContent && (
              <div>
                <SectionLabel>{instrLabel}</SectionLabel>
                <InlineText
                  text={instructionContent}
                  lines={3}
                  accentClass="bg-purple-50 border border-purple-200/60 text-muted-foreground not-italic"
                />
              </div>
            )}

            {children}

            {errorText && (
              <div>
                <SectionLabel>{errorLbl}</SectionLabel>
                <InlineText
                  text={errorText}
                  lines={3}
                  accentClass="bg-red-50 border border-red-200 text-red-700 not-italic"
                />
              </div>
            )}

            {resultText && !errorText && (
              <div>
                <SectionLabel>{resultLbl}</SectionLabel>
                <InlineText
                  text={resultText}
                  lines={3}
                  accentClass={RESULT_CLASS}
                />
              </div>
            )}

            {showThinkingIndicator && status === 'running' ? (
              <div className="flex items-baseline gap-2.5">
                <StatFooter
                  tokens={footerTokens}
                  toolCount={statistics?.toolCallsMade}
                  model={model}
                />
                <span
                  className="text-[11px] italic text-muted-foreground"
                  style={{
                    animation:
                      'messages-tab-thinking-pulse 1.6s ease-in-out infinite',
                  }}>
                  {thinkingText ||
                    (targetAgentName
                      ? `${targetAgentName} is thinking...`
                      : 'Agent is thinking...')}
                </span>
              </div>
            ) : (
              <StatFooter
                tokens={footerTokens}
                toolCount={statistics?.toolCallsMade}
                model={model}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Storybook mode (self-contained)
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5 ml-0.5">
        <ArrowRightLeft className="w-3 h-3" />
        <span>Agent communication</span>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <BlockHeader
          left={
            fromAgent && toAgent && fromColor && toColor ? (
              <AgentAvatars
                a={fromAgent}
                colorA={fromColor}
                b={toAgent}
                colorB={toColor}
              />
            ) : undefined
          }
          label={
            fromAgent && toAgent ? `${fromAgent} → ${toAgent}` : 'Communication'
          }
          status={status}
        />
        <div className="p-3 space-y-2.5">
          {instructions && (
            <div>
              <SectionLabel>Instructions for {toAgent}</SectionLabel>
              <InlineText
                text={instructions}
                lines={3}
                accentClass="bg-purple-50 border border-purple-200/60 text-muted-foreground not-italic"
              />
            </div>
          )}
          {innerMessages && <InnerMessages messages={innerMessages} />}
          {result && (
            <div>
              <SectionLabel>Result from {toAgent}</SectionLabel>
              <InlineText text={result} lines={3} accentClass={RESULT_CLASS} />
            </div>
          )}
          <StatFooter
            tokens={tokens}
            toolCount={tokens?.toolCount}
            model={model}
          />
        </div>
      </div>
    </div>
  );
}

// ─── FinishBlock ──────────────────────────────────────────────────────────────

export function FinishBlock({
  sender,
  agentRole,
  color,
  timestamp,
  variant,
  message,
  tokens,
  bubbleStyle,
}: {
  sender: string;
  agentRole?: string;
  color: string;
  timestamp: string;
  variant: 'done' | 'need_more';
  message: string;
  tokens?: TokenInfo;
  bubbleStyle?: React.CSSProperties;
}) {
  const isDone = variant === 'done';
  const accentColor = isDone ? '#52c41a' : '#faad14';
  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={`${color} text-white text-[11px]`}>
          {getAgentInitials(sender)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-t-xl border ${isDone ? 'bg-green-100 border-green-200 text-green-800' : 'bg-amber-100 border-amber-200 text-amber-800'}`}
          style={{
            borderLeft: `3px solid ${accentColor}`,
            ...bubbleStyle,
          }}>
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold">
            {isDone ? 'Finished' : 'Need more information'}
          </span>
        </div>
        <div
          className="rounded-b-xl px-4 py-4 text-sm leading-relaxed text-foreground border border-t-0"
          style={{
            background: isDone ? '#f6ffed' : '#fffbe6',
            borderLeft: `3px solid ${accentColor}`,
            borderColor: isDone ? '#b7eb8f' : '#ffe58f',
          }}>
          <MarkdownContent
            content={message}
            style={{ fontSize: '14px', lineHeight: '1.4', color: '#000000' }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground/60">{sender}</span>
          {agentRole && (
            <>
              <span>·</span>
              <span>{agentRole}</span>
            </>
          )}
          <span>·</span>
          <span>{timestamp}</span>
          {tokens && (
            <>
              <span>·</span>
              <TokenBadge tokens={tokens} />
            </>
          )}
          <CopyButton text={message} />
        </div>
      </div>
    </div>
  );
}
