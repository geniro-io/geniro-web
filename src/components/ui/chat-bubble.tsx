import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { CopyButton, TokenBadge, type TokenInfo } from './token-display';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export type { TokenInfo } from './token-display';
export { CopyButton } from './token-display';

// ─── ChatBubble ───────────────────────────────────────────────────────────────

export interface ChatBubbleProps {
  sender: string;
  role: 'human' | 'ai';
  agentRole?: string;
  /** Simple text content — rendered when `children` is not provided. */
  content?: string;
  /** Rich content (MarkdownContent, nested blocks). Takes precedence over `content`. */
  children?: React.ReactNode;
  timestamp?: string;
  /** Tailwind bg color class (e.g. "bg-blue-500") or raw CSS color. */
  color: string;
  tokens?: TokenInfo;
  /** Image URL for the avatar (dicebear data URI, gravatar, etc.). */
  avatarSrc?: string;
  /** Tooltip text shown on avatar hover. */
  avatarTooltip?: string;
  /** Custom footer replacing the default metadata row. */
  footer?: React.ReactNode;
  /** Additional Tailwind classes appended to the bubble div. */
  bubbleClassName?: string;
  /** Inline style overrides for the bubble div. */
  bubbleStyle?: React.CSSProperties;
  /** Inline style overrides for the outer container div. */
  containerStyle?: React.CSSProperties;
  /** Text for the clipboard copy button. Defaults to `content`. */
  copyContent?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(
  ({
    sender,
    role,
    agentRole,
    content,
    children,
    timestamp,
    color,
    tokens,
    avatarSrc,
    avatarTooltip,
    footer,
    bubbleClassName,
    bubbleStyle,
    containerStyle,
    copyContent,
  }) => {
    const isHuman = role === 'human';
    const initials = sender
      .split(' ')
      .map((n) => n[0])
      .join('');

    const avatarElement = (
      <Avatar className="w-8 h-8 flex-shrink-0">
        {avatarSrc && <AvatarImage src={avatarSrc} />}
        <AvatarFallback className={`${color} text-white text-[11px]`}>
          {initials}
        </AvatarFallback>
      </Avatar>
    );

    const wrappedAvatar = avatarTooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
        <TooltipContent side={isHuman ? 'left' : 'right'}>
          {avatarTooltip}
        </TooltipContent>
      </Tooltip>
    ) : (
      avatarElement
    );

    const copyText = copyContent ?? content ?? '';

    const defaultBubbleClass = isHuman
      ? 'bg-blue-50 text-blue-900 border border-blue-100'
      : 'bg-muted text-foreground';

    const hasCustomFooter = footer !== undefined;

    return (
      <div
        className={`flex gap-3 ${isHuman ? 'flex-row-reverse' : ''}`}
        style={containerStyle}>
        {wrappedAvatar}

        <div
          className={`max-w-[76%] flex flex-col ${isHuman ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${defaultBubbleClass} ${bubbleClassName ?? ''}`}
            style={bubbleStyle}>
            {children ?? content}
          </div>

          {hasCustomFooter ? (
            footer && (
              <div className="flex items-center gap-2 mt-1">{footer}</div>
            )
          ) : (
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
                  <span>{timestamp}</span>
                </>
              )}
              {tokens && (
                <>
                  <span>·</span>
                  <TokenBadge tokens={tokens} />
                </>
              )}
              <CopyButton text={copyText} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

ChatBubble.displayName = 'ChatBubble';
