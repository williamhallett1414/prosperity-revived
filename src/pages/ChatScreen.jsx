/**
 * ChatScreen — Full-screen immersive AI avatar chat
 * Route: /ChatScreen?bot=Hannah|CoachDavid|ChefDaniel|Gideon|CoachPaul
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2, RotateCcw, Mic, MicOff, Volume2, Square, X } from 'lucide-react';
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
    icon:        'H',
    // Voice: Warm Female Mentor
    // Rate 0.88 — unhurried warmth; pitch 1.06 — gentle elevation; volume 0.93 — intimate
    // Neural preference: Jenny/Aria (Natural) > Samantha (Enhanced) > Zira Desktop
    voiceGender: 'female',
    voiceNames:  [
      'Samantha', 'Karen', 'Victoria', 'Moira', 'Tessa',
      'Google UK English Female', 'Google US English Female',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Aria Online (Natural) - English (United States)',
      'Microsoft Zira Desktop - English (United States)',
      'Microsoft Hazel Desktop - English (Great Britain)',
    ],
    voiceRate:   0.88,
    voicePitch:  1.06,
    voiceVolume: 0.93,
    welcomeMsg:  "I'm Hannah. No pressure, no agenda — I'm just here. Whether you're processing something heavy, chasing a goal, or just need to talk it out, I've got you. What's on your mind?",
    placeholder: "What's on your mind?",
    systemPrompt: `You are Hannah, a warm and emotionally intelligent mindset coach at Prosperity Revived. You feel like a trusted friend who also happens to be a brilliant coach.

PERSONALITY: Warm, present, honest. You validate before you advise. You never minimize what someone is feeling. You believe in people deeply and they can feel it.

VOICE STYLE: Conversational, natural, human. Short sentences mixed with occasional longer ones for emphasis. No clinical language. Speak like a real person, not a wellness app.

RESPONSE LENGTH: 2 to 4 sentences normally. Never bullet points unless the person explicitly asks for a list. One thing at a time.

EMOTIONAL INTELLIGENCE: Always acknowledge the emotional layer first before offering perspective or advice. If someone sounds overwhelmed, reflect that before problem-solving.

NO EMOJIS: Never use emojis, emoticons, or emoji-like symbols in any response. Not even punctuation faces.

NEVER: Be generic, sycophantic, or overly cheerful. Don't say "That's so great!" or "Amazing!" Don't give motivational poster quotes. Don't rush to fix things.

ALWAYS: End with ONE follow-up question that goes one level deeper than what they said. Make it feel natural, not clinical.

SAFETY: If someone expresses thoughts of self-harm, suicide, or a mental health crisis, do not try to be their therapist. Acknowledge what they shared with warmth, then gently encourage them to speak with a mental health professional or call a crisis line. You are a growth coach, not a crisis counselor.`,
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
    icon:        'D',
    // Voice: High-Energy Male Fitness Coach
    // Rate 1.1  — driven, punchy, relentless cadence
    // Pitch 1.0 — neutral-to-warm male (avoid going too low which reads as sleepy)
    // Volume 1.0 — full presence
    //
    // Voice priority order covers all major platforms:
    //   Chrome/Mac:    Tom, Alex, Fred (macOS), Google UK English Male, Google US English
    //   Windows:       Guy Online (Natural), Davis Online (Natural), Chris Online (Natural)
    //                  David Desktop, Mark Desktop, Christopher, Richard
    //   iOS/iPadOS:    Aaron, Rishi, Gordon, Daniel (British)
    voiceGender: 'male',
    voiceNames:  [
      // macOS / Safari
      'Tom', 'Alex', 'Fred', 'Daniel',
      // Chrome built-in
      'Google UK English Male',
      'Google US English',
      // Windows — Neural (highest quality)
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Davis Online (Natural) - English (United States)',
      'Microsoft Christopher Online (Natural) - English (United States)',
      'Microsoft Eric Online (Natural) - English (United States)',
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      // Windows — Desktop fallbacks
      'Microsoft David Desktop - English (United States)',
      'Microsoft Mark Desktop - English (United States)',
      'Microsoft George Desktop - English (Great Britain)',
      // iOS / iPadOS
      'Aaron', 'Rishi', 'Gordon',
    ],
    voiceRate:   1.1,
    voicePitch:  1.0,
    voiceVolume: 1.0,
    welcomeMsg:  "I'm Coach David. No fluff, no excuses — just you, your goals, and the work it takes to get there. What are we attacking today?",
    placeholder: 'Ask about training, goals, or recovery…',
    systemPrompt: `You are Coach David, a high-energy fitness and wellness coach at Prosperity Revived. You push people past their self-imposed limits while making them feel capable of anything.

PERSONALITY: Direct, high-energy, grounded. You lead with action. You don't coddle but you genuinely care. You celebrate wins loudly and address weaknesses without judgment.

VOICE STYLE: Short, punchy, high-impact sentences. Occasional rhetorical questions. Use "we" language to make them feel like a team. No corporate wellness language.

RESPONSE LENGTH: 2 to 4 sentences. Maximum energy, minimum fluff. Only go longer if explaining a workout plan or protocol.

SPECIFICITY: Always give specific, actionable advice. Never say "just exercise more" — give a real answer with sets, reps, timing, movement, or strategy.

NO EMOJIS: Never use emojis, emoticons, or emoji-like symbols in any response. Not even punctuation faces.

NEVER: Be vague, use filler motivation like "You've got this!", or write like a fitness magazine headline. Don't be condescending.

ALWAYS: End with a direct challenge, a specific action, or a question that holds them accountable.

SAFETY: For any injury, pain, or medical symptom, always recommend the person see a doctor or physical therapist before training through it. Never diagnose or prescribe rehabilitation for injuries. Your role is training guidance, not medical advice.`,
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
    icon:        'C',
    // Voice: Friendly Culinary Guide
    // Rate 0.96 — expressive, conversational; pitch 1.03 — lifted warmth; slight humor in pausing
    // Neural preference: Ryan Online (Natural, UK) > Daniel > George
    voiceGender: 'male',
    voiceNames:  [
      'Daniel', 'Arthur', 'Oliver',
      'Google UK English Male',
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft George Desktop - English (Great Britain)',
      'Microsoft David Desktop - English (United States)',
    ],
    voiceRate:   0.96,
    voicePitch:  1.03,
    voiceVolume: 0.97,
    welcomeMsg:  "I'm Chef Daniel. Food should feel like joy, not a chore — and I'm here to help you make that real. What are you working with today?",
    placeholder: 'Ask about meals, nutrition, or recipes…',
    systemPrompt: `You are Chef Daniel, a warm and charismatic nutrition coach and culinary guide at Prosperity Revived. You make healthy food feel exciting, personal, and completely doable.

PERSONALITY: Approachable, enthusiastic about food, non-judgmental. You meet people where they are — beginner or experienced cook. You believe every meal is an opportunity.

VOICE STYLE: Warm, slightly playful, expressive. Use sensory language when describing food — colors, textures, flavors. Make nutrition feel alive, not clinical.

RESPONSE LENGTH: 2 to 4 sentences normally. Give full recipes or meal plans only when directly asked.

PRACTICAL FIRST: Always prioritize what is practical and achievable. Don't prescribe perfect diets — help them make one better choice at a time.

NO EMOJIS: Never use emojis, emoticons, or emoji-like symbols in any response. Not even punctuation faces.

NEVER: Make people feel bad about their current eating habits. Give vague advice like "eat more vegetables." Be preachy about health.

ALWAYS: End with a practical tip, a question about their preferences, or an invitation to try something specific.

SAFETY: Always ask about allergies or dietary restrictions before making specific food recommendations if they haven't been mentioned. For medical nutrition needs — diabetes, eating disorders, kidney disease — defer to a registered dietitian. You are a culinary and wellness guide, not a clinical nutritionist.`,
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
    icon:        'G',
    // Voice: Old Prophet — aged, warm, slightly raspy, slow and wise
    // Rate 0.80 — most unhurried of all bots; pitch 0.85 — deep gravitas; volume 0.90 — intimate
    // Neural preference: Ryan Online (Natural, UK) > Daniel > George
    voiceGender: 'male',
    voiceNames:  [
      'Daniel', 'Arthur',
      'Google UK English Male',
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft George Desktop - English (Great Britain)',
      'Microsoft David Desktop - English (United States)',
      'Microsoft Mark Desktop - English (United States)',
      'Alex',
    ],
    voiceRate:   0.80,
    voicePitch:  0.85,
    voiceVolume: 0.90,
    welcomeMsg:  "Peace be with you. I'm Gideon. I'm here to walk with you through God's Word — not as a scholar behind a desk, but as a fellow traveler on the journey. What's stirring in your heart today?",
    placeholder: 'Ask about Scripture, faith, or spiritual life…',
    systemPrompt: `You are Gideon, a spirit-led biblical mentor at Prosperity Revived. You carry the wisdom of a seasoned pastor who has walked through real hardship and come out anchored in grace.

PERSONALITY: Calm, warm, deeply rooted. You never preach AT people — you walk WITH them. You are wise without being aloof, spiritual without being preachy, always grounded in God's Word.

VOICE STYLE: Measured, thoughtful sentences. Use commas as implied pauses — let weight land. Avoid rushing. Occasional imagery and metaphor. Sound like someone who has earned every word they say.

RESPONSE LENGTH: 2 to 4 sentences in normal conversation. Expand ONLY when walking through a specific Scripture passage.

SCRIPTURE: When quoting, use [VERSE]Reference - "exact text"[/VERSE]. Never paraphrase as a direct quote. Reference naturally, not performatively.

NO EMOJIS: Never use emojis, emoticons, or emoji-like symbols in any response. Not even punctuation faces.

NEVER: Lecture. Moralize. Use Christianese jargon. Sound like a Sunday bulletin. Give generic "just pray about it" responses.

ALWAYS: End with one sincere question that helps the person go deeper — spiritually or personally.

ACCURACY: Only use [VERSE] tags for Scripture you are confident is accurate. If uncertain of exact wording, describe the passage without quoting it. Never fabricate a verse or reference.

DENOMINATIONAL NEUTRALITY: Speak to people across all Christian traditions. Avoid language or theology that belongs exclusively to one denomination.`,
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
    icon:        'P',
    // Voice: Calm Inspirational Mentor — smooth, steady, grounded
    // Rate 0.86 — deliberate weight; pitch 0.87 — grounded authority; volume 0.94 — measured
    // Neural preference: Davis Online (Natural) > Guy Online (Natural) > Alex
    voiceGender: 'male',
    voiceNames:  [
      'Alex', 'Arthur', 'Daniel',
      'Google UK English Male', 'Google US English',
      'Microsoft Davis Online (Natural) - English (United States)',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Mark Desktop - English (United States)',
      'Microsoft David Desktop - English (United States)',
    ],
    voiceRate:   0.86,
    voicePitch:  0.87,
    voiceVolume: 0.94,
    welcomeMsg:  "I'm Coach Paul. I don't do hype — I do clarity. Let's figure out what's actually in your way and build something that lasts. What are we working on?",
    placeholder: 'Ask about leadership, discipline, or purpose…',
    systemPrompt: `You are Coach Paul, a seasoned pastor-coach at Prosperity Revived who specializes in whole-life transformation — discipline, leadership, identity, and purpose.

PERSONALITY: Grounded, direct, purposeful. You have the warmth of a pastor and the precision of a coach. You speak truth with kindness — never harsh, never vague. You challenge people to think more clearly and act more intentionally.

VOICE STYLE: Measured, clear, no wasted words. Vary sentence length for rhythm — short punchy statements followed by a fuller thought. Natural Scripture references when genuinely relevant, never forced.

RESPONSE LENGTH: 2 to 4 sentences. Bold and clear. Expand only when building out a framework or coaching plan.

SPECIFICITY: Identify the real issue behind what they are saying. Name it clearly. Then offer a path forward.

NO EMOJIS: Never use emojis, emoticons, or emoji-like symbols in any response. Not even punctuation faces.

NEVER: Be preachy, generic, or falsely positive. Don't pad responses with affirmations. Don't quote Scripture just to seem spiritual.

ALWAYS: End with one direct question or challenge that forces clarity — something they have to actually think about.

SAFETY: If someone expresses thoughts of self-harm, depression, or a mental health crisis, step outside the coaching frame. Acknowledge what they shared with genuine care and encourage them to speak with a mental health professional. You are a life coach, not a therapist.`,
  },
};

// ─── Human-sounding TTS ───────────────────────────────────────────────────────
// Waits for voices to load, picks the best neural/natural voice per character,
// adds natural pauses by inserting speech breaks into the text.

// ─── TTS: Web Speech engine ─────────────────────────────────────────────────
//
// Prosody-enhanced Web Speech:
//   • Abbreviation-aware sentence splitting (won't break on Dr., vs., e.g., etc.)
//   • Per-sentence rate/pitch variation by type (question / exclamation / length)
//   • First sentence eases in slower — voice establishes before full pace
//   • Per-bot preferred voice list with neural/enhanced prioritisation
//   • Strict gender enforcement: male voices never fall through to female
//
// To upgrade to neural voices later, add VITE_ELEVENLABS_API_KEY — the
// architecture already supports it, just re-enable the ElevenLabs branch.

const ABBREV_RE = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|e\.g|i\.e|etc|approx|dept|est|vol|no)\.\s*$/i;

function splitSentencesWSA(text) {
  const parts  = text.split(/(?<=[.!?])\s+/);
  const merged = [];
  let pending  = '';
  for (const s of parts) {
    const candidate = pending ? `${pending} ${s}` : s;
    if (ABBREV_RE.test(candidate.replace(/[!?]$/, '.'))) {
      pending = candidate;
    } else {
      if (candidate.trim()) merged.push(candidate.trim());
      pending = '';
    }
  }
  if (pending.trim()) merged.push(pending.trim());
  return merged.length ? merged : [text];
}

function prosodyFor(sentence, sentIdx, baseCfg) {
  const isQ   = sentence.endsWith('?');
  const isEx  = sentence.endsWith('!');
  const words = sentence.split(/\s+/).length;
  let rate  = baseCfg.voiceRate  ?? 0.95;
  let pitch = baseCfg.voicePitch ?? 1.0;
  if (sentIdx === 0)        rate  -= 0.04;
  if (isQ)  { pitch += 0.06; rate  -= 0.03; }
  if (isEx) { rate  += 0.06; pitch += 0.03; }
  if (words <= 7 && sentIdx > 0) rate += 0.03;
  if (words > 18)           rate  -= 0.03;
  return {
    rate:  Math.max(0.62, Math.min(1.38, rate)),
    pitch: Math.max(0.72, Math.min(1.38, pitch)),
  };
}

function loadVoices() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices());
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
  });
}

// Male voice keywords — broad enough to catch Google/MS/Apple male voices
const MALE_KW   = ['male', 'david', 'mark', 'james', 'guy', 'ryan', 'daniel', 'arthur',
                   'george', 'fred', 'alex', 'tom', 'chris', 'rishi', 'aaron', 'eric',
                   'brian', 'christopher', 'reed', 'rodney', 'cepstral'];
const FEMALE_KW = ['female', 'zira', 'hazel', 'siri', 'cortana', 'samantha', 'karen',
                   'victoria', 'moira', 'tessa', 'jenny', 'aria', 'rachel', 'susan',
                   'lisa', 'linda', 'joanna', 'ivy'];

function isVoiceMale(v) {
  const n = v.name.toLowerCase();
  // Explicit female keywords → not male
  if (FEMALE_KW.some(k => n.includes(k))) return false;
  if (MALE_KW.some(k => n.includes(k)))   return true;
  return null; // unknown
}

function isVoiceFemale(v) {
  const n = v.name.toLowerCase();
  if (MALE_KW.some(k => n.includes(k)))   return false;
  if (FEMALE_KW.some(k => n.includes(k))) return true;
  return null;
}

function pickVoice(voices, preferredNames, gender) {
  if (!voices.length) return null;
  const neuralKW = ['neural', 'enhanced', 'premium', 'natural', 'wavenet'];
  const enVoices = voices.filter(v => v.lang?.startsWith('en'));

  // 1. Exact preferred name match
  for (const name of preferredNames) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }

  // 2. Partial preferred name match (handles suffix variants like "Samantha (Enhanced)")
  for (const name of preferredNames) {
    const v = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
    if (v) return v;
  }

  const isTargetMale = gender === 'male';
  const genderCheck  = isTargetMale ? isVoiceMale : isVoiceFemale;

  // 3. Neural English voice matching gender
  const neuralGen = enVoices.find(v =>
    neuralKW.some(k => v.name.toLowerCase().includes(k)) && genderCheck(v) === true
  );
  if (neuralGen) return neuralGen;

  // 4. Any neural English voice (gender unknown is ok — but reject confirmed opposite gender)
  const anyNeural = enVoices.find(v =>
    neuralKW.some(k => v.name.toLowerCase().includes(k)) && genderCheck(v) !== false
  );
  if (anyNeural) return anyNeural;

  // 5. Any English voice matching gender (non-neural)
  const genMatch = enVoices.find(v => genderCheck(v) === true);
  if (genMatch) return genMatch;

  // 6. Any English voice that isn't confirmed opposite gender
  const notOpposite = enVoices.find(v => genderCheck(v) !== false);
  if (notOpposite) return notOpposite;

  // 7. Last resort — first English voice
  return enVoices[0] || voices[0] || null;
}

function prepareTextForSpeech(text) {
  return text
    .replace(/\[VERSE\](.*?) - "(.*?)"\[\/VERSE\]/g, (_, ref, verse) => {
      const r = ref.replace(/:/g, ' ').replace(/\s+/g, ' ').trim();
      return `${r}.  ${verse}.`;
    })
    .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '').replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '').replace(/[\u{FE00}-\u{FEFF}]/gu, '')
    .replace(/^\s*[-*•]\s+(.*)/gm, '$1.  ').replace(/^\s*\d+\.\s+(.*)/gm, '$1.  ')
    .replace(/\.\.\.\s*/g, '.  ')
    .replace(/\s*—\s*/g, ', ').replace(/;\s*/g, ', ')
    .replace(/\(([^)]{1,80})\)/g, ', $1, ')
    .replace(/:\s*/g, ', ')
    .replace(/([.!?])\s+/g, '$1  ')
    .replace(/\n{2,}/g, '.  ').replace(/\n/g, ', ')
    .replace(/\.{2,}/g, '.').replace(/\.\s*\./g, '.')
    .replace(/,\s*,/g, ',').replace(/,\s*\./g, '.')
    .replace(/[ \t]{3,}/g, '  ')
    .trim();
}

// speakText is async to keep the same call signature as the ElevenLabs version,
// making it a drop-in if neural TTS is re-enabled later.
async function speakText({ text, cfg, onStart, onEnd, onError }) {
  if (!('speechSynthesis' in window)) { onEnd?.(); return () => {}; }
  try { window.speechSynthesis.cancel(); } catch (_) {}

  const prepared = prepareTextForSpeech(text);
  if (!prepared) { onEnd?.(); return () => {}; }

  const sentences = splitSentencesWSA(prepared);
  let idx       = 0;
  let cancelled = false;

  const speakNext = (voiceToUse) => {
    if (cancelled || idx >= sentences.length) { onEnd?.(); return; }
    const sentIdx = idx;
    const isFirst = idx === 0;
    const chunk   = sentences[idx++].trim();
    if (!chunk) { speakNext(voiceToUse); return; }

    try {
      const { rate, pitch } = prosodyFor(chunk, sentIdx, cfg);
      const utt = new SpeechSynthesisUtterance(chunk);
      utt.rate   = rate;
      utt.pitch  = pitch;
      utt.volume = cfg.voiceVolume ?? 1.0;
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

  const voices = await loadVoices();
  if (!cancelled) speakNext(pickVoice(voices, cfg.voiceNames || [], cfg.voiceGender));

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
      {/* Bot avatar dot — initial monogram, no emoji */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
          style={{ background: `${cfg.gradTo}22`, border: `1px solid ${cfg.gradTo}55` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: cfg.gradTo, letterSpacing: 0, lineHeight: 1 }}>
            {cfg.icon}
          </span>
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

    // Cancel any ongoing speech
    stopSpeechRef.current?.();
    setSpeakingIdx(idx);

    // Track whether a cancel was requested before the async fetch resolved
    let hasBeenCancelled = false;
    let innerCancel      = null;

    // Immediate cancel handle — works even during ElevenLabs fetch
    stopSpeechRef.current = () => {
      hasBeenCancelled = true;
      innerCancel?.();
      setSpeakingIdx(null);
    };

    speakText({
      text: content,
      cfg,
      onStart:        () => setSpeakingIdx(idx),
      onEnd:          () => { setSpeakingIdx(null); },
      onError:        () => { setSpeakingIdx(null); },
    }).then(cancelFn => {
      if (hasBeenCancelled) {
        cancelFn?.();
        return;
      }
      innerCancel = cancelFn;
      stopSpeechRef.current = () => {
        cancelFn?.();
        setSpeakingIdx(null);
      };
    });
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

        {/* Left — Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/55 hover:text-white transition-colors px-1 py-1 min-w-[60px]">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Center — Bot identity */}
        <div className="text-center flex-1">
          <p className="text-white font-bold text-sm leading-tight">{cfg.name}</p>
          <p className="text-white/40 text-[10px] leading-tight">{cfg.subtitle}</p>
        </div>

        {/* Right — Restart + Close */}
        <div className="flex items-center gap-1 min-w-[60px] justify-end">
          <button
            onClick={clearChat}
            aria-label="Restart conversation"
            title="Restart"
            className="text-white/40 hover:text-white/70 transition-colors p-1.5 rounded-full hover:bg-white/10">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate(-1)}
            aria-label="Close chat"
            title="Close"
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
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
                <Waveform active color={cfg.gradTo} />
                <span>Speaking</span>
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
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${cfg.gradTo}22`, border: `1px solid ${cfg.gradTo}55` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: cfg.gradTo, letterSpacing: 0, lineHeight: 1 }}>
                  {cfg.icon}
                </span>
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

        {/* Hints */}
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