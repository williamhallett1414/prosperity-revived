import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Dumbbell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import CoachDavidQuickAskMenu from './CoachDavidQuickAskMenu';
import CoachDavidFormAnalysis from './CoachDavidFormAnalysis';
import CoachDavidOnboarding from './CoachDavidOnboarding';
import ProactiveSuggestionBanner from '../chatbot/ProactiveSuggestionBanner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function CoachDavid({ user, userWorkouts = [], workoutSessions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [quickMenuCollapsed, setQuickMenuCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [memories, setMemories] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const newSessionId = `coach-david-${Date.now()}`;
      setSessionId(newSessionId);
      const userName = user?.full_name?.split(' ')[0] || '';
      const isFirstTime = !localStorage.getItem('coachDavidVisited');
      
      if (isFirstTime) {
        setShowOnboarding(true);
        const welcomeMsg = `Yo ${userName}! 💪 I'm Coach David.\n\nI'm here to build your discipline, unlock your strength, and transform your mindset. We're not just doing workouts—we're building an identity as someone who's unstoppable.\n\nWhether it's strength, endurance, mobility, or overcoming mental blocks, I've got the knowledge and the motivation to push you forward.\n\nWhat's your fitness goal today?`;
        setMessages([{ role: 'assistant', content: welcomeMsg }]);
        localStorage.setItem('coachDavidVisited', 'true');
      } else {
        const welcomeMsg = `Yo ${userName}! 💪 I'm Coach David.\n\nI'm here to build your discipline, unlock your strength, and transform your mindset. We're not just doing workouts—we're building an identity as someone who's unstoppable.\n\nWhether it's strength, endurance, mobility, or overcoming mental blocks, I've got the knowledge and the motivation to push you forward.\n\nWhat's your fitness goal today?`;
        setMessages([{ role: 'assistant', content: welcomeMsg }]);
      }
      
      loadMemories();
    }
  }, [isOpen, messages.length, user]);

  const loadMemories = async () => {
    if (!user?.email) return;
    try {
      const mems = await base44.entities.ChatbotMemory.filter({ 
        chatbot_name: 'CoachDavid',
        created_by: user.email 
      }, '-importance', 20);
      setMemories(mems);
    } catch (error) {
      console.log('Loading memories...');
    }
  };

  // Load proactive suggestions
  const { data: proactiveSuggestions } = useQuery({
    queryKey: ['coachDavidProactiveSuggestions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const suggestions = await base44.entities.ProactiveSuggestion.filter({
        chatbot_name: 'CoachDavid',
        user_email: user.email,
        is_read: false
      }, '-priority');
      return suggestions;
    },
    enabled: !!user?.email && isOpen,
    initialData: []
  });

  const markSuggestionReadMutation = useMutation({
    mutationFn: (suggestionId) => base44.entities.ProactiveSuggestion.update(suggestionId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachDavidProactiveSuggestions'] });
    }
  });

  const handleAcceptSuggestion = (promptAction) => {
    if (proactiveSuggestions[0]) {
      markSuggestionReadMutation.mutate(proactiveSuggestions[0].id);
    }
    setInput(promptAction);
  };

  const handleDismissSuggestion = () => {
    if (proactiveSuggestions[0]) {
      markSuggestionReadMutation.mutate(proactiveSuggestions[0].id);
    }
  };

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
You are Coach David — a disciplined, high-energy fitness coach combining the expertise of champion bodybuilders, elite personal trainers, and military fitness training protocols.

PERSONALITY:
Motivational, high-energy, disciplined, supportive, emotionally intelligent, psychology-informed, habit-focused, identity-based, action-oriented. You're a no-excuses mentor who builds champions.

EXPERTISE:
- Strength training, hypertrophy, HIIT, cardio, endurance, mobility, functional fitness, military PT
- Progressive overload, recovery cycles, metabolic conditioning, heart-rate zones
- Habit science, discipline building, overcoming plateaus, identity-based fitness
- Psychology of motivation, mental toughness, limiting beliefs, self-sabotage patterns
- Basic fitness-aligned nutrition awareness (never medical advice)
- Exercise form analysis, biomechanics, injury prevention
- Personalized workout prescription based on fitness level, goals, equipment, and time constraints

WHAT YOU REMEMBER:
User Context:
- Total workouts completed: ${totalWorkouts}
- User's saved workouts: ${userWorkoutsList || 'None yet'}
- Recent activity: ${recentWorkouts.length > 0 ? recentWorkouts.map(s => s.workout_name).join(', ') : 'No recent activity'}
${user?.fitness_interests?.length > 0 ? `- Fitness interests: ${user.fitness_interests.join(', ')}` : ''}
${user?.fitness_goals?.length > 0 ? `- Fitness goals: ${user.fitness_goals.join(', ')}` : ''}

MEMORIES FROM PAST CONVERSATIONS:
${memories.length > 0 ? memories.map(m => `[${m.memory_type.toUpperCase()}] ${m.content}${m.context ? ` (Context: ${m.context})` : ''}`).join('\n') : 'No previous memories stored yet.'}

CRITICAL INSTRUCTION FOR USING MEMORIES:
When responding, naturally reference relevant memories to show you remember their fitness journey. Use phrases like:
- "I remember you mentioned [specific goal/challenge] - let's tackle that by..."
- "Based on what you told me about [specific preference/limitation], here's what works..."
- "You've been working on [specific milestone/progress], so now we can level up to..."
- "Last time you said [specific challenge], so I'm adjusting my approach to..."
- "Drawing from your training history, I know [specific insight], which is why..."

Only reference memories that are DIRECTLY RELEVANT to the current conversation. Be specific and use actual details from the memories - this shows you're tracking their progress and adapting your coaching to their unique journey.

PERSONALIZED RECOMMENDATIONS:
- When asked for a workout plan, use the user's fitness level, goals, time availability, and equipment
- Reference their past workout patterns to ensure variety and progression
- Suggest intensity adjustments based on their experience and current activity level
- Provide recovery protocols specific to their training demands

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
        prompt: `${context}\n\nConversation:\n${conversationHistory}\nUser: ${userMessage}\n\nCoach David: (Use up-to-date information from the internet when needed for current fitness research, exercise science, training methods, and sports nutrition. Always cite sources when using external information.)`,
        add_context_from_internet: true
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // Extract and save key insights every 5 messages
      if (messages.length > 0 && messages.length % 5 === 0) {
        try {
          const recentConvo = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
          const memoryExtraction = await base44.integrations.Core.InvokeLLM({
            prompt: `Analyze this fitness coaching conversation and extract 1-3 key insights to remember. Focus on: training goals, workout preferences, physical limitations, progress milestones, challenges, or breakthrough moments.

Conversation:
${recentConvo}
User: ${userMessage}
Coach David: ${response}

Return ONLY valid JSON array:
[{"memory_type": "goal|preference|insight|milestone|advice_given|challenge|success", "content": "brief memory", "context": "optional context", "importance": 1-10}]`,
            add_context_from_internet: false,
            response_json_schema: {
              type: "object",
              properties: {
                memories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      memory_type: { type: "string" },
                      content: { type: "string" },
                      context: { type: "string" },
                      importance: { type: "number" }
                    }
                  }
                }
              }
            }
          });

          if (memoryExtraction?.memories?.length > 0) {
            for (const mem of memoryExtraction.memories) {
              await base44.entities.ChatbotMemory.create({
                chatbot_name: 'CoachDavid',
                memory_type: mem.memory_type,
                content: mem.content,
                context: mem.context || '',
                importance: mem.importance || 5,
                conversation_date: new Date().toISOString().split('T')[0],
                last_referenced: new Date().toISOString()
              });
            }
            await loadMemories();
          }
        } catch (err) {
          console.error('Failed to extract memories:', err);
        }
      }
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
      {showOnboarding && (
        <CoachDavidOnboarding
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('coachDavidOnboardingCompleted', 'true');
          }}
          onRevisit={() => setShowOnboarding(false)}
        />
      )}

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
              <div className="flex items-center gap-1">
                <CoachDavidFormAnalysis
                  onAnalysisComplete={(analysis) => {
                    const formFeedback = `Here's my form analysis from Coach David:\n\nScore: ${analysis.overall_form_score}/10\n\nKey Improvements: ${analysis.areas_for_improvement.join(', ')}\n\nHelp me improve!`;
                    setInput(formFeedback);
                  }}
                />
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

            {/* Proactive Suggestion Banner */}
            {proactiveSuggestions?.length > 0 && (
              <ProactiveSuggestionBanner
                suggestion={proactiveSuggestions[0]}
                onAccept={handleAcceptSuggestion}
                onDismiss={handleDismissSuggestion}
              />
            )}

            {/* Quick-Ask Menu */}
            {messages.length <= 1 && !isLoading && (
              <CoachDavidQuickAskMenu
                onSelectPrompt={(prompt) => setInput(prompt)}
                isLoading={isLoading}
                isCollapsed={quickMenuCollapsed}
                onToggleCollapse={() => setQuickMenuCollapsed(!quickMenuCollapsed)}
              />
            )}

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