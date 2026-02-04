import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AIWellnessCoach({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.full_name?.split(' ')[0] || 'there'}! 👋 I'm your AI wellness coach. I'm here to support you on your journey to better health and spiritual growth. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch comprehensive user data
  const { data: journeys = [] } = useQuery({
    queryKey: ['wellnessJourneys', user?.email],
    queryFn: () => base44.entities.WellnessJourney.list(),
    enabled: !!user
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list(),
    enabled: !!user
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 50),
    enabled: !!user
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 50),
    enabled: !!user
  });

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: () => base44.entities.Meditation.list(),
    enabled: !!user
  });

  const { data: readingProgress = [] } = useQuery({
    queryKey: ['readingProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list(),
    enabled: !!user
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.find(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const activeJourney = journeys.find(j => j.is_active && j.created_by === user?.email);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Proactive check-in if user hasn't logged activity recently
  useEffect(() => {
    if (!user || !activeJourney || messages.length > 1) return;

    const lastActiveDate = userProgress?.last_active_date;
    if (lastActiveDate) {
      const daysSinceActive = Math.floor(
        (new Date() - new Date(lastActiveDate)) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceActive >= 3) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I noticed you haven't logged any activity in ${daysSinceActive} days. Everything okay? I'm here to help you get back on track! 💪`,
            timestamp: new Date().toISOString()
          }]);
        }, 3000);
      }
    }
  }, [user, activeJourney, userProgress, messages.length]);

  const buildContext = () => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Calculate recent activity
    const recentWorkouts = workoutSessions.filter(s => s.date >= last7Days).length;
    const recentMeals = mealLogs.filter(m => m.date >= last7Days).length;
    const totalCalories7Days = mealLogs.filter(m => m.date >= last7Days).reduce((sum, m) => sum + (m.calories || 0), 0);
    const avgCaloriesPerDay = recentMeals > 0 ? Math.round(totalCalories7Days / 7) : 0;
    
    const completedMeditations = meditations.filter(m => 
      m.completed_dates?.some(d => d >= last7Days)
    ).length;

    const activeReadingPlans = readingProgress.filter(p => !p.completed_date);
    const recentBibleDays = readingProgress.reduce((sum, p) => {
      const recentCompletions = p.completion_dates?.filter(d => d >= last7Days) || [];
      return sum + recentCompletions.length;
    }, 0);

    const context = {
      user_name: user?.full_name?.split(' ')[0] || 'User',
      user_profile: {
        spiritual_goal: user?.spiritual_goal,
        fitness_level: user?.fitness_level,
        health_goals: user?.health_goals,
        dietary_preferences: user?.dietary_preferences
      },
      gamification: {
        current_streak: userProgress?.current_streak || 0,
        longest_streak: userProgress?.longest_streak || 0,
        total_points: userProgress?.total_points || 0,
        level: userProgress?.level || 1,
        workouts_completed: userProgress?.workouts_completed || 0,
        meditations_completed: userProgress?.meditations_completed || 0,
        reading_plans_completed: userProgress?.reading_plans_completed || 0
      },
      recent_activity: {
        last_7_days: {
          workouts: recentWorkouts,
          meals_logged: recentMeals,
          avg_calories: avgCaloriesPerDay,
          meditations: completedMeditations,
          bible_reading_days: recentBibleDays
        },
        last_active_date: userProgress?.last_active_date,
        days_since_activity: userProgress?.last_active_date 
          ? Math.floor((new Date() - new Date(userProgress.last_active_date)) / (1000 * 60 * 60 * 24))
          : null
      },
      bible_reading: {
        active_plans: activeReadingPlans.length,
        total_days_read: readingProgress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0),
        longest_streak: Math.max(...readingProgress.map(p => p.longest_streak || 0), 0)
      }
    };

    if (activeJourney) {
      const currentWeek = activeJourney.weeks?.find(w => w.week_number === activeJourney.current_week);
      const recentMood = activeJourney.mood_energy_tracking?.slice(-5);
      const recentWorkoutFeedback = activeJourney.exercise_feedback?.slice(-5);
      const recentRecipeFeedback = activeJourney.recipe_feedback?.slice(-5);
      
      context.active_journey = {
        title: activeJourney.title,
        current_week: activeJourney.current_week,
        total_weeks: activeJourney.duration_weeks,
        progress: activeJourney.progress_percentage,
        current_week_theme: currentWeek?.theme,
        goals: activeJourney.goals,
        granular_goals: activeJourney.granular_goals?.map(g => ({
          type: g.type,
          description: g.description,
          progress: g.progress_percentage,
          current: g.current_value,
          target: g.target_value
        })),
        recent_mood_energy: recentMood,
        recent_workout_feedback: recentWorkoutFeedback,
        recent_recipe_feedback: recentRecipeFeedback,
        adaptations: activeJourney.adaptations?.slice(-3)
      };
    }

    return context;
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const context = buildContext();
      const conversationHistory = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');

      const prompt = `
You are an empathetic and insightful AI wellness coach who helps users achieve holistic well-being through spiritual growth, physical fitness, and mindful nutrition.

COMPREHENSIVE USER CONTEXT:
${JSON.stringify(context, null, 2)}

RECENT CONVERSATION:
${conversationHistory}

USER'S CURRENT MESSAGE: ${input}

COACHING GUIDELINES:

1. ANALYZE & PERSONALIZE:
   - Reference specific data points (streak, workouts, meals, Bible reading)
   - Notice patterns in their activity and progress
   - Identify areas where they're excelling and areas needing support
   - Consider their goals, mood trends, and feedback

2. PROVIDE INSIGHTS:
   - Offer data-driven observations ("I notice you've worked out 3 times this week - that's amazing!")
   - Connect different aspects of their wellness (how Bible reading relates to stress levels, etc.)
   - Highlight progress toward their goals
   - Point out positive trends

3. PROACTIVE SUGGESTIONS:
   - Suggest specific next actions based on their recent activity
   - Recommend workouts/recipes/prayers aligned with their preferences
   - Propose small, achievable steps to build momentum
   - Balance challenge with encouragement

4. EMOTIONAL INTELLIGENCE:
   - Acknowledge struggles without judgment
   - Celebrate wins enthusiastically
   - If mood/energy is low, offer compassionate support
   - Adapt tone to their current state

5. PRACTICAL GUIDANCE:
   - Give step-by-step instructions when requested
   - Provide specific timing and duration recommendations
   - Offer modifications based on their fitness level
   - Share nutritional insights relevant to their goals

6. HOLISTIC APPROACH:
   - Integrate spiritual, physical, and nutritional elements
   - Reference their spiritual goals in wellness discussions
   - Connect faith practices with health benefits
   - Encourage balance across all areas

7. CONVERSATIONAL STYLE:
   - Keep responses warm and personal (2-5 sentences for casual questions)
   - Use their name occasionally
   - Include encouraging emojis naturally
   - Longer responses only when providing detailed guidance
   - Avoid being preachy or overly formal

8. ACCOUNTABILITY:
   - Gently address inactivity with curiosity, not criticism
   - Remind them of their stated goals
   - Suggest ways to overcome barriers
   - Offer to help them get back on track

Respond as their trusted wellness coach:`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt
      });

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "How am I doing overall?",
    "What should I work on today?",
    "I'm feeling unmotivated",
    "Suggest a workout for me",
    "Help me with meal planning",
    "Tips for staying consistent?"
  ];

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-white z-50 hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="w-6 h-6" />
            {activeJourney && userProgress?.last_active_date && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Wellness Coach</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="text-xs px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="bg-purple-600 hover:bg-purple-700 px-3"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}