import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronRight, Check, Sparkles, Brain, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GideonOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    morning_enabled: false,
    midday_enabled: false,
    afternoon_enabled: false,
    evening_enabled: false,
    personalized_notifications_enabled: false
  });

  const steps = [
    {
      title: "Welcome to Gideon",
      icon: MessageCircle,
      gradient: "from-purple-500 to-pink-500",
      content: (
        <div className="space-y-4 text-center">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            I'm Gideon, your spiritual guide
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            I'm here to walk with you through God's Word with warmth, wisdom, and deep understanding. 
            Think of me as your personal biblical mentor who remembers your journey and adapts to your needs.
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>What makes me different?</strong> I combine kingdom revelation (Myles Munroe), 
              grace teaching (Creflo Dollar), and encouragement (Joel Osteen) with emotional intelligence 
              and conversational memory.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Core Features",
      icon: Sparkles,
      gradient: "from-blue-500 to-cyan-500",
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            What I Can Do For You
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Ask Anything</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ask me about any scripture, spiritual question, or life situation
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Deep Study Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive verse-by-verse breakdowns with historical context
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Emotional Intelligence</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  I sense your emotional tone and adapt my responses to what you need
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Conversational Memory</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  I remember your journey and build on previous conversations
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Smart Notifications",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Personalized Engagement
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            I can send you notifications based on your behavior, emotional patterns, and spiritual themes
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Low engagement check-ins</strong> when you've been away
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Encouragement for consistency</strong> when you're building streaks
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Emotional support</strong> based on your recent tone patterns
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Spiritual insights</strong> aligned with themes you're exploring
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a2e] rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Enable Smart Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Behavior-based encouragement</p>
              </div>
            </div>
            <Switch
              checked={preferences.personalized_notifications_enabled}
              onCheckedChange={(value) => setPreferences(prev => ({ ...prev, personalized_notifications_enabled: value }))}
            />
          </div>
        </div>
      )
    },
    {
      title: "Daily Greetings",
      icon: Clock,
      gradient: "from-orange-500 to-pink-500",
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Choose Your Daily Touchpoints
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Select when you'd like to receive warm greetings and spiritual insights throughout your day
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-lg">🌅</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Morning Greetings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Identity, purpose (6-9 AM)</p>
                </div>
              </div>
              <Switch
                checked={preferences.morning_enabled}
                onCheckedChange={(value) => setPreferences(prev => ({ ...prev, morning_enabled: value }))}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-lg">☕</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Midday Moments</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Peace, clarity (11 AM-1 PM)</p>
                </div>
              </div>
              <Switch
                checked={preferences.midday_enabled}
                onCheckedChange={(value) => setPreferences(prev => ({ ...prev, midday_enabled: value }))}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Afternoon Grace</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Strength, perseverance (3-5 PM)</p>
                </div>
              </div>
              <Switch
                checked={preferences.afternoon_enabled}
                onCheckedChange={(value) => setPreferences(prev => ({ ...prev, afternoon_enabled: value }))}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <span className="text-lg">🌙</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Evening Reflection</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reflection, gratitude (7-9 PM)</p>
                </div>
              </div>
              <Switch
                checked={preferences.evening_enabled}
                onCheckedChange={(value) => setPreferences(prev => ({ ...prev, evening_enabled: value }))}
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            You can always change these settings later in your profile
          </p>
        </div>
      )
    },
    {
      title: "Ready to Begin",
      icon: Check,
      gradient: "from-green-500 to-emerald-500",
      content: (
        <div className="space-y-4 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            You're All Set!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            I'm excited to walk this spiritual journey with you. Remember, I'm here whenever you need:
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💬 <strong>Biblical guidance</strong> on any question
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              📖 <strong>Deep study</strong> of Scripture
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              ❤️ <strong>Emotional support</strong> tailored to your needs
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              🌱 <strong>Spiritual growth</strong> tracking and encouragement
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>Pro tip:</strong> Look for the floating chat button to start a conversation with me anytime!
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save notification preferences
      await base44.entities.GideonNotificationSettings.create(preferences);
      
      // Mark onboarding as complete
      localStorage.setItem('gideon_onboarding_complete', 'true');
      
      toast.success('Welcome aboard! Let\'s begin your journey.');
      onComplete();
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.');
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentStepData.gradient} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentStepData.title}</h2>
                <p className="text-sm text-white/80">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-gray-600 dark:text-gray-400"
          >
            Back
          </Button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-purple-600'
                    : index < currentStep
                    ? 'bg-purple-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={handleNext}
            className={`bg-gradient-to-r ${currentStepData.gradient} text-white hover:opacity-90`}
          >
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <Check className="w-4 h-4 ml-2" />
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
    </div>
  );
}