import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Calendar, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AIWellnessJourneyGenerator({ user, onJourneyCreated }) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [duration, setDuration] = useState(4);

  const generateJourney = async () => {
    setGenerating(true);
    
    try {
      const prompt = `
You are an expert wellness coach. Create a comprehensive ${duration}-week wellness journey for this user.

User Profile:
- Spiritual Goal: ${user.spiritual_goal || 'Not set'}
- Spiritual Interests: ${user.spiritual_interests?.join(', ') || 'General'}
- Life Situations: ${user.life_situation?.join(', ') || 'None specified'}
- Fitness Level: ${user.fitness_level || 'beginner'}
- Health Goals: ${user.health_goals?.join(', ') || 'General wellness'}
- Dietary Preferences: ${user.dietary_preferences?.join(', ') || 'No restrictions'}

Create a holistic ${duration}-week journey that integrates:
1. Spiritual growth (Bible reading/study themes)
2. Physical fitness (workout progression)
3. Nutrition (healthy eating patterns)

Requirements:
- Each week should build on the previous one
- Include a clear theme for each week that ties spiritual, physical, and nutritional aspects together
- Progression should be gradual and achievable
- Address their specific life situations and goals
- Make it personal and encouraging

Return JSON with:
- title: Compelling journey name (4-6 words)
- description: What they'll achieve (2-3 sentences)
- goals: Array of 3-4 specific, measurable goals
- weeks: Array of ${duration} week objects, each with:
  - week_number: 1 to ${duration}
  - theme: Weekly theme (e.g., "Building Foundation", "Strengthening Faith & Body")
  - spiritual_focus: What spiritual aspect to focus on
  - workout_focus: What physical aspect to work on
  - nutrition_focus: What nutritional aspect to emphasize
  - daily_commitment: Specific daily actions (2-3)
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            goals: {
              type: 'array',
              items: { type: 'string' }
            },
            weeks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  week_number: { type: 'number' },
                  theme: { type: 'string' },
                  spiritual_focus: { type: 'string' },
                  workout_focus: { type: 'string' },
                  nutrition_focus: { type: 'string' },
                  daily_commitment: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      });

      // Create the journey
      const journey = await base44.entities.WellnessJourney.create({
        title: result.title,
        description: result.description,
        duration_weeks: duration,
        current_week: 1,
        weeks: result.weeks.map(w => ({
          ...w,
          completed: false,
          reading_plan_id: null,
          recipe_ids: [],
          workout_ids: []
        })),
        goals: result.goals,
        progress_percentage: 0,
        is_active: true,
        feedback_notes: [],
        adaptations: []
      });

      setShowGenerator(false);
      onJourneyCreated?.(journey);
    } catch (error) {
      console.error('Failed to generate journey:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">AI Wellness Journey</h3>
            <p className="text-white/80 text-sm">Personalized multi-week program</p>
          </div>
        </div>
        
        <p className="text-white/90 mb-4 text-sm">
          Get a comprehensive journey combining spiritual growth, fitness, and nutrition tailored to your goals.
        </p>
        
        <Button
          onClick={() => setShowGenerator(true)}
          className="w-full bg-white text-purple-600 hover:bg-white/90"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate My Journey
        </Button>
      </motion.div>

      <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Wellness Journey</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Journey Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[4, 6, 8].map(weeks => (
                  <button
                    key={weeks}
                    onClick={() => setDuration(weeks)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      duration === weeks
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl font-bold text-purple-600">{weeks}</div>
                    <div className="text-xs text-gray-600">weeks</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    What You'll Get
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Weekly spiritual reading themes</li>
                    <li>• Progressive workout plans</li>
                    <li>• Nutrition guidance & recipes</li>
                    <li>• Daily action commitments</li>
                    <li>• AI-adapted based on progress</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={generateJourney}
              disabled={generating || !user?.onboarding_completed}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Your Journey...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Journey
                </>
              )}
            </Button>

            {!user?.onboarding_completed && (
              <p className="text-xs text-amber-600 text-center">
                Complete onboarding first to get personalized recommendations
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}