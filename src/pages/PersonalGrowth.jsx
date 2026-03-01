import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Heart, Sparkles, Target, CheckCircle2, Crown, Calendar, Wind, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Hannah from '@/components/mindspirit/Hannah';

const CARDS = [
  { page: 'MyJournalEntries',       icon: BookOpen,     bg: 'from-[#AFC7E3]/25 to-[#3C4E53]/10', iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'My Journal',           sub: 'View reflections',      delay: 0 },
  { page: 'MindsetResetPage',       icon: Brain,        bg: 'from-[#AFC7E3]/20 to-[#AFC7E3]/10', iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Mindset Reset',         sub: 'Daily prompts',         delay: 0.05 },
  { page: 'EmotionalCheckInPage',   icon: Heart,        bg: 'from-[#AFC7E3]/25 to-[#3C4E53]/10', iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Emotional Check-In',    sub: 'Track feelings',        delay: 0.10 },
  { page: 'AffirmationsPage',       icon: Sparkles,     bg: 'from-[#AFC7E3]/20 to-[#AFC7E3]/10', iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Affirmations',          sub: 'Daily truths',          delay: 0.15 },
  { page: 'GrowthPathwaysPage',     icon: Target,       bg: 'from-[#AFC7E3]/25 to-[#3C4E53]/10', iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Growth Pathways',       sub: 'Personal development',  delay: 0.20 },
  { page: 'HabitBuilderPage',       icon: CheckCircle2, bg: 'from-[#AFC7E3]/20 to-[#AFC7E3]/10', iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Habit Builder',         sub: 'Daily tracking',        delay: 0.25 },
  { page: 'IdentityInChristPage',   icon: Crown,        bg: 'from-[#AFC7E3]/25 to-[#3C4E53]/10', iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Identity in Christ',    sub: 'Know who you are',      delay: 0.30 },
  { page: 'WeeklyReflectionPage',   icon: Calendar,     bg: 'from-[#AFC7E3]/20 to-[#AFC7E3]/10', iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Weekly Reflection',     sub: 'Review your week',      delay: 0.35 },
  { page: 'GratitudeJournalPage',   icon: Star,         bg: 'from-[#AFC7E3]/25 to-[#3C4E53]/10', iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Gratitude Journal',     sub: 'Count blessings',       delay: 0.40 },
  { page: 'GuidedMeditationsPage',  icon: Wind,         bg: 'from-[#AFC7E3]/20 to-[#AFC7E3]/10', iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Guided Meditations',    sub: 'AI voice + music',      delay: 0.45 },
];

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

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {CARDS.map(({ page, icon: Icon, bg, iconBg, label, sub, delay }) => (
              <Link key={page} to={createPageUrl(page)}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay }}
                  className={`bg-gradient-to-br ${bg} rounded-xl p-4 border border-[#AFC7E3]/30 shadow-sm hover:shadow-md transition-all cursor-pointer h-full`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-10 h-10 bg-gradient-to-br ${iconBg} rounded-full flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0A1A2F]">{label}</h3>
                      <p className="text-xs text-[#0A1A2F]/60">{sub}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hannah Chatbot */}
      <Hannah user={user} />
    </div>
  );
}
