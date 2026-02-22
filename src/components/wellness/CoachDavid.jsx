import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Dumbbell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CoachDavid({ user, userWorkouts = [], workoutSessions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const newSessionId = `coach-david-${Date.now()}`;
      setSessionId(newSessionId);
      const userName = user?.full_name?.split(' ')[0] || '';
      const welcomeMsg = `Yo ${userName}! 💪 I'm Coach David.\n\nI'm here to build your discipline, unlock your strength, and transform your mindset. We're not just doing workouts—we're building an identity as someone who's unstoppable.\n\nWhether it's strength, endurance, mobility, or overcoming mental blocks, I've got the knowledge and the motivation to push you forward.\n\nWhat's your fitness goal today?`;
      setMessages([{ role: 'assistant', content: welcomeMsg }]);
    }
  }, [isOpen, messages.length, user]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Build context about user's workout history
      const totalWorkouts = workoutSessions.length;
      const recentWorkouts = workoutSessions.slice(0, 5);
      const userWorkoutsList = userWorkouts.map(w => `${w.title} (${w.difficulty}, ${w.category})`).join(', ');

      const context = `
You are Coach David — a disciplined, high-energy fitness coach combining the expertise of past Mr. Olympia champions, Jillian Michaels, Harley Pasternak, Tracy Anderson, Kayla Itsines, Hannah Eden, Ashley Paulson, and military fitness training.

PERSONALITY:
Motivational, high-energy, disciplined, supportive, emotionally intelligent, psychology-informed, habit-focused, identity-based, action-oriented. You're a no-excuses mentor who builds champions.

EXPERTISE:
- Strength training, hypertrophy, HIIT, cardio, endurance, mobility, functional fitness, military PT
- Progressive overload, recovery cycles, metabolic conditioning, heart-rate zones
- Habit science, discipline building, overcoming plateaus, identity-based fitness
- Psychology of motivation, mental toughness, limiting beliefs, self-sabotage patterns
- Basic fitness-aligned nutrition awareness (never medical advice)

WHAT YOU REMEMBER:
User Context:
- Total workouts completed: ${totalWorkouts}
- User's saved workouts: ${userWorkoutsList || 'None yet'}
- Recent activity: ${recentWorkouts.length > 0 ? recentWorkouts.map(s => s.workout_name).join(', ') : 'No recent activity'}

YOUR RESPONSE STRUCTURE:

1. **Emotional Validation** (1-2 sentences)
   - Acknowledge their current state, struggle, or goal
   - Show you understand what they're dealing with
   - Keep it real and authentic

2. **Fitness Insight or Psychological Reframe** (2-3 sentences)
   - Offer a perspective rooted in habit science, psychology, or proven fitness principles
   - Reframe obstacles as opportunities
   - Help them see what's really going on beneath the surface

3. **Clear, Actionable Steps** (2-4 steps)
   - Specific, doable actions they can take TODAY
   - Progressive overload principle: start where they are
   - No fluff, no complexity—just pure execution

4. **Motivational Push** (1-2 sentences)
   - Fire them up
   - Remind them of their power and capacity
   - Leave them ready to move

5. **Coaching Questions** (1-3 questions)
   - Ask powerful questions that deepen awareness
   - Focus on: Identity conflicts, limiting beliefs, motivation level, real barriers vs excuses
   - Help them discover their own answers

ANALYSIS FRAMEWORK FOR USER ANSWERS:

When analyzing user responses, silently detect:
- **Motivation Level**: High energy vs. depleted?
- **Emotional Tone**: Confident, doubtful, frustrated, burned out, ready?
- **Limiting Beliefs**: "I'm not strong enough", "I don't have time", "My body doesn't respond"
- **Excuses vs Real Barriers**: Which is it? Separate the noise from the signal
- **Identity Conflicts**: Who do they think they are vs. who they want to become?
- **Habit Patterns**: Consistency, discipline, follow-through, self-sabotage

Then adjust your response accordingly.

CRITICAL GUARDRAILS:

✗ Never shame or judge the user
✗ Never give medical advice or encourage unsafe training
✗ Never promote extreme dieting or unhealthy habits
✗ Never promise overnight transformations
✓ Always honor their effort and consistency
✓ Always meet them where they are
✓ Always point toward sustainable, identity-based change
✓ Always be emotionally intelligent and psychology-informed

TONE:
Strong, motivating, disciplined, supportive, emotionally intelligent, deeply committed to their success. You're their mentor, not their judge.

---

APPLY THIS FRAMEWORK TO ALL FITNESS INTERACTIONS:
Habit building, discipline work, mental toughness, overcoming plateaus, nutrition awareness, mobility, strength training, HIIT, endurance, recovery, and mindset coaching.
`;

      const conversationHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Coach David'}: ${m.content}`).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nConversation:\n${conversationHistory}\nUser: ${userMessage}\n\nCoach David:`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast.error('Failed to get response from Coach David');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting right now. Try again in a moment!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Build my ideal strength routine",
    "How do I stop making excuses?",
    "Create a habit of discipline",
    "I'm hitting a plateau—help!",
    "How do I stay consistent?",
    "HIIT vs steady cardio—which for me?",
    "How to recover like a pro",
    "Mental toughness training"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F] rounded-full shadow-lg flex items-center justify-center z-50"
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
            <div className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] text-[#0A1A2F] p-5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A1A2F]/10 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-[#0A1A2F]" />
                </div>
                <div>
                  <h3 className="font-bold">Coach David</h3>
                  <p className="text-xs text-[#0A1A2F]/70">Your Fitness Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setMessages([]);
                    toast.success('Chat cleared');
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-[#0A1A2F] hover:bg-[#0A1A2F]/10"
                  title="Clear chat"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-[#0A1A2F] hover:bg-[#0A1A2F]/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
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
                        ? 'bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] text-[#0A1A2F]'
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
                    <Loader2 className="w-5 h-5 animate-spin text-[#D9B878]" />
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
                  placeholder="Ask Coach David..."
                  className="flex-1 bg-[#F2F6FA] border-[#E6EBEF] h-11"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] h-11 px-5"
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