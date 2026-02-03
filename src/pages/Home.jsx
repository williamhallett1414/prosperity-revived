import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { BookOpen, Compass, TrendingUp, Settings, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerseOfDay from '@/components/home/VerseOfDay';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import { readingPlans } from '@/components/bible/BibleData';
import DailyVerseSettings from '@/components/settings/DailyVerseSettings';
import MoodBasedVerses from '@/components/home/MoodBasedVerses';

export default function Home() {
  const [showDailyVerseSettings, setShowDailyVerseSettings] = useState(false);
  const queryClient = useQueryClient();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list();
      return allPosts.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['myMemberships'],
    queryFn: async () => {
      const all = await base44.entities.GroupMember.list();
      return all.filter(m => m.user_email === user?.email);
    },
    enabled: !!user
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list()
  });

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const createBookmark = useMutation({
    mutationFn: (data) => base44.entities.Bookmark.create(data),
    onSuccess: () => queryClient.invalidateQueries(['bookmarks'])
  });

  const handleBookmarkVerse = (verse) => {
    createBookmark.mutate({
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      verse_text: verse.text,
      highlight_color: 'yellow'
    });
  };

  const getProgressForPlan = (planId) => {
    return planProgress.find(p => p.plan_id === planId);
  };

  const activePlans = readingPlans.filter(plan => getProgressForPlan(plan.id));
  const suggestedPlans = readingPlans.filter(plan => !getProgressForPlan(plan.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-1">Good Morning</h1>
          <p className="text-gray-500">Let's start the day with God's word</p>
        </motion.div>

        {/* Verse of the Day */}
        <div className="mb-8 relative">
          <VerseOfDay onBookmark={handleBookmarkVerse} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDailyVerseSettings(true)}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#c9a227]"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Mood-Based Verses */}
        <MoodBasedVerses />

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <Link to={createPageUrl('Bible')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#1a1a2e]/5 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#1a1a2e]" />
              </div>
              <span className="text-xs font-medium text-gray-700">Bible</span>
            </motion.div>
          </Link>
          
          <Link to={createPageUrl('Plans')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#8fa68a]/20 flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#8fa68a]" />
              </div>
              <span className="text-xs font-medium text-gray-700">Plans</span>
            </motion.div>
          </Link>
          
          <Link to={createPageUrl('Bookmarks')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#c9a227]/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#c9a227]" />
              </div>
              <span className="text-xs font-medium text-gray-700">Saved</span>
            </motion.div>
          </Link>

          <Link to={createPageUrl('SpiritualGrowth')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Growth</span>
            </motion.div>
          </Link>
        </div>

        {/* Active Plans */}
        {activePlans.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1a1a2e]">Continue Reading</h2>
            </div>
            <div className="space-y-3">
              {activePlans.map((plan, index) => (
                <ReadingPlanCard
                  key={plan.id}
                  plan={plan}
                  progress={getProgressForPlan(plan.id)}
                  onClick={() => window.location.href = createPageUrl(`PlanDetail?id=${plan.id}`)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Suggested Plans</h2>
            <Link to={createPageUrl('Plans')} className="text-sm text-[#c9a227] font-medium">
              View All
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestedPlans.map((plan, index) => (
              <ReadingPlanCard
                key={plan.id}
                plan={plan}
                progress={null}
                onClick={() => window.location.href = createPageUrl(`PlanDetail?id=${plan.id}`)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Daily Verse Settings Modal */}
      <DailyVerseSettings
        isOpen={showDailyVerseSettings}
        onClose={() => setShowDailyVerseSettings(false)}
      />
    </div>
  );
}