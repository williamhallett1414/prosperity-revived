import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function CoachPaul() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch user data for context
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.WorkoutSession.list('-created_date', 10);
      } catch {
        return [];
      }
    },
    enabled: !!user,
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: async () => {
      try {
        return await base44.entities.MealLog.list('-created_date', 10);
      } catch {
        return [];
      }
    },
    enabled: !!user,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      try {
        const progressList = await base44.entities.UserProgress.list();
        return progressList?.[0];
      } catch {
        return null;
      }
    },
    enabled: !!user,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const buildContextPrompt = () => {
    const recentWorkouts = workoutSessions.slice(0, 3);
    const recentMeals = mealLogs.slice(0, 3);

    let context = `You are Coach Paul, a personalized fitness and nutrition coach. You provide motivational guidance, answer questions about coaching content, and offer customized advice based on user progress.\n\n`;

    context += `User Information:\n`;
    context += `- Name: ${user?.full_name || 'Friend'}\n`;
    if (userProgress) {
      context += `- Points: ${userProgress.total_points}, Level: ${userProgress.level}\n`;
      context += `- Workouts Completed: ${userProgress.workouts_completed}, Current Streak: ${userProgress.current_streak} days\n`;
    }

    if (recentWorkouts.length > 0) {
      context += `\nRecent Workouts:\n`;
      recentWorkouts.forEach((w, i) => {
        const date = w.created_date ? new Date(w.created_date).toLocaleDateString() : '';
        context += `${i + 1}. ${w.workout_name || 'Workout'} (${date})\n`;
      });
    }

    if (recentMeals.length > 0) {
      context += `\nRecent Meals:\n`;
      recentMeals.forEach((m, i) => {
        context += `${i + 1}. ${m.description || 'Meal'} - ${m.calories || 0} cal\n`;
      });
    }

    context += `\nProvide personalized, motivational guidance. Keep responses conversational and encouraging.`;
    return context;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const contextPrompt = buildContextPrompt();
      const conversationHistory = messages
        .map(m => `${m.role === 'user' ? 'User' : 'Coach Paul'}: ${m.content}`)
        .join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${contextPrompt}\n\n${conversationHistory}\nUser: ${userMessage}\n\nCoach Paul:`,
      });

      const coachMessage = response?.trim() || 'I appreciate your engagement! Keep pushing towards your goals.';
      setMessages(prev => [...prev, { role: 'assistant', content: coachMessage }]);
    } catch (error) {
      toast.error('Failed to get response from Coach Paul');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'What should I focus on today?',
    'Give me motivation!',
    'How am I doing with my progress?',
    'Any nutrition tips?',
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E72] text-white shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-32 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E72] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Coach Paul</h3>
                <p className="text-xs text-white/80">Your personal fitness coach</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-[#FF6B6B]" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Hey there, {user?.full_name?.split(' ')[0] || 'Champ'}!</p>
                  <p className="text-xs text-gray-500">I'm Coach Paul. Ready to crush your goals?</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-[#FF6B6B] text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                    <Loader2 className="w-4 h-4 text-[#FF6B6B] animate-spin" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 0 && !isLoading && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-2">
                <p className="text-xs font-semibold text-gray-600">Quick asks:</p>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(prompt);
                        setTimeout(() => {
                          setMessages(prev => [...prev, { role: 'user', content: prompt }]);
                          handleSendMessage();
                        }, 0);
                      }}
                      className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Coach Paul..."
                  className="text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#FF6B6B] hover:bg-[#FF5555] text-white px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}