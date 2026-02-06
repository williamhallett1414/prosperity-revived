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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1a2e] dark:to-[#16213e] p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Link
          to={createPageUrl('Wellness')}
          className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 inline-flex hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1a2e] dark:text-white">
              Workout Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Track your fitness journey</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-600" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Workouts</p>
                  <p className="text-2xl font-bold text-emerald-600">{totalWorkouts}</p>
                </div>
                <Dumbbell className="w-8 h-8 text-emerald-600/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">{thisMonth}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</p>
                  <p className="text-2xl font-bold text-purple-600">{totalMinutes}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
                  <p className="text-2xl font-bold text-orange-600">{avgDuration}m</p>
                </div>
                <Award className="w-8 h-8 text-orange-600/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Card */}
        <WorkoutStreakCard sessions={sessions} />

        {/* Charts */}
        <Tabs defaultValue="frequency" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
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
  );
}