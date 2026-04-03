'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, Clock, LayoutTemplate, MoreHorizontal, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

// Mock data until there's an aggregation endpoint for all user tasks
const UPCOMING_TASKS = [
  { id: '1', title: 'Design landing page', board: 'Marketing Website', due: new Date(Date.now() + 86400000 * 2), status: 'in-progress', priority: 'high' },
  { id: '2', title: 'Implement NextAuth', board: 'TaskFlow Pro', due: new Date(Date.now() + 86400000 * 1), status: 'todo', priority: 'critical' },
  { id: '3', title: 'Review PR #42', board: 'TaskFlow Pro', due: new Date(Date.now() + 86400000 * 3), status: 'todo', priority: 'medium' },
  { id: '4', title: 'Write blog post', board: 'Marketing Website', due: new Date(Date.now() - 86400000 * 1), status: 'done', priority: 'low' },
];

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 p-8 overflow-auto h-full scrollbar-none flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-2">
            All your assigned tasks across all boards.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-black/20 border-white/10"
            />
          </div>
          <Button variant="outline" className="border-white/10 bg-black/20 hover:bg-white/5">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Soon / Upcoming */}
        <Card className="glass border-white/5 bg-black/20 col-span-1 md:col-span-2">
          <CardHeader className="pb-3 border-b border-white/5 bg-black/10">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Upcoming Deadlines
              </span>
              <Badge variant="outline" className="ml-2 font-normal opacity-70 bg-black/40">4 tasks</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {UPCOMING_TASKS.filter(t => t.status !== 'done').map(task => (
                <div key={task.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 group cursor-pointer">
                  <div className="h-5 w-5 rounded border border-white/20 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors bg-black/30">
                    <CheckSquare className="w-3 h-3 text-transparent group-hover:text-primary/30 transition-colors" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <LayoutTemplate className="w-3 h-3" />
                        {task.board}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400/80">
                        <Clock className="w-3 h-3" />
                        {format(task.due, 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      task.priority === 'critical' ? 'destructive' :
                      task.priority === 'high' ? 'default' :
                      task.priority === 'medium' ? 'secondary' : 'outline'
                    } className={task.priority === 'critical' ? 'bg-destructive/20 text-destructive border-transparent' : ''}>
                      {task.priority}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">You have reached the end of your list.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Completed */}
        <Card className="glass border-white/5 bg-black/20 h-fit">
          <CardHeader className="pb-3 border-b border-white/5 bg-black/10">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-green-400" />
                Recently Completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {UPCOMING_TASKS.filter(t => t.status === 'done').map(task => (
                <div key={task.id} className="p-4 flex items-start gap-3 opacity-60">
                  <div className="h-5 w-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckSquare className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-through truncate">{task.title}</p>
                    <p className="text-xs mt-1 truncate">{task.board}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-white/5 text-center">
              <Button variant="link" className="text-xs text-muted-foreground w-full py-0 h-auto">
                View all completed tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
