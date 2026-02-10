import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function MoodTracker() {
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [stress, setStress] = useState(null);
  const queryClient = useQueryClient();

  const saveMood = useMutation({
    mutationFn: async (data) => {
      try {
        return await base44.entities.JournalEntry.create(data);
      } catch (error) {
        console.log('JournalEntry entity not available');
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Mood tracked!');
      setMood(null);
      setEnergy(null);
      setStress(null);
      queryClient.invalidateQueries(['journalEntries']);
    }
  });

  const handleSave = () => {
    if (mood && energy && stress) {
      saveMood.mutate({
        title: 'Mood Check-In',
        content: `Mood: ${mood}, Energy: ${energy}, Stress: ${stress}`,
        entry_type: 'mood_tracker',
        mood: mood.toLowerCase()
      });
    }
  };

  const moods = [
    { emoji: '😔', label: 'Low', value: 'Low' },
    { emoji: '😐', label: 'Okay', value: 'Okay' },
    { emoji: '🙂', label: 'Good', value: 'Good' },
    { emoji: '😄', label: 'Great', value: 'Great' }
  ];

  const levels = [
    { label: 'Low', color: 'from-green-400 to-green-500' },
    { label: 'Medium', color: 'from-yellow-400 to-yellow-500' },
    { label: 'High', color: 'from-red-400 to-red-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Check-In</h2>

        {/* Mood */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">How's your mood?</label>
          <div className="flex gap-3 justify-between">
            {moods.map(m => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex-1 p-3 rounded-xl transition ${
                  mood === m.value 
                    ? 'bg-[#c9a227] scale-110' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="text-3xl mb-1">{m.emoji}</div>
                <div className="text-xs text-white">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Energy Level</label>
          <div className="flex gap-2">
            {levels.map(level => (
              <button
                key={level.label}
                onClick={() => setEnergy(level.label)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  energy === level.label
                    ? `bg-gradient-to-r ${level.color} text-white scale-105`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stress */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Stress Level</label>
          <div className="flex gap-2">
            {levels.map(level => (
              <button
                key={level.label}
                onClick={() => setStress(level.label)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  stress === level.label
                    ? `bg-gradient-to-r ${level.color} text-white scale-105`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!mood || !energy || !stress}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e5c158] text-white"
        >
          Save Check-In
        </Button>
      </div>
    </motion.div>
  );
}