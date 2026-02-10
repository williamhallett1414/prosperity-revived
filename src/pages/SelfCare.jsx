import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

import DailyRoutineCards from '@/components/selfcare/DailyRoutineCards';
import QuickTools from '@/components/selfcare/QuickTools';
import MoodTracker from '@/components/selfcare/MoodTracker';
import DailyAffirmation from '@/components/selfcare/DailyAffirmation';
import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import ProgressSnapshot from '@/components/selfcare/ProgressSnapshot';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';
import DailyPrayer from '@/components/selfcare/DailyPrayer';

export default function SelfCare() {
  const [user, setUser] = useState(null);
  const [showGodTime, setShowGodTime] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: async () => {
      try {
        return await base44.entities.Meditation.filter({});
      } catch (error) {
        console.log('Meditation entity not available');
        return [];
      }
    }
  });

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.MeditationSession.filter({ created_by: user?.email });
      } catch (error) {
        console.log('MeditationSession entity not available');
        return [];
      }
    },
    enabled: !!user
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      try {
        return await base44.entities.Challenge.filter({});
      } catch (error) {
        console.log('Challenge entity not available');
        return [];
      }
    }
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants'],
    queryFn: async () => {
      try {
        return await base44.entities.ChallengeParticipant.filter({ user_email: user?.email });
      } catch (error) {
        console.log('ChallengeParticipant entity not available');
        return [];
      }
    },
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2d3142] to-[#1a1a2e]">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-[#c9a227]" />
            <h1 className="text-3xl font-bold text-white">Self-Care</h1>
            <Sparkles className="w-6 h-6 text-[#c9a227]" />
          </div>
          <p className="text-gray-300 text-sm">Nurture your mind, body, and spirit</p>
        </motion.div>

        {/* Signature Feature: Take 2 Minutes With God */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button
            onClick={() => setShowGodTime(true)}
            className="w-full h-24 bg-gradient-to-r from-[#c9a227] via-[#d4af37] to-[#c9a227] hover:from-[#d4af37] hover:to-[#e5c158] text-white text-xl font-bold rounded-2xl shadow-2xl"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">✨</span>
              <span>Take 2 Minutes With God</span>
            </div>
          </Button>
        </motion.div>

        {/* Daily Routine */}
        <DailyRoutineCards meditations={meditations} />

        {/* 2-Minute Prayer */}
        <DailyPrayer />

        {/* Quick Tools */}
        <QuickTools />

        {/* Mood Tracker */}
        <MoodTracker />

        {/* Daily Affirmation */}
        <DailyAffirmation />

        {/* Self-Care Challenges */}
        <SelfCareChallenges challenges={challenges} participations={challengeParticipants} />

        {/* Progress Snapshot */}
        <ProgressSnapshot 
          meditationSessions={meditationSessions}
          challengeParticipants={challengeParticipants}
        />
      </div>

      {/* Take Time With God Modal */}
      {showGodTime && (
        <TakeTimeWithGod onClose={() => setShowGodTime(false)} />
      )}
    </div>
  );
}