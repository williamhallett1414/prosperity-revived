import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import { createPageUrl } from '@/utils';
import UniversalHeader from '@/components/navigation/UniversalHeader';

export default function WorkoutCategoryPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('workouts');

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
      <UniversalHeader title={`${category} Workouts`} />

      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 mt-16">
        <div className="max-w-2xl mx-auto">
          <div className="grid w-full grid-cols-3 p-1 rounded-xl bg-[#E6EBEF]">
            <Link to={createPageUrl('Wellness?selectedTab=workouts')} className="text-xs px-3 py-2 rounded-lg text-center font-medium text-[#0A1A2F]/60 hover:bg-[#D9B878] hover:text-[#0A1A2F] transition-colors">Workouts</Link>
            <button onClick={() => setActiveTab('nutrition')} className="text-xs px-3 py-2 rounded-lg text-center font-medium text-[#0A1A2F]/60 data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Nutrition</button>
            <button onClick={() => setActiveTab('mind')} className="text-xs px-3 py-2 rounded-lg text-center font-medium text-[#0A1A2F]/60 data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Personal Growth</button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pt-6 pb-24">
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