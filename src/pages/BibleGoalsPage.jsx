import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BookOpen, Heart, Sparkles, Clock, Users, ChevronRight,
  BookMarked, Compass, Info, AlertTriangle, CheckCircle, Target, Pencil, Check, X} from 'lucide-react';

// ── Label maps ─────────────────────────────────────────────────────────────────
const LEVEL_INFO = {
  new:          { label: 'New to the Bible',  emoji: '🌱', desc: 'Just starting out',  color: '#22C55E' },
  familiar:     { label: 'Know the basics',   emoji: '📖', desc: 'Know the basics',     color: '#38BDF8' },
  some:         { label: 'Know the basics',   emoji: '📖', desc: 'Know the basics',     color: '#38BDF8' },
  experienced:  { label: 'Regular reader',    emoji: '✝️', desc: 'Read often',          color: '#C9A227' },
  regular:      { label: 'Regular reader',    emoji: '✝️', desc: 'Read often',          color: '#C9A227' },
  deep_student: { label: 'Deep student',      emoji: '🏛️', desc: 'In-depth study',      color: '#FD9C2D' },
  deep:         { label: 'Deep student',      emoji: '🏛️', desc: 'In-depth study',      color: '#FD9C2D' },
};

const TRANSLATION_INFO = {
  NIV:  { name: 'New International Version',   style: 'Balanced — readable yet accurate. Great for study and devotionals.' },
  ESV:  { name: 'English Standard Version',    style: 'Formal — word-for-word translation. Ideal for deep study.' },
  NLT:  { name: 'New Living Translation',      style: 'Easy reading — thought-for-thought. Great for new readers.' },
  KJV:  { name: 'King James Version',          style: 'Classic — beautiful traditional English, rich for memorisation.' },
  NKJV: { name: 'New King James Version',      style: 'Modern KJV — traditional feel, updated language.' },
  MSG:  { name: 'The Message',                 style: 'Conversational — contemporary paraphrase. Sparks fresh insight.' },
  any:  { name: 'No preference',               style: 'Gideon will suggest the best translation for each passage.' },
};

const TOPIC_INFO = {
  prayer:        { label: 'Prayer',              emoji: '🙏' },
  identity:      { label: 'Identity in Christ',  emoji: '✨' },
  anxiety:       { label: 'Anxiety / Fear',      emoji: '🕊️' },
  purpose:       { label: 'Purpose / Calling',   emoji: '🌟' },
  relationships: { label: 'Relationships',        emoji: '💞' },
  grief:         { label: 'Grief / Loss',         emoji: '💔' },
  finances:      { label: 'Financial wisdom',     emoji: '💰' },
  family:        { label: 'Family',               emoji: '👨‍👩‍👧' },
  marriage:      { label: 'Marriage',             emoji: '💍' },
  general:       { label: 'General growth',       emoji: '📚' },
};

const DEPTH_INFO = {
  short:  { label: 'Short & encouraging', emoji: '⚡', time: '2–3 min/day',  desc: 'Quick, faith-boosting reads — great for busy mornings.' },
  medium: { label: 'Study + reflection',  emoji: '📖', time: '10–15 min/day', desc: 'A balance of scripture, commentary, and personal reflection.' },
  deep:   { label: 'Deep dive',           emoji: '🎓', time: '30+ min/day',  desc: 'Extended study with cross-references, context, and journaling prompts.' },
};

const CHURCH_INFO = {
  yes:       { label: 'Actively attending',  emoji: '⛪', desc: 'Great — community is a pillar of faith growth.' },
  sometimes: { label: 'Sometimes',           emoji: '🚶', desc: 'Even occasional attendance strengthens connection.' },
  looking:   { label: 'Looking for one',     emoji: '🔍', desc: 'Ask Gideon for help finding a church near you.' },
  no:        { label: 'Not currently',       emoji: '🏠', desc: 'No worries — your private faith journey matters just as much.' },
};

// ── Reading plan recommendations by topic ──────────────────────────────────────
const TOPIC_PLANS = {
  prayer:        [{ id: 'prayer-journey',    name: 'Prayer Journey',           duration: 14, emoji: '🙏' },
                  { id: 'psalms-30',         name: '30 Days of Psalms',         duration: 30, emoji: '📜' }],
  identity:      [{ id: 'identity-christ',   name: 'Identity in Christ',       duration: 21, emoji: '✨' },
                  { id: 'faith-foundations', name: 'Faith Foundations',         duration: 7,  emoji: '🏛️' }],
  anxiety:       [{ id: 'overcoming-anxiety',name: 'Overcoming Anxiety',       duration: 7,  emoji: '🕊️' },
                  { id: 'psalms-30',         name: '30 Days of Psalms',         duration: 30, emoji: '📜' }],
  purpose:       [{ id: 'career-guidance',   name: 'Career & Purpose',         duration: 10, emoji: '🌟' },
                  { id: 'identity-christ',   name: 'Identity in Christ',       duration: 21, emoji: '✨' }],
  relationships: [{ id: 'marriage-strength', name: 'Strengthening Marriage',   duration: 21, emoji: '💍' },
                  { id: 'family-conflict',   name: 'Healing Family Relationships', duration: 14, emoji: '👨‍👩‍👧' }],
  grief:         [{ id: 'grief-comfort',     name: 'Comfort in Grief',         duration: 14, emoji: '💔' },
                  { id: 'forgiveness-healing',name:'Path to Forgiveness',      duration: 7,  emoji: '🤍' }],
  finances:      [{ id: 'financial-peace',   name: 'Financial Peace',          duration: 14, emoji: '💰' },
                  { id: 'proverbs-wisdom',   name: 'Proverbs: Path to Wisdom', duration: 31, emoji: '🧠' }],
  family:        [{ id: 'parenting-wisdom',  name: 'Parenting with Grace',     duration: 30, emoji: '👶' },
                  { id: 'family-conflict',   name: 'Healing Family Relationships', duration: 14, emoji: '👨‍👩‍👧' }],
  marriage:      [{ id: 'marriage-strength', name: 'Strengthening Marriage',   duration: 21, emoji: '💍' },
                  { id: 'gratitude-journey', name: 'Cultivating Gratitude',    duration: 30, emoji: '🙌' }],
  general:       [{ id: 'gospel-john',       name: 'Gospel of John',           duration: 21, emoji: '✝️' },
                  { id: 'faith-foundations', name: 'Faith Foundations',         duration: 7,  emoji: '🏛️' }],
};

// Plans by experience level (for "where to start" section)
const LEVEL_PLANS = {
  new:     [{ id: 'new-believer',    name: 'New Believer Basics',   duration: 30, emoji: '🌱' },
            { id: 'gospel-john',     name: 'Gospel of John',        duration: 21, emoji: '✝️' },
            { id: 'faith-foundations',name:'Faith Foundations',     duration: 7,  emoji: '🏛️' }],
  some:    [{ id: 'gospel-john',     name: 'Gospel of John',        duration: 21, emoji: '✝️' },
            { id: 'psalms-30',       name: '30 Days of Psalms',     duration: 30, emoji: '📜' },
            { id: 'doubt-faith',     name: 'When Doubts Arise',     duration: 10, emoji: '🤔' }],
  regular: [{ id: 'proverbs-wisdom', name: 'Proverbs: Path to Wisdom', duration: 31, emoji: '🧠' },
            { id: 'spiritual-warfare',name:'Spiritual Warfare',     duration: 14, emoji: '⚔️' },
            { id: 'gratitude-journey',name:'Cultivating Gratitude', duration: 30, emoji: '🙌' }],
  deep:    [{ id: 'bible-in-year',   name: 'Bible in a Year',       duration: 365,emoji: '📖' },
            { id: 'spiritual-warfare',name:'Spiritual Warfare',     duration: 14, emoji: '⚔️' },
            { id: 'doubt-faith',     name: 'When Doubts Arise',     duration: 10, emoji: '🤔' }],
};

// Key verses per topic
const TOPIC_VERSES = {
  prayer:        { ref: 'Phil 4:6',    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.' },
  identity:      { ref: '2 Cor 5:17',  text: 'If anyone is in Christ, the new creation has come: the old has gone, the new is here!' },
  anxiety:       { ref: 'Isa 41:10',   text: 'Do not fear, for I am with you; do not be dismayed, for I am your God.' },
  purpose:       { ref: 'Jer 29:11',   text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you."' },
  relationships: { ref: '1 Cor 13:4',  text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.' },
  grief:         { ref: 'Ps 34:18',    text: 'The Lord is close to the broken-hearted and saves those who are crushed in spirit.' },
  finances:      { ref: 'Prov 3:9',    text: 'Honor the Lord with your wealth, with the firstfruits of all your crops.' },
  family:        { ref: 'Josh 24:15',  text: 'As for me and my household, we will serve the Lord.' },
  marriage:      { ref: 'Eccl 4:12',   text: 'A cord of three strands is not quickly broken.' },
  general:       { ref: 'Ps 119:105',  text: 'Your word is a lamp for my feet, a light on my path.' },
};

// Study tips by level
const LEVEL_TIPS = {
  new: [
    'Start with the Gospel of John — it tells Jesus\'s story in accessible language.',
    'Read one short passage daily rather than large chunks.',
    'Pray before you read, asking God to help you understand.',
  ],
  some: [
    'Try reading a chapter, then journaling one thing that stood out.',
    'Compare two translations side-by-side for deeper meaning.',
    'Look up cross-references to connect related passages.',
  ],
  regular: [
    'Use the S.O.A.P. method: Scripture → Observation → Application → Prayer.',
    'Study a whole book of the Bible at a time for full context.',
    'Find an accountability partner to read the same plan.',
  ],
  deep: [
    'Study original language words (Greek/Hebrew) using a concordance.',
    'Read historical and cultural commentary alongside the text.',
    'Teach what you learn — explaining deepens your own understanding.',
  ],
};

// ── Plan card ──────────────────────────────────────────────────────────────────
function PlanCard({ plan, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link to={createPageUrl('Bible')}>
        <div className="flex items-center gap-3 bg-[#F8FAFB] rounded-xl px-3.5 py-3 hover:bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 transition-colors">
          <span className="text-xl flex-shrink-0">{plan.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#0A1A2F] dark:text-white leading-tight">{plan.name}</p>
            <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 mt-0.5">{plan.duration}-day plan</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#C9A227]/60 flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

const BIBLE_LEVELS_LIST = [
  { id: 'new',          label: 'New to the Bible',  emoji: '🌱' },
  { id: 'familiar',     label: 'Know the basics',   emoji: '📖' },
  { id: 'experienced',  label: 'Regular reader',    emoji: '✝️' },
  { id: 'deep_student', label: 'Deep student',      emoji: '🏛️' },
];
const TRANSLATIONS_LIST = ['NIV','ESV','KJV','NLT','NKJV','MSG','WEB','any'];
const TOPICS_LIST = [
  { id: 'prayer', label: '🙏 Prayer' },
  { id: 'faith', label: '✝️ Faith & trust' },
  { id: 'identity', label: '🌟 Identity in Christ' },
  { id: 'anxiety', label: '🧘 Peace & anxiety' },
  { id: 'purpose', label: '🎯 Purpose & calling' },
  { id: 'relationships', label: '💞 Relationships' },
  { id: 'grief', label: '💔 Grief / Loss' },
  { id: 'finances', label: '💰 Biblical finances' },
  { id: 'family', label: '👨‍👩‍👧 Family' },
  { id: 'marriage', label: '💍 Marriage' },
];
const DEPTHS_LIST = [
  { id: 'short',  label: '⚡ Quick & focused (5 min)' },
  { id: 'medium', label: '📖 Moderate depth (10–15 min)' },
  { id: 'deep',   label: '🏛️ Deep dive (20+ min)' },
];
const CHURCH_LIST = [
  { id: 'yes',      label: '✅ Yes, actively' },
  { id: 'sometimes',label: '🚶 Sometimes' },
  { id: 'looking',  label: '🔍 Looking for one' },
  { id: 'no',       label: '🏠 Not currently' },
];

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BibleGoalsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setForm({
        bible_level: u?.bible_level || '',
        bible_translation: u?.bible_translation || 'any',
        bible_topics: u?.bible_topics || [],
        devotional_depth: u?.devotional_depth || '',
        in_church: u?.in_church || '',
      });
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe(form);
      const updated = await base44.auth.me();
      setUser(updated);
      setEditing(false);
      toast.success('Bible profile updated!');
    } catch {
      toast.error('Failed to save — please try again');
    } finally {
      setSaving(false);
    }
  };

  const toggleTopic = (id) => {
    setForm(f => ({
      ...f,
      bible_topics: f.bible_topics.includes(id)
        ? f.bible_topics.filter(t => t !== id)
        : [...f.bible_topics, id],
    }));
  };

  const level      = user?.bible_level || 'new';
  const translation= user?.bible_translation || 'any';
  const topics     = user?.bible_topics || [];
  const depth      = user?.devotional_depth || 'short';
  const church     = user?.in_church || 'no';

  // Map onboarding keys → display keys
  const levelKey   = level === 'familiar' ? 'some' : level === 'experienced' ? 'regular' : level === 'deep_student' ? 'deep' : level;
  const levelInfo  = LEVEL_INFO[level]   || LEVEL_INFO.new;
  const transInfo  = TRANSLATION_INFO[translation] || TRANSLATION_INFO.any;
  const depthInfo  = DEPTH_INFO[depth]   || DEPTH_INFO.short;
  const churchInfo = CHURCH_INFO[church] || CHURCH_INFO.no;
  const levelPlans = LEVEL_PLANS[levelKey] || LEVEL_PLANS.new;
  const levelTips  = LEVEL_TIPS[levelKey]  || LEVEL_TIPS.new;

  // Deduplicated recommended plans from selected topics
  const topicPlansSeen = new Set();
  const recommendedPlans = topics.flatMap(t => TOPIC_PLANS[t] || []).filter(p => {
    if (topicPlansSeen.has(p.id)) return false;
    topicPlansSeen.add(p.id);
    return true;
  }).slice(0, 6);

  // First selected topic's verse (or general)
  const primaryTopic = topics[0] || 'general';
  const verse = TOPIC_VERSES[primaryTopic] || TOPIC_VERSES.general;

  const profileIncomplete = !user?.bible_level;

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F2F6FA' }}>

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Bible Study Goals</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Your reading profile</p>
          </div>
          <button onClick={() => setEditing(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-[#FAD98D]/50 dark:border-[#FAD98D]/20 text-[#C9A227] bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 transition-all">
            <Pencil className="w-3.5 h-3.5" />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-3xl p-5 relative overflow-hidden shadow-lg dark:shadow-none"
            style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #1a3050 60%, #C9A227 220%)' }}>
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5" />
            <div className="absolute right-4 bottom-2 w-20 h-20 rounded-full bg-[#FAD98D]/5" />
            <div className="relative">
              <p className="text-[10px] font-bold text-white/45 uppercase tracking-widest mb-1">Your Bible Study Profile</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{levelInfo.emoji}</span>
                <div>
                  <h1 id="tour-bible-goal-title" className="text-2xl font-black text-white leading-tight">{levelInfo.label}</h1>
                  <p className="text-white/55 text-xs mt-0.5">{levelInfo.desc} · {depthInfo.emoji} {depthInfo.time}</p>
                </div>
              </div>
              {topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {topics.map(t => (
                    <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/80">
                      {TOPIC_INFO[t]?.emoji} {TOPIC_INFO[t]?.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Profile incomplete nudge ── */}
        {profileIncomplete && user && !editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}
            className="flex items-center gap-3 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 border border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 rounded-2xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#C9A227]">Bible profile incomplete</p>
              <p className="text-[11px] text-[#0A1A2F]/55 dark:text-white/55">Set up your profile to get personalised reading plans.</p>
            </div>
            <button onClick={() => setEditing(true)} className="text-[11px] font-bold text-[#C9A227] flex-shrink-0">Set Up →</button>
          </motion.div>
        )}

        {/* ── Edit Profile Form ── */}
        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none border-2 border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 space-y-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Edit Bible Profile</p>
                <button onClick={() => setEditing(false)} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-300" />
                </button>
              </div>

              {/* Bible Level */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Bible Experience</p>
                <div className="space-y-2">
                  {BIBLE_LEVELS_LIST.map(o => (
                    <button key={o.id} onClick={() => setForm(f => ({ ...f, bible_level: o.id }))}
                      className={`w-full text-left px-4 py-2.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${form.bible_level === o.id ? 'border-[#C9A227] bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5' : 'border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 dark:bg-white/5'}`}>
                      <span>{o.emoji}</span>
                      <span className="text-sm font-semibold text-[#0A1A2F] dark:text-white dark:text-white">{o.label}</span>
                      {form.bible_level === o.id && <Check className="w-4 h-4 text-[#C9A227] ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Preferred Translation</p>
                <div className="flex flex-wrap gap-2">
                  {TRANSLATIONS_LIST.map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, bible_translation: t }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${form.bible_translation === t ? 'border-[#C9A227] bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 text-[#C9A227]' : 'border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 dark:bg-white/5'}`}>
                      {t === 'any' ? 'No preference' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Topics of Interest</p>
                <div className="flex flex-wrap gap-2">
                  {TOPICS_LIST.map(o => (
                    <button key={o.id} onClick={() => toggleTopic(o.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${form.bible_topics.includes(o.id) ? 'border-[#C9A227] bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 text-[#C9A227]' : 'border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 dark:bg-white/5'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Devotional Depth */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Devotional Depth</p>
                <div className="space-y-2">
                  {DEPTHS_LIST.map(o => (
                    <button key={o.id} onClick={() => setForm(f => ({ ...f, devotional_depth: o.id }))}
                      className={`w-full text-left px-4 py-2.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${form.devotional_depth === o.id ? 'border-[#C9A227] bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5' : 'border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 dark:bg-white/5'}`}>
                      <span className="text-sm font-semibold text-[#0A1A2F] dark:text-white flex-1">{o.label}</span>
                      {form.devotional_depth === o.id && <Check className="w-4 h-4 text-[#C9A227]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Church */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Church Community</p>
                <div className="flex flex-wrap gap-2">
                  {CHURCH_LIST.map(o => (
                    <button key={o.id} onClick={() => setForm(f => ({ ...f, in_church: o.id }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${form.in_church === o.id ? 'border-[#C9A227] bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 text-[#C9A227]' : 'border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 dark:bg-white/5'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #C9A227, #FD9C2D)' }}>
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Translation ── */}
        <motion.div id="tour-bible-translation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8">
                <BookOpen className="w-4 h-4 text-[#C9A227]" />
              </div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Preferred Translation</p>
            </div>
            <button onClick={() => setShowTranslationInfo(v => !v)}
              className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-[#0A1A2F]/40 dark:text-white/40" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-2xl px-4 py-3 text-center flex-shrink-0 min-w-[64px]">
              <p className="text-2xl font-black text-[#C9A227]">{translation === 'any' ? '✦' : translation}</p>
            </div>
            <div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">{transInfo.name}</p>
              <AnimatePresence>
                {showTranslationInfo && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="text-[11px] text-[#0A1A2F]/50 dark:text-white/50 mt-1 leading-relaxed overflow-hidden">
                    {transInfo.style}
                  </motion.p>
                )}
              </AnimatePresence>
              {!showTranslationInfo && (
                <p className="text-[11px] text-[#0A1A2F]/40 dark:text-white/40 mt-0.5 line-clamp-1">{transInfo.style}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Topics of interest ── */}
        {topics.length > 0 && (
          <motion.div id="tour-bible-topics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8">
                <Heart className="w-4 h-4 text-[#C9A227]" />
              </div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Topics That Matter to You</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {topics.map((t, i) => {
                const info = TOPIC_INFO[t];
                if (!info) return null;
                return (
                  <motion.div key={t} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 + i * 0.04 }}
                    className="flex items-center gap-2.5 bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 rounded-xl px-3 py-2.5">
                    <span className="text-base">{info.emoji}</span>
                    <span className="text-xs font-bold text-[#0A1A2F] dark:text-white dark:text-white">{info.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Key verse for primary topic ── */}
        <motion.div id="tour-bible-key-verse" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: 'linear-gradient(135deg,#0A1A2F,#1a3050)' }}>
          <BookOpen className="w-5 h-5 text-[#FAD98D] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-[#FAD98D]/60 uppercase tracking-widest mb-1">
              A verse for your journey · {TOPIC_INFO[primaryTopic]?.label || 'Faith'}
            </p>
            <p className="text-white text-sm font-semibold leading-relaxed italic">"{verse.text}"</p>
            <p className="text-[#FAD98D] text-[10px] font-bold mt-1.5">{verse.ref}</p>
          </div>
        </motion.div>

        {/* ── Devotional depth ── */}
        <motion.div id="tour-devotional-depth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8">
              <Clock className="w-4 h-4 text-[#C9A227]" />
            </div>
            <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Devotional Depth</p>
          </div>
          <div className="flex items-center gap-4 bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 rounded-2xl px-4 py-3">
            <span className="text-3xl">{depthInfo.emoji}</span>
            <div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">{depthInfo.label}</p>
              <p className="text-[#C9A227] text-xs font-semibold mt-0.5">{depthInfo.time}</p>
              <p className="text-[11px] text-[#0A1A2F]/50 dark:text-white/50 mt-1 leading-snug">{depthInfo.desc}</p>
            </div>
          </div>
          <p className="text-[11px] text-[#0A1A2F]/35 dark:text-white/35 mt-3">
            Gideon tailors devotional responses and scripture explanations to this depth level.
          </p>
        </motion.div>

        {/* ── Reading plans recommended by topics ── */}
        {recommendedPlans.length > 0 && (
          <motion.div id="tour-topic-plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8">
                <BookMarked className="w-4 h-4 text-[#C9A227]" />
              </div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Plans for Your Topics</p>
            </div>
            <div className="space-y-2">
              {recommendedPlans.map((p, i) => <PlanCard key={p.id} plan={p} delay={0.24 + i * 0.04} />)}
            </div>
          </motion.div>
        )}

        {/* ── Where to start based on experience ── */}
        <motion.div id="tour-level-plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${levelInfo.color}20` }}>
              <Compass className="w-4 h-4" style={{ color: levelInfo.color }} />
            </div>
            <div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Where to Start</p>
              <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">Matched to your {levelInfo.label} level</p>
            </div>
          </div>
          <div className="space-y-2">
            {levelPlans.map((p, i) => <PlanCard key={p.id} plan={p} delay={0.30 + i * 0.04} />)}
          </div>
        </motion.div>

        {/* ── Study tips ── */}
        <motion.div id="tour-bible-tips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8">
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
            </div>
            <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Study Tips for You</p>
            <span className="ml-auto text-[10px] text-[#0A1A2F]/35 dark:text-white/35 font-semibold">{levelInfo.label}</span>
          </div>
          <div className="space-y-2.5">
            {levelTips.map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 + i * 0.05 }}
                className="flex items-start gap-3 bg-[#FAD98D]/08 rounded-xl px-3.5 py-2.5">
                <CheckCircle className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Church community ── */}
        <motion.div id="tour-church-community" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
          className="bg-white dark:bg-white/5 rounded-3xl px-5 py-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8">
              <Users className="w-4 h-4 text-[#C9A227]" />
            </div>
            <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Church Community</p>
          </div>
          <div className="flex items-center gap-4 bg-[#F8FAFB] rounded-2xl px-4 py-3">
            <span className="text-2xl">{churchInfo.emoji}</span>
            <div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">{churchInfo.label}</p>
              <p className="text-[11px] text-[#0A1A2F]/45 dark:text-white/45 mt-0.5">{churchInfo.desc}</p>
            </div>
          </div>
          {church === 'looking' && (
            <p className="text-[11px] text-[#C9A227] mt-2 font-semibold">
              Ask Gideon: "Help me find a church near me" →
            </p>
          )}
        </motion.div>

        {/* ── Gideon CTA ── */}
        <motion.div id="tour-gideon-goals-cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.40 }}
          className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
          style={{ background: 'linear-gradient(135deg, #0A1A2F, #1a3050)' }}
          onClick={() => navigate(createPageUrl('ChatScreen?bot=Gideon'))}>
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">📖</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Ask Gideon</p>
            <p className="text-xs text-white/60">Study {translation === 'any' ? 'scripture' : `the ${translation}`} · {depthInfo.label.toLowerCase()} depth</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </motion.div>

        {/* ── Quick links ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
          <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-2.5">Related Tools</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '📖', label: 'Bible Reader',      page: 'Bible'                      },
              { icon: '🙏', label: 'Devotionals',       page: 'Bible'                      },
              { icon: '🌱', label: 'Reading Plans',     page: 'Bible'                      },
              { icon: '💬', label: 'Chat w/ Gideon',   page: 'ChatScreen?bot=Gideon'      },
            ].map(({ icon, label, page }) => (
              <Link key={label} to={createPageUrl(page)}
                className="flex items-center gap-2.5 bg-white dark:bg-white/5 rounded-2xl p-3.5 shadow-sm dark:shadow-none border border-gray-50 dark:border-white/5 active:scale-97 transition-all">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-bold text-[#0A1A2F] dark:text-white leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}