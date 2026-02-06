import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Dumbbell, Calendar, Target, Award, Flame, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export default function WorkoutTrends() {
  const [user, setUser] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('weight_used');
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 200),
    enabled: !!user
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 200),
    enabled: !!user
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['waterLogs'],
    queryFn: () => base44.entities.WaterLog.list('-date', 200),
    enabled: !!user
  });

  // Overall Activity Trend Data
  const activityChartData = [];
  for (let i = timeRange - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const workoutsCount = workoutSessions.filter(w => w.date === dateStr).length;
    const mealsCount = mealLogs.filter(m => m.date === dateStr).length;
    const waterLog = waterLogs.find(w => w.date === dateStr);
    const waterGlasses = waterLog?.glasses || 0;

    activityChartData.push({
      date: format(date, 'MMM dd'),
      workouts: workoutsCount,
      meals: mealsCount,
      water: waterGlasses
    });
  }

  // Calculate streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < timeRange; i++) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasWorkout = workoutSessions.some(w => w.date === dateStr);
    
    if (hasWorkout) {
      if (i === 0) currentStreak++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (i === 0) currentStreak = 0;
      tempStreak = 0;
    }
  }

  // Get unique exercises
  const allExercises = [...new Set(
    workoutSessions.flatMap(s => s.exercises_performed?.map(e => e.name) || [])
  )].sort();

  // Exercise-specific progress data
  const exerciseChartData = selectedExercise ? workoutSessions
    .filter(s => s.exercises_performed?.some(e => e.name === selectedExercise))
    .map(session => {
      const exercise = session.exercises_performed.find(e => e.name === selectedExercise);
      return {
        date: format(new Date(session.date), 'MMM dd'),
        weight: exercise?.weight_used || 0,
        reps: exercise?.reps_completed || 0,
        sets: exercise?.sets_completed || 0,
        duration: exercise?.duration_seconds || 0
      };
    })
    .reverse()
    .slice(-20) : [];

  const metricConfig = {
    weight_used: { key: 'weight', label: 'Weight (lbs)', color: '#10b981' },
    reps_completed: { key: 'reps', label: 'Reps', color: '#3b82f6' },
    sets_completed: { key: 'sets', label: 'Sets', color: '#8b5cf6' },
    duration_seconds: { key: 'duration', label: 'Duration (sec)', color: '#f59e0b' }
  };

  const currentMetric = metricConfig[selectedMetric];

  // Weekly Summary Data
  const weeklyData = [];
  for (let i = 0; i < 8; i++) {
    const weekEnd = subDays(new Date(), i * 7);
    const weekStart = subDays(weekEnd, 6);
    const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd })
      .map(d => format(d, 'yyyy-MM-dd'));

    const weekWorkouts = workoutSessions.filter(w => weekDates.includes(w.date)).length;
    const weekMeals = mealLogs.filter(m => weekDates.includes(m.date)).length;
    
    const totalCalories = mealLogs
      .filter(m => weekDates.includes(m.date))
      .reduce((sum, m) => sum + (m.calories || 0), 0);

    weeklyData.unshift({
      week: `Week ${i === 0 ? 'Current' : '-' + i}`,
      workouts: weekWorkouts,
      meals: weekMeals,
      avgCalories: weekMeals > 0 ? Math.round(totalCalories / weekMeals) : 0
    });
  }

  // Stats
  const totalWorkouts = workoutSessions.length;
  const avgWorkoutsPerWeek = (totalWorkouts / (timeRange / 7)).toFixed(1);
  const totalMinutes = workoutSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const avgCaloriesPerDay = mealLogs.length > 0 
    ? Math.round(mealLogs.reduce((sum, m) => sum + (m.calories || 0), 0) / mealLogs.length)
    : 0;

  // Most performed exercises
  const exerciseFrequency = {};
  workoutSessions.forEach(session => {
    session.exercises_performed?.forEach(ex => {
      exerciseFrequency[ex.name] = (exerciseFrequency[ex.name] || 0) + 1;
    });
  });

  const topExercises = Object.entries(exerciseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white px-4 py-6">
        <Link
          to={createPageUrl('Wellness')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold mb-2">Workout Trends</h1>
        <p className="text-white/80 text-sm">Track your progress and consistency</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex justify-end">
          <Select value={timeRange.toString()} onValueChange={(val) => setTimeRange(parseInt(val))}>
            <SelectTrigger className="w-32 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="180">6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white dark:bg-[#2d2d4a]">
            <CardContent className="p-4 text-center">
              <Dumbbell className="w-8 h-8 text-emerald-600 mb-2 mx-auto" />
              <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{totalWorkouts}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Workouts</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#2d2d4a]">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-orange-600 mb-2 mx-auto" />
              <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{currentStreak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#2d2d4a]">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
              <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{avgWorkoutsPerWeek}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Workouts/Week</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#2d2d4a]">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
              <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{totalMinutes}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityChartData}>
                    <defs>
                      <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="mealGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      style={{ fontSize: '10px' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      style={{ fontSize: '11px' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="workouts"
                      stroke="#10b981"
                      fill="url(#workoutGradient)"
                      strokeWidth={2}
                      name="Workouts"
                    />
                    <Area
                      type="monotone"
                      dataKey="meals"
                      stroke="#f59e0b"
                      fill="url(#mealGradient)"
                      strokeWidth={2}
                      name="Meals Logged"
                    />
                    <Area
                      type="monotone"
                      dataKey="water"
                      stroke="#3b82f6"
                      fill="url(#waterGradient)"
                      strokeWidth={2}
                      name="Water (glasses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Exercises */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most Performed Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                {topExercises.length > 0 ? (
                  <div className="space-y-3">
                    {topExercises.map((exercise, idx) => (
                      <div key={exercise.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <span className="font-medium text-gray-700">{exercise.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{exercise.count} sessions</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No workout data yet</p>
                )}
              </CardContent>
            </Card>

            {/* Streak & Consistency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Consistency Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <Flame className="w-6 h-6 text-orange-600 mb-2 mx-auto" />
                    <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
                    <p className="text-xs text-gray-600">Current Streak</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <Award className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
                    <p className="text-2xl font-bold text-purple-600">{longestStreak}</p>
                    <p className="text-xs text-gray-600">Longest Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercise Progress Tab */}
          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Exercise-Specific Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Exercise</label>
                    <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        {allExercises.map(ex => (
                          <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Metric</label>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_used">Weight</SelectItem>
                        <SelectItem value="reps_completed">Reps</SelectItem>
                        <SelectItem value="sets_completed">Sets</SelectItem>
                        <SelectItem value="duration_seconds">Duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedExercise && exerciseChartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={exerciseChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 11 }}
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
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={currentMetric.key}
                          stroke={currentMetric.color}
                          strokeWidth={3}
                          dot={{ fill: currentMetric.color, r: 5 }}
                          name={currentMetric.label}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                        <p className="text-xs text-gray-600">Best</p>
                        <p className="text-xl font-bold text-emerald-600">
                          {Math.max(...exerciseChartData.map(d => d[currentMetric.key]))}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                        <p className="text-xs text-gray-600">Average</p>
                        <p className="text-xl font-bold text-blue-600">
                          {(exerciseChartData.reduce((sum, d) => sum + d[currentMetric.key], 0) / exerciseChartData.length).toFixed(1)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                        <p className="text-xs text-gray-600">Sessions</p>
                        <p className="text-xl font-bold text-purple-600">{exerciseChartData.length}</p>
                      </div>
                    </div>

                    {/* Recent Sessions */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-gray-700">Recent Sessions</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {workoutSessions
                          .filter(s => s.exercises_performed?.some(e => e.name === selectedExercise))
                          .slice(0, 10)
                          .map(session => {
                            const exercise = session.exercises_performed.find(e => e.name === selectedExercise);
                            return (
                              <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {format(new Date(session.date), 'MMM dd, yyyy')}
                                </span>
                                <div className="flex gap-3 text-xs font-medium">
                                  {exercise.weight_used > 0 && <span className="text-green-600">{exercise.weight_used} lbs</span>}
                                  {exercise.sets_completed > 0 && <span className="text-blue-600">{exercise.sets_completed} sets</span>}
                                  {exercise.reps_completed > 0 && <span className="text-purple-600">{exercise.reps_completed} reps</span>}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                ) : selectedExercise ? (
                  <div className="text-center py-12 text-gray-500">
                    No data recorded for this exercise yet
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select an exercise to view progress
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Summary Tab */}
          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#9ca3af"
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      style={{ fontSize: '11px' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="workouts" fill="#10b981" name="Workouts" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="meals" fill="#f59e0b" name="Meals Logged" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Nutrition Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Nutrition Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                    <span className="text-sm text-gray-700">Avg Daily Calories</span>
                    <span className="text-lg font-bold text-orange-600">{avgCaloriesPerDay}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                    <span className="text-sm text-gray-700">Meals Logged</span>
                    <span className="text-lg font-bold text-blue-600">{mealLogs.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-xl">
                    <span className="text-sm text-gray-700">Water Logs</span>
                    <span className="text-lg font-bold text-cyan-600">{waterLogs.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">8-Week Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weeklyData.map((week, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{week.week}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-emerald-600">{week.workouts} workouts</span>
                        <span className="text-orange-600">{week.meals} meals</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}