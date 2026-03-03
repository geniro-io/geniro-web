import { BarChart2, Check, Copy } from 'lucide-react';
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
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function fmtK(n: number) {
  return n >= 1000
    ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
    : String(n);
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
}: {
  tokens: TokenInfo;
  light?: boolean;
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
          <StatRow label="Input" value={tokens.input.toLocaleString()} />
        )}
        {!!tokens.cachedInput && (
          <StatRow
            label="Cached input"
            value={tokens.cachedInput.toLocaleString()}
          />
        )}
        {tokens.output !== undefined && (
          <StatRow label="Output" value={tokens.output.toLocaleString()} />
        )}
        {!!tokens.reasoning && (
          <StatRow
            label="Reasoning"
            value={tokens.reasoning.toLocaleString()}
          />
        )}
        <div className="border-t border-border my-1" />
        <StatRow label="Total" value={tokens.total.toLocaleString()} bold />
        <StatRow label="Cost" value={tokens.cost} bold />
        {tokens.duration && (
          <StatRow label="Duration" value={tokens.duration} />
        )}
      </PopoverContent>
    </Popover>
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
