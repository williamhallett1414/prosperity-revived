import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { getVerseOfDay } from '../bible/BibleData';
import { Loader, Lightbulb, Zap, Heart } from 'lucide-react';

export default function DailyDevotional() {
  const verse = getVerseOfDay();
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateDevotional = async () => {
      setLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Create a brief daily devotional based on this Bible verse. Format your response as JSON with the following structure:
          {
            "reflection": "A 2-3 sentence reflection on the verse (50-80 words)",
            "prayer": "A short prayer inspired by the verse (40-60 words)",
            "action": "One actionable step based on the verse (20-30 words)"
          }
          
          Verse: "${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}
          
          Keep the tone inspirational, personal, and practical. Make it meaningful for someone starting their day.`,
          response_json_schema: {
            type: 'object',
            properties: {
              reflection: { type: 'string' },
              prayer: { type: 'string' },
              action: { type: 'string' }
            },
            required: ['reflection', 'prayer', 'action']
          }
        });
        setDevotional(result);
      } catch (error) {
        console.error('Failed to generate devotional:', error);
        setDevotional(null);
      } finally {
        setLoading(false);
      }
    };

    generateDevotional();
  }, [verse.book, verse.chapter, verse.verse]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 mb-6"
      >
        <div className="flex items-center justify-center gap-3 text-amber-700">
          <Loader className="w-5 h-5 animate-spin" />
          <p>Preparing your daily devotional...</p>
        </div>
      </motion.div>
    );
  }

  if (!devotional) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8 mb-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Daily Devotional</h2>

      {/* Reflection */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="text-lg font-semibold text-[#1a1a2e]">Reflection</h3>
        </div>
        <p className="text-gray-700 leading-relaxed ml-13">
          {devotional.reflection}
        </p>
      </div>

      {/* Prayer */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-700" />
          </div>
          <h3 className="text-lg font-semibold text-[#1a1a2e]">Prayer</h3>
        </div>
        <p className="text-gray-700 leading-relaxed italic ml-13">
          "{devotional.prayer}"
        </p>
      </div>

      {/* Action */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-lg font-semibold text-[#1a1a2e]">Today's Action</h3>
        </div>
        <p className="text-gray-700 leading-relaxed ml-13">
          {devotional.action}
        </p>
      </div>
    </motion.div>
  );
}