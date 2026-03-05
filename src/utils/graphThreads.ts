export interface TriggerNodeInfo {
  id: string;
  name: string;
  template: string;
}

export const extractThreadSubId = (
  externalThreadId?: string | null,
): string | undefined => {
  if (!externalThreadId) return undefined;
  const parts = externalThreadId.split(':');
  return parts[parts.length - 1];
};
