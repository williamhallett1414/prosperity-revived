import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Award, Calendar, Dumbbell, Activity, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import WorkoutFrequencyChart from '@/components/wellness/WorkoutFrequencyChart';
import PersonalBestsChart from '@/components/wellness/PersonalBestsChart';
import VolumeProgressChart from '@/components/wellness/VolumeProgressChart';
import WorkoutStreakCard from '@/components/wellness/WorkoutStreakCard';
import WeightProgressChart from '@/components/wellness/WeightProgressChart';
import GoalCompletionChart from '@/components/wellness/GoalCompletionChart';
import ProgressPhotoGallery from '@/components/wellness/ProgressPhotoGallery';

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
    <div className="min-h-screen bg-[#000000] pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] text-white px-4 py-6 mb-6">
        <Link
          to={createPageUrl('Wellness')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold mb-2">My Fitness Progress</h1>
        <p className="text-white/80 text-sm">Track your workout journey and improvements</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-[#FD9C2D] to-[#C4E3FD] border-none">
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

          <Card className="bg-gradient-to-br from-[#C4E3FD] to-[#FD9C2D] border-none">
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

          <Card className="bg-gradient-to-br from-[#000000] via-[#FD9C2D] to-[#000000] border-none">
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

          <Card className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] border-none">
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
        <Tabs defaultValue="frequency" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 bg-[#FD9C2D]">
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
      </div>
    </div>
  );
}