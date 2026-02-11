import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save } from 'lucide-react';
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

export default function ReflectionOfTheWeek() {
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
      toast.success('Weekly reflection saved!');
    } catch (error) {
      toast.error('Failed to save reflection');
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-[#AFC7E3]" />
        <h3 className="text-lg font-bold text-[#0A1A2F]">Reflection of the Week</h3>
      </div>

      <div className="bg-[#AFC7E3]/10 rounded-xl p-4 mb-4">
        <p className="text-[#0A1A2F] font-medium italic">"{weeklyPrompt}"</p>
      </div>

      <Textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write your weekly reflection here..."
        className="min-h-[150px] border-gray-200 focus:border-[#AFC7E3] resize-none mb-4"
      />

      <div className="flex items-center justify-between">
        <Button
          onClick={handleSave}
          disabled={saving || !reflection.trim()}
          className="bg-[#AFC7E3] hover:bg-[#AFC7E3]/90 text-[#0A1A2F]"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Reflection'}
        </Button>
        {lastSaved && (
          <p className="text-xs text-[#0A1A2F]/50">
            Last saved: {new Date(lastSaved).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}