'use client';

import { Room } from '@/types/room';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <Card className="glass-card flex flex-col p-5 gap-4 shadow-lg hover:shadow-indigo-500/20 transition-shadow cursor-pointer group border-white/5 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/5 group-hover:border-indigo-500/50 transition-colors">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 text-lg">
                {room.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-lg group-hover:text-indigo-300 transition-colors">{room.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-white/30 mt-2">
            <div className="flex items-center gap-1.5 py-1 px-2 rounded-full bg-white/5">
              <Clock size={12} />
              {new Date(room.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
