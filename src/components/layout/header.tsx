'use client';

import { useState } from 'react';
import { Search, Bell, Command, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPalette } from './command-palette';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <header className="h-16 border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
        <div className="flex items-center flex-1">
          <Button 
            variant="outline" 
            className="hidden md:flex w-[300px] justify-start text-muted-foreground bg-black/20 border-white/5 shadow-inner hover:bg-white/5 hover:text-foreground transition-all"
            onClick={() => setCmdkOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left text-sm font-normal">Search boards, tasks, commands...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCmdkOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative group">
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden ring-2 ring-white/5 hover:ring-primary/50 transition-all" />}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={(session?.user as any)?.avatar || ''} alt={session?.user?.name || "User"} />
                <AvatarFallback className="bg-primary/20 text-primary font-medium text-xs">
                  {session?.user?.name?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass border-white/10" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-primary">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-primary">
                Appearance
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandPalette open={cmdkOpen} setOpen={setCmdkOpen} />
    </>
  );
}
