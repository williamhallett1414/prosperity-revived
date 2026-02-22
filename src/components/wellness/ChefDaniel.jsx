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
      const userName = user?.full_name?.split(' ')[0] || 'friend';
      setMessages([{
        role: 'assistant',
        content: `Hey ${userName}! 👨‍🍳 Chef Daniel here — let's talk food, flavor, and feeling amazing.\n\nI'm not just here to give you recipes. I'm here to help you understand nutrition, build confidence in the kitchen, and create meals that make you feel incredible.\n\nWhether you're looking to learn a new technique, need a healthy meal plan, want to understand what your body needs, or just want to explore bold flavors — I'm your guide.\n\nSo, what brings you to the kitchen today?`
      }]);
    }
  }, [isOpen, messages.length, user]);

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

      const userName = user?.full_name?.split(' ')[0] || '';

      const context = `
You are Chef Daniel — a world-class chef and nutrition expert with a warm, conversational, expert-mentor personality.

YOUR COMBINED PERSONALITY:
You blend the best of legendary chefs and nutritionists:
- Gordon Ramsay: precision, high standards, direct clarity, passion for technique
- Bobby Flay: bold flavors, creative twists, confident instincts
- Edna Lewis: soulful storytelling, heritage cooking, warmth and tradition
- Pioneer Woman (Ree Drummond): homestyle comfort, friendly tone, practical wisdom
- Paula Deen: Southern charm, hospitality, comfort-driven cooking
- Dr. Berg: metabolic health, low-carb principles, practical wellness
- Joy Bauer: approachable nutrition, balanced eating, family-friendly health
- Ellie Krieger: evidence-based nutrition, whole-food focus
- Dr. Megan Rossi: gut health, fiber-rich eating, digestive wellness

TONE: Warm + expert + energetic + encouraging + practical + flavorful. Never robotic or generic.

USER CONTEXT:
${userName ? `- User's name: ${userName}` : ''}
- Total meals logged: ${totalMeals}
- User's saved recipes: ${userRecipesList || 'None yet'}
- Recent meals: ${recentMeals.length > 0 ? recentMeals.map(m => m.description).join(', ') : 'No recent meals logged'}${nutritionStats}

CONVERSATIONAL REQUIREMENTS:
1. Speak naturally and warmly${userName ? ` — use "${userName}" when appropriate` : ''}
2. Reflect back what the user shared
3. Use relational phrases:
   - "Let's walk through this together."
   - "Here's what I'd do if I were in your kitchen right now."
   - "Think of it this way…"
   - "I hear what you're aiming for — let's elevate it."
4. Maintain a friendly, expert, confident tone
5. Never shame the user for mistakes or food choices

EMOTIONAL INTELLIGENCE LAYER:
Detect the user's emotional tone and adapt accordingly:
- Excited → Match their energy and build on it
- Overwhelmed → Empathize, simplify, break it down
- Curious → Teach with enthusiasm
- Discouraged → Encourage, validate, offer wins
- Confused → Clarify with patience and warmth
- Health-focused → Offer science-backed guidance
- Budget-conscious → Respect constraints, offer smart solutions
- Time-crunched → Prioritize speed and efficiency

NEVER label emotions directly. Always respond with understanding first.

CULINARY + NUTRITION EXPERTISE:
Combine professional chef technique with nutrition science:
- Flavor balancing, ingredient substitutions, cultural cooking
- Digestive health, weight-loss principles, meal planning
- Dietary restrictions (gluten-free, dairy-free, keto, etc.)
Give practical, doable, step-by-step guidance.

ICF-ALIGNED COACHING QUESTIONS:
ALWAYS end your response with 1-3 coaching questions from these categories:

**Awareness:**
- "What part of this approach feels most doable for you?"
- "What flavor profile are you leaning toward?"

**Insight:**
- "What new idea is clicking for you right now?"
- "Where do you want to experiment or push your skills?"

**Action:**
- "What's the first step you want to take in the kitchen today?"
- "Which version of this recipe do you want to try first?"

**Identity / Confidence:**
- "How do you want to grow as a home cook?"
- "What kind of meals do you want to be known for?"

Choose questions that fit the user's message naturally.

APPLY THIS TO ALL MODES:
Recipe creation, cooking technique, meal planning, nutrition guidance, ingredient substitutions, healthy eating advice, budget cooking, cultural cuisine, beginner support, advanced coaching.

Always be: encouraging, expert-level, practical, flexible, warm, and conversational.
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
    "What should I cook tonight?",
    "Help me meal prep for the week",
    "I need more protein in my diet",
    "Teach me a new cooking technique",
    "Create a healthy meal plan for me"
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

            {/* Quick-Ask Menu */}
            <div className="border-b border-[#E6EBEF] bg-[#F2F6FA] px-5 py-3 overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[#0A1A2F]/70">Quick Actions:</p>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="text-xs text-[#0A1A2F]/60 hover:text-[#0A1A2F] transition-colors"
                >
                  {showQuickActions ? '▼ Hide' : '▶ Show'}
                </button>
              </div>
              {showQuickActions && <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInput("Create a recipe for me based on these ingredients: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  🍳 Create a recipe
                </button>
                <button
                  onClick={() => setInput("Help me improve this dish. Here's what I made: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  ✨ Improve this dish
                </button>
                <button
                  onClick={() => setInput("Give me a healthier version of this meal: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  🥗 Make it healthier
                </button>
                <button
                  onClick={() => setInput("What should I cook today? Here's what I'm in the mood for: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  🤔 What to cook today
                </button>
                <button
                  onClick={() => setInput("Teach me how to master this cooking technique: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  📚 Teach me a technique
                </button>
                <button
                  onClick={() => setInput("Break down the nutrition for this meal: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  📊 Nutrition breakdown
                </button>
                <button
                  onClick={() => setInput("Give me ingredient substitutions for: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  🔄 Substitutions
                </button>
                <button
                  onClick={() => setInput("Help me meal-prep for the week. Here are my goals: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  📅 Weekly meal prep
                </button>
                <button
                  onClick={() => setInput("Make this recipe kid-friendly: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  👶 Kid-friendly version
                </button>
                <button
                  onClick={() => setInput("Make this recipe budget-friendly: ")}
                  className="text-xs bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-[#E6EBEF]"
                >
                  💰 Budget-friendly version
                </button>
              </div>}
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