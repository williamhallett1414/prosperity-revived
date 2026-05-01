import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, RefreshCw, ArrowLeft, ChevronRight, Sparkles,
  Check, ChevronDown, Clock, Loader2 } from
'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';

// ─── Prompt library ───────────────────────────────────────────────────────────
const PROMPT_CATEGORIES = [
{
  id: 'fear',
  label: 'Fear & Anxiety',
  emoji: '🌊',
  color: '#3b82f6',
  gradient: 'from-blue-500 to-sky-400',
  prompts: [
  "What specific fear is controlling my decisions right now?",
  "What's the worst realistic outcome — and could I handle it?",
  "What would I do today if fear had no vote?",
  "What has worry ever actually prevented from happening?",
  "Where is God asking me to trust Him instead of controlling the outcome?"]

},
{
  id: 'identity',
  label: 'Identity & Worth',
  emoji: '👑',
  color: '#c9a227',
  gradient: 'from-amber-500 to-yellow-400',
  prompts: [
  "What lie about myself am I treating as fact right now?",
  "What would God say about me in this moment?",
  "Where am I measuring my worth by performance instead of personhood?",
  "Who told me I wasn't enough — and did they have the authority to?",
  "What truth about my identity have I been forgetting to stand on?"]

},
{
  id: 'comparison',
  label: 'Comparison & Envy',
  emoji: '🪞',
  color: '#a855f7',
  gradient: 'from-violet-500 to-purple-400',
  prompts: [
  "Who am I comparing myself to, and what assumption am I making about their life?",
  "What am I thankful for that I've been overlooking because I'm watching others?",
  "What is my unique assignment that no one else can fulfill?",
  "What would it look like to run my own race today?",
  "How is comparison stealing my joy right now?"]

},
{
  id: 'failure',
  label: 'Failure & Setback',
  emoji: '🌱',
  color: '#10b981',
  gradient: 'from-emerald-500 to-teal-400',
  prompts: [
  "What can I learn from this that I couldn't have learned any other way?",
  "Is this a full stop or a comma in my story?",
  "What would I tell a close friend who failed at exactly this?",
  "How has God redeemed something worse than this before?",
  "What one thing can I do right now to take my power back?"]

},
{
  id: 'overwhelm',
  label: 'Overwhelm & Clarity',
  emoji: '🎯',
  color: '#f97316',
  gradient: 'from-orange-500 to-amber-400',
  prompts: [
  "What is the one thing that, if I did it today, would make everything else easier?",
  "What am I carrying that was never mine to carry?",
  "What can I let go of without the world ending?",
  "Where am I saying yes when God is calling me to say no?",
  "What would my best self focus on in the next two hours?"]

},
{
  id: 'relationships',
  label: 'Relationships',
  emoji: '🤝',
  color: '#ec4899',
  gradient: 'from-pink-500 to-rose-400',
  prompts: [
  "What story am I telling about this person that may not be fully true?",
  "What would change if I tried to understand before being understood?",
  "Where do I need to extend grace — to them or to myself?",
  "What would love actually do in this situation?",
  "What unmet need of mine is driving my reaction right now?"]

}];


const ALL_QUICK_RESETS = [
{ label: "I am enough", sub: "Say it three times, mean it once", emoji: "💛" },
{ label: "This feeling will pass", sub: "Emotions are weather, not climate", emoji: "☁️" },
{ label: "I choose gratitude", sub: "Name one thing right now", emoji: "✨" },
{ label: "I trust the process", sub: "God's timing is not late", emoji: "🙏" },
{ label: "I am not my thoughts", sub: "You have thoughts; they don't have you", emoji: "🧘" },
{ label: "One step is enough", sub: "Progress, not perfection", emoji: "👣" },
{ label: "I am brave", sub: "Courage is not the absence of fear", emoji: "💪" },
{ label: "I choose peace", sub: "This moment is all I need to handle", emoji: "☮️" },
{ label: "My struggle has purpose", sub: "Every test is a testimony waiting", emoji: "🌟" },
{ label: "I deserve grace", sub: "Give yourself what you give others", emoji: "🕊️" },
{ label: "My best is enough", sub: "Perfect is the enemy of progress", emoji: "✅" },
{ label: "I am growing", sub: "Healing is not linear, it's forward", emoji: "🌱" }
];

const getDailyQuickResets = () => {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shuffled = [...ALL_QUICK_RESETS].sort(() => (seed * Math.random()) % 2 - 1);
  return shuffled.slice(0, 6);
};

const QUICK_RESETS = getDailyQuickResets();


const HISTORY_KEY = 'mindset_sessions_v1';
const loadHistory = () => {try {return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');} catch {return [];}};
const saveHistory = (h) => localStorage.setItem(HISTORY_KEY, JSON.stringify(h));

// ─── 3-step reframe session ───────────────────────────────────────────────────
function ReframeSession({ prompt, category, onComplete, onClose, user }) {
  const [step, setStep] = useState(0); // 0=identify, 1=challenge, 2=replace, 3=ai, 4=done
  const [thought, setThought] = useState('');
  const [challenge, setChallenge] = useState('');
  const [truth, setTruth] = useState('');
  const [aiCoach, setAiCoach] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const STEPS = [
  {
    num: 1, label: 'Identify',
    heading: "What's the thought?",
    sub: 'Name the exact negative thought running in your head right now. Be specific.',
    placeholder: 'The thought is: "I am…" / "This situation means…"',
    value: thought, set: setThought
  },
  {
    num: 2, label: 'Challenge',
    heading: 'Is it actually true?',
    sub: 'Question the thought. What evidence supports it? What evidence contradicts it?',
    placeholder: 'The evidence against this thought is…',
    value: challenge, set: setChallenge
  },
  {
    num: 3, label: 'Replace',
    heading: "What's the truth?",
    sub: 'Write a replacement thought grounded in reality and faith. Make it something you could actually believe.',
    placeholder: 'A more truthful thought is…',
    value: truth, set: setTruth
  }];


  const current = STEPS[step] || null;

  const nextStep = async () => {
    if (step < 2) {setStep((s) => s + 1);return;}
    // After step 3 → get AI coaching
    setStep(3); // AI loading
    setLoadingAi(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a warm, faith-based mindset coach. A user just completed a 3-step cognitive reframe:

Prompt they were working on: "${prompt}"

Step 1 — The negative thought they identified:
"${thought}"

Step 2 — How they challenged it:
"${challenge}"

Step 3 — The replacement truth they wrote:
"${truth}"

Write a 3-4 sentence personal coaching response. Affirm their insight, add one specific Scripture or truth that reinforces their replacement thought, and end with a short one-line declaration they can say aloud. Be warm, direct, and specific to what they wrote — not generic. Do not use bullet points.`
      });
      setAiCoach(response);
    } catch {
      setAiCoach("You just did something powerful — you named a lie, questioned it, and replaced it with truth. That's exactly how minds get renewed. Carry your replacement thought into the rest of your day. You are not your old thinking.");
    }
    setLoadingAi(false);
    setStep(4); // done with AI
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({
        entry_type: 'mindset_reset',
        content: `PROMPT: ${prompt}\n\nTHOUGHT: ${thought}\n\nCHALLENGE: ${challenge}\n\nTRUTH: ${truth}\n\nCOACH: ${aiCoach}`,
        prompt
      });
      const session = { ts: Date.now(), prompt, thought, truth, aiCoach, category: category?.id };
      const history = [session, ...loadHistory()].slice(0, 20);
      saveHistory(history);
      toast.success('Session saved to your journal');
      setSavedOk(true);
      onComplete();
    } catch {
      toast.error('Failed to save — try again');
    }
    setSaving(false);
  };

  const cat = category || PROMPT_CATEGORIES[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-white/5 border-b border-[#F2F6FA] flex-shrink-0 sticky top-0 z-10">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">Mindset Reset</p>
          <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">3-Step Reframe</p>
        </div>
        {/* Step pills */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((n) =>
          <div key={n} className={`w-6 h-1.5 rounded-full transition-all ${
          step >= n - 1 ? `bg-gradient-to-r ${cat.gradient}` : 'bg-[#F2F6FA] dark:bg-[#0A1A2F]'}`
          } />
          )}
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Prompt card */}
        <div className={`rounded-2xl p-4 bg-gradient-to-br ${cat.gradient}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{cat.emoji}</span>
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
          </div>
          <p className="text-white font-semibold text-sm leading-relaxed italic">"{prompt}"</p>
        </div>

        {/* Steps 1–3 */}
        {step <= 2 && current &&
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: cat.color }}>
                {current.num}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">{current.label}</p>
            </div>
            <h2 className="font-bold text-base text-[#0A1A2F] dark:text-white mb-1">{current.heading}</h2>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mb-3 leading-relaxed">{current.sub}</p>
            <textarea
            maxLength={1000}
            autoFocus
            value={current.value}
            onChange={(e) => current.set(e.target.value)}
            placeholder={current.placeholder}
            rows={5}
            className="w-full bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl px-4 py-3 text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/25 outline-none border border-transparent focus:border-[#FAD98D]/50 dark:border-[#FAD98D]/20 resize-none transition-colors leading-relaxed" />
          
          </motion.div>
        }

        {/* AI loading */}
        {step === 3 &&
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] p-8 flex flex-col items-center text-center">
            <Loader2 className="w-7 h-7 animate-spin mb-3" style={{ color: cat.color }} />
            <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Getting your coaching response…</p>
            <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40 mt-1">Personalised to what you just wrote</p>
          </motion.div>
        }

        {/* Done — show all 3 answers + AI */}
        {step === 4 &&
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Summary of 3 steps */}
            {[
          { label: 'The thought', value: thought, num: 1 },
          { label: 'The challenge', value: challenge, num: 2 },
          { label: 'The truth', value: truth, num: 3 }].
          map(({ label, value, num }) =>
          <div key={num} className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: cat.color }}>{num}</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">{label}</p>
                </div>
                <p className="text-sm text-[#0A1A2F] dark:text-white leading-relaxed">{value}</p>
              </div>
          )}

            {/* AI coach card */}
            <div className="rounded-2xl p-5 border border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5" style={{ background: `${cat.color}0f` }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" style={{ color: cat.color }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: cat.color }}>Your coaching response</p>
              </div>
              <p className="text-sm text-[#0A1A2F] dark:text-white leading-relaxed">{aiCoach}</p>
            </div>

            {/* Save */}
            {savedOk &&
          <div className="flex justify-center mb-2">
            <ShareToFeedButton
              type="growth_win"
              title="Completed a 3-step mindset reset 🧠"
              content={`Just worked through a 3-step cognitive reframe on Prosperity Revived. Taking every thought captive and replacing lies with truth. 'Be transformed by the renewing of your mind.' — Romans 12:2`}
              source="Hannah"
              label="Share to Community"
              color="#AFC7E3"
              user={user} />
            
          </div>
          }
        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 rounded-2xl text-[#0A1A2F] dark:text-white font-bold text-sm flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(135deg, #FAD98D, #c9a227)` }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save to Journal & Finish'}
            </button>
          </motion.div>
        }

        {/* Next button (steps 1–3) */}
        {step <= 2 &&
        <button
          onClick={nextStep}
          disabled={!current?.value.trim()}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] disabled:opacity-30 transition-opacity hover:opacity-90"
          style={{ background: current?.value.trim() ? `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)` : '#F2F6FA' }}>
          
            {step === 2 ?
          <><Sparkles className="w-4 h-4" />Get coaching response</> :

          <>Next step <ChevronRight className="w-4 h-4" /></>
          }
          </button>
        }
      </div>
    </motion.div>);

}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MindsetResetPage() {
  const [selectedCat, setSelectedCat] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {base44.auth.me().then(setUser).catch(() => {});}, []);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);

  const todayCount = history.filter((s) => {
    const d = new Date(s.ts);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  }).length;

  const startSession = (prompt, cat) => {
    setSelectedPrompt(prompt);
    setSelectedCat(cat);
    setActiveSession(true);
  };

  const shuffle = (cat) => {
    const p = cat.prompts[Math.floor(Math.random() * cat.prompts.length)];
    startSession(p, cat);
  };

  const handleComplete = () => {
    setActiveSession(null);
    setHistory(loadHistory());
    toast.success('Reset complete 🧠');
  };

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* Crisis Resources — required for App Store approval */}
      <div className="mx-3 sm:mx-4 mb-3 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 border border-blue-100 dark:border-blue-800/30">
        <span className="text-[10px] text-blue-600 dark:text-blue-300">If you or someone you know is in crisis:</span>
        <a href="tel:988" className="text-[10px] font-bold text-blue-700 dark:text-blue-200 underline">Call/Text 988</a>
        <span className="text-[10px] text-blue-400">|</span>
        <a href="sms:741741&body=HELLO" className="text-[10px] font-bold text-blue-700 dark:text-blue-200 underline">Text 741741</a>
      </div>

        {/* Header */}
        <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            


            
            <div className="flex-1">
              <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Mindset Reset</h1>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">
                {todayCount > 0 ? `${todayCount} reset${todayCount > 1 ? 's' : ''} today` : 'Rewire how you think'}
              </p>
            </div>
            <button onClick={() => setShowHistory((h) => !h)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            showHistory ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]' : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA]'}`
            }>
              <Clock className="w-3.5 h-3.5" />
              History
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-5 space-y-5">

          {/* History panel */}
          <AnimatePresence>
            {showHistory &&
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] divide-y divide-[#F2F6FA]">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">Recent Sessions</p>
                    <span className="text-xs text-[#0A1A2F]/35 dark:text-white/35">{history.length} total</span>
                  </div>
                  {history.length === 0 ?
                <div className="px-4 py-8 text-center">
                      <p className="text-sm text-[#0A1A2F]/30 dark:text-white/30">No sessions yet — complete your first reset below</p>
                    </div> :

                history.slice(0, 5).map((s, i) => {
                  const cat = PROMPT_CATEGORIES.find((c) => c.id === s.category);
                    if (!user) {
                      return (
                        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                        </div>
                      );
                    }

                  return (
                    <div key={i} className="px-4 py-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{cat?.emoji || '🧠'}</span>
                            <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest">{cat?.label || 'Mindset Reset'}</p>
                            <span className="ml-auto text-[10px] text-[#0A1A2F]/25 dark:text-white/25">
                              {new Date(s.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 italic mb-1">"{s.prompt}"</p>
                          <p className="text-xs text-[#0A1A2F] dark:text-white leading-relaxed line-clamp-2">{s.truth}</p>
                        </div>);

                })
                }
                </div>
              </motion.div>
            }
          </AnimatePresence>

          {/* Quick resets */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">
              60-Second Reset — Say It Out Loud
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_RESETS.map((r, i) =>
              <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-white/5 rounded-xl border border-[#F2F6FA] p-3">
                  <p className="text-lg mb-1">{r.emoji}</p>
                  <p className="text-xs font-bold text-[#0A1A2F] dark:text-white leading-snug">{r.label}</p>
                  <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 leading-tight mt-0.5">{r.sub}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Category prompts */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">
              Deep Reset — 3-Step Reframe
            </p>
            <div className="space-y-2">
              {PROMPT_CATEGORIES.map((cat, i) =>
              <motion.div key={cat.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] overflow-hidden">

                  {/* Category header */}
                  <button
                  onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#F2F6FA] dark:bg-[#0A1A2F] transition-colors">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0 text-xl`}>
                      {cat.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0A1A2F] dark:text-white dark:text-white">{cat.label}</p>
                      <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">{cat.prompts.length} prompts</p>
                    </div>
                    {/* Shuffle button */}
                    <button
                    onClick={(e) => {e.stopPropagation();shuffle(cat);}}
                    className="w-8 h-8 rounded-full border border-[#F2F6FA] flex items-center justify-center hover:border-[#FAD98D]/50 dark:border-[#FAD98D]/20 transition-colors flex-shrink-0"
                    title="Random prompt">
                      <RefreshCw className="w-3.5 h-3.5 text-[#0A1A2F]/40 dark:text-white/40" />
                    </button>
                    <ChevronDown className={`w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30 transition-transform flex-shrink-0 ${expandedCat === cat.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Prompts list */}
                  <AnimatePresence>
                    {expandedCat === cat.id &&
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-[#F2F6FA]">
                        <div className="px-4 py-2 space-y-1">
                          {cat.prompts.map((prompt, j) =>
                      <button key={j}
                      onClick={() => startSession(prompt, cat)}
                      className="w-full text-left flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-[#F2F6FA] dark:bg-[#0A1A2F] transition-colors group">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[10px] font-bold"
                        style={{ background: cat.color }}>
                                {j + 1}
                              </div>
                              <p className="text-sm text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed flex-1">{prompt}</p>
                              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 group-hover:text-[#0A1A2F]/40 dark:text-white/40 transition-colors flex-shrink-0 mt-0.5" />
                            </button>
                      )}
                        </div>
                        <div className="px-4 pb-3">
                          <button onClick={() => shuffle(cat)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed text-xs font-bold transition-colors hover:border-solid"
                      style={{ borderColor: `${cat.color}50`, color: cat.color }}>
                            <RefreshCw className="w-3 h-3" /> Random prompt from this category
                          </button>
                        </div>
                      </motion.div>
                  }
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

          {/* Link to Growth Pathways */}
          <Link to={createPageUrl('GrowthPathwaysPage')}
          className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 p-4 transition-all group">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#0A1A2F] dark:text-white dark:text-white">Confidence Pathway</p>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">5-step guided journey to rewire self-belief</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 group-hover:text-[#0A1A2F]/40 dark:text-white/40 transition-colors" />
          </Link>
        </div>
      </div>

      {/* 3-step session overlay */}
      <AnimatePresence>
        {activeSession &&
        <ReframeSession
          key={selectedPrompt}
          prompt={selectedPrompt}
          category={selectedCat}
          onComplete={handleComplete}
          user={user}
          onClose={() => setActiveSession(null)} />

        }
      </AnimatePresence>
    </>);

}