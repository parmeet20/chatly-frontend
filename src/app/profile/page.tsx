'use client';

import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/50">Loading...</div>;
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#0A0A0A] overflow-hidden p-4">
      <Navbar />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md glass-card p-10 rounded-3xl relative z-10 border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-28 w-28 ring-4 ring-white/5 mb-6 shadow-xl relative overflow-visible">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl shadow-inner">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
            <div className="absolute -bottom-2 -right-2 bg-[#0A0A0A] rounded-full p-1.5 border border-white/10">
              <Shield size={16} className="text-indigo-400" />
            </div>
          </Avatar>
          
          <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
          <p className="text-white/50 bg-white/5 px-4 py-1.5 rounded-full inline-flex font-mono text-xs border border-white/10 mb-8">
            {user.email}
          </p>

          <div className="w-full space-y-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center transition-colors hover:bg-white/10">
              <span className="text-white/60 text-sm">Account Status</span>
              <span className="text-green-400 font-medium text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                Active
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center transition-colors hover:bg-white/10">
              <span className="text-white/60 text-sm">Role</span>
              <span className="text-white font-medium text-sm">
                Member
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
