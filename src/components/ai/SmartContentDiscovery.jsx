import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SmartContentDiscovery({ user, context = 'dashboard' }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (!user?.onboarding_completed) return;
    
    setLoading(true);
    
    try {
      const prompt = `
You are a spiritual wellness advisor. Analyze this user's profile and provide 2-3 actionable, specific insights or suggestions.

User Profile:
- Spiritual Goal: ${user.spiritual_goal || 'Not set'}
- Spiritual Interests: ${user.spiritual_interests?.join(', ') || 'Not specified'}
- Life Situations: ${user.life_situation?.join(', ') || 'None specified'}
- Health Goals: ${user.health_goals?.join(', ') || 'Not specified'}
- Fitness Level: ${user.fitness_level || 'Not specified'}

Context: ${context}

Provide insights that:
1. Connect their spiritual journey with practical wellness actions
2. Address their current life situations with relevant resources
3. Suggest small, achievable next steps
4. Feel personal and encouraging (use "you" language)

Each insight should be:
- title: Short, action-oriented (4-6 words)
- message: Encouraging 2-3 sentences explaining the insight
- action: Specific thing they can do today
- icon_emoji: Single relevant emoji

Return 2-3 high-impact insights as JSON.
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            insights: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  message: { type: 'string' },
                  action: { type: 'string' },
                  icon_emoji: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setInsights(result.insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.onboarding_completed && !insights) {
      generateInsights();
    }
  }, [user]);

  if (!user?.onboarding_completed) return null;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 mb-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold">Your Personal Insights</h3>
        </div>
        <Button
          onClick={generateInsights}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {loading && !insights ? (
        <div className="py-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-white/80">Analyzing your journey...</p>
        </div>
      ) : insights ? (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon_emoji}</span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-white/90 mb-2">{insight.message}</p>
                  <p className="text-xs bg-white/20 rounded-lg px-3 py-1 inline-block">
                    ✓ {insight.action}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  );
}