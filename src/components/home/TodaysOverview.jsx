import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Zap } from 'lucide-react';
import StartWorkoutModal from '@/components/wellness/StartWorkoutModal';
import VerseOfDay from './VerseOfDay';

const affirmations = [
  "I am worthy of God's love and grace",
  "Today I will choose faith over fear",
  "My potential is limitless with God",
];

const getAffirmation = () => affirmations[new Date().getDate() % affirmations.length];

export default function TodaysOverview({ meditations = [], workoutPlans = [], challenges = [], user, onBookmark }) {
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const navigate = useNavigate();
  const affirmation = getAffirmation();
  const suggestedMeditation = meditations.find(m => m.category === 'mindfulness');
  const suggestedWorkout = workoutPlans?.[0];
  const activeChallenge = challenges?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 space-y-3"
    >
      <h2 className="text-lg font-bold text-[#0A1A2F] px-4">Today's Overview</h2>

      {/* Verse of the Day */}
      <div className="px-4">
        <VerseOfDay onBookmark={onBookmark} />
      </div>

      {/* Affirmation Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-br from-[#D9B878] to-[#FD9C2D] rounded-xl p-4 mx-4"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#0A1A2F] flex-shrink-0 mt-1" />
          <div>
            <p className="text-[#0A1A2F] font-semibold text-sm">{affirmation}</p>
          </div>
        </div>
      </motion.div>

      {/* Suggested Activity Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#E6EBEF] to-[#AFC7E3] rounded-xl p-4 mx-4"
      >
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-[#0A1A2F] flex-shrink-0 mt-1" />
            <p className="text-xs font-semibold text-[#0A1A2F]/70">Suggested for Today</p>
          </div>
          {suggestedMeditation && (
            <button
              onClick={() => navigate(`${createPageUrl('DiscoverMeditations')}?id=${suggestedMeditation.id}`)}
              className="block w-full text-left text-sm text-[#0A1A2F] font-medium hover:text-[#D9B878] transition-colors pl-6"
            >
              🧘 {suggestedMeditation.title}
            </button>
          )}
          {suggestedWorkout && (
            <button
              onClick={() => setShowWorkoutModal(true)}
              className="block w-full text-left text-sm text-[#0A1A2F] font-medium hover:text-[#D9B878] transition-colors pl-6"
            >
              💪 {suggestedWorkout.title || 'Workout'} ({suggestedWorkout.duration_minutes}m)
            </button>
          )}
        </div>
      </motion.div>



      <StartWorkoutModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        workout={suggestedWorkout}
        user={user}
      />
    </motion.div>
  );
}