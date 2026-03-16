'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import { RoomMember } from '@/types/room';

interface MembersPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  members: RoomMember[];
  createdBy: RoomMember | null;
}

export function MembersPanel({ isOpen, onOpenChange, members, createdBy }: MembersPanelProps) {
  // Filter out the owner from the general members list if present
  const regularMembers = createdBy ? members.filter(m => m.ID !== createdBy.ID) : members;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-black/95 backdrop-blur-2xl border-l border-white/10 p-0 text-white">
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-white text-lg font-bold">Room Members</SheetTitle>
        </SheetHeader>
        
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-80px)] custom-scrollbar">
          {createdBy && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-2">Admin</h4>
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                <Avatar className="h-10 w-10 ring-2 ring-yellow-500/50">
                  <AvatarFallback className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-300">
                    {createdBy.Username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm flex items-center gap-2">
                    {createdBy.Username}
                    <Crown size={14} className="text-yellow-500" />
                  </span>
                  <span className="text-xs text-white/40">Owner</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-2">
              Online — {regularMembers.length}
            </h4>
            <div className="space-y-1">
              {regularMembers.map((member) => (
                <div key={member.ID} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-1 ring-white/10 border border-transparent group-hover:border-white/20 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-white/10 to-white/5 text-white/80">
                        {member.Username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{member.Username}</span>
                  </div>
                </div>
              ))}
              {regularMembers.length === 0 && (
                <div className="text-sm text-white/40 px-2 italic">No other members</div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
