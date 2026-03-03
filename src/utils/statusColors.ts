/**
 * Single source of truth for status badge Tailwind classes.
 * Every status badge in the app should use `getStatusBadgeClass()`.
 */

const STATUS_BADGE_CLASSES: Record<string, string> = {
  // blue – active / in-progress
  running: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  created: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  compiling: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  starting: 'bg-blue-100 text-blue-700 hover:bg-blue-100',

  // green – success
  done: 'bg-green-100 text-green-700 hover:bg-green-100',
  applied: 'bg-green-100 text-green-700 hover:bg-green-100',

  // red – failure
  error: 'bg-red-100 text-red-700 hover:bg-red-100',
  failed: 'bg-red-100 text-red-700 hover:bg-red-100',

  // amber – needs attention
  draft: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  need_more_info: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  applying: 'bg-amber-100 text-amber-700 hover:bg-amber-100',

  // muted – inactive
  stopped: 'bg-muted text-muted-foreground hover:bg-muted',
  pending: 'bg-muted text-muted-foreground hover:bg-muted',
  idle: 'bg-muted text-muted-foreground hover:bg-muted',
};

const MUTED_FALLBACK = 'bg-muted text-muted-foreground hover:bg-muted';

export function getStatusBadgeClass(status: string): string {
  return STATUS_BADGE_CLASSES[status.toLowerCase()] ?? MUTED_FALLBACK;
}

export { STATUS_BADGE_CLASSES };
