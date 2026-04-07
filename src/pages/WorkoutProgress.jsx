import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Award, Calendar, Dumbbell, Activity, TrendingUp} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import WorkoutFrequencyChart from '@/components/wellness/WorkoutFrequencyChart';
import PersonalBestsChart from '@/components/wellness/PersonalBestsChart';
import VolumeProgressChart from '@/components/wellness/VolumeProgressChart';
import WorkoutStreakCard from '@/components/wellness/WorkoutStreakCard';
import WeightProgressChart from '@/components/wellness/WeightProgressChart';
import GoalCompletionChart from '@/components/wellness/GoalCompletionChart';
import ProgressPhotoGallery from '@/components/wellness/ProgressPhotoGallery';
import ChatButton from '@/components/chatbot/ChatButton';

export default function WorkoutProgress() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#38BDF8]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#1e40af] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F]">Workout Progress</h1>
            <p className="text-xs text-[#0A1A2F]/45">Track your gains</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6 pt-4">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pt-6">
          <Card className="bg-gradient-to-br from-[#D97706] to-[#EA580C] border-none shadow-md">
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

          <Card className="bg-gradient-to-br from-[#1e40af] to-[#38BDF8] border-none shadow-md">
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

          <Card className="bg-gradient-to-br from-[#38BDF8] to-[#1e40af] border-none shadow-md">
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

          <Card className="bg-black border-none shadow-md">
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
        <WorkoutStreakCard sessions={sessions} />

        {/* Charts */}
        <Tabs defaultValue="frequency" className="w-full px-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 bg-gradient-to-r from-[#38BDF8]/10 to-[#D97706]/10 border border-[#38BDF8]/20 rounded-lg p-1">
            <TabsTrigger value="frequency" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md text-[#0A1A2F]/60">Frequency</TabsTrigger>
            <TabsTrigger value="prs" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md text-[#0A1A2F]/60">PRs</TabsTrigger>
            <TabsTrigger value="volume" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md text-[#0A1A2F]/60">Volume</TabsTrigger>
            <TabsTrigger value="weight" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md text-[#0A1A2F]/60 mt-3">Weight</TabsTrigger>
            <TabsTrigger value="goals" className="text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#38BDF8] data-[state=active]:to-[#1e40af] data-[state=active]:text-white data-[state=active]:shadow-md text-[#0A1A2F]/60">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="frequency" className="pt-6">
            <WorkoutFrequencyChart sessions={sessions} />
          </TabsContent>

          <TabsContent value="prs" className="pt-6">
            <PersonalBestsChart sessions={sessions} />
          </TabsContent>

          <TabsContent value="volume" className="pt-6">
            <VolumeProgressChart sessions={sessions} />
          </TabsContent>

          <TabsContent value="weight" className="pt-6">
            <WeightProgressChart progressPhotos={progressPhotos} />
          </TabsContent>

          <TabsContent value="goals" className="pt-6">
            <GoalCompletionChart workouts={workouts} />
          </TabsContent>
        </Tabs>

        {/* Progress Photos */}
        <ProgressPhotoGallery photos={progressPhotos} />
      </div>

      {/* Coach David Chatbot */}
      <ChatButton bot="CoachDavid" />
    </div>
  );
}