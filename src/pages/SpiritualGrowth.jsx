import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, BookHeart, Mic, Target, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrayerJournal from '@/components/spiritual/PrayerJournal';
import SermonNotes from '@/components/spiritual/SermonNotes';
import SpiritualGoals from '@/components/spiritual/SpiritualGoals';
import AIEncouragement from '@/components/spiritual/AIEncouragement';

export default function SpiritualGrowth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['prayerJournal'],
    queryFn: () => base44.entities.PrayerJournal.list('-created_date', 50)
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['spiritualGoals'],
    queryFn: () => base44.entities.SpiritualGoal.list('-created_date')
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Home')}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a1a2e] hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Spiritual Growth</h1>
          </div>
          <p className="text-gray-500 ml-[52px]">Grow deeper in your faith journey</p>
        </motion.div>

        {/* AI Daily Encouragement */}
        <AIEncouragement journalEntries={journalEntries} goals={goals} />

        {/* Tabs */}
        <Tabs defaultValue="journal" className="mt-6">
          <TabsList className="grid grid-cols-3 bg-white p-1 w-full">
            <TabsTrigger value="journal" className="flex items-center gap-1.5">
              <BookHeart className="w-4 h-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="sermons" className="flex items-center gap-1.5">
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Sermons</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="mt-6">
            <PrayerJournal />
          </TabsContent>

          <TabsContent value="sermons" className="mt-6">
            <SermonNotes />
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <SpiritualGoals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}