import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, Heart, Zap, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { analyzeJournalPatterns, generatePatternBasedIntervention } from './HannahPatternAnalyzer';

export default function ProactiveCoachingPanel({ user, onSelectTopic, onClose }) {
  const [intervention, setIntervention] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      loadPatterns();
    }
  }, [user?.email]);

  const loadPatterns = async () => {
    setIsLoading(true);
    try {
      const analyzedPatterns = await analyzeJournalPatterns(base44, user.email);
      setPatterns(analyzedPatterns);
      
      const intervention = generatePatternBasedIntervention(analyzedPatterns);
      setIntervention(intervention);
    } catch (error) {
      console.log('Loading patterns...');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!intervention) {
    return null;
  }

  const emotionIcons = {
    anxiety: '😰',
    grief: '💔',
    overwhelm: '😓',
    hopelessness: '😔',
    gratitude: '🙏',
    joy: '😄',
    uncertainty: '❓',
    sadness: '😢',
    anger: '😤',
    confidence: '💪'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        <div className="text-2xl">{emotionIcons[intervention.emotion] || '💡'}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Personalized Coaching Insight
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Based on your recent reflections
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <p className="text-sm leading-relaxed text-gray-800">
            {intervention.suggestion}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <p className="text-gray-600">Primary emotion</p>
            <p className="font-semibold text-purple-700 mt-1 capitalize">
              {intervention.emotion}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <p className="text-gray-600">Trend</p>
            <p className={`font-semibold mt-1 ${
              intervention.trendDirection === 'improving' ? 'text-green-700' :
              intervention.trendDirection === 'declining' ? 'text-red-700' :
              'text-blue-700'
            }`}>
              {intervention.trendDirection === 'improving' ? '↑ Improving' :
               intervention.trendDirection === 'declining' ? '↓ Declining' :
               '→ Stable'}
            </p>
          </div>
        </div>

        {intervention.themes.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">Key themes in your reflections:</p>
            <div className="flex flex-wrap gap-2">
              {intervention.themes.map(theme => (
                <span
                  key={theme}
                  className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => {
            onSelectTopic(`Help me with ${intervention.topicSuggestion}: `);
            onClose();
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Explore This Together
        </Button>
      </div>
    </motion.div>
  );
}