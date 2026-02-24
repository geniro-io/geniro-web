/**
 * WebSocket Service
 * Manages socket.io connection for real-time graph updates
 */

import { io, Socket } from 'socket.io-client';

import { API_URL } from '../config';
import type {
  GraphRevisionEventType,
  ServerErrorNotification,
  SocketNotification,
  SubscribeGraphPayload,
  UnsubscribeGraphPayload,
} from './WebSocketTypes';

export type SocketEventHandler = (data: SocketNotification) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 20;
  private eventHandlers: Map<string, Set<SocketEventHandler>> = new Map();
  private subscribedGraphs: Set<string> = new Set();
  private isConnecting = false;

  /**
   * Initialize and connect to the WebSocket server
   * @param token JWT token for authentication
   * @param userId User ID for dev mode authentication
   */
  connect(token: string, userId?: string): void {
    if (this.socket?.connected || this.isConnecting) {
      console.debug('[WebSocket] Already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.token = token;
    this.userId = userId || null;

    console.debug('[WebSocket] Connecting to:', API_URL);

    // Create socket connection with authentication
    this.socket = io(API_URL, {
      auth: {
        token: this.token,
        ...(this.userId && { 'x-dev-jwt-sub': this.userId }),
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
    this.isConnecting = false;
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.debug('[WebSocket] Connected:', this.socket?.id);
      this.reconnectAttempts = 0;

      // Re-subscribe to graphs after reconnection
      this.subscribedGraphs.forEach((graphId) => {
        this.subscribeToGraph(graphId);
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.debug('[WebSocket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WebSocket] Max reconnection attempts reached');
      }
    });

    // Graph update events
    this.socket.on('graph.update', (data: SocketNotification) => {
      this.emitToHandlers('graph.update', data);
    });

    // Agent message events
    this.socket.on('agent.message', (data: SocketNotification) => {
      this.emitToHandlers('agent.message', data);
    });

    // Agent state update events
    this.socket.on('agent.state.update', (data: SocketNotification) => {
      this.emitToHandlers('agent.state.update', data);
    });

    // Thread create events
    this.socket.on('thread.create', (data: SocketNotification) => {
      this.emitToHandlers('thread.create', data);
    });

    // Thread update events
    this.socket.on('thread.update', (data: SocketNotification) => {
      this.emitToHandlers('thread.update', data);
    });

    // Thread delete events
    this.socket.on('thread.delete', (data: SocketNotification) => {
      this.emitToHandlers('thread.delete', data);
    });

    // Graph node update events
    this.socket.on('graph.node.update', (data: SocketNotification) => {
      this.emitToHandlers('graph.node.update', data);
    });

    const revisionEvents: GraphRevisionEventType[] = [
      'graph.revision.create',
      'graph.revision.applying',
      'graph.revision.applied',
      'graph.revision.failed',
      'graph.revision.progress',
    ];

    revisionEvents.forEach((eventType) => {
      this.socket?.on(eventType, (data: SocketNotification) => {
        this.emitToHandlers(eventType, data);
      });
    });

    // Server error events
    this.socket.on('server_error', (error: ServerErrorNotification) => {
      console.error('[WebSocket] Server error:', error);
    });
  }

  /**
   * Emit notification to all registered handlers for an event type
   */
  private emitToHandlers(eventType: string, data: SocketNotification): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error('[WebSocket] Error in event handler:', error);
        }
      });
    }

    // Also emit to wildcard handlers
    const wildcardHandlers = this.eventHandlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error('[WebSocket] Error in wildcard handler:', error);
        }
      });
    }
  }

  /**
   * Subscribe to a specific graph for updates
   * @param graphId The ID of the graph to subscribe to
   */
  subscribeToGraph(graphId: string): void {
    if (!graphId) {
      console.warn('[WebSocket] Cannot subscribe - invalid graph id');
      return;
    }

    // Always track desired subscriptions so we can resubscribe on reconnect
    this.subscribedGraphs.add(graphId);

    if (!this.socket?.connected) {
      console.debug(
        '[WebSocket] Socket not connected yet. Queued subscription for graph:',
        graphId,
      );
      return;
    }

    console.debug('[WebSocket] Subscribing to graph:', graphId);
    const payload: SubscribeGraphPayload = { graphId };
    this.socket.emit(
      'subscribe_graph',
      payload,
      (response: { success: boolean; error?: string } | undefined) => {
        if (response && !response.success) {
          console.error(
            '[WebSocket] Graph subscription failed:',
            graphId,
            response.error,
          );
          // Retry once after a short delay (handleConnection may still be running)
          setTimeout(() => {
            if (this.socket?.connected && this.subscribedGraphs.has(graphId)) {
              console.debug(
                '[WebSocket] Retrying graph subscription:',
                graphId,
              );
              this.socket.emit(
                'subscribe_graph',
                payload,
                (
                  retryResponse:
                    | { success: boolean; error?: string }
                    | undefined,
                ) => {
                  if (retryResponse && !retryResponse.success) {
                    console.error(
                      '[WebSocket] Graph subscription retry also failed:',
                      graphId,
                      retryResponse.error,
                    );
                  } else if (retryResponse) {
                    console.debug(
                      '[WebSocket] Graph subscription confirmed on retry:',
                      graphId,
                    );
                  }
                },
              );
            }
          }, 1000);
        } else if (response) {
          console.debug('[WebSocket] Graph subscription confirmed:', graphId);
        }
      },
    );
  }

  /**
   * Unsubscribe from a specific graph
   * @param graphId The ID of the graph to unsubscribe from
   */
  unsubscribeFromGraph(graphId: string): void {
    if (!graphId) {
      console.warn('[WebSocket] Cannot unsubscribe - invalid graph id');
      return;
    }

    // Remove locally regardless of socket state so reconnects don't resubscribe
    this.subscribedGraphs.delete(graphId);

    if (!this.socket?.connected) {
      console.debug(
        '[WebSocket] Socket not connected. Removed queued subscription for graph:',
        graphId,
      );
      return;
    }

    console.debug('[WebSocket] Unsubscribing from graph:', graphId);
    const payload: UnsubscribeGraphPayload = { graphId };
    this.socket.emit('unsubscribe_graph', payload);
  }

  /**
   * Register an event handler
   * @param eventType The type of event to listen for (or '*' for all events)
   * @param handler The handler function to call when the event occurs
   * @returns A function to unregister the handler
   */
  on(eventType: string, handler: SocketEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }

    const handlerSet = this.eventHandlers.get(eventType);
    handlerSet?.add(handler);

    // Return unsubscribe function
    return () => {
      this.off(eventType, handler);
    };
  }

  /**
   * Unregister an event handler
   * @param eventType The type of event
   * @param handler The handler function to remove
   */
  off(eventType: string, handler: SocketEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
      }
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      console.debug('[WebSocket] Disconnecting');
      this.subscribedGraphs.clear();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if the socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get the current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
