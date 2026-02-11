import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Book, Lightbulb } from 'lucide-react';
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

export default function EmotionalCheckIn() {
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
      toast.success('Check-in saved!');
      setSelectedMood(null);
      setInfluence('');
    } catch (error) {
      toast.error('Failed to save check-in');
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
        <Heart className="w-6 h-6 text-[#D9B878]" />
        <h3 className="text-lg font-bold text-[#0A1A2F]">Emotional Check-In</h3>
      </div>

      <p className="text-sm text-[#0A1A2F]/70 mb-4">How are you feeling today?</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedMood?.value === mood.value
                ? 'border-[#D9B878] bg-[#D9B878]/10'
                : 'border-gray-200 hover:border-[#D9B878]/50'
            }`}
          >
            <div className="text-3xl mb-1">{mood.emoji}</div>
            <div className="text-xs text-[#0A1A2F]/70">{mood.label}</div>
          </button>
        ))}
      </div>

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <Input
            value={influence}
            onChange={(e) => setInfluence(e.target.value)}
            placeholder="What influenced your mood today? (optional)"
            className="border-gray-200 focus:border-[#D9B878]"
          />

          <div className="bg-[#AFC7E3]/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[#AFC7E3]" />
              <p className="text-sm font-semibold text-[#0A1A2F]">Suggested Practice</p>
            </div>
            <p className="text-sm text-[#0A1A2F]/70">{selectedMood.practice}</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
          >
            {saving ? 'Saving...' : 'Save Check-In'}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}