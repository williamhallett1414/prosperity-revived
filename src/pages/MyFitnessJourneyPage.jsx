import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function MyFitnessJourneyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: journey, isLoading } = useQuery({
    queryKey: ['activeJourney'],
    queryFn: async () => {
      const journeys = await base44.entities.WellnessJourney.filter({ 
        created_by: user?.email,
        is_active: true 
      }, '-created_date');
      return journeys[0] || null;
    },
    enabled: !!user
  });

  const completeWorkout = useMutation({
    mutationFn: async (workoutIndex) => {
      const completedWorkouts = journey.completed_workouts || [];
      if (!completedWorkouts.includes(workoutIndex)) {
        completedWorkouts.push(workoutIndex);
      }
      
      return base44.entities.WellnessJourney.update(journey.id, {
        completed_workouts: completedWorkouts
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['activeJourney']);
      toast.success('Workout completed!');
    }
  });

  const restartJourney = useMutation({
    mutationFn: async () => {
      return base44.entities.WellnessJourney.update(journey.id, {
        current_week: 1,
        current_day: 1,
        completed_workouts: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['activeJourney']);
      toast.success('Journey restarted!');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D9B878] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) {
    navigate(createPageUrl('FitnessJourneyBuilderPage'));
    return null;
  }

  const currentWeekPlan = journey.weekly_plans?.find(p => p.week === (journey.current_week || 1));
  const allWorkouts = journey.weekly_plans?.flatMap((week, weekIdx) => 
    week.workouts.map((workout, dayIdx) => ({
      ...workout,
      weekIndex: weekIdx,
      globalIndex: weekIdx * 7 + dayIdx
    }))
  ) || [];

  const completedCount = journey.completed_workouts?.length || 0;
  const totalWorkouts = allWorkouts.length;
  const progressPercent = totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;

  const todayWorkout = currentWeekPlan?.workouts?.find(w => w.day === (journey.current_day || 1));
  const upcomingWorkouts = allWorkouts.slice(completedCount, completedCount + 3);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(createPageUrl('Wellness'))}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </button>
          <h1 className="text-lg font-bold text-[#0A1A2F]">My Journey</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Journey Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-6 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">{journey.title}</h2>
          <p className="text-white/90 mb-4">{journey.description}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Week {journey.current_week} of {journey.duration_weeks}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{completedCount}/{totalWorkouts} completed</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#0A1A2F]">Overall Progress</h3>
            <span className="text-sm text-[#0A1A2F]/60">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D9B878] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </motion.div>

        {/* Encouraging Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"
        >
          <p className="text-emerald-900 text-sm">
            {progressPercent === 0 && "🎯 Let's get started! Your first workout is ready."}
            {progressPercent > 0 && progressPercent < 25 && "💪 Great start! Keep building that momentum."}
            {progressPercent >= 25 && progressPercent < 50 && "🔥 You're crushing it! Almost halfway there."}
            {progressPercent >= 50 && progressPercent < 75 && "⭐ Amazing progress! Keep pushing forward."}
            {progressPercent >= 75 && progressPercent < 100 && "🚀 Almost there! Finish strong!"}
            {progressPercent === 100 && "🎉 Congratulations! Journey complete! Ready to restart?"}
          </p>
        </motion.div>

        {/* Today's Workout */}
        {todayWorkout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Today's Workout</h3>
            
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-[#0A1A2F] mb-1">{todayWorkout.title}</h4>
              <div className="flex items-center gap-4 text-sm text-[#0A1A2F]/60">
                <span>{todayWorkout.type}</span>
                <span>•</span>
                <span>{todayWorkout.duration} min</span>
              </div>
            </div>

            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
              onClick={() => {
                const workoutIndex = allWorkouts.findIndex(w => 
                  w.day === todayWorkout.day && w.title === todayWorkout.title
                );
                completeWorkout.mutate(workoutIndex);
              }}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Complete Workout
            </Button>
          </motion.div>
        )}

        {/* Upcoming Workouts */}
        {upcomingWorkouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Coming Up</h3>
            
            <div className="space-y-3">
              {upcomingWorkouts.map((workout, idx) => {
                const isCompleted = journey.completed_workouts?.includes(workout.globalIndex);
                return (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#0A1A2F] text-sm">{workout.title}</h4>
                      <p className="text-xs text-[#0A1A2F]/60">{workout.type} • {workout.duration} min</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Restart Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full h-12">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Journey
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restart Your Journey?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your progress and start the journey from Week 1, Day 1. 
                  All completed workouts will be cleared.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => restartJourney.mutate()}
                  className="bg-[#D9B878] hover:bg-[#D9B878]/90"
                >
                  Restart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>
    </div>
  );
}