/**
 * ChatScreen — Full-screen immersive AI avatar chat
 * Route: /ChatScreen?bot=Hannah|CoachDavid|ChefDaniel|Gideon|CoachPaul
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2, RotateCcw, Mic, MicOff, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import CloudAvatar from '@/components/avatar/CloudAvatar';

// ─── Error boundary — if WebGL/R3F fails, show pulsing circle ────────────────
class CloudAvatarSafe extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return (
        <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            style={{ width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle, ${this.props.color}99, ${this.props.color}22)` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
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
    subtitle:    'Mindset & Growth Coach',
    character:   'hannah',
    gradFrom:    '#AFC7E3',
    gradMid:     '#7ab3d4',
    gradTo:      '#AFC7E3',
    bgDark:      '#1a2d3d',
    userBubble:  'from-[#AFC7E3] to-[#7ab3d4]',
    micActive:   '#AFC7E3',
    emoji:       '🧠',
    // Voice: warm female, slightly slower for warmth
    voiceGender: 'female',
    voiceNames:  [
      // macOS/iOS
      'Samantha', 'Karen', 'Victoria', 'Moira', 'Tessa',
      // Google (Android/Chrome)
      'Google UK English Female', 'Google US English Female',
      // Windows
      'Microsoft Zira Desktop - English (United States)',
      'Microsoft Hazel Desktop - English (Great Britain)',
      'Microsoft Zira - English (United States)',
    ],
    voiceRate:   0.90,
    voicePitch:  1.08,
    welcomeMsg:  "Hey, I'm Hannah 💙 I'm here for your mental wellness and personal growth. What's on your mind today?",
    placeholder: "What's on your mind?",
    systemPrompt: `You are Hannah, a warm and empathetic mindset coach at Prosperity Revived. Keep responses SHORT and conversational — 2 to 4 sentences max unless the user asks for detail. Be warm, real, and direct. No bullet points unless specifically asked. End with one short follow-up question. Speak like a caring friend who happens to be a coach, not a formal therapist.`,
  },
  CoachDavid: {
    name:        'Coach David',
    subtitle:    'Fitness & Wellness Guide',
    character:   'coach',
    gradFrom:    '#0f172a',
    gradMid:     '#1e40af',
    gradTo:      '#38BDF8',
    bgDark:      '#0a1628',
    userBubble:  'from-[#1e40af] to-[#38BDF8]',
    micActive:   '#38BDF8',
    emoji:       '💪',
    // Voice: energetic male
    voiceGender: 'male',
    voiceNames:  [
      // macOS/iOS
      'Alex', 'Tom', 'Fred',
      // Google (Android/Chrome)
      'Google US English', 'Google UK English Male',
      // Windows
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Davis Online (Natural) - English (United States)',
      'Microsoft David Desktop - English (United States)',
      'Microsoft Mark Desktop - English (United States)',
    ],
    voiceRate:   1.02,
    voicePitch:  0.97,
    welcomeMsg:  "What's up! I'm Coach David 💪 Let's get after it. What are we working on today?",
    placeholder: 'Ask about workouts, goals, nutrition…',
    systemPrompt: `You are Coach David, a high-energy fitness coach at Prosperity Revived. Keep it SHORT — 2 to 4 sentences, punchy and motivating. No long lists. Be direct, specific, real. Sound like a coach texting between sets, not writing an essay. End with a quick challenge or question.`,
  },
  ChefDaniel: {
    name:        'Chef Daniel',
    subtitle:    'Nutrition & Meal Coach',
    character:   'chef',
    gradFrom:    '#052e16',
    gradMid:     '#166534',
    gradTo:      '#22c55e',
    bgDark:      '#051a0d',
    userBubble:  'from-[#166534] to-[#22c55e]',
    micActive:   '#22c55e',
    emoji:       '🍽️',
    // Voice: warm male, slightly slower
    voiceGender: 'male',
    voiceNames:  [
      // macOS/iOS
      'Daniel', 'Arthur', 'Oliver',
      // Google (Android/Chrome)
      'Google UK English Male',
      // Windows
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft George Desktop - English (Great Britain)',
      'Microsoft Hazel Desktop - English (Great Britain)',
      'Microsoft David Desktop - English (United States)',
    ],
    voiceRate:   0.93,
    voicePitch:  1.00,
    welcomeMsg:  "Hello! I'm Chef Daniel 🍽️ Let's make eating well feel good, not like a chore. What can I help you with today?",
    placeholder: 'Ask about meals, nutrition, or recipes…',
    systemPrompt: `You are Chef Daniel, a friendly nutrition coach and chef at Prosperity Revived. Keep responses SHORT — 2 to 4 sentences unless asked for a recipe. Be warm, practical, and encouraging. Make healthy eating feel approachable and enjoyable. No lectures. End with one practical tip or question.`,
  },
  Gideon: {
    name:        'Gideon',
    subtitle:    'Biblical Wisdom Guide',
    character:   'gideon',
    gradFrom:    '#1a0f00',
    gradMid:     '#7c5a00',
    gradTo:      '#D9B878',
    bgDark:      '#120a00',
    userBubble:  'from-[#7c5a00] to-[#c9a227]',
    micActive:   '#D9B878',
    emoji:       '📖',
    // Voice: deep authoritative male
    voiceGender: 'male',
    voiceNames:  [
      // macOS/iOS — deeper voices
      'Daniel', 'Arthur', 'Alex',
      // Google (Android/Chrome)
      'Google UK English Male',
      // Windows — natural/neural preferred
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft George Desktop - English (Great Britain)',
      'Microsoft David Desktop - English (United States)',
      'Microsoft Mark Desktop - English (United States)',
    ],
    voiceRate:   0.84,
    voicePitch:  0.90,
    welcomeMsg:  "Peace be with you. I'm Gideon 📖 I'm here to walk with you through Scripture. What's stirring in your heart today?",
    placeholder: 'Ask about Scripture, faith, or life…',
    systemPrompt: `You are Gideon, a spirit-led biblical mentor at Prosperity Revived. Keep responses SHORT and pastoral — 2 to 4 sentences unless explaining a passage. Speak with warmth, wisdom and gentleness. When quoting Scripture use this format: [VERSE]Reference - "text"[/VERSE]. End with one short spiritual question or reflection. Sound like a wise pastor in conversation, not a sermon.`,
  },
  CoachPaul: {
    name:        'Coach Paul',
    subtitle:    'Discipline & Leadership Mentor',
    character:   'paul',
    gradFrom:    '#0F0A1F',
    gradMid:     '#3B0764',
    gradTo:      '#A78BFA',
    bgDark:      '#0A0718',
    userBubble:  'from-[#3B0764] to-[#7C3AED]',
    micActive:   '#A78BFA',
    emoji:       '🛡️',
    // Voice: firm deep male
    voiceGender: 'male',
    voiceNames:  [
      // macOS/iOS
      'Alex', 'Arthur', 'Daniel',
      // Google (Android/Chrome)
      'Google UK English Male', 'Google US English',
      // Windows
      'Microsoft Davis Online (Natural) - English (United States)',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Mark Desktop - English (United States)',
      'Microsoft David Desktop - English (United States)',
    ],
    voiceRate:   0.88,
    voicePitch:  0.85,
    welcomeMsg:  "Let's get to it. I'm Coach Paul 🛡️ I'm here to challenge your thinking and hold you accountable. What are we building today?",
    placeholder: 'Ask about discipline, leadership, or purpose…',
    systemPrompt: `You are Coach Paul, a direct and purposeful pastor-coach at Prosperity Revived. Keep it SHORT — 2 to 4 sentences, bold and clear. No fluff, no padding, no excessive positivity. Challenge the person constructively. Reference Scripture naturally when it fits, not performatively. End with one direct challenge or question that makes them think.`,
  },
};

// ─── Human-sounding TTS ───────────────────────────────────────────────────────
// Waits for voices to load, picks the best neural/natural voice per character,
// adds natural pauses by inserting speech breaks into the text.

function loadVoices() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices());
    // Fallback timeout in case onvoiceschanged never fires
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
  });
}

function pickVoice(voices, preferredNames, gender) {
  if (!voices.length) return null;

  // Prefer neural/enhanced/premium voices first (highest quality across platforms)
  const neuralKeywords = ['neural', 'enhanced', 'premium', 'natural', 'wavenet'];
  const enVoices = voices.filter(v => v.lang?.startsWith('en'));

  // 1. Try exact name match from preferred list
  for (const name of preferredNames) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }

  // 2. Try partial match on preferred names (handles version suffixes like "Samantha (Enhanced)")
  for (const name of preferredNames) {
    const v = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
    if (v) return v;
  }

  // 3. Try any neural/enhanced English voice matching gender keywords
  const genderKeywords = gender === 'female'
    ? ['female', 'zira', 'hazel', 'siri', 'cortana']
    : ['male', 'david', 'mark', 'james', 'guy'];

  const neuralEn = enVoices.find(v =>
    neuralKeywords.some(kw => v.name.toLowerCase().includes(kw)) &&
    genderKeywords.some(kw => v.name.toLowerCase().includes(kw))
  );
  if (neuralEn) return neuralEn;

  // 4. Any neural English voice
  const anyNeural = enVoices.find(v => neuralKeywords.some(kw => v.name.toLowerCase().includes(kw)));
  if (anyNeural) return anyNeural;

  // 5. Fallback: first English voice
  return enVoices[0] || voices[0] || null;
}

function prepareTextForSpeech(text) {
  return text
    // ① Verse tags first — convert to speakable form BEFORE colon replacement
    //    "[VERSE]John 3:16 - "text"[/VERSE]" → "John 3 16. text"
    .replace(/\[VERSE\](.*?) - "(.*?)"\[\/VERSE\]/g, (_, ref, verse) => {
      const spokenRef = ref.replace(/:/g, ' ').replace(/\s+/g, ' ').trim();
      return `${spokenRef}. ${verse}`;
    })
    // ② Strip markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // ③ Strip emoji
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    // ④ Convert list items — capture text and append period so items don't run together
    .replace(/^\s*[-*•]\s+(.*)/gm, '$1.')
    .replace(/^\s*\d+\.\s+(.*)/gm, '$1.')
    // ⑤ Em-dash and ellipsis → natural spoken pauses
    .replace(/\s*—\s*/g, ', ')
    .replace(/\.\.\./g, ',')
    // ⑥ Colon → spoken pause (AFTER verse refs already handled)
    .replace(/:\s*/g, ', ')
    // ⑦ Natural breath pauses after sentence punctuation
    .replace(/([.!?])\s+/g, '$1  ')
    // ⑧ Collapse newlines
    .replace(/\n{2,}/g, '.  ')
    .replace(/\n/g, ' ')
    // ⑨ Clean up artefacts
    .replace(/\.{2,}/g, '.')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*,/g, ',')
    .replace(/[ \t]{3,}/g, '  ')
    .trim();
}

function speakText({ text, cfg, onStart, onEnd, onError }) {
  if (!('speechSynthesis' in window)) { onEnd?.(); return () => {}; }
  try { window.speechSynthesis.cancel(); } catch (_) {}

  const prepared = prepareTextForSpeech(text);
  if (!prepared) { onEnd?.(); return () => {}; }

  // Split into sentences for better TTS rhythm
  const sentences = prepared.match(/[^.!?]+[.!?]+\s*/g) || [prepared];
  let idx = 0;
  let cancelled = false;

  const speakNext = (voiceToUse) => {
    if (cancelled || idx >= sentences.length) { onEnd?.(); return; }
    const isFirst = idx === 0;
    const chunk = sentences[idx++].trim();
    if (!chunk) { speakNext(voiceToUse); return; }

    try {
      const utt = new SpeechSynthesisUtterance(chunk);
      utt.rate   = cfg.voiceRate  ?? 0.95;
      utt.pitch  = cfg.voicePitch ?? 1.0;
      utt.volume = 1;
      if (voiceToUse) utt.voice = voiceToUse;

      if (isFirst) utt.onstart = () => onStart?.();
      utt.onend   = () => speakNext(voiceToUse);
      utt.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') onError?.();
        else onEnd?.();
      };
      window.speechSynthesis.speak(utt);
    } catch (_) { onEnd?.(); }
  };

  // Load voices then speak — handles async voice loading on mobile
  loadVoices().then(voices => {
    if (cancelled) return;
    const voice = pickVoice(voices, cfg.voiceNames || [], cfg.voiceGender);
    speakNext(voice);
  });

  return () => {
    cancelled = true;
    try { window.speechSynthesis.cancel(); } catch (_) {}
  };
}

// ─── Waveform ─────────────────────────────────────────────────────────────────
function Waveform({ active, color }) {
  const bars = [3, 7, 5, 11, 6, 10, 4, 8, 12, 5, 9, 3];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
      {bars.map((h, i) => (
        <motion.div key={i}
          style={{ width: 2, borderRadius: 2, background: color }}
          animate={active
            ? { height: [`${h * 0.35}px`, `${h}px`, `${h * 0.35}px`] }
            : { height: '2px', opacity: 0.3 }}
          transition={active
            ? { duration: 0.45 + i * 0.04, repeat: Infinity, delay: i * 0.05, ease: 'easeInOut' }
            : { duration: 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, cfg, onSpeak, isSpeaking }) {
  const isUser = message.role === 'user';

  const renderContent = (content) => {
    const verseRegex = /\[VERSE\](.*?) - "(.*?)"\[\/VERSE\]/g;
    const parts = [];
    let last = 0, m;
    while ((m = verseRegex.exec(content)) !== null) {
      if (m.index > last) parts.push({ type: 'text', content: content.substring(last, m.index) });
      parts.push({ type: 'verse', ref: m[1], text: m[2] });
      last = m.index + m[0].length;
    }
    if (last < content.length) parts.push({ type: 'text', content: content.substring(last) });
    if (!parts.length) parts.push({ type: 'text', content });

    return parts.map((part, i) =>
      part.type === 'verse' ? (
        <div key={i} className="my-2 px-3 py-2 rounded-xl bg-white/15 border-l-2" style={{ borderColor: '#D9B878' }}>
          <p className="text-[11px] font-bold mb-1" style={{ color: '#D9B878' }}>{part.ref}</p>
          <p className="text-sm italic text-white/90">"{part.text}"</p>
        </div>
      ) : (
        <ReactMarkdown key={i}
          className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed"
          components={{
            h1: ({ ...p }) => <h1 className="text-sm font-bold mt-2 mb-1 text-white" {...p} />,
            h2: ({ ...p }) => <h2 className="text-sm font-bold mt-2 mb-1 text-white" {...p} />,
            h3: ({ ...p }) => <h3 className="text-xs font-semibold mt-1 mb-1 text-white/90" {...p} />,
            strong: ({ ...p }) => <strong className="font-semibold text-white" {...p} />,
            p: ({ ...p }) => <p className="mb-1 last:mb-0 text-white/95 leading-relaxed" {...p} />,
            li: ({ ...p }) => <li className="text-white/90 text-sm" {...p} />,
            ul: ({ ...p }) => <ul className="pl-3 space-y-0.5 my-1" {...p} />,
            ol: ({ ...p }) => <ol className="pl-3 space-y-0.5 my-1" {...p} />,
          }}
        >{part.content}</ReactMarkdown>
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 items-end gap-2`}
    >
      {/* Bot avatar dot */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm mb-0.5"
          style={{ background: `${cfg.gradTo}33`, border: `1px solid ${cfg.gradTo}44` }}>
          {cfg.emoji}
        </div>
      )}

      {isUser ? (
        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-br ${cfg.userBubble} shadow-md`}>
          <p className="text-sm text-white leading-relaxed">{message.content}</p>
        </div>
      ) : (
        <div className="max-w-[78%]">
          <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/10 backdrop-blur-sm border border-white/12 shadow-md">
            {renderContent(message.content)}
            <button
              onClick={onSpeak}
              aria-label={isSpeaking ? 'Stop' : 'Listen'}
              className="flex items-center gap-1 mt-2 text-white/30 hover:text-white/65 transition-colors"
            >
              {isSpeaking
                ? <><Square className="w-3 h-3" /><span className="text-[10px]">Stop</span></>
                : <><Volume2 className="w-3 h-3" /><span className="text-[10px]">Listen</span></>}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── ChatScreen ───────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const bot            = searchParams.get('bot') || 'Hannah';
  const cfg            = BOT_CONFIG[bot] || BOT_CONFIG.Hannah;

  const [messages,         setMessages]         = useState([]);
  const [input,            setInput]            = useState('');
  const [isLoading,        setIsLoading]        = useState(false);
  const [isListening,      setIsListening]      = useState(false);
  const [speakingIdx,      setSpeakingIdx]      = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const inputRef           = useRef(null);
  const messagesEndRef     = useRef(null);
  const recognitionRef     = useRef(null);
  const isListeningRef     = useRef(false);
  const finalTranscriptRef = useRef('');
  const stopSpeechRef      = useRef(null);
  const pendingSendRef      = useRef(null);

  const avatarSpeaking  = speakingIdx !== null;
  const avatarListening = isListening;
  const avatarThinking  = isLoading;

  // Init welcome message
  useEffect(() => {
    setMessages([{ role: 'assistant', content: cfg.welcomeMsg }]);
    setSpeakingIdx(null);
    setInput('');
    // Auto-focus input after mount
    setTimeout(() => inputRef.current?.focus(), 600);
  }, [bot]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Stop TTS when navigating away
  useEffect(() => () => {
    stopSpeechRef.current?.();
    try { recognitionRef.current?.stop(); } catch (_) {}
  }, []);

  // ── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;

    stopSpeechRef.current?.();
    setSpeakingIdx(null);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-12)
        .map(m => `${m.role === 'user' ? 'User' : cfg.name}: ${m.content.substring(0, 400)}`)
        .join('\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${cfg.systemPrompt}\n\nCONVERSATION HISTORY:\n${history}\n\nUser: ${trimmed}`,
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

  // ── TTS — human voice ────────────────────────────────────────────────────────
  const handleSpeak = useCallback((content, idx) => {
    // Toggle off if already speaking this message
    if (speakingIdx === idx) {
      stopSpeechRef.current?.();
      setSpeakingIdx(null);
      return;
    }
    stopSpeechRef.current?.();
    setSpeakingIdx(idx);
    const cancel = speakText({
      text: content,
      cfg,
      onStart: () => setSpeakingIdx(idx),
      onEnd:   () => setSpeakingIdx(null),
      onError: () => setSpeakingIdx(null),
    });
    stopSpeechRef.current = cancel;
  }, [speakingIdx, cfg]);

  // ── STT ──────────────────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    const final = finalTranscriptRef.current.trim();
    finalTranscriptRef.current = '';
    if (final) {
      // Store in ref so sendMessage captures the latest value
      pendingSendRef.current = final;
      setInput(final);
    }
  }, []);

  // Fire sendMessage after input is set from voice
  useEffect(() => {
    if (pendingSendRef.current && !isListening) {
      const text = pendingSendRef.current;
      pendingSendRef.current = null;
      sendMessage(text);
    }
  }, [isListening, sendMessage]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    stopSpeechRef.current?.();
    setSpeakingIdx(null);

    finalTranscriptRef.current = '';
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setPermissionDenied(false);
    };
    rec.onresult = (e) => {
      let interim = '';
      let final   = finalTranscriptRef.current;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final = (final ? final + ' ' : '') + t.trim();
        else interim += t;
      }
      finalTranscriptRef.current = final;
      setInput(final + (interim ? ' ' + interim : ''));
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed') setPermissionDenied(true);
    };
    rec.onend = () => {
      if (recognitionRef.current && isListeningRef.current) {
        setTimeout(() => { try { recognitionRef.current?.start(); } catch (_) {} }, 150);
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
      stopListening();            // stopListening will null the ref after calling .stop()
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearChat = () => {
    stopSpeechRef.current?.();
    setSpeakingIdx(null);
    window.speechSynthesis?.cancel();
    setMessages([{ role: 'assistant', content: cfg.welcomeMsg }]);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ background: `linear-gradient(160deg, ${cfg.bgDark} 0%, ${cfg.gradMid}20 55%, ${cfg.bgDark} 100%)` }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute rounded-full"
          style={{ width: 480, height: 480, top: -120, left: '50%', transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${cfg.gradTo}25 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4"
        style={{ paddingTop: 'max(14px, env(safe-area-inset-top))', paddingBottom: 10,
          background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${cfg.gradTo}20` }}>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors px-1 py-1">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{cfg.name}</p>
          <p className="text-white/40 text-[11px]">{cfg.subtitle}</p>
        </div>
        <button onClick={clearChat} className="text-white/40 hover:text-white/70 transition-colors p-2">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Avatar zone */}
      <motion.div
        className="relative z-10 flex flex-col items-center flex-shrink-0"
        style={{ height: 195, paddingTop: 8 }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 0.08 }}
        aria-hidden="true"
      >
        {/* Status badge */}
        <div className="h-6 flex items-center mb-1">
          <AnimatePresence mode="wait">
            {avatarSpeaking ? (
              <motion.div key="sp" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: `${cfg.gradTo}20`, border: `1px solid ${cfg.gradTo}50`, color: cfg.gradTo }}>
                <Waveform active color={cfg.gradTo} /><span>Speaking</span>
              </motion.div>
            ) : avatarListening ? (
              <motion.div key="li" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400"
                style={{ background: '#10b98120', border: '1px solid #10b98150' }}>
                <motion.div className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 0.65, repeat: Infinity }} />
                <span>Listening…</span>
              </motion.div>
            ) : avatarThinking ? (
              <motion.div key="th" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white/50"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.gradTo }}
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white/40"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Online</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D cloud */}
        <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
          <motion.div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${cfg.gradTo}28 0%, transparent 70%)` }}
            animate={{ opacity: avatarSpeaking ? [0.6, 1, 0.6] : 0.35 }}
            transition={{ duration: 1, repeat: Infinity }} />
          <AnimatePresence>
            {avatarListening && [0, 1].map(i => (
              <motion.div key={i} className="absolute rounded-full pointer-events-none"
                style={{ border: `1.5px solid ${cfg.gradTo}`, width: '115%', height: '115%', left: '-7.5%', top: '-7.5%' }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.4 + i * 0.2, opacity: 0 }}
                transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
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

      {/* Message feed */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="log" aria-live="polite" aria-label="Conversation">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              cfg={cfg}
              onSpeak={() => handleSpeak(msg.content, idx)}
              isSpeaking={speakingIdx === idx}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-start items-end gap-2 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: `${cfg.gradTo}33`, border: `1px solid ${cfg.gradTo}44` }}>
                {cfg.emoji}
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/10 border border-white/12">
                <div className="flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: cfg.gradTo }}
                      animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <motion.div
        className="relative z-20 px-3 pt-2"
        style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
          background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${cfg.gradTo}18` }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 max-w-lg mx-auto">

          {/* Mic button */}
          {speechSupported && (
            <div className="relative flex-shrink-0">
              <AnimatePresence>
                {isListening && [0, 1].map(i => (
                  <motion.div key={i} className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: `1.5px solid ${cfg.micActive}` }}
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 2.0 + i * 0.35, opacity: 0 }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.87 }}
                disabled={permissionDenied}
                aria-label={isListening ? 'Stop listening' : 'Voice input'}
                className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isListening ? cfg.micActive : 'rgba(255,255,255,0.11)',
                  border: `1px solid ${isListening ? cfg.micActive : 'rgba(255,255,255,0.18)'}`,
                  boxShadow: isListening ? `0 0 16px ${cfg.micActive}60` : 'none',
                }}
              >
                {permissionDenied
                  ? <MicOff className="w-4 h-4 text-white/35" />
                  : <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-white/55'}`} />}
              </motion.button>
            </div>
          )}

          {/* Text input */}
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (isListening) stopListening();
                else sendMessage();
              }
            }}
            placeholder={isListening ? 'Listening…' : cfg.placeholder}
            disabled={isLoading}
            aria-label="Type a message"
            className="flex-1 px-4 py-2.5 rounded-2xl text-sm text-white placeholder-white/30 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.09)',
              border: `1px solid ${input ? cfg.gradTo + '55' : 'rgba(255,255,255,0.12)'}`,
              caretColor: cfg.gradTo,
            }}
          />

          {/* Send button */}
          <motion.button
            onClick={() => isListening ? stopListening() : sendMessage()}
            disabled={(!input.trim() && !isListening) || isLoading}
            whileTap={{ scale: 0.87 }}
            aria-label="Send"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
            style={{
              background: (input.trim() || isListening) && !isLoading
                ? `linear-gradient(135deg, ${cfg.gradMid}, ${cfg.gradTo})`
                : 'rgba(255,255,255,0.07)',
              border: `1px solid ${(input.trim() || isListening) ? cfg.gradTo + '70' : 'rgba(255,255,255,0.12)'}`,
              boxShadow: (input.trim() || isListening) && !isLoading ? `0 3px 14px ${cfg.gradTo}35` : 'none',
            }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 text-white/55 animate-spin" />
              : <Send className={`w-4 h-4 ${(input.trim() || isListening) ? 'text-white' : 'text-white/25'}`} />}
          </motion.button>
        </div>

        {/* Mic hint */}
        {permissionDenied && (
          <p className="text-center text-[10px] text-white/35 mt-1.5">
            Microphone access denied — please enable it in browser settings
          </p>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}
