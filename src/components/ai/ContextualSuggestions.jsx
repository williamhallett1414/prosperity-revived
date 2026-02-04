import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContextualSuggestions({ 
  user, 
  currentContext, 
  onSuggestionClick 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.onboarding_completed && currentContext) {
      generateSuggestions();
    }
  }, [user, currentContext]);

  const generateSuggestions = async () => {
    setLoading(true);
    
    try {
      const prompt = `
Based on this context, provide 3 specific, actionable micro-suggestions:

User Context:
- Current Activity: ${currentContext.activity}
- Spiritual Interests: ${user.spiritual_interests?.join(', ') || 'Not set'}
- Life Situations: ${user.life_situation?.join(', ') || 'None'}
- Recent Goal: ${user.spiritual_goal || 'Not set'}

Examples of good suggestions:
- "Try a 5-minute gratitude prayer before bed"
- "Journal about one blessing from today"
- "Share an encouraging word with a friend"

Requirements:
- Each suggestion should take 5-15 minutes max
- Be specific and actionable TODAY
- Connect to their spiritual/wellness journey
- Feel natural and encouraging

Return as array of strings (just the suggestion text).
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      });

      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.onboarding_completed || loading || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-600" />
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">Quick Ideas For You</h4>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick?.(suggestion)}
            className="w-full text-left text-sm text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg p-2 transition-colors"
          >
            • {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
}