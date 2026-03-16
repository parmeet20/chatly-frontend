'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth-store';
import { motion } from 'framer-motion';

export function Navbar() {
  const { isAuthenticated, user } = useAuth(false);
  const logout = useAuthStore((state) => state.logout);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl border border-white/10 px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-md bg-black/40"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
          C
        </div>
        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Chatly
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link href="/rooms">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                Rooms
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none ring-0">
                <Avatar className="h-9 w-9 ring-2 ring-white/10 hover:ring-indigo-500/50 transition-all cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-200">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border-white/10 text-white shadow-2xl rounded-xl">
                <div className="px-2 py-2 mb-1 border-b border-white/10">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-lg mx-1 mt-1">
                  <Link href="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => logout()} 
                  className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 rounded-lg mx-1 mb-1"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-xl">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
