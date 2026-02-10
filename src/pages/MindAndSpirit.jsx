import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Sparkles, Heart, Search, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import DailyRoutineCards from '@/components/selfcare/DailyRoutineCards';
import QuickTools from '@/components/selfcare/QuickTools';
import MoodTracker from '@/components/selfcare/MoodTracker';
import DailyAffirmation from '@/components/selfcare/DailyAffirmation';
import ProgressSnapshot from '@/components/selfcare/ProgressSnapshot';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';
import DailyPrayer from '@/components/selfcare/DailyPrayer';
import MeditationFilters from '@/components/meditations/MeditationFilters';
import MeditationCard from '@/components/meditations/MeditationCard';

export default function MindAndSpirit() {
  const [user, setUser] = useState(null);
  const [showGodTime, setShowGodTime] = useState(false);
  const [meditationFilter, setMeditationFilter] = useState(null);
  const [meditationSearch, setMeditationSearch] = useState('');
  const [showMeditationLibrary, setShowMeditationLibrary] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: async () => {
      try {
        return await base44.entities.Meditation.filter({}, '-created_date', 100);
      } catch {
        return [];
      }
    },
    retry: false
  });

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.MeditationSession.filter({ created_by: user?.email }, '-created_date', 10);
      } catch {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      try {
        return await base44.entities.JournalEntry.filter({ created_by: user?.email }, '-created_date', 5);
      } catch {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const filteredMeditations = useMemo(() => {
    return meditations.filter(m => {
      const matchesCategory = !meditationFilter || m.category === meditationFilter;
      const matchesSearch = !meditationSearch || 
        m.title?.toLowerCase().includes(meditationSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [meditations, meditationFilter, meditationSearch]);

  const recentMeditations = useMemo(() => {
    return meditationSessions.slice(0, 3).map(session => {
      return meditations.find(m => m.id === session.meditation_id);
    }).filter(Boolean);
  }, [meditationSessions, meditations]);

  const recommendedMeditations = useMemo(() => {
    return meditations
      .filter(m => ['mindfulness', 'stress_relief', 'gratitude', 'prayer'].includes(m.category))
      .slice(0, 3);
  }, [meditations]);

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
        {/* A. Daily Reset Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              onClick={() => setShowGodTime(true)}
              className="h-20 bg-gradient-to-br from-[#D9B878] to-[#C9A868] hover:from-[#D9B878]/90 hover:to-[#C9A868]/90 text-[#0A1A2F] font-semibold rounded-2xl shadow-lg"
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🌅</span>
                <span className="text-xs">Start Day</span>
              </div>
            </Button>
            <Button
              className="h-20 bg-gradient-to-br from-[#AFC7E3] to-[#9AB3D1] hover:from-[#AFC7E3]/90 hover:to-[#9AB3D1]/90 text-[#0A1A2F] font-semibold rounded-2xl shadow-lg"
            >
              <Link to={createPageUrl('Home')} className="flex flex-col items-center w-full">
                <span className="text-2xl mb-1">🌙</span>
                <span className="text-xs">End Day</span>
              </Link>
            </Button>
          </div>

          {/* Daily Prayer + Scripture */}
          <div className="grid grid-cols-1 gap-3">
            <DailyPrayer />
          </div>
        </motion.div>

        {/* B. AI-Recommended Practices */}
        {recommendedMeditations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-[#0A1A2F] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D9B878]" />
              Recommended for You
            </h2>
            <div className="space-y-2">
              {recommendedMeditations.map((m, idx) => (
                <MeditationCard
                  key={m.id}
                  meditation={m}
                  onPlay={(med) => window.location.href = `/?meditation=${med.id}`}
                  onBookmark={() => {}}
                  isBookmarked={false}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* C. Daily Routine Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <DailyRoutineCards meditations={meditations} />
        </motion.div>

        {/* D. Quick Self-Care Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <QuickTools />
        </motion.div>

        {/* E. Meditation Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowMeditationLibrary(!showMeditationLibrary)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#E6EBEF] rounded-xl hover:bg-[#E6EBEF]/80 transition-colors mb-4"
          >
            <h2 className="text-lg font-bold text-[#0A1A2F] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#D9B878]" />
              Meditation Library
            </h2>
            <span className="text-sm text-[#0A1A2F]/60">{meditations.length} sessions</span>
          </button>

          {showMeditationLibrary && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="space-y-3">
                <Input
                  placeholder="Search meditations..."
                  value={meditationSearch}
                  onChange={(e) => setMeditationSearch(e.target.value)}
                  className="bg-white border-gray-200"
                />
                <MeditationFilters
                  onFilterChange={setMeditationFilter}
                  onSearch={() => {}}
                />
              </div>

              {/* Recently Played */}
              {recentMeditations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-[#0A1A2F] mb-2">Recently Played</p>
                  <div className="space-y-2">
                    {recentMeditations.map((m, idx) => (
                      <MeditationCard
                        key={m.id}
                        meditation={m}
                        onPlay={(med) => window.location.href = `/?meditation=${med.id}`}
                        onBookmark={() => {}}
                        isBookmarked={false}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Meditations */}
              <div>
                <p className="text-sm font-semibold text-[#0A1A2F] mb-2">All Sessions</p>
                {filteredMeditations.length === 0 ? (
                  <p className="text-center text-[#0A1A2F]/50 py-6">No meditations found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredMeditations.map((m, idx) => (
                      <MeditationCard
                        key={m.id}
                        meditation={m}
                        onPlay={(med) => window.location.href = `/?meditation=${med.id}`}
                        onBookmark={() => {}}
                        isBookmarked={false}
                        index={idx}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* F. Mood, Stress & Energy Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <MoodTracker />
        </motion.div>

        {/* G. Scripture-Based Affirmations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <DailyAffirmation />
        </motion.div>

        {/* Progress Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <ProgressSnapshot
            meditationSessions={meditationSessions}
            challengeParticipants={[]}
          />
        </motion.div>
      </div>

      {/* Take Time With God Modal */}
      {showGodTime && (
        <TakeTimeWithGod onClose={() => setShowGodTime(false)} />
      )}
    </div>
  );
}