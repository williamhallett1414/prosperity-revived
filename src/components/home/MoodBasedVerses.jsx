import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

const moodOptions = [
  { label: '😊 Grateful', value: 'grateful' },
  { label: '😔 Sad', value: 'sad' },
  { label: '😰 Anxious', value: 'anxious' },
  { label: '😡 Frustrated', value: 'frustrated' },
  { label: '😌 Peaceful', value: 'peaceful' },
  { label: '💪 Motivated', value: 'motivated' },
  { label: '😓 Overwhelmed', value: 'overwhelmed' },
  { label: '🙏 Seeking Guidance', value: 'seeking' }
];

export default function MoodBasedVerses() {
  const [selectedMood, setSelectedMood] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const input = customInput || selectedMood;
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Someone is feeling: "${input}". Provide 2-3 relevant Bible verses with references and brief words of encouragement. Be empathetic and faith-focused.`,
        response_json_schema: {
          type: "object",
          properties: {
            verses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  reference: { type: "string" },
                  text: { type: "string" },
                  encouragement: { type: "string" }
                }
              }
            },
            overall_message: { type: "string" }
          }
        }
      });
      setSuggestions(result);
    } catch (error) {
      console.error('Failed to get suggestions', error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSuggestions(null);
    setSelectedMood('');
    setCustomInput('');
    setShowInput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#c9a227]" />
        <h3 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">How are you feeling today?</h3>
      </div>

      {!suggestions ? (
        <>
          {!showInput ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      selectedMood === mood.value
                        ? 'bg-[#0A1A2F] text-white'
                        : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:bg-white/5'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowInput(true)}
                className="w-full"
              >
                Or describe your situation...
              </Button>

              {selectedMood && (
                <Button
                  onClick={getSuggestions}
                  disabled={loading}
                  className="w-full bg-[#c9a227] hover:bg-[#C9A227] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finding verses...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Get Bible Verses
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                placeholder="Describe how you're feeling or what you're going through..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowInput(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={getSuggestions}
                  disabled={!customInput.trim() || loading}
                  className="flex-1 bg-[#c9a227] hover:bg-[#C9A227] text-white"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Get Verses'
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-[#F2F6FA] to-[#F2F6FA] rounded-xl p-4 border-l-4 border-[#c9a227]">
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {suggestions.overall_message}
              </p>
            </div>

            {suggestions.verses.map((verse, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4"
              >
                <p className="font-serif text-gray-800 dark:text-gray-100 leading-relaxed mb-2">
                  "{verse.text}"
                </p>
                <p className="text-sm font-semibold text-[#c9a227] mb-2">
                  — {verse.reference}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  {verse.encouragement}
                </p>
              </motion.div>
            ))}

            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full"
            >
              Try Again
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}