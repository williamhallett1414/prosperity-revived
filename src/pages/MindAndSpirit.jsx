import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Sparkles } from 'lucide-react';

import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import GratitudeJournal from '@/components/mindspirit/GratitudeJournal';
import DailyMindsetReset from '@/components/mindspirit/DailyMindsetReset';
import EmotionalCheckIn from '@/components/mindspirit/EmotionalCheckIn';
import ScriptureAffirmations from '@/components/mindspirit/ScriptureAffirmations';
import PersonalGrowthPathways from '@/components/mindspirit/PersonalGrowthPathways';
import HabitBuilder from '@/components/mindspirit/HabitBuilder';
import MindsetAudioLibrary from '@/components/mindspirit/MindsetAudioLibrary';
import IdentityInChrist from '@/components/mindspirit/IdentityInChrist';
import ReflectionOfTheWeek from '@/components/mindspirit/ReflectionOfTheWeek';

export default function MindAndSpirit() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      try {
        return await base44.entities.Challenge.filter({});
      } catch {
        return [];
      }
    },
    retry: false
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants'],
    queryFn: async () => {
      try {
        return await base44.entities.ChallengeParticipant.filter({ user_email: user?.email });
      } catch {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1A2F] flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D9B878]" />
              Mind & Spirit
            </h1>
            <p className="text-xs text-[#0A1A2F]/60">Your daily spiritual wellness</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* A. Daily Mindset Reset */}
        <DailyMindsetReset />

        {/* B. Emotional Check-In */}
        <EmotionalCheckIn />

        {/* C. Scripture-Based Affirmations */}
        <ScriptureAffirmations />

        {/* D. Personal Growth Pathways */}
        <PersonalGrowthPathways />

        {/* E. Habit Builder */}
        <HabitBuilder />

        {/* F. Mindset Audio Library */}
        <MindsetAudioLibrary />

        {/* G. Identity in Christ */}
        <IdentityInChrist />

        {/* H. Reflection of the Week */}
        <ReflectionOfTheWeek />

        {/* Self-Care Challenges (kept from old page) */}
        <SelfCareChallenges 
          challenges={challenges} 
          participations={challengeParticipants} 
        />

        {/* Gratitude Journal (kept from old page) */}
        <GratitudeJournal />
      </div>
    </div>
  );
}