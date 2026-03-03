import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { AnsiUp } from 'ansi_up';
import {
  AlertCircle,
  ArrowRight,
  ArrowRightLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Loader2,
  Terminal,
  XCircle,
} from 'lucide-react';
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

import { getStatusBadgeClass } from '../../utils/statusColors';
import { Avatar, AvatarFallback } from './avatar';
import { Badge } from './badge';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  CopyButton,
  type RawTokenUsage,
  StatisticsBar,
  StatRow,
  TokenBadge,
  type TokenInfo,
  TokenUsageDetail,
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
      <JsonView
        value={data as object}
        style={{ ...lightTheme, fontSize: '10px', fontFamily: 'monospace' }}
      />
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
  return (
    <div
      className={`text-[11px] rounded-lg px-3 py-2.5 leading-relaxed ${accentClass ?? 'bg-muted/40 border border-border/50 text-foreground font-mono'}`}>
      <p
        className={
          !expanded && isLong ? `line-clamp-${lines}` : 'whitespace-pre-wrap'
        }>
        {text}
      </p>
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

// ─── ContentSection (replaces custom StyledSection) ──────────────────────────

interface ContentSectionTheme {
  background: string;
  border: string;
  labelColor: string;
  contentColor: string;
}

const SECTION_THEMES: Record<string, ContentSectionTheme> = {
  task: {
    background: '#f0f5ff',
    border: '#adc6ff',
    labelColor: '#1d39c4',
    contentColor: '#000000',
  },
  instruction: {
    background: '#f9f0ff',
    border: '#d3adf7',
    labelColor: '#722ed1',
    contentColor: '#000000',
  },
  error: {
    background: '#fff2f0',
    border: '#ffccc7',
    labelColor: '#cf1322',
    contentColor: '#cf1322',
  },
  result: {
    background: '#f6ffed',
    border: '#b7eb8f',
    labelColor: '#389e0d',
    contentColor: '#135200',
  },
};

const SECTION_STYLES = Object.fromEntries(
  Object.entries(SECTION_THEMES).map(([key, theme]) => [
    key,
    {
      wrapper: {
        padding: '6px 10px',
        fontSize: 12,
        backgroundColor: theme.background,
        borderRadius: 6,
        border: `1px solid ${theme.border}`,
        lineHeight: 1.5,
      } as React.CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
        paddingBottom: 6,
        borderBottom: `1px solid ${theme.border}`,
      } as React.CSSProperties,
      label: {
        fontSize: 12,
        fontWeight: 600,
        color: theme.labelColor,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      } as React.CSSProperties,
      content: {
        fontSize: '12px',
        lineHeight: '1.4',
        color: theme.contentColor,
      } as React.CSSProperties,
    },
  ]),
) as Record<
  string,
  {
    wrapper: React.CSSProperties;
    header: React.CSSProperties;
    label: React.CSSProperties;
    content: React.CSSProperties;
  }
>;

const COLLAPSED_MAX_HEIGHT = 180;

export type ContentSectionVariant = 'task' | 'instruction' | 'error' | 'result';

export function ContentSection({
  variant,
  label,
  content,
  children,
  collapsible = false,
}: {
  variant: ContentSectionVariant;
  label: string;
  content?: string;
  children?: React.ReactNode;
  collapsible?: boolean;
}) {
  const styles = SECTION_STYLES[variant];
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    if (!collapsible || !contentRef.current) return;
    setOverflows(contentRef.current.scrollHeight > COLLAPSED_MAX_HEIGHT);
  }, [collapsible, content, children]);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);
  const shouldClamp = collapsible && overflows && !expanded;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
      </div>
      <div
        ref={contentRef}
        style={
          shouldClamp
            ? {
                maxHeight: COLLAPSED_MAX_HEIGHT,
                overflow: 'hidden',
                position: 'relative',
              }
            : undefined
        }>
        {children ?? (
          <div style={styles.content}>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content}</p>
          </div>
        )}
        {shouldClamp && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 32,
              background: `linear-gradient(transparent, ${SECTION_THEMES[variant].background})`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      {collapsible && overflows && (
        <div
          onClick={toggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            cursor: 'pointer',
            fontSize: 11,
            color: '#8c8c8c',
            userSelect: 'none',
          }}>
          {expanded ? (
            <>
              <ChevronDown style={{ width: 9, height: 9 }} />
              Show less
            </>
          ) : (
            <>
              <ChevronRight style={{ width: 9, height: 9 }} />
              Show more
            </>
          )}
        </div>
      )}
    </div>
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

// ─── ToolBlock ────────────────────────────────────────────────────────────────

export function ToolBlock({
  toolName,
  status,
  args,
  result,
  tokens,
}: {
  toolName: string;
  status: 'running' | 'done' | 'error';
  args: Record<string, unknown>;
  result?: string;
  tokens?: TokenInfo;
}) {
  const isFinish = toolName === 'finish';
  const parsedResult = result ? tryParseJsonObject(result) : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
            status === 'error'
              ? 'bg-red-50 border-red-200 hover:bg-red-100'
              : 'bg-muted/40 border-border/50 hover:bg-muted/70'
          }`}>
          {status === 'running' ? (
            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin flex-shrink-0" />
          ) : status === 'done' ? (
            <CheckCircle2
              className={`w-3.5 h-3.5 flex-shrink-0 ${isFinish ? 'text-green-600' : 'text-green-500'}`}
            />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          )}
          <span
            className={`text-xs font-mono ${isFinish ? 'font-semibold text-foreground' : status === 'error' ? 'text-red-700' : 'text-foreground'}`}>
            {toolName}
          </span>
          {status === 'running' && (
            <span className="text-[10px] text-muted-foreground italic">
              executing…
            </span>
          )}
          {status === 'error' && (
            <span className="text-[10px] text-red-500 italic">failed</span>
          )}
          <div className="ml-auto">
            {tokens && <TokenBadge tokens={tokens} />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0 overflow-hidden" align="start">
        <div className="px-3 pt-3 pb-1 border-b border-border flex items-center gap-2">
          {status === 'error' && (
            <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          )}
          <p className="font-semibold text-sm font-mono">{toolName}</p>
          <StatusBadge
            status={
              status === 'running'
                ? 'running'
                : status === 'done'
                  ? 'done'
                  : 'error'
            }
          />
        </div>
        <div className="p-3 space-y-3 max-h-[520px] overflow-y-auto">
          <div>
            <SectionLabel>Input</SectionLabel>
            <JsonDisplay data={args} />
          </div>
          {result && (
            <div>
              <SectionLabel>Output</SectionLabel>
              {parsedResult !== null ? (
                <JsonDisplay data={parsedResult} />
              ) : (
                <pre
                  className={`rounded-lg p-2.5 text-[10px] overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap ${status === 'error' ? 'bg-red-50 text-red-700' : 'bg-muted'}`}>
                  {result}
                </pre>
              )}
            </div>
          )}
          {tokens && (
            <div>
              <SectionLabel>Statistics</SectionLabel>
              <div className="bg-muted rounded-lg p-2.5 text-[11px] space-y-1">
                {tokens.input !== undefined && (
                  <StatRow
                    label="Input tokens"
                    value={tokens.input.toLocaleString()}
                  />
                )}
                {tokens.output !== undefined && (
                  <StatRow
                    label="Output tokens"
                    value={tokens.output.toLocaleString()}
                  />
                )}
                <StatRow
                  label="Total tokens"
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
        </div>
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
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'transparent',
          fontSize: '12px',
        }}
        PreTag="div"
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
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: '1.5',
                  }}
                  PreTag="div"
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
                  {msg.sender
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
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
    usageOut,
    showThinkingIndicator,
  } = props;

  // If children are provided, use consumer mode
  if (children !== undefined) {
    const headerLabel = purpose ? `Subagent: ${purpose}` : 'Subagent';
    const isClickable = status !== 'running' && !!popoverContent;
    const toolStatus: 'calling' | 'executed' | 'stopped' =
      status === 'running'
        ? 'calling'
        : status === 'error'
          ? 'stopped'
          : 'executed';

    const headerRow = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: isClickable ? 'pointer' : undefined,
        }}>
        {status === 'running' && (
          <Loader2
            className="animate-spin"
            style={{ width: 11, height: 11, color: '#595959' }}
          />
        )}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#434343',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {headerLabel}
        </span>
        <StatusTag status={toolStatus} hasError={!!errorText} />
      </div>
    );

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: '100%',
        }}>
        {isClickable ? (
          <Popover>
            <PopoverTrigger asChild>{headerRow}</PopoverTrigger>
            <PopoverContent align="start" className="w-auto max-w-[520px]">
              {popoverContent}
            </PopoverContent>
          </Popover>
        ) : (
          headerRow
        )}

        {taskDescription && (
          <ContentSection
            variant="task"
            label="Task"
            content={taskDescription}
            collapsible
          />
        )}

        {children}

        {errorText && (
          <ContentSection variant="error" label="Error" content={errorText} />
        )}

        {resultText && !errorText && (
          <ContentSection
            variant="result"
            label="Result"
            content={resultText}
            collapsible
          />
        )}

        {showThinkingIndicator && status === 'running' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 10,
            }}>
            <StatisticsBar
              tokens={statistics?.usage}
              toolCount={statistics?.toolCallsMade}
              model={model}
              usageIn={usageIn}
              usageOut={usageOut}
            />
            <div
              style={{
                fontSize: 11,
                fontStyle: 'italic',
                color: '#8c8c8c',
                paddingTop: 2,
                animation:
                  'messages-tab-thinking-pulse 1.6s ease-in-out infinite',
              }}>
              Agent is thinking...
            </div>
          </div>
        ) : (
          <StatisticsBar
            tokens={statistics?.usage}
            toolCount={statistics?.toolCallsMade}
            model={model}
            usageIn={usageIn}
            usageOut={usageOut}
          />
        )}
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
                lines={5}
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
  const init = (s: string) =>
    s
      .split(' ')
      .map((n) => n[0])
      .join('');
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <div
        className={`w-5 h-5 rounded-full ${colorA} flex items-center justify-center text-white text-[8px] font-bold`}>
        {init(a)}
      </div>
      <ArrowRight className="w-3 h-3 text-muted-foreground" />
      <div
        className={`w-5 h-5 rounded-full ${colorB} flex items-center justify-center text-white text-[8px] font-bold`}>
        {init(b)}
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
  targetAvatarSrc?: string;
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
    targetAvatarSrc,
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
    usageOut,
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
    const headerLabel = targetAgentName
      ? `Communication: ${targetAgentName}`
      : 'Agent Communication';
    const toolStatus: 'calling' | 'executed' | 'stopped' =
      status === 'running'
        ? 'calling'
        : status === 'error'
          ? 'stopped'
          : 'executed';
    const isClickable = status !== 'running' && !!popoverContent;

    const errorLbl = targetAgentName
      ? `Error from ${targetAgentName}`
      : 'Error';
    const resultLbl =
      resultLabel ||
      (targetAgentName ? `Result from ${targetAgentName}` : 'Result');
    const instrLabel =
      instructionLabel ||
      (targetAgentName
        ? `Providing Instructions for ${targetAgentName}`
        : 'Providing Instructions');

    const headerRow = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: isClickable ? 'pointer' : undefined,
        }}>
        {status === 'running' && (
          <Loader2
            className="animate-spin"
            style={{ width: 11, height: 11, color: '#595959' }}
          />
        )}
        {targetAvatarSrc && (
          <img
            src={targetAvatarSrc}
            alt=""
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#434343',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {headerLabel}
        </span>
        <StatusTag status={toolStatus} hasError={!!errorText} />
      </div>
    );

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: '100%',
        }}>
        {isClickable ? (
          <Popover>
            <PopoverTrigger asChild>{headerRow}</PopoverTrigger>
            <PopoverContent align="start" className="w-auto max-w-[520px]">
              {popoverContent}
            </PopoverContent>
          </Popover>
        ) : (
          headerRow
        )}

        {parentContent && (
          <div
            style={{
              padding: '6px 10px',
              fontSize: 12,
              color: '#595959',
              backgroundColor: '#fafafa',
              borderRadius: 6,
              border: '1px solid #f0f0f0',
              lineHeight: 1.5,
            }}>
            {parentContent}
          </div>
        )}

        {instructionContent && (
          <ContentSection
            variant="instruction"
            label={instrLabel}
            content={instructionContent}
            collapsible
          />
        )}

        {children}

        {errorText && (
          <ContentSection
            variant="error"
            label={errorLbl}
            content={errorText}
          />
        )}

        {resultText && !errorText && (
          <ContentSection
            variant="result"
            label={resultLbl}
            content={resultText}
            collapsible
          />
        )}

        {showThinkingIndicator && status === 'running' ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <StatisticsBar
              tokens={statistics?.usage}
              toolCount={statistics?.toolCallsMade}
              model={model}
              usageIn={usageIn}
              usageOut={usageOut}
            />
            <div
              style={{
                fontSize: 11,
                fontStyle: 'italic',
                color: '#8c8c8c',
                paddingTop: 2,
                animation:
                  'messages-tab-thinking-pulse 1.6s ease-in-out infinite',
              }}>
              {thinkingText ||
                (targetAgentName
                  ? `${targetAgentName} is thinking...`
                  : 'Agent is thinking...')}
            </div>
          </div>
        ) : (
          <StatisticsBar
            tokens={statistics?.usage}
            toolCount={statistics?.toolCallsMade}
            model={model}
            usageIn={usageIn}
            usageOut={usageOut}
          />
        )}
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
                lines={5}
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
          {sender
            .split(' ')
            .map((n) => n[0])
            .join('')}
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
          className="rounded-b-xl px-4 py-4 text-sm whitespace-pre-wrap leading-relaxed text-foreground border border-t-0"
          style={{
            background: isDone ? '#f6ffed' : '#fffbe6',
            borderLeft: `3px solid ${accentColor}`,
            borderColor: isDone ? '#b7eb8f' : '#ffe58f',
          }}>
          {message}
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
