'use client';

import { Message } from '@/types/message';
import { MessageBubble } from './MessageBubble';
import { useEffect, useRef } from 'react';

export function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar flex flex-col gap-6 w-full">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/40 h-full">
          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-sm">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
      )}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
