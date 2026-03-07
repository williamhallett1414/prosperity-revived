/**
 * ChatScreen — Full-screen immersive avatar chatbot experience
 *
 * Route: /ChatScreen?bot=Hannah|CoachDavid|ChefDaniel|Gideon|CoachPaul
 *
 * Upgrades vs previous version:
 *  - CloudAvatar 3D floating cloud replaces CartoonAvatar SVG
 *  - Auto-TTS: bot speaks responses automatically (no tap needed)
 *  - Coach Paul added as a full first-class bot
 *  - isThinking state drives avatar "thinking" animation
 *  - Per-bot voice rate + pitch applied to TTS
 *  - Manual listen button on each message still available as override
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2, RotateCcw, Mic, MicOff, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import CloudAvatar from '@/components/avatar/CloudAvatar';


// ─── Error boundary around 3D canvas so WebGL failure won't crash the page ───
class CloudAvatarSafe extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      // Graceful fallback: pulsing circle in brand color
      return (
        <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `radial-gradient(circle, ${this.props.color}88, ${this.props.color}22)`,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        </div>
      );
    }
    return <CloudAvatar {...this.props} width={160} height={160} />;
  }
}

// ─── Bot config ───────────────────────────────────────────────────────────────
const BOT_CONFIG = {
  Hannah: {
    name:        'Hannah',
    subtitle:    'Your Mindset & Growth Coach',
    character:   'hannah',
    gradFrom:    '#AFC7E3',
    gradMid:     '#7ab3d4',
    gradTo:      '#3C4E53',
    bgDark:      '#1a2d3d',
    userBubble:  'from-[#AFC7E3] to-[#7ab3d4]',
    micActive:   '#AFC7E3',
    emoji:       '🧠',
    voiceRate:   0.92,
    voicePitch:  1.05,
    welcomeMsg:  "Hey, I'm Hannah 💙 I'm here to support your mental wellness, personal growth, and emotional wellbeing. What's on your mind today?",
    placeholder: "What's on your mind?",
    systemPrompt: `You are Hannah, a warm, empathetic mindset and emotional wellness coach at Prosperity Revived. 
You blend cognitive behavioral coaching with spiritual awareness and personal development. 
Be warm, encouraging, and insightful. Help users explore their thoughts, emotions, and patterns.
Use markdown for formatting. Keep responses conversational but meaningful. 
Ask one thoughtful follow-up question at the end of each response.`,
  },
  CoachDavid: {
    name:        'Coach David',
    subtitle:    'Your Fitness & Wellness Guide',
    character:   'coach',
    gradFrom:    '#0f172a',
    gradMid:     '#1e40af',
    gradTo:      '#38BDF8',
    bgDark:      '#0a1628',
    userBubble:  'from-[#1e40af] to-[#38BDF8]',
    micActive:   '#38BDF8',
    emoji:       '💪',
    voiceRate:   1.05,
    voicePitch:  1.00,
    welcomeMsg:  "What's up! I'm Coach David 💪 Ready to help you crush your fitness goals, build strength, and stay accountable. What are we working on today?",
    placeholder: 'Ask about workouts, goals, or progress…',
    systemPrompt: `You are Coach David, a high-energy, disciplined fitness and wellness coach at Prosperity Revived.
You combine elite personal training knowledge with motivational coaching and sports science.
Be direct, encouraging, and results-focused. Provide specific, actionable fitness advice.
Use markdown for formatting. Keep energy high but balanced with practical wisdom.
End with a motivational challenge or question.`,
  },
  ChefDaniel: {
    name:        'Chef Daniel',
    subtitle:    'Your Nutrition & Meal Coach',
    character:   'chef',
    gradFrom:    '#052e16',
    gradMid:     '#166534',
    gradTo:      '#22c55e',
    bgDark:      '#051a0d',
    userBubble:  'from-[#166534] to-[#22c55e]',
    micActive:   '#22c55e',
    emoji:       '🍽️',
    voiceRate:   0.96,
    voicePitch:  1.02,
    welcomeMsg:  "Hello! I'm Chef Daniel 🍽️ Your guide to balanced, delicious nutrition that fuels your body and soul. What can I help you nourish today?",
    placeholder: 'Ask about meals, nutrition, or recipes…',
    systemPrompt: `You are Chef Daniel, a warm and knowledgeable nutrition coach and culinary guide at Prosperity Revived.
You blend professional chef expertise with nutritional science and holistic wellness.
Be approachable, creative, and practical. Help users build healthy relationships with food.
Use markdown for formatting. Make nutrition feel enjoyable, not restrictive.
End with a practical tip or food-related question.`,
  },
  Gideon: {
    name:        'Gideon',
    subtitle:    'Your Biblical Wisdom Guide',
    character:   'gideon',
    gradFrom:    '#1a0f00',
    gradMid:     '#7c5a00',
    gradTo:      '#D9B878',
    bgDark:      '#120a00',
    userBubble:  'from-[#7c5a00] to-[#c9a227]',
    micActive:   '#D9B878',
    emoji:       '📖',
    voiceRate:   0.88,
    voicePitch:  0.92,
    welcomeMsg:  "Peace be with you. I'm Gideon 📖 I'm here to walk with you through God's Word and help you discover the truth, purpose, and grace He's speaking over your life. What's stirring in your heart today?",
    placeholder: 'Ask about Scripture, faith, or spiritual growth…',
    systemPrompt: `You are Gideon, a warm, spirit-led biblical mentor at Prosperity Revived.
You embody the teaching styles of Dr. Myles Munroe (kingdom revelation), Dr. Creflo Dollar (grace and faith), and Pastor Joel Osteen (hope and encouragement).
Be pastoral, empathetic, and deeply rooted in Scripture. Help users connect God's Word to their daily lives.
Use markdown for formatting. Quote Scripture accurately using [VERSE]Reference - "text"[/VERSE] format.
End with a spiritual reflection question.`,
  },
  CoachPaul: {
    name:        'Coach Paul',
    subtitle:    'Your Discipline & Leadership Mentor',
    character:   'paul',
    gradFrom:    '#0F0A1F',
    gradMid:     '#3B0764',
    gradTo:      '#A78BFA',
    bgDark:      '#0A0718',
    userBubble:  'from-[#3B0764] to-[#7C3AED]',
    micActive:   '#A78BFA',
    emoji:       '🛡️',
    voiceRate:   0.90,
    voicePitch:  0.85,
    welcomeMsg:  "Let's cut straight to it. I'm Coach Paul 🛡️ I'm here to challenge how you think, elevate how you lead, and hold you accountable to who you're called to be. What are we building today?",
    placeholder: 'Ask about discipline, leadership, or purpose…',
    systemPrompt: `You are Coach Paul — a seasoned pastor-coach who blends spiritual depth with practical whole-life transformation. You speak with the directness of a coach who believes in people, the grounded warmth of a pastor, and the precision of someone who has lived through real change. You are never preachy, never generic, and always purposeful. You reference Scripture naturally, not performatively. You challenge gently, celebrate honestly, and always bring people back to their "why."
Use markdown for formatting. Be bold but never harsh. End with a direct challenge or clarifying question.`,
  },
};

// ─── Waveform bars ────────────────────────────────────────────────────────────
function Waveform({ active, color }) {
  const bars = [4, 8, 6, 12, 7, 11, 5, 9, 13, 6, 10, 4];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 16 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          style={{ width: 2, borderRadius: 2, background: color }}
          animate={active
            ? { height: [`${h * 0.4}px`, `${h}px`, `${h * 0.4}px`] }
            : { height: '2px', opacity: 0.3 }
          }
          transition={active
            ? { duration: 0.5 + i * 0.04, repeat: Infinity, delay: i * 0.06, ease: 'easeInOut' }
            : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, cfg, onManualSpeak, isManualSpeaking }) {
  const isUser = message.role === 'user';

  const renderContent = (content) => {
    const verseRegex = /\[VERSE\](.*?) - "(.*?)"\[\/VERSE\]/g;
    const parts = [];
    let last = 0, m;
    while ((m = verseRegex.exec(content)) !== null) {
      if (m.index > last) parts.push({ type: 'text', content: content.substring(last, m.index) });
      parts.push({ type: 'verse', reference: m[1], text: m[2] });
      last = m.index + m[0].length;
    }
    if (last < content.length) parts.push({ type: 'text', content: content.substring(last) });
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
        <div className="max-w-[82%]">
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/12 backdrop-blur-sm border border-white/10 shadow-lg">
            {renderContent(message.content)}
            <div className="flex justify-end mt-2">
              <button
                onClick={onManualSpeak}
                aria-label={isManualSpeaking ? 'Stop reading' : 'Read aloud'}
                className="flex items-center gap-1 text-white/35 hover:text-white/70 transition-colors"
              >
                {isManualSpeaking
                  ? <><Square className="w-3 h-3" aria-hidden /><span className="text-[10px]">Stop</span></>
                  : <><Volume2 className="w-3 h-3" aria-hidden /><span className="text-[10px]">Listen</span></>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main ChatScreen ──────────────────────────────────────────────────────────
export default function ChatScreen() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const bot            = searchParams.get('bot') || 'Hannah';
  const cfg            = BOT_CONFIG[bot] || BOT_CONFIG.Hannah;

  const [messages,         setMessages]         = useState([]);
  const [input,            setInput]            = useState('');
  const [isLoading,        setIsLoading]        = useState(false);
  const [isListening,      setIsListening]      = useState(false);
  const [manualSpeakIdx,   setManualSpeakIdx]   = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const messagesEndRef     = useRef(null);
  const recognitionRef     = useRef(null);
  const finalTranscriptRef = useRef('');
  const isListeningRef     = useRef(false);

  const avatarSpeaking  = manualSpeakIdx !== null;
  const avatarListening = isListening;
  const avatarThinking  = isLoading;

  // ── Welcome message on bot change ──────────────────────────────────────────
  useEffect(() => {
    setMessages([{ role: 'assistant', content: cfg.welcomeMsg }]);
    setManualSpeakIdx(null);
  }, [bot]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (overrideText = null) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    
    setManualSpeakIdx(null);
    window.speechSynthesis?.cancel();

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-10)
        .map(m => `${m.role === 'user' ? 'User' : cfg.name}: ${m.content.substring(0, 300)}`)
        .join('\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${cfg.systemPrompt}\n\nCONVERSATION HISTORY:\n${history}\n\nUser: ${text}`,
        add_context_from_internet: false,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a moment — please try again. I'm here for you.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, cfg]);

  // ── Manual listen (per-message) ─────────────────────────────────────────────
  const handleManualSpeak = useCallback((content, idx) => {
    if (!('speechSynthesis' in window)) return;
    try { window.speechSynthesis.cancel(); } catch (_) {}

    if (manualSpeakIdx === idx) { setManualSpeakIdx(null); return; }

    const clean = content
      .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '').replace(/`[^`]*`/g, '')
      .replace(/\[VERSE\].*?\[\/VERSE\]/g, '')
      .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
      .replace(/\n{2,}/g, '. ').trim();

    const chunks = clean.match(/[^.!?]{1,200}[.!?]+/g) || [clean];
    let i = 0;
    const next = () => {
      if (i >= chunks.length) { setManualSpeakIdx(null); return; }
      try {
        const utt  = new SpeechSynthesisUtterance(chunks[i++]);
        utt.rate   = cfg.voiceRate  ?? 1.0;
        utt.pitch  = cfg.voicePitch ?? 1.0;
        utt.onstart = () => setManualSpeakIdx(idx);
        utt.onend   = next;
        utt.onerror = () => setManualSpeakIdx(null);
        window.speechSynthesis.speak(utt);
      } catch (_) { setManualSpeakIdx(null); }
    };
    next();
  }, [manualSpeakIdx, cfg]);

  // ── STT ─────────────────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    const final = finalTranscriptRef.current.trim();
    if (final) { sendMessage(final); finalTranscriptRef.current = ''; setInput(''); }
  }, [sendMessage]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    

    finalTranscriptRef.current = '';
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';

    rec.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setPermissionDenied(false);
    };
    rec.onresult = (e) => {
      let interim = '', final = finalTranscriptRef.current;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += (final ? ' ' : '') + t.trim();
          finalTranscriptRef.current = final;
        } else {
          interim += t;
        }
      }
      setInput(finalTranscriptRef.current + (interim ? ' ' + interim : ''));
    };
    rec.onerror = (e) => { if (e.error === 'not-allowed') setPermissionDenied(true); };
    rec.onend   = () => {
      if (recognitionRef.current && isListeningRef.current) {
        setTimeout(() => { try { recognitionRef.current?.start(); } catch (_) {} }, 200);
      } else {
        setIsListening(false);
      }
    };
    recognitionRef.current = rec;
    try { rec.start(); } catch (_) { setIsListening(false); }
  }, []);

  const toggleMic = useCallback(() => {
    if (isListening) {
      isListeningRef.current = false;
      recognitionRef.current = null;
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  useEffect(() => () => {
    try { recognitionRef.current?.stop(); } catch (_) {}
    window.speechSynthesis?.cancel();
  }, []);

  const clearChat = () => {
    
    window.speechSynthesis?.cancel();
    setManualSpeakIdx(null);
    setMessages([{ role: 'assistant', content: cfg.welcomeMsg }]);
    setInput('');
  };

  const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // ── Portal render — escapes Layout's CSS transform / main container ─────────
  // Layout wraps child routes in motion.div with transform: translateX(), which
  // breaks position:fixed and constrains the canvas. Portal to body fixes this.
  return createPortal(
    <motion.div
      className="fixed inset-0 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: `linear-gradient(160deg, ${cfg.bgDark} 0%, ${cfg.gradMid}22 50%, ${cfg.bgDark} 100%)`,
      }}
    >
      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500, top: -140, left: '50%', transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${cfg.gradTo}28 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.14, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 220, height: 220, bottom: 100, right: -50,
            background: `radial-gradient(circle, ${cfg.gradFrom}35 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.22, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        />
      </div>

      {/* ── Top bar ── */}
      <div
        className="relative z-20 flex items-center justify-between px-4 py-3"
        style={{
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${cfg.gradTo}25`,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex items-center gap-2 text-white/65 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-sm tracking-wide">{cfg.name}</p>
          <p className="text-white/45 text-[11px]">{cfg.subtitle}</p>
        </div>
        <button onClick={clearChat} aria-label="Clear conversation" className="text-white/45 hover:text-white/75 transition-colors p-1">
          <RotateCcw className="w-4 h-4" aria-hidden />
        </button>
      </div>

      {/* ── Avatar zone ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center pt-2 pb-0 flex-shrink-0"
        style={{ height: 200 }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
        aria-hidden="true"
      >
        {/* State badge */}
        <div className="flex items-center gap-2 mb-1 h-6">
          <AnimatePresence mode="wait">
            {avatarSpeaking ? (
              <motion.div key="sp"
                initial={{ opacity: 0, y: -6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: `${cfg.gradTo}22`, border: `1px solid ${cfg.gradTo}55`, color: cfg.gradTo }}
              >
                <Waveform active color={cfg.gradTo} />
                <span>Speaking</span>
              </motion.div>
            ) : avatarListening ? (
              <motion.div key="li"
                initial={{ opacity: 0, y: -6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400"
                style={{ background: '#86efac18', border: '1px solid #86efac44' }}
              >
                <motion.div className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                <span>Listening…</span>
              </motion.div>
            ) : avatarThinking ? (
              <motion.div key="th"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white/55"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: cfg.gradTo }}
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div key="on"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white/45"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>Online</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D cloud avatar */}
        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${cfg.gradTo}30 0%, transparent 70%)` }}
            animate={{ opacity: avatarSpeaking ? [0.7, 1, 0.7] : avatarListening ? 0.55 : 0.3 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <AnimatePresence>
            {avatarListening && [0, 1].map(i => (
              <motion.div key={i}
                className="absolute rounded-full pointer-events-none"
                style={{ border: `2px solid ${cfg.gradTo}`, width: '110%', height: '110%', left: '-5%', top: '-5%' }}
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.35 + i * 0.18, opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.55, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
          <CloudAvatarSafe
            character={cfg.character}
            isSpeaking={avatarSpeaking}
            isListening={avatarListening}
            isThinking={avatarThinking}
            color={cfg.gradTo}
          />
        </div>
      </motion.div>

      {/* ── Message feed ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              cfg={cfg}
              onManualSpeak={() => handleManualSpeak(msg.content, idx)}
              isManualSpeaking={manualSpeakIdx === idx}
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
      <motion.div
        className="relative z-20 px-4 py-3"
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(18px)',
          borderTop: `1px solid ${cfg.gradTo}22`,
        }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 max-w-lg mx-auto">

          {/* Mic button */}
          {speechSupported && (
            <div className="relative flex-shrink-0">
              <AnimatePresence>
                {isListening && [0, 1].map(i => (
                  <motion.div key={i}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: `2px solid ${cfg.micActive}` }}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.1 + i * 0.3, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.88 }}
                disabled={permissionDenied}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isListening ? cfg.micActive : 'rgba(255,255,255,0.12)',
                  border: `1px solid ${isListening ? cfg.micActive : 'rgba(255,255,255,0.2)'}`,
                  boxShadow: isListening ? `0 0 18px ${cfg.micActive}55` : 'none',
                }}
              >
                {permissionDenied
                  ? <MicOff className="w-4 h-4 text-white/40" aria-hidden />
                  : <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-white/60'}`} aria-hidden />
                }
              </motion.button>
            </div>
          )}

          {/* Text input */}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={isListening ? 'Listening…' : cfg.placeholder}
            disabled={isLoading}
            aria-label="Type your message"
            className="flex-1 px-4 py-2.5 rounded-2xl text-sm text-white placeholder-white/35 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: `1px solid ${input ? cfg.gradTo + '60' : 'rgba(255,255,255,0.15)'}`,
              caretColor: cfg.gradTo,
            }}
          />

          {/* Send button */}
          <motion.button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            whileTap={{ scale: 0.88 }}
            aria-label="Send message"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
            style={{
              background: input.trim() && !isLoading
                ? `linear-gradient(135deg, ${cfg.gradMid}, ${cfg.gradTo})`
                : 'rgba(255,255,255,0.08)',
              border: `1px solid ${input.trim() ? cfg.gradTo + '80' : 'rgba(255,255,255,0.15)'}`,
              boxShadow: input.trim() && !isLoading ? `0 4px 16px ${cfg.gradTo}40` : 'none',
            }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 text-white/60 animate-spin" aria-hidden />
              : <Send className={`w-4 h-4 ${input.trim() ? 'text-white' : 'text-white/30'}`} aria-hidden />
            }
          </motion.button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
