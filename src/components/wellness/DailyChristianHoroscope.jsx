import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Book } from 'lucide-react';
import { toast } from 'sonner';

export default function DailyChristianHoroscope({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [horoscope, setHoroscope] = useState(null);
  const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch or generate daily horoscope
  useEffect(() => {
    const generateDailyHoroscope = async () => {
      if (!user?.email) return;

      setIsLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Generate a daily Christian horoscope for today (${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}). 
          
          Please provide:
          1. A relevant Bible verse for today with book, chapter, and verse reference
          2. The full text of that verse
          3. Spiritual guidance or reflection based on that verse (2-3 sentences)
          4. A daily affirmation based on Christian faith
          
          Format the response as JSON with keys: verse_reference, verse_text, spiritual_guidance, daily_affirmation`,
          response_json_schema: {
            type: 'object',
            properties: {
              verse_reference: { type: 'string' },
              verse_text: { type: 'string' },
              spiritual_guidance: { type: 'string' },
              daily_affirmation: { type: 'string' }
            }
          }
        });

        setHoroscope(result);
      } catch (error) {
        console.error('Failed to generate horoscope:', error);
        toast.error('Failed to load daily horoscope');
      } finally {
        setIsLoading(false);
      }
    };

    generateDailyHoroscope();
  }, [user?.email, todayDate]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Daily Scripture & Guidance</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-4 bg-white/20 rounded w-full"></div>
          <div className="h-4 bg-white/20 rounded w-2/3"></div>
        </div>
      </motion.div>
    );
  }

  if (!horoscope) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <Book className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Daily Scripture & Guidance</h3>
        <Sparkles className="w-5 h-5 ml-auto" />
      </div>

      <div className="space-y-4">
        {/* Verse Reference */}
        <div>
          <p className="text-amber-100 text-sm font-semibold mb-1">Scripture</p>
          <p className="text-white font-bold text-lg">{horoscope.verse_reference}</p>
        </div>

        {/* Verse Text */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-white/90 italic leading-relaxed">"{horoscope.verse_text}"</p>
        </div>

        {/* Spiritual Guidance */}
        <div>
          <p className="text-amber-100 text-sm font-semibold mb-2">Spiritual Guidance</p>
          <p className="text-white/90 leading-relaxed">{horoscope.spiritual_guidance}</p>
        </div>

        {/* Daily Affirmation */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border-l-4 border-amber-200">
          <p className="text-amber-100 text-sm font-semibold mb-1">Today's Affirmation</p>
          <p className="text-white font-medium">{horoscope.daily_affirmation}</p>
        </div>
      </div>
    </motion.div>
  );
}