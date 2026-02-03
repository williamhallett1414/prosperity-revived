import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AISuggestions({ userPlans, onPostClick }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (userPlans.length > 0 && !dismissed) {
      generateSuggestions();
    }
  }, [userPlans]);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const planNames = userPlans.map(p => p.plan_name).join(', ');
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on someone reading these Bible plans: ${planNames}, suggest 2-3 relevant community discussion topics they might be interested in. Keep each suggestion under 60 characters.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  topic: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setSuggestions(result.suggestions.slice(0, 3));
    } catch (error) {
      console.error('Failed to generate suggestions', error);
    }
    setLoading(false);
  };

  if (dismissed || userPlans.length === 0) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4a] rounded-2xl p-4 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227] opacity-10 rounded-full -mr-16 -mt-16" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#c9a227]" />
            <h3 className="text-white font-semibold">AI Suggestions</h3>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-white/70 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Finding relevant discussions...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-white/80 text-sm mb-3">
                Based on your reading plans, you might enjoy these topics:
              </p>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <p className="text-white font-medium text-sm">{suggestion.topic}</p>
                  <p className="text-white/60 text-xs mt-1">{suggestion.reason}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}