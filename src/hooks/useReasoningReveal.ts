import { useEffect, useRef, useState } from 'react';

const DEFAULT_DURATION = 3000;
const DEFAULT_FLUSH_MS = 500;

/**
 * Animates reasoning text reveal via `requestAnimationFrame`.
 *
 * - On mount: `displayPos = content.length` — no animation for pre-loaded data.
 * - On content growth while `isStreaming`: animate reveal; first growth starts
 *   the timer, subsequent growths recalculate speed.
 * - On `isStreaming` → `false`: flush remaining in `flushMs` milliseconds.
 * - Cleanup: cancel `requestAnimationFrame` on unmount.
 */
export function useReasoningReveal(
  content: string,
  isStreaming: boolean,
  options?: { duration?: number; flushMs?: number },
): { displayContent: string; isRevealing: boolean } {
  const duration = options?.duration ?? DEFAULT_DURATION;
  const flushMs = options?.flushMs ?? DEFAULT_FLUSH_MS;

  // displayPos tracks the float position of revealed chars (ref avoids re-renders)
  const displayPos = useRef<number>(content.length);
  const speed = useRef(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef(0);
  const contentRef = useRef(content);
  const wasStreaming = useRef(isStreaming);
  const flushing = useRef(false);

  // React state that triggers re-renders
  const [displayContent, setDisplayContent] = useState(content);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    // Keep contentRef in sync for the rAF closure before any logic runs
    contentRef.current = content;

    const prevStreaming = wasStreaming.current;
    wasStreaming.current = isStreaming;

    const startRafLoop = () => {
      let lastTick = performance.now();

      const tick = () => {
        const now = performance.now();
        displayPos.current = Math.min(
          displayPos.current + (now - lastTick) * speed.current,
          contentRef.current.length,
        );
        lastTick = now;

        const pos = Math.floor(displayPos.current);
        setDisplayContent(contentRef.current.slice(0, pos));

        if (pos >= contentRef.current.length) {
          rafId.current = 0;
          startTime.current = null;
          flushing.current = false;
          setIsRevealing(false);
          return;
        }

        rafId.current = requestAnimationFrame(tick);
      };

      rafId.current = requestAnimationFrame(tick);
    };

    // Content grew while streaming — start or continue animation
    if (isStreaming && content.length > displayPos.current) {
      const arrivedLen = content.length;

      if (startTime.current === null) {
        // First growth — start the animation timer
        startTime.current = performance.now();
        speed.current = arrivedLen / duration;
        flushing.current = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: animation start must trigger re-render
        setIsRevealing(true);
      } else if (!flushing.current) {
        // Subsequent chunk — recalculate speed for remaining time
        const elapsed = performance.now() - startTime.current;
        const remaining = Math.max(duration - elapsed, 50);
        speed.current = (arrivedLen - displayPos.current) / remaining;
      }

      // Start rAF loop if not already running
      if (!rafId.current) startRafLoop();
    }

    // Streaming stopped — flush remaining text
    if (prevStreaming && !isStreaming && displayPos.current < content.length) {
      flushing.current = true;
      const remaining = content.length - displayPos.current;
      speed.current = remaining / flushMs;

      // Ensure rAF loop is running for the flush
      if (!rafId.current) startRafLoop();
    }

    // Streaming stopped and nothing to flush — just sync
    if (!isStreaming && displayPos.current >= content.length) {
      setDisplayContent(content);
    }
  }, [content, isStreaming, duration, flushMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  return { displayContent, isRevealing };
}
