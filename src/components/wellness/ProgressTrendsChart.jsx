import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export default function ProgressTrendsChart({ 
  workoutSessions = [], 
  mealLogs = [], 
  waterLogs = [],
  days = 30 
}) {
  // Generate last N days
  const chartData = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const workoutsCount = workoutSessions.filter(w => w.date === dateStr).length;
    const mealsCount = mealLogs.filter(m => m.date === dateStr).length;
    const waterLog = waterLogs.find(w => w.date === dateStr);
    const waterGlasses = waterLog?.glasses || 0;

    chartData.push({
      date: format(date, 'MMM dd'),
      workouts: workoutsCount,
      meals: mealsCount,
      water: waterGlasses
    });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-sm text-purple-600">Workouts: {payload[0].payload.workouts}</p>
            <p className="text-sm text-green-600">Meals: {payload[0].payload.meals}</p>
            <p className="text-sm text-blue-600">Water: {payload[0].payload.water} glasses</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const avgWorkouts = chartData.reduce((sum, d) => sum + d.workouts, 0) / chartData.length;
  const avgMeals = chartData.reduce((sum, d) => sum + d.meals, 0) / chartData.length;
  const avgWater = chartData.reduce((sum, d) => sum + d.water, 0) / chartData.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-purple-600">{avgWorkouts.toFixed(1)}</p>
          <p className="text-xs text-gray-600">Avg Workouts/Day</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-green-600">{avgMeals.toFixed(1)}</p>
          <p className="text-xs text-gray-600">Avg Meals/Day</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-blue-600">{avgWater.toFixed(1)}</p>
          <p className="text-xs text-gray-600">Avg Water/Day</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="mealGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="workouts"
            stroke="#9333ea"
            fill="url(#workoutGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="meals"
            stroke="#10b981"
            fill="url(#mealGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="water"
            stroke="#3b82f6"
            fill="url(#waterGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}