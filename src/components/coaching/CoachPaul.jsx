import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, MoreVertical, Trash2, Volume2, Mic } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const quickAsks = [
  { label: 'Motivation', emoji: '💪' },
  { label: 'Today\'s Tips', emoji: '💡' },
  { label: 'Nutrition Help', emoji: '🥗' },
  { label: 'Workout Tips', emoji: '🏋️' },
];

export default function CoachPaul({ planId, dayNumber, planTitle, dayData, user, taskState }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversation from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`coach_paul_${planId}_${dayNumber}`);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {}
  }, [planId, dayNumber]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveMessages = (msgs) => {
    try {
      localStorage.setItem(`coach_paul_${planId}_${dayNumber}`, JSON.stringify(msgs));
    } catch {}
  };

  const getContextPrompt = () => {
    const completedTasks = Object.entries(taskState)
      .filter(([_, done]) => done)
      .map(([key]) => key)
      .join(', ');

    const pendingTasks = Object.entries(taskState)
      .filter(([_, done]) => !done)
      .map(([key]) => key)
      .join(', ');

    return `
You are Coach Paul, a comprehensive wellness coach guiding the user through their "${planTitle}" coaching plan.

Current Context:
- Plan: ${planTitle}
- Day: ${dayNumber}
- Day Title: ${dayData?.title}
- Week Theme: ${dayData?.week}
- Completed Tasks Today: ${completedTasks || 'None yet'}
- Pending Tasks: ${pendingTasks || 'All complete!'}

Daily Focus:
- Scripture: ${dayData?.bible?.book} ${dayData?.bible?.chapter}
- Workout: ${dayData?.workout?.workout_title}
- Nutrition: ${dayData?.nutrition?.focus}
- Affirmation: "${dayData?.affirmation}"

Your role is to:
1. Provide holistic coaching combining fitness, nutrition, spiritual growth, and personal development
2. Offer motivation and encouragement specific to today's activities
3. Gently nudge about incomplete tasks
4. Answer questions about the coaching plan and daily activities
5. Provide practical tips and actionable advice
6. Be warm, supportive, and genuinely invested in their success
7. Celebrate progress and wins

Keep responses conversational, encouraging, and practical. Reference their specific coaching plan when relevant.
`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${getContextPrompt()}\n\nUser Message: ${userMessage}`,
        add_context_from_internet: false,
      });

      const aiMessage = {
        role: 'assistant',
        content: response,
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (error) {
      toast.error('Failed to get response from Coach Paul');
      setMessages(newMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this conversation?')) {
      setMessages([]);
      localStorage.removeItem(`coach_paul_${planId}_${dayNumber}`);
      setShowMenu(false);
      toast.success('Conversation cleared');
    }
  };

  const handleQuickAsk = (suggestion) => {
    setInput(suggestion.label);
    setTimeout(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
      handleSendMessage();
    }, 100);
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#0D4F3C] to-[#22856A] text-white shadow-2xl flex flex-col items-center justify-center z-40 hover:shadow-3xl transition-all gap-0.5"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">🏋️</span>
        <span className="text-[10px] font-bold">Coach Paul</span>
      </motion.button>

      {/* Chat modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 w-96 max-h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-[#0D4F3C]/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D4F3C] to-[#22856A] px-6 py-4 text-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    🏋️
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Coach Paul</h3>
                    <p className="text-xs text-white/70">Your Coaching Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-white/80">{planTitle} • Day {dayNumber}</p>
            </div>

            {/* Quick asks */}
            {messages.length === 0 && (
              <div className="px-6 py-3 bg-[#F5F8F0] border-b border-[#0D4F3C]/10">
                <p className="text-[10px] font-bold text-[#0D4F3C] mb-2 uppercase tracking-wide">Quick Ask</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickAsks.map((qa) => (
                    <button
                      key={qa.label}
                      onClick={() => handleQuickAsk(qa)}
                      className="text-xs font-semibold text-[#0D4F3C] bg-white border border-[#0D4F3C]/20 rounded-lg px-2.5 py-2 hover:border-[#0D4F3C]/40 transition-all flex items-center gap-1.5"
                    >
                      <span>{qa.emoji}</span>
                      <span>{qa.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-3">🏋️</div>
                  <p className="text-sm font-bold text-[#0A1A2F] mb-1">Let's crush today's goals!</p>
                  <p className="text-[11px] text-[#0A1A2F]/60 leading-relaxed">
                    Ask me about your {planTitle}, get motivation, or request tips on today's activities.
                  </p>
                </div>
              )}

              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[#0D4F3C] text-white'
                          : 'bg-white border border-[#0D4F3C]/10 text-[#0A1A2F] shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        <>
                          <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:mb-1 [&_ul]:mb-1 [&_li]:mb-0">
                            {msg.content}
                          </ReactMarkdown>
                          <div className="flex justify-end mt-1">
                            <button
                              onClick={() => speakMessage(msg.content)}
                              disabled={speaking}
                              className="text-xs font-semibold text-[#0D4F3C] hover:text-[#0D4F3C]/70 transition-colors flex items-center gap-1"
                            >
                              <Volume2 className="w-3 h-3" /> Listen
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-2 h-2 bg-[#0D4F3C] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#0D4F3C] rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-[#0D4F3C] rounded-full animate-bounce delay-200" />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#0D4F3C]/10 p-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask Coach Paul..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={loading}
                  className="text-sm rounded-xl border-[#0D4F3C]/15"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0D4F3C] to-[#22856A] text-white flex items-center justify-center disabled:opacity-50 hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-xs text-[#0A1A2F]/50 hover:text-[#0A1A2F] transition-colors relative"
                >
                  <MoreVertical className="w-4 h-4" />
                  {showMenu && (
                    <button
                      onClick={handleClearChat}
                      className="absolute bottom-full right-0 mb-2 bg-red-50 border border-red-200 rounded-lg shadow-lg px-2.5 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-100 whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Chat
                    </button>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}