import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Dumbbell, 
  ChefHat, 
  BookOpen,
  Sparkles,
  ArrowRight,
  Check,
  Play,
  MessageCircle,
  Target,
  TrendingUp,
  X
} from 'lucide-react';

const chatbotSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Your Wellness Journey',
    description: 'Meet your personal team of AI guides who will support you across all areas of life.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Personalized guidance from 4 specialized AI mentors',
      'Track progress across emotional, physical, nutritional, and spiritual health',
      'Get proactive suggestions based on your patterns',
      'Holistic insights connecting all areas of your wellbeing'
    ],
    videoUrl: null
  },
  {
    id: 'hannah',
    name: 'Hannah',
    title: 'Meet Hannah - Your Personal Growth Guide',
    description: 'Hannah specializes in emotional intelligence, identity, and personal transformation.',
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Journal your thoughts and feelings',
      'Explore emotional patterns and triggers',
      'Build self-awareness and resilience',
      'Work through challenges with compassion'
    ],
    howToUse: [
      'Share what\'s on your mind - be honest and open',
      'Ask for help processing emotions or situations',
      'Request journaling prompts when you need reflection',
      'Let Hannah help you identify patterns over time'
    ],
    examplePrompts: [
      '"I\'m feeling overwhelmed today, can you help me process this?"',
      '"Help me understand why I keep feeling anxious before big meetings"',
      '"Give me a journaling prompt for self-reflection"'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
    tooltip: 'Hannah remembers your conversations and helps you see growth patterns over time'
  },
  {
    id: 'coachdavid',
    name: 'Coach David',
    title: 'Meet Coach David - Your Fitness Coach',
    description: 'Coach David brings discipline, motivation, and expert workout guidance to help you reach your fitness goals.',
    icon: Dumbbell,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Personalized workout plans',
      'Form analysis and exercise guidance',
      'Motivation and accountability',
      'Track your fitness progress'
    ],
    howToUse: [
      'Tell David your fitness goals and current level',
      'Ask for specific workout plans or exercises',
      'Share videos for form analysis and feedback',
      'Get daily motivation and accountability check-ins'
    ],
    examplePrompts: [
      '"Create a 30-minute full body workout for beginners"',
      '"Analyze my squat form" (with video)',
      '"I skipped workouts this week, help me get back on track"'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
    tooltip: 'Coach David can analyze workout videos to give you real-time form corrections'
  },
  {
    id: 'chefdaniel',
    name: 'Chef Daniel',
    title: 'Meet Chef Daniel - Your Nutrition Expert',
    description: 'Chef Daniel combines culinary expertise with nutrition science to fuel your body and delight your taste buds.',
    icon: ChefHat,
    color: 'from-orange-500 to-red-500',
    features: [
      'Personalized recipe suggestions',
      'Meal planning and prep guidance',
      'Nutrition tracking and advice',
      'Dietary preferences and restrictions supported'
    ],
    howToUse: [
      'Share your dietary goals and preferences',
      'Ask for recipes based on ingredients you have',
      'Get meal prep strategies for busy weeks',
      'Learn about nutrition for your fitness goals'
    ],
    examplePrompts: [
      '"Give me a high-protein breakfast recipe under 400 calories"',
      '"Help me meal prep for the week with chicken and vegetables"',
      '"What should I eat to support my workout recovery?"'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
    tooltip: 'Chef Daniel considers your fitness goals from Coach David when suggesting meals'
  },
  {
    id: 'gideon',
    name: 'Gideon',
    title: 'Meet Gideon - Your Spiritual Guide',
    description: 'Gideon offers biblical wisdom, prayer support, and spiritual guidance rooted in Christian faith.',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    features: [
      'Bible study and scripture reflection',
      'Prayer guidance and journaling',
      'Spiritual goal setting',
      'Daily devotionals and meditations'
    ],
    howToUse: [
      'Share your spiritual questions or struggles',
      'Ask for scripture guidance on specific topics',
      'Reflect on prayer requests together',
      'Explore biblical themes and their application'
    ],
    examplePrompts: [
      '"I\'m struggling with anxiety, what does the Bible say about this?"',
      '"Help me reflect on Philippians 4:6-7"',
      '"Give me a prayer for strength during difficult times"'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
    tooltip: 'Gideon tailors scripture suggestions based on themes from your journal with Hannah'
  },
  {
    id: 'connected',
    title: 'Your Guides Work Together',
    description: 'The real power comes from how all your guides collaborate to support your whole-person wellbeing.',
    icon: TrendingUp,
    color: 'from-purple-500 to-blue-500',
    features: [
      'Holistic Progress Reports connect insights from all areas',
      'Mood improvements may correlate with consistent workouts',
      'Nutrition patterns can affect spiritual energy',
      'Emotional patterns inform all aspects of guidance'
    ],
    connections: [
      { from: 'Hannah', to: 'Gideon', insight: 'Your emotional patterns help Gideon suggest relevant scripture' },
      { from: 'Coach David', to: 'Hannah', insight: 'Physical activity impacts your mood tracking with Hannah' },
      { from: 'Chef Daniel', to: 'Coach David', insight: 'Nutrition fuels your workouts and recovery' },
      { from: 'Gideon', to: 'Hannah', insight: 'Spiritual practices enhance emotional resilience' }
    ],
    videoUrl: null
  },
  {
    id: 'tips',
    title: 'Tips for Maximum Benefit',
    description: 'Get the most out of your wellness journey with these best practices.',
    icon: Target,
    color: 'from-yellow-500 to-orange-500',
    tips: [
      {
        title: 'Be Consistent',
        description: 'Regular check-ins with your guides build better insights over time',
        icon: MessageCircle
      },
      {
        title: 'Be Honest',
        description: 'Your guides are judgment-free zones - authenticity leads to better guidance',
        icon: Heart
      },
      {
        title: 'Check Your Journey Page',
        description: 'Review your Holistic Progress Report weekly to see connections',
        icon: TrendingUp
      },
      {
        title: 'Enable Proactive Suggestions',
        description: 'Let your guides reach out with timely encouragement and tips',
        icon: Sparkles
      }
    ],
    videoUrl: null
  }
];

export default function WelcomeOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const step = chatbotSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === chatbotSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
      setShowVideo(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowVideo(false);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${step.color} px-6 py-8 text-white relative`}>
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            Skip Tour
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-1">{step.title}</h2>
              <p className="text-white/90 text-lg">{step.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-6">
            {chatbotSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full flex-1 transition-all ${
                  idx === currentStep
                    ? 'bg-white'
                    : idx < currentStep
                    ? 'bg-white/80'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Video */}
              {step.videoUrl && (
                <div>
                  <Button
                    onClick={() => setShowVideo(!showVideo)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 mb-3"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {showVideo ? 'Hide' : 'Watch'} Quick Tutorial
                  </Button>
                  
                  {showVideo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="rounded-xl overflow-hidden bg-gray-100"
                    >
                      <iframe
                        width="100%"
                        height="315"
                        src={step.videoUrl}
                        title={`${step.name} Tutorial`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Features */}
              {step.features && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                    {step.id === 'welcome' ? 'What You Get' : 'What I Can Help With'}
                  </h3>
                  <div className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* How to Use */}
              {step.howToUse && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                    How to Get Started
                  </h3>
                  <ul className="space-y-2">
                    {step.howToUse.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-blue-500 font-bold mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Example Prompts */}
              {step.examplePrompts && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                    Example Conversations
                  </h3>
                  <div className="space-y-2">
                    {step.examplePrompts.map((prompt, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connections */}
              {step.connections && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                    How Your Guides Connect
                  </h3>
                  <div className="space-y-3">
                    {step.connections.map((conn, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              {conn.from}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {conn.to}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{conn.insight}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {step.tips && (
                <div className="grid md:grid-cols-2 gap-4">
                  {step.tips.map((tip, idx) => {
                    const TipIcon = tip.icon;
                    return (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                              <TipIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {tip.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {tip.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Tooltip */}
              {step.tooltip && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                        Pro Tip
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        {step.tooltip}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {chatbotSteps.length}
          </div>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={`bg-gradient-to-r ${step.color} hover:opacity-90 text-white`}
            >
              {isLastStep ? 'Start Your Journey' : 'Next'}
              {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const Badge = ({ className, children }) => (
  <span className={`px-2 py-1 rounded-full font-medium ${className}`}>
    {children}
  </span>
);