import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, Sparkles, Target, Heart, BookOpen, Utensils, Dumbbell } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SPIRITUAL_INTERESTS = [
  'Prayer', 'Bible Study', 'Worship', 'Service', 'Fellowship', 
  'Evangelism', 'Discipleship', 'Spiritual Growth'
];

const LIFE_SITUATIONS = [
  'Marriage', 'Parenting', 'Career', 'Grief', 'Anxiety', 'Depression',
  'Financial Stress', 'Health Issues', 'Addiction Recovery', 'Loneliness',
  'New Believer', 'Doubt & Questions', 'Life Transitions', 'College Life'
];

const HEALTH_GOALS = [
  'Weight Loss', 'Muscle Gain', 'Better Sleep', 'Stress Relief',
  'More Energy', 'Healthy Eating', 'Flexibility', 'Mental Clarity'
];

const DIETARY_PREFERENCES = [
  'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free',
  'Dairy-Free', 'Low-Carb', 'Mediterranean', 'No Restrictions'
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    spiritual_goal: '',
    spiritual_interests: [],
    life_situation: [],
    fitness_level: 'beginner',
    health_goals: [],
    dietary_preferences: [],
    reminder_settings: {
      daily_verse: { enabled: false, time: '08:00' },
      reading_plan: { enabled: false, time: '07:00' },
      workout: { enabled: false, time: '06:00' },
      meditation: { enabled: false, time: '20:00' }
    }
  });

  const toggleArrayItem = (field, item) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleComplete = async () => {
    await base44.auth.updateMe({
      ...data,
      onboarding_completed: true
    });
    onComplete();
  };

  const steps = [
    {
      title: 'Welcome! 🙏',
      subtitle: 'Let\'s personalize your journey',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <Target className="w-8 h-8 mb-3" />
            <h3 className="font-semibold mb-2">Set Your Spiritual Goal</h3>
            <p className="text-sm text-white/80 mb-4">What's one thing you'd like to focus on spiritually?</p>
            <Input
              placeholder="e.g., Pray daily, Read Bible consistently..."
              value={data.spiritual_goal}
              onChange={(e) => setData({ ...data, spiritual_goal: e.target.value })}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Spiritual Interests',
      subtitle: 'What areas interest you most?',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {SPIRITUAL_INTERESTS.map(interest => (
            <Button
              key={interest}
              onClick={() => toggleArrayItem('spiritual_interests', interest)}
              variant={data.spiritual_interests.includes(interest) ? 'default' : 'outline'}
              className={data.spiritual_interests.includes(interest) 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'border-gray-300 hover:bg-gray-50'
              }
            >
              {interest}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: 'Life Situations',
      subtitle: 'Select any that apply to you (optional)',
      content: (
        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {LIFE_SITUATIONS.map(situation => (
            <Button
              key={situation}
              onClick={() => toggleArrayItem('life_situation', situation)}
              variant={data.life_situation.includes(situation) ? 'default' : 'outline'}
              className={data.life_situation.includes(situation) 
                ? 'bg-purple-600 hover:bg-purple-700 text-xs' 
                : 'border-gray-300 hover:bg-gray-50 text-xs'
              }
            >
              {situation}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: 'Fitness Level',
      subtitle: 'Help us recommend the right workouts',
      content: (
        <div className="space-y-3">
          {['beginner', 'intermediate', 'advanced'].map(level => (
            <Button
              key={level}
              onClick={() => setData({ ...data, fitness_level: level })}
              variant={data.fitness_level === level ? 'default' : 'outline'}
              className={`w-full justify-start h-auto p-4 ${
                data.fitness_level === level 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-left">
                <p className="font-semibold capitalize">{level}</p>
                <p className="text-xs opacity-80">
                  {level === 'beginner' && 'Just starting out or returning after a break'}
                  {level === 'intermediate' && 'Regular exercise, ready for more challenge'}
                  {level === 'advanced' && 'Experienced and looking for intense workouts'}
                </p>
              </div>
            </Button>
          ))}
        </div>
      )
    },
    {
      title: 'Health Goals',
      subtitle: 'What would you like to achieve?',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {HEALTH_GOALS.map(goal => (
            <Button
              key={goal}
              onClick={() => toggleArrayItem('health_goals', goal)}
              variant={data.health_goals.includes(goal) ? 'default' : 'outline'}
              className={data.health_goals.includes(goal) 
                ? 'bg-teal-600 hover:bg-teal-700' 
                : 'border-gray-300 hover:bg-gray-50'
              }
            >
              {goal}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: 'Dietary Preferences',
      subtitle: 'Help us recommend meals for you',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {DIETARY_PREFERENCES.map(pref => (
            <Button
              key={pref}
              onClick={() => toggleArrayItem('dietary_preferences', pref)}
              variant={data.dietary_preferences.includes(pref) ? 'default' : 'outline'}
              className={data.dietary_preferences.includes(pref) 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'border-gray-300 hover:bg-gray-50'
              }
            >
              {pref}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: 'Set Reminders',
      subtitle: 'Stay consistent with daily reminders',
      content: (
        <div className="space-y-4">
          {[
            { key: 'daily_verse', label: 'Daily Verse', icon: BookOpen, color: 'amber' },
            { key: 'reading_plan', label: 'Reading Plan', icon: BookOpen, color: 'indigo' },
            { key: 'workout', label: 'Workout', icon: Dumbbell, color: 'emerald' },
            { key: 'meditation', label: 'Meditation', icon: Heart, color: 'purple' }
          ].map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="flex items-center justify-between bg-white dark:bg-[#2d2d4a] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  {data.reminder_settings[key].enabled && (
                    <p className="text-xs text-gray-500">
                      {data.reminder_settings[key].time}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data.reminder_settings[key].enabled && (
                  <Input
                    type="time"
                    value={data.reminder_settings[key].time}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      reminder_settings: {
                        ...prev.reminder_settings,
                        [key]: { ...prev.reminder_settings[key], time: e.target.value }
                      }
                    }))}
                    className="w-24 h-8 text-xs"
                  />
                )}
                <Button
                  size="sm"
                  variant={data.reminder_settings[key].enabled ? 'default' : 'outline'}
                  onClick={() => setData(prev => ({
                    ...prev,
                    reminder_settings: {
                      ...prev.reminder_settings,
                      [key]: { ...prev.reminder_settings[key], enabled: !prev.reminder_settings[key].enabled }
                    }
                  }))}
                  className={data.reminder_settings[key].enabled ? `bg-${color}-600 hover:bg-${color}-700` : ''}
                >
                  {data.reminder_settings[key].enabled ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Step {step} of {steps.length}</p>
              <p className="text-white/60 text-sm">{Math.round((step / steps.length) * 100)}%</p>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#c9a227] to-[#8fa68a]"
                initial={{ width: 0 }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-[#2d2d4a] rounded-3xl p-6 shadow-2xl"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a2e] dark:text-white mb-2">
                  {currentStep.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {currentStep.subtitle}
                </p>
              </div>

              {currentStep.content}

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <Button
                    onClick={() => setStep(step - 1)}
                    variant="outline"
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (step === steps.length) {
                      handleComplete();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-[#c9a227] to-[#8fa68a] hover:opacity-90"
                >
                  {step === steps.length ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}