'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/services/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous toasts
    toast.dismiss();

    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (!password) {
      toast.error('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post<{ token: string }>('/users/login', { 
        username: username.trim(), 
        password 
      });
      login(res.data.token);
      toast.success('Welcome back!');
      router.push('/rooms');
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#0A0A0A] overflow-hidden p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group z-20">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
          C
        </div>
        <span className="font-bold tracking-tight text-white/80 group-hover:text-white transition-colors">Back to home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md glass-card p-8 rounded-3xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/50">Enter your details to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block px-1">Username</label>
            <Input 
              type="text" 
              placeholder="e.g. johndoe" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-indigo-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block px-1">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-black/40 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-indigo-500 rounded-xl"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 mt-6 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-xl font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-white/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:text-indigo-400 font-medium transition-colors">
            Sign up now
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
