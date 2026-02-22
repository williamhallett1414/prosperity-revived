import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Heart, Sparkles, Target, CheckCircle2, Crown, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Hannah from '@/components/mindspirit/Hannah';

export default function PersonalGrowth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">Personal Growth</h2>
            <p className="text-sm text-[#0A1A2F]/60">Tools to strengthen your mind, emotions, and spiritual life.</p>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* My Journal */}
            <Link to={createPageUrl('MyJournalEntries')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#FD9C2D] rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">My Journal</h3>
                    <p className="text-xs text-[#0A1A2F]/60">View reflections</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Daily Mindset Reset */}
            <Link to={createPageUrl('MindsetResetPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#D9B878]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Mindset Reset</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Daily prompts</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Emotional Check-In */}
            <Link to={createPageUrl('EmotionalCheckInPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#FAD98D]/30 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#FD9C2D]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Emotional Check-In</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Track feelings</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Scripture Affirmations */}
            <Link to={createPageUrl('AffirmationsPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#AFC7E3]/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#AFC7E3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Affirmations</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Daily truths</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Growth Pathways */}
            <Link to={createPageUrl('GrowthPathwaysPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#3C4E53]/10 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#3C4E53]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Growth Pathways</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Personal development</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Habit Builder */}
            <Link to={createPageUrl('HabitBuilderPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#FAD98D]/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#FD9C2D]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Habit Builder</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Daily tracking</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Identity in Christ */}
            <Link to={createPageUrl('IdentityInChristPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#D9B878]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Identity in Christ</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Know who you are</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Weekly Reflection */}
            <Link to={createPageUrl('WeeklyReflectionPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#AFC7E3]/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#AFC7E3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Weekly Reflection</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Review your week</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Self-Care Challenges */}
            <Link to={createPageUrl('SelfCareChallengesPage')}>
              















            </Link>

            {/* Gratitude Journal */}
            <Link to={createPageUrl('GratitudeJournalPage')}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }} className="bg-white px-4 py-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">


                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 bg-[#FD9C2D] rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1A2F]">Gratitude Journal</h3>
                    <p className="text-xs text-[#0A1A2F]/60">Count blessings</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Hannah Chatbot */}
      <Hannah user={user} />
    </div>);

}