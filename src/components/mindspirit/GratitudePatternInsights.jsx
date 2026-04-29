import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function GratitudePatternInsights({ entries }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateInsights = async () => {
    if (entries.length < 3) return;
    setLoading(true);
    try {
      const sample = entries.slice(0, 15).map(e => e.content).join('\n---\n');
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze these gratitude journal entries and identify meaningful patterns, themes, and growth opportunities. Entries:\n\n${sample}\n\nProvide a warm, encouraging analysis. Return JSON with: { "themes": [string] (up to 4 recurring themes), "growth_areas": [string] (up to 3 areas where gratitude is growing), "reflection": string (2-3 sentence personalized observation), "encouragement": string (1 uplifting sentence) }`,
        response_json_schema: {
          type: 'object',
          properties: {
            themes: { type: 'array', items: { type: 'string' } },
            growth_areas: { type: 'array', items: { type: 'string' } },
            reflection: { type: 'string' },
            encouragement: { type: 'string' },
          },
        },
      });
      setInsights(res);
      setGenerated(true);
    } catch (e) {
      setInsights(null);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#FD9C2D]" />
        <h3 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">AI Pattern Insights</h3>
      </div>

      {entries.length < 3 ? (
        <p className="text-sm text-gray-400 dark:text-gray-300 text-center py-6">
          Write at least 3 entries to unlock AI pattern insights
        </p>
      ) : !generated ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
            Let AI analyze your {entries.length} entries to discover what you're most grateful for and how your gratitude is growing.
          </p>
          <Button
            onClick={generateInsights}
            disabled={loading}
            className="bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] text-white hover:opacity-90"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Analyze My Patterns</>
            )}
          </Button>
        </div>
      ) : insights ? (
        <div className="space-y-4">
          {insights.themes?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-300 uppercase tracking-wide mb-2">Recurring Themes</p>
              <div className="flex flex-wrap gap-2">
                {insights.themes.map((theme, i) => (
                  <span key={i} className="text-xs bg-[#FD9C2D]/10 text-[#FD9C2D] px-2.5 py-1 rounded-full font-medium">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {insights.growth_areas?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-300 uppercase tracking-wide mb-2">Areas of Growth</p>
              <div className="space-y-1.5">
                {insights.growth_areas.map((area, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                    <p className="text-sm text-[#0A1A2F]/80 dark:text-white/80">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.reflection && (
            <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-300 mb-1">Personalized Reflection</p>
              <p className="text-sm text-[#0A1A2F]/80 dark:text-white/80 leading-relaxed">{insights.reflection}</p>
            </div>
          )}

          {insights.encouragement && (
            <div className="bg-gradient-to-r from-[#FD9C2D]/10 to-[#FAD98D]/10 rounded-xl p-4 border border-[#FAD98D]/20">
              <p className="text-sm text-[#0A1A2F] dark:text-white font-medium italic">✨ {insights.encouragement}</p>
            </div>
          )}

          <Button
            onClick={generateInsights}
            disabled={loading}
            variant="outline"
            className="w-full text-sm border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh Analysis'}
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}