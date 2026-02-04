import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Loader2, Play, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIGuidedMeditationGenerator({ isOpen, onClose, user }) {
  const [mood, setMood] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(5);
  const [focusArea, setFocusArea] = useState('general');
  const [duration, setDuration] = useState(10);
  const [additionalContext, setAdditionalContext] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  
  const queryClient = useQueryClient();

  const { data: journeys = [] } = useQuery({
    queryKey: ['journeys'],
    queryFn: () => base44.entities.WellnessJourney.list(),
    enabled: !!user
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.find(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const activeJourney = journeys.find(j => j.is_active && j.created_by === user?.email);

  const generateMeditation = async () => {
    setIsGenerating(true);
    try {
      const context = {
        user_name: user?.full_name?.split(' ')[0] || 'friend',
        spiritual_goal: user?.spiritual_goal,
        health_goals: user?.health_goals,
        current_streak: userProgress?.current_streak || 0,
        mood_history: activeJourney?.mood_energy_tracking?.slice(-5),
        recent_challenges: additionalContext
      };

      const prompt = `Create a personalized guided meditation script for someone with the following context:

USER PROFILE:
- Name: ${context.user_name}
- Spiritual Goal: ${context.spiritual_goal || 'general wellness'}
- Current Mood: ${mood}
- Stress Level: ${stressLevel}/10
- Focus Area: ${focusArea}
- Additional Context: ${additionalContext || 'none'}

SESSION PARAMETERS:
- Duration: ${duration} minutes
- Type: Guided meditation

REQUIREMENTS:
1. Create a warm, welcoming opening that acknowledges their current state
2. Include breathing exercises appropriate for their stress level
3. Guide them through visualization or body awareness based on their focus area
4. Incorporate elements of their spiritual journey when relevant
5. Provide actionable mindfulness techniques they can use throughout the day
6. End with a peaceful closing and gentle affirmation

FOCUS AREAS GUIDE:
- Stress Relief: Deep breathing, progressive relaxation, releasing tension
- Anxiety: Grounding techniques, present moment awareness, safety affirmations
- Sleep: Body scan, calming visualization, letting go of the day
- Focus: Attention training, clarity visualization, mental sharpening
- Gratitude: Appreciation reflection, heart-centered awareness
- Spiritual Connection: Prayer elements, scripture reflection, divine presence
- Energy: Invigorating breath, movement visualization, awakening body
- General: Balanced approach with breathing, body awareness, and peace

The script should be conversational, warm, and take approximately ${duration} minutes when spoken aloud.
Include natural pauses indicated by "..." 
Use second person ("you") to guide them directly.
Make it deeply personal and relevant to their stated context.

Return ONLY the meditation script, no additional formatting or explanation.`;

      const script = await base44.integrations.Core.InvokeLLM({ prompt });
      
      // Generate a title
      const titlePrompt = `Based on this meditation focus: ${focusArea}, mood: ${mood}, create a short, inspiring title (max 6 words). Return only the title.`;
      const title = await base44.integrations.Core.InvokeLLM({ prompt: titlePrompt });
      
      setGeneratedScript(script);
      setGeneratedTitle(title.trim());
    } catch (error) {
      console.error('Failed to generate meditation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveMeditation = useMutation({
    mutationFn: () => base44.entities.Meditation.create({
      title: generatedTitle,
      type: 'meditation',
      duration_minutes: duration,
      script: generatedScript,
      category: focusArea
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['meditations']);
      onClose();
      setGeneratedScript('');
      setGeneratedTitle('');
    }
  });

  const moods = [
    { value: 'anxious', label: 'Anxious 😰', color: 'text-red-600' },
    { value: 'stressed', label: 'Stressed 😫', color: 'text-orange-600' },
    { value: 'tired', label: 'Tired 😴', color: 'text-blue-600' },
    { value: 'neutral', label: 'Neutral 😐', color: 'text-gray-600' },
    { value: 'calm', label: 'Calm 😌', color: 'text-green-600' },
    { value: 'energized', label: 'Energized 🤩', color: 'text-yellow-600' },
    { value: 'grateful', label: 'Grateful 🙏', color: 'text-purple-600' }
  ];

  const focusAreas = [
    { value: 'stress_relief', label: 'Stress Relief' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'focus', label: 'Focus & Clarity' },
    { value: 'gratitude', label: 'Gratitude' },
    { value: 'spiritual_connection', label: 'Spiritual Connection' },
    { value: 'energy', label: 'Energy & Motivation' },
    { value: 'general', label: 'General Wellness' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Guided Meditation Generator
          </DialogTitle>
        </DialogHeader>

        {!generatedScript ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Share how you're feeling, and I'll create a personalized meditation just for you. ✨
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                How are you feeling right now?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {moods.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      mood === m.value
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${m.color}`}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Stress Level: {stressLevel}/10
              </label>
              <Slider
                value={[stressLevel]}
                onValueChange={([value]) => setStressLevel(value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Calm</span>
                <span>Very Stressed</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                What would you like to focus on?
              </label>
              <Select value={focusArea} onValueChange={setFocusArea}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {focusAreas.map(area => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Duration: {duration} minutes
              </label>
              <Slider
                value={[duration]}
                onValueChange={([value]) => setDuration(value)}
                min={3}
                max={30}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Anything specific on your mind? (optional)
              </label>
              <Textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g., 'Dealing with work pressure', 'Struggling with patience', 'Need to let go of worry'..."
                rows={3}
              />
            </div>

            <Button
              onClick={generateMeditation}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Meditation...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Meditation
                </>
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{generatedTitle}</h3>
              <p className="text-white/80 text-sm">{duration} minute guided meditation</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#1a1a2e] rounded-lg p-6 max-h-96 overflow-y-auto">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {generatedScript}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setGeneratedScript('');
                  setGeneratedTitle('');
                }}
                variant="outline"
                className="flex-1"
              >
                Generate New
              </Button>
              <Button
                onClick={() => saveMeditation.mutate()}
                disabled={saveMeditation.isPending}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to Library
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}