import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Heart, Sparkles, Clock, Users, ChevronRight,
  BookMarked, Compass, Info, AlertTriangle, CheckCircle, Target } from 'lucide-react';

const LEVEL_INFO = {
  new:     { label: 'New to the Bible',  emoji: '🌱', desc: 'Just starting out',  color: '#22C55E' },
  some:    { label: 'Some familiarity',  emoji: '📖', desc: 'Know the basics',     color: '#38BDF8' },
  regular: { label: 'Regular reader',    emoji: '✝️', desc: 'Read often',          color: '#C9A227' },
  deep:    { label: 'Deep student',      emoji: '🎓', desc: 'In-depth study',      color: '#FD9C2D' },
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
const TOPIC_PLANS = {
  prayer:        [{ id: 'prayer-journey',    name: 'Prayer Journey',           duration: 14, emoji: '🙏' }, { id: 'psalms-30', name: '30 Days of Psalms', duration: 30, emoji: '📜' }],
  identity:      [{ id: 'identity-christ',   name: 'Identity in Christ',       duration: 21, emoji: '✨' }, { id: 'faith-foundations', name: 'Faith Foundations', duration: 7, emoji: '🏛️' }],
  anxiety:       [{ id: 'overcoming-anxiety',name: 'Overcoming Anxiety',       duration: 7,  emoji: '🕊️' }, { id: 'psalms-30', name: '30 Days of Psalms', duration: 30, emoji: '📜' }],
  purpose:       [{ id: 'career-guidance',   name: 'Career & Purpose',         duration: 10, emoji: '🌟' }, { id: 'identity-christ', name: 'Identity in Christ', duration: 21, emoji: '✨' }],
  relationships: [{ id: 'marriage-strength', name: 'Strengthening Marriage',   duration: 21, emoji: '💍' }, { id: 'family-conflict', name: 'Healing Family Relationships', duration: 14, emoji: '👨‍👩‍👧' }],
  grief:         [{ id: 'grief-comfort',     name: 'Comfort in Grief',         duration: 14, emoji: '💔' }, { id: 'forgiveness-healing', name: 'Path to Forgiveness', duration: 7, emoji: '🤍' }],
  finances:      [{ id: 'financial-peace',   name: 'Financial Peace',          duration: 14, emoji: '💰' }, { id: 'proverbs-wisdom', name: 'Proverbs: Path to Wisdom', duration: 31, emoji: '🧠' }],
  family:        [{ id: 'parenting-wisdom',  name: 'Parenting with Grace',     duration: 30, emoji: '👶' }, { id: 'family-conflict', name: 'Healing Family Relationships', duration: 14, emoji: '👨‍👩‍👧' }],
  marriage:      [{ id: 'marriage-strength', name: 'Strengthening Marriage',   duration: 21, emoji: '💍' }, { id: 'gratitude-journey', name: 'Cultivating Gratitude', duration: 30, emoji: '🙌' }],
  general:       [{ id: 'gospel-john',       name: 'Gospel of John',           duration: 21, emoji: '✝️' }, { id: 'faith-foundations', name: 'Faith Foundations', duration: 7, emoji: '🏛️' }],
};
const LEVEL_PLANS = {
  new:     [{ id: 'new-believer', name: 'New Believer Basics', duration: 30, emoji: '🌱' }, { id: 'gospel-john', name: 'Gospel of John', duration: 21, emoji: '✝️' }, { id: 'faith-foundations', name: 'Faith Foundations', duration: 7, emoji: '🏛️' }],
  some:    [{ id: 'gospel-john', name: 'Gospel of John', duration: 21, emoji: '✝️' }, { id: 'psalms-30', name: '30 Days of Psalms', duration: 30, emoji: '📜' }, { id: 'doubt-faith', name: 'When Doubts Arise', duration: 10, emoji: '🤔' }],
  regular: [{ id: 'proverbs-wisdom', name: 'Proverbs: Path to Wisdom', duration: 31, emoji: '🧠' }, { id: 'spiritual-warfare', name: 'Spiritual Warfare', duration: 14, emoji: '⚔️' }, { id: 'gratitude-journey', name: 'Cultivating Gratitude', duration: 30, emoji: '🙌' }],
  deep:    [{ id: 'bible-in-year', name: 'Bible in a Year', duration: 365, emoji: '📖' }, { id: 'spiritual-warfare', name: 'Spiritual Warfare', duration: 14, emoji: '⚔️' }, { id: 'doubt-faith', name: 'When Doubts Arise', duration: 10, emoji: '🤔' }],
};
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
const LEVEL_TIPS = {
  new: ['Start with the Gospel of John — it tells Jesus\'s story in accessible language.', 'Read one short passage daily rather than large chunks.', 'Pray before you read, asking God to help you understand.'],
  some: ['Try reading a chapter, then journaling one thing that stood out.', 'Compare two translations side-by-side for deeper meaning.', 'Look up cross-references to connect related passages.'],
  regular: ['Use the S.O.A.P. method: Scripture → Observation → Application → Prayer.', 'Study a whole book of the Bible at a time for full context.', 'Find an accountability partner to read the same plan.'],
  deep: ['Study original language words (Greek/Hebrew) using a concordance.', 'Read historical and cultural commentary alongside the text.', 'Teach what you learn — explaining deepens your own understanding.'],
};

function PlanCard({ plan, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link to={createPageUrl(`PlanDetail?id=${plan.id}`)}>
        <div className="flex items-center gap-3 bg-[#F8FAFB] rounded-xl px-3.5 py-3 hover:bg-[#FAD98D]/10 transition-colors">
          <span className="text-xl flex-shrink-0">{plan.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#0A1A2F] leading-tight">{plan.name}</p>
            <p className="text-[10px] text-[#0A1A2F]/40 mt-0.5">{plan.duration}-day plan</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#C9A227]/60 flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function BibleGoalsEmbed() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const level      = user?.bible_level || 'new';
  const translation= user?.bible_translation || 'any';
  const topics     = user?.bible_topics || [];
  const depth      = user?.devotional_depth || 'short';
  const church     = user?.in_church || 'no';

  const levelInfo  = LEVEL_INFO[level]  || LEVEL_INFO.new;
  const transInfo  = TRANSLATION_INFO[translation] || TRANSLATION_INFO.any;
  const depthInfo  = DEPTH_INFO[depth]  || DEPTH_INFO.short;
  const churchInfo = CHURCH_INFO[church] || CHURCH_INFO.no;
  const levelPlans = LEVEL_PLANS[level] || LEVEL_PLANS.new;
  const levelTips  = LEVEL_TIPS[level]  || LEVEL_TIPS.new;

  const topicPlansSeen = new Set();
  const recommendedPlans = topics.flatMap(t => TOPIC_PLANS[t] || []).filter(p => {
    if (topicPlansSeen.has(p.id)) return false;
    topicPlansSeen.add(p.id);
    return true;
  }).slice(0, 6);

  const primaryTopic = topics[0] || 'general';
  const verse = TOPIC_VERSES[primaryTopic] || TOPIC_VERSES.general;
  const profileIncomplete = !user?.bible_level;

  return (
    <div className="space-y-4">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-3xl p-5 relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #1a3050 60%, #C9A227 220%)' }}>
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-[10px] font-bold text-white/45 uppercase tracking-widest mb-1">Your Bible Study Profile</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{levelInfo.emoji}</span>
              <div>
                <h2 className="text-xl font-black text-white leading-tight">{levelInfo.label}</h2>
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

      {/* Profile incomplete nudge */}
      {profileIncomplete && user && (
        <div className="flex items-center gap-3 bg-[#FAD98D]/20 border border-[#FAD98D]/30 rounded-2xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-[#C9A227]">Bible profile incomplete</p>
            <p className="text-[11px] text-[#0A1A2F]/55">Complete onboarding to get personalised reading plans.</p>
          </div>
          <Link to={createPageUrl('BibleGoalsPage')} className="text-[11px] font-bold text-[#C9A227] flex-shrink-0">Complete Setup →</Link>
        </div>
      )}

      {/* Translation */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20">
              <BookOpen className="w-4 h-4 text-[#C9A227]" />
            </div>
            <p className="font-bold text-[#0A1A2F] text-sm">Preferred Translation</p>
          </div>
          <button onClick={() => setShowTranslationInfo(v => !v)}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <Info className="w-3.5 h-3.5 text-[#0A1A2F]/40" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#FAD98D]/20 rounded-2xl px-4 py-3 text-center flex-shrink-0 min-w-[64px]">
            <p className="text-2xl font-black text-[#C9A227]">{translation === 'any' ? '✦' : translation}</p>
          </div>
          <div>
            <p className="font-bold text-[#0A1A2F] text-sm">{transInfo.name}</p>
            <AnimatePresence>
              {showTranslationInfo && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="text-[11px] text-[#0A1A2F]/50 mt-1 leading-relaxed overflow-hidden">
                  {transInfo.style}
                </motion.p>
              )}
            </AnimatePresence>
            {!showTranslationInfo && (
              <p className="text-[11px] text-[#0A1A2F]/40 mt-0.5 line-clamp-1">{transInfo.style}</p>
            )}
          </div>
        </div>
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20">
              <Heart className="w-4 h-4 text-[#C9A227]" />
            </div>
            <p className="font-bold text-[#0A1A2F] text-sm">Topics That Matter to You</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((t) => {
              const info = TOPIC_INFO[t];
              if (!info) return null;
              return (
                <div key={t} className="flex items-center gap-2.5 bg-[#FAD98D]/10 border border-[#FAD98D]/25 rounded-xl px-3 py-2.5">
                  <span className="text-base">{info.emoji}</span>
                  <span className="text-xs font-bold text-[#0A1A2F]">{info.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key verse */}
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'linear-gradient(135deg,#0A1A2F,#1a3050)' }}>
        <BookOpen className="w-5 h-5 text-[#FAD98D] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-[#FAD98D]/60 uppercase tracking-widest mb-1">
            A verse for your journey · {TOPIC_INFO[primaryTopic]?.label || 'Faith'}
          </p>
          <p className="text-white text-sm font-semibold leading-relaxed italic">"{verse.text}"</p>
          <p className="text-[#FAD98D] text-[10px] font-bold mt-1.5">{verse.ref}</p>
        </div>
      </div>

      {/* Devotional depth */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20">
            <Clock className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="font-bold text-[#0A1A2F] text-sm">Devotional Depth</p>
        </div>
        <div className="flex items-center gap-4 bg-[#FAD98D]/10 rounded-2xl px-4 py-3">
          <span className="text-3xl">{depthInfo.emoji}</span>
          <div>
            <p className="font-bold text-[#0A1A2F] text-sm">{depthInfo.label}</p>
            <p className="text-[#C9A227] text-xs font-semibold mt-0.5">{depthInfo.time}</p>
            <p className="text-[11px] text-[#0A1A2F]/50 mt-1 leading-snug">{depthInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Plans by topic */}
      {recommendedPlans.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20">
              <BookMarked className="w-4 h-4 text-[#C9A227]" />
            </div>
            <p className="font-bold text-[#0A1A2F] text-sm">Plans for Your Topics</p>
          </div>
          <div className="space-y-2">
            {recommendedPlans.map((p, i) => <PlanCard key={p.id} plan={p} delay={0.04 + i * 0.04} />)}
          </div>
        </div>
      )}

      {/* Where to start */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${levelInfo.color}20` }}>
            <Compass className="w-4 h-4" style={{ color: levelInfo.color }} />
          </div>
          <div>
            <p className="font-bold text-[#0A1A2F] text-sm">Where to Start</p>
            <p className="text-[10px] text-[#0A1A2F]/40">Matched to your {levelInfo.label} level</p>
          </div>
        </div>
        <div className="space-y-2">
          {levelPlans.map((p, i) => <PlanCard key={p.id} plan={p} delay={0.04 + i * 0.04} />)}
        </div>
      </div>

      {/* Study tips */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="font-bold text-[#0A1A2F] text-sm">Study Tips for You</p>
          <span className="ml-auto text-[10px] text-[#0A1A2F]/35 font-semibold">{levelInfo.label}</span>
        </div>
        <div className="space-y-2.5">
          {levelTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-[#FAD98D]/08 rounded-xl px-3.5 py-2.5">
              <CheckCircle className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#0A1A2F]/70 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Church */}
      <div className="bg-white rounded-3xl px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FAD98D]/20">
            <Users className="w-4 h-4 text-[#C9A227]" />
          </div>
          <p className="font-bold text-[#0A1A2F] text-sm">Church Community</p>
        </div>
        <div className="flex items-center gap-4 bg-[#F8FAFB] rounded-2xl px-4 py-3">
          <span className="text-2xl">{churchInfo.emoji}</span>
          <div>
            <p className="font-bold text-[#0A1A2F] text-sm">{churchInfo.label}</p>
            <p className="text-[11px] text-[#0A1A2F]/45 mt-0.5">{churchInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Gideon CTA */}
      <div className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
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
      </div>

      {/* Update profile link */}
      <div className="text-center pb-4">
        <Link to={createPageUrl('Settings')} className="text-xs text-[#C9A227] font-semibold">
          Update my Chat Settings →
        </Link>
      </div>

    </div>
  );
}