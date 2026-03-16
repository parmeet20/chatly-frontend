'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Plus, Hash, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface SidebarProps {
  joinedRooms?: (import('@/types/room').Room | import('@/types/room').RoomDetails)[];
}

function SidebarContent({ joinedRooms = [], pathname, logout }: { joinedRooms: any[], pathname: string, logout: () => void }) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
          C
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Chatly</span>
      </div>

      <div className="px-4 mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Your Rooms</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
          <Plus size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
        {joinedRooms.length === 0 && (
          <div className="px-4 py-8 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <Hash size={20} />
            </div>
            <p className="text-sm text-white/40 px-4">You haven't joined any rooms yet.</p>
          </div>
        )}

        {joinedRooms.map((room) => {
          const id = 'id' in room ? room.id : room.ID;
          const name = 'name' in room ? room.name : room.Name;
          const isActive = pathname === `/rooms/${id}`;

          return (
            <Link key={id} href={`/rooms/${id}`}>
              <div className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                : 'text-white/50 hover:bg-white/[0.03] hover:text-white/90 border border-transparent'
                }`}>
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/20 group-hover:text-white/40'
                  }`}>
                  <Hash size={16} />
                </div>
                <span className="font-medium text-[14px] truncate">{name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                )}
              </div>
            </Link>
          );
        })}

        <Link href="/rooms">
          <div className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-indigo-400 hover:text-indigo-300 hover:bg-white/[0.03] transition-all">
            <div className="p-1.5 rounded-lg bg-indigo-500/10">
              <Plus size={16} />
            </div>
            <span className="font-medium text-[14px] truncate">Browse Rooms</span>
          </div>
        </Link>
      </div>

      <div className="p-4 mt-auto border-t border-white/5">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
          onClick={() => logout()}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ joinedRooms = [] }: SidebarProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      {/* Mobile Drawer */}
      <div className="md:hidden fixed top-0 left-0 p-4 z-50">
        <Sheet>
          <SheetTrigger className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-md bg-black/20 border border-white/10 p-2 inline-flex items-center justify-center transition-colors focus:outline-none">
            <Menu size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 border-r border-white/10 bg-black/95 backdrop-blur-2xl">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarContent joinedRooms={joinedRooms} pathname={pathname} logout={logout} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[260px] h-screen fixed top-0 left-0 flex-col bg-black/40 backdrop-blur-2xl border-r border-white/5">
        <SidebarContent joinedRooms={joinedRooms} pathname={pathname} logout={logout} />
      </div>
    </>
  );
}
