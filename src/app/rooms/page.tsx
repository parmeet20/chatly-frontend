'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Room } from '@/types/room';
import api from '@/services/api';
import { RoomCard } from '@/components/room/RoomCard';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function RoomsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get<Room[]>('/rooms');
      console.log(user)
      console.log(res.data)
      setRooms(res.data || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error('Failed to fetch rooms. Make sure the backend is running.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [isAuthenticated]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();

    const name = newRoomName.trim();
    if (!name) {
      toast.error('Room name is required');
      return;
    }
    if (name.length < 3) {
      toast.error('Room name must be at least 3 characters');
      return;
    }

    setIsCreating(true);
    try {
      await api.post('/rooms', { name });
      toast.success('Room created successfully');
      setNewRoomName('');
      setIsDialogOpen(false);
      fetchRooms(); // refresh list
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to create room';
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/50">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <Navbar />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Discover Rooms
            </h1>
            <p className="text-white/50">Join active discussions or create your own space.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-xl h-11 px-6 inline-flex items-center justify-center font-medium">
                <Plus size={18} className="mr-2" />
                Create Room
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-black/95 backdrop-blur-2xl border-white/10 text-white shadow-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create a new room</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateRoom} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Room Name</label>
                    <div className="relative">
                      <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <Input
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="e.g. Next.js Developers"
                        className="bg-white/5 border-white/10 pl-9 h-11 focus-visible:ring-indigo-500 text-white placeholder:text-white/30"
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isCreating || !newRoomName.trim()}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 h-11 text-white border-0 shadow-lg shadow-indigo-500/20"
                  >
                    {isCreating ? 'Creating...' : 'Create Room'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <div className="space-y-16">
          {/* My Rooms Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent" />
              <h2 className="text-xl font-semibold text-white/90">My Rooms</h2>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-indigo-500/50 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {rooms.filter(r => r.created_by === user?.id).length === 0 ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/30 border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                  <p>You haven't created any rooms yet.</p>
                </div>
              ) : (
                rooms
                  .filter(r => r.created_by === user?.id)
                  .map((room) => <RoomCard key={room.id} room={room} />)
              )}
            </motion.div>
          </section>

          {/* Global Rooms Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              <h2 className="text-xl font-semibold text-white/90">Global Rooms</h2>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-white/10 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {rooms.filter(r => r.created_by !== user?.username).length === 0 ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/30 border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                  <p>No global rooms available.</p>
                </div>
              ) : (
                rooms
                  .filter(r => r.created_by !== user?.username)
                  .map((room) => <RoomCard key={room.id} room={room} />)
              )}
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
