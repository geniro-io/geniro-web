/**
 * Custom React Hook for WebSocket
 * Provides easy access to WebSocket service in React components
 */

import { useCallback, useEffect, useRef } from 'react';

import { useAuth } from '../auth/AuthModuleContext';
import {
  SocketEventHandler,
  webSocketService,
} from '../services/WebSocketService';
import type { SocketNotification } from '../services/WebSocketTypes';

interface UseWebSocketOptions {
  /**
   * Auto-connect when the hook mounts
   * Default: true
   */
  autoConnect?: boolean;

  /**
   * Graph ID to subscribe to automatically
   */
  graphId?: string;

  /**
   * Event handlers for specific event types
   */
  handlers?: {
    [eventType: string]: SocketEventHandler;
  };
}

interface UseWebSocketReturn {
  /**
   * Whether the socket is currently connected
   */
  isConnected: boolean;

  /**
   * Subscribe to a specific graph
   */
  subscribeToGraph: (graphId: string) => void;

  /**
   * Unsubscribe from a specific graph
   */
  unsubscribeFromGraph: (graphId: string) => void;

  /**
   * Register an event handler
   */
  on: (eventType: string, handler: SocketEventHandler) => () => void;

  /**
   * Unregister an event handler
   */
  off: (eventType: string, handler: SocketEventHandler) => void;
}

/**
 * Custom hook for WebSocket functionality
 *
 * @example
 * ```tsx
 * const { subscribeToGraph, on } = useWebSocket({
 *   graphId: 'graph-123',
 *   handlers: {
 *     'agent.message': (data) => {
 *       console.log('New message:', data);
 *     }
 *   }
 * });
 * ```
 */
export const useWebSocket = (
  options: UseWebSocketOptions = {},
): UseWebSocketReturn => {
  const { autoConnect = true, graphId, handlers } = options;
  const { token, userInfo } = useAuth();
  const handlersRef = useRef(handlers);
  const unsubscribeFnsRef = useRef<(() => void)[]>([]);

  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Connect to WebSocket server
  useEffect(() => {
    if (!autoConnect) return;

    if (!token) {
      console.warn('[useWebSocket] No token available, skipping connection');
      return;
    }

    // Get user ID from token for dev mode
    const userId = userInfo.sub;

    // Connect if not already connected
    if (!webSocketService.isConnected()) {
      webSocketService.connect(token, userId);
    }

    return () => {
      // Don't disconnect on unmount - keep the connection alive
      // The service is a singleton and other components may be using it
    };
  }, [autoConnect, token, userInfo.sub]);

  // Subscribe to graph
  useEffect(() => {
    if (!graphId) return;

    // Wait a bit for connection to establish
    const timer = setTimeout(() => {
      if (webSocketService.isConnected()) {
        webSocketService.subscribeToGraph(graphId);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (graphId) {
        webSocketService.unsubscribeFromGraph(graphId);
      }
    };
  }, [graphId]);

  // Register stable forwarding handlers — only re-run if the set of event
  // types changes, not when handler implementations change. The forwarding
  // functions delegate to `handlersRef.current` so they always invoke the
  // latest handler without needing to unsubscribe/resubscribe.
  useEffect(() => {
    const currentHandlers = handlersRef.current;
    if (!currentHandlers) return;

    const eventTypes = Object.keys(currentHandlers);

    // Create stable wrapper functions that forward to the ref
    const unsubscribeFns = eventTypes.map((eventType) => {
      const stableHandler = (data: SocketNotification) => {
        handlersRef.current?.[eventType]?.(data);
      };
      return webSocketService.on(eventType, stableHandler);
    });

    unsubscribeFnsRef.current = unsubscribeFns;

    return () => {
      unsubscribeFns.forEach((fn) => fn());
      unsubscribeFnsRef.current = [];
    };
    // Only re-run if the set of event types changes, not handler implementations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(handlers ? Object.keys(handlers) : [])]);

  const subscribeToGraph = useCallback((graphId: string) => {
    webSocketService.subscribeToGraph(graphId);
  }, []);

  const unsubscribeFromGraph = useCallback((graphId: string) => {
    webSocketService.unsubscribeFromGraph(graphId);
  }, []);

  const on = useCallback((eventType: string, handler: SocketEventHandler) => {
    return webSocketService.on(eventType, handler);
  }, []);

  const off = useCallback((eventType: string, handler: SocketEventHandler) => {
    webSocketService.off(eventType, handler);
  }, []);

  return {
    isConnected: webSocketService.isConnected(),
    subscribeToGraph,
    unsubscribeFromGraph,
    on,
    off,
  };
};

/**
 * Hook to listen for specific WebSocket events
 *
 * @example
 * ```tsx
 * useWebSocketEvent('agent.message', (data) => {
 *   console.log('New message:', data);
 * });
 * ```
 */
export const useWebSocketEvent = (
  eventType: string,
  handler: SocketEventHandler,
): void => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const unsubscribe = webSocketService.on(eventType, (...args) =>
      handlerRef.current(...args),
    );
    return unsubscribe;
  }, [eventType]);
};
