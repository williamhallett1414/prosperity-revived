import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Dumbbell, Trash2, Link2 } from 'lucide-react';
import AvatarContainer from '../avatar/AvatarContainer';
import { AVATAR_STATES, getAnimationForEvent } from '../avatar/avatarStateMachine.js';
import ExternalDataSources from '../integrations/ExternalDataSources';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import CoachDavidQuickAskMenu from './CoachDavidQuickAskMenu';
import CoachDavidFormAnalysis from './CoachDavidFormAnalysis';
import CoachDavidOnboarding from './CoachDavidOnboarding';
import ProactiveSuggestionBanner from '../chatbot/ProactiveSuggestionBanner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPersonalityPromptAddition, fetchUserPreferences } from '../chatbot/PersonalityAdapter';
import TTSButton from '../chatbot/TTSButton';
import VoiceInputButton from '../chatbot/VoiceInputButton';
import ReactMarkdown from 'react-markdown';
import { getChefDanielNutritionContext } from '../chatbot/CrossChatbotContext';
import HannahFeedbackRating from '../mindspirit/HannahFeedbackRating';
import { useProactiveInsights } from '../chatbot/useProactiveInsights';
import ProactiveInsightCard from '../chatbot/ProactiveInsightCard';

export default function CoachDavid({ user, userWorkouts = [], workoutSessions = [], autoOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [quickMenuCollapsed, setQuickMenuCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [memories, setMemories] = useState([]);
  const [personalityPrefs, setPersonalityPrefs] = useState(null);
  const [nutritionCrossContext, setNutritionCrossContext] = useState('');
  const [showDataSources, setShowDataSources] = useState(false);
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [avatarState, setAvatarState] = useState(AVATAR_STATES.IDLE);
  const [ratedMessageIndices, setRatedMessageIndices] = useState(new Set());
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (autoOpen) setIsOpen(true);
  }, [autoOpen]);

  const { insight } = useProactiveInsights({
    chatbot: 'CoachDavid',
    workoutSessions,
    memories,
  });

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
        const totalSessions = workoutSessions.length;
        const streakMsg = totalSessions > 0
          ? `You've logged ${totalSessions} workout${totalSessions > 1 ? 's' : ''} — that consistency is building something real.`
          : `Haven't logged a workout yet — today's the day we change that.`;
        const returningMsg = `Welcome back${userName ? ', ' + userName : ''}! 💪\n\n${streakMsg}\n\nI'm ready to push you further. What are we working on today — strength, cardio, recovery, or mental game?`;
        setMessages([{ role: 'assistant', content: returningMsg }]);
      }
      
      loadMemories();
    }
  }, [isOpen, messages.length, user]);

  const loadMemories = async () => {
    if (!user?.email) return;
    try {
      const [mems, prefs, crossCtx] = await Promise.all([
        base44.entities.ChatbotMemory.filter({ 
          chatbot_name: 'CoachDavid',
          created_by: user.email 
        }, '-importance', 20),
        fetchUserPreferences(base44, 'CoachDavid'),
        getChefDanielNutritionContext(base44, user.email)
      ]);
      setMemories(mems);
      setPersonalityPrefs(prefs);
      setNutritionCrossContext(crossCtx);
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
    sendWithText(promptAction);
  };

  const handleDismissSuggestion = () => {
    if (proactiveSuggestions[0]) {
      markSuggestionReadMutation.mutate(proactiveSuggestions[0].id);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    _doSend(userMessage);
  };

  // Send a message directly (from quick-action chips)
  const sendWithText = (text) => {
    if (isLoading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    _doSend(text);
  };

  const _doSend = async (userMessage) => {
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

PROACTIVE WORKOUT ADJUSTMENT — CRITICAL NEW CAPABILITY:
When a user reports ANY of the following, you MUST proactively suggest a workout adjustment BEFORE proceeding with anything else:
- Fatigue, tiredness, low energy, soreness, "feeling off", poor sleep, stress overload
- Performance drop ("I didn't lift as much", "I couldn't finish", "felt weaker")
- Pain or discomfort signals (not medical advice — redirect to doctor for injuries, but adjust training load)
- High-stress life events that affect recovery

FATIGUE DETECTION SIGNALS:
- "I'm tired", "exhausted", "drained", "no energy", "didn't sleep well", "feeling heavy", "burnout"
- "My lifts went down", "couldn't finish my sets", "felt weak today", "struggled"
- "I'm sore everywhere", "my muscles are aching", "haven't recovered"

WHEN FATIGUE OR PERFORMANCE ISSUES ARE DETECTED:
1. Immediately acknowledge it without judgment
2. Explain WHY this matters (overtraining, CNS fatigue, incomplete recovery, life stress = physical stress)
3. Propose a concrete adjusted workout plan using one of these strategies:
   - **Deload Week**: Reduce volume by 40-50%, keep intensity, focus on movement quality
   - **Active Recovery Day**: Gentle walks, mobility, yoga, foam rolling, stretching — no heavy lifting
   - **RPE-Based Adjustment**: Drop to RPE 6-7 instead of pushing to 9-10
   - **Volume Reduction**: Cut sets in half, maintain form, stop at first sign of degraded movement
   - **Rest Day with Purpose**: Sleep optimization, nutrition focus, stress management
4. Give the specific adjusted workout (not vague advice — actual exercises, sets, reps)
5. Set expectations: "This adjustment IS the training. Recovery is where growth happens."

EXAMPLE FATIGUE RESPONSE STRUCTURE:
"[Acknowledge the fatigue/performance dip] → [Science behind why this matters — CNS fatigue, recovery debt, etc.] → [Adjusted workout plan with specifics] → [Why this is the smart move, not giving up] → [1-2 coaching questions about recovery habits]"

APPLY THIS FRAMEWORK TO ALL FITNESS INTERACTIONS:
Habit building, discipline work, mental toughness, overcoming plateaus, nutrition awareness, mobility, strength training, HIIT, endurance, recovery, and mindset coaching.${nutritionCrossContext}${getPersonalityPromptAddition(personalityPrefs)}
`;

      const conversationHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Coach David'}: ${m.content}`).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nConversation:\n${conversationHistory}\nUser: ${userMessage}\n\nCoach David: (Use up-to-date information from the internet when needed for current fitness research, exercise science, training methods, and sports nutrition. Always cite sources when using external information.)`,
        add_context_from_internet: true
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setAvatarState(getAnimationForEvent('bot_speaking', 'coach_david', response));
      setTimeout(() => setAvatarState(AVATAR_STATES.IDLE), 4000);

      // Extract and save key insights every 5 messages
      const msgCountForMemory = messages.length + 2; // +2 for user msg + response just added
      if (messages.length > 0 && msgCountForMemory % 5 === 0) {
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
      setAvatarState(AVATAR_STATES.IDLE);
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
    "Mental toughness training",
    "I'm feeling fatigued — adjust my workout",
    "My performance dropped today — what should I do?"
  ];

  return (
    <>
      <AnimatePresence>
        {showDataSources && (
          <ExternalDataSources user={user} onClose={() => setShowDataSources(false)} />
        )}
      </AnimatePresence>

      {showOnboarding && (
        <CoachDavidOnboarding
          user={user}
          onComplete={(prefs) => {
            setShowOnboarding(false);
            localStorage.setItem('coachDavidOnboardingCompleted', 'true');
          }}
        />
      )}

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-[#0A0A0A] to-[#38BDF8] hover:opacity-90 text-white rounded-full shadow-lg flex items-center justify-center z-50"
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
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[min(500px,calc(100dvh-7rem))] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-[#E6EBEF] overflow-hidden"
          >
            {/* Avatar */}
            <div className="flex justify-center bg-[#F2F6FA] pt-3 pb-1">
              <AvatarContainer characterName="coach_david" avatarState={avatarState} size="md" />
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A0A0A] to-[#38BDF8] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Coach David</h3>
                  <p className="text-xs text-white/80">Your Fitness Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => setShowDataSources(true)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  title="Connect external data sources"
                >
                  <Link2 className="w-5 h-5" />
                </Button>
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
                  className="text-white hover:bg-white/20"
                  title="Clear chat"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => { setIsOpen(false); onClose?.(); }}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Proactive Insight Card */}
            <AnimatePresence>
              {insight && !insightDismissed && (
                <ProactiveInsightCard
                  insight={insight}
                  onAccept={(prompt) => { setInsightDismissed(true); sendWithText(prompt); }}
                  onDismiss={() => setInsightDismissed(true)}
                />
              )}
            </AnimatePresence>

            {/* Proactive Suggestion Banner */}
            {proactiveSuggestions?.length > 0 && (insightDismissed || !insight) && (
              <ProactiveSuggestionBanner
                suggestion={proactiveSuggestions[0]}
                onAccept={handleAcceptSuggestion}
                onDismiss={handleDismissSuggestion}
              />
            )}

            {/* Quick-Ask Menu */}
            {messages.length <= 1 && !isLoading && (
              <CoachDavidQuickAskMenu
                onSelectPrompt={(prompt) => sendWithText(prompt)}
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
                        ? 'bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white'
                        : 'bg-[#E6EBEF] text-[#0A1A2F]'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0 text-[#0A1A2F] text-sm leading-relaxed">
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    )}
                    {message.role === 'assistant' && (
                      <div className="flex justify-end mt-1">
                        <TTSButton text={message.content} />
                      </div>
                    )}
                  </div>
                  {message.role === 'assistant' && index > 0 && !ratedMessageIndices.has(index) && (
                    <HannahFeedbackRating
                      messageContent={message.content}
                      userEmail={user?.email}
                      sessionId={sessionId}
                      onDone={() => setRatedMessageIndices(prev => new Set([...prev, index]))}
                    />
                  )}
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
                      onClick={() => sendWithText(action)}
                      className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] transition-colors shadow-sm"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t border-[#E6EBEF] bg-white">
              <div className="flex gap-2 items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Coach David..."
                  className="flex-1 bg-[#F2F6FA] border-[#E6EBEF] h-11"
                  disabled={isLoading}
                />
                <VoiceInputButton
                  onTranscript={(text) => setInput(prev => prev ? prev + ' ' + text : text)}
                  onInterim={(text) => setInput(text)}
                  disabled={isLoading}
                  accentColor="bg-[#38BDF8]"
                  activeColor="bg-[#0EA5E9]"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#38BDF8]/90 hover:to-[#0EA5E9]/90 text-white h-11 px-5"
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