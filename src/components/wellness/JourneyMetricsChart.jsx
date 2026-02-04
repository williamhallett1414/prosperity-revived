import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, BookOpen, Utensils } from 'lucide-react';

export default function JourneyMetricsChart({ journey, workoutSessions = [], recipeLogs = [], readingProgress = [] }) {
  // Weekly activity breakdown
  const weeklyData = journey.weeks?.map((week, index) => {
    const workoutsCompleted = workoutSessions.filter(w => {
      const weekStart = new Date(journey.created_date);
      weekStart.setDate(weekStart.getDate() + (week.week_number - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const sessionDate = new Date(w.date);
      return sessionDate >= weekStart && sessionDate < weekEnd;
    }).length;

    const recipesCooked = recipeLogs.filter(r => {
      const weekStart = new Date(journey.created_date);
      weekStart.setDate(weekStart.getDate() + (week.week_number - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const recipeDate = new Date(r.date);
      return recipeDate >= weekStart && recipeDate < weekEnd;
    }).length;

    return {
      week: `Week ${week.week_number}`,
      workouts: workoutsCompleted,
      recipes: recipesCooked,
      reading: week.completed ? 1 : 0
    };
  }) || [];

  // Overall balance radar chart
  const totalWorkouts = workoutSessions.length;
  const totalRecipes = recipeLogs.length;
  const totalReading = journey.weeks?.filter(w => w.completed).length || 0;
  const totalMeditation = journey.weeks?.reduce((sum, w) => sum + (w.meditation_completed ? 1 : 0), 0) || 0;

  const balanceData = [
    { category: 'Fitness', value: Math.min((totalWorkouts / (journey.duration_weeks || 1)) * 20, 100) },
    { category: 'Nutrition', value: Math.min((totalRecipes / (journey.duration_weeks || 1)) * 20, 100) },
    { category: 'Spiritual', value: Math.min((totalReading / (journey.duration_weeks || 1)) * 100, 100) },
    { category: 'Mindfulness', value: Math.min((totalMeditation / (journey.duration_weeks || 1)) * 100, 100) }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{payload[0].payload.week}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm flex items-center gap-2">
              <Activity className="w-3 h-3 text-purple-600" />
              Workouts: {payload[0].payload.workouts}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Utensils className="w-3 h-3 text-green-600" />
              Recipes: {payload[0].payload.recipes}
            </p>
            <p className="text-sm flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-blue-600" />
              Reading: {payload[0].payload.reading ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Weekly Activity Breakdown */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold mb-4 text-gray-900">Weekly Activity Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="workouts" fill="#9333ea" radius={[8, 8, 0, 0]} />
            <Bar dataKey="recipes" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Wellness Balance */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold mb-4 text-gray-900">Wellness Balance</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={balanceData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="category" 
              style={{ fontSize: '12px' }}
              stroke="#6b7280"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              stroke="#9ca3af"
              style={{ fontSize: '10px' }}
            />
            <Radar
              name="Your Balance"
              dataKey="value"
              stroke="#9333ea"
              fill="#9333ea"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-center text-xs text-gray-500 mt-2">
          A balanced wellness journey covers all areas equally
        </p>
      </div>
    </div>
  );
}