'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useChatStore } from '@/stores/chat-store';
import { RoomDetails } from '@/types/room';
import api from '@/services/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { MembersPanel } from '@/components/layout/MembersPanel';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageList } from '@/components/chat/MessageList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Users, LogIn, LogOut, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { user, isAuthenticated, isLoading } = useAuth();

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [joinedRooms, setJoinedRooms] = useState<RoomDetails[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  useWebSocket(isJoined ? roomId : null);

  useEffect(() => {
    if (isAuthenticated && roomId) {
      fetchRoomDetails();
    }
    if (isAuthenticated && (user?.id || (user as any)?._id)) {
      fetchJoinedRooms();
    }
    return () => { setMessages([]); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, roomId, setMessages]);

  const fetchPastMessages = async () => {
    try {
      // API expects /messages/:roomId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await api.get<any[]>(`/messages/${roomId}`);
      if (res.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pastMessages = res.data.map((rawMessage: any) => {
          let parsedContent = rawMessage.content;
          try {
            if (typeof parsedContent === 'string' && parsedContent.startsWith('{')) {
              const innerObj = JSON.parse(parsedContent);
              if (innerObj.content) {
                parsedContent = innerObj.content;
              }
            }
          } catch {
            // ignore
          }

          const generatedId = `${rawMessage.created_at || new Date().toISOString()}_${rawMessage.sender_id}_${rawMessage.room_id}`;

          return {
            id: generatedId,
            room_id: rawMessage.room_id,
            sender_id: rawMessage.sender_id,
            content: parsedContent,
            created_at: rawMessage.created_at,
          };
        });
        setMessages(pastMessages);
      }
    } catch (error) {
      console.error('Failed to fetch past messages', error);
    }
  };

  const fetchJoinedRooms = async () => {
    try {
      const userId = user?.id || (user as any)?._id;
      if (!userId) return;
      const res = await api.get<RoomDetails[]>(`/rooms/user/${userId}`);
      setJoinedRooms(res.data || []);
    } catch (error) {
      console.error('Failed to fetch joined rooms', error);
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const res = await api.get<RoomDetails>(`/rooms/${roomId}`);
      setRoom(res.data);

      if (user && res.data) {
        // Safe check for missing Members array from backend
        const members = res.data.Members || [];
        const createdBy = res.data.CreatedBy;

        const joined = members.some(m => m.Username === user.username) ||
          (createdBy && createdBy.Username === user.username);
        setIsJoined(joined);

        if (joined) {
          fetchPastMessages();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load room details');
    }
  };

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await api.put(`/rooms/${roomId}/join`);
      toast.success('Joined room successfully!');
      setIsJoined(true);
      fetchRoomDetails();
      fetchJoinedRooms();
    } catch {
      toast.error('Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await api.put(`/rooms/${roomId}/leave`);
      toast.success('Left room successfully');
      setIsJoined(false);
      setIsLeaveDialogOpen(false);
      fetchRoomDetails();
      fetchJoinedRooms();
    } catch {
      toast.error('Failed to leave room');
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading || !isAuthenticated || !room) {
    return <div className="h-screen w-full bg-[#0A0A0A] flex items-center justify-center text-white/50">Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] text-white relative">
      <Sidebar joinedRooms={joinedRooms} />

      <main className="flex-1 flex flex-col h-full relative z-10 border-l border-white/5 md:ml-[260px]">
        {/* Chat Header */}
        <header className="h-[72px] px-6 border-b border-white/10 glass-nav flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <span className="text-white/40">#</span>
              {room.Name}
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {room.Online || (room.Members?.length || 0)} members
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isJoined && user?.id !== room.CreatedBy.ID && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLeaveDialogOpen(true)}
                className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
              >
                Leave Room
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMembersPanelOpen(true)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Users size={18} className="mr-2" />
              <span className="hidden sm:inline">Members</span>
            </Button>
          </div>
        </header>

        {/* Chat Content Area */}
        <div className="flex-1 min-h-0 relative flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0A0A0A] to-[#0A0A0A]">
          {!isJoined ? (
            <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4">
              <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center shadow-2xl">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
                  #
                </div>
                <h3 className="text-2xl font-bold mb-2">Join {room.Name}</h3>
                <p className="text-white/50 mb-8 px-4">You need to be a member to view messages and participate in this room.</p>
                <Button
                  size="lg"
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="w-full bg-white text-black hover:bg-white/90 font-medium text-base rounded-xl"
                >
                  {isJoining ? 'Joining...' : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      Join Room
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Chat Input */}
        {isJoined && <ChatInput />}
      </main>

      <MembersPanel
        isOpen={isMembersPanelOpen}
        onOpenChange={setIsMembersPanelOpen}
        members={room.Members || []}
        createdBy={room.CreatedBy}
      />

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-md bg-black/95 backdrop-blur-2xl border-white/10 text-white shadow-2xl rounded-2xl p-0 overflow-hidden">
          <div className="p-8 pb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
              <AlertTriangle size={24} />
            </div>
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-2xl font-bold">Leave Room?</DialogTitle>
              <DialogDescription className="text-white/50 text-base leading-relaxed">
                Are you sure you want to leave <span className="text-white font-medium">#{room.Name}</span>?
                You will need to join again to see future messages.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-3 bg-white/[0.02]">
            <Button
              variant="ghost"
              onClick={() => setIsLeaveDialogOpen(false)}
              className="flex-1 h-12 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors border-white/5"
            >
              Wait, take me back
            </Button>
            <Button
              onClick={handleLeave}
              disabled={isLeaving}
              className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg shadow-red-500/20 border-0 transition-all flex items-center justify-center gap-2"
            >
              {isLeaving ? 'Leaving...' : (
                <>
                  <LogOut size={16} />
                  Leave Room
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
