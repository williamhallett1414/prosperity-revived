import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Send, X, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function GideonChatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Peace be with you! I'm Gideon, your spiritual guide. How can I help you grow in your faith today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

Respond with wisdom, compassion, and biblical insight. Keep responses conversational and supportive.`;

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

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <BookOpen className="w-7 h-7 text-white" />
      </motion.button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full h-[600px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Gideon</h2>
                  <p className="text-sm text-white/90">Your Spiritual Guide</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-green-500" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Gideon about faith, Scripture, or spiritual growth..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
        </div>
      )}
    </>
  );
}