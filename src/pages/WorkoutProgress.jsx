import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Award, Calendar, Dumbbell, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkoutFrequencyChart from '@/components/wellness/WorkoutFrequencyChart';
import PersonalBestsChart from '@/components/wellness/PersonalBestsChart';
import VolumeProgressChart from '@/components/wellness/VolumeProgressChart';
import WorkoutStreakCard from '@/components/wellness/WorkoutStreakCard';
import WeightProgressChart from '@/components/wellness/WeightProgressChart';
import GoalCompletionChart from '@/components/wellness/GoalCompletionChart';
import ProgressPhotoGallery from '@/components/wellness/ProgressPhotoGallery';
import CoachDavid from '@/components/wellness/CoachDavid';
import UniversalHeader from '@/components/navigation/UniversalHeader';

export default function WorkoutProgress() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['workout-sessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 100),
    enabled: !!user
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    enabled: !!user
  });

  const { data: progressPhotos = [] } = useQuery({
    queryKey: ['progressPhotos'],
    queryFn: () => base44.entities.ProgressPhoto.list('-date', 100),
    enabled: !!user
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
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <UniversalHeader title="Workout Progress" backTo="Workouts" />

      <div className="max-w-4xl mx-auto px-4 space-y-6 pt-20">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pt-6">
          <Card className="bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#3C4E53]/80">Total Workouts</p>
                  <p className="text-2xl font-bold text-[#3C4E53]">{totalWorkouts}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-[#3C4E53]/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#FAD98D] to-[#FD9C2D] border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#3C4E53]/80">This Month</p>
                  <p className="text-2xl font-bold text-[#3C4E53]">{thisMonth}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#3C4E53]/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#3C4E53]/80">Total Minutes</p>
                  <p className="text-2xl font-bold text-[#3C4E53]">{totalMinutes}</p>
                </div>
                <Activity className="w-8 h-8 text-[#3C4E53]/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#3C4E53] to-[#3C4E53]/80 border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Avg Duration</p>
                  <p className="text-2xl font-bold text-white">{avgDuration}m</p>
                </div>
                <Award className="w-8 h-8 text-white/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Card */}
        <WorkoutStreakCard sessions={sessions} />

        {/* Charts */}
        <Tabs defaultValue="frequency" className="w-full px-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 bg-[#E6EBEF]">
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="prs">PRs</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="frequency">
            <WorkoutFrequencyChart sessions={sessions} />
          </TabsContent>

          <TabsContent value="prs">
            <PersonalBestsChart sessions={sessions} />
          </TabsContent>

          <TabsContent value="volume">
            <VolumeProgressChart sessions={sessions} />
          </TabsContent>

          <TabsContent value="weight">
            <WeightProgressChart progressPhotos={progressPhotos} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalCompletionChart workouts={workouts} />
          </TabsContent>
        </Tabs>

        {/* Progress Photos */}
        <ProgressPhotoGallery photos={progressPhotos} />
      </div>

      {/* Coach David Chatbot */}
      <CoachDavid 
        user={user} 
        userWorkouts={workouts}
        workoutSessions={sessions}
      />
    </div>
  );
}