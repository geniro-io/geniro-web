import { useCallback, useState } from 'react';

/**
 * Persists a value in localStorage across sessions.
 * Falls back to `defaultValue` if the key is absent or unreadable.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setStateInternal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  });

  const setState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStateInternal((prev) => {
        const next =
          typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // localStorage unavailable (e.g., private browsing quota exceeded)
        }
        return next;
      });
    },
    [key],
  );

  return [state, setState];
}
