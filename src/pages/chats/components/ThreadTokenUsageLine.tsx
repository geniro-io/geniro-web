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

  const fmt = (n?: number) =>
    typeof n === 'number' ? n.toLocaleString() : '\u2014';

  const popoverContent = (
    <div className="w-64 space-y-1">
      <p className="font-semibold text-foreground text-xs mb-2">Token Usage</p>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Input</span>
        <span className="font-medium text-foreground">
          {fmt(usage?.inputTokens)}
        </span>
      </div>
      {typeof usage?.cachedInputTokens === 'number' && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Cached input</span>
          <span className="font-medium text-foreground">
            {fmt(usage.cachedInputTokens)}
          </span>
        </div>
      )}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Output</span>
        <span className="font-medium text-foreground">
          {fmt(usage?.outputTokens)}
        </span>
      </div>
      {typeof usage?.reasoningTokens === 'number' &&
        usage.reasoningTokens > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Reasoning</span>
            <span className="font-medium text-foreground">
              {fmt(usage.reasoningTokens)}
            </span>
          </div>
        )}
      {typeof usage?.currentContext === 'number' && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current context</span>
          <span className="font-medium text-foreground">
            {fmt(usage.currentContext)}
          </span>
        </div>
      )}
      <div className="border-t border-border my-1" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Total</span>
        <span className="font-semibold text-foreground">
          {fmt(usage?.totalTokens)}
        </span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Cost</span>
        <span className="font-semibold text-foreground">
          {formatUsd(usage?.totalPrice)}
        </span>
      </div>
      {typeof percent === 'number' && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Context usage</span>
          <span className="font-medium text-foreground">
            {Math.round(clampPercent(percent))}%
            {typeof contextMaxTokens === 'number' &&
              Number.isFinite(contextMaxTokens) &&
              contextMaxTokens > 0 && (
                <> ({formatCompactNumber(contextMaxTokens)})</>
              )}
          </span>
        </div>
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
