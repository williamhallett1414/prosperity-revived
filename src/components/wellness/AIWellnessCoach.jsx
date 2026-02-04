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

  // Fetch user's wellness data
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
    const context = {
      user_name: user?.full_name || 'User',
      spiritual_goal: user?.spiritual_goal,
      fitness_level: user?.fitness_level,
      health_goals: user?.health_goals,
      current_streak: userProgress?.current_streak || 0,
      total_points: userProgress?.total_points || 0,
      level: userProgress?.level || 1
    };

    if (activeJourney) {
      const currentWeek = activeJourney.weeks?.find(w => w.week_number === activeJourney.current_week);
      const recentMood = activeJourney.mood_energy_tracking?.slice(-3);
      const recentWorkoutFeedback = activeJourney.exercise_feedback?.slice(-3);
      
      context.active_journey = {
        title: activeJourney.title,
        current_week: activeJourney.current_week,
        total_weeks: activeJourney.duration_weeks,
        progress: activeJourney.progress_percentage,
        current_week_theme: currentWeek?.theme,
        spiritual_focus: currentWeek?.spiritual_focus,
        workout_focus: currentWeek?.workout_focus,
        nutrition_focus: currentWeek?.nutrition_focus,
        goals: activeJourney.goals,
        granular_goals: activeJourney.granular_goals,
        recent_mood_energy: recentMood,
        recent_workout_feedback: recentWorkoutFeedback
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
You are a supportive and knowledgeable AI wellness coach. You help users with their spiritual growth, fitness, and nutrition journeys.

User Context:
${JSON.stringify(context, null, 2)}

Recent Conversation:
${conversationHistory}

User's Current Message: ${input}

Guidelines:
1. Be warm, encouraging, and supportive
2. Provide specific, actionable advice based on their data
3. Reference their current journey, progress, and goals when relevant
4. If they're struggling, offer motivation and practical tips
5. If they ask about exercises, provide step-by-step guidance
6. If they mention low mood/energy, acknowledge it and offer gentle suggestions
7. Celebrate their wins and progress
8. Keep responses conversational and personal (2-4 sentences unless detailed guidance is needed)
9. Use emojis occasionally to be friendly
10. If they haven't been active, gently encourage them without being pushy

Respond naturally and helpfully:`;

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
    "How am I doing on my journey?",
    "I'm feeling unmotivated today",
    "Guide me through a breathing exercise",
    "What should I focus on this week?"
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