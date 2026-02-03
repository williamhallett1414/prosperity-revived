import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AIEncouragement({ journalEntries, goals }) {
  const [encouragement, setEncouragement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    // Auto-generate on first load if user has entries or goals
    if (!hasGenerated && (journalEntries.length > 0 || goals.length > 0)) {
      generateEncouragement();
      setHasGenerated(true);
    }
  }, [journalEntries, goals]);

  const generateEncouragement = async () => {
    setLoading(true);
    try {
      const recentEntries = journalEntries.slice(0, 3);
      const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3);

      const context = {
        hasJournalEntries: recentEntries.length > 0,
        journalMoods: recentEntries.map(e => e.mood),
        prayerTypes: recentEntries.map(e => e.prayer_type),
        hasGoals: activeGoals.length > 0,
        goalCategories: activeGoals.map(g => g.category),
        goalProgress: activeGoals.map(g => ({ title: g.title, progress: g.progress || 0 }))
      };

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this spiritual growth data: ${JSON.stringify(context)}, provide personalized encouragement, accountability, and actionable next steps for their faith journey. Be warm, faith-filled, and practical. Include a relevant Bible verse.`,
        response_json_schema: {
          type: "object",
          properties: {
            encouragement: { type: "string" },
            accountability_note: { type: "string" },
            next_step: { type: "string" },
            verse: {
              type: "object",
              properties: {
                reference: { type: "string" },
                text: { type: "string" }
              }
            }
          }
        }
      });
      
      setEncouragement(result);
    } catch (error) {
      console.error('Failed to generate encouragement', error);
    }
    setLoading(false);
  };

  if (!encouragement && !loading) {
    return (
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4a] rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[#c9a227]" />
          <h3 className="font-semibold">Daily AI Encouragement</h3>
        </div>
        <p className="text-white/80 text-sm mb-4">
          Get personalized spiritual encouragement based on your journal and goals
        </p>
        <Button
          onClick={generateEncouragement}
          className="w-full bg-[#c9a227] hover:bg-[#b89320] text-white"
        >
          Generate Encouragement
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4a] rounded-2xl p-5 text-white mb-6"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#c9a227]" />
          </div>
        ) : encouragement ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c9a227]" />
                <h3 className="font-semibold">Your Daily Encouragement</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateEncouragement}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-[#c9a227]" />
                  <p className="text-xs font-semibold text-[#c9a227]">Encouragement</p>
                </div>
                <p className="text-sm text-white/90">{encouragement.encouragement}</p>
              </div>

              {encouragement.accountability_note && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#c9a227]" />
                    <p className="text-xs font-semibold text-[#c9a227]">Accountability</p>
                  </div>
                  <p className="text-sm text-white/90">{encouragement.accountability_note}</p>
                </div>
              )}

              {encouragement.next_step && (
                <div className="bg-[#c9a227]/20 border border-[#c9a227]/50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-[#c9a227] mb-1">Next Step:</p>
                  <p className="text-sm text-white">{encouragement.next_step}</p>
                </div>
              )}

              {encouragement.verse && (
                <div className="border-l-4 border-[#c9a227] pl-3 py-1">
                  <p className="text-sm italic text-white/90 mb-1">"{encouragement.verse.text}"</p>
                  <p className="text-xs text-[#c9a227]">— {encouragement.verse.reference}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}