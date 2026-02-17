import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import UniversalHeader from '@/components/navigation/UniversalHeader';
import WellnessTabBar from '@/components/wellness/WellnessTabBar';

export default function WorkoutCategoryPage() {
  const [user, setUser] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    enabled: !!user
  });

  const categoryIcons = {
    'Cardio': '❤️',
    'Strength': '💪',
    'HIIT': '⚡',
    'Home': '🏠'
  };

  const categoryColors = {
    'Cardio': 'from-red-400 to-pink-500',
    'Strength': 'from-blue-400 to-cyan-500',
    'HIIT': 'from-yellow-400 to-orange-500',
    'Home': 'from-green-400 to-emerald-500'
  };

  // Combine premade and user workouts, filter by category (case-insensitive)
  const allWorkouts = [...PREMADE_WORKOUTS, ...workouts];
  const categoryWorkouts = allWorkouts.filter(w => 
    w.category?.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F2F6FA]">
      <WellnessTabBar activeTab="workouts" />

      <div className="max-w-2xl mx-auto px-4 py-6 pt-20 pb-24">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${categoryColors[category] || 'from-gray-400 to-gray-500'} rounded-2xl p-6 text-white shadow-lg mb-6`}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{categoryIcons[category] || '🏋️'}</div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{category} Workouts</h2>
              <p className="text-white/90 text-sm">{categoryWorkouts.length} workouts available</p>
            </div>
          </div>
        </motion.div>

        {/* Workouts List */}
        {categoryWorkouts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-[#0A1A2F]/60">No workouts found in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categoryWorkouts.map((workout, index) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onComplete={() => {}}
                index={index}
                isPremade={PREMADE_WORKOUTS.some(w => w.id === workout.id)}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}