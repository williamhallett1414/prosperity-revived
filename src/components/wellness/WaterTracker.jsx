import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Droplets, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function WaterTracker() {
  const today = new Date().toISOString().split('T')[0];
  const queryClient = useQueryClient();

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['water'],
    queryFn: () => base44.entities.WaterLog.list()
  });

  const todayLog = waterLogs.find(w => w.date === today);
  const glasses = todayLog?.glasses || 0;
  const goal = todayLog?.goal || 8;

  const updateWater = useMutation({
    mutationFn: async (newGlasses) => {
      if (todayLog) {
        return base44.entities.WaterLog.update(todayLog.id, { glasses: newGlasses });
      } else {
        return base44.entities.WaterLog.create({ date: today, glasses: newGlasses, goal: 8 });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['water'])
  });

  const addGlass = () => updateWater.mutate(Math.min(glasses + 1, 20));
  const removeGlass = () => updateWater.mutate(Math.max(glasses - 1, 0));

  const percentage = Math.min((glasses / goal) * 100, 100);

  return (
    <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <Droplets className="w-6 h-6 text-blue-500" />
        <div className="flex-1">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Water Intake</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Goal: {goal} glasses</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">{glasses} / {goal} glasses</span>
          <span className="text-sm font-medium text-blue-500">{Math.round(percentage)}%</span>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={removeGlass}
          disabled={glasses === 0}
          className="h-12 w-12 rounded-full"
        >
          <Minus className="w-5 h-5" />
        </Button>
        
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-500">{glasses}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">glasses</div>
        </div>

        <Button
          size="icon"
          onClick={addGlass}
          className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}