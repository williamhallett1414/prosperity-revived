import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, BookOpen, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { analyzeJournalPatterns } from './HannahPatternAnalyzer';

export default function JournalThemeExplorer({ user, onSelectExercise }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [patterns, setPatterns] = useState(null);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [exercises, setExercises] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExercises, setShowExercises] = useState(false);

  useEffect(() => {
    if (user?.email && isExpanded && !patterns) {
      loadPatterns();
    }
  }, [isExpanded, user?.email, patterns]);

  const loadPatterns = async () => {
    try {
      const analyzedPatterns = await analyzeJournalPatterns(base44, user.email);
      setPatterns(analyzedPatterns);
    } catch (error) {
      console.log('Loading patterns...');
    }
  };

  const generateExercises = async () => {
    if (selectedThemes.length === 0 && selectedEmotions.length === 0) {
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Create 3 personalized guided journaling exercises based on these selections:
Themes: ${selectedThemes.join(', ') || 'none selected'}
Emotions: ${selectedEmotions.join(', ') || 'none selected'}

For each exercise, provide:
1. A clear title
2. A 2-3 sentence introduction explaining the purpose
3. Step-by-step instructions (4-6 steps)
4. A reflection question to close with

Format each exercise with clear separators. Make them actionable and emotionally intelligent, designed to help someone explore these themes deeply.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setExercises(response);
      setShowExercises(true);
    } catch (error) {
      console.log('Generating exercises...');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTheme = (theme) => {
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  if (!patterns || patterns.emotionalPatterns.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors border border-amber-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-gray-900">Explore Your Themes & Emotions</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white border border-t-0 border-amber-200 rounded-b-lg space-y-4">
              {/* Emotions Selection */}
              {patterns.emotionalPatterns.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Emotions from Your Reflections
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {patterns.emotionalPatterns.map(({ emotion }) => (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotion(emotion)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedEmotions.includes(emotion)
                            ? 'bg-red-500 text-white ring-2 ring-red-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Themes Selection */}
              {patterns.keyThemes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Life Themes in Your Entries
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {patterns.keyThemes.map(({ theme }) => (
                      <button
                        key={theme}
                        onClick={() => toggleTheme(theme)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedThemes.includes(theme)
                            ? 'bg-[#F2F6FA]0 text-white ring-2 ring-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Count */}
              {(selectedThemes.length > 0 || selectedEmotions.length > 0) && (
                <div className="text-sm text-gray-600">
                  {selectedThemes.length + selectedEmotions.length} selected
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateExercises}
                disabled={
                  isGenerating ||
                  (selectedThemes.length === 0 && selectedEmotions.length === 0)
                }
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Exercises...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Tailored Exercises
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercises Display */}
      <AnimatePresence>
        {showExercises && exercises && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 bg-gradient-to-br from-[#FAD98D]/10 to-[#F2F6FA] rounded-lg p-5 border border-[#D9B878]/40"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#8a6e1a]" />
              <h3 className="font-bold text-gray-900">Your Personalized Exercises</h3>
            </div>

            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
              {exercises}
            </div>

            <Button
              onClick={() => {
                onSelectExercise?.(exercises);
                setShowExercises(false);
              }}
              className="w-full mt-4 bg-gradient-to-r from-[#b89320] to-[#D9B878] hover:from-[#b89320] hover:to-[#D9B878] text-white"
              size="sm"
            >
              Explore These Exercises with Hannah
            </Button>

            <button
              onClick={() => setShowExercises(false)}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}