'use client';

import { Message } from '@/types/message';
import { useAuthStore } from '@/stores/auth-store';
import { motion } from 'framer-motion';

export function MessageBubble({ message }: { message: Message }) {
  const { user } = useAuthStore();
  // The backend might be passing ID in sender_id instead of username.
  // We'll check both user.id and user.username (or fallback to just matching username).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSelf = user?.username === message.sender_id || (user as any)?.id === message.sender_id || (user as any)?._id === message.sender_id;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      layout
      className={`flex w-full ${isSelf ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex flex-col max-w-[85%] md:max-w-[65%] ${isSelf ? 'items-end' : 'items-start'} group`}>
        {!isSelf && <span className="text-xs font-medium text-white/60 mb-1 ml-1">{message.sender_id}</span>}
        <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed relative ${
          isSelf 
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm shadow-lg shadow-indigo-500/20' 
            : 'glass-panel text-white/90 rounded-bl-sm'
        }`}>
          {message.content}
        </div>
        <span className={`text-[10px] text-white/40 mt-1.5 ${isSelf ? 'mr-1' : 'ml-1'} transition-opacity`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
