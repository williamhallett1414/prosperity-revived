import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Target, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function AIWellnessJourneyGenerator({ user, onJourneyCreated }) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [duration, setDuration] = useState(4);
  const [moodPatterns, setMoodPatterns] = useState('');
  const [energyLevels, setEnergyLevels] = useState('');
  const [granularGoals, setGranularGoals] = useState([
    { type: 'water_intake', description: '', target_value: 8, unit: 'glasses' }
  ]);

  const goalTypes = [
    { value: 'water_intake', label: 'Water Intake', defaultUnit: 'glasses' },
    { value: 'screen_time', label: 'Screen Time Reduction', defaultUnit: 'minutes' },
    { value: 'sleep_hours', label: 'Sleep Hours', defaultUnit: 'hours' },
    { value: 'meditation_minutes', label: 'Meditation Time', defaultUnit: 'minutes' },
    { value: 'step_count', label: 'Daily Steps', defaultUnit: 'steps' },
    { value: 'custom', label: 'Custom Goal', defaultUnit: '' }
  ];

  const addGoal = () => {
    setGranularGoals([...granularGoals, { type: 'water_intake', description: '', target_value: 0, unit: 'glasses' }]);
  };

  const removeGoal = (index) => {
    setGranularGoals(granularGoals.filter((_, i) => i !== index));
  };

  const updateGoal = (index, field, value) => {
    const updated = [...granularGoals];
    updated[index][field] = value;
    
    if (field === 'type') {
      const goalType = goalTypes.find(g => g.value === value);
      updated[index].unit = goalType?.defaultUnit || '';
    }
    
    setGranularGoals(updated);
  };

  const generateJourney = async () => {
    setGenerating(true);
    
    try {
      const goalsContext = granularGoals
        .filter(g => g.target_value > 0)
        .map(g => `${g.description || goalTypes.find(t => t.value === g.type)?.label}: ${g.target_value} ${g.unit}`)
        .join(', ');

      const prompt = `
You are an expert wellness coach. Create a comprehensive ${duration}-week wellness journey for this user.

User Profile:
- Spiritual Goal: ${user.spiritual_goal || 'Not set'}
- Spiritual Interests: ${user.spiritual_interests?.join(', ') || 'General'}
- Life Situations: ${user.life_situation?.join(', ') || 'None specified'}
- Fitness Level: ${user.fitness_level || 'beginner'}
- Health Goals: ${user.health_goals?.join(', ') || 'General wellness'}
- Dietary Preferences: ${user.dietary_preferences?.join(', ') || 'No restrictions'}

Additional Context:
- Mood Patterns: ${moodPatterns || 'Not specified'}
- Energy Levels: ${energyLevels || 'Not specified'}
- Specific Goals: ${goalsContext || 'Not specified'}

Create a holistic ${duration}-week journey that integrates:
1. Spiritual growth (Bible reading/study themes)
2. Physical fitness (workout progression)
3. Nutrition (healthy eating patterns)
4. Mental wellness (mood and energy management)

Requirements:
- Each week should build on the previous one
- Include a clear theme for each week that ties spiritual, physical, and nutritional aspects together
- Progression should be gradual and achievable
- Address their specific life situations, mood patterns, and goals
- Make it personal and encouraging
- Consider their energy levels when planning activities

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
  - journaling_prompts: Array of 3 reflective journaling prompts for the week related to their journey stage
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
                  },
                  journaling_prompts: {
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
        granular_goals: granularGoals
          .filter(g => g.target_value > 0)
          .map(g => ({
            ...g,
            current_value: 0,
            progress_percentage: 0
          })),
        mood_energy_tracking: [],
        exercise_feedback: [],
        recipe_feedback: [],
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
            <h3 className="font-semibold text-lg">My Workout Journey</h3>
            <p className="text-white/80 text-sm">Hyper-personalized multi-week program</p>
          </div>
        </div>
        
        <p className="text-white/90 mb-4 text-sm">
          Get a comprehensive journey combining spiritual growth, fitness, and nutrition tailored to your goals, mood patterns, and energy levels.
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Your Personalized Wellness Journey</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Duration Selection */}
            <div>
              <Label className="mb-3 block">Journey Duration</Label>
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

            {/* Mood & Energy Tracking */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="mood">Mood Patterns (Optional)</Label>
                <Textarea
                  id="mood"
                  placeholder="E.g., I feel energized in mornings but tired afternoons, or I experience anxiety on busy days..."
                  value={moodPatterns}
                  onChange={(e) => setMoodPatterns(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="energy">Energy Levels (Optional)</Label>
                <Textarea
                  id="energy"
                  placeholder="E.g., Low energy in the mornings, high energy after workouts, or consistent throughout the day..."
                  value={energyLevels}
                  onChange={(e) => setEnergyLevels(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            {/* Granular Goals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Specific Goals</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addGoal}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Goal
                </Button>
              </div>

              <div className="space-y-3">
                {granularGoals.map((goal, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Select
                        value={goal.type}
                        onValueChange={(value) => updateGoal(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {goalTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {goal.type === 'custom' && (
                        <Input
                          placeholder="Custom goal description"
                          value={goal.description}
                          onChange={(e) => updateGoal(index, 'description', e.target.value)}
                        />
                      )}

                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Target"
                          value={goal.target_value}
                          onChange={(e) => updateGoal(index, 'target_value', parseFloat(e.target.value) || 0)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Unit"
                          value={goal.unit}
                          onChange={(e) => updateGoal(index, 'unit', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeGoal(index)}
                      className="text-red-500"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* What You'll Get */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
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
                    <li>• AI journaling prompts for reflection</li>
                    <li>• Mood & energy tracking</li>
                    <li>• Feedback-based adaptations</li>
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