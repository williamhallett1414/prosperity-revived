import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Send, Loader2, Map, BookOpen, Play, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const QUICK_ACTIONS = [
  {
    icon: Map,
    label: 'Take the guided tour',
    sub: 'Walk through every feature',
    color: '#38BDF8',
    action: 'tour',
  },
  {
    icon: BookOpen,
    label: 'What can this app do?',
    sub: 'Get a quick overview',
    color: '#C9A227',
    action: 'ask',
    prompt: 'Give me a quick overview of everything this app can do.',
  },
  {
    icon: Play,
    label: 'How do I start a workout?',
    sub: 'Fitness & training help',
    color: '#38BDF8',
    action: 'ask',
    prompt: 'How do I start a workout in this app?',
  },
];

export default function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your App Guide. Ask me anything, or tap a quick action below to get started 👇",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (overridePrompt) => {
    const userMessage = (overridePrompt || input).trim();
    if (!userMessage || loading) return;
    setInput('');
    setShowQuickActions(false);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a friendly in-app guide for "Prosperity Revived," a Christian wellness app. Keep answers to 2-3 sentences max. Be warm and direct.

App features:
- Home: Start/End My Day ritual, daily verse, progress ring, AI coach nudges
- Bible: Full 66-book reader, Gideon AI spiritual guide, study guides, devotionals, bookmarks, topic search
- Wellness: 33+ workouts (HIIT/strength/cardio/flexibility/yoga), workout trends, nutrition tracking, meal logging, water tracker, 30-day challenges, 8-week coaching programs
- Personal Growth: Habit builder, emotional check-in, gratitude journal, identity in Christ affirmations, guided meditations, Hannah AI growth coach
- Community: Groups (Bible study/workout/prayer), community feed, leaderboards, friends
- Profile: Progress dashboard, achievements, journal, settings
- 4 AI coaches: Hannah (growth), Gideon (spiritual), Coach David (fitness), Chef Daniel (nutrition)

User question: "${userMessage}"`,
        response_json_schema: {
          type: 'object',
          properties: { answer: { type: 'string' } },
        },
      });
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.answer || "I can help you find any feature — just ask!" },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, try asking again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action.action === 'tour') {
      setIsOpen(false);
      setTimeout(() => {
        if (window.__startGuidedTour) window.__startGuidedTour();
      }, 300);
    } else {
      handleSend(action.prompt);
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onPointerDown={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 w-13 h-13 rounded-full shadow-xl flex items-center justify-center z-50"
            style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)',
            }}
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-4 w-[320px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100"
            style={{ maxHeight: '72vh' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0A1A2F, #3C4E53)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">App Guide</p>
                  <p className="text-white/45 text-[10px] mt-0.5">Ask anything · Take a tour</p>
                </div>
              </div>
              <button
                onPointerDown={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === 'user'
                        ? 'text-white text-sm'
                        : 'bg-gray-100 text-[#0A1A2F] text-sm'
                    }`}
                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)', color: '#0A1A2F' } : {}}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {/* Quick action cards — shown only initially */}
              {showQuickActions && (
                <div className="space-y-2 pt-1">
                  {QUICK_ACTIONS.map((qa) => {
                    const Icon = qa.icon;
                    return (
                      <motion.button
                        key={qa.label}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        onPointerDown={() => handleQuickAction(qa)}
                        className="w-full flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl px-3 py-2.5 text-left active:scale-97 transition-all"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: qa.color + '20' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: qa.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0A1A2F] text-xs leading-tight">{qa.label}</p>
                          <p className="text-gray-400 text-[10px]">{qa.sub}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FD9C2D]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything…"
                className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-[#0A1A2F] outline-none border border-gray-200 focus:border-[#FD9C2D] transition-colors placeholder:text-gray-400"
                disabled={loading}
              />
              <button
                onPointerDown={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)' }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
