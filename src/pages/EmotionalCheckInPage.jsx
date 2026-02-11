import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Book, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const moods = [
  { emoji: '😊', label: 'Joyful', value: 'joyful', practice: 'Gratitude Prayer' },
  { emoji: '😌', label: 'Peaceful', value: 'peaceful', practice: 'Scripture Meditation' },
  { emoji: '😔', label: 'Sad', value: 'sad', practice: 'Comforting Verses' },
  { emoji: '😰', label: 'Anxious', value: 'anxious', practice: 'Breathing Exercise' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated', practice: 'Grounding Practice' },
  { emoji: '😐', label: 'Neutral', value: 'neutral', practice: 'Reflection' }
];

export default function EmotionalCheckInPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [influence, setInfluence] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({
        entry_type: 'emotional_checkin',
        mood: selectedMood.value,
        content: influence,
        suggested_practice: selectedMood.practice
      });
      toast.success('Check-in saved to My Journal!');
      setSelectedMood(null);
      setInfluence('');
    } catch (error) {
      toast.error('Failed to save check-in');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Wellness')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Emotional Check-In</h1>
            <p className="text-xs text-[#0A1A2F]/60">How are you feeling today?</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-[#0A1A2F] mb-3">Select Your Mood</h3>

          <p className="text-sm text-[#0A1A2F]/60 mb-8">Take a moment to identify how you're feeling right now.</p>

          <div className="border-t border-gray-100 pt-6 mb-8"></div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood)}
                className={`p-5 rounded-xl border transition-all ${
                  selectedMood?.value === mood.value
                    ? 'border-[#D9B878] bg-[#D9B878]/10 shadow-md'
                    : 'border-gray-200 bg-gray-50 hover:border-[#D9B878]/50 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl">{mood.emoji}</div>
                  <div className="text-sm font-medium text-[#0A1A2F]">{mood.label}</div>
                </div>
              </button>
            ))}
          </div>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-6"
            >
              <Input
                value={influence}
                onChange={(e) => setInfluence(e.target.value)}
                placeholder="What influenced your mood today? (optional)"
                className="border-gray-200 focus:border-[#D9B878] h-12 text-base"
              />

              <div className="bg-[#AFC7E3]/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-[#AFC7E3]" />
                  <p className="text-base font-semibold text-[#0A1A2F]">Suggested Practice</p>
                </div>
                <p className="text-sm text-[#0A1A2F]/70">{selectedMood.practice}</p>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F] h-12 text-base font-semibold"
              >
                {saving ? 'Saving...' : 'Save to My Journal'}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}