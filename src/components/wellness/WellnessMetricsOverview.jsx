import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Droplet, BookOpen, Heart, PenLine, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function WellnessMetricsOverview({
  meditationSessions,
  workoutSessions,
  mealLogs,
  waterLogs,
  journalEntries,
  prayerJournals,
  userProgress,
  challengeParticipants,
  planProgress = []
}) {
  // Calculate metrics
  const totalMeditationMinutes = meditationSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;
  const totalWorkouts = workoutSessions?.length || 0;
  const totalWorkoutMinutes = workoutSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;
  const todayWaterIntake = waterLogs?.filter(w => w.date === new Date().toISOString().split('T')[0])?.reduce((sum, w) => sum + (w.glasses || 0), 0) || 0;
  const totalJournalEntries = journalEntries?.length || 0;
  const daysRead = planProgress?.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0) || 0;
  const activeChallenges = challengeParticipants?.filter(c => c.status === 'active')?.length || 0;

  const metrics = [
    { 
      icon: Zap, 
      label: 'Meditation', 
      value: `${totalMeditationMinutes}m`, 
      subtext: `${meditationSessions?.length || 0} sessions`,
      color: 'from-[#D9B878] to-[#D9B878]/50',
      link: createPageUrl('DiscoverMeditations')
    },
    { 
      icon: Flame, 
      label: 'Workouts', 
      value: totalWorkouts, 
      subtext: `${totalWorkoutMinutes}m completed`,
      color: 'from-[#FD9C2D] to-[#FD9C2D]/50',
      link: createPageUrl('WorkoutProgress')
    },
    { 
      icon: Droplet, 
      label: 'Hydration', 
      value: `${todayWaterIntake}/8`, 
      subtext: 'glasses today',
      color: 'from-[#AFC7E3] to-[#AFC7E3]/50',
      link: `${createPageUrl('Wellness')}?tab=nutrition`
    },
    { 
       icon: PenLine, 
       label: 'Journaling', 
       value: totalJournalEntries, 
       subtext: 'total entries',
       color: 'from-[#D9B878] to-[#D9B878]/50',
       link: createPageUrl('MyJournalEntries')
      },
    { 
      icon: BookOpen, 
      label: 'Days Read', 
      value: daysRead, 
      subtext: 'days completed',
      color: 'from-[#FD9C2D] to-[#FD9C2D]/50',
      link: createPageUrl('Bible')
    },
    { 
      icon: TrendingUp, 
      label: 'Challenges', 
      value: activeChallenges, 
      subtext: 'active',
      color: 'from-[#0A1A2F] to-[#0A1A2F]/50',
      link: `${createPageUrl('Wellness')}?tab=selfcare`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-[#0A1A2F]">Your Progress & Metrics</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Link key={metric.label} to={metric.link}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${metric.color} rounded-xl p-4 text-white cursor-pointer hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" />
                      <p className="text-xs font-semibold opacity-90">{metric.label}</p>
                    </div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs opacity-75 mt-1">{metric.subtext}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}