import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Send, X, Loader2, Sparkles, MessageCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { getPersonalityPromptAddition, fetchUserPreferences } from '../chatbot/PersonalityAdapter';
import GideonQuickAskMenu from './GideonQuickAskMenu';
import ProactiveSuggestionBanner from '../chatbot/ProactiveSuggestionBanner';

export default function GideonChatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personalityPrefs, setPersonalityPrefs] = useState(null);
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
    setInput(promptAction);
  };

  const handleDismissSuggestion = () => {
    if (proactiveSuggestions[0]) {
      markSuggestionReadMutation.mutate(proactiveSuggestions[0].id);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

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

      // Extract and save key spiritual insights
      if (messages.length > 0 && messages.length % 5 === 0) {
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
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
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
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-5 rounded-t-2xl flex items-center justify-between">
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
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
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
              <GideonQuickAskMenu
                onSelectPrompt={(prompt) => setInput(prompt)}
                isLoading={isLoading}
                isCollapsed={quickMenuCollapsed}
                onToggleCollapse={() => setQuickMenuCollapsed(!quickMenuCollapsed)}
              />
            )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-green-500" />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {messages.length === 1 && !isLoading && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Quick questions:</p>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(action)}
                  className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors shadow-sm border border-gray-200 dark:border-gray-600"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Gideon about faith, Scripture, or spiritual growth..."
              className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-11"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-11 px-5"
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