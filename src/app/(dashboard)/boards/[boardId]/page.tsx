'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { boardsApi } from '@/lib/api';
import { useBoardStore } from '@/store/useBoardStore';
import { Skeleton } from '@/components/ui/skeleton';
import { BoardCanvas } from '@/components/board/board-canvas';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MoreHorizontal, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const { data: session } = useSession();
  
  const { setBoard, setLists, setAllCards } = useBoardStore();
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  const { data: boardData, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const res = await boardsApi.getOne(boardId);
      return res.data;
    }
  });

  useEffect(() => {
    if (boardData?.board) {
      setBoard(boardData.board);
      setLists(boardData.lists || []);
      
      const allCards = (boardData.lists || []).flatMap((l: any) => l.cards || []);
      setAllCards(allCards);
    }
  }, [boardData, setBoard, setLists, setAllCards]);

  useEffect(() => {
    if (!session?.user) return;
    
    const token = (session as any).token;
    const socket = getSocket(token);
    
    // Join board room
    socket.emit('join-board', { boardId, user: session.user });
    
    // Listen for active users
    socket.on('active-users', ({ users }) => {
      setActiveUsers(users);
    });

    return () => {
      socket.emit('leave-board', { boardId });
      socket.off('active-users');
    };
  }, [boardId, session?.user]);

  const handleInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Board link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="p-6 h-full flex flex-col space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="flex gap-4 flex-1">
          {[1,2,3].map(i => <Skeleton key={i} className="w-[300px] h-[500px] rounded-xl shrink-0" />)}
        </div>
      </div>
    );
  }

  if (!boardData?.board) return <div className="p-6 text-muted-foreground">Board not found</div>;

  const board = boardData.board;

  return (
    <div 
      className="h-full flex flex-col relative overflow-hidden"
    >
      {/* Dynamic Background */}
      <div 
        className={cn(
          "absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000",
          board.background === 'gradient-1' ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" :
          board.background === 'gradient-2' ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
          board.background === 'gradient-3' ? "bg-gradient-to-br from-orange-400 to-rose-500" : 
          "bg-blue-500"
        )} 
      />

      {/* Board Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-background/40 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">{board.title}</h1>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-yellow-400">
            <Star className={cn("h-4 w-4", board.isStarred && "fill-yellow-400 text-yellow-400")} />
          </Button>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="flex items-center -space-x-2">
            {activeUsers.map(u => (
              <Avatar key={u.userId} className="h-8 w-8 border-2 border-background ring-2 ring-primary/20 transition-transform hover:-translate-y-1 hover:z-10 cursor-pointer">
                <AvatarImage src={u.avatar} />
                <AvatarFallback className="bg-primary/50 text-xs text-white">{u.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
            {activeUsers.length === 0 && (
              <span className="text-xs text-muted-foreground px-2 py-1 bg-white/5 rounded-md border border-white/10">Only you</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex h-9 border-white/10 bg-white/5 hover:bg-white/10"
            onClick={handleInvite}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Invite
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Board Canvas (Drag and Drop Area) */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <BoardCanvas boardId={boardId} />
      </div>
    </div>
  );
}
