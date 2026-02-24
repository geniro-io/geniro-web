import { useCallback, useEffect, useRef, useState } from 'react';

import { threadsApi } from '../../../api';
import { useThreadMessageStore } from '../../../hooks/useThreadMessageStore';
import { extractApiErrorMessage } from '../../../utils/errors';
import { mergeMessagesReplacingStreaming } from '../../../utils/threadMessages';
import type { AntdMessageApi, MessageMeta } from '../types';
import {
  DEFAULT_MESSAGE_META,
  isDraftThreadId,
  THREAD_MESSAGES_PAGE_SIZE,
} from '../utils/chatsPageUtils';

interface UseChatsMessagesDeps {
  antdMessage: AntdMessageApi;
}

export const useChatsMessages = (deps: UseChatsMessagesDeps) => {
  const { antdMessage } = deps;
  const {
    messages,
    updateMessages,
    pendingMessages,
    updatePendingMessages,
    externalThreadIds,
    setExternalThreadIds,
  } = useThreadMessageStore();

  const [messageMeta, setMessageMeta] = useState<Record<string, MessageMeta>>(
    {},
  );
  const messageMetaRef = useRef(messageMeta);
  useEffect(() => {
    messageMetaRef.current = messageMeta;
  }, [messageMeta]);
  const loadingThreadsRef = useRef<Set<string>>(new Set());
  const externalThreadIdsRef = useRef(externalThreadIds);
  useEffect(() => {
    externalThreadIdsRef.current = externalThreadIds;
  }, [externalThreadIds]);

  const getMessageMeta = useCallback((threadId?: string): MessageMeta => {
    if (!threadId) return DEFAULT_MESSAGE_META;
    return messageMetaRef.current[threadId] ?? DEFAULT_MESSAGE_META;
  }, []);

  const updateMessageMeta = useCallback(
    (threadId: string, updater: (prev: MessageMeta) => MessageMeta) => {
      setMessageMeta((prev) => {
        const existing = prev[threadId] ?? DEFAULT_MESSAGE_META;
        return {
          ...prev,
          [threadId]: updater(existing),
        };
      });
    },
    [],
  );

  const loadMessagesForThread = useCallback(
    async (threadId: string, force = false) => {
      if (isDraftThreadId(threadId)) {
        updateMessageMeta(threadId, (prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          hasMore: false,
          offset: prev.offset,
        }));
        return;
      }

      if (!force && loadingThreadsRef.current.has(threadId)) {
        return;
      }

      const meta = getMessageMeta(threadId);
      if (
        !force &&
        (meta.loading || meta.offset > 0 || meta.initialLoadFailed)
      ) {
        return;
      }

      loadingThreadsRef.current.add(threadId);
      updateMessageMeta(threadId, (prev) => ({
        ...prev,
        loading: true,
        loadingMore: false,
        hasMore: true,
        offset: force ? 0 : prev.offset,
        initialLoadFailed: false,
      }));

      try {
        const response = await threadsApi.getThreadMessages(
          threadId,
          undefined,
          THREAD_MESSAGES_PAGE_SIZE,
          0,
        );
        const fetched = response.data?.reverse() || [];
        updateMessages(threadId, (prev) =>
          mergeMessagesReplacingStreaming(prev, fetched),
        );
        updateMessageMeta(threadId, (prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          hasMore: fetched.length === THREAD_MESSAGES_PAGE_SIZE,
          offset: fetched.length,
        }));

        const extId =
          fetched.find((msg) => msg.externalThreadId)?.externalThreadId ??
          externalThreadIdsRef.current[threadId];
        if (extId) {
          setExternalThreadIds((prev) => ({
            ...prev,
            [threadId]: extId,
          }));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        const errorMessage = extractApiErrorMessage(
          error,
          'Failed to load messages',
        );
        antdMessage.error(errorMessage);
        updateMessageMeta(threadId, (prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          hasMore: false,
          initialLoadFailed: true,
        }));
      } finally {
        loadingThreadsRef.current.delete(threadId);
      }
    },
    [
      antdMessage,
      getMessageMeta,
      updateMessageMeta,
      updateMessages,
      setExternalThreadIds,
    ],
  );

  const loadMoreMessagesForThread = useCallback(
    async (threadId: string) => {
      if (isDraftThreadId(threadId)) {
        updateMessageMeta(threadId, (prev) => ({
          ...prev,
          loadingMore: false,
          hasMore: false,
        }));
        return;
      }

      const meta = getMessageMeta(threadId);
      if (meta.loading || meta.loadingMore || !meta.hasMore) {
        return;
      }

      updateMessageMeta(threadId, (prev) => ({ ...prev, loadingMore: true }));

      try {
        const response = await threadsApi.getThreadMessages(
          threadId,
          undefined,
          THREAD_MESSAGES_PAGE_SIZE,
          meta.offset,
        );
        const fetched = response.data?.reverse() || [];

        if (fetched.length > 0) {
          updateMessages(threadId, (prev) =>
            mergeMessagesReplacingStreaming(prev, fetched),
          );
          updateMessageMeta(threadId, (prev) => ({
            ...prev,
            loadingMore: false,
            hasMore: fetched.length === THREAD_MESSAGES_PAGE_SIZE,
            offset: prev.offset + fetched.length,
          }));
        } else {
          updateMessageMeta(threadId, (prev) => ({
            ...prev,
            loadingMore: false,
            hasMore: false,
          }));
        }
      } catch (error) {
        console.error('Error loading more messages:', error);
        const errorMessage = extractApiErrorMessage(
          error,
          'Failed to load more messages',
        );
        antdMessage.error(errorMessage);
        updateMessageMeta(threadId, (prev) => ({
          ...prev,
          loadingMore: false,
          hasMore: false,
        }));
      }
    },
    [antdMessage, getMessageMeta, updateMessageMeta, updateMessages],
  );

  return {
    messages,
    updateMessages,
    pendingMessages,
    updatePendingMessages,
    externalThreadIds,
    setExternalThreadIds,
    messageMeta,
    setMessageMeta,
    getMessageMeta,
    updateMessageMeta,
    loadMessagesForThread,
    loadMoreMessagesForThread,
  };
};
