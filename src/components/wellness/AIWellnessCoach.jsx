import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, TrendingUp, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [activeTab, setActiveTab] = useState('chat');
  const [journalEntry, setJournalEntry] = useState('');
  const [journalMood, setJournalMood] = useState('neutral');
  const [journalEnergy, setJournalEnergy] = useState('moderate');
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

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

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries', user?.email],
    queryFn: () => base44.entities.JournalEntry.list('-date', 50),
    enabled: !!user
  });

  const activeJourney = journeys.find(j => j.is_active && j.created_by === user?.email);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveJournalEntry = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.JournalEntry.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      setJournalEntry('');
      setJournalMood('neutral');
      setJournalEnergy('moderate');
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate journaling prompts when tab opens
  useEffect(() => {
    if (activeTab === 'journal' && suggestedPrompts.length === 0 && user) {
      generateJournalingPrompts();
    }
  }, [activeTab, user]);

  // Generate proactive insights on mount
  useEffect(() => {
    if (!user || messages.length > 1) return;

    const generateProactiveMessage = async () => {
      const context = buildContext();
      
      // Check for various conditions that warrant proactive outreach
      const daysSinceActive = context.recent_activity.days_since_activity || 0;
      const recentWorkouts = context.recent_activity.last_7_days.workouts;
      const currentStreak = context.gamification.current_streak;
      const recentBibleDays = context.recent_activity.last_7_days.bible_reading_days;
      
      let shouldReachOut = false;
      let proactivePrompt = '';

      if (daysSinceActive >= 3) {
        shouldReachOut = true;
        proactivePrompt = `User hasn't been active in ${daysSinceActive} days. Provide a warm, non-judgmental check-in that offers support and suggests a simple action to help them restart their wellness routine.`;
      } else if (currentStreak >= 7) {
        shouldReachOut = true;
        proactivePrompt = `User has an impressive ${currentStreak}-day streak! Celebrate this achievement and provide insights on their progress. Suggest how to maintain momentum.`;
      } else if (recentWorkouts >= 4) {
        shouldReachOut = true;
        proactivePrompt = `User has been very active with ${recentWorkouts} workouts this week. Celebrate their dedication and provide insights on their fitness progress. Suggest recovery practices or nutritional tips.`;
      } else if (recentBibleDays >= 5) {
        shouldReachOut = true;
        proactivePrompt = `User has been consistent with Bible reading (${recentBibleDays} days this week). Acknowledge their spiritual commitment and suggest ways to deepen their practice.`;
      } else if (context.active_journey && context.active_journey.granular_goals?.some(g => g.progress >= 80)) {
        shouldReachOut = true;
        const nearGoals = context.active_journey.granular_goals.filter(g => g.progress >= 80);
        proactivePrompt = `User is close to achieving goals: ${nearGoals.map(g => g.description).join(', ')}. Provide encouragement and specific suggestions to help them reach these goals.`;
      }

      if (shouldReachOut) {
        setTimeout(async () => {
          try {
            const fullPrompt = `
You are a proactive AI wellness coach. Based on the user's recent activity and progress, generate a brief, personalized check-in message.

User Context:
${JSON.stringify(context, null, 2)}

Task: ${proactivePrompt}

Keep it warm, personal, and 2-3 sentences. Use an encouraging emoji. Reference specific data points.`;

            const response = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });
            
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: response,
              timestamp: new Date().toISOString()
            }]);
          } catch (error) {
            console.error('Failed to generate proactive message:', error);
          }
        }, 2000);
      }
    };

    generateProactiveMessage();
  }, [user]);

  const generateJournalingPrompts = async () => {
    try {
      const context = buildContext();
      const recentEntries = journalEntries.slice(0, 3).map(e => ({
        date: e.date,
        mood: e.mood,
        snippet: e.content?.substring(0, 100)
      }));

      const promptRequest = `
Based on this user's wellness journey, generate 4 personalized journaling prompts that would help them reflect and grow:

USER CONTEXT:
${JSON.stringify({
  goals: context.user_profile,
  recent_activity: context.recent_activity,
  active_journey: context.active_journey?.title,
  current_week_theme: context.active_journey?.current_week_theme,
  recent_journal_entries: recentEntries
}, null, 2)}

Generate 4 diverse prompts covering different areas:
1. Spiritual reflection
2. Physical wellness & fitness
3. Emotional/mental health
4. Goal progress or gratitude

Return as JSON array: ["prompt1", "prompt2", "prompt3", "prompt4"]
Keep each prompt brief (1 sentence, question format).`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: promptRequest,
        response_json_schema: {
          type: "object",
          properties: {
            prompts: { type: "array", items: { type: "string" } }
          }
        }
      });

      setSuggestedPrompts(response.prompts || []);
    } catch (error) {
      console.error('Failed to generate prompts:', error);
      setSuggestedPrompts([
        "What am I most grateful for today?",
        "How did my body feel during today's activities?",
        "What spiritual lesson am I learning this week?",
        "What small win can I celebrate right now?"
      ]);
    }
  };

  const analyzeJournalEntry = async (entryContent, mood, energy) => {
    setIsAnalyzing(true);
    try {
      const context = buildContext();
      const prompt = `
You are an insightful wellness coach analyzing a user's journal entry. Provide a brief, empathetic analysis.

USER CONTEXT:
${JSON.stringify(context, null, 2)}

JOURNAL ENTRY:
Mood: ${mood}
Energy: ${energy}
Content: ${entryContent}

Provide:
1. Key themes or emotions you notice
2. Connection to their wellness goals
3. One actionable insight or encouragement
4. Any patterns worth noting

Keep response brief (3-4 sentences), warm, and specific to their entry.`;

      const insights = await base44.integrations.Core.InvokeLLM({ prompt });
      return insights;
    } catch (error) {
      console.error('Failed to analyze entry:', error);
      return "Thank you for sharing. Your reflections are valuable for your growth journey.";
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveJournal = async () => {
    if (!journalEntry.trim()) return;

    const insights = await analyzeJournalEntry(journalEntry, journalMood, journalEnergy);
    
    await saveJournalEntry.mutateAsync({
      date: new Date().toISOString().split('T')[0],
      content: journalEntry,
      mood: journalMood,
      energy_level: journalEnergy,
      ai_insights: insights,
      tags: []
    });

    // Add insights to chat
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `📔 Journal entry saved! Here are my insights:\n\n${insights}`,
      timestamp: new Date().toISOString()
    }]);
    
    setActiveTab('chat');
  };

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
      },
      journaling: {
        total_entries: journalEntries.length,
        recent_moods: journalEntries.slice(0, 7).map(e => e.mood),
        recent_energy: journalEntries.slice(0, 7).map(e => e.energy_level),
        entries_this_week: journalEntries.filter(e => e.date >= last7Days).length
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
    "Analyze my journal patterns",
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
                  {activeTab === 'journal' ? <BookOpen className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold">{activeTab === 'journal' ? 'Journal' : 'AI Coach'}</h3>
                  <p className="text-xs text-white/80">{activeTab === 'journal' ? 'Reflect & grow' : 'Always here to help'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b bg-white px-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="journal">Journal</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content Area */}
            {activeTab === 'chat' && (
              <>
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
            </>
            )}

            {/* Journal Tab */}
            {activeTab === 'journal' && (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Suggested Prompts */}
                    {suggestedPrompts.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <p className="text-xs font-medium text-gray-700">Suggested Prompts</p>
                        </div>
                        <div className="space-y-2">
                          {suggestedPrompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => setJournalEntry(prev => prev + (prev ? '\n\n' : '') + prompt + '\n')}
                              className="w-full text-left p-2 bg-amber-50 rounded-lg text-xs text-gray-700 hover:bg-amber-100 transition-colors"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mood & Energy */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Mood</label>
                        <Select value={journalMood} onValueChange={setJournalMood}>
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="very_low">Very Low 😢</SelectItem>
                            <SelectItem value="low">Low 😞</SelectItem>
                            <SelectItem value="neutral">Neutral 😐</SelectItem>
                            <SelectItem value="good">Good 😊</SelectItem>
                            <SelectItem value="excellent">Excellent 🤩</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Energy</label>
                        <Select value={journalEnergy} onValueChange={setJournalEnergy}>
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exhausted">Exhausted 😴</SelectItem>
                            <SelectItem value="low">Low 🔋</SelectItem>
                            <SelectItem value="moderate">Moderate ⚡</SelectItem>
                            <SelectItem value="high">High 🚀</SelectItem>
                            <SelectItem value="energized">Energized 💥</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Journal Entry */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">What's on your mind?</label>
                      <Textarea
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        placeholder="Write your thoughts, feelings, reflections..."
                        className="min-h-[200px] resize-none"
                      />
                    </div>

                    {/* Recent Entries Preview */}
                    {journalEntries.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">Recent Entries</p>
                        <div className="space-y-2">
                          {journalEntries.slice(0, 3).map((entry) => (
                            <div key={entry.id} className="p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">{entry.date}</span>
                                <span className="text-xs">{entry.mood === 'excellent' ? '🤩' : entry.mood === 'good' ? '😊' : entry.mood === 'neutral' ? '😐' : '😞'}</span>
                              </div>
                              <p className="text-xs text-gray-700 line-clamp-2">{entry.content}</p>
                              {entry.ai_insights && (
                                <p className="text-xs text-purple-600 mt-1 italic">💡 {entry.ai_insights.substring(0, 80)}...</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Save Button */}
                <div className="p-4 border-t">
                  <Button
                    onClick={handleSaveJournal}
                    disabled={!journalEntry.trim() || isAnalyzing || saveJournalEntry.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isAnalyzing || saveJournalEntry.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing & Saving...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Save & Get AI Insights
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}