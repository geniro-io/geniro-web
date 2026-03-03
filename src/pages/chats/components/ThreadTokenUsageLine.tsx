import React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import type { ThreadTokenUsageSnapshot } from '../types';
import {
  clampPercent,
  formatCompactNumber,
  formatUsd,
} from '../utils/chatsPageUtils';
import { ContextUsageGauge } from './ContextUsageGauge';

export const ThreadTokenUsageLine: React.FC<{
  usage?: ThreadTokenUsageSnapshot | null;
  withPopover?: boolean;
  contextMaxTokens?: number;
  contextPercent?: number;
}> = ({ usage, withPopover = false, contextMaxTokens, contextPercent }) => {
  const totalTokens = usage?.totalTokens;
  const totalPrice = usage?.totalPrice;
  const currentContext = usage?.currentContext;
  if (typeof totalTokens !== 'number') return null;

  const percent =
    typeof contextPercent === 'number'
      ? contextPercent
      : typeof currentContext === 'number' &&
          typeof contextMaxTokens === 'number' &&
          Number.isFinite(contextMaxTokens) &&
          contextMaxTokens > 0
        ? (currentContext / contextMaxTokens) * 100
        : undefined;

  const line = (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-muted-foreground">
        Token usage: {formatCompactNumber(totalTokens)} ({formatUsd(totalPrice)}
        )
      </span>
      {typeof percent === 'number' && <ContextUsageGauge percent={percent} />}
    </span>
  );

  if (!withPopover) return line;

  const popoverContent = (
    <div className="flex flex-col gap-0.5 max-w-[340px]">
      <span className="text-xs text-muted-foreground">
        Input tokens: {usage?.inputTokens ?? '\u2014'}
      </span>
      <span className="text-xs text-muted-foreground">
        Cached input tokens: {usage?.cachedInputTokens ?? '\u2014'}
      </span>
      <span className="text-xs text-muted-foreground">
        Output tokens: {usage?.outputTokens ?? '\u2014'}
      </span>
      <span className="text-xs text-muted-foreground">
        Reasoning tokens: {usage?.reasoningTokens ?? '\u2014'}
      </span>
      <span className="text-xs text-muted-foreground">
        Total tokens: {usage?.totalTokens ?? '\u2014'}
      </span>
      <span className="text-xs text-muted-foreground">
        Total cost: {formatUsd(usage?.totalPrice)}
      </span>
      <span className="text-xs text-muted-foreground">
        Current context: {usage?.currentContext ?? '\u2014'}
      </span>
      {typeof percent === 'number' && (
        <span className="text-xs text-muted-foreground">
          Context usage: {Math.round(clampPercent(percent))}%
          {typeof contextMaxTokens === 'number' &&
            Number.isFinite(contextMaxTokens) &&
            contextMaxTokens > 0 && (
              <> ({formatCompactNumber(contextMaxTokens)})</>
            )}
        </span>
      )}
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="inline-block cursor-help">{line}</span>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-auto p-3">
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
};
