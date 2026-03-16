import { Message } from '@/types/message';

type MessageCallback = (message: Message) => void;
type ConnectionCallback = (isConnected: boolean) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private roomId: string | null = null;
  private token: string | null = null;
  private isIntentionalDisconnect = false;

  connect(roomId: string, token: string) {
    if (this.socket?.readyState === WebSocket.OPEN && this.roomId === roomId) {
      return;
    }

    this.disconnect();

    this.roomId = roomId;
    this.token = token;
    this.isIntentionalDisconnect = false;

    // Based on the prompt: 
    // WebSocket connection must be established at: ws://localhost:8080/api/v1/ws/:roomId
    // Headers must include: Authorization: Bearer <token>
    // Note: Browser WebSockets do not support custom headers natively.
    // However, if the server checks the protocols for a token (a common workaround), we can pass it.
    // We'll also pass it as a query parameter as a fallback common practice, but we'll try to stick to standard WebSocket instantiation.
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'ws://localhost:8080/api/v1/ws';
    // Append the token as a query parameter as requested by the backend
    const wsUrl = token ? `${baseUrl}/${roomId}?token=${token}` : `${baseUrl}/${roomId}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(`WebSocket connected to room ${roomId}`);
        this.reconnectAttempts = 0;
        this.notifyConnectionState(true);
      };

      this.socket.onmessage = (event) => {
        try {
          const rawMessage = JSON.parse(event.data);
          
          // The backend might send content as '{"content":"hi"}' stringified inside the content field
          let parsedContent = rawMessage.content;
          try {
            if (typeof parsedContent === 'string' && parsedContent.startsWith('{')) {
              const innerObj = JSON.parse(parsedContent);
              if (innerObj.content) {
                parsedContent = innerObj.content;
              }
            }
          } catch (e) {
            // If it fails to parse, just use the raw string
          }

          // The user specifically requested Key to be: timestampstring+userid+roomid
          const generatedId = `${rawMessage.created_at || new Date().toISOString()}_${rawMessage.sender_id}_${rawMessage.room_id}`;

          const message: Message = {
            id: generatedId,
            room_id: rawMessage.room_id,
            sender_id: rawMessage.sender_id,
            content: parsedContent,
            created_at: rawMessage.created_at,
          };

          this.messageCallbacks.forEach((cb) => cb(message));
        } catch (error) {
          console.error('Failed to parse WebSocket message', error, event.data);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        this.notifyConnectionState(false);
        this.socket = null;

        if (!this.isIntentionalDisconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          const timeout = 1000 * Math.pow(2, this.reconnectAttempts); // Exponential backoff
          console.log(`Reconnecting in ${timeout}ms...`);
          setTimeout(() => {
            this.reconnectAttempts++;
            if (this.roomId && this.token) {
              this.connect(this.roomId, this.token);
            }
          }, timeout);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection', error);
      this.notifyConnectionState(false);
    }
  }

  disconnect() {
    this.isIntentionalDisconnect = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.roomId = null;
    this.notifyConnectionState(false);
  }

  send(content: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Backend expects the raw string, not a stringified JSON object containing 'content'
      this.socket.send(content);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(callback: MessageCallback) {
    this.messageCallbacks.add(callback);
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  onConnectionChange(callback: ConnectionCallback) {
    this.connectionCallbacks.add(callback);
    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  private notifyConnectionState(isConnected: boolean) {
    this.connectionCallbacks.forEach((cb) => cb(isConnected));
  }
}

export const wsService = new WebSocketService();
