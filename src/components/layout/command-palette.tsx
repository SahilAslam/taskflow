'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Layout, Settings, LogOut, Sun, Moon, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function CommandPalette({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-2xl overflow-hidden [&>button]:hidden">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <Card className="glass border-white/10 w-full overflow-hidden rounded-xl shadow-2xl flex flex-col">
          <Command className="w-full flex-1 outline-none bg-transparent" label="Command Menu">
            <div className="flex items-center px-4 border-b border-white/5 bg-background/50 backdrop-blur-md">
              <Search className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
              <Command.Input 
                autoFocus
                placeholder="Type a command or search..." 
                className="flex h-14 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground border-none ring-0 placeholder:font-normal font-medium focus:ring-0 focus-visible:ring-0" 
              />
              <div className="text-xs text-muted-foreground ml-2 hidden sm:flex shrink-0">
                <kbd className="bg-white/10 px-2 py-1 rounded-md shadow-sm border border-white/5 mr-1">esc</kbd> to close
              </div>
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading="Navigation" className="px-2 py-2 text-xs font-semibold text-muted-foreground">
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/dashboard'))}
                  className="flex cursor-pointer items-center px-3 py-2 text-sm rounded-md hover:bg-white/10 aria-selected:bg-primary/20 aria-selected:text-primary transition-colors text-foreground"
                >
                  <Layout className="mr-3 h-4 w-4" />
                  <span>Dashboard</span>
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/settings'))}
                  className="flex cursor-pointer items-center px-3 py-2 text-sm rounded-md hover:bg-white/10 aria-selected:bg-primary/20 aria-selected:text-primary transition-colors text-foreground mt-1"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </Command.Item>
              </Command.Group>

              <Command.Separator className="h-px bg-white/5 my-1 mx-2" />
              
              <Command.Group heading="Quick Actions" className="px-2 py-2 text-xs font-semibold text-muted-foreground">
                <Command.Item 
                  onSelect={() => runCommand(() => {})}
                  className="flex cursor-pointer items-center px-3 py-2 text-sm rounded-md hover:bg-white/10 aria-selected:bg-primary/20 aria-selected:text-primary transition-colors text-foreground mt-1 text-primary shadow-sm"
                >
                  <Plus className="mr-3 h-4 w-4" />
                  <span>Create new board</span>
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => signOut({ callbackUrl: '/login' }))}
                  className="flex cursor-pointer items-center px-3 py-2 text-sm rounded-md hover:bg-white/10 aria-selected:bg-destructive/20 aria-selected:text-destructive transition-colors text-foreground mt-1"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Logout</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
