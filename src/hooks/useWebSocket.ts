import { useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useAuthStore } from '@/stores/auth-store';

export const useWebSocket = (roomId: string | null) => {
  const { connectWebSocket, disconnectWebSocket, isConnected } = useChatStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (roomId && token) {
      connectWebSocket(roomId, token);
    }

    return () => {
      // Disconnect when leaving the room
      if (roomId) {
        disconnectWebSocket();
      }
    };
  }, [roomId, token, connectWebSocket, disconnectWebSocket]);

  return { isConnected };
};
