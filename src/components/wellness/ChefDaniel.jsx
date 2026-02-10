import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ChefDaniel({ user, userRecipes = [], mealLogs = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hey there! I'm Chef Daniel 🥗 I'm here to help you with nutrition advice, healthy recipes, and meal planning! Ask me anything about food, nutrition, or healthy eating."
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
      // Build context about user's nutrition history
      const totalMeals = mealLogs.length;
      const recentMeals = mealLogs.slice(0, 5);
      const userRecipesList = userRecipes.map(r => `${r.title} (${r.category})`).join(', ');

      // Calculate user's average intake from history
      const avgCalories = mealLogs.length > 0 
        ? Math.round(mealLogs.reduce((sum, m) => sum + (m.calories || 0), 0) / Math.min(mealLogs.length, 7))
        : 2000;
      
      const avgProtein = mealLogs.length > 0
        ? Math.round(mealLogs.reduce((sum, m) => sum + (m.protein || 0), 0) / Math.min(mealLogs.length, 7))
        : 0;

      const nutritionStats = avgProtein > 0
        ? `\n- Recent average intake: ${avgCalories} calories/day, ${avgProtein}g protein/day`
        : '';

      const context = `
User Context:
- Total meals logged: ${totalMeals}
- User's saved recipes: ${userRecipesList || 'None yet'}
- Recent meals: ${recentMeals.length > 0 ? recentMeals.map(m => m.description).join(', ') : 'No recent meals logged'}${nutritionStats}

You are Chef Daniel, a friendly and knowledgeable nutrition expert and chef. You provide practical nutrition advice, healthy recipe ideas, and personalized meal planning.
Keep responses conversational, helpful, and actionable. Use emojis occasionally to keep things friendly.
Focus on: nutrition facts, healthy recipes, meal prep tips, dietary advice, personalized meal plans, and food-related questions.

When creating meal plans:
- Ask about dietary preferences (vegetarian, vegan, keto, etc.)
- Ask about calorie goals and restrictions
- Suggest balanced meals with variety
- Include shopping lists when appropriate
- Consider the user's recent eating patterns
      `;

      const conversationHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Chef Daniel'}: ${m.content}`).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nConversation:\n${conversationHistory}\nUser: ${userMessage}\n\nChef Daniel:`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast.error('Failed to get response from Chef Daniel');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting right now. Try again in a moment!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Suggest a healthy recipe",
    "What's good for protein?",
    "Meal prep tips",
    "Create a meal plan for me"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#AFC7E3] hover:bg-[#AFC7E3]/90 text-[#0A1A2F] rounded-full shadow-lg flex items-center justify-center z-50"
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
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-[#E6EBEF]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] text-[#0A1A2F] p-5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A1A2F]/10 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-[#0A1A2F]" />
                </div>
                <div>
                  <h3 className="font-bold">Chef Daniel</h3>
                  <p className="text-xs text-[#0A1A2F]/70">Your Nutrition Guide</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-[#0A1A2F] hover:bg-[#0A1A2F]/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F2F6FA]">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] text-[#0A1A2F]'
                        : 'bg-[#E6EBEF] text-[#0A1A2F]'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#E6EBEF] rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-[#AFC7E3]" />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length === 1 && !isLoading && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-[#0A1A2F]/60 font-medium">Quick questions:</p>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(action);
                      }}
                      className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] transition-colors shadow-sm"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-[#E6EBEF] bg-white">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Chef Daniel..."
                  className="flex-1 bg-[#F2F6FA] border-[#E6EBEF] h-11"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] hover:from-[#AFC7E3]/90 hover:to-[#D9B878]/90 text-[#0A1A2F] h-11 px-5"
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