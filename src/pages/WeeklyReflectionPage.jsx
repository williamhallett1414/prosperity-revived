import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const weeklyPrompts = [
  "What was the most significant moment of gratitude this week?",
  "How did you see God working in your life this week?",
  "What challenge did you face, and how did you respond?",
  "What lesson did you learn about yourself this week?",
  "Who impacted your life this week, and how?",
  "What are you most proud of accomplishing this week?",
  "How did you grow spiritually or emotionally this week?",
  "What do you want to focus on or improve next week?"
];

export default function WeeklyReflectionPage() {
  const [weeklyPrompt, setWeeklyPrompt] = useState('');
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const weekNumber = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 1000 / 60 / 60 / 24 / 7);
    setWeeklyPrompt(weeklyPrompts[weekNumber % weeklyPrompts.length]);
    loadWeeklyReflection();
  }, []);

  const loadWeeklyReflection = async () => {
    try {
      const weekStart = getWeekStart();
      const entries = await base44.entities.JournalEntry.filter({
        entry_type: 'weekly_reflection',
        created_date: weekStart
      });
      if (entries.length > 0) {
        setReflection(entries[0].content || '');
        setLastSaved(entries[0].updated_date);
      }
    } catch (error) {
      console.error('Failed to load weekly reflection:', error);
    }
  };

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  };

  const handleSave = async () => {
    if (!reflection.trim()) {
      toast.error('Please write a reflection first');
      return;
    }

    setSaving(true);
    try {
      const weekStart = getWeekStart();
      const entries = await base44.entities.JournalEntry.filter({
        entry_type: 'weekly_reflection',
        created_date: weekStart
      });

      if (entries.length > 0) {
        await base44.entities.JournalEntry.update(entries[0].id, {
          content: reflection,
          prompt: weeklyPrompt
        });
      } else {
        await base44.entities.JournalEntry.create({
          entry_type: 'weekly_reflection',
          content: reflection,
          prompt: weeklyPrompt
        });
      }

      setLastSaved(new Date().toISOString());
      toast.success('Weekly reflection saved to My Journal!');
    } catch (error) {
      toast.error('Failed to save reflection');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Wellness') + '?tab=mind'}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Reflection of the Week</h1>
            <p className="text-xs text-[#0A1A2F]/60">Review and reflect on your week</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-8 h-8 text-[#AFC7E3]" />
            <div>
              <h3 className="text-xl font-bold text-[#0A1A2F]">This Week's Prompt</h3>
              <p className="text-xs text-[#0A1A2F]/60">Reflect on the week that was</p>
            </div>
          </div>

          <div className="bg-[#AFC7E3]/10 rounded-xl p-5 mb-6">
            <p className="text-base text-[#0A1A2F] font-medium italic leading-relaxed">"{weeklyPrompt}"</p>
          </div>

          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your weekly reflection here..."
            className="min-h-[250px] border-gray-200 focus:border-[#AFC7E3] resize-none mb-6 text-base"
          />

          <div className="flex items-center justify-between">
            <Button
              onClick={handleSave}
              disabled={saving || !reflection.trim()}
              className="flex-1 bg-[#AFC7E3] hover:bg-[#AFC7E3]/90 text-[#0A1A2F] h-12 text-base font-semibold"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save to My Journal'}
            </Button>
          </div>
          
          {lastSaved && (
            <p className="text-xs text-[#0A1A2F]/50 text-center mt-4">
              Last saved: {new Date(lastSaved).toLocaleDateString()} at {new Date(lastSaved).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}