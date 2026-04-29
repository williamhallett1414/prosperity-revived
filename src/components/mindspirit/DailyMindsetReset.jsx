import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, RefreshCw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const prompts = [
  "What limiting belief am I ready to release today?",
  "What does success look like for me today?",
  "What am I grateful for right now?",
  "What strength can I lean into today?",
  "What would I do today if I believed in myself completely?",
  "What story am I telling myself that no longer serves me?",
  "How can I show up as my best self today?"
];

export default function DailyMindsetReset() {
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [todaysPrompt, setTodaysPrompt] = useState('');

  useEffect(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setTodaysPrompt(prompts[dayOfYear % prompts.length]);
  }, []);

  const handleSave = async () => {
    if (!reflection.trim()) {
      toast.error('Please write a reflection first');
      return;
    }

    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({
        entry_type: 'mindset_reset',
        content: reflection,
        prompt: todaysPrompt
      });
      toast.success('Reflection saved!');
      setReflection('');
    } catch (error) {
      toast.error('Failed to save reflection');
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#FAD98D]/10 to-[#AFC7E3]/10 rounded-2xl p-6 border border-[#FAD98D]/20 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#FAD98D]" />
          <h3 className="text-lg font-bold text-[#0A1A2F] dark:text-white dark:text-white">Daily Mindset Reset</h3>
        </div>
        <RefreshCw className="w-4 h-4 text-[#0A1A2F]/40 dark:text-white/40" />
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl p-5 mb-4">
        <p className="text-[#0A1A2F] dark:text-white font-medium mb-4 italic">"{todaysPrompt}"</p>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your thoughts here..."
          className="min-h-[120px] border-gray-200 dark:border-white/10 focus:border-[#FAD98D] resize-none"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={saving || !reflection.trim()}
        className="w-full bg-[#FAD98D] hover:bg-[#FAD98D]/90 text-[#0A1A2F] dark:text-white dark:text-white"
      >
        {saving ? 'Saving...' : 'Save Reflection'}
      </Button>
    </motion.div>
  );
}