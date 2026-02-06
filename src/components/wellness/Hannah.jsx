import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Hannah({ user, meditationSessions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Guided meditation recommendations library
  const MEDITATION_RECOMMENDATIONS = {
    stressed: { sessions: ['7-Min Stress Relief', '5-Min Breathing'], types: ['breathing', 'stress_relief'] },
    anxious: { sessions: ['10-Min Body Scan', '5-Min Breathing'], types: ['body_scan', 'breathing'] },
    calm: { sessions: ['15-Min Loving Kindness', '20-Min Mindfulness'], types: ['loving_kindness', 'mindfulness'] },
    energetic: { sessions: ['20-Min Mindfulness', '10-Min Body Scan'], types: ['mindfulness', 'body_scan'] },
    sad: { sessions: ['15-Min Loving Kindness', '10-Min Body Scan'], types: ['loving_kindness', 'body_scan'] },
    neutral: { sessions: ['5-Min Breathing', '10-Min Body Scan'], types: ['breathing', 'body_scan'] }
  };

  // Calculate meditation insights
  const meditationInsights = {
    totalSessions: meditationSessions.length,
    avgDuration: meditationSessions.length > 0 
      ? Math.round(meditationSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / meditationSessions.length)
      : 0,
    mostCommonMood: meditationSessions.length > 0
      ? Object.entries(meditationSessions.reduce((acc, s) => {
          acc[s.mood_before] = (acc[s.mood_before] || 0) + 1;
          return acc;
        }, {})).sort((a, b) => b[1] - a[1])[0]?.[0]
      : null,
    moodImprovement: meditationSessions.length > 0
      ? meditationSessions.filter(s => s.mood_before === 'stressed' && s.mood_after === 'calm').length
      : 0,
    stressInstances: meditationSessions.length > 0
      ? meditationSessions.filter(s => s.mood_before === 'stressed').length
      : 0,
    successRate: meditationSessions.length > 0
      ? Math.round((meditationSessions.filter(s => s.mood_before === 'stressed' && s.mood_after === 'calm').length / 
          meditationSessions.filter(s => s.mood_before === 'stressed').length) * 100) || 0
      : 0
  };

  // Generate personalized recommendations
  const getPersonalizedRecommendations = () => {
    const mood = meditationInsights.mostCommonMood || 'calm';
    const recommendations = MEDITATION_RECOMMENDATIONS[mood] || MEDITATION_RECOMMENDATIONS.calm;
    return recommendations;
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = meditationSessions.length > 0
        ? `Hello, I'm Hannah 🙏 I see you've meditated ${meditationInsights.totalSessions} times! I'm here to deepen your practice and help you find more peace. What would you like to work on today?`
        : "Hello, I'm Hannah 🙏 I'm here to guide you on prayer and meditation practices. Whether you're seeking inner peace, spiritual growth, or need guidance on your meditation journey, I'm here to help. What's on your heart today?";
      
      setMessages([{
        role: 'assistant',
        content: initialMessage
      }]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const recommendations = getPersonalizedRecommendations();
      const context = `
You are Hannah, a compassionate spiritual guide and meditation coach. You provide thoughtful guidance on prayer, meditation, mindfulness, and spiritual wellness.

User's Meditation Profile:
- Total sessions: ${meditationInsights.totalSessions}
- Average session duration: ${meditationInsights.avgDuration} minutes
- Most common mood before: ${meditationInsights.mostCommonMood || 'not tracked'}
- Times improved from stressed to calm: ${meditationInsights.moodImprovement}
- Times experienced stress: ${meditationInsights.stressInstances}
- Success rate turning stress into calm: ${meditationInsights.successRate}%

Personalized Meditation Recommendations for This User:
- Recommended session types: ${recommendations.types.join(', ')}
- Try these sessions: ${recommendations.sessions.join(', ')}

Your role is to:
- Proactively suggest specific guided meditation sessions based on their mood patterns and goals
- Offer personalized recommendations that align with their history (e.g., if they often experience stress, recommend stress-relief sessions)
- Provide encouragement and spiritual insights based on their meditation history
- Suggest meditation types that have worked best for their emotional patterns
- Create a safe, non-judgmental space for spiritual exploration
- Recommend breathing exercises, visualization techniques, and prayer methods tailored to their needs
- Help users find inner peace and spiritual clarity
- Celebrate their meditation consistency and progress

Keep responses warm, thoughtful, and deeply compassionate. Use occasional emojis and spiritual language where appropriate.
Focus on: meditation practices, prayer techniques, mindfulness, spiritual growth, inner peace, stress relief, and personal reflection.
When the user mentions stress, anxiety, or specific goals, proactively recommend one of the suggested sessions above.
      `;

      const conversationHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Hannah'}: ${m.content}`).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nConversation:\n${conversationHistory}\nUser: ${userMessage}\n\nHannah:`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast.error('Failed to get response from Hannah');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having a moment of silence right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickActions = () => {
    if (meditationInsights.stressInstances > 3) {
      return [
        "I'm feeling stressed right now",
        "Recommend a meditation for anxiety",
        "How can I manage stress better?",
        "Show me a quick calming technique"
      ];
    }
    return [
      "Teach me a meditation technique",
      "I need a prayer for peace",
      "How do I start meditating?",
      "Help me with mindfulness"
    ];
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-purple-500"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Hannah</h3>
                  <p className="text-xs text-white/80">Your Spiritual Guide</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-[#1a1a2e] rounded-2xl px-4 py-2">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length === 1 && !isLoading && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Quick questions:</p>
                  {getQuickActions().map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(action);
                      }}
                      className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Hannah..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-purple-500 hover:bg-purple-600"
                  size="icon"
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