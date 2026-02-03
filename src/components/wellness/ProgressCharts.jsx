import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Brain } from 'lucide-react';

export default function ProgressCharts() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['water'],
    queryFn: () => base44.entities.WaterLog.list('-date'),
    enabled: !!user
  });

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: () => base44.entities.Meditation.list(),
    enabled: !!user
  });

  // Water intake chart data (last 7 days)
  const waterChartData = waterLogs.slice(0, 7).reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    glasses: log.glasses || 0,
    goal: log.goal || 8
  }));

  // Meditation completion data (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const meditationChartData = last30Days.map(date => {
    const completedCount = meditations.filter(m => 
      m.completed_dates?.some(d => d.startsWith(date))
    ).length;
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: completedCount
    };
  });

  return (
    <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
      <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-4">Progress Tracking</h3>

      <Tabs defaultValue="water">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Water
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Meditation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="water">
          <div className="h-64">
            {waterChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="glasses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="goal" fill="#93c5fd" radius={[8, 8, 0, 0]} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No water intake data yet
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="meditation">
          <div className="h-64">
            {meditationChartData.some(d => d.sessions > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={meditationChartData}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="#6b7280"
                    interval={6}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#9333ea" 
                    fillOpacity={1} 
                    fill="url(#colorSessions)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No meditation sessions yet
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}