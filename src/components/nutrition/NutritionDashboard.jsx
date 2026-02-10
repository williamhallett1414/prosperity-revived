import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Droplets, TrendingUp, Plus, Minus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function NutritionDashboard({ mealLogs = [], waterLogs = [] }) {
  const today = new Date().toISOString().split('T')[0];
  const queryClient = useQueryClient();
  
  const todayMeals = mealLogs.filter(m => m.date === today);
  const todayWater = waterLogs.find(w => w.date === today);

  const totalCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFat = todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0);
  const waterGlasses = todayWater?.glasses || 0;
  const goal = 8;

  const updateWater = useMutation({
    mutationFn: async (newGlasses) => {
      if (todayWater) {
        return base44.entities.WaterLog.update(todayWater.id, { glasses: newGlasses });
      } else {
        return base44.entities.WaterLog.create({ date: today, glasses: newGlasses, goal });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['waterLogs'])
  });

  const addGlass = () => updateWater.mutate(Math.min(waterGlasses + 1, 20));
  const removeGlass = () => updateWater.mutate(Math.max(waterGlasses - 1, 0));

  const stats = [
    { icon: Flame, label: 'Calories', value: Math.round(totalCalories), unit: 'kcal', color: 'from-[#FD9C2D] to-[#D9B878]', target: 2000 },
    { icon: Zap, label: 'Protein', value: Math.round(totalProtein), unit: 'g', color: 'from-[#D9B878] to-[#AFC7E3]', target: 150 },
    { icon: TrendingUp, label: 'Carbs', value: Math.round(totalCarbs), unit: 'g', color: 'from-[#AFC7E3] to-[#D9B878]', target: 250 },
    { icon: Droplets, label: 'Fat', value: Math.round(totalFat), unit: 'g', color: 'from-[#D9B878] to-[#FD9C2D]', target: 65 }
  ];

  return (
    <div className="space-y-4 px-4 mb-6">
      <h2 className="text-lg font-bold text-[#0A1A2F]">Today's Nutrition</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const percentage = Math.min((stat.value / stat.target) * 100, 100);

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-[#0A1A2F]" />
                <span className="text-xs font-semibold text-[#0A1A2F]">{stat.label}</span>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-[#0A1A2F]">
                  {stat.value}<span className="text-sm text-[#0A1A2F]/70 ml-1">{stat.unit}</span>
                </p>
                <p className="text-xs text-[#0A1A2F]/60">Goal: {stat.target}{stat.unit}</p>
              </div>
              <div className="w-full bg-[#0A1A2F]/10 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="bg-[#0A1A2F] h-full rounded-full"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Water Intake - Interactive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#0A1A2F]" />
            <span className="font-semibold text-[#0A1A2F]">Water Intake</span>
          </div>
          <span className="text-lg font-bold text-[#0A1A2F]">{waterGlasses}/{goal}</span>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1 mb-4">
          {[...Array(goal)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i < waterGlasses ? 'bg-[#0A1A2F]' : 'bg-[#0A1A2F]/20'
              }`}
            />
          ))}
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={removeGlass}
            disabled={waterGlasses === 0}
            className="h-10 w-10 rounded-full text-[#0A1A2F]"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="text-center min-w-20">
            <div className="text-2xl font-bold text-[#0A1A2F]">{waterGlasses}</div>
            <div className="text-xs text-[#0A1A2F]/70">glasses</div>
          </div>

          <Button
            size="icon"
            onClick={addGlass}
            className="h-10 w-10 rounded-full bg-[#0A1A2F] hover:bg-[#0A1A2F]/90 text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}