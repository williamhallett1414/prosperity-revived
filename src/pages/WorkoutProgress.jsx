import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Award, Calendar, Dumbbell, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ChatButton from '@/components/chatbot/ChatButton';

const WorkoutFrequencyChart = lazy(() => import('@/components/wellness/WorkoutFrequencyChart'));
const PersonalBestsChart = lazy(() => import('@/components/wellness/PersonalBestsChart'));
const VolumeProgressChart = lazy(() => import('@/components/wellness/VolumeProgressChart'));
const WorkoutStreakCard = lazy(() => import('@/components/wellness/WorkoutStreakCard'));
const WeightProgressChart = lazy(() => import('@/components/wellness/WeightProgressChart'));
const GoalCompletionChart = lazy(() => import('@/components/wellness/GoalCompletionChart'));
const ProgressPhotoGallery = lazy(() => import('@/components/wellness/ProgressPhotoGallery'));

function ChartFallback() {
  return <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin" /></div>;
}

export default function WorkoutProgress() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['workout-sessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 100),
    enabled: !!user,
    retry: false,
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    enabled: !!user,
    retry: false,
  });

  const { data: progressPhotos = [] } = useQuery({
    queryKey: ['progressPhotos'],
    queryFn: async () => { try { return await base44.entities.ProgressPhoto.list('-date', 100); } catch { return []; } },
    enabled: !!user,
    retry: false,
  });

  // Calculate stats
  const totalWorkouts = sessions.length;
  const thisMonth = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const now = new Date();
    return sessionDate.getMonth() === now.getMonth() && 
           sessionDate.getFullYear() === now.getFullYear();
  }).length;

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;


  return (
    <div className="min-h-screen bg-white dark:bg-white/5 pb-24">

      <div className="max-w-4xl mx-auto px-4 space-y-6 pt-4">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pt-6">
          <Card className="bg-gradient-to-br from-[#D97706] to-[#EA580C] border-none shadow-md dark:shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Total Workouts</p>
                  <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-white/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1e40af] to-[#38BDF8] border-none shadow-md dark:shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">This Month</p>
                  <p className="text-2xl font-bold text-white">{thisMonth}</p>
                </div>
                <Calendar className="w-8 h-8 text-white/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#38BDF8] to-[#1e40af] border-none shadow-md dark:shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Total Minutes</p>
                  <p className="text-2xl font-bold text-white">{totalMinutes}</p>
                </div>
                <Activity className="w-8 h-8 text-white/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-none shadow-md dark:shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Avg Duration</p>
                  <p className="text-2xl font-bold text-white">{avgDuration}m</p>
                </div>
                <Award className="w-8 h-8 text-[#38BDF8]/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Card */}
        <Suspense fallback={<ChartFallback />}><WorkoutStreakCard sessions={sessions} /></Suspense>

        {/* Charts */}
        <Tabs defaultValue="frequency" className="w-full px-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 bg-gradient-to-r from-[#38BDF8]/10 to-[#D97706]/10 border border-[#38BDF8]/20 rounded-lg p-1">
            <TabsTrigger value="frequency" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md dark:shadow-none text-[#0A1A2F]/60 dark:text-white/60">Frequency</TabsTrigger>
            <TabsTrigger value="prs" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md dark:shadow-none text-[#0A1A2F]/60 dark:text-white/60">PRs</TabsTrigger>
            <TabsTrigger value="volume" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md dark:shadow-none text-[#0A1A2F]/60 dark:text-white/60">Volume</TabsTrigger>
            <TabsTrigger value="weight" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md dark:shadow-none text-[#0A1A2F]/60 dark:text-white/60 mt-3">Weight</TabsTrigger>
            <TabsTrigger value="goals" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md dark:shadow-none text-[#0A1A2F]/60 dark:text-white/60 mt-3">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="frequency" className="pt-6">
            <Suspense fallback={<ChartFallback />}><WorkoutFrequencyChart sessions={sessions} /></Suspense>
          </TabsContent>

          <TabsContent value="prs" className="pt-6">
            <Suspense fallback={<ChartFallback />}><PersonalBestsChart sessions={sessions} /></Suspense>
          </TabsContent>

          <TabsContent value="volume" className="pt-6">
            <Suspense fallback={<ChartFallback />}><VolumeProgressChart sessions={sessions} /></Suspense>
          </TabsContent>

          <TabsContent value="weight" className="pt-6">
            <Suspense fallback={<ChartFallback />}><WeightProgressChart progressPhotos={progressPhotos} /></Suspense>
          </TabsContent>

          <TabsContent value="goals" className="pt-6">
            <Suspense fallback={<ChartFallback />}><GoalCompletionChart workouts={workouts} /></Suspense>
          </TabsContent>
        </Tabs>

        {/* Progress Photos */}
        <Suspense fallback={<ChartFallback />}><ProgressPhotoGallery photos={progressPhotos} /></Suspense>
      </div>

      {/* Coach David Chatbot */}
      <ChatButton bot="CoachDavid" />
    </div>
  );
}