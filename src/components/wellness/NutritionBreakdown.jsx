import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function NutritionBreakdown({ timeRange = 7 }) {
  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.MealLog.list('-date', 100)
  });

  const stats = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    const recentMeals = meals.filter(m => new Date(m.date) >= cutoffDate);

    const totals = recentMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
        fiber: acc.fiber + (meal.fiber || 0),
        sugar: acc.sugar + (meal.sugar || 0),
        sodium: acc.sodium + (meal.sodium || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 }
    );

    const avgDaily = {
      calories: Math.round(totals.calories / timeRange),
      protein: Math.round(totals.protein / timeRange),
      carbs: Math.round(totals.carbs / timeRange),
      fats: Math.round(totals.fats / timeRange),
      fiber: Math.round(totals.fiber / timeRange),
      sugar: Math.round(totals.sugar / timeRange),
      sodium: Math.round(totals.sodium / timeRange)
    };

    // Daily breakdown for chart
    const dailyData = [];
    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = recentMeals.filter(m => m.date === dateStr);
      const dayTotals = dayMeals.reduce(
        (acc, meal) => ({
          calories: acc.calories + (meal.calories || 0),
          protein: acc.protein + (meal.protein || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fats: acc.fats + (meal.fats || 0)
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      dailyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...dayTotals
      });
    }

    // Macro distribution for pie chart
    const macroData = [
      { name: 'Protein', value: totals.protein * 4 },
      { name: 'Carbs', value: totals.carbs * 4 },
      { name: 'Fats', value: totals.fats * 9 }
    ].filter(m => m.value > 0);

    return { totals, avgDaily, dailyData, macroData };
  }, [meals, timeRange]);

  return (
    <div className="space-y-4">
      {/* Average Daily Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Daily Average ({timeRange} days)</h3>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">{stats.avgDaily.calories}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.avgDaily.protein}g</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
          </div>
          <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">{stats.avgDaily.carbs}g</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.avgDaily.fats}g</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fats</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="font-medium text-gray-700 dark:text-gray-300">{stats.avgDaily.fiber}g</p>
            <p className="text-xs text-gray-500">Fiber</p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="font-medium text-gray-700 dark:text-gray-300">{stats.avgDaily.sugar}g</p>
            <p className="text-xs text-gray-500">Sugar</p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="font-medium text-gray-700 dark:text-gray-300">{stats.avgDaily.sodium}mg</p>
            <p className="text-xs text-gray-500">Sodium</p>
          </div>
        </div>
      </motion.div>

      {/* Calorie Trend Chart */}
      {stats.dailyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Daily Calorie Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.dailyData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Macro Distribution */}
      {stats.macroData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4"
        >
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-4">Macro Distribution (Calories)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}