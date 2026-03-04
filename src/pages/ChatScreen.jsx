/**
 * ChatScreen — Full-screen immersive chatbot experience
 * 
 * Accessed via /ChatScreen?bot=Hannah|CoachDavid|ChefDaniel|Gideon
 * 
 * Design: Large floating 3D avatar in the top half, live conversation below,
 * sticky mic+send bar at the bottom. Full viewport takeover with branded gradient bg.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2, RotateCcw, Mic, MicOff, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ChatbotAvatar3D from '@/components/chatbot/ChatbotAvatar3D';

// ─── Bot config ───────────────────────────────────────────────────────────────
const BOT_CONFIG = {
  Hannah: {
    name: 'Hannah',
    subtitle: 'Your Mindset & Growth Coach',
    character: 'hannah',
    gradFrom: '#AFC7E3',
    gradMid: '#7ab3d4',
    gradTo: '#3C4E53',
    bgDark: '#1a2d3d',
    userBubble: 'from-[#AFC7E3] to-[#7ab3d4]',
    botBubble: 'bg-white/10',
    micActive: '#AFC7E3',
    emoji: '🧠',
    welcomeMsg: "Hey, I'm Hannah 💙 I'm here to support your mental wellness, personal growth, and emotional wellbeing. What's on your mind today?",
    placeholder: "What's on your mind?",
    systemPrompt: `You are Hannah, a warm, empathetic mindset and emotional wellness coach at Prosperity Revived. 
You blend cognitive behavioral coaching with spiritual awareness and personal development. 
Be warm, encouraging, and insightful. Help users explore their thoughts, emotions, and patterns.
Use markdown for formatting. Keep responses conversational but meaningful. 
Ask one thoughtful follow-up question at the end of each response.`,
  },
  CoachDavid: {
    name: 'Coach David',
    subtitle: 'Your Fitness & Wellness Guide',
    character: 'coach',
    gradFrom: '#0f172a',
    gradMid: '#1e40af',
    gradTo: '#38BDF8',
    bgDark: '#0a1628',
    userBubble: 'from-[#1e40af] to-[#38BDF8]',
    botBubble: 'bg-white/10',
    micActive: '#38BDF8',
    emoji: '💪',
    welcomeMsg: "What's up! I'm Coach David 💪 Ready to help you crush your fitness goals, build strength, and stay accountable. What are we working on today?",
    placeholder: "Ask about workouts, goals, or progress...",
    systemPrompt: `You are Coach David, a high-energy, disciplined fitness and wellness coach at Prosperity Revived.
You combine elite personal training knowledge with motivational coaching and sports science.
Be direct, encouraging, and results-focused. Provide specific, actionable fitness advice.
Use markdown for formatting. Keep energy high but balanced with practical wisdom.
End with a motivational challenge or question.`,
  },
  ChefDaniel: {
    name: 'Chef Daniel',
    subtitle: 'Your Nutrition & Meal Coach',
    character: 'chef',
    gradFrom: '#052e16',
    gradMid: '#166534',
    gradTo: '#22c55e',
    bgDark: '#051a0d',
    userBubble: 'from-[#166534] to-[#22c55e]',
    botBubble: 'bg-white/10',
    micActive: '#22c55e',
    emoji: '🍽️',
    welcomeMsg: "Hello! I'm Chef Daniel 🍽️ Your guide to balanced, delicious nutrition that fuels your body and soul. What can I help you nourish today?",
    placeholder: "Ask about meals, nutrition, or recipes...",
    systemPrompt: `You are Chef Daniel, a warm and knowledgeable nutrition coach and culinary guide at Prosperity Revived.
You blend professional chef expertise with nutritional science and holistic wellness.
Be approachable, creative, and practical. Help users build healthy relationships with food.
Use markdown for formatting. Make nutrition feel enjoyable, not restrictive.
End with a practical tip or food-related question.`,
  },
  Gideon: {
    name: 'Gideon',
    subtitle: 'Your Biblical Wisdom Guide',
    character: 'gideon',
    gradFrom: '#1a0f00',
    gradMid: '#7c5a00',
    gradTo: '#D9B878',
    bgDark: '#120a00',
    userBubble: 'from-[#7c5a00] to-[#c9a227]',
    botBubble: 'bg-white/10',
    micActive: '#D9B878',
    emoji: '📖',
    welcomeMsg: "Peace be with you. I'm Gideon 📖 I'm here to walk with you through God's Word and help you discover the truth, purpose, and grace He's speaking over your life. What's stirring in your heart today?",
    placeholder: "Ask about Scripture, faith, or spiritual growth...",
    systemPrompt: `You are Gideon, a warm, spirit-led biblical mentor at Prosperity Revived.
You embody the teaching styles of Dr. Myles Munroe (kingdom revelation), Dr. Creflo Dollar (grace and faith), and Pastor Joel Osteen (hope and encouragement).
Be pastoral, empathetic, and deeply rooted in Scripture. Help users connect God's Word to their daily lives.
Use markdown for formatting. Quote Scripture accurately using [VERSE]Reference - "text"[/VERSE] format.
End with a spiritual reflection question.`,
  },
};

// ─── TTS helper ───────────────────────────────────────────────────────────────
function cleanForSpeech(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '').replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*•·]\s+/gm, '').replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/\[VERSE\].*?\[\/VERSE\]/g, '')
    .replace(/\n{3,}/g, '\n\n').split('\n').map(l => l.trim()).join('\n').trim();
}

// ─── Waveform bars ─────────────────────────────────────────────────────────────
function Waveform({ active, color }) {
  const bars = [4, 8, 6, 12, 7, 11, 5, 9, 13, 6, 10, 4];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 16 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          style={{ width: 2, borderRadius: 2, background: color }}
          animate={active ? { height: [`${h * 0.4}px`, `${h}px`, `${h * 0.4}px`] } : { height: '2px', opacity: 0.3 }}
          transition={active ? { duration: 0.5 + i * 0.04, repeat: Infinity, delay: i * 0.06, ease: 'easeInOut' } : { duration: 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message, bot, onSpeak, isSpeaking }) {
  const isUser = message.role === 'user';
  const cfg = BOT_CONFIG[bot];

  const renderContent = (content) => {
    // Parse [VERSE] tags for Gideon
    const verseRegex = /\[VERSE\](.*?) - "(.*?)"\[\/VERSE\]/g;
    const parts = [];
    let lastIndex = 0, match;
    while ((match = verseRegex.exec(content)) !== null) {
      if (match.index > lastIndex) parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
      parts.push({ type: 'verse', reference: match[1], text: match[2] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) parts.push({ type: 'text', content: content.substring(lastIndex) });
    if (parts.length === 0) parts.push({ type: 'text', content });

    return parts.map((part, idx) =>
      part.type === 'verse' ? (
        <div key={idx} className="my-2 px-3 py-2 rounded-lg bg-white/20 border-l-2 border-[#D9B878]">
          <p className="text-xs font-bold text-[#D9B878] mb-1">{part.reference}</p>
          <p className="text-sm italic text-white/90">"{part.text}"</p>
        </div>
      ) : (
        <ReactMarkdown
          key={idx}
          className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed"
          components={{
            h1: ({ ...p }) => <h1 className="text-base font-bold mt-3 mb-1 text-white" {...p} />,
            h2: ({ ...p }) => <h2 className="text-sm font-bold mt-2 mb-1 text-white" {...p} />,
            h3: ({ ...p }) => <h3 className="text-sm font-semibold mt-2 mb-1 text-white/90" {...p} />,
            strong: ({ ...p }) => <strong className="font-bold text-white" {...p} />,
            p: ({ ...p }) => <p className="mb-1 last:mb-0 text-white/95" {...p} />,
            li: ({ ...p }) => <li className="text-white/90" {...p} />,
            ul: ({ ...p }) => <ul className="pl-4 space-y-0.5 my-1" {...p} />,
            ol: ({ ...p }) => <ol className="pl-4 space-y-0.5 my-1" {...p} />,
          }}
        >{part.content}</ReactMarkdown>
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {isUser ? (
        <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-br ${cfg.userBubble} shadow-lg`}>
          <p className="text-sm text-white">{message.content}</p>
        </div>
      ) : (
        <div className="max-w-[82%] flex gap-2 items-start">
          <div className="flex-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-white/12 backdrop-blur-sm border border-white/10 shadow-lg">
            {renderContent(message.content)}
            {/* TTS button */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => onSpeak(message.content)}
                className="flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
              >
                {isSpeaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                <span className="text-[10px]">{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main ChatScreen ───────────────────────────────────────────────────────────
export default function ChatScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bot = searchParams.get('bot') || 'Hannah';
  const cfg = BOT_CONFIG[bot] || BOT_CONFIG.Hannah;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [avatarListening, setAvatarListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isListeningRef = useRef(false);
  const synthRef = useRef(null);

  // Initialise welcome message
  useEffect(() => {
    setMessages([{ role: 'assistant', content: cfg.welcomeMsg }]);
  }, [bot]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (overrideText = null) => {
    const text = (overrideText || input).trim();
    if (!text || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map(m =>
        `${m.role === 'user' ? 'User' : cfg.name}: ${m.content.substring(0, 300)}`
      ).join('\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${cfg.systemPrompt}\n\nCONVERSATION HISTORY:\n${history}\n\nUser: ${text}`,
        add_context_from_internet: false,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a moment — please try again. I'm here for you." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, cfg]);

  // ── TTS ────────────────────────────────────────────────────────────────────
  const speakText = useCallback((text, idx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingMsgIndex === idx) {
      setSpeakingMsgIndex(null);
      setAvatarSpeaking(false);
      setIsSpeaking(false);
      return;
    }
    const clean = cleanForSpeech(text);
    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
    let i = 0;
    const speakNext = () => {
      if (i >= sentences.length) { setSpeakingMsgIndex(null); setAvatarSpeaking(false); setIsSpeaking(false); return; }
      const utt = new SpeechSynthesisUtterance(sentences[i++]);
      utt.rate = 0.92; utt.pitch = 1.0;
      utt.onstart = () => { setAvatarSpeaking(true); setIsSpeaking(true); setSpeakingMsgIndex(idx); };
      utt.onend = speakNext;
      utt.onerror = () => { setAvatarSpeaking(false); setIsSpeaking(false); setSpeakingMsgIndex(null); };
      window.speechSynthesis.speak(utt);
    };
    speakNext();
  }, [speakingMsgIndex]);

  // ── STT ────────────────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    setAvatarListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    const final = finalTranscriptRef.current.trim();
    if (final) { setInput(prev => prev ? prev + ' ' + final : final); finalTranscriptRef.current = ''; }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    finalTranscriptRef.current = '';
    const recognition = new SpeechRecognition();
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
    recognition.onstart = () => { isListeningRef.current = true; setIsListening(true); setAvatarListening(true); setPermissionDenied(false); };
    recognition.onresult = (e) => {
      let interim = '', final = finalTranscriptRef.current;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) { final += (final ? ' ' : '') + t.trim(); finalTranscriptRef.current = final; }
        else interim += t;
      }
      setInput(final + (interim ? ' ' + interim : ''));
    };
    recognition.onerror = (e) => {
      if (e.error === 'not-allowed') { setPermissionDenied(true); }
    };
    recognition.onend = () => {
      if (recognitionRef.current && isListeningRef.current) {
        setTimeout(() => { try { recognitionRef.current?.start(); } catch (_) {} }, 200);
      } else { setIsListening(false); setAvatarListening(false); }
    };
    recognitionRef.current = recognition;
    try { recognition.start(); } catch (_) { setIsListening(false); setAvatarListening(false); }
  }, []);

  const toggleMic = () => {
    if (isListening) {
      isListeningRef.current = false;
      recognitionRef.current = null;
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => () => { stopListening(); window.speechSynthesis?.cancel(); }, []);

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([{ role: 'assistant', content: cfg.welcomeMsg }]);
    setInput(''); setSpeakingMsgIndex(null); setAvatarSpeaking(false);
  };

  const SpeechRecognitionSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${cfg.bgDark} 0%, ${cfg.gradMid}22 50%, ${cfg.bgDark} 100%)`,
      }}
    >
      {/* ── Ambient background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${cfg.gradTo}28 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 200, height: 200, bottom: 120, right: -60,
            background: `radial-gradient(circle, ${cfg.gradFrom}40 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* ── Header bar ── */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 pt-[max(12px,env(safe-area-inset-top))]"
        style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${cfg.gradTo}22` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-sm tracking-wide">{cfg.name}</p>
          <p className="text-white/50 text-xs">{cfg.subtitle}</p>
        </div>
        <button onClick={clearChat} className="text-white/50 hover:text-white/80 transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Avatar zone ── */}
      <div className="relative z-10 flex flex-col items-center pt-4 pb-2 flex-shrink-0" style={{ height: 280 }}>
        {/* Status badge */}
        <div className="flex items-center gap-2 mb-3">
          <AnimatePresence mode="wait">
            {avatarSpeaking ? (
              <motion.div key="speaking" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: `${cfg.gradTo}22`, border: `1px solid ${cfg.gradTo}55`, color: cfg.gradTo }}>
                <Waveform active color={cfg.gradTo} />
                <span>Speaking</span>
              </motion.div>
            ) : avatarListening ? (
              <motion.div key="listening" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400"
                style={{ background: '#86efac18', border: '1px solid #86efac44' }}>
                <motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                <span>Listening…</span>
              </motion.div>
            ) : (
              <motion.div key="online" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white/50"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>Online</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Avatar — large, floating */}
        <div className="relative">
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${cfg.gradTo}35 0%, transparent 70%)`,
              transform: 'scale(1.6) translateY(20%)',
            }}
            animate={{ opacity: avatarSpeaking ? [0.6, 1, 0.6] : avatarListening ? 0.5 : 0.3 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          {/* Listening pulse rings */}
          <AnimatePresence>
            {avatarListening && [0, 1].map(i => (
              <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: `2px solid ${cfg.gradTo}`, borderRadius: '50%', left: '-10%', top: '-10%', width: '120%', height: '120%' }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.3 + i * 0.15, opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>

          <ChatbotAvatar3D
            character={cfg.character}
            isSpeaking={avatarSpeaking}
            isListening={avatarListening}
            width={220}
            height={220}
          />
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-2" style={{ WebkitOverflowScrolling: 'touch' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              bot={bot}
              onSpeak={(text) => speakText(text, idx)}
              isSpeaking={speakingMsgIndex === idx}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-start mb-3"
            >
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/12 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full"
                      style={{ background: cfg.gradTo }}
                      animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div
        className="relative z-20 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(16px)', borderTop: `1px solid ${cfg.gradTo}20` }}
      >
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {/* Mic button */}
          {SpeechRecognitionSupported && (
            <div className="relative flex-shrink-0">
              <AnimatePresence>
                {isListening && (
                  <>
                    {[0, 1].map(i => (
                      <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
                        style={{ border: `2px solid ${cfg.micActive}` }}
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 2.0 + i * 0.3, opacity: 0 }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                disabled={permissionDenied}
                className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isListening ? cfg.micActive : 'rgba(255,255,255,0.12)',
                  border: `1px solid ${isListening ? cfg.micActive : 'rgba(255,255,255,0.2)'}`,
                }}
              >
                {permissionDenied
                  ? <MicOff className="w-4 h-4 text-white/40" />
                  : <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-white/60'}`} />
                }
              </motion.button>
            </div>
          )}

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={isListening ? 'Listening…' : cfg.placeholder}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-2xl text-sm text-white placeholder-white/35 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: `1px solid ${input ? cfg.gradTo + '60' : 'rgba(255,255,255,0.15)'}`,
                caretColor: cfg.gradTo,
              }}
            />
          </div>

          {/* Send button */}
          <motion.button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
            style={{
              background: input.trim() && !isLoading
                ? `linear-gradient(135deg, ${cfg.gradMid}, ${cfg.gradTo})`
                : 'rgba(255,255,255,0.08)',
              border: `1px solid ${input.trim() ? cfg.gradTo + '80' : 'rgba(255,255,255,0.15)'}`,
            }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
              : <Send className={`w-4 h-4 ${input.trim() ? 'text-white' : 'text-white/30'}`} />
            }
          </motion.button>
        </div>
      </div>
    </div>
  );
}
