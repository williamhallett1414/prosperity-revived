import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Sparkles, Book, Smile, Sunrise, Music, Palette, Coffee, Moon, Sun, Wind, Flower2, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import SelfCareActivityLogger from '@/components/wellness/SelfCareActivityLogger';
import { useAuth } from '@/hooks/useAuth';

const SELF_CARE_TIPS = [
  {
    id: 1,
    category: 'Morning Rituals',
    icon: Sunrise,
    color: 'from-yellow-400 to-orange-500',
    title: 'Start Your Day Intentionally',
    description: 'Begin each morning with gratitude, hydration, and gentle movement',
    tips: [
      'Drink a glass of water upon waking',
      'Write 3 things you\'re grateful for',
      'Do 5 minutes of stretching or yoga',
      'Set a positive intention for the day',
      'Avoid checking your phone for the first 30 minutes'
    ]
  },
  {
    id: 2,
    category: 'Emotional Wellness',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    title: 'Honor Your Emotions',
    description: 'Create space to feel, process, and release your emotions healthily',
    tips: [
      'Journal your feelings without judgment',
      'Practice the 5-5-5 breathing technique',
      'Allow yourself to cry when needed',
      'Talk to a trusted friend or counselor',
      'Engage in emotional release activities (dancing, art, music)'
    ]
  },
  {
    id: 3,
    category: 'Mental Clarity',
    icon: Brain,
    color: 'from-blue-400 to-indigo-500',
    title: 'Declutter Your Mind',
    description: 'Reduce mental noise and create space for peace and focus',
    tips: [
      'Practice daily brain dumps in a journal',
      'Limit news and social media consumption',
      'Take regular digital detox breaks',
      'Try the Pomodoro technique for focus',
      'End each day with a worry dump before bed'
    ]
  },
  {
    id: 4,
    category: 'Joyful Activities',
    icon: Smile,
    color: 'from-green-400 to-emerald-500',
    title: 'Cultivate Daily Joy',
    description: 'Make time for activities that bring genuine happiness and lightness',
    tips: [
      'Schedule "joy time" in your calendar',
      'Create a joy list and pick one daily',
      'Laugh - watch comedy or call a funny friend',
      'Dance to your favorite song',
      'Spend time with loved ones or pets'
    ]
  },
  {
    id: 5,
    category: 'Creative Expression',
    icon: Palette,
    color: 'from-purple-400 to-violet-500',
    title: 'Express Your Inner Self',
    description: 'Use creativity as a pathway to self-discovery and healing',
    tips: [
      'Try adult coloring books for relaxation',
      'Write poetry or creative stories',
      'Paint or draw without judgment',
      'Play an instrument or sing',
      'Create a vision board for your dreams'
    ]
  },
  {
    id: 6,
    category: 'Rest & Recovery',
    icon: Moon,
    color: 'from-indigo-400 to-blue-500',
    title: 'Embrace Sacred Rest',
    description: 'Prioritize rest as a spiritual practice, not a luxury',
    tips: [
      'Establish a consistent sleep schedule',
      'Create a calming bedtime routine',
      'Take guilt-free rest days',
      'Practice restorative yoga or gentle stretching',
      'Say no to overcommitment'
    ]
  }
];

const PERSONAL_DEVELOPMENT = [
  {
    id: 1,
    title: 'Daily Affirmations',
    description: 'Rewire your mindset with positive self-talk',
    icon: Sparkles,
    activities: [
      'Stand in front of a mirror and speak kindly to yourself',
      'Write affirmations on sticky notes around your home',
      'Record yourself speaking affirmations and listen daily',
      'Create personalized affirmations based on your goals'
    ]
  },
  {
    id: 2,
    title: 'Growth Mindset Practice',
    description: 'Transform challenges into opportunities',
    icon: Brain,
    activities: [
      'Reframe "I can\'t" to "I can\'t yet"',
      'Keep a growth journal tracking progress',
      'Celebrate small wins and learning moments',
      'Embrace mistakes as teachers'
    ]
  },
  {
    id: 3,
    title: 'Boundary Setting',
    description: 'Protect your energy and honor your needs',
    icon: Heart,
    activities: [
      'Identify areas where you feel drained',
      'Practice saying "no" without guilt',
      'Communicate your needs clearly',
      'Release relationships that don\'t serve you'
    ]
  },
  {
    id: 4,
    title: 'Self-Compassion',
    description: 'Treat yourself with the kindness you show others',
    icon: Flower2,
    activities: [
      'Speak to yourself as you would a dear friend',
      'Acknowledge your humanity and imperfections',
      'Practice self-forgiveness regularly',
      'Celebrate your unique journey'
    ]
  }
];

const MOOD_BOOSTERS = [
  { icon: Sun, text: 'Get 10-15 minutes of sunlight', color: 'text-yellow-500' },
  { icon: Wind, text: 'Take 3 deep breaths outdoors', color: 'text-blue-400' },
  { icon: Music, text: 'Listen to your favorite uplifting song', color: 'text-purple-500' },
  { icon: Coffee, text: 'Enjoy a mindful cup of tea or coffee', color: 'text-amber-600' },
  { icon: Book, text: 'Read an inspiring chapter or quote', color: 'text-emerald-600' },
  { icon: Heart, text: 'Do a random act of kindness', color: 'text-pink-500' }
];

export default function SelfCareGuides({ user }) {
  const [expandedTip, setExpandedTip] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loggerOpen, setLoggerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const generatePersonalizedPlan = async () => {
    setLoadingInsight(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a personalized self-care plan for today. Include:
        - One morning ritual
        - One emotional wellness practice
        - One creative activity
        - One evening wind-down practice
        
        Make it encouraging, spiritual, and actionable. Keep it concise and inspiring.`,
        response_json_schema: {
          type: 'object',
          properties: {
            morning_ritual: { type: 'string' },
            emotional_practice: { type: 'string' },
            creative_activity: { type: 'string' },
            evening_practice: { type: 'string' },
            encouragement: { type: 'string' }
          }
        }
      });
      setAiInsight(response);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleLogActivity = (tip) => {
    setSelectedActivity({
      type: tip.id.toString(),
      name: tip.title,
      category: 'self_care_tips'
    });
    setLoggerOpen(true);
  };

  const handleLogPersonalDevelopment = (guide) => {
    setSelectedActivity({
      type: guide.id.toString(),
      name: guide.title,
      category: 'personal_development'
    });
    setLoggerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7" />
          <h2 className="text-xl font-bold">Self-Care & Inner Growth</h2>
        </div>
        <p className="text-white/90 text-sm">
          Nurture your mind, body, and spirit with intentional practices
        </p>
      </motion.div>

      {/* AI Personalized Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Your Personalized Self-Care Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generatePersonalizedPlan}
              disabled={loadingInsight}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mb-4"
            >
              {loadingInsight ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Today's Plan
                </>
              )}
            </Button>

            {aiInsight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 text-sm"
              >
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">🌅 Morning Ritual</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiInsight.morning_ritual}</p>
                </div>
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <p className="font-semibold text-pink-800 dark:text-pink-300 mb-1">💗 Emotional Practice</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiInsight.emotional_practice}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="font-semibold text-purple-800 dark:text-purple-300 mb-1">🎨 Creative Activity</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiInsight.creative_activity}</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1">🌙 Evening Practice</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiInsight.evening_practice}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-700">
                  <p className="text-emerald-800 dark:text-emerald-300 italic">{aiInsight.encouragement}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Mood Boosters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Mood Boosters (5 min or less)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {MOOD_BOOSTERS.map((booster, index) => {
            const Icon = booster.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className={`w-6 h-6 ${booster.color} mb-2`} />
                <p className="text-xs text-gray-700 dark:text-gray-300">{booster.text}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="tips">Self-Care Tips</TabsTrigger>
          <TabsTrigger value="development">Personal Growth</TabsTrigger>
        </TabsList>

        {/* Self-Care Tips Tab */}
        <TabsContent value="tips" className="space-y-4 mt-4">
          {SELF_CARE_TIPS.map((tip, index) => {
            const Icon = tip.icon;
            const isExpanded = expandedTip === tip.id;
            
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${tip.color}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tip.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tip.category}</p>
                          <CardTitle className="text-base">{tip.title}</CardTitle>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleLogActivity(tip)}
                        size="sm"
                        variant="ghost"
                        className="text-emerald-600 hover:bg-emerald-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{tip.description}</p>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Practices to try:
                        </p>
                        <ul className="space-y-2">
                          {tip.tips.map((practice, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-purple-500 mt-1">•</span>
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Personal Development Tab */}
        <TabsContent value="development" className="space-y-4 mt-4">
          {PERSONAL_DEVELOPMENT.map((guide, index) => {
            const Icon = guide.icon;
            
            return (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-emerald-500" />
                      <CardTitle className="text-base">{guide.title}</CardTitle>
                    <Button
                      onClick={() => handleLogPersonalDevelopment(guide)}
                      size="sm"
                      variant="ghost"
                      className="text-emerald-600 hover:bg-emerald-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{guide.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {guide.activities.map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {idx + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Activity Logger Modal */}
      {selectedActivity && (
        <SelfCareActivityLogger
          isOpen={loggerOpen}
          onClose={() => setLoggerOpen(false)}
          activityType={selectedActivity.type}
          activityName={selectedActivity.name}
          category={selectedActivity.category}
          user={user}
        />
      )}
    </div>
  );
}