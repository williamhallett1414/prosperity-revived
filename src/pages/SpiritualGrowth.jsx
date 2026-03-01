import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart, Mic, Target, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="sticky top-0 z-40 bg-white border-b border-[#E6EBEF] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Home')}
            className="w-9 h-9 rounded-full bg-[#E6EBEF] hover:bg-[#D9DFE4] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Spiritual Growth</h1>
            <p className="text-xs text-[#0A1A2F]/60">Grow deeper in your faith journey</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <AIEncouragement journalEntries={journalEntries} goals={goals} />

        {/* Tabs */}
        <Tabs defaultValue="journal" className="mt-6">
          <TabsList className="grid grid-cols-3 bg-white p-1 w-full">
            <TabsTrigger value="journal" className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
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