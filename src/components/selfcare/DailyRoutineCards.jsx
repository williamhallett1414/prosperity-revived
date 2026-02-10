import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2, Sunrise, Sun, Moon, Heart, Book, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DailyRoutineCards({ meditations = [] }) {
  const [gratitude, setGratitude] = useState('');
  const [mood, setMood] = useState([50]);
  const queryClient = useQueryClient();

  const morningMeditation = meditations.find(m => 
    m.category === 'breathing' || m.category === 'mindfulness'
  );

  const eveningMeditation = meditations.find(m => 
    m.category === 'sleep' || m.category === 'stress_relief'
  );

  const saveGratitude = useMutation({
    mutationFn: async (data) => {
      try {
        return await base44.entities.JournalEntry.create(data);
      } catch (error) {
        console.log('JournalEntry entity not available');
        throw error;
      }
    },
    onSuccess: () => {
      setGratitude('');
      queryClient.invalidateQueries(['journalEntries']);
    }
  });

  const handleSaveGratitude = () => {
    if (gratitude.trim()) {
      saveGratitude.mutate({
        title: 'Midday Gratitude',
        content: gratitude,
        entry_type: 'gratitude',
        mood: 'grateful'
      });
    }
  };

  const MeditationCard = ({ meditation, icon: Icon, title, gradient }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`min-w-[280px] rounded-2xl p-5 ${gradient} text-white shadow-xl`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      {meditation ? (
        <>
          <div className="mb-3">
            {meditation.image_url && (
              <img 
                src={meditation.image_url} 
                alt={meditation.title}
                className="w-full h-32 object-cover rounded-xl mb-2"
              />
            )}
            <p className="font-semibold text-base">{meditation.title}</p>
            <p className="text-sm opacity-90 mt-1">{meditation.description}</p>
            <p className="text-xs opacity-75 mt-1">{meditation.duration_minutes} minutes</p>
          </div>

          <div className="flex items-center justify-between">
            {meditation.status === 'pending' ? (
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Generating...
              </Badge>
            ) : meditation.tts_audio_url ? (
              <Button 
                size="sm"
                onClick={() => window.location.href = `/meditation-player?id=${meditation.id}`}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Play className="w-4 h-4 mr-1" />
                Play
              </Button>
            ) : (
              <Badge variant="secondary" className="bg-white/20 text-white">Ready</Badge>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm opacity-75">No meditation available yet</p>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold text-white mb-4">Daily Routine</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {/* Morning Reset */}
        <MeditationCard
          meditation={morningMeditation}
          icon={Sunrise}
          title="Morning Reset"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />

        {/* Midday Check-In */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="min-w-[280px] rounded-2xl p-5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-5 h-5" />
            <h3 className="text-lg font-bold">Midday Check-In</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm opacity-90 mb-2 block">How are you feeling?</label>
              <Slider
                value={mood}
                onValueChange={setMood}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs opacity-75 mt-1">
                <span>Low</span>
                <span>Great</span>
              </div>
            </div>

            <div>
              <label className="text-sm opacity-90 mb-1 block">Quick Gratitude</label>
              <Textarea
                placeholder="What are you grateful for today?"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="min-h-[60px] bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              <Button
                onClick={handleSaveGratitude}
                disabled={!gratitude.trim()}
                size="sm"
                className="mt-2 bg-white/20 hover:bg-white/30 text-white"
              >
                Save
              </Button>
            </div>

            <div className="flex items-center justify-between bg-white/20 rounded-lg p-2">
              <span className="text-sm">💧 Hydration</span>
              <span className="text-xs">6/8 glasses</span>
            </div>
          </div>
        </motion.div>

        {/* Evening Wind-Down */}
        <MeditationCard
          meditation={eveningMeditation}
          icon={Moon}
          title="Evening Wind-Down"
          gradient="bg-gradient-to-br from-indigo-600 to-purple-700"
        />

        {/* Scripture Reflection */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="min-w-[280px] rounded-2xl p-5 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <Book className="w-5 h-5" />
            <h3 className="text-lg font-bold">Scripture Reflection</h3>
          </div>
          <p className="text-sm opacity-90 mb-2 italic">
            "Be still, and know that I am God"
          </p>
          <p className="text-xs opacity-75">Psalm 46:10</p>
          <Button size="sm" className="mt-3 bg-white/20 hover:bg-white/30 text-white">
            Reflect
          </Button>
        </motion.div>

        {/* Gratitude Practice */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="min-w-[280px] rounded-2xl p-5 bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5" />
            <h3 className="text-lg font-bold">Gratitude Practice</h3>
          </div>
          <p className="text-sm opacity-90 mb-3">
            Take a moment to count your blessings
          </p>
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
            Start Practice
          </Button>
        </motion.div>

        {/* Stretch & Breathe */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="min-w-[280px] rounded-2xl p-5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wind className="w-5 h-5" />
            <h3 className="text-lg font-bold">Stretch & Breathe</h3>
          </div>
          <p className="text-sm opacity-90 mb-3">
            5-minute gentle movement and breathwork
          </p>
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
            Begin
          </Button>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}