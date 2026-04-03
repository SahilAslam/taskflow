'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PRIORITY_COLORS = {
  none: '#64748b',
  low: '#3b82f6',
  medium: '#eab308',
  high: '#f97316',
  urgent: '#ef4444'
};

const CHART_COLORS = ['#8b5cf6', '#d946ef', '#6366f1', '#14b8a6', '#f59e0b'];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data?.stats;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = data || {
    totalBoards: 0,
    totalCards: 0,
    completedCards: 0,
    pendingCards: 0,
    overdueCards: 0,
    cardsByPriority: [],
    dailyActivity: []
  };

  const statCards = [
    { title: 'Total Boards', value: stats.totalBoards, icon: LayoutDashboard, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { title: 'Tasks Completed', value: stats.completedCards, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Pending Tasks', value: stats.pendingCards, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { title: 'Overdue Tasks', value: stats.overdueCards, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' }
  ];

  const priorityData = stats.cardsByPriority.map((item: any) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: PRIORITY_COLORS[item._id as keyof typeof PRIORITY_COLORS] || '#8884d8'
  }));

  const activityData = stats.dailyActivity.map((item: any) => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  return (
    <div className="p-6 md:p-8 space-y-8 pb-20">
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Overview</h1>
        <p className="text-muted-foreground">Monitor your productivity and task distributions.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="glass border-white/5 overflow-hidden group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="glass border-white/5 h-full">
            <CardHeader>
              <CardTitle>Activity (Last 30 Days)</CardTitle>
              <CardDescription>Number of actions performed daily</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20,20,30,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-white/10 rounded-lg">
                  No activity data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="glass border-white/5 h-full">
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
              <CardDescription>Distribution of active tasks</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {priorityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {priorityData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20,20,30,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-white/10 rounded-lg">
                  No priority data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
