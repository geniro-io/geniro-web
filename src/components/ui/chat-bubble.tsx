import { Avatar, AvatarFallback } from './avatar';
import { CopyButton, TokenBadge, type TokenInfo } from './token-display';

export type { TokenInfo } from './token-display';
export { CopyButton } from './token-display';

// ─── ChatBubble ───────────────────────────────────────────────────────────────

export interface ChatBubbleProps {
  sender: string;
  role: 'human' | 'ai';
  agentRole?: string;
  content: string;
  timestamp: string;
  /** Tailwind bg color class, e.g. "bg-blue-500" */
  color: string;
  tokens?: TokenInfo;
}

export function ChatBubble({
  sender,
  role,
  agentRole,
  content,
  timestamp,
  color,
  tokens,
}: ChatBubbleProps) {
  const isHuman = role === 'human';

  return (
    <div className={`flex gap-3 ${isHuman ? 'flex-row-reverse' : ''}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={`${color} text-white text-[11px]`}>
          {sender
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>

      <div
        className={`max-w-[76%] flex flex-col ${isHuman ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
            isHuman
              ? 'bg-blue-50 text-blue-900 border border-blue-100'
              : 'bg-muted text-foreground'
          }`}>
          {content}
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
          <span>·</span>
          <span>{timestamp}</span>
          {tokens && (
            <>
              <span>·</span>
              <TokenBadge tokens={tokens} />
            </>
          )}
          <CopyButton text={content} />
        </div>
      </div>
    </div>
  );
}
