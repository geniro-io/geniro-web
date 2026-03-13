import isPlainObject from 'lodash/isPlainObject';
import type { JsonValue } from 'type-fest';

import type { MessagePayload } from './threadMessagesTypes';

// ────────────────────────────────────────────
// Token / price formatting
// ────────────────────────────────────────────

const tokenCountFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export const formatTokenCount = (value: number): string => {
  if (!Number.isFinite(value)) return '—';
  return tokenCountFormatter.format(value);
};

export const formatRequestTokenCount = (value: number): string => {
  if (!Number.isFinite(value)) return '—';

  const formatTruncatedDecimal = (raw: number): string => {
    const truncated = Math.floor(raw * 10) / 10;
    const normalized = String(truncated).replace('.', ',');
    return normalized.endsWith(',0') ? normalized.slice(0, -2) : normalized;
  };

  if (value < 1000) {
    return formatTokenCount(value);
  }

  if (value < 1_000_000) {
    return `${formatTruncatedDecimal(value / 1000)}k`;
  }

  return `${formatTruncatedDecimal(value / 1_000_000)}m`;
};

const requestUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export const formatRequestUsdShort = (amount?: number | null): string => {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return '$—';
  const truncated = Math.floor(amount * 1000) / 1000;
  return requestUsdFormatter.format(truncated);
};

/** Formats a duration in milliseconds to a human-readable string.
 *  Examples: "2.6s", "45s", "1m 23s", "5m 2s" */
export const formatDurationMs = (ms: number): string => {
  if (!Number.isFinite(ms) || ms <= 0) return '—';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const totalSeconds = ms / 1000;
  // Use the minutes format once the rounded display would reach 60s.
  const rounded = Math.round(totalSeconds * 10) / 10;
  if (rounded < 60) {
    return `${rounded}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
};

// ────────────────────────────────────────────
// Message payload helpers
// ────────────────────────────────────────────

const getMessageRecord = (
  payload?: MessagePayload,
): Record<string, unknown> | undefined => {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }
  return payload as unknown as Record<string, unknown>;
};

/**
 * Extracts and normalizes the `additionalKwargs` / `additional_kwargs` record
 * from a message payload. Returns `undefined` when none is present.
 */
export const getAdditionalKwargs = (
  payload?: MessagePayload,
): Record<string, unknown> | undefined => {
  const record = getMessageRecord(payload);
  if (!record) return undefined;

  const additional =
    (record.additionalKwargs as Record<string, unknown> | undefined) ??
    (record.additional_kwargs as Record<string, unknown> | undefined);

  return isPlainObject(additional)
    ? (additional as Record<string, unknown>)
    : undefined;
};

/** Extracts `durationMs` from `additionalKwargs.__requestUsage.durationMs`
 *  of a message payload.  Returns `undefined` when not available. */
export const extractDurationMs = (
  payload?: MessagePayload,
): number | undefined => {
  const additional = getAdditionalKwargs(payload);
  const reqUsage = additional?.__requestUsage;
  if (reqUsage && typeof reqUsage === 'object' && !Array.isArray(reqUsage)) {
    const dur = (reqUsage as Record<string, unknown>).durationMs;
    if (typeof dur === 'number' && dur > 0) return dur;
  }
  return undefined;
};

/** Extracts `__durationMs` from `additionalKwargs` of a tool message payload.
 *  Set by ShellTool on the ToolMessage to record shell execution time.
 *  Returns `undefined` when not available. */
export const extractShellDurationMs = (
  payload?: MessagePayload,
): number | undefined => {
  const additional = getAdditionalKwargs(payload);
  const dur = additional?.__durationMs;
  if (typeof dur === 'number' && dur > 0) return dur;
  return undefined;
};

export const getMessageValue = <T = unknown>(
  payload: MessagePayload | undefined,
  key: string,
): T | undefined => {
  const record = getMessageRecord(payload);
  if (!record) return undefined;
  return record[key] as T | undefined;
};

export const getMessageString = (
  payload: MessagePayload | undefined,
  key: string,
): string | undefined => {
  const value = getMessageValue(payload, key);
  return typeof value === 'string' ? value : undefined;
};

export const getMessageTitle = (
  payload?: MessagePayload,
): string | undefined => {
  const title = getMessageString(payload, 'title');
  if (title && title.trim().length > 0) {
    return title;
  }

  const legacy = getMessageString(payload, '__title');
  if (legacy && legacy.trim().length > 0) {
    return legacy;
  }

  return undefined;
};

export const extractToolErrorText = (
  resultContent: unknown,
): string | undefined => {
  if (!isPlainObject(resultContent)) return undefined;
  const record = resultContent as Record<string, unknown>;
  const errorValue = record.error;

  if (typeof errorValue === 'string') {
    const trimmed = errorValue.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (errorValue === null || errorValue === undefined) {
    return undefined;
  }

  try {
    const serialized = JSON.stringify(errorValue, null, 2);
    const trimmed = serialized.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  } catch {
    const asString = String(errorValue);
    const trimmed = asString.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
};

export const getMessageRunId = (
  payload?: MessagePayload,
): string | undefined => {
  const record = getMessageRecord(payload);
  if (!record) return undefined;

  const direct = (record.runId as unknown) ?? (record.run_id as unknown);
  if (typeof direct === 'string' && direct.length > 0) {
    return direct;
  }

  const additional =
    (record.additionalKwargs as Record<string, unknown> | undefined) ??
    (record.additional_kwargs as Record<string, unknown> | undefined);

  const normalizedAdditional = isPlainObject(additional)
    ? (additional as Record<string, unknown>)
    : undefined;

  const fromAdditional =
    normalizedAdditional &&
    ((normalizedAdditional.__runId as unknown) ??
      (normalizedAdditional.run_id as unknown) ??
      (normalizedAdditional.runId as unknown));

  if (typeof fromAdditional === 'string' && fromAdditional.length > 0) {
    return fromAdditional;
  }
  return undefined;
};

export const getToolMessageKey = (msg?: {
  id?: string;
  message?: MessagePayload;
  createdAt?: string;
}): string | undefined => {
  if (!msg) return undefined;
  if (msg.id) return msg.id;
  const messageLevelId = getMessageString(msg.message, 'id');
  if (messageLevelId) return messageLevelId;
  if (msg.createdAt) return `created-${msg.createdAt}`;
  const toolCallId = getMessageString(msg.message, 'toolCallId');
  if (toolCallId) return `toolCall-${toolCallId}`;
  return undefined;
};

export const isToolLikeRole = (role?: string): boolean => {
  if (!role) return false;
  return role === 'tool';
};

export const isErrorMessage = (message: {
  message?: MessagePayload;
}): boolean => {
  const additional = getAdditionalKwargs(message.message);
  return Boolean(additional?.__isErrorMessage);
};

// ────────────────────────────────────────────
// CSS injection
// ────────────────────────────────────────────

export const ensureThinkingIndicatorStyles = (() => {
  let injected = false;
  return () => {
    if (injected || typeof document === 'undefined') return;
    if (document.getElementById('messages-tab-thinking-style')) {
      injected = true;
      return;
    }
    const style = document.createElement('style');
    style.id = 'messages-tab-thinking-style';
    style.textContent = `
      @keyframes messages-tab-thinking-pulse {
        0% { opacity: 0.7; }
        50% { opacity: 1; }
        100% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    injected = true;
  };
})();

// ────────────────────────────────────────────
// Style constants
// ────────────────────────────────────────────

export const fullHeightColumnStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
};

export const centeredStateStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const scrollContainerStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '12px 16px',
};

export const messageBlockStyle: React.CSSProperties = {
  marginBottom: '15px',
};

// ────────────────────────────────────────────
// Color generation
// ────────────────────────────────────────────

export const generateColorFromNodeId = (nodeId: string): string => {
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) {
    hash = nodeId.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  const hue = Math.abs(hash % 360);
  const saturation = 70;
  const lightness = 50;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// ────────────────────────────────────────────
// JSON / args helpers
// ────────────────────────────────────────────

export const parseJsonSafe = (value: string): unknown | null => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

export const argsToObject = (
  args?: string | Record<string, unknown>,
): Record<string, JsonValue> | null => {
  if (!args) return null;
  if (typeof args === 'string') {
    const parsed = parseJsonSafe(args);
    return isPlainObject(parsed) ? (parsed as Record<string, JsonValue>) : null;
  }
  if (isPlainObject(args)) {
    return args as Record<string, JsonValue>;
  }
  return null;
};

export const extractShellCommandFromArgs = (
  args?: string | Record<string, unknown>,
): string | undefined => {
  const obj = argsToObject(args);
  if (!obj) return undefined;
  if (typeof obj.command === 'string') return obj.command;
  if (typeof obj.cmd === 'string') return obj.cmd;
  return undefined;
};
