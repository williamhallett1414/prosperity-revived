import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Play, Sunrise, Sun, Moon, Heart, Book, Wind, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getVerseOfDay } from '@/components/bible/BibleData';
import { toast } from 'sonner';

export default function DailyRoutineCards({ meditations = [] }) {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [gratitude, setGratitude] = useState('');
  const [mood, setMood] = useState([50]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [reflection, setReflection] = useState('');
  const queryClient = useQueryClient();

  const { data: todayWater } = useQuery({
    queryKey: ['todayWater'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const logs = await base44.entities.WaterLog.filter({ date: today });
      return logs[0] || null;
    }
  });

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
      toast.success('Gratitude saved!');
      queryClient.invalidateQueries(['journalEntries']);
      setActiveModal(null);
    }
  });

  const updateWater = useMutation({
    mutationFn: async (glasses) => {
      const today = new Date().toISOString().split('T')[0];
      if (todayWater) {
        return await base44.entities.WaterLog.update(todayWater.id, { glasses });
      } else {
        return await base44.entities.WaterLog.create({ date: today, glasses, goal: 8 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todayWater']);
      toast.success('Water logged!');
    }
  });

  const saveReflection = useMutation({
    mutationFn: async (data) => {
      try {
        return await base44.entities.JournalEntry.create(data);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      setReflection('');
      toast.success('Reflection saved!');
      queryClient.invalidateQueries(['journalEntries']);
      setActiveModal(null);
    }
  });

  const verse = getVerseOfDay();

  const handleWaterIncrement = () => {
    const newCount = (todayWater?.glasses || 0) + 1;
    setWaterGlasses(newCount);
    updateWater.mutate(newCount);
  };

  const routineCards = [
    {
      id: 'morning-reset',
      icon: Sunrise,
      title: 'Morning Reset',
      gradient: 'from-[#D9B878] to-[#AFC7E3]',
      modal: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🌅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Breath Prayer</h3>
            <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-xl p-5 mb-4">
              <p className="text-[#0A1A2F] font-serif italic leading-relaxed">
                Breathe in: "Lord Jesus"<br />
                Breathe out: "Fill me with peace"
              </p>
              <p className="text-xs text-[#0A1A2F]/60 mt-2">Repeat 5 times slowly</p>
            </div>
            </div>

            <div className="bg-[#E6EBEF] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#0A1A2F] mb-2">Today's Scripture</p>
            <p className="font-serif italic text-[#0A1A2F]">"{verse.text}"</p>
            <p className="text-xs text-[#0A1A2F]/60 mt-1">{verse.book} {verse.chapter}:{verse.verse}</p>
            </div>

            {morningMeditation && (
            <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-5">
              <p className="text-sm font-semibold text-[#0A1A2F] mb-2">Guided Meditation</p>
              <p className="text-[#0A1A2F]">{morningMeditation.title}</p>
              <Button 
                size="sm" 
                className="mt-3 w-full bg-white hover:bg-white/90 text-[#0A1A2F]"
                onClick={() => navigate(createPageUrl('Wellness'))}
                disabled={!morningMeditation.tts_audio_url}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Meditation
              </Button>
            </div>
            )}

            <div className="text-center">
            <p className="text-sm text-[#0A1A2F]/70">Take a moment to stretch and set your intentions for the day.</p>
            </div>
        </div>
      )
    },
    {
      id: 'midday-checkin',
      icon: Sun,
      title: 'Midday Check-In',
      gradient: 'from-[#AFC7E3] to-[#D9B878]',
      modal: (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[#0A1A2F] mb-3 block">How are you feeling?</label>
            <Slider
              value={mood}
              onValueChange={setMood}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#0A1A2F]/60 mt-2">
              <span>Low</span>
              <span>Neutral</span>
              <span>Great</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#0A1A2F] mb-3">💧 Hydration Check</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#0A1A2F]">{todayWater?.glasses || 0} / 8 glasses</span>
              <Button 
                size="sm" 
                onClick={handleWaterIncrement}
                className="bg-white hover:bg-white/90 text-[#0A1A2F]"
              >
                Log Glass
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0A1A2F] mb-3 block">Quick Gratitude</label>
            <Textarea
              placeholder="What are you grateful for right now?"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              className="min-h-[80px] bg-[#E6EBEF] border-[#E6EBEF]"
            />
            <Button
              onClick={() => saveGratitude.mutate({
                title: 'Midday Gratitude',
                content: gratitude,
                entry_type: 'gratitude',
                mood: 'grateful'
              })}
              disabled={!gratitude.trim()}
              className="w-full mt-3 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            >
              Save
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'evening-winddown',
      icon: Moon,
      title: 'Evening Wind-Down',
      gradient: 'from-[#0A1A2F] to-[#AFC7E3]',
      modal: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🌙</div>
            <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">Evening Reflection</h3>
          </div>

          <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#0A1A2F] mb-3">Reflect on today:</p>
            <Textarea
              placeholder="What went well today? What did you learn?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[100px] bg-white border-[#E6EBEF]"
            />
            <Button
              onClick={() => saveReflection.mutate({
                title: 'Evening Reflection',
                content: reflection,
                entry_type: 'reflection',
                mood: 'peaceful'
              })}
              disabled={!reflection.trim()}
              className="w-full mt-3 bg-white hover:bg-white/90 text-[#0A1A2F]"
            >
              Save Reflection
            </Button>
          </div>

          <div className="bg-[#E6EBEF] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#0A1A2F] mb-3">Light Stretching</p>
            <ul className="text-sm text-[#0A1A2F]/80 space-y-2">
              <li>• Neck rolls (30 seconds)</li>
              <li>• Shoulder stretches (30 seconds)</li>
              <li>• Gentle side bends (30 seconds)</li>
              <li>• Deep breathing (1 minute)</li>
            </ul>
          </div>

          {eveningMeditation && (
            <div className="bg-gradient-to-br from-[#0A1A2F] to-[#AFC7E3] rounded-xl p-5">
              <p className="text-sm font-semibold text-white mb-2">Sleep Meditation</p>
              <p className="text-white/90 text-sm mb-3">{eveningMeditation.title}</p>
              <Button 
                size="sm" 
                className="w-full bg-white hover:bg-white/90 text-[#0A1A2F]"
                onClick={() => navigate(createPageUrl('Wellness'))}
                disabled={!eveningMeditation.tts_audio_url}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'gratitude-practice',
      icon: Heart,
      title: 'Gratitude Practice',
      gradient: 'from-[#D9B878] to-[#D9B878]',
      modal: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Gratitude Journal</h3>
            <p className="text-sm text-gray-600 mb-4">Count your blessings today</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-[#0A1A2F] mb-3 block">What are 3 things you're grateful for?</label>
              <Textarea
                placeholder="1. &#10;2. &#10;3. "
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                className="min-h-[120px] bg-[#E6EBEF] border-[#E6EBEF]"
              />
            </div>

            <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-xl p-4 text-sm text-[#0A1A2F]">
              <p className="font-semibold mb-2">💡 Prompts:</p>
              <ul className="space-y-1">
                <li>• A person who blessed you today</li>
                <li>• A moment of peace or joy</li>
                <li>• Something you take for granted</li>
              </ul>
            </div>

            <Button
              onClick={() => saveGratitude.mutate({
                title: 'Gratitude Practice',
                content: gratitude,
                entry_type: 'gratitude',
                mood: 'grateful'
              })}
              disabled={!gratitude.trim()}
              className="w-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            >
              Save Gratitude
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'scripture-reflection',
      icon: Book,
      title: 'Scripture Reflection',
      gradient: 'from-[#AFC7E3] to-[#0A1A2F]',
      modal: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Scripture</h3>
          </div>

          <div className="bg-[#E6EBEF] rounded-xl p-5">
            <p className="font-serif italic text-[#0A1A2F] text-lg mb-3 leading-relaxed">
              "{verse.text}"
            </p>
            <p className="text-sm text-[#0A1A2F]/60 font-semibold">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-5">
            <p className="text-sm font-semibold text-[#0A1A2F] mb-2">Reflection Question:</p>
            <p className="text-[#0A1A2F]/80 mb-3">How can this verse guide your actions today?</p>
            <Textarea
              placeholder="Write your thoughts..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[100px] bg-white border-[#E6EBEF]"
            />
            <Button
              onClick={() => saveReflection.mutate({
                title: `Reflection on ${verse.book} ${verse.chapter}:${verse.verse}`,
                content: reflection,
                entry_type: 'scripture_reflection'
              })}
              disabled={!reflection.trim()}
              className="w-full mt-3 bg-white hover:bg-white/90 text-[#0A1A2F]"
            >
              Save Reflection
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'stretch-breathe',
      icon: Wind,
      title: 'Stretch & Breathe',
      gradient: 'from-[#AFC7E3] to-[#AFC7E3]',
      modal: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🌬️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">5-Minute Movement</h3>
            <p className="text-sm text-gray-600">Gentle stretches and breathwork</p>
          </div>

          <div className="bg-[#E6EBEF] rounded-xl p-5 space-y-3">
            <div>
              <p className="font-semibold text-[#0A1A2F] text-sm mb-1">🧘 Neck Rolls</p>
              <p className="text-xs text-[#0A1A2F]/70">Slowly roll your head in circles - 30 seconds each direction</p>
            </div>
            <div>
              <p className="font-semibold text-[#0A1A2F] text-sm mb-1">💪 Shoulder Shrugs</p>
              <p className="text-xs text-[#0A1A2F]/70">Lift shoulders to ears, hold 3 seconds, release - Repeat 10 times</p>
            </div>
            <div>
              <p className="font-semibold text-[#0A1A2F] text-sm mb-1">🙆 Side Stretches</p>
              <p className="text-xs text-[#0A1A2F]/70">Reach arms overhead, lean left and right - 30 seconds each</p>
            </div>
            <div>
              <p className="font-semibold text-[#0A1A2F] text-sm mb-1">🌬️ Deep Breathing</p>
              <p className="text-xs text-[#0A1A2F]/70">Inhale 4 counts, hold 4, exhale 6 - Repeat 5 times</p>
            </div>
          </div>

          <div className="text-center">
            <Button className="w-full bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] hover:from-[#AFC7E3]/90 hover:to-[#D9B878]/90 text-[#0A1A2F]">
              ✓ Mark as Complete
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Daily Routine</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {routineCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveModal(card.id)}
                className={`min-w-[280px] rounded-2xl p-5 bg-gradient-to-br ${card.gradient} text-[#0A1A2F] shadow-lg snap-start`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-left">{card.title}</h3>
                </div>
                <p className="text-sm opacity-90 text-left">Tap to begin</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Modals */}
      {routineCards.map(card => (
        <Dialog key={card.id} open={activeModal === card.id} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-[#F2F6FA]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#0A1A2F]">
                <card.icon className="w-5 h-5 text-[#D9B878]" />
                {card.title}
              </DialogTitle>
            </DialogHeader>
            {card.modal}
          </DialogContent>
        </Dialog>
      ))}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}