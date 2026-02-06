import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Book, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ZODIAC_SIGNS = [
  { name: 'Aries', emoji: '♈', months: 'Mar 21 - Apr 19' },
  { name: 'Taurus', emoji: '♉', months: 'Apr 20 - May 20' },
  { name: 'Gemini', emoji: '♊', months: 'May 21 - Jun 20' },
  { name: 'Cancer', emoji: '♋', months: 'Jun 21 - Jul 22' },
  { name: 'Leo', emoji: '♌', months: 'Jul 23 - Aug 22' },
  { name: 'Virgo', emoji: '♍', months: 'Aug 23 - Sep 22' },
  { name: 'Libra', emoji: '♎', months: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', emoji: '♏', months: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', emoji: '♐', months: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', emoji: '♑', months: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', emoji: '♒', months: 'Jan 20 - Feb 18' },
  { name: 'Pisces', emoji: '♓', months: 'Feb 19 - Mar 20' },
];

export default function DailyChristianHoroscope({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [horoscope, setHoroscope] = useState(null);
  const [selectedZodiac, setSelectedZodiac] = useState(user?.zodiac_sign || '');
  const [isSavingZodiac, setIsSavingZodiac] = useState(false);

  // Generate daily horoscope based on zodiac sign
  useEffect(() => {
    const generateDailyHoroscope = async () => {
      if (!user?.email || !selectedZodiac) return;

      setIsLoading(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Generate a daily Christian horoscope for a ${selectedZodiac} for today (${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}). 
          
          Please provide:
          1. A relevant Bible verse for ${selectedZodiac} personality with book, chapter, and verse reference
          2. The full text of that verse
          3. Spiritual guidance or reflection based on that verse tailored to ${selectedZodiac} traits (2-3 sentences)
          4. A daily affirmation based on Christian faith for ${selectedZodiac}
          
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
  }, [user?.email, selectedZodiac]);

  const handleZodiacChange = async (zodiac) => {
    setSelectedZodiac(zodiac);
    
    // Save to user profile
    setIsSavingZodiac(true);
    try {
      await base44.auth.updateMe({ zodiac_sign: zodiac });
    } catch (error) {
      console.error('Failed to save zodiac sign:', error);
      toast.error('Failed to save zodiac sign');
    } finally {
      setIsSavingZodiac(false);
    }
  };

  const zodiacEmoji = ZODIAC_SIGNS.find(z => z.name === selectedZodiac)?.emoji || '✨';

  if (!selectedZodiac) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Your Daily Horoscope</h3>
        </div>
        <p className="text-white/80 mb-4">Select your zodiac sign to get personalized Christian guidance</p>
        <Select value={selectedZodiac} onValueChange={handleZodiacChange}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select your zodiac sign" />
          </SelectTrigger>
          <SelectContent>
            {ZODIAC_SIGNS.map(sign => (
              <SelectItem key={sign.name} value={sign.name}>
                {sign.emoji} {sign.name} ({sign.months})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
    );
  }

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