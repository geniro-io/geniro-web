import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import {
  AlertCircle,
  ArrowRight,
  ArrowRightLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback } from './avatar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  CopyButton,
  StatRow,
  TokenBadge,
  type TokenInfo,
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

// ─── StatusBadge ─────────────────────────────────────────────────────────────

export function StatusBadge({
  status,
}: {
  status: 'running' | 'done' | 'error' | 'stopped';
}) {
  const cls: Record<string, string> = {
    running: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    stopped: 'bg-muted text-muted-foreground',
  };
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cls[status]}`}>
      {status}
    </span>
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

// ─── ReasoningBlock ───────────────────────────────────────────────────────────

export function ReasoningBlock({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 130;
  return (
    <div className="bg-muted/40 border border-border/50 rounded-lg px-3 py-2.5 text-[12px] text-muted-foreground italic">
      <p
        className={`leading-relaxed ${!expanded && isLong ? 'line-clamp-2' : 'whitespace-pre-wrap'}`}>
        {content}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] not-italic text-muted-foreground/50">
          reasoning
        </span>
        {isLong && (
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

export function ShellBlock({
  command,
  stdout,
  stderr,
  focusResult,
  exitCode,
  status,
  tokens,
}: {
  command: string;
  stdout: string;
  stderr?: string;
  focusResult?: string;
  exitCode: number;
  status: 'executing' | 'executed' | 'error';
  tokens?: TokenInfo;
}) {
  const [expanded, setExpanded] = useState(false);
  const lines = stdout.split('\n');
  const isLong = lines.length > 5;
  const displayLines = expanded ? lines : lines.slice(0, 5);
  const isError = status === 'error' || exitCode !== 0;
  const headerBg =
    status === 'executing'
      ? 'bg-[#2b2b2b]'
      : isError
        ? 'bg-[#2b1a1a]'
        : 'bg-[#1a2b1d]';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`rounded-lg overflow-hidden border font-mono text-[11px] hover:border-[#555] transition-colors cursor-pointer ${isError ? 'border-[#5c2b2b] bg-[#1e1e1e]' : 'border-[#333] bg-[#1e1e1e]'}`}>
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
              <span className="text-[#e8e8e8] truncate">$ {command}</span>
            </div>
            <span
              className={`text-[10px] ml-3 flex-shrink-0 ${status === 'executing' ? 'text-gray-400 italic' : isError ? 'text-red-400' : 'text-green-400'}`}>
              {status === 'executing' ? 'executing…' : `exit ${exitCode}`}
            </span>
          </div>
          {stdout && (
            <div className="px-3 py-2">
              {displayLines.map((line, i) => (
                <div key={i} className="text-[#d4d4d4] leading-5">
                  {line || '\u00a0'}
                </div>
              ))}
              {stderr && <div className="text-[#f87171] mt-1">{stderr}</div>}
              {isLong && (
                <button
                  className="text-[10px] text-gray-500 hover:text-gray-300 mt-1.5 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((v) => !v);
                  }}>
                  {expanded
                    ? '▲ Show less'
                    : `▼ +${lines.length - 5} more lines`}
                </button>
              )}
            </div>
          )}
          {focusResult && (
            <div className="px-3 py-2 border-t border-[#2e2e2e]">
              <div className="text-[9px] text-[#6a9955] uppercase tracking-wider mb-1">
                Focus Result
              </div>
              {focusResult.split('\n').map((line, i) => (
                <div key={i} className="text-[#b5cea8] leading-5">
                  {line}
                </div>
              ))}
            </div>
          )}
          {tokens && (
            <div className="px-3 py-1.5 border-t border-[#2e2e2e] flex justify-end">
              <TokenBadge tokens={tokens} light />
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0 overflow-hidden" align="start">
        <div className="px-3 pt-3 pb-1 border-b border-border flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="font-semibold text-sm font-mono truncate">
            $ {command}
          </p>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ml-auto flex-shrink-0 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            exit {exitCode}
          </span>
        </div>
        <div className="p-3 space-y-3 max-h-[520px] overflow-y-auto">
          <div>
            <SectionLabel>Input (command)</SectionLabel>
            <pre className="bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-2.5 text-[10px] whitespace-pre-wrap">
              {command}
            </pre>
          </div>
          <div>
            <SectionLabel>Output (stdout)</SectionLabel>
            <pre className="bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-2.5 text-[10px] overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">
              {stdout || '(empty)'}
            </pre>
          </div>
          {focusResult && (
            <div>
              <SectionLabel>Focus Result</SectionLabel>
              <pre className="bg-[#1a2b1d] text-[#b5cea8] rounded-lg p-2.5 text-[10px] whitespace-pre-wrap border border-[#2a4a2a]">
                {focusResult}
              </pre>
            </div>
          )}
          {stderr && (
            <div>
              <SectionLabel>Stderr</SectionLabel>
              <pre className="bg-[#1e1e1e] text-[#f87171] rounded-lg p-2.5 text-[10px] whitespace-pre-wrap">
                {stderr}
              </pre>
            </div>
          )}
          <div>
            <SectionLabel>Statistics</SectionLabel>
            <div className="bg-muted rounded-lg p-2.5 text-[11px] space-y-1">
              <StatRow
                label="Exit code"
                value={String(exitCode)}
                bold={exitCode !== 0}
              />
              {tokens?.input !== undefined && (
                <StatRow
                  label="Input tokens"
                  value={tokens.input.toLocaleString()}
                />
              )}
              {tokens?.output !== undefined && (
                <StatRow
                  label="Output tokens"
                  value={tokens.output.toLocaleString()}
                />
              )}
              {tokens && (
                <StatRow
                  label="Total tokens"
                  value={tokens.total.toLocaleString()}
                  bold
                />
              )}
              {tokens && <StatRow label="Cost" value={tokens.cost} bold />}
              {tokens?.duration && (
                <StatRow label="Duration" value={tokens.duration} />
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
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

export function SubagentBlock({
  purpose,
  status,
  task,
  result,
  innerMessages,
  tokens,
}: {
  agentName: string;
  agentRole: string;
  agentColor: string;
  purpose: string;
  status: 'running' | 'done' | 'error';
  task: string;
  result?: string;
  innerMessages: InnerMsg[];
  tokens?: TokenInfo & { toolCount?: number; model?: string };
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5 ml-0.5">
        <Bot className="w-3 h-3" />
        <span>Subagent</span>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <BlockHeader left={null} label={purpose} status={status} />
        <div className="p-3 space-y-2.5">
          <div>
            <SectionLabel>Task</SectionLabel>
            <InlineText
              text={task}
              lines={5}
              accentClass="bg-purple-50 border border-purple-200/60 text-muted-foreground not-italic"
            />
          </div>
          <InnerMessages messages={innerMessages} hideNames />
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

export function CommunicationBlock({
  fromAgent,
  toAgent,
  fromColor,
  toColor,
  status,
  instructions,
  result,
  innerMessages,
  tokens,
  model,
}: {
  fromAgent: string;
  toAgent: string;
  fromColor: string;
  toColor: string;
  status: 'running' | 'done' | 'error';
  instructions: string;
  result?: string;
  innerMessages: InnerMsg[];
  tokens?: TokenInfo & { toolCount?: number };
  model?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5 ml-0.5">
        <ArrowRightLeft className="w-3 h-3" />
        <span>Agent communication</span>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <BlockHeader
          left={
            <AgentAvatars
              a={fromAgent}
              colorA={fromColor}
              b={toAgent}
              colorB={toColor}
            />
          }
          label={`${fromAgent} → ${toAgent}`}
          status={status}
        />
        <div className="p-3 space-y-2.5">
          <div>
            <SectionLabel>Instructions for {toAgent}</SectionLabel>
            <InlineText
              text={instructions}
              lines={5}
              accentClass="bg-purple-50 border border-purple-200/60 text-muted-foreground not-italic"
            />
          </div>
          <InnerMessages messages={innerMessages} />
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
}: {
  sender: string;
  agentRole?: string;
  color: string;
  timestamp: string;
  variant: 'done' | 'need_more';
  message: string;
  tokens?: TokenInfo;
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
          style={{ borderLeft: `3px solid ${accentColor}` }}>
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
