import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Dumbbell, Target, Clock, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function FitnessJourneyBuilderPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [journeyData, setJourneyData] = useState({
    goals: [],
    experienceLevel: '',
    equipment: [],
    preferredStyle: '',
    weeklySchedule: 3,
    timeAvailability: 30,
    moodPatterns: ''
  });

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const goals = [
    { value: 'weight_loss', label: 'Lose Weight', icon: Target },
    { value: 'muscle_gain', label: 'Build Muscle', icon: Dumbbell },
    { value: 'endurance', label: 'Improve Endurance', icon: Zap },
    { value: 'flexibility', label: 'Increase Flexibility', icon: Sparkles },
    { value: 'general_fitness', label: 'General Fitness', icon: Calendar }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', desc: 'New to fitness' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
    { value: 'advanced', label: 'Advanced', desc: 'Very experienced' }
  ];

  const equipmentOptions = [
    { value: 'none', label: 'No Equipment' },
    { value: 'dumbbells', label: 'Dumbbells' },
    { value: 'resistance_bands', label: 'Resistance Bands' },
    { value: 'full_gym', label: 'Full Gym Access' }
  ];

  const workoutStyles = [
    { value: 'hiit', label: 'HIIT', desc: 'High intensity intervals' },
    { value: 'strength', label: 'Strength Training', desc: 'Build muscle' },
    { value: 'cardio', label: 'Cardio', desc: 'Endurance focus' },
    { value: 'yoga', label: 'Yoga/Flexibility', desc: 'Stretch and flow' },
    { value: 'mixed', label: 'Mixed', desc: 'Variety of styles' }
  ];

  const handleGenerateJourney = async () => {
    if (!journeyData.goals.length || !journeyData.experienceLevel || !journeyData.preferredStyle) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate journey using AI
      const prompt = `Create a personalized 4-week fitness journey for a ${journeyData.experienceLevel} with the following details:
Goals: ${journeyData.goals.join(', ')}
Equipment: ${journeyData.equipment.join(', ')}
Preferred Style: ${journeyData.preferredStyle}
Weekly Schedule: ${journeyData.weeklySchedule} days per week
Time Availability: ${journeyData.timeAvailability} minutes per session
Mood/Energy: ${journeyData.moodPatterns || 'Not specified'}

Provide a structured 4-week plan with:
- Weekly themes and focus areas
- Daily workout recommendations
- Progressive difficulty
- Rest days strategically placed

Return ONLY valid JSON with this exact structure:
{
  "title": "Journey title",
  "description": "Brief description",
  "duration_weeks": 4,
  "weekly_plans": [
    {
      "week": 1,
      "theme": "Week theme",
      "workouts": [
        {"day": 1, "title": "Workout name", "type": "cardio/strength/etc", "duration": 30},
        ...
      ]
    },
    ...
  ]
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            duration_weeks: { type: 'number' },
            weekly_plans: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  week: { type: 'number' },
                  theme: { type: 'string' },
                  workouts: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        day: { type: 'number' },
                        title: { type: 'string' },
                        type: { type: 'string' },
                        duration: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Save journey to backend
      await base44.entities.WellnessJourney.create({
        title: response.title,
        description: response.description,
        duration_weeks: response.duration_weeks,
        weekly_plans: response.weekly_plans,
        goals: journeyData.goals,
        experience_level: journeyData.experienceLevel,
        equipment: journeyData.equipment,
        preferred_style: journeyData.preferredStyle,
        weekly_schedule: journeyData.weeklySchedule,
        time_availability: journeyData.timeAvailability,
        current_week: 1,
        current_day: 1,
        is_active: true,
        completed_workouts: []
      });

      toast.success('Journey created successfully!');
      navigate(createPageUrl('MyFitnessJourneyPage'));
    } catch (error) {
      console.error('Failed to generate journey:', error);
      toast.error('Failed to create journey. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleGoal = (goal) => {
    setJourneyData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const toggleEquipment = (equipment) => {
    setJourneyData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(createPageUrl('Wellness'))}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </button>
          <h1 className="text-lg font-bold text-[#0A1A2F]">Build Your Journey</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#0A1A2F]/60">Step {step} of 5</span>
            <span className="text-sm text-[#0A1A2F]/60">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D9B878] transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Goals */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">What are your fitness goals?</h2>
              <p className="text-sm text-[#0A1A2F]/60">Select all that apply</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = journeyData.goals.includes(goal.value);
                return (
                  <button
                    key={goal.value}
                    onClick={() => toggleGoal(goal.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-[#D9B878] bg-[#D9B878]/10'
                        : 'border-gray-200 bg-white hover:border-[#D9B878]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-[#D9B878]' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-semibold text-[#0A1A2F]">{goal.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={journeyData.goals.length === 0}
              className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90 h-12"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* Step 2: Experience Level */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">What's your experience level?</h2>
              <p className="text-sm text-[#0A1A2F]/60">Choose one</p>
            </div>

            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setJourneyData(prev => ({ ...prev, experienceLevel: level.value }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    journeyData.experienceLevel === level.value
                      ? 'border-[#D9B878] bg-[#D9B878]/10'
                      : 'border-gray-200 bg-white hover:border-[#D9B878]/50'
                  }`}
                >
                  <div className="font-semibold text-[#0A1A2F] mb-1">{level.label}</div>
                  <div className="text-sm text-[#0A1A2F]/60">{level.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!journeyData.experienceLevel}
                className="flex-1 bg-[#D9B878] hover:bg-[#D9B878]/90 h-12"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Equipment */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">What equipment do you have?</h2>
              <p className="text-sm text-[#0A1A2F]/60">Select all that apply</p>
            </div>

            <div className="space-y-3">
              {equipmentOptions.map((equipment) => {
                const isSelected = journeyData.equipment.includes(equipment.value);
                return (
                  <button
                    key={equipment.value}
                    onClick={() => toggleEquipment(equipment.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-[#D9B878] bg-[#D9B878]/10'
                        : 'border-gray-200 bg-white hover:border-[#D9B878]/50'
                    }`}
                  >
                    <div className="font-semibold text-[#0A1A2F]">{equipment.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={journeyData.equipment.length === 0}
                className="flex-1 bg-[#D9B878] hover:bg-[#D9B878]/90 h-12"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Workout Style */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">What's your preferred workout style?</h2>
              <p className="text-sm text-[#0A1A2F]/60">Choose one</p>
            </div>

            <div className="space-y-3">
              {workoutStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setJourneyData(prev => ({ ...prev, preferredStyle: style.value }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    journeyData.preferredStyle === style.value
                      ? 'border-[#D9B878] bg-[#D9B878]/10'
                      : 'border-gray-200 bg-white hover:border-[#D9B878]/50'
                  }`}
                >
                  <div className="font-semibold text-[#0A1A2F] mb-1">{style.label}</div>
                  <div className="text-sm text-[#0A1A2F]/60">{style.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(5)}
                disabled={!journeyData.preferredStyle}
                className="flex-1 bg-[#D9B878] hover:bg-[#D9B878]/90 h-12"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Schedule & Time */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">Final details</h2>
              <p className="text-sm text-[#0A1A2F]/60">Set your schedule and time availability</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A1A2F] mb-3">
                  Days per week: {journeyData.weeklySchedule}
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={journeyData.weeklySchedule}
                  onChange={(e) => setJourneyData(prev => ({ ...prev, weeklySchedule: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#0A1A2F]/60 mt-1">
                  <span>1 day</span>
                  <span>7 days</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0A1A2F] mb-3">
                  Minutes per session: {journeyData.timeAvailability}
                </label>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={journeyData.timeAvailability}
                  onChange={(e) => setJourneyData(prev => ({ ...prev, timeAvailability: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#0A1A2F]/60 mt-1">
                  <span>15 min</span>
                  <span>90 min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0A1A2F] mb-2">
                  Mood/Energy Patterns (Optional)
                </label>
                <textarea
                  value={journeyData.moodPatterns}
                  onChange={(e) => setJourneyData(prev => ({ ...prev, moodPatterns: e.target.value }))}
                  placeholder="E.g., Low energy in mornings, prefer high-energy evening workouts..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(4)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleGenerateJourney}
                disabled={isGenerating}
                className="flex-1 bg-[#D9B878] hover:bg-[#D9B878]/90 h-12"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate My Journey
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}