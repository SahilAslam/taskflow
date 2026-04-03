'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Settings, Bell, Search, Menu, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      const res = await boardsApi.create({ title: newBoardTitle });
      await queryClient.invalidateQueries({ queryKey: ['boards'] });
      setNewBoardTitle('');
      setIsCreatingBoard(false);
      router.push(`/boards/${res.data.board._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const { data: boardsData } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await boardsApi.getAll();
      return res.data;
    }
  });

  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "bg-card/40 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 relative z-20",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <div className="h-16 border-b border-white/5 flex items-center px-4 justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight truncate">
            <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            TaskFlow<span className="text-primary">Pro</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "hidden")}
        >
          <Menu size={18} />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto scrollbar-none">
        <div className="space-y-1 mb-8">
          <p className={cn("text-xs font-semibold text-muted-foreground mb-3 px-2", collapsed && "hidden")}>
            MAIN MENU
          </p>
          {routes.map((route) => {
            const active = pathname === route.path;
            const Icon = route.icon;
            return (
              <Link key={route.path} href={route.path}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group cursor-pointer",
                  active ? "bg-primary/10 text-primary shadow-sm" : "hover:bg-white/5 text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}>
                  <Icon size={20} className={cn(active && "text-primary")} />
                  {!collapsed && <span className="font-medium text-sm">{route.name}</span>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <div className={cn("flex items-center justify-between mb-3 px-2", collapsed && "hidden")}>
            <p className="text-xs font-semibold text-muted-foreground">MY BOARDS</p>
            <Dialog open={isCreatingBoard} onOpenChange={setIsCreatingBoard}>
              <DialogTrigger render={<Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" />}>
                <span className="text-lg leading-none mb-0.5">+</span>
              </DialogTrigger>
              <DialogContent className="glass border-white/10 sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="board-title">Board Title</Label>
                    <Input 
                      id="board-title" 
                      placeholder="e.g. Project Apollo" 
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                      className="bg-black/50 border-white/10"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsCreatingBoard(false)}>Cancel</Button>
                  <Button onClick={handleCreateBoard} disabled={!newBoardTitle.trim()}>Create Board</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {boardsData?.boards?.map((board: any) => {
            const active = pathname === `/boards/${board._id}`;
            return (
              <Link key={board._id} href={`/boards/${board._id}`}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                  active ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}>
                  <div className="h-6 w-6 rounded flex items-center justify-center bg-gradient-to-br shrink-0" 
                       style={{ backgroundImage: `var(--${board.background})` || 'var(--tw-gradient-stops)' }}>
                    <LayoutTemplate size={12} className="text-white/80" />
                  </div>
                  {!collapsed && <span className="font-medium text-sm truncate">{board.title}</span>}
                </div>
              </Link>
            );
          })}
          {!collapsed && (!boardsData?.boards || boardsData.boards.length === 0) && (
             <div className="px-3 py-4 text-xs text-center border border-dashed border-white/10 rounded-lg text-muted-foreground">
                No boards yet. Create one!
             </div>
          )}
        </div>
      </div>
    </aside>
  );
}
