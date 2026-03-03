import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Send, X, Loader2, Sparkles, MessageCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { getPersonalityPromptAddition, fetchUserPreferences } from '../chatbot/PersonalityAdapter';
import TTSButton from '../chatbot/TTSButton';
// No cross-context needed for Gideon — it's the source for others
import GideonQuickAskMenu from './GideonQuickAskMenu';
import VoiceInputButton from '../chatbot/VoiceInputButton';
import { useProactiveInsights } from '../chatbot/useProactiveInsights';
import ProactiveInsightCard from '../chatbot/ProactiveInsightCard';
import ProactiveSuggestionBanner from '../chatbot/ProactiveSuggestionBanner';

export default function GideonChatbot({ user, autoOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personalityPrefs, setPersonalityPrefs] = useState(null);
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [quickMenuCollapsed, setQuickMenuCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch user's spiritual memories
  const { data: memories = [] } = useQuery({
    queryKey: ['chatbotMemories', 'Gideon', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ChatbotMemory.filter({
        chatbot_name: 'Gideon',
        created_by: user.email
      });
    },
    enabled: !!user?.email
  });

  // Fetch recent journal entries and prayer journals
  const { data: journals = [] } = useQuery({
    queryKey: ['journalEntries', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.JournalEntry.filter({
        created_by: user.email
      }, '-created_date', 5);
    },
    enabled: !!user?.email
  });

  const { data: prayers = [] } = useQuery({
    queryKey: ['prayerJournals', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.PrayerJournal.filter({
        created_by: user.email
      }, '-created_date', 5);
    },
    enabled: !!user?.email
  });

  useEffect(() => {
    if (autoOpen) setIsOpen(true);
  }, [autoOpen]);

  const { insight } = useProactiveInsights({
    chatbot: 'Gideon',
    conversations: [],
    memories,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = user?.full_name?.split(' ')[0] || '';
      const welcomeMsg = `Peace be with you${userName ? ', ' + userName : ''}! 🙏\n\nI'm Gideon, your spiritual guide and companion in faith.\n\nI'm here to help you:\n• Study and understand Scripture\n• Deepen your prayer life\n• Navigate spiritual questions\n• Grow closer to God\n• Find biblical wisdom for life's challenges\n\nHow can I support your faith journey today?`;
      setMessages([{ role: 'assistant', content: welcomeMsg }]);
      loadPersonalityPreferences();
    }
  }, [isOpen, messages.length, user]);

  const loadPersonalityPreferences = async () => {
    const prefs = await fetchUserPreferences(base44, 'Gideon');
    setPersonalityPrefs(prefs);
  };

  // Load proactive suggestions
  const { data: proactiveSuggestions } = useQuery({
    queryKey: ['gideonProactiveSuggestions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const suggestions = await base44.entities.ProactiveSuggestion.filter({
        chatbot_name: 'Gideon',
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
      queryClient.invalidateQueries({ queryKey: ['gideonProactiveSuggestions'] });
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

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    _doSend(userMessage);
  };

  const sendWithText = (text) => {
    if (isLoading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    _doSend(text);
  };

  const saveGideonConversation = async (role, content) => {
    if (!user?.email) return;
    try {
      await base44.entities.HannahConversation.create({
        user_email: user.email,
        role,
        content,
        emotional_tone: null,
        conversation_session_id: `gideon-${new Date().toISOString().split('T')[0]}`,
        mood_score: null
      });
    } catch (e) { /* silent */ }
  };

  const _doSend = async (userMessage) => {
    setIsLoading(true);
    saveGideonConversation('user', userMessage);

    try {
      // Build context from memories and journals
      const memoryContext = memories.length > 0 
        ? `\n\nPast spiritual insights about ${user.full_name}:\n${memories.slice(0, 10).map(m => `- ${m.content}`).join('\n')}`
        : '';

      const journalContext = journals.length > 0
        ? `\n\nRecent journal reflections:\n${journals.map(j => `- ${j.content.substring(0, 150)}...`).join('\n')}`
        : '';

      const prayerContext = prayers.length > 0
        ? `\n\nRecent prayers:\n${prayers.map(p => `- ${p.content.substring(0, 150)}...`).join('\n')}`
        : '';

      const systemPrompt = `You are Gideon, a wise and compassionate spiritual mentor with deep knowledge of Scripture and Christian faith. 
You guide users in their spiritual journey with warmth, biblical wisdom, and practical application.

Your approach:
- Ground advice in Scripture, citing relevant passages
- Be encouraging and hopeful, never judgmental
- Offer practical steps for spiritual growth
- Ask thoughtful questions to deepen reflection
- Recognize patterns in their spiritual journey
- Celebrate growth and milestones

User: ${user.full_name}
${memoryContext}${journalContext}${prayerContext}

Respond with wisdom, compassion, and biblical insight. Keep responses conversational and supportive.${getPersonalityPromptAddition(personalityPrefs)}`;

      const conversationHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: systemPrompt + '\n\nConversation:\n' + 
                conversationHistory.map(m => `${m.role === 'user' ? 'User' : 'Gideon'}: ${m.content}`).join('\n') +
                `\nUser: ${userMessage}\nGideon:`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      saveGideonConversation('assistant', response);

      // Extract and save key spiritual insights
      const msgCountForMemory = messages.length + 2; // +2 for user msg + response just added
      if (messages.length > 0 && msgCountForMemory % 5 === 0) {
        try {
          const memoryExtraction = await base44.integrations.Core.InvokeLLM({
            prompt: `Extract 1-2 key spiritual insights or milestones from this conversation to remember for future guidance. Return as JSON array of objects with fields: memory_type (goal/milestone/insight/success), content, context, importance (1-10).

Conversation:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
User: ${userMessage}
Assistant: ${response}`,
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
            for (const memory of memoryExtraction.memories) {
              await base44.entities.ChatbotMemory.create({
                chatbot_name: 'Gideon',
                ...memory,
                last_referenced: new Date().toISOString()
              });
            }
            queryClient.invalidateQueries({ queryKey: ['chatbotMemories', 'Gideon'] });
          }
        } catch (err) {
          console.error('Memory extraction failed:', err);
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Help me understand a Bible passage",
    "Guide me in prayer today",
    "Find verses about strength",
    "What does the Bible say about anxiety?",
    "Create a devotional plan",
    "How can I grow closer to God?"
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:opacity-90 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[min(500px,calc(100dvh-7rem))] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-[#D9B878]/20 overflow-hidden"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#c9a227] to-[#D9B878] px-5 py-5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Gideon</h3>
                  <p className="text-xs text-white/90">Your Spiritual Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
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
              <GideonQuickAskMenu
                onSelectPrompt={(prompt) => sendWithText(prompt)}
                isLoading={isLoading}
                isCollapsed={quickMenuCollapsed}
                onToggleCollapse={() => setQuickMenuCollapsed(!quickMenuCollapsed)}
              />
            )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#FFFDF7] to-white">
          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white'
                    : 'bg-[#FAD98D]/12 text-[#0A1A2F]'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm max-w-none">
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
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#FAD98D]/12 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#c9a227]" />
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
                  className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-white hover:bg-[#FFFDF7] text-[#0A1A2F] transition-colors shadow-sm border border-[#D9B878]/20"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t border-[#D9B878]/20 bg-white">
          <div className="flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Gideon about faith, Scripture, or spiritual growth..."
              className="flex-1 bg-[#FFFDF7] border-[#D9B878]/20 h-11"
              disabled={isLoading}
            />
            <VoiceInputButton
              onTranscript={(text) => setInput(prev => prev ? prev + ' ' + text : text)}
              onInterim={(text) => setInput(text)}
              disabled={isLoading}
              accentColor="bg-[#D9B878]"
              activeColor="bg-[#c9a227]"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:from-[#b89320] hover:to-[#c9a227] text-white h-11 px-5"
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