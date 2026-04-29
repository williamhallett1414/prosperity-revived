import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Smile, Frown, Meh, Zap, Cloud, Loader2, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Fallback verses when AI is unavailable
const FALLBACK_VERSES = {
  joyful:     { verses: [{ reference: 'Psalm 16:11', text: 'In your presence is fullness of joy.' }, { reference: 'Nehemiah 8:10', text: 'The joy of Yahweh is your strength.' }, { reference: 'Philippians 4:4', text: 'Rejoice in the Lord always! Again I will say, rejoice!' }], encouragement: 'Your joy is a gift. Let it overflow to those around you today.', practical_step: 'Share your joy with someone — send a message of encouragement.' },
  peaceful:   { verses: [{ reference: 'Philippians 4:7', text: 'The peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.' }, { reference: 'Isaiah 26:3', text: 'You will keep whoever\'s mind is steadfast in perfect peace, because he trusts in you.' }, { reference: 'John 14:27', text: 'Peace I leave with you. My peace I give to you.' }], encouragement: 'Peace is evidence of trust. Rest in this moment.', practical_step: 'Take 5 minutes of silence and thank God for this peace.' },
  struggling: { verses: [{ reference: 'Isaiah 41:10', text: 'Don\'t be afraid, for I am with you. Don\'t be dismayed, for I am your God.' }, { reference: 'Psalm 34:17', text: 'The righteous cry, and Yahweh hears, and delivers them out of all their troubles.' }, { reference: '2 Corinthians 4:8-9', text: 'We are pressed on every side, yet not crushed; perplexed, yet not to despair.' }], encouragement: 'Struggles are not the end of your story. God is working even now.', practical_step: 'Write down one thing you can control today and focus on that.' },
  anxious:    { verses: [{ reference: 'Philippians 4:6', text: 'Don\'t be anxious for anything, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.' }, { reference: 'Matthew 6:34', text: 'Don\'t be anxious for tomorrow, for tomorrow will be anxious for itself.' }, { reference: '1 Peter 5:7', text: 'Casting all your worries on him, because he cares for you.' }], encouragement: 'Anxiety is a signal, not a sentence. Bring it to God.', practical_step: 'Name 3 specific worries, then pray over each one and release it.' },
  sad:        { verses: [{ reference: 'Psalm 34:18', text: 'Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.' }, { reference: 'Psalm 147:3', text: 'He heals the broken in heart, and binds up their wounds.' }, { reference: 'Romans 8:28', text: 'We know that all things work together for good for those who love God.' }], encouragement: 'God is close to the brokenhearted. You are not alone in this.', practical_step: 'Let yourself feel this fully, then tell God exactly how you feel.' },
  neutral:    { verses: [{ reference: 'Proverbs 3:5-6', text: 'Trust in Yahweh with all your heart, and don\'t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.' }, { reference: 'Psalm 118:24', text: 'This is the day that Yahweh has made. We will rejoice and be glad in it!' }, { reference: 'Colossians 3:23', text: 'Whatever you do, work heartily, as for the Lord and not for men.' }], encouragement: 'Even ordinary days are full of grace. Look for it.', practical_step: 'Do one small act of kindness for someone today — no reason needed.' },
};

const moods = [
  { id: 'joyful', label: 'Joyful', icon: Smile, color: 'bg-[#FAD98D]/30 text-[#c9a227]', description: 'feeling happy and grateful' },
  { id: 'peaceful', label: 'Peaceful', icon: Heart, color: 'bg-[#AFC7E3]/30 text-[#3C4E53]', description: 'feeling calm and content' },
  { id: 'struggling', label: 'Struggling', icon: Cloud, color: 'bg-[#0A1A2F]/8 text-[#0A1A2F]/60 dark:text-white/60', description: 'facing challenges' },
  { id: 'anxious', label: 'Anxious', icon: Zap, color: 'bg-[#FAD98D]/30 text-[#c9a227]', description: 'feeling worried or stressed' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-[#AFC7E3]/20 text-[#0A1A2F] dark:text-white dark:text-white', description: 'feeling down or discouraged' },
  { id: 'neutral', label: 'Okay', icon: Meh, color: 'bg-[#FAD98D]/20 text-[#C9A227]', description: 'feeling neutral' },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [customMood, setCustomMood] = useState('');
  const [error, setError] = useState(false);

  const handleMoodSelect = async (mood, customDescription = null) => {
    setSelectedMood(mood);
    setLoading(true);
    setShowResponse(true);
    setAiResponse(null);
    setError(false);

    const moodDescription = customDescription || mood.description;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `The user is ${moodDescription}. Provide a response in this exact JSON format with NO markdown, NO backticks, ONLY the JSON object:
{
  "verses": [
    {"reference": "Book Chapter:Verse", "text": "verse text here"},
    {"reference": "Book Chapter:Verse", "text": "verse text here"},
    {"reference": "Book Chapter:Verse", "text": "verse text here"}
  ],
  "encouragement": "A brief encouraging message",
  "practical_step": "One practical action they can take"
}`
      });

      let parsed = response;
      if (typeof response === 'string') {
        try {
          // Strip markdown fences if present
          const cleaned = response.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
          parsed = JSON.parse(cleaned);
        } catch {
          console.error('Failed to parse response:', response);
          parsed = null;
        }
      }

      if (parsed && parsed.verses && Array.isArray(parsed.verses)) {
        setAiResponse(parsed);
      } else {
        // Use fallback verses for the mood
        const fallback = FALLBACK_VERSES[mood.id] || FALLBACK_VERSES.neutral;
        setAiResponse(fallback);
      }
    } catch (err) {
      console.error('Error fetching AI response:', err);
      // Use fallback verses instead of showing nothing
      const fallback = FALLBACK_VERSES[mood.id] || FALLBACK_VERSES.neutral;
      setAiResponse(fallback);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-0">
      <Card className="p-5 bg-gradient-to-br from-[#FAD98D]/15 to-[#FAD98D]/10 border-none shadow-lg dark:shadow-none">
        <h3 className="text-sm font-semibold text-[#0A1A2F] dark:text-white mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#c9a227]" />
          How are you feeling today?
        </h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood?.id === mood.id;
            
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                disabled={loading}
                aria-label={`I'm feeling ${mood.label.toLowerCase()}`}
                className={`${mood.color} rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' :
                  isSelected ? 'ring-2 ring-offset-2 ring-[#c9a227] scale-105' : 'hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Mood Input */}
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Or type how you're feeling..."
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            disabled={loading}
            className="flex-1 text-sm bg-[#F2F6FA] dark:bg-[#0A1A2F]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customMood.trim() && !loading) {
                handleMoodSelect({ id: 'custom', label: 'Custom' }, customMood.trim());
                setCustomMood('');
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => {
              if (customMood.trim()) {
                handleMoodSelect({ id: 'custom', label: 'Custom' }, customMood.trim());
                setCustomMood('');
              }
            }}
            disabled={!customMood.trim() || loading}
            className="bg-gradient-to-r from-[#c9a227] to-[#FAD98D] hover:opacity-90"
          >
            Go
          </Button>
        </div>

        <AnimatePresence>
          {showResponse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#c9a227]" />
                  <span className="ml-2 text-sm text-[#0A1A2F]/60 dark:text-white/60">Finding verses for you...</span>
                </div>
              )}

              {!loading && aiResponse && (
                <div className="space-y-4 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl p-4">
                   {/* Error notice with retry */}
                   {error && (
                     <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2">
                       <p className="text-xs text-amber-700 flex-1">Showing saved verses. Tap retry for personalized results.</p>
                       <button onClick={() => handleMoodSelect(selectedMood)} className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                         <RefreshCw className="w-3 h-3" /> Retry
                       </button>
                     </div>
                   )}

                   {/* Verses */}
                   <div>
                     <h4 className="font-semibold text-[#0A1A2F] dark:text-white mb-3 text-sm">Scripture for You</h4>
                     <div className="space-y-3">
                       {aiResponse.verses && Array.isArray(aiResponse.verses) && aiResponse.verses.map((verse, index) => (
                         <div key={index} className="bg-[#FAD98D]/20 p-3 rounded-lg border-l-4 border-[#c9a227]">
                           <p className="font-medium text-xs text-[#0A1A2F] dark:text-white mb-1">{verse.reference}</p>
                           <p className="text-sm text-[#0A1A2F]/75 dark:text-white/75 italic">{verse.text}</p>
                         </div>
                       ))}
                       {(!aiResponse.verses || !Array.isArray(aiResponse.verses)) && (
                         <p className="text-sm text-[#0A1A2F]/50 dark:text-white/50">Unable to load verses. Please try again.</p>
                       )}
                     </div>
                   </div>

                  {/* Encouragement */}
                  <div>
                    <h4 className="font-semibold text-[#0A1A2F] dark:text-white mb-2 text-sm">A Word of Encouragement</h4>
                    <p className="text-sm text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed">{aiResponse.encouragement}</p>
                  </div>

                  {/* Practical Step */}
                  <div className="bg-[#c9a227]/10 p-3 rounded-lg">
                    <h4 className="font-semibold text-[#0A1A2F] dark:text-white mb-2 text-sm">Try This Today</h4>
                    <p className="text-sm text-[#0A1A2F]/75 dark:text-white/75">{aiResponse.practical_step}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResponse(false)}
                    className="w-full text-xs"
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}