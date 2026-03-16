'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RoomMember } from '@/types/room';

interface MemberItemProps {
  member: RoomMember;
  isOwner?: boolean;
}

export function MemberItem({ member, isOwner = false }: MemberItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="relative">
        <Avatar className={`h-10 w-10 ring-1 ring-white/10 border border-transparent transition-all ${isOwner ? 'ring-2 ring-yellow-500/50 group-hover:border-yellow-500/20' : 'group-hover:border-white/20'}`}>
          <AvatarFallback className={`bg-gradient-to-br text-white/80 ${isOwner ? 'from-yellow-500/20 to-orange-500/20 text-yellow-300' : 'from-white/10 to-white/5'}`}>
            {member.Username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {!isOwner && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-sm text-white">{member.Username}</span>
        {isOwner && <span className="text-xs text-white/40">Owner</span>}
      </div>
    </div>
  );
}
