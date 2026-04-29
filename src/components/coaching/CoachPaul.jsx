import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, MoreVertical, Trash2, Volume2, StopCircle, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

// Fix #3 — week number → meaningful theme name
const WEEK_THEME_NAMES = {
  1: 'Foundation — Know Your Why',
  2: 'Body — Temple Strong',
  3: 'Mind — Renew Your Mind',
  4: 'Spirit — Deeper Waters',
  5: 'Nutrition — Fuel the Mission',
  6: 'Habits — Daily Discipline',
  7: 'Community — Iron Sharpens Iron',
  8: 'Legacy — Living Your Purpose',
};

const quickAsks = [
  { label: 'Motivate me for today', emoji: '💪' },
  { label: "What's my focus today?", emoji: '💡' },
  { label: 'Help with nutrition', emoji: '🥗' },
  { label: 'Workout advice', emoji: '🏋️' },
];

export default function CoachPaul({ planId, dayNumber, planTitle, dayData, user, taskState }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showQuickAsks, setShowQuickAsks] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);   // Fix #14 — auto-focus
  const menuRef = useRef(null);    // Fix #6 — outside click

  // Fix #10 — key by plan+week, not per-day, so history carries through the week
  const storageKey = `coach_paul_${planId}_week${Math.ceil(dayNumber / 7)}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fix #14 — focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Fix #6 — dismiss menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const saveMessages = (msgs) => {
    try { localStorage.setItem(storageKey, JSON.stringify(msgs)); } catch {}
  };

  // Fix #2 — resolve workout title properly
  // Fix #3 — week theme name
  // Fix #12 — rich context including verse, devotion, journal prompt, motivational tip
  // Fix #13 — strong persona definition
  const getContextPrompt = () => {
    const completedTasks = Object.entries(taskState).filter(([, done]) => done).map(([k]) => k).join(', ');
    const pendingTasks = Object.entries(taskState).filter(([, done]) => !done).map(([k]) => k).join(', ');
    const workoutTitle = PREMADE_WORKOUTS.find(w => w.id === dayData?.workout?.premade_id)?.title
      || dayData?.workout?.premade_id || "today's workout";
    const weekTheme = WEEK_THEME_NAMES[dayData?.week] || `Week ${dayData?.week}`;

    return `You are Coach Paul — a seasoned pastor-coach who blends spiritual depth with practical whole-life transformation. You speak with the directness of a coach who believes in people, the grounded warmth of a pastor, and the precision of someone who has lived through real change. You are never preachy, never generic, and always purposeful. You reference Scripture naturally, not performatively. You challenge gently, celebrate honestly, and always bring people back to their "why."

PLAN CONTEXT:
- Plan: ${planTitle}
- Day ${dayNumber} — "${dayData?.title}"
- Week ${dayData?.week}: ${weekTheme}
- Completed today: ${completedTasks || 'none yet'}
- Still pending: ${pendingTasks || 'all done — well done!'}

TODAY'S CONTENT:
Scripture: ${dayData?.bible?.book} ${dayData?.bible?.chapter}:${dayData?.bible?.verse_range}
Key Verse: "${dayData?.bible?.key_verse}"
Devotion: ${dayData?.bible?.devotion}
Reflection: ${dayData?.bible?.reflection_q}
Workout: ${workoutTitle} — "${dayData?.workout?.motivational_tip}"
Coach note: ${dayData?.workout?.coach_note}
Nutrition: ${dayData?.nutrition?.focus} (${dayData?.nutrition?.meal_theme}) — ${dayData?.nutrition?.tip}
Journal Prompt: "${dayData?.journal?.prompt}"
Affirmation: "${dayData?.affirmation}"

STYLE RULES:
- 3–5 sentences max unless the user asks for more detail
- Reference today's specific content, not generic platitudes
- Gently acknowledge incomplete tasks without nagging
- Always ground encouragement in the day's Scripture or theme`;
  };

  // Fix #1 — pass full conversation history to LLM
  // Fix #5 — keep user message on error, show retry
  const handleSendMessage = async (overrideText) => {
    const userMessage = (overrideText || input).trim();
    if (!userMessage || loading) return;

    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const conversationHistory = newMessages.slice(-6)
      .map(m => `${m.role === 'user' ? 'User' : 'Coach Paul'}: ${m.content}`)
      .join('\n');

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${getContextPrompt()}\n\nConversation so far:\n${conversationHistory}\n\nCoach Paul:`,
        add_context_from_internet: false,
      });
      const updatedMessages = [...newMessages, { role: 'assistant', content: response }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch {
      // Fix #5 — keep message visible with retry option
      setMessages([...newMessages, { role: 'assistant', content: null, failed: true, retryText: userMessage }]);
      toast.error('Coach Paul is unavailable right now. Tap retry to try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this conversation?')) {
      setMessages([]);
      localStorage.removeItem(storageKey);
      setShowMenu(false);
      setShowQuickAsks(true);
      toast.success('Conversation cleared');
    }
  };

  const handleQuickAsk = (qa) => handleSendMessage(qa.label);

  // Fix #4 — cancel any playing TTS before starting new; expose stop button
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const speakMessage = (text) => {
    if (!('speechSynthesis' in window)) return;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Fix #7 — contextual welcome message on first open
  const handleOpen = useCallback(() => {
    setOpen(true);
    if (!hasOpened && messages.length === 0) {
      setHasOpened(true);
      const completedCount = Object.values(taskState).filter(Boolean).length;
      const totalTasks = Object.keys(taskState).length;
      const weekTheme = WEEK_THEME_NAMES[dayData?.week] || `Week ${dayData?.week}`;
      const greeting = completedCount > 0
        ? `Day ${dayNumber} — you've already knocked out ${completedCount} of ${totalTasks} tasks. Solid. What do you need from me for the rest of today?`
        : `Day ${dayNumber}: "${dayData?.title}". You're in ${weekTheme}. Today's anchor is ${dayData?.bible?.book} ${dayData?.bible?.chapter} and you've got ${PREMADE_WORKOUTS.find(w => w.id === dayData?.workout?.premade_id)?.title || 'your workout'} on deck. Where do you want to start?`;

      setTimeout(() => {
        const welcome = [{ role: 'assistant', content: greeting }];
        setMessages(welcome);
        saveMessages(welcome);
      }, 350);
    }
  }, [hasOpened, messages.length, dayNumber, dayData, taskState]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-[#c9a227] to-[#C9A227] hover:opacity-90 text-white rounded-full shadow-lg dark:shadow-none flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: open ? 0 : 1 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[min(500px,calc(100dvh-7rem))] bg-white dark:bg-white/5 rounded-2xl shadow-2xl flex flex-col z-50 border border-[#c9a227]/30 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#c9a227] to-[#C9A227] text-white p-5 rounded-t-2xl flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Coach Paul</h3>
                  <p className="text-xs text-white/80">{planTitle} · Day {dayNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white mb-1">Coach Paul is ready</p>
                  <p className="text-[11px] text-[#0A1A2F]/60 dark:text-white/60 leading-relaxed">
                    Ask anything about today's plan or tap a quick ask below.
                  </p>
                </div>
              )}

              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Fix #5 — failed message with retry */}
                    {msg.failed ? (
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-red-50 border border-red-200">
                        <p className="text-xs text-red-600 mb-1.5">Couldn't reach Coach Paul.</p>
                        <button
                          onClick={() => {
                            setMessages(prev => prev.filter((_, i) => i !== idx));
                            handleSendMessage(msg.retryText);
                          }}
                          className="text-xs font-bold text-red-600 underline"
                        >
                          Tap to retry
                        </button>
                      </div>
                    ) : (
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#c9a227] to-[#C9A227] text-white'
                          : 'bg-white dark:bg-white/5 border border-[#c9a227]/30 text-[#0A1A2F] dark:text-white dark:text-white'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : (
                          <>
                            <ReactMarkdown className="text-sm prose prose-sm max-w-none text-gray-800 dark:text-gray-100 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:mb-1 [&_ul]:mb-1 [&_li]:mb-0">
                              {msg.content}
                            </ReactMarkdown>
                            {/* Fix #4 — listen/stop toggle per message */}
                            <div className="flex justify-end mt-1.5">
                              {speaking ? (
                                <button
                                  onClick={stopSpeaking}
                                  className="text-[10px] font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                                >
                                  <StopCircle className="w-3 h-3" /> Stop
                                </button>
                              ) : (
                                <button
                                  onClick={() => speakMessage(msg.content)}
                                  className="text-[10px] font-semibold text-[#C9A227] hover:text-[#c9a227] flex items-center gap-1 transition-colors"
                                >
                                  <Volume2 className="w-3 h-3" /> Listen
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Fix #11 — typing indicator with name */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#c9a227] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 font-medium">Coach Paul is typing…</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Fix #9 — Quick asks always accessible, collapsible */}
            <div className="flex-shrink-0 border-t border-[#c9a227]/15">
              <button
                onClick={() => setShowQuickAsks(p => !p)}
                className="w-full flex items-center justify-between px-4 py-2 bg-[#FFF9EC] hover:bg-[#FFF9EC] transition-colors"
              >
                <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wide">Quick Ask</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C9A227] transition-transform duration-200 ${showQuickAsks ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showQuickAsks && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="grid grid-cols-2 gap-2 px-4 pb-3 bg-[#FFF9EC]">
                      {quickAsks.map((qa) => (
                        <button
                          key={qa.label}
                          onClick={() => handleQuickAsk(qa)}
                          disabled={loading}
                          className="text-xs font-semibold text-[#C9A227] bg-white dark:bg-white/5 border border-[#c9a227]/30 rounded-lg px-2.5 py-2 hover:border-[#c9a227]/60 transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <span>{qa.emoji}</span>
                          <span className="truncate">{qa.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-[#c9a227]/20 p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask Coach Paul…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                  }}
                  disabled={loading}
                  className="text-sm rounded-xl border-[#c9a227]/25 focus:border-[#c9a227]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#C9A227] text-white flex items-center justify-center disabled:opacity-50 hover:shadow-lg dark:shadow-none transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Fix #6 — menu with outside-click ref */}
              <div className="flex items-center px-1 mt-2">
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(p => !p)}
                    className="text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F] dark:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {showMenu && (
                    <button
                      onClick={handleClearChat}
                      className="absolute bottom-full left-0 mb-2 bg-red-50 border border-red-200 rounded-lg shadow-lg dark:shadow-none px-2.5 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-100 whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
