import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import WellnessRecommendations from '@/components/wellness/WellnessRecommendations';
import { useQuery } from '@tanstack/react-query';

export default function Wellness() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    enabled: !!user
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 100),
    enabled: !!user
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['waterLogs'],
    queryFn: () => base44.entities.WaterLog.list('-date', 100),
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#FD9C2D]">
                {mealLogs.filter(m => m.date === today).length}
              </p>
              <p className="text-xs text-gray-500">Meals today</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#3C4E53]">
                {workoutSessions.filter(w => w.date === today).length}
              </p>
              <p className="text-xs text-gray-500">Workouts today</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#FD9C2D]">
                {waterLogs.filter(w => w.date === today).reduce((sum, w) => sum + (w.amount_ml || 0), 0)}ml
              </p>
              <p className="text-xs text-gray-500">Water intake</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nutrition Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}>
              <Link to={createPageUrl('Nutrition')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Nutrition</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Personal Growth Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}>
              <Link to={createPageUrl('PersonalGrowth')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Personal Growth</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Workouts Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <Link to={createPageUrl('Workouts')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Workouts</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Bible Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <Link to={createPageUrl('Bible')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Bible</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* My Recommendations Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-[#0A1A2F] mb-6">My Recommendations</h2>
            <WellnessRecommendations user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}