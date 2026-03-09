import { formatDistanceToNow } from 'date-fns';
import React from 'react';

import { MarkdownContent } from '../markdown/MarkdownContent';
import { AgentAvatar } from './agent-avatar';
import { CopyButton, TokenBadge, type TokenInfo } from './token-display';

export type { TokenInfo } from './token-display';
export { CopyButton } from './token-display';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formats a date string into relative form ("15 min ago"). */
function formatTimestamp(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value; // already formatted — pass through
  return formatDistanceToNow(date, { addSuffix: true });
}

const MARKDOWN_BUBBLE_STYLE: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#000000',
};

// ─── ChatBubble ───────────────────────────────────────────────────────────────

export interface ChatBubbleProps {
  // Identity
  sender: string;
  role: 'human' | 'ai';
  agentRole?: string;
  /** Node ID — drives deterministic avatar color via AgentAvatar. */
  nodeId?: string;
  /** Explicit Tailwind bg class — overrides nodeId-based color. */
  color?: string;
  avatarTooltip?: string;

  // Content — data only
  content: string;
  copyContent?: string;

  // Timestamps & metrics
  timestamp?: string;
  tokens?: TokenInfo;

  // Semantic state flags — drive styling
  isPending?: boolean;
  pendingNote?: string;
  isReport?: boolean;
  isWorking?: boolean;

  // Escape hatch for non-markdown structured content (working blocks)
  customBody?: React.ReactNode;
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(
  ({
    sender,
    role,
    agentRole,
    nodeId,
    color,
    avatarTooltip,
    content,
    copyContent,
    timestamp,
    tokens,
    isPending,
    pendingNote,
    isReport,
    isWorking,
    customBody,
  }) => {
    const isHuman = role === 'human';

    const wrappedAvatar = (
      <AgentAvatar
        label={sender}
        nodeId={nodeId}
        colorOverride={color ?? (isHuman ? 'bg-gray-500' : undefined)}
        tooltip={avatarTooltip}
        tooltipSide={isHuman ? 'left' : 'right'}
        size="md"
      />
    );

    const copyText = copyContent ?? content ?? '';

    // Compute bubble classes from state flags
    const bubbleClass = isPending
      ? 'border-2 border-dashed border-gray-300'
      : isReport
        ? 'bg-blue-50 text-blue-900 border border-blue-200'
        : isHuman
          ? 'bg-primary/10 border border-primary/20'
          : 'bg-muted/40 border border-border';

    const bubbleStyle: React.CSSProperties | undefined = isWorking
      ? { background: '#fff', border: '1px solid #e5e5e5' }
      : undefined;

    const containerStyle: React.CSSProperties | undefined = isPending
      ? { opacity: 0.6 }
      : isWorking
        ? { marginBottom: 8, width: '100%' }
        : undefined;

    // Render body content
    const body = customBody ? (
      customBody
    ) : isReport ? (
      <div>
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-200">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Status report
          </span>
        </div>
        <MarkdownContent content={content} style={MARKDOWN_BUBBLE_STYLE} />
      </div>
    ) : (
      <MarkdownContent content={content} style={MARKDOWN_BUBBLE_STYLE} />
    );

    return (
      <div
        className={`flex gap-3 ${isHuman ? 'flex-row-reverse' : ''}`}
        style={containerStyle}>
        {wrappedAvatar}

        <div
          className={`max-w-[76%] flex flex-col ${isHuman ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${bubbleClass}`}
            style={bubbleStyle}>
            {body}
          </div>

          <div
            className={`flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground flex-wrap ${isHuman ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium text-foreground/60">{sender}</span>
            {agentRole && (
              <>
                <span>·</span>
                <span>{agentRole}</span>
              </>
            )}
            {timestamp && (
              <>
                <span>·</span>
                <span>{formatTimestamp(timestamp)}</span>
              </>
            )}
            {tokens && (
              <>
                <span>·</span>
                <TokenBadge tokens={tokens} />
              </>
            )}
            {!isWorking && <CopyButton text={copyText} />}
          </div>
          {pendingNote && (
            <span className="text-[11px] mt-1 text-muted-foreground italic">
              {pendingNote}
            </span>
          )}
        </div>
      </div>
    );
  },
);

ChatBubble.displayName = 'ChatBubble';
