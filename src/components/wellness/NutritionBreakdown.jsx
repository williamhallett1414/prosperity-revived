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
        sodium: acc.sodium + (meal.sodium || 0),
        cholesterol: acc.cholesterol + (meal.cholesterol || 0),
        vitamin_a: acc.vitamin_a + (meal.vitamin_a || 0),
        vitamin_c: acc.vitamin_c + (meal.vitamin_c || 0),
        vitamin_d: acc.vitamin_d + (meal.vitamin_d || 0),
        calcium: acc.calcium + (meal.calcium || 0),
        iron: acc.iron + (meal.iron || 0),
        potassium: acc.potassium + (meal.potassium || 0),
        magnesium: acc.magnesium + (meal.magnesium || 0),
        zinc: acc.zinc + (meal.zinc || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0, cholesterol: 0, vitamin_a: 0, vitamin_c: 0, vitamin_d: 0, calcium: 0, iron: 0, potassium: 0, magnesium: 0, zinc: 0 }
    );

    const avgDaily = {
      calories: Math.round(totals.calories / timeRange),
      protein: Math.round(totals.protein / timeRange),
      carbs: Math.round(totals.carbs / timeRange),
      fats: Math.round(totals.fats / timeRange),
      fiber: Math.round(totals.fiber / timeRange),
      sugar: Math.round(totals.sugar / timeRange),
      sodium: Math.round(totals.sodium / timeRange),
      cholesterol: Math.round(totals.cholesterol / timeRange),
      vitamin_a: Math.round(totals.vitamin_a / timeRange),
      vitamin_c: Math.round(totals.vitamin_c / timeRange),
      vitamin_d: Math.round(totals.vitamin_d / timeRange),
      calcium: Math.round(totals.calcium / timeRange),
      iron: Math.round(totals.iron / timeRange),
      potassium: Math.round(totals.potassium / timeRange),
      magnesium: Math.round(totals.magnesium / timeRange),
      zinc: Math.round(totals.zinc / timeRange)
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
          <div className="text-center p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F]/20 rounded-lg">
            <p className="text-2xl font-bold text-[#3C4E53]">{stats.avgDaily.protein}g</p>
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

        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
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

        {/* Micronutrients */}
        <div className="border-t pt-3 mt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Micronutrients (Daily Avg)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between p-2 bg-[#FD9C2D]/10 dark:bg-[#FD9C2D]/5 rounded">
              <span className="text-gray-600 dark:text-gray-400">Vitamin A</span>
              <span className="font-medium text-[#b86e10] dark:text-[#FD9C2D]">{stats.avgDaily.vitamin_a}mcg</span>
            </div>
            <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
              <span className="text-gray-600 dark:text-gray-400">Vitamin C</span>
              <span className="font-medium text-orange-700 dark:text-orange-400">{stats.avgDaily.vitamin_c}mg</span>
            </div>
            <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <span className="text-gray-600 dark:text-gray-400">Vitamin D</span>
              <span className="font-medium text-yellow-700 dark:text-yellow-400">{stats.avgDaily.vitamin_d}mcg</span>
            </div>
            <div className="flex justify-between p-2 bg-[#F2F6FA] dark:bg-[#0A1A2F]/20 rounded">
              <span className="text-gray-600 dark:text-gray-400">Calcium</span>
              <span className="font-medium text-[#3C4E53] dark:text-blue-400">{stats.avgDaily.calcium}mg</span>
            </div>
            <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-gray-600 dark:text-gray-400">Iron</span>
              <span className="font-medium text-red-700 dark:text-red-400">{stats.avgDaily.iron}mg</span>
            </div>
            <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-gray-600 dark:text-gray-400">Potassium</span>
              <span className="font-medium text-green-700 dark:text-green-400">{stats.avgDaily.potassium}mg</span>
            </div>
            <div className="flex justify-between p-2 bg-[#F2F6FA] dark:bg-indigo-900/20 rounded">
              <span className="text-gray-600 dark:text-gray-400">Magnesium</span>
              <span className="font-medium text-indigo-700 dark:text-indigo-400">{stats.avgDaily.magnesium}mg</span>
            </div>
            <div className="flex justify-between p-2 bg-[#FAD98D]/10 dark:bg-[#0A1A2F]/20 rounded">
              <span className="text-gray-600 dark:text-gray-400">Zinc</span>
              <span className="font-medium text-[#8a6e1a] dark:text-pink-400">{stats.avgDaily.zinc}mg</span>
            </div>
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
            <Calendar className="w-5 h-5 text-[#AFC7E3]" />
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