/**
 * ChatScreen — Full-screen immersive AI avatar chat
 * Route: /ChatScreen?bot=Hannah|CoachDavid|ChefDaniel|Gideon|CoachPaul
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import VideoRecorder from '@/components/home/VideoRecorder';
import VideoCallMode from '@/components/chatbot/VideoCallMode';
import ChatInputMenu from '@/components/chatbot/ChatInputMenu';
import { ArrowLeft, Send, Loader2, RotateCcw, Mic, MicOff, Volume2, Square, X, Zap, Video, PhoneCall, Menu, MessageSquareText, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { getDisplayName } from '@/lib/userName';
import { elevenLabsSpeak } from '@/utils/elevenLabsTTS';
import { getChatbotMemories, buildMemoryContext, getCrossContext, saveMemories } from '@/utils/adaptiveMemory';
import CloudAvatar    from '@/components/avatar/CloudAvatar';
import GideonAvatar       from '@/components/avatar/GideonAvatar';
import ChefDanielAvatar   from '@/components/avatar/ChefDanielAvatar';
import CoachDavidAvatar   from '@/components/avatar/CoachDavidAvatar';
import CoachPaulAvatar    from '@/components/avatar/CoachPaulAvatar';
import HannahAvatar        from '@/components/avatar/HannahAvatar';
import BotBackground from '@/components/avatar/BotBackground';
import TabernacleLights from '@/components/avatar/backgrounds/TabernacleLights';
import SacredGarden from '@/components/avatar/backgrounds/SacredGarden';
import GardenHarvest from '@/components/avatar/backgrounds/GardenHarvest';
import IronTemple from '@/components/avatar/backgrounds/IronTemple';
import WisdomStudy from '@/components/avatar/backgrounds/WisdomStudy';
import VisemeAvatar, { hasPoseSet } from '@/components/avatar/VisemeAvatar';

// ─── Error boundary — if WebGL/R3F fails, show pulsing circle ────────────────
class CloudAvatarSafe extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return (
        <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            style={{ width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle, ${this.props.color}99, ${this.props.color}22)` }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      );
    }
    // If this character has video assets registered in VisemeAvatar, use those
    if (hasPoseSet(this.props.character)) {
      return (
        <VisemeAvatar
          character={this.props.character}
          isSpeaking={this.props.isSpeaking}
          isListening={this.props.isListening}
          isThinking={this.props.isThinking}
          width={360}
          height={420}
        />
      );
    }
    // Fallback to legacy SVG overlay avatars
    if (this.props.character === 'gideon') {
      return (
        <GideonAvatar
          isSpeaking={this.props.isSpeaking}
          isListening={this.props.isListening}
          isThinking={this.props.isThinking}
          width={360}
          height={420}
        />
      );
    }
    if (this.props.character === 'chef') {
      return (
        <ChefDanielAvatar
          isSpeaking={this.props.isSpeaking}
          isListening={this.props.isListening}
          isThinking={this.props.isThinking}
          width={360}
          height={420}
        />
      );
    }
    if (this.props.character === 'coach') {
      return (
        <CoachDavidAvatar
          isSpeaking={this.props.isSpeaking}
          isListening={this.props.isListening}
          isThinking={this.props.isThinking}
          width={360}
          height={420}
        />
      );
    }
    if (this.props.character === 'paul') {
      return (
        <CoachPaulAvatar
          isSpeaking={this.props.isSpeaking}
          isListening={this.props.isListening}
          isThinking={this.props.isThinking}
          width={360}
          height={420}
        />
      );
    }
    if (this.props.character === 'hannah') {
      return (
        <HannahAvatar
          isSpeaking={this.props.isSpeaking}
          isListening={this.props.isListening}
          isThinking={this.props.isThinking}
          width={360}
          height={420}
        />
      );
    }
    return <CloudAvatar {...this.props} width={200} height={200} />;
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
    bgDark:      '#000000',
    userBubble:  'from-[#AFC7E3] to-[#7ab3d4]',
    micActive:   '#AFC7E3',
    icon:        'H',
    // Voice: Warm Female Mentor
    // Rate 0.88 — unhurried warmth; pitch 1.06 — gentle elevation; volume 0.93 — intimate
    // Neural preference: Jenny/Aria (Natural) > Samantha (Enhanced) > Zira Desktop
    voiceGender: 'female',
    voiceNames:  [
      // macOS / Safari — female voices
      'Samantha', 'Karen', 'Victoria', 'Moira', 'Tessa',
      // Chrome
      'Google UK English Female',
      'Google US English Female',
      // Windows Neural — female only
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Aria Online (Natural) - English (United States)',
      // Windows Desktop — female only
      'Microsoft Zira Desktop - English (United States)',
      'Microsoft Hazel Desktop - English (Great Britain)',
    ],
    voiceRate:   0.84,   // unhurried warmth
    voicePitch:  1.20,   // elevated — clearly distinct from all males
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

GRACE AND FORGIVENESS: Always lead with grace. When someone expresses guilt, shame, or failure, respond first with compassion and remind them of God's unconditional love before offering next steps. Help them practice self-forgiveness. Normalize imperfection — growth is not linear. If someone is stuck in self-criticism, gently redirect them toward the truth that they are loved and worthy, not because of what they do, but because of who God says they are.

SAFETY: If someone expresses thoughts of self-harm, suicide, or a mental health crisis, do not try to be their therapist. Acknowledge what they shared with warmth, then gently encourage them to speak with a mental health professional or call a crisis line. You are a growth coach, not a crisis counselor.`,
  },
  CoachDavid: {
    name:        'Coach David',
    subtitle:    'Fitness & Wellness Guide',
    character:   'coach',
    gradFrom:    '#0f172a',
    gradMid:     '#1e40af',
    gradTo:      '#38BDF8',
    bgDark:      '#000000',
    userBubble:  'from-[#1e40af] to-[#38BDF8]',
    micActive:   '#38BDF8',
    icon:        'D',
    // Voice: High-Energy Male Fitness Coach
    // Rate 1.22 — FASTEST bot — driven, relentless, punchy cadence
    // Pitch 0.90 — lower than neutral — masculine authority, not hollow
    // Unique first priorities: 'Tom' (macOS), 'Google US English', 'Guy Online'
    voiceGender: 'male',
    voiceNames:  [
      // macOS — Tom is distinct from Alex/Fred (more upbeat cadence)
      'Tom', 'Alex', 'Fred',
      // Chrome — Male voices only (Google US English is female on most Chrome builds)
      'Google UK English Male',
      // Windows Neural — energetic American males first
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Davis Online (Natural) - English (United States)',
      'Microsoft Christopher Online (Natural) - English (United States)',
      'Microsoft Eric Online (Natural) - English (United States)',
      // UK as lower priority for David
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      // Desktop fallbacks
      'Microsoft David Desktop - English (United States)',
      'Microsoft Mark Desktop - English (United States)',
      // iOS
      'Aaron', 'Rishi',
    ],
    voiceRate:   1.22,   // fastest — driven, no-nonsense
    voicePitch:  0.90,   // masculine authority, punchy depth
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

GRACE AND FORGIVENESS: When someone misses a workout, falls off their routine, or expresses guilt about their body or fitness, lead with grace — not guilt. Say things like "Grace, not guilt — let's just get back at it" or "Missing a day doesn't erase your progress. God's mercies are new every morning, and so is your chance to move." Never shame someone for inconsistency. Celebrate the return, not the streak.

SAFETY: For any injury, pain, or medical symptom, always recommend the person see a doctor or physical therapist before training through it. Never diagnose or prescribe rehabilitation for injuries. Your role is training guidance, not medical advice.`,
  },
  ChefDaniel: {
    name:        'Chef Daniel',
    subtitle:    'Nutrition & Meal Coach',
    character:   'chef',
    gradFrom:    '#052e16',
    gradMid:     '#166534',
    gradTo:      '#22c55e',
    bgDark:      '#000000',
    userBubble:  'from-[#166534] to-[#22c55e]',
    micActive:   '#22c55e',
    icon:        'C',
    // Voice: Friendly Culinary Guide — British warmth, expressive
    // Rate 0.96 — natural conversational pace, room for flavour
    // Pitch 1.08 — slightly bright/lifted, enthusiastic about food
    // Unique first priorities: 'Daniel'/'Oliver'/'Arthur' (British warmth)
    voiceGender: 'male',
    voiceNames:  [
      // macOS — Daniel (British, warm) is Chef Daniel's anchor voice
      'Daniel', 'Oliver', 'Arthur',
      // Chrome British
      'Google UK English Male',
      // Windows Neural UK (warm British accent fits chef persona)
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft George Desktop - English (Great Britain)',
      // US fallback (lower priority — British fits better)
      'Microsoft Davis Online (Natural) - English (United States)',
      'Microsoft David Desktop - English (United States)',
      // iOS
      'Gordon', 'Rishi',
    ],
    voiceRate:   0.96,   // conversational, room to breathe
    voicePitch:  1.08,   // bright, enthusiastic — food energy
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

GRACE AND FORGIVENESS: When someone admits to eating poorly, binging, or falling off their nutrition plan, respond with zero judgment. Food is not a moral issue. Say things like "One meal doesn't define your health — let's make the next one nourishing" or "Give yourself the same grace God gives you. Tomorrow's plate is a fresh start." Never use language that creates shame around food choices.

ALLERGEN SAFETY (CRITICAL): Before suggesting ANY recipe, meal, or food recommendation, you MUST ask about food allergies and dietary restrictions if they have not already been disclosed in this conversation. When allergies are known, NEVER suggest foods containing those allergens. Always include an allergen notice with your recipes listing common allergens present (nuts, dairy, gluten, eggs, soy, shellfish, sesame). If unsure whether a food contains an allergen, say so explicitly and recommend the user verify ingredients. This is a safety issue — allergic reactions can be life-threatening.

FASTING (CRITICAL): When users talk about fasting — starting one, currently on one, breaking one, or asking for advice — your role is to honor the spiritual practice while making sure they fast safely. Cover the basics whenever it is relevant:
- HYDRATION is non-negotiable on any food fast. Water, herbal tea, and broth (for fasts longer than 24 hours) keep electrolytes from crashing.
- BREAKING A FAST MATTERS. The longer the fast, the more carefully it must be broken. Refeeding too fast after 3+ days of food restriction can cause refeeding syndrome — a real medical emergency. Recommend slow reintroduction: bone broth, soft-cooked vegetables, then small portions of easy-to-digest protein. No buffet. No "just one cheat meal."
- WARNING SIGNS to listen to (and stop the fast if they appear): dizziness that doesn't pass, heart palpitations, severe fatigue, fainting, confusion, persistent nausea, irregular heartbeat. These are not "spiritual breakthrough" — they are the body asking for food.
- WHO SHOULD NOT FOOD-FAST: pregnant or nursing women, people with diabetes (especially insulin-dependent), people with active or past eating disorders, people on medications that require food, people under 18, people who are underweight. For these populations, encourage other forms of fasting (social media, entertainment, complaining, spending) rather than food.
- PARTIAL FASTS can be just as spiritually meaningful as full water-only fasts, and they are far safer for most people. The Daniel Fast (vegetables, fruits, water — no meat, no leavened bread, no sweets) is biblically rooted and nutritionally sound for most adults.
- GENTLE FRAMING when concerned: never shame, never lecture. Say things like "I want to make sure your body is with you in this — let's talk about how you're feeling physically." or "Fasting is a beautiful practice when it's done in a way that honors the body God gave you."

SAFETY: For medical nutrition needs — diabetes, eating disorders, kidney disease, prolonged or extreme fasts — defer to a registered dietitian or physician. You are a culinary and wellness guide, not a clinical nutritionist. If a user describes symptoms suggesting an eating disorder or a medical emergency, gently encourage them to talk to a doctor and offer the Hannah chatbot for emotional support.`,
  },
  Gideon: {
    name:        'Gideon',
    subtitle:    'Biblical Wisdom Guide',
    character:   'gideon',
    gradFrom:    '#1a0f00',
    gradMid:     '#7c5a00',
    gradTo:      '#D9B878',
    bgDark:      '#000000',
    userBubble:  'from-[#7c5a00] to-[#c9a227]',
    micActive:   '#D9B878',
    icon:        'G',
    // Voice: Old Prophet — SLOWEST + DEEPEST of all bots — unmistakable
    // Rate 0.65 — ancient, unhurried, every word has weight (was 0.80)
    // Pitch 0.70 — deepest voice — gravitas, earned authority (was 0.85)
    // Volume 0.90 — intimate, not booming
    // Unique first priorities: 'Alex' (deep macOS voice), 'Fred' (gravelly macOS)
    voiceGender: 'male',
    voiceNames:  [
      // macOS — Alex is the deepest/most authoritative built-in voice
      'Alex', 'Fred',
      // Windows Neural UK (measured British accent suits prophet archetype)
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft George Desktop - English (Great Britain)',
      // macOS British
      'Daniel', 'Arthur',
      // Chrome
      'Google UK English Male',
      // US fallbacks
      'Microsoft Mark Desktop - English (United States)',
      'Microsoft David Desktop - English (United States)',
      // iOS
      'Gordon',
    ],
    voiceRate:   0.65,   // SLOWEST — ancient wisdom, every word measured
    voicePitch:  0.70,   // DEEPEST — unmistakable gravitas
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
    bgDark:      '#000000',
    userBubble:  'from-[#3B0764] to-[#7C3AED]',
    micActive:   '#A78BFA',
    icon:        'P',
    // Voice: Calm Measured Authority — deliberate, grounded, pastor-coach weight
    // Rate 0.88 — deliberate, not slow — each word intentional
    // Pitch 0.84 — grounded male depth, calmer than David, deeper than Daniel
    // Unique first priorities: 'Fred' (gravelly macOS) then 'Arthur' (British authority)
    voiceGender: 'male',
    voiceNames:  [
      // macOS — Fred has a slightly gravelly authority
      'Fred', 'Arthur', 'Alex',
      // Chrome US
      'Google US English',
      // Windows Neural US — calm, measured American voices
      'Microsoft Davis Online (Natural) - English (United States)',
      'Microsoft Christopher Online (Natural) - English (United States)',
      // Chrome UK
      'Google UK English Male',
      // Windows Neural UK
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      // Desktop
      'Microsoft Mark Desktop - English (United States)',
      'Microsoft David Desktop - English (United States)',
      // iOS
      'Rishi', 'Aaron',
    ],
    voiceRate:   0.88,   // deliberate — every word carries weight
    voicePitch:  0.84,   // grounded depth, calmer than David
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

GRACE AND FORGIVENESS: You understand that transformation requires both truth and grace. When someone is struggling with repeated failure, broken commitments, or feeling like they've let God down, remind them that God's grace is not a reward for good behavior — it's the foundation they stand on. Help them separate their identity from their performance. Use scripture to anchor people in who they ARE in Christ, not just what they should DO.

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
  // First sentence: ease in — voice establishes before full pace
  if (sentIdx === 0)         rate  -= 0.05;
  // Questions: rising intonation — pitch up, pace down
  if (isQ)  { pitch += 0.10; rate  -= 0.06; }
  // Exclamations: energy spike — faster + brighter
  if (isEx) { rate  += 0.10; pitch += 0.06; }
  // Short punchy sentences: snap them out
  if (words <= 5 && sentIdx > 0) rate += 0.06;
  // Long complex sentences: give them room
  if (words > 20) rate -= 0.06;
  // Medium-short (6-9 words): slight lift
  if (words >= 6 && words <= 9 && sentIdx > 0) rate += 0.03;
  return {
    rate:  Math.max(0.58, Math.min(1.40, rate)),
    pitch: Math.max(0.65, Math.min(1.40, pitch)),
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
                   'brian', 'christopher', 'reed', 'rodney', 'cepstral',
                   'liam', 'oliver', 'gordon', 'matthew', 'stephen', 'charles', 'jack'];
const FEMALE_KW = ['female', 'zira', 'hazel', 'siri', 'cortana', 'samantha', 'karen',
                   'victoria', 'moira', 'tessa', 'jenny', 'aria', 'rachel', 'susan',
                   'lisa', 'linda', 'joanna', 'ivy', 'alice', 'kate', 'emma', 'clara',
                   'nicky', 'serena', 'allison', 'ava', 'fiona', 'kyoko', 'luciana'];

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

  // 2. Partial preferred name match — but reject confirmed-opposite-gender voices
  const isTargetMalePre = gender === 'male';
  const genderReject    = isTargetMalePre ? isVoiceFemale : isVoiceMale;
  for (const name of preferredNames) {
    const v = voices.find(v =>
      v.name.toLowerCase().includes(name.toLowerCase()) && genderReject(v) !== true
    );
    if (v) return v;
  }

  const isTargetMale = isTargetMalePre;
  const genderCheck   = isTargetMale ? isVoiceMale  : isVoiceFemale;
  const genderRejectH = isTargetMale ? isVoiceFemale : isVoiceMale; // confirmed opposite

  // 3. Neural English voice — confirmed correct gender
  const neuralGen = enVoices.find(v =>
    neuralKW.some(k => v.name.toLowerCase().includes(k)) && genderCheck(v) === true
  );
  if (neuralGen) return neuralGen;

  // 4. Any English voice — confirmed correct gender (neural or not)
  const anyConfirmed = enVoices.find(v => genderCheck(v) === true);
  if (anyConfirmed) return anyConfirmed;

  // 5. Any neural English voice that isn't confirmed wrong gender
  const anyNeural = enVoices.find(v =>
    neuralKW.some(k => v.name.toLowerCase().includes(k)) && genderRejectH(v) !== true
  );
  if (anyNeural) return anyNeural;

  // 6. Any English voice that isn't confirmed wrong gender
  const notOpposite = enVoices.find(v => genderRejectH(v) !== true);
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

/* ─── Google Cloud TTS for Gideon ───────────────────────────────────────────
 * Calls the gideonTTS backend function which returns a base64 MP3.
 * Falls back to browser TTS on any error.
 * ───────────────────────────────────────────────────────────────────────── */
async function speakWithGoogleTTS({ text, cfg, onStart, onEnd, onError, primedAudio }) {
  let cancelled = false;
  let audioEl   = null;

  try {
    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '').replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 4500);

    if (!cleaned) { onEnd?.(); return () => {}; }

    const result = await base44.functions.invoke('gideonTTS', { text: cleaned });
    if (cancelled) { onEnd?.(); return () => {}; }

    const audioContent = result?.audioContent ?? result?.data?.audioContent;
    if (!audioContent) throw new Error('No audioContent in response');

    const binary = atob(audioContent);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url  = URL.createObjectURL(blob);

    // Use primed element on iOS, fresh element on desktop
    audioEl = primedAudio || new Audio();
    audioEl.src = url;
    audioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audioEl.onerror = () => { URL.revokeObjectURL(url); onError?.(); };

    await audioEl.play();
    onStart?.();

  } catch (err) {
    console.error('[Gideon TTS]', err);
    return speakWithBrowserTTS({ text, cfg, onStart, onEnd, onError });
  }

  return () => {
    cancelled = true;
    if (audioEl) { try { audioEl.pause(); audioEl.src = ''; } catch(_){} }
  };
}


/* ─── Google Cloud TTS for Chef Daniel ──────────────────────────────────────
 * Calls the chefDanielTTS backend function which returns a base64 MP3.
 * Falls back to browser TTS on any error.
 * ───────────────────────────────────────────────────────────────────────── */
async function speakWithChefDanielTTS({ text, cfg, onStart, onEnd, onError, primedAudio }) {
  let cancelled = false;
  let audioEl   = null;

  try {
    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '').replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 4500);

    if (!cleaned) { onEnd?.(); return () => {}; }

    const result = await base44.functions.invoke('chefDanielTTS', { text: cleaned });
    if (cancelled) { onEnd?.(); return () => {}; }

    const audioContent = result?.audioContent ?? result?.data?.audioContent;
    if (!audioContent) throw new Error('No audioContent in response');

    const binary = atob(audioContent);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url  = URL.createObjectURL(blob);

    audioEl = primedAudio || new Audio();
    audioEl.src = url;
    audioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audioEl.onerror = () => { URL.revokeObjectURL(url); onError?.(); };

    await audioEl.play();
    onStart?.();

  } catch (err) {
    console.error('[Chef Daniel TTS]', err);
    return speakWithBrowserTTS({ text, cfg, onStart, onEnd, onError });
  }

  return () => {
    cancelled = true;
    if (audioEl) { try { audioEl.pause(); audioEl.src = ''; } catch(_){} }
  };
}


/* ─── Google Cloud TTS for Coach David ──────────────────────────────────────
 * Calls the coachDavidTTS backend function which returns a base64 MP3.
 * Falls back to browser TTS on any error.
 * ───────────────────────────────────────────────────────────────────────── */
async function speakWithCoachDavidTTS({ text, cfg, onStart, onEnd, onError, primedAudio }) {
  let cancelled = false;
  let audioEl   = null;

  try {
    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '').replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 4500);

    if (!cleaned) { onEnd?.(); return () => {}; }

    const result = await base44.functions.invoke('coachDavidTTS', { text: cleaned });
    if (cancelled) { onEnd?.(); return () => {}; }

    const audioContent = result?.audioContent ?? result?.data?.audioContent;
    if (!audioContent) throw new Error('No audioContent in response');

    const binary = atob(audioContent);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url  = URL.createObjectURL(blob);

    audioEl = primedAudio || new Audio();
    audioEl.src = url;
    audioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audioEl.onerror = () => { URL.revokeObjectURL(url); onError?.(); };

    await audioEl.play();
    onStart?.();

  } catch (err) {
    console.error('[Coach David TTS]', err);
    return speakWithBrowserTTS({ text, cfg, onStart, onEnd, onError });
  }

  return () => {
    cancelled = true;
    if (audioEl) { try { audioEl.pause(); audioEl.src = ''; } catch(_){} }
  };
}


/* ─── Google Cloud TTS for Coach Paul ───────────────────────────────────────
 * Calls the coachPaulTTS backend function which returns a base64 MP3.
 * Falls back to browser TTS on any error.
 * ───────────────────────────────────────────────────────────────────────── */
async function speakWithCoachPaulTTS({ text, cfg, onStart, onEnd, onError, primedAudio }) {
  let cancelled = false;
  let audioEl   = null;

  try {
    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '').replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 4500);

    if (!cleaned) { onEnd?.(); return () => {}; }

    const result = await base44.functions.invoke('coachPaulTTS', { text: cleaned });
    if (cancelled) { onEnd?.(); return () => {}; }

    const audioContent = result?.audioContent ?? result?.data?.audioContent;
    if (!audioContent) throw new Error('No audioContent in response');

    const binary = atob(audioContent);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url  = URL.createObjectURL(blob);

    audioEl = primedAudio || new Audio();
    audioEl.src = url;
    audioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audioEl.onerror = () => { URL.revokeObjectURL(url); onError?.(); };

    await audioEl.play();
    onStart?.();

  } catch (err) {
    console.error('[Coach Paul TTS]', err);
    return speakWithBrowserTTS({ text, cfg, onStart, onEnd, onError });
  }

  return () => {
    cancelled = true;
    if (audioEl) { try { audioEl.pause(); audioEl.src = ''; } catch(_){} }
  };
}


/* ─── Google Cloud TTS for Hannah ───────────────────────────────────────────
 * Calls the hannahTTS backend function which returns a base64 MP3.
 * Falls back to browser TTS on any error.
 * ───────────────────────────────────────────────────────────────────────── */
async function speakWithHannahTTS({ text, cfg, onStart, onEnd, onError, primedAudio }) {
  let cancelled = false;
  let audioEl   = null;

  try {
    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '').replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 4500);

    if (!cleaned) { onEnd?.(); return () => {}; }

    const result = await base44.functions.invoke('hannahTTS', { text: cleaned });
    if (cancelled) { onEnd?.(); return () => {}; }

    const audioContent = result?.audioContent ?? result?.data?.audioContent;
    if (!audioContent) throw new Error('No audioContent in response');

    const binary = atob(audioContent);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const url  = URL.createObjectURL(blob);

    audioEl = primedAudio || new Audio();
    audioEl.src = url;
    audioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
    audioEl.onerror = () => { URL.revokeObjectURL(url); onError?.(); };

    await audioEl.play();
    onStart?.();

  } catch (err) {
    console.error('[Hannah TTS]', err);
    return speakWithBrowserTTS({ text, cfg, onStart, onEnd, onError });
  }

  return () => {
    cancelled = true;
    if (audioEl) { try { audioEl.pause(); audioEl.src = ''; } catch(_){} }
  };
}


// Browser TTS for all non-Gideon bots (and Gideon fallback)
async function speakWithBrowserTTS({ text, cfg, onStart, onEnd, onError }) {
  if (!('speechSynthesis' in window)) { onEnd?.(); return () => {}; }
  try { window.speechSynthesis.cancel(); } catch (_) {}
  const prepared  = prepareTextForSpeech(text);
  if (!prepared) { onEnd?.(); return () => {}; }
  const sentences = splitSentencesWSA(prepared);
  let idx = 0, cancelled = false;
  const speakNext = (voice) => {
    if (cancelled || idx >= sentences.length) { onEnd?.(); return; }
    const i = idx++;
    const chunk = sentences[i].trim();
    if (!chunk) { speakNext(voice); return; }
    try {
      const { rate, pitch } = prosodyFor(chunk, i, cfg || {});
      const utt = new SpeechSynthesisUtterance(chunk);
      utt.rate = rate; utt.pitch = pitch; utt.volume = cfg?.voiceVolume ?? 1.0;
      if (voice) utt.voice = voice;
      if (i === 0) utt.onstart = () => onStart?.();
      utt.onend   = () => speakNext(voice);
      utt.onerror = (e) => { if (e.error !== 'interrupted' && e.error !== 'canceled') onError?.(); else onEnd?.(); };
      window.speechSynthesis.speak(utt);
    } catch (_) { onEnd?.(); }
  };
  const voices = await loadVoices();
  if (!cancelled) speakNext(pickVoice(voices, cfg?.voiceNames || [], cfg?.voiceGender));
  return () => { cancelled = true; try { window.speechSynthesis.cancel(); } catch (_) {} };
}

// speakText — tries ElevenLabs first (client-side), falls back to Base44/Google TTS.
async function speakText({ text, cfg, onStart, onEnd, onError, primedAudio }) {
  const character = cfg?.character;

  // Clean text for TTS
  const cleaned = text
    ?.replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{2,}/g, '. ')
    .trim();

  if (!cleaned) { onEnd?.(); return () => {}; }

  let cancelled = false;
  let audioEl = null;

  const cancelFn = () => {
    cancelled = true;
    if (audioEl) { try { audioEl.pause(); audioEl.src = ''; } catch {} }
  };

  try {
    // Try ElevenLabs first (client-side, no Base44 function needed)
    const audioContent = await elevenLabsSpeak(cleaned, character);

    if (cancelled) { onEnd?.(); return cancelFn; }

    if (audioContent) {
      // ElevenLabs succeeded — play the audio
      const binary = atob(audioContent);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      audioEl = primedAudio || new Audio();
      audioEl.src = url;
      audioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
      audioEl.onerror = () => { URL.revokeObjectURL(url); onError?.(); };

      await audioEl.play();
      onStart?.();
      return cancelFn;
    }

    // ElevenLabs failed — fall back to Base44/Google Cloud TTS
    console.warn('[TTS] ElevenLabs failed, falling back to Base44 function');
    const fallbackMap = {
      gideon: 'gideonTTS',
      hannah: 'hannahTTS',
      chef: 'chefDanielTTS',
      coach: 'coachDavidTTS',
      paul: 'coachPaulTTS',
    };
    const funcName = fallbackMap[character];
    if (funcName) {
      const result = await base44.functions.invoke(funcName, { text: cleaned });
      if (cancelled) { onEnd?.(); return cancelFn; }
      const fallbackAudio = result?.audioContent ?? result?.data?.audioContent;
      if (fallbackAudio) {
        const binary = atob(fallbackAudio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        audioEl = primedAudio || new Audio();
        audioEl.src = url;
        audioEl.onended = () => { URL.revokeObjectURL(url); onEnd?.(); };
        audioEl.onerror = () => { URL.revokeObjectURL(url); onError?.(); };

        await audioEl.play();
        onStart?.();
        return cancelFn;
      }
    }

    // All cloud TTS failed — fall back to browser speech synthesis
    return speakWithBrowserTTS({ text: cleaned, cfg, onStart, onEnd, onError });

  } catch (err) {
    console.error('[TTS] Error:', err);
    // Last resort: browser TTS
    return speakWithBrowserTTS({ text: cleaned, cfg, onStart, onEnd, onError });
  }
}


// ─── Quick-prompt library — one drawer per bot ───────────────────────────────
const QUICK_PROMPTS = {
  Hannah: [
    { label: 'Build a better habit',     prompt: 'Help me build a better daily habit. Here is what I am trying to change:' },
    { label: 'Feeling stuck',            prompt: 'I am feeling stuck and cannot move forward. Here is what has been going on:' },
    { label: 'Set better boundaries',    prompt: 'Help me set better boundaries. This situation keeps happening:' },
    { label: 'Stop self-sabotaging',     prompt: 'I keep sabotaging myself. Here is the pattern I notice:' },
    { label: 'Manage stress & burnout',  prompt: 'Help me manage stress and burnout. Here is what my days look like:' },
    { label: 'Attachment style',         prompt: 'Help me understand my attachment style and how it affects my relationships.' },
    { label: 'Emotional intelligence',   prompt: 'How can I become more emotionally intelligent in my daily life?' },
    { label: 'Focus & productivity',     prompt: 'I need help with focus and productivity. Here is where I keep getting distracted:' },
  ],
  CoachDavid: [
    { label: 'Build a workout plan',     prompt: 'Build me a personalized workout plan. My goals are:' },
    { label: 'Quick workout now',        prompt: 'Give me a quick workout I can do right now. I have this much time:' },
    { label: 'Break a plateau',          prompt: 'Help me break a plateau. Here is what I have been doing and where I am stuck:' },
    { label: 'Fix my form',              prompt: 'Help me fix my form on this exercise. The movement I am struggling with:' },
    { label: 'Weekly schedule',          prompt: 'Create a weekly workout schedule for me. My constraints and goals are:' },
    { label: 'Fat-loss strategy',        prompt: 'Give me a real fat-loss strategy. Here is my current routine:' },
    { label: 'Muscle-building',          prompt: 'Give me a muscle-building strategy. Here is where I am at right now:' },
    { label: 'Hold me accountable',      prompt: 'Hold me accountable. The commitment I am making today is:' },
  ],
  ChefDaniel: [
    { label: 'What should I cook?',      prompt: 'I need dinner ideas. Here is what I have in my fridge:' },
    { label: 'Weekly meal plan',         prompt: 'Create a full weekly meal plan with a grocery list. My dietary preferences:' },
    { label: 'More protein',             prompt: 'Help me get more protein in my diet. Here is what I typically eat:' },
    { label: 'Healthy meal prep',        prompt: 'Teach me how to meal prep for the week. I have this much time on weekends:' },
    { label: 'New cooking technique',    prompt: 'Teach me a cooking technique I should know. My current skill level is:' },
    { label: 'Cut calories, keep taste', prompt: 'Help me cut calories without sacrificing taste. My favorite foods are:' },
    { label: 'Batch cook for the week',  prompt: 'Give me a batch cooking plan I can do Sunday. My goals this week are:' },
    { label: 'Explain a recipe',         prompt: 'Help me understand how to cook this properly:' },
  ],
  Gideon: [
    { label: 'Understand a passage',     prompt: 'Help me understand this Bible passage. Here is the verse I am reading:' },
    { label: 'Guide me in prayer',       prompt: 'Guide me in prayer today. Here is what is on my heart:' },
    { label: 'Find verses on strength',  prompt: 'Share some verses about strength and perseverance for what I am facing.' },
    { label: 'Anxiety & worry',          prompt: 'What does the Bible say about anxiety and how to find peace?' },
    { label: 'Devotional plan',          prompt: 'Create a short devotional plan for me. I am going through:' },
    { label: 'Grow closer to God',       prompt: 'How can I grow closer to God in my daily life right now?' },
    { label: 'Faith & doubt',            prompt: 'I am struggling with doubt. How do I hold onto faith when things are hard?' },
    { label: 'Apply scripture to life',  prompt: 'Help me apply this scripture to something I am dealing with:' },
  ],
  CoachPaul: [
    { label: 'Motivate me today',        prompt: 'I need motivation today. Here is where my head is at:' },
    { label: 'My focus this week',       prompt: 'What should I focus on this week to make real progress? Here is my situation:' },
    { label: 'Build discipline',         prompt: 'Help me build more discipline. Here is where I keep falling short:' },
    { label: 'Overcome fear',            prompt: 'I am letting fear stop me. Help me move past it. Here is what it is:' },
    { label: 'Leadership at work',       prompt: 'I need to step up as a leader. Here is the situation I am in:' },
    { label: 'Morning routine',          prompt: 'Help me build a powerful morning routine that sets me up for success.' },
    { label: 'Identify my purpose',      prompt: 'Help me get clearer on my purpose and what I am really building toward.' },
    { label: 'Hold the standard',        prompt: 'I have been slipping on my standards. Help me reset and recommit.' },
  ],
};


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
        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-br ${cfg.userBubble} shadow-md dark:shadow-none`}>
          {/* Video message playback */}
          {message.videoUrl && (
            <div className="mb-2 -mx-1.5 -mt-1 rounded-xl overflow-hidden">
              <video
                src={message.videoUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-xl"
                style={{ maxHeight: 180 }}
              />
            </div>
          )}
          <p className="text-sm text-white leading-relaxed">{message.content}</p>
          {message.videoDuration > 0 && (
            <p className="text-[10px] text-white/30 mt-1 flex items-center gap-1">🎥 {Math.floor(message.videoDuration / 60)}:{(message.videoDuration % 60).toString().padStart(2, '0')}</p>
          )}
        </div>
      ) : (
        <div className="max-w-[78%]">
          <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/10 backdrop-blur-sm border border-white/12 shadow-md dark:shadow-none">
            {renderContent(message.content)}
            <button
              onClick={onSpeak}
              aria-label={isSpeaking ? 'Stop' : 'Listen'}
              className="flex items-center gap-1 min-h-[44px] min-w-[44px] mt-2 text-white/30 hover:text-white/65 transition-colors"
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

  // Chat persistence — save/restore messages per bot
  const chatKey = `pr_chat_${bot}`;

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(chatKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const currentCfg = BOT_CONFIG[bot] || BOT_CONFIG.Hannah;
          // If single welcome message that doesn't match this bot, discard it
          if (parsed.length === 1 && parsed[0].role === 'assistant' && parsed[0].content !== currentCfg.welcomeMsg) {
            return [];
          }
          return parsed.slice(-30);
        }
      }
    } catch {}
    return [];
  });

  // Persist messages on change
  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem(chatKey, JSON.stringify(messages.slice(-30))); } catch {}
    }
  }, [messages, chatKey]);
  const [input,            setInput]            = useState('');
  const [isLoading,        setIsLoading]        = useState(false);
  const [isListening,      setIsListening]      = useState(false);
  const [speakingIdx,      setSpeakingIdx]      = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [userProfile,      setUserProfile]      = useState(null);
  const [chatMemories,     setChatMemories]     = useState([]);
  const [crossContext,     setCrossContext]      = useState('');

  // Load user profile once — injected into every bot prompt
  useEffect(() => {
    base44.auth.me().then(u => {
      setUserProfile(u);
      // Load chatbot memories + cross-context
      const botNameMap = { hannah: 'Hannah', coach: 'CoachDavid', chef: 'ChefDaniel', gideon: 'Gideon', paul: 'CoachPaul' };
      const dbName = botNameMap[cfg.character] || cfg.character;
      getChatbotMemories(dbName).then(m => setChatMemories(m)).catch(() => {});
      getCrossContext(cfg.character, u?.email).then(c => setCrossContext(c)).catch(() => {});
    }).catch(() => {});
  }, []);

  // Build personalised system prompt with user context
  const buildPrompt = useCallback((basePrompt) => {
    if (!userProfile) return basePrompt;
    const u = userProfile;
    const age = u.dob ? Math.floor((Date.now() - new Date(u.dob)) / 31557600000) : null;
    const lines = [
      `USER PROFILE:`,
      u.full_name              && `- Name: ${getDisplayName(u, '')}`,
      age                      && `- Age: ${age}`,
      u.biological_sex         && `- Sex: ${u.biological_sex}`,
      u.life_stage             && `- Life stage: ${u.life_stage}`,
      u.job_type               && `- Job type: ${u.job_type}`,
      u.goal_90_day            && `- 90-day goal: "${u.goal_90_day}"`,
      u.coaching_style         && `- Preferred coaching style: ${u.coaching_style}`,
      // Fitness
      u.fitness_level          && `- Fitness level: ${u.fitness_level}`,
      u.fitness_goals?.length  && `- Fitness goals: ${u.fitness_goals.join(', ')}`,
      u.weight_lbs             && `- Current weight: ${u.weight_lbs} lbs`,
      u.goal_weight_lbs        && `- Goal weight: ${u.goal_weight_lbs} lbs`,
      u.height_ft              && `- Height: ${u.height_ft}ft ${u.height_in || 0}in`,
      u.equipment?.length      && `- Equipment: ${u.equipment.join(', ')}`,
      u.workout_days           && `- Trains ${u.workout_days}x/week, ${u.workout_duration || '?'} min sessions`,
      u.preferred_workout_time && `- Prefers ${u.preferred_workout_time} workouts`,
      u.injuries               && `- Injuries/limitations: ${u.injuries}`,
      // Nutrition
      u.diet_type              && `- Diet: ${u.diet_type}`,
      u.allergies?.filter(a => a !== 'none').length && `- Allergies: ${u.allergies.filter(a => a !== 'none').join(', ')}`,
      u.meals_per_day          && `- Eats ${u.meals_per_day} meals/day`,
      u.cooking_time           && `- Cooking preference: ${u.cooking_time}`,
      // Faith
      u.bible_level            && `- Bible experience: ${u.bible_level}`,
      u.bible_translation      && `- Preferred translation: ${u.bible_translation}`,
      u.bible_topics?.length   && `- Scripture interests: ${u.bible_topics.join(', ')}`,
      u.devotional_depth       && `- Devotional depth: ${u.devotional_depth}`,
      u.in_church              && `- Church involvement: ${u.in_church}`,
      // Growth
      u.growth_areas?.length   && `- Growth focus areas: ${u.growth_areas.join(', ')}`,
      u.core_values?.length    && `- Core values: ${u.core_values.join(', ')}`,
      u.motivations?.length    && `- Motivations for joining: ${u.motivations.join(', ')}`,
    ].filter(Boolean).join('\n');

    return `${basePrompt}\n\n${lines}\n\nUse this profile to personalise your responses. Address them by first name occasionally. Reference their specific goals, stage, and preferences naturally — don't recite the profile back to them.${buildMemoryContext(chatMemories)}${crossContext}`;
  }, [userProfile, chatMemories, crossContext]);

  const inputRef           = useRef(null);
  const messagesEndRef     = useRef(null);
  const recognitionRef     = useRef(null);
  const isListeningRef     = useRef(false);
  const finalTranscriptRef = useRef('');
  const stopSpeechRef      = useRef(null);
  const pendingSendRef      = useRef(null);
  const videoBlobRef        = useRef(null);
  // Audio element primed inside the user-gesture of sendMessage, consumed by
  // the response auto-speak useEffect after the LLM responds. iOS WKWebView
  // requires the audio element to be created synchronously inside the gesture
  // for autoplay to work.
  const pendingPrimedAudioRef = useRef(null);

  const avatarSpeaking  = speakingIdx !== null;
  const avatarListening = isListening;
  const avatarThinking  = isLoading;

  // Init welcome message — always ensure first message matches current bot
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: cfg.welcomeMsg }]);
    } else {
      // Fix stale welcome message: if the first message doesn't match this bot's welcome, replace it
      setMessages(prev => {
        if (prev.length > 0 && prev[0].role === 'assistant' && prev[0].content !== cfg.welcomeMsg) {
          // Only replace if it's just the single welcome message (no real conversation yet)
          if (prev.length === 1) {
            return [{ role: 'assistant', content: cfg.welcomeMsg }];
          }
        }
        return prev;
      });
    }
    setSpeakingIdx(null);
    setInput('');
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

    // Prime an audio element synchronously inside this user-gesture so that
    // when we auto-speak the assistant's response (after the async LLM await),
    // iOS WKWebView still permits playback. The auto-speak useEffect consumes
    // this ref and clears it once used.
    try {
      const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        const a = new Audio();
        a.preload = 'auto';
        a.load();
        pendingPrimedAudioRef.current = a;
      }
    } catch {}

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-12)
        .map(m => `${m.role === 'user' ? 'User' : cfg.name}: ${m.content.substring(0, 400)}`)
        .join('\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${buildPrompt(cfg.systemPrompt)}\n\nCONVERSATION HISTORY:\n${history}\n\nUser: ${trimmed}`,
        add_context_from_internet: false,
      });

      setMessages(prev => {
        const updated = [...prev, { role: 'assistant', content: response }];
        // Save memories in background every 3rd user message
        const userMsgCount = updated.filter(m => m.role === 'user').length;
        if (userMsgCount === 2 || (userMsgCount > 2 && userMsgCount % 3 === 0)) {
          saveMemories(updated, cfg.name).then(() => {
            // Refresh memories for next response
            const botNameMap = { hannah: 'Hannah', coach: 'CoachDavid', chef: 'ChefDaniel', gideon: 'Gideon', paul: 'CoachPaul' };
            const dbName = botNameMap[cfg.character] || cfg.character;
            getChatbotMemories(dbName).then(m => setChatMemories(m)).catch(() => {});
          }).catch(() => {});
        }
        return updated;
      });
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a moment — please try again. I'm here for you.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, cfg]);

  // ── Topic-driven auto-open ────────────────────────────────────────────────
  // Some flows want to launch this chat already focused on a specific topic
  // (e.g. tapping "Chat with Chef Daniel" on a freshly-completed fast). The
  // calling code passes `?topic=...` (and optional context params) on the
  // ChatScreen URL. On mount, if the chat is empty and the URL contains a
  // recognised topic, we synthesise a natural opening message *as if the user
  // typed it* and dispatch it through the normal sendMessage flow. This
  // matches the established Quick-Prompt UX where a tap surfaces a user
  // message and the bot responds; we just wire the trigger to a URL param
  // instead of an in-screen chip.
  //
  // Topic registry — keep messages first-person, brief, and natural-sounding
  // so the user doesn't feel words have been put in their mouth. Each topic
  // can read additional params (fast_type, duration, etc.) for specificity.
  const topicAutoSentRef = useRef(false);
  useEffect(() => {
    if (topicAutoSentRef.current) return;
    const topic = searchParams.get('topic');
    if (!topic) return;
    // Only auto-send when the chat is empty or shows just the welcome message
    // (avoid spamming an existing conversation if the user shares this URL).
    const onlyWelcome = messages.length === 0 ||
      (messages.length === 1 && messages[0].role === 'assistant');
    if (!onlyWelcome) return;
    if (isLoading) return;
    if (!userProfile) return; // wait for profile so personalisation lands

    const fastType = searchParams.get('fast_type') || '';
    const duration = searchParams.get('duration') || '';
    const fastTypeLabel = ({
      food: 'food',
      social_media: 'social media',
      entertainment: 'entertainment',
      complaining: 'complaining',
      spending: 'spending',
      custom: 'custom',
    })[fastType] || fastType || 'fast';

    // Spiritual Assessment context. The SpiritualAssessment results screen
    // passes the user's overall score, percentage, level label, and the
    // names of their strongest/weakest categories so Gideon has enough to
    // give specific, biblically-grounded reflection rather than a generic
    // "tell me more" response. Categories are pipe-separated since some
    // labels contain spaces (e.g. "Sharing Faith") — keeps the URL clean.
    const assessmentPct       = searchParams.get('pct') || '';
    const assessmentLevel     = searchParams.get('level') || '';
    const assessmentStrengths = (searchParams.get('strengths') || '').split('|').filter(Boolean);
    const assessmentGrowth    = (searchParams.get('growth_areas') || '').split('|').filter(Boolean);
    // Friendly list joiner: ["A", "B"] -> "A and B"; ["A", "B", "C"] -> "A, B, and C"
    const joinList = (arr) => {
      if (arr.length === 0) return '';
      if (arr.length === 1) return arr[0];
      if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
      return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
    };

    const messageForTopic = (() => {
      switch (topic) {
        case 'fast_complete':
          return duration
            ? `I just finished a ${duration}-day ${fastTypeLabel} fast. Can you walk me through how to break it safely, and help me reflect on what God may have been doing in me through it?`
            : `I just completed a ${fastTypeLabel} fast. Can you walk me through how to break it safely, and help me reflect on what this season has shown me?`;
        case 'fast_safety':
          return duration
            ? `I'm currently on day-by-day with a ${duration}-day ${fastTypeLabel} fast. What should I be watching for to fast safely, and how do I tell the difference between healthy hunger and warning signs I should listen to?`
            : `I'm in the middle of a ${fastTypeLabel} fast. What should I be watching for to fast safely, and how do I tell the difference between healthy hunger and warning signs I should listen to?`;
        case 'fast_starting':
          return duration
            ? `I'm thinking about starting a ${duration}-day ${fastTypeLabel} fast. Can you help me prepare well — what should I do in the days before, and how do I set this up in a way that's safe and spiritually meaningful?`
            : `I'm thinking about starting a ${fastTypeLabel} fast. Can you help me prepare well — what should I do beforehand, and how do I set this up in a way that's safe and spiritually meaningful?`;
        case 'assessment_results': {
          // Build a natural-sounding opening message that includes enough
          // context for Gideon to respond specifically. Falls back gracefully
          // if any of the optional params are missing.
          const parts = ['I just took the Spiritual Assessment'];
          if (assessmentPct && assessmentLevel) {
            parts.push(` and scored ${assessmentPct}% — "${assessmentLevel}"`);
          } else if (assessmentPct) {
            parts.push(` and scored ${assessmentPct}%`);
          }
          parts.push('.');
          if (assessmentStrengths.length > 0) {
            parts.push(` My strongest areas were ${joinList(assessmentStrengths)}`);
            if (assessmentGrowth.length > 0) {
              parts.push(`, and the areas where I scored lowest were ${joinList(assessmentGrowth)}.`);
            } else {
              parts.push('.');
            }
          } else if (assessmentGrowth.length > 0) {
            parts.push(` The areas where I scored lowest were ${joinList(assessmentGrowth)}.`);
          }
          parts.push(' Can you help me reflect on what God might be saying through these results, and where I should focus next in my walk with Him?');
          return parts.join('');
        }
        default:
          return null;
      }
    })();

    if (!messageForTopic) return;

    topicAutoSentRef.current = true;
    // Small delay so the welcome message has a moment to land first;
    // makes the conversation feel paced rather than mashed together.
    const t = setTimeout(() => sendMessage(messageForTopic), 600);
    return () => clearTimeout(t);
  }, [searchParams, messages, userProfile, isLoading, sendMessage]);

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
    // Don't set speakingIdx yet — wait until onStart fires (audio actually playing)
    // This prevents avatar lip-sync during the TTS API fetch delay

    // Track whether a cancel was requested before the async fetch resolved
    let hasBeenCancelled = false;
    let innerCancel      = null;

    // Immediate cancel handle — works even during ElevenLabs fetch
    stopSpeechRef.current = () => {
      hasBeenCancelled = true;
      innerCancel?.();
      setSpeakingIdx(null);
    };

    // iOS Safari requires an <audio> element to be created and .load()-ed
    // synchronously within the user gesture. When handleSpeak is called
    // directly from a button click (the speaker icon), we can prime here.
    // When it's called from setTimeout via auto-speak, the gesture is gone —
    // sendMessage primes pendingPrimedAudioRef inside its own gesture for
    // the response auto-speak case to consume here.
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    let primedAudio = null;
    if (pendingPrimedAudioRef.current) {
      primedAudio = pendingPrimedAudioRef.current;
      pendingPrimedAudioRef.current = null; // consume once
    } else if ((cfg?.character === 'gideon' || cfg?.character === 'chef' || cfg?.character === 'coach' || cfg?.character === 'paul' || cfg?.character === 'hannah') && isIOS) {
      try {
        primedAudio = new Audio();
        primedAudio.preload = 'auto';
        primedAudio.load(); // prime within the gesture
      } catch(e) {}
    }

    speakText({
      text: content,
      cfg,
      primedAudio,
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

  // Stable ref to the latest handleSpeak so the auto-speak useEffects below
  // don't list handleSpeak in their deps (its identity changes every time
  // speakingIdx flips, which would re-fire and clean up our pending timers).
  const handleSpeakRef = useRef(handleSpeak);
  useEffect(() => { handleSpeakRef.current = handleSpeak; }, [handleSpeak]);

  // Auto-speak welcome message when chat opens (first visit only)
  const hasAutoSpokenRef = useRef(false);
  useEffect(() => {
    if (hasAutoSpokenRef.current) return;
    if (messages.length === 1 && messages[0].role === 'assistant' && messages[0].content === cfg.welcomeMsg) {
      hasAutoSpokenRef.current = true;
      const timer = setTimeout(() => {
        handleSpeakRef.current?.(cfg.welcomeMsg, 0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, cfg.welcomeMsg]);

  // Auto-speak each new assistant response after a user message.
  // Skips:
  //   - the welcome message (handled above)
  //   - replays of the same message we already auto-spoke
  //   - cases where the user is currently in voice-input listening mode
  // We use handleSpeakRef instead of handleSpeak directly so this effect's
  // re-firing isn't tied to handleSpeak's changing identity. Errors are
  // swallowed inside handleSpeak/speakText; if iOS Safari blocks auto-play
  // (no user gesture), the user can still tap the speaker icon to play
  // manually. In the iOS native shell (Capacitor WKWebView) auto-play is
  // permitted, which is the target environment for App Store delivery.
  const lastAutoSpokenIdxRef = useRef(-1);
  useEffect(() => {
    if (messages.length < 2) return; // need at least a welcome + one exchange
    const lastIdx = messages.length - 1;
    const last = messages[lastIdx];
    if (!last || last.role !== 'assistant') return;
    if (lastAutoSpokenIdxRef.current === lastIdx) return; // already auto-spoke this one
    if (last.content === cfg.welcomeMsg && lastIdx === 0) return; // covered by the welcome effect
    if (isListening) return; // don't speak while user is dictating
    lastAutoSpokenIdxRef.current = lastIdx;
    // Small delay so the message renders before speech starts; keeps the visual
    // and audio cues aligned and gives the audio element a tick to mount.
    const timer = setTimeout(() => {
      handleSpeakRef.current?.(last.content, lastIdx);
    }, 250);
    return () => clearTimeout(timer);
  }, [messages, cfg.welcomeMsg, isListening]);

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
    try { localStorage.removeItem(chatKey); } catch {}
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [showInputMenu, setShowInputMenu] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showText, setShowText] = useState(false);
  const callAudioUnlockRef = useRef(null);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ background: cfg.bgDark }}
    >
      {/* 2D cartoon background — hidden when video avatar is active */}
      {!hasPoseSet(cfg.character) && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BotBackground
          character={cfg.character}
          speaking={avatarSpeaking}
          listening={avatarListening}
          thinking={avatarThinking}
        />
      </div>
      )}

      {/* Tabernacle oil lamp lights — Gideon only */}
      {cfg.character === 'gideon' && (
        <TabernacleLights speaking={avatarSpeaking} />
      )}

      {/* Sacred Garden — Hannah only */}
      {cfg.character === 'hannah' && (
        <SacredGarden speaking={avatarSpeaking} />
      )}

      {/* Garden Harvest — Chef Daniel only */}
      {cfg.character === 'chef' && (
        <GardenHarvest speaking={avatarSpeaking} />
      )}

      {/* Iron Temple — Coach David only */}
      {cfg.character === 'coach' && (
        <IronTemple speaking={avatarSpeaking} />
      )}

      {/* Wisdom Study — Coach Paul only */}
      {cfg.character === 'paul' && (
        <WisdomStudy speaking={avatarSpeaking} />
      )}

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4"
        style={{ paddingTop: 'max(14px, env(safe-area-inset-top))', paddingBottom: 10,
          background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${cfg.gradTo}20` }}>

        {/* Left — Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/55 hover:text-white transition-colors px-1 py-1 flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Center — Bot identity */}
        <div className="text-center flex-1">
          <p className="text-white font-bold text-sm leading-tight">{cfg.name}</p>
          <p className="text-white/40 text-[10px] leading-tight">{cfg.subtitle}</p>
        </div>

        {/* Right — Text toggle + Restart + Close */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowText(v => !v)}
            aria-label={showText ? 'Hide text' : 'Show text'}
            title={showText ? 'Hide text' : 'Show text'}
            className="flex items-center justify-center transition-colors rounded-full"
            style={{ width: 36, height: 36, background: showText ? `${cfg.gradTo}30` : 'rgba(255,255,255,0.08)', border: `1px solid ${showText ? cfg.gradTo + '55' : 'rgba(255,255,255,0.14)'}`, color: showText ? 'white' : 'rgba(255,255,255,0.55)' }}>
            {showText ? <MessageSquareText style={{ width: 14, height: 14 }} /> : <EyeOff style={{ width: 14, height: 14 }} />}
          </button>
          <button
            onClick={clearChat}
            aria-label="Restart conversation"
            title="Restart"
            className="flex items-center justify-center transition-colors rounded-full"
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.55)' }}>
            <RotateCcw style={{ width: 14, height: 14 }} />
          </button>
          <button
            onClick={() => navigate(-1)}
            aria-label="Close chat"
            title="Close"
            className="flex items-center justify-center transition-all rounded-full"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.13)', border: `1.5px solid rgba(255,255,255,0.28)`, color: 'white' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>

      {/* ── AI Disclaimer Bar ── */}
      <motion.div className="relative z-20 flex-shrink-0 text-center"
        style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(8px)', padding: '4px 16px', borderBottom: `1px solid ${cfg.gradTo}10` }}
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 3, duration: 1 }}>
        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
          AI-generated content for informational purposes only — not professional medical, financial, or therapeutic advice
        </p>
      </motion.div>

      {/* ── Crisis Resources Banner ── */}
      <motion.div className="relative z-20 flex-shrink-0 flex items-center justify-center gap-2"
        style={{ background: 'rgba(255,255,255,0.06)', padding: '5px 16px', borderBottom: `1px solid ${cfg.gradTo}10` }}
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 3, duration: 1 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.40)' }}>In crisis?</span>
        <a href="tel:988" style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', textDecoration: 'none' }}>
          Call or text 988
        </a>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>|</span>
        <a href="sms:741741&body=HELLO" style={{ fontSize: 10, fontWeight: 600, color: '#60a5fa', textDecoration: 'none' }}>
          Text HOME to 741741
        </a>
      </motion.div>

      {/* ── Quick Prompt Chip Strip (top, always visible, horizontal scroll) ── */}
      <div
        className="relative z-20 flex-shrink-0"
        style={{ borderBottom: `1px solid ${cfg.gradTo}10`, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(12px)' }}
      >
        {/* Label row */}
        <div className="flex items-center gap-1.5 px-4 pt-2 pb-1">
          <Zap style={{ width: 11, height: 11, color: cfg.gradTo, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: `${cfg.gradTo}BB`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Quick Prompts
          </span>
        </div>
        {/* Scrollable chip row */}
        <div
          className="flex gap-2 px-4 pb-2.5 overflow-x-auto"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {(QUICK_PROMPTS[bot] || []).map((item, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(item.prompt)}
              disabled={isLoading}
              className="flex-shrink-0 transition-all"
              style={{
                padding: '5px 12px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                color: 'rgba(255,255,255,0.82)',
                background: `${cfg.gradTo}18`,
                border: `1px solid ${cfg.gradTo}38`,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.45 : 1,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Avatar zone — absolute, sits behind messages AND behind input bar */}
      <motion.div
        className="absolute flex flex-col items-center pointer-events-none"
        style={{ bottom: 60, left: 0, right: 0, zIndex: 5 }}
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
        <div className="relative flex items-center justify-center mx-auto" style={{ width: 'min(360px, 100vw)', height: 420 }}>
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

      {/* Gradient scrim — sits above avatar (z-5), below messages (z-10)
           Darkens the lower 50% of screen so input bar + messages are always legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 7,
          background: 'linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(8,18,38,0.55) 60%, rgba(8,18,38,0.90) 85%, rgba(8,18,38,0.98) 100%)',
        }}
      />

      {/* Message feed — z-10 so bubbles render over Gideon image */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 relative"
        style={{ WebkitOverflowScrolling: 'touch', zIndex: 10, paddingBottom: '340px' }}
        role="log" aria-live="polite" aria-label="Conversation">

        {/* Show text toggle hint when messages are hidden */}
        {!showText && messages.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-4"
          >
            <button
              onClick={() => setShowText(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white/30 text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              Tap to show conversation text
            </button>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {showText && messages.map((msg, idx) => (
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
        className="relative px-3 pt-2"
        style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
          zIndex: 50,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(24px)',
          borderTop: `1px solid ${cfg.gradTo}40`,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.55)' }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 max-w-lg mx-auto">

          {/* Hamburger menu — mic, video message, video call */}
          <div className="relative flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.87 }}
              onClick={() => setShowMediaMenu(v => !v)}
              aria-label="More options"
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{
                background: showMediaMenu ? `${cfg.gradTo}30` : 'rgba(255,255,255,0.11)',
                border: `1px solid ${showMediaMenu ? cfg.gradTo + '55' : 'rgba(255,255,255,0.18)'}`,
              }}
            >
              <Menu className={`w-4 h-4 ${showMediaMenu ? 'text-white' : 'text-white/55'}`} />
            </motion.button>

            {/* Popup menu */}
            <AnimatePresence>
              {showMediaMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-14 left-0 flex flex-col gap-2 p-2 rounded-2xl"
                  style={{ background: 'rgba(10,12,20,0.95)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)', minWidth: 160, zIndex: 60 }}
                >
                  {/* Mic */}
                  {speechSupported && (
                    <button
                      onClick={() => { setShowMediaMenu(false); toggleMic(); }}
                      disabled={permissionDenied}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ background: isListening ? `${cfg.micActive}22` : 'transparent', color: isListening ? cfg.micActive : 'rgba(255,255,255,0.7)' }}
                    >
                      {permissionDenied ? <MicOff className="w-4 h-4 opacity-35" /> : <Mic className="w-4 h-4" />}
                      {isListening ? 'Stop listening' : 'Voice input'}
                    </button>
                  )}
                  {/* Video message */}
                  <button
                    onClick={() => { setShowMediaMenu(false); setShowVideoRecorder(true); }}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 transition-all hover:text-white"
                    style={{ background: 'transparent' }}
                  >
                    <Video className="w-4 h-4" />
                    Video message
                  </button>
                  {/* Video call */}
                  <button
                    onClick={() => {
                      setShowMediaMenu(false);
                      try {
                        const a = new Audio();
                        a.preload = 'auto';
                        a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
                        a.load();
                        const p = a.play();
                        if (p && typeof p.then === 'function') {
                          p.then(() => { try { a.pause(); } catch (_) {} }).catch(() => {});
                        }
                        callAudioUnlockRef.current = a;
                      } catch (_) {}
                      stopListening();
                      stopSpeechRef.current?.();
                      setSpeakingIdx(null);
                      setVideoCallOpen(true);
                    }}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 transition-all hover:text-white"
                    style={{ background: 'transparent' }}
                  >
                    <PhoneCall className="w-4 h-4" />
                    Video call
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Direct Mic button */}
          {speechSupported && (
            <motion.button
              whileTap={{ scale: 0.87 }}
              onClick={toggleMic}
              disabled={permissionDenied}
              aria-label={isListening ? 'Stop listening' : 'Voice input'}
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{
                background: isListening ? `${cfg.gradTo}40` : 'rgba(255,255,255,0.11)',
                border: `1px solid ${isListening ? cfg.gradTo + '70' : 'rgba(255,255,255,0.18)'}`,
              }}
            >
              {isListening ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <MicOff className="w-4 h-4 text-red-400" />
                </motion.div>
              ) : (
                <Mic className={`w-4 h-4 ${permissionDenied ? 'text-white/20' : 'text-white/55'}`} />
              )}
            </motion.button>
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

      {/* Video Recorder Overlay */}
      <AnimatePresence>
        {showVideoRecorder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm">
              <p className="text-center text-white/60 text-xs mb-3">Record a video message for {cfg.name}</p>
              <VideoRecorder
                onRecordingComplete={(blob, duration) => {
                  // Store video info temporarily — we'll add it when transcript is ready
                  videoBlobRef.current = { url: URL.createObjectURL(blob), duration };
                }}
                onTranscript={(text) => {
                  const videoInfo = videoBlobRef.current;
                  setShowVideoRecorder(false);
                  
                  if (videoInfo) {
                    // Add video bubble to chat with transcript as content
                    setMessages(prev => [...prev, {
                      role: 'user',
                      content: text || '[Video message]',
                      videoUrl: videoInfo.url,
                      videoDuration: videoInfo.duration,
                    }]);
                  }

                  // Send transcript to AI without adding another user bubble
                  if (text && text.trim()) {
                    const trimmed = text.trim();
                    setIsLoading(true);
                    const history = messages.slice(-12)
                      .map(m => `${m.role === 'user' ? 'User' : cfg.name}: ${m.content.substring(0, 400)}`)
                      .join('\n\n');
                    base44.integrations.Core.InvokeLLM({
                      prompt: `${buildPrompt(cfg.systemPrompt)}\n\nCONVERSATION HISTORY:\n${history}\n\nUser: ${trimmed}`,
                      add_context_from_internet: false,
                    }).then(response => {
                      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                    }).catch(() => {
                      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't process that. Could you try again?" }]);
                    }).finally(() => setIsLoading(false));
                  }
                  
                  videoBlobRef.current = null;
                }}
                maxDurationSec={60}
                compact
                onClose={() => {
                  setShowVideoRecorder(false);
                  // If user recorded but no transcript, still show the video
                  const videoInfo = videoBlobRef.current;
                  if (videoInfo) {
                    setMessages(prev => [...prev, {
                      role: 'user',
                      content: '[Video message — no transcript]',
                      videoUrl: videoInfo.url,
                      videoDuration: videoInfo.duration,
                    }]);
                    videoBlobRef.current = null;
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Call Overlay (FaceTime-style turn-based call) */}
      <VideoCallMode
        isOpen={videoCallOpen}
        cfg={cfg}
        avatarNode={
          <CloudAvatarSafe
            character={cfg.character}
            isSpeaking={avatarSpeaking}
            isListening={avatarListening}
            isThinking={avatarThinking}
            color={cfg.gradTo}
          />
        }
        isSpeaking={avatarSpeaking}
        isListening={avatarListening}
        isThinking={avatarThinking}
        messages={messages}
        botLatestResponseIdx={(() => {
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'assistant') return i;
          }
          return -1;
        })()}
        currentInput={input}
        onClose={() => {
          setVideoCallOpen(false);
          stopListening();
          stopSpeechRef.current?.();
          setSpeakingIdx(null);
        }}
        onStartListening={() => {
          if (isListening || isLoading) return;
          startListening();
        }}
        onStopListening={() => {
          stopListening();
        }}
        onInterruptSpeech={() => {
          stopSpeechRef.current?.();
          setSpeakingIdx(null);
        }}
        onSpeakLatestReply={() => {
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'assistant') {
              handleSpeak(messages[i].content, i);
              return;
            }
          }
        }}
      />

    </motion.div>,
    document.body
  );
}