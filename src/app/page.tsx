'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Zap, Shield, Sparkles } from 'lucide-react';

const MOCK_MESSAGES = [
  { id: 1, text: "Hey! Did you see the new Chatly redesign?", isSelf: false },
  { id: 2, text: "Yeah, the glassmorphism looks insane ✨", isSelf: true },
  { id: 3, text: "It's so fast too. Real-time WebSockets!", isSelf: false },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Column: Hero Text */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-8"
          >
            <Sparkles size={16} />
            <span>The next generation of chat</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
          >
            Connect with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              zero latency.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl"
          >
            Experience a Discord-level chat interface built with Next.js. 
            Enjoy seamless real-time communication, stunning glassmorphism layouts, and extreme polish.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-xl group/btn">
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="h-12 px-8 text-base text-white/80 hover:text-white hover:bg-white/10 rounded-xl">
                Login to Account
              </Button>
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10 w-full max-w-2xl"
          >
            <div className="flex flex-col gap-2">
              <Zap size={24} className="text-yellow-400" />
              <h3 className="font-semibold text-white">Real-time</h3>
              <p className="text-sm text-white/50">Instant message delivery via secure WebSockets.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Shield size={24} className="text-green-400" />
              <h3 className="font-semibold text-white">Secure</h3>
              <p className="text-sm text-white/50">End-to-end token based authentication.</p>
            </div>
            <div className="flex flex-col gap-2">
              <MessageSquare size={24} className="text-blue-400" />
              <h3 className="font-semibold text-white">Premium UI</h3>
              <p className="text-sm text-white/50">Modern glass components and fluid animations.</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Phone Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex-1 relative w-full max-w-[400px] aspect-[1/2] perspective-[1000px]"
        >
          {/* iPhone Mockup Frame */}
          <div className="absolute inset-0 bg-black rounded-[50px] border-[8px] border-[#2A2A2A] shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-20"></div>
            
            {/* App UI inside phone */}
            <div className="absolute inset-0 bg-[#0E0E0E] flex flex-col pt-12 pb-6">
              {/* Fake Header */}
              <div className="px-6 pb-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Design Engineers</h3>
                    <p className="text-[10px] text-green-400">3 online</p>
                  </div>
                </div>
              </div>
              
              {/* Fake Chat Area */}
              <div className="flex-1 px-4 py-6 flex flex-col justify-end gap-4">
                {MOCK_MESSAGES.map((msg, index) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8 + (index * 0.4), type: "spring" }}
                    className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.isSelf 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm' 
                        : 'bg-white/10 border border-white/5 text-white/90 rounded-bl-sm backdrop-blur-md'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fake Input */}
              <div className="px-4 mt-2">
                <div className="w-full h-10 rounded-full bg-white/5 border border-white/10 flex items-center px-4">
                  <span className="text-white/30 text-xs">Message #general...</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle Glow Behind Phone */}
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl -z-10 rounded-full"></div>
        </motion.div>

      </div>
    </main>
  );
}
