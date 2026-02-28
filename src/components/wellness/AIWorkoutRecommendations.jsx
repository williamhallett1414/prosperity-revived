import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function AIWorkoutRecommendations() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    goal: 'muscle_gain',
    experience_level: 'intermediate',
    equipment: 'bodyweight',
    focus_area: 'full_body',
    additional_notes: ''
  });
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['workout-sessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 30),
    enabled: !!user
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    enabled: !!user
  });

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Analyze recent performance
      const recentSessions = sessions.slice(0, 10);
      const performanceSummary = recentSessions.map(s => ({
        date: s.date,
        workout: s.workout_title,
        feeling: s.overall_feeling,
        exercises: s.exercises_performed?.map(e => ({
          name: e.name,
          weight: e.weight_used,
          reps: e.reps_completed,
          sets: e.sets_completed
        }))
      }));

      const completedWorkouts = workouts.filter(w => w.completed_dates?.length > 0);

      const prompt = `As a professional fitness coach, analyze this user's workout data and provide personalized recommendations:

USER PROFILE:
- Goal: ${preferences.goal}
- Experience Level: ${preferences.experience_level}
- Available Equipment: ${preferences.equipment}
- Focus Area: ${preferences.focus_area}
${preferences.additional_notes ? `- Additional Notes: ${preferences.additional_notes}` : ''}

RECENT PERFORMANCE (Last 10 Sessions):
${JSON.stringify(performanceSummary, null, 2)}

CURRENT WORKOUT PLANS:
${completedWorkouts.map(w => `- ${w.title} (completed ${w.completed_dates.length} times)`).join('\n')}

Based on this data, provide:
1. Overall assessment of their current training
2. Specific recommendations for new workout plans (2-3 suggestions)
3. Modifications to existing workouts to optimize progress
4. Tips to prevent plateaus and improve performance
5. Recovery and rest day recommendations

Be specific, actionable, and encouraging.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            assessment: { type: 'string' },
            recommended_workouts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  difficulty: { type: 'string' },
                  duration_minutes: { type: 'number' },
                  focus: { type: 'string' },
                  why_recommended: { type: 'string' }
                }
              }
            },
            modifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  workout_name: { type: 'string' },
                  suggestion: { type: 'string' }
                }
              }
            },
            plateau_prevention_tips: { type: 'array', items: { type: 'string' } },
            recovery_advice: { type: 'string' }
          }
        }
      });

      setRecommendations(response);
    } catch (error) {
      console.error('Failed to generate recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-[#b89320] to-indigo-700 text-white rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold">AI Workout Coach</h3>
        </div>
        <p className="text-sm text-white/90 mb-4">
          Get personalized workout recommendations based on your performance and goals
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select value={preferences.goal} onValueChange={(v) => setPreferences({ ...preferences, goal: v })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="general_fitness">General Fitness</SelectItem>
              </SelectContent>
            </Select>

            <Select value={preferences.experience_level} onValueChange={(v) => setPreferences({ ...preferences, experience_level: v })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select value={preferences.equipment} onValueChange={(v) => setPreferences({ ...preferences, equipment: v })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                <SelectItem value="dumbbells">Dumbbells</SelectItem>
                <SelectItem value="full_gym">Full Gym</SelectItem>
                <SelectItem value="resistance_bands">Resistance Bands</SelectItem>
              </SelectContent>
            </Select>

            <Select value={preferences.focus_area} onValueChange={(v) => setPreferences({ ...preferences, focus_area: v })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_body">Full Body</SelectItem>
                <SelectItem value="upper_body">Upper Body</SelectItem>
                <SelectItem value="lower_body">Lower Body</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Any injuries, limitations, or specific requests?"
            value={preferences.additional_notes}
            onChange={(e) => setPreferences({ ...preferences, additional_notes: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-20"
          />

          <Button
            onClick={generateRecommendations}
            disabled={loading || sessions.length === 0}
            className="w-full bg-white text-[#8a6e1a] hover:bg-white/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>

          {sessions.length === 0 && (
            <p className="text-xs text-white/70 text-center">
              Log some workouts first to get personalized recommendations
            </p>
          )}
        </div>
      </div>

      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Assessment */}
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3C4E53]" />
              Performance Assessment
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{recommendations.assessment}</p>
          </div>

          {/* Recommended Workouts */}
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">Recommended Workouts</h3>
            <div className="space-y-3">
              {recommendations.recommended_workouts?.map((workout, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-[#1a1a2e] dark:text-white">{workout.title}</h4>
                    <span className="text-xs px-2 py-1 bg-[#FAD98D]/20 dark:bg-[#0A1A2F] text-[#3C4E53] dark:text-[#FAD98D] rounded">
                      {workout.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{workout.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>{workout.duration_minutes} min</span>
                    <span>•</span>
                    <span>{workout.focus}</span>
                  </div>
                  <div className="bg-[#FAD98D]/10 dark:bg-[#0A1A2F]/20 p-2 rounded">
                    <p className="text-xs text-[#3C4E53] dark:text-[#FAD98D]">
                      <strong>Why:</strong> {workout.why_recommended}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modifications */}
          {recommendations.modifications?.length > 0 && (
            <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">Workout Modifications</h3>
              <div className="space-y-2">
                {recommendations.modifications.map((mod, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Target className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-[#1a1a2e] dark:text-white">{mod.workout_name}:</span>
                      <span className="text-gray-600 dark:text-gray-400"> {mod.suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">Plateau Prevention Tips</h3>
            <ul className="space-y-2">
              {recommendations.plateau_prevention_tips?.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-emerald-600 font-bold">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Recovery */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Recovery Advice</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{recommendations.recovery_advice}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}