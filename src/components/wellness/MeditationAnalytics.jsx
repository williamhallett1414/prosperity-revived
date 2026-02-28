import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BarChart, Calendar, Clock, TrendingUp, Award, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function MeditationAnalytics({ user }) {
  const { data: sessions = [] } = useQuery({
    queryKey: ['meditation-sessions', user?.email],
    queryFn: () => base44.entities.MeditationSession.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  // Calculate statistics
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Calculate streak
  const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split('T')[0];
    
    if (sortedDates[i] === expected) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Last 7 days activity
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = sessions.filter(s => s.date === dateStr);
    const totalMins = daySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    last7Days.push({
      date: dateStr,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: totalMins,
      count: daySessions.length
    });
  }

  const maxMinutes = Math.max(...last7Days.map(d => d.minutes), 1);

  // Meditation types breakdown
  const typeBreakdown = sessions.reduce((acc, s) => {
    const type = s.meditation_type || 'mindfulness';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topTypes = Object.entries(typeBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Consistency score (sessions in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSessions = sessions.filter(s => new Date(s.date) >= thirtyDaysAgo).length;
  const consistencyScore = Math.min(Math.round((recentSessions / 30) * 100), 100);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#c9a227] to-[#D9B878] rounded-2xl p-4 text-white"
        >
          <Clock className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{totalMinutes}</div>
          <div className="text-sm opacity-90">Total Minutes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white"
        >
          <Target className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{totalSessions}</div>
          <div className="text-sm opacity-90">Sessions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white"
        >
          <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{currentStreak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white"
        >
          <Award className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{avgDuration}m</div>
          <div className="text-sm opacity-90">Avg Duration</div>
        </motion.div>
      </div>

      {/* Last 7 Days Activity */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Last 7 Days</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {last7Days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-xs text-gray-500">{day.count}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                transition={{ delay: i * 0.1 }}
                className="w-full bg-gradient-to-t from-[#c9a227] to-[#D9B878] rounded-t-lg min-h-[4px]"
                title={`${day.minutes} minutes`}
              />
              <div className="text-xs text-gray-500 mt-1">{day.day}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Consistency Score */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Consistency Score</h3>
          </div>
          <span className="text-2xl font-bold text-green-500">{consistencyScore}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${consistencyScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-green-400 to-green-600"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {consistencyScore >= 80 ? '🎉 Amazing consistency!' : 
           consistencyScore >= 50 ? '💪 Good progress!' : 
           '🌱 Keep building your practice'}
        </p>
      </Card>

      {/* Favorite Types */}
      {topTypes.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Favorite Meditation Types</h3>
          <div className="space-y-2">
            {topTypes.map(([type, count], i) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {type.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalSessions) * 100}%` }}
                      transition={{ delay: i * 0.1 }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Feedback Message */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Insight</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {totalSessions === 0 ? 
            "Start your meditation journey today! Even 5 minutes can make a difference." :
           currentStreak >= 7 ?
            `Incredible! You've meditated ${currentStreak} days in a row. Your dedication is inspiring!` :
           avgDuration >= 15 ?
            "Your longer meditation sessions show great depth. Consider exploring different techniques!" :
           totalSessions >= 10 ?
            `You've completed ${totalSessions} sessions! Try extending your practice time for deeper benefits.` :
            "You're building a wonderful habit. Consistency matters more than duration!"}
        </p>
      </Card>
    </div>
  );
}