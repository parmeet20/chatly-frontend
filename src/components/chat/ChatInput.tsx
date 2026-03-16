'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/stores/chat-store';
import { toast } from 'sonner';

export function ChatInput() {
  const [content, setContent] = useState('');
  const { sendMessage, isConnected } = useChatStore();

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) return;
    
    if (!isConnected) {
      toast.error('Not connected to chat server');
      return;
    }
    
    sendMessage(trimmedContent);
    setContent('');
  };

  return (
    <div className="p-4 bg-black/40 backdrop-blur-2xl border-t border-white/5 relative z-10 w-full">
      <form onSubmit={handleSend} className="w-full relative flex items-center">
        <Input 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isConnected ? "Message room..." : "Connecting to real-time chat..."}
          disabled={!isConnected}
          className="h-14 w-full bg-white/5 border-white/10 focus-visible:ring-indigo-500 focus-visible:bg-white/10 pl-6 pr-14 rounded-full text-white placeholder:text-white/30 transition-all text-[15px]"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!isConnected || !content.trim()}
          className="absolute right-2 h-10 w-10 bg-indigo-500 hover:bg-indigo-400 rounded-full text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
        >
          <Send size={18} className={content.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
        </Button>
      </form>
    </div>
  );
}
