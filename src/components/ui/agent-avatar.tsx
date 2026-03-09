import React from 'react';

import { Avatar, AvatarFallback } from './avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from './utils';

// ─── Color & Initials ────────────────────────────────────────────────────────

const AGENT_AVATAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500',
];

/** Deterministic color from a node ID. */
export const getAgentColor = (nodeId: string): string => {
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) {
    hash = (hash * 31 + nodeId.charCodeAt(i)) | 0;
  }
  return AGENT_AVATAR_COLORS[Math.abs(hash) % AGENT_AVATAR_COLORS.length]!;
};

/** Parse "Name (Role)" → { name, role }. */
export const parseAgentLabel = (
  label: string,
): { name: string; role?: string } => {
  const match = label.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { name: match[1]!.trim(), role: match[2]!.trim() };
  }
  return { name: label };
};

/** Up to 2-char uppercase initials from an agent label. */
export const getAgentInitials = (label: string): string => {
  const { name } = parseAgentLabel(label);
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

const SIZE_MAP = {
  xs: { avatar: 'w-4 h-4', text: 'text-[8px]' },
  sm: { avatar: 'w-5 h-5', text: 'text-[9px]' },
  md: { avatar: 'w-8 h-8', text: 'text-[11px]' },
} as const;

export type AgentAvatarSize = keyof typeof SIZE_MAP;

// ─── AgentAvatar ─────────────────────────────────────────────────────────────

export interface AgentAvatarProps {
  /** Agent display label — used for initials. */
  label: string;
  /** Node ID — used for deterministic color. When omitted, falls back to `colorOverride` or a neutral gray. */
  nodeId?: string;
  /** Explicit Tailwind bg class to override the computed color. */
  colorOverride?: string;
  /** Tooltip text shown on hover. */
  tooltip?: string;
  /** Tooltip side. */
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  /** Predefined size variant. @default 'md' */
  size?: AgentAvatarSize;
  /** Extra classes on the Avatar root. */
  className?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = React.memo(
  ({
    label,
    nodeId,
    colorOverride,
    tooltip,
    tooltipSide,
    size = 'md',
    className,
  }) => {
    const s = SIZE_MAP[size];
    const bgColor =
      colorOverride ?? (nodeId ? getAgentColor(nodeId) : 'bg-gray-500');

    const el = (
      <Avatar className={cn(s.avatar, 'flex-shrink-0', className)}>
        <AvatarFallback className={`${bgColor} text-white ${s.text}`}>
          {getAgentInitials(label)}
        </AvatarFallback>
      </Avatar>
    );

    if (!tooltip) return el;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{el}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);

AgentAvatar.displayName = 'AgentAvatar';
