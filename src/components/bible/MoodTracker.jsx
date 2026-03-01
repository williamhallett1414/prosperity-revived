import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Smile, Frown, Meh, Zap, Cloud, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const moods = [
  { id: 'joyful', label: 'Joyful', icon: Smile, color: 'bg-[#FAD98D]/30 text-[#c9a227]', description: 'feeling happy and grateful' },
  { id: 'peaceful', label: 'Peaceful', icon: Heart, color: 'bg-[#AFC7E3]/30 text-[#3C4E53]', description: 'feeling calm and content' },
  { id: 'struggling', label: 'Struggling', icon: Cloud, color: 'bg-[#0A1A2F]/8 text-[#0A1A2F]/60', description: 'facing challenges' },
  { id: 'anxious', label: 'Anxious', icon: Zap, color: 'bg-[#FAD98D]/30 text-[#c9a227]', description: 'feeling worried or stressed' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-[#AFC7E3]/20 text-[#0A1A2F]', description: 'feeling down or discouraged' },
  { id: 'neutral', label: 'Okay', icon: Meh, color: 'bg-[#FAD98D]/20 text-[#8a6e1a]', description: 'feeling neutral' },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [customMood, setCustomMood] = useState('');

  const handleMoodSelect = async (mood, customDescription = null) => {
    setSelectedMood(mood);
    setLoading(true);
    setShowResponse(true);
    setAiResponse(null);

    const moodDescription = customDescription || mood.description;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `The user is ${moodDescription}. Provide a response in this exact JSON format:
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

      // Parse the response if it's a string
      let parsed = response;
      if (typeof response === 'string') {
        try {
          parsed = JSON.parse(response);
        } catch {
          console.error('Failed to parse response:', response);
          parsed = null;
        }
      }

      if (parsed && parsed.verses && Array.isArray(parsed.verses)) {
        setAiResponse(parsed);
      } else {
        console.error('Invalid response structure:', parsed);
        setAiResponse(null);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <Card className="p-5 bg-gradient-to-br from-[#FAD98D]/15 to-[#D9B878]/10 border-none shadow-lg">
        <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3 flex items-center gap-2">
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
                className={`${mood.color} rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
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
            className="flex-1 text-sm bg-[#FFFDF7]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customMood.trim()) {
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
            disabled={!customMood.trim()}
            className="bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:opacity-90"
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
                  <span className="ml-2 text-sm text-[#0A1A2F]/60">Finding verses for you...</span>
                </div>
              )}

              {!loading && aiResponse && (
                <div className="space-y-4 bg-[#FFFDF7] rounded-xl p-4">
                   {/* Verses */}
                   <div>
                     <h4 className="font-semibold text-[#0A1A2F] mb-3 text-sm">Scripture for You</h4>
                     <div className="space-y-3">
                       {aiResponse.verses && Array.isArray(aiResponse.verses) && aiResponse.verses.map((verse, index) => (
                         <div key={index} className="bg-[#FAD98D]/20 p-3 rounded-lg border-l-4 border-[#c9a227]">
                           <p className="font-medium text-xs text-[#0A1A2F] mb-1">{verse.reference}</p>
                           <p className="text-sm text-[#0A1A2F]/75 italic">{verse.text}</p>
                         </div>
                       ))}
                       {(!aiResponse.verses || !Array.isArray(aiResponse.verses)) && (
                         <p className="text-sm text-[#0A1A2F]/50">Unable to load verses. Please try again.</p>
                       )}
                     </div>
                   </div>

                  {/* Encouragement */}
                  <div>
                    <h4 className="font-semibold text-[#0A1A2F] mb-2 text-sm">A Word of Encouragement</h4>
                    <p className="text-sm text-[#0A1A2F]/75 leading-relaxed">{aiResponse.encouragement}</p>
                  </div>

                  {/* Practical Step */}
                  <div className="bg-[#c9a227]/10 p-3 rounded-lg">
                    <h4 className="font-semibold text-[#0A1A2F] mb-2 text-sm">Try This Today</h4>
                    <p className="text-sm text-[#0A1A2F]/75">{aiResponse.practical_step}</p>
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