import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Smile, Frown, Meh, Zap, Cloud, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const moods = [
  { id: 'joyful', label: 'Joyful', icon: Smile, color: 'bg-yellow-100 text-yellow-600', description: 'feeling happy and grateful' },
  { id: 'peaceful', label: 'Peaceful', icon: Heart, color: 'bg-green-100 text-green-600', description: 'feeling calm and content' },
  { id: 'struggling', label: 'Struggling', icon: Cloud, color: 'bg-gray-100 text-gray-600', description: 'facing challenges' },
  { id: 'anxious', label: 'Anxious', icon: Zap, color: 'bg-orange-100 text-orange-600', description: 'feeling worried or stressed' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-blue-100 text-blue-600', description: 'feeling down or discouraged' },
  { id: 'neutral', label: 'Okay', icon: Meh, color: 'bg-purple-100 text-purple-600', description: 'feeling neutral' },
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
        prompt: `The user is currently ${moodDescription}. Provide:
1. Three specific Bible verses (with references) that would encourage them
2. A brief, heartfelt message of encouragement (2-3 sentences)
3. One practical suggestion for how they can connect with God today

Format the response in a warm, pastoral tone. Be concise but meaningful.`,
        response_json_schema: {
          type: 'object',
          properties: {
            verses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  reference: { type: 'string', description: 'Bible verse reference like John 3:16' },
                  text: { type: 'string', description: 'The actual verse text' }
                },
                required: ['reference', 'text']
              },
              minItems: 3,
              maxItems: 3
            },
            encouragement: { type: 'string', description: 'Heartfelt encouragement message' },
            practical_step: { type: 'string', description: 'Practical suggestion for connecting with God' }
          },
          required: ['verses', 'encouragement', 'practical_step']
        }
      });

      if (response && response.verses) {
        setAiResponse(response);
      } else {
        throw new Error('Invalid response format');
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
      <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-none shadow-lg">
        <h3 className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
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
                  isSelected ? 'ring-2 ring-offset-2 ring-pink-400 scale-105' : 'hover:scale-105'
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
            className="flex-1 text-sm bg-white dark:bg-[#2d2d4a]"
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
            className="bg-pink-500 hover:bg-pink-600"
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
                  <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Finding verses for you...</span>
                </div>
              )}

              {!loading && aiResponse && (
                <div className="space-y-4 bg-white dark:bg-[#2d2d4a] rounded-xl p-4">
                  {/* Verses */}
                  <div>
                    <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-3 text-sm">Scripture for You</h4>
                    <div className="space-y-3">
                      {aiResponse.verses.map((verse, index) => (
                        <div key={index} className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border-l-4 border-amber-400">
                          <p className="font-medium text-xs text-amber-900 dark:text-amber-300 mb-1">{verse.reference}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">{verse.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Encouragement */}
                  <div>
                    <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-2 text-sm">A Word of Encouragement</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{aiResponse.encouragement}</p>
                  </div>

                  {/* Practical Step */}
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                    <h4 className="font-semibold text-pink-800 dark:text-pink-300 mb-2 text-sm">Try This Today</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{aiResponse.practical_step}</p>
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