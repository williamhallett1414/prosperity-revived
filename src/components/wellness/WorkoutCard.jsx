import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkoutLogModal from './WorkoutLogModal';

export default function WorkoutCard({ workout, onComplete, index, isPremade = false, user }) {
  const [showLogModal, setShowLogModal] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const completedToday = workout.completed_dates?.includes(today);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#2d2d4a] rounded-2xl overflow-hidden shadow-sm"
    >
      {workout.image_url && (
        <img src={workout.image_url} alt={workout.title} className="w-full h-32 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{workout.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{workout.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[workout.difficulty]}`}>
            {workout.difficulty}
          </span>
        </div>

      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{workout.duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Award className="w-4 h-4" />
          <span>{workout.completed_dates?.length || 0} times</span>
        </div>
      </div>

      {workout.exercises && workout.exercises.length > 0 && (
        <div className="mb-3 text-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Exercises:</p>
          <div className="space-y-1">
            {workout.exercises.slice(0, 3).map((ex, i) => (
              <div key={i} className="text-gray-700 dark:text-gray-300">
                • {ex.name} {ex.sets && `- ${ex.sets}x${ex.reps}`}
              </div>
            ))}
            {workout.exercises.length > 3 && (
              <p className="text-gray-500 dark:text-gray-400">+{workout.exercises.length - 3} more</p>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={() => isPremade ? null : setShowLogModal(true)}
        disabled={isPremade}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {isPremade ? (
          <>
            <Dumbbell className="w-4 h-4 mr-2" />
            View Details
          </>
        ) : (
          <>
            <Dumbbell className="w-4 h-4 mr-2" />
            Log Workout
          </>
        )}
      </Button>

      <WorkoutLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        workout={workout}
        user={user}
      />
      </div>
    </motion.div>
  );
}