import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Zap, TrendingUp, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function HannahAIInsights({ messages, mood, emotionalTone, emotionalPatterns }) {
  const [activeSection, setActiveSection] = useState(null);
  const [suggestedExercises, setSuggestedExercises] = useState(null);
  const [journalPrompts, setJournalPrompts] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateExercises = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('analyzeHannahPatterns', {
        emotionalPatterns,
        recentConversations: messages.slice(-10)
      });
      setSuggestedExercises(response.data);
      setActiveSection('exercises');
    } catch (error) {
      toast.error('Failed to generate exercises');
    } finally {
      setLoading(false);
    }
  };

  const generatePrompts = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('generateJournalPrompts', {
        mood,
        emotionalTone,
        recentEntries: messages.slice(-5)
      });
      setJournalPrompts(response.data);
      setActiveSection('prompts');
    } catch (error) {
      toast.error('Failed to generate prompts');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('generateHannahProgressSummary', {
        conversations: messages,
        journalEntries: messages.filter(m => m.role === 'user'),
        period: 'week'
      });
      setProgressSummary(response.data);
      setActiveSection('summary');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 pt-4 border-t border-purple-100">
      <p className="text-xs text-purple-900/60 font-medium">AI Insights:</p>
      
      <div className="grid grid-cols-1 gap-2">
        {/* Personalized Exercises */}
        <motion.button
          onClick={generateExercises}
          disabled={loading}
          className="text-left text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-800 transition-colors border border-purple-200 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          <Zap className="w-3 h-3" />
          Personalized Exercises
        </motion.button>

        {/* Journaling Prompts */}
        <motion.button
          onClick={generatePrompts}
          disabled={loading}
          className="text-left text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-800 transition-colors border border-purple-200 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          <Lightbulb className="w-3 h-3" />
          Journaling Prompts
        </motion.button>

        {/* Progress Summary */}
        <motion.button
          onClick={generateSummary}
          disabled={loading || messages.length < 5}
          className="text-left text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-800 transition-colors border border-purple-200 flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          <TrendingUp className="w-3 h-3" />
          Progress Summary
        </motion.button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {activeSection === 'exercises' && suggestedExercises && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 text-xs space-y-2"
          >
            <p className="font-semibold text-gray-800">Suggested Exercises:</p>
            {suggestedExercises.exercises?.map((exercise, idx) => (
              <div key={idx} className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-800">{exercise.name}</p>
                <p className="text-gray-600 text-xs mt-1">{exercise.relevance}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeSection === 'prompts' && journalPrompts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 text-xs space-y-2"
          >
            <p className="font-semibold text-gray-800">Journal Prompts:</p>
            {journalPrompts.prompts?.map((p, idx) => (
              <div key={idx} className="bg-white p-2 rounded border border-purple-100">
                <p className="text-gray-800">{p.prompt}</p>
                <p className="text-gray-500 text-xs mt-1 italic">{p.purpose}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeSection === 'summary' && progressSummary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 text-xs space-y-2"
          >
            <p className="font-semibold text-gray-800">Your Progress:</p>
            <p className="text-gray-700 leading-relaxed">{progressSummary.summary}</p>
            {progressSummary.keyThemes?.length > 0 && (
              <div>
                <p className="font-medium text-gray-800 mt-2">Key Themes:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {progressSummary.keyThemes.map((theme, idx) => (
                    <li key={idx}>{theme}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}