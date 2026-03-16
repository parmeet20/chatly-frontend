import { create } from 'zustand';
import { Message } from '@/types/message';
import { wsService } from '@/services/websocket';

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  connectWebSocket: (roomId: string, token: string) => void;
  disconnectWebSocket: () => void;
  sendMessage: (content: string) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => {
  // Set up listeners once
  wsService.onConnectionChange((isConnected) => {
    set({ isConnected });
  });

  wsService.onMessage((message) => {
    get().addMessage(message);
  });

  return {
    messages: [],
    isConnected: false,

    connectWebSocket: (roomId: string, token: string) => {
      wsService.connect(roomId, token);
    },

    disconnectWebSocket: () => {
      wsService.disconnect();
      set({ messages: [], isConnected: false });
    },

    sendMessage: (content: string) => {
      wsService.send(content);
    },

    addMessage: (message: Message) => {
      set((state) => {
        // Prevent duplicate messages by checking ID
        if (state.messages.some((m) => m.id === message.id)) {
          return state;
        }
        return { messages: [...state.messages, message] };
      });
    },

    setMessages: (messages: Message[]) => {
      set({ messages });
    },
  };
});
