import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, ArrowLeft, Star, ChevronRight, ChevronLeft,
  BookOpen, X, Check, Mic
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

// ─── 28 Identity Declarations across 5 pillars ───────────────────────────────
const DECLARATIONS = [
  // ── BELOVED ──────────────────────────────────────────────────────────────
  {
    id: 'child-of-god',
    truth: 'I am a child of God',
    pillar: 'Beloved',
    verse: 'John 1:12',
    fullVerse: 'Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God.',
    explanation: "You are not an orphan navigating life alone. God didn't just tolerate your existence — He gave you the legal right to be called His child. That is your permanent address in the universe.",
  },
  {
    id: 'chosen-loved',
    truth: 'I am chosen and dearly loved',
    pillar: 'Beloved',
    verse: 'Colossians 3:12',
    fullVerse: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
    explanation: "God didn't choose you reluctantly or as a last resort. He handpicked you with deliberate intention before the world was made. You are not chosen despite your flaws — you are chosen, full stop.",
  },
  {
    id: 'lavished-love',
    truth: 'I am lavishly loved by the Father',
    pillar: 'Beloved',
    verse: '1 John 3:1',
    fullVerse: 'See how great a love the Father has given to us, that we should be called children of God! And that is what we are!',
    explanation: "John uses the word 'lavished' — extravagant, over-the-top, wasteful by human standards. God's love for you is not measured or earned. It is poured out without restraint.",
  },
  {
    id: 'known-fully',
    truth: 'I am fully known and still fully loved',
    pillar: 'Beloved',
    verse: 'Psalm 139:1–3',
    fullVerse: 'You have searched me, Lord, and you know me. You know when I sit and when I rise; you perceive my thoughts from afar.',
    explanation: "God has seen everything — every failure, every secret, every darkest thought — and He has not moved. You cannot lose His love by being fully seen. He already knows and He already chose you.",
  },
  {
    id: 'wonderfully-made',
    truth: 'I am fearfully and wonderfully made',
    pillar: 'Beloved',
    verse: 'Psalm 139:14',
    fullVerse: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',
    explanation: "The word 'fearfully' means with reverence and awe — as if God stepped back from His work and marveled. That is how you were made. Not hastily. Not accidentally. With wonder.",
  },
  {
    id: 'engraved-hands',
    truth: 'I am engraved on the palms of His hands',
    pillar: 'Beloved',
    verse: 'Isaiah 49:16',
    fullVerse: 'See, I have engraved you on the palms of my hands; your walls are ever before me.',
    explanation: "Engravings are permanent. God doesn't have you on a sticky note that might fall off. Your name is carved into Him — a permanent part of who He is toward you.",
  },
  // ── REDEEMED ─────────────────────────────────────────────────────────────
  {
    id: 'new-creation',
    truth: 'I am a new creation',
    pillar: 'Redeemed',
    verse: '2 Corinthians 5:17',
    fullVerse: 'Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.',
    explanation: "This is not renovation — it's recreation. God didn't patch up the old version of you and call it good. He made you new. Your past does not have a vote on your present identity.",
  },
  {
    id: 'forgiven',
    truth: 'I am completely forgiven',
    pillar: 'Redeemed',
    verse: 'Colossians 1:14',
    fullVerse: 'In whom we have our redemption, the forgiveness of our sins.',
    explanation: "Forgiven means the debt is gone — not deferred, not on a payment plan, not held over you. The record has been cleared. You don't have to keep paying for what has already been paid.",
  },
  {
    id: 'redeemed',
    truth: 'I am redeemed and set free',
    pillar: 'Redeemed',
    verse: 'Galatians 5:1',
    fullVerse: 'It is for freedom that Christ has set us free. Stand firm, then, and do not let yourselves be burdened again by a yoke of slavery.',
    explanation: "Redemption means to buy back what was lost. Christ paid the price to get you back — not so you'd live cautiously, but so you'd live free. The chains are gone. Stop picking them back up.",
  },
  {
    id: 'not-condemned',
    truth: 'I am free from condemnation',
    pillar: 'Redeemed',
    verse: 'Romans 8:1',
    fullVerse: 'There is therefore now no condemnation to those who are in Christ Jesus.',
    explanation: "Condemnation is the voice that says you are what you've done. Paul says that voice has no legal standing. 'No condemnation' is not qualified. It doesn't say 'usually' or 'mostly.' It says none.",
  },
  {
    id: 'seated-with-christ',
    truth: 'I am seated with Christ in heavenly places',
    pillar: 'Redeemed',
    verse: 'Ephesians 2:6',
    fullVerse: 'And God raised us up with Christ and seated us with him in the heavenly realms in Christ Jesus.',
    explanation: "You are not beneath your circumstances — you are above them. Positionally, you have already been raised and seated in victory. The battle you're facing has already been won from that vantage point.",
  },
  {
    id: 'citizenship',
    truth: 'My citizenship is in heaven',
    pillar: 'Redeemed',
    verse: 'Philippians 3:20',
    fullVerse: 'But our citizenship is in heaven. And we eagerly await a Savior from there, the Lord Jesus Christ.',
    explanation: "This world is not your home — it's your assignment. You carry a different passport. That means earthly rejection, failure, and loss don't have final authority over who you are.",
  },
  // ── EQUIPPED ─────────────────────────────────────────────────────────────
  {
    id: 'more-than-conqueror',
    truth: 'I am more than a conqueror',
    pillar: 'Equipped',
    verse: 'Romans 8:37',
    fullVerse: 'No, in all these things we are more than conquerors through him who loved us.',
    explanation: "More than a conqueror means you don't just win — you win decisively, and the victory costs you less than it would cost the enemy. Through Christ, you don't just get through hard things — you become stronger for them.",
  },
  {
    id: 'no-fear',
    truth: 'I have a spirit of power, love, and a sound mind',
    pillar: 'Equipped',
    verse: '2 Timothy 1:7',
    fullVerse: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
    explanation: "Fear is not your inheritance. God didn't give you anxiety as a default setting. He gave you power to act, love to connect deeply, and a sound mind to think clearly — even when circumstances say otherwise.",
  },
  {
    id: 'strength-in-christ',
    truth: 'I can do all things through Christ',
    pillar: 'Equipped',
    verse: 'Philippians 4:13',
    fullVerse: 'I can do all things through Christ, who strengthens me.',
    explanation: "Paul wrote this from prison — not from a victory lap. Confidence in Christ doesn't depend on your circumstances. The strength is available in the valley, not just on the mountaintop.",
  },
  {
    id: 'grace-sufficient',
    truth: `God's grace is sufficient for me`,
    pillar: 'Equipped',
    verse: '2 Corinthians 12:9',
    fullVerse: 'My grace is sufficient for you, for my power is made perfect in weakness.',
    explanation: "Your weakness is not disqualifying — it's the very place God shows up most clearly. Where you run out, He begins. Sufficient means exactly enough. Not barely enough. Exactly enough.",
  },
  {
    id: 'wisdom',
    truth: `I have access to God's wisdom`,
    pillar: 'Equipped',
    verse: 'James 1:5',
    fullVerse: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.',
    explanation: "You are not on your own when it comes to decisions, discernment, or understanding. God gives wisdom generously — the word means 'lavishly, without reproach.' Ask without shame.",
  },
  {
    id: 'rooted',
    truth: 'I am rooted and built up in Christ',
    pillar: 'Equipped',
    verse: 'Colossians 2:7',
    fullVerse: 'Rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.',
    explanation: "A rooted tree doesn't topple in a storm — the wind that would uproot a shallow tree only drives the roots deeper. When you are grounded in Christ, the pressures of life deepen rather than destroy you.",
  },
  // ── CALLED ───────────────────────────────────────────────────────────────
  {
    id: 'light-of-world',
    truth: 'I am the light of the world',
    pillar: 'Called',
    verse: 'Matthew 5:14',
    fullVerse: 'You are the light of the world. A town built on a hill cannot be hidden.',
    explanation: "Light doesn't try to shine — it just is what it is. You are not supposed to perform or manufacture influence. Your presence, your character, your faithfulness — these carry light naturally into every space you enter.",
  },
  {
    id: 'salt-earth',
    truth: 'I am the salt of the earth',
    pillar: 'Called',
    verse: 'Matthew 5:13',
    fullVerse: 'You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again?',
    explanation: "Salt preserves and flavors. You have been placed where you are to prevent decay and add meaning. Your presence in your workplace, family, and community is not accidental — it is strategic.",
  },
  {
    id: 'handiwork',
    truth: `I am God's handiwork, created for good works`,
    pillar: 'Called',
    verse: 'Ephesians 2:10',
    fullVerse: `For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.`,
    explanation: "The Greek word for handiwork is poiema — the root of 'poem.' You are God's masterwork, not a mass-produced item. And the good works He prepared for you are specific to you — not generic volunteer work, but your particular assignment.",
  },
  {
    id: 'royal-priesthood',
    truth: 'I am part of a royal priesthood',
    pillar: 'Called',
    verse: '1 Peter 2:9',
    fullVerse: "But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light.",
    explanation: "Royalty speaks to authority. Priesthood speaks to access. You have both. You are not a commoner hoping for an audience with God — you are a member of His household with full access and delegated authority.",
  },
  {
    id: 'ambassador',
    truth: 'I am an ambassador for Christ',
    pillar: 'Called',
    verse: '2 Corinthians 5:20',
    fullVerse: `We are therefore Christ's ambassadors, as though God were making his appeal through us.`,
    explanation: "An ambassador carries the full weight of the nation they represent. When you speak, when you love, when you serve — God is making an appeal through you. You represent the Kingdom in every room you enter.",
  },
  // ── PROTECTED ────────────────────────────────────────────────────────────
  {
    id: 'upheld',
    truth: "I am upheld by God's right hand",
    pillar: 'Protected',
    verse: 'Isaiah 41:10',
    fullVerse: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    explanation: "Uphold means to support from beneath so you do not fall. God is not watching you from a distance hoping you make it — He is actively holding you up. You cannot fall beyond His reach.",
  },
  {
    id: 'peace-guards',
    truth: 'The peace of God guards my heart',
    pillar: 'Protected',
    verse: 'Philippians 4:7',
    fullVerse: 'And the peace of God, which transcends all understanding, will guard your heart and your mind in Christ Jesus.',
    explanation: "The peace of God doesn't wait for your circumstances to improve before it shows up. It transcends understanding — meaning it operates outside of logic. It guards your heart even when your mind can't figure out why it should be okay.",
  },
  {
    id: 'nothing-separate',
    truth: "Nothing can separate me from God's love",
    pillar: 'Protected',
    verse: 'Romans 8:38–39',
    fullVerse: 'For I am convinced that neither death nor life, neither angels nor demons... will be able to separate us from the love of God that is in Christ Jesus our Lord.',
    explanation: "Paul lists every conceivable category — supernatural, natural, past, future, height, depth — and says none of it is enough to cut you off. The love of God is not a fragile thread. It is an unbreakable bond.",
  },
  {
    id: 'shepherd',
    truth: 'The Lord is my shepherd — I lack nothing',
    pillar: 'Protected',
    verse: 'Psalm 23:1',
    fullVerse: 'The Lord is my shepherd, I lack nothing.',
    explanation: "A shepherd doesn't just occasionally check on the flock — they give their life for it. When the Lord is your shepherd, the promise isn't comfort everywhere. It's provision and presence everywhere, including the darkest valleys.",
  },
  {
    id: 'needs-met',
    truth: 'God will meet all my needs',
    pillar: 'Protected',
    verse: 'Philippians 4:19',
    fullVerse: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
    explanation: "Not some of your needs. All of them. And the source isn't your paycheck or your connections — it's 'the riches of his glory.' That is an inexhaustible account. You can make requests without fear of running out.",
  },
];

const PILLARS = [
  { id: 'all',       label: 'All',        emoji: '✦',  gradient: 'from-[#0A1A2F] to-[#0A1A2F]',     color: '#FAD98D' },
  { id: 'Beloved',   label: 'Beloved',    emoji: '💛',  gradient: 'from-rose-500 to-pink-400',        color: '#f43f5e' },
  { id: 'Redeemed',  label: 'Redeemed',   emoji: '✝️', gradient: 'from-[#c9a227] to-amber-400',      color: '#c9a227' },
  { id: 'Equipped',  label: 'Equipped',   emoji: '⚡',  gradient: 'from-violet-600 to-purple-400',    color: '#8B5CF6' },
  { id: 'Called',    label: 'Called',     emoji: '🌟',  gradient: 'from-orange-500 to-amber-400',     color: '#f97316' },
  { id: 'Protected', label: 'Protected',  emoji: '🛡️', gradient: 'from-sky-600 to-blue-400',         color: '#0ea5e9' },
];

const PILLAR_MAP = Object.fromEntries(PILLARS.slice(1).map(p => [p.id, p]));

const FAVS_KEY    = 'identity_favs_v1';
const MEMORIZED_KEY = 'identity_memorized_v1';

const loadFavs       = () => { try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); } catch { return []; } };
const loadMemorized  = () => { try { return JSON.parse(localStorage.getItem(MEMORIZED_KEY) || '[]'); } catch { return []; } };

function getTodaysDeclaration() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DECLARATIONS[dayOfYear % DECLARATIONS.length];
}

// ─── Declaration Mode (full-screen speak-aloud practice) ─────────────────────
function DeclarationMode({ declarations, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [spoken, setSpoken] = useState(new Set());
  const [confirmed, setConfirmed] = useState(false);
  const decl = declarations[idx];
  const pillar = PILLAR_MAP[decl.pillar];
  const isFirst = idx === 0;
  const isLast = idx === declarations.length - 1;

  const markSpoken = () => {
    setSpoken(s => new Set([...s, decl.id]));
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 1200);
  };

  const goNext = () => { if (!isLast) { setIdx(i => i + 1); } };
  const goPrev = () => { if (!isFirst) setIdx(i => i - 1); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0A1A2F 0%, #0f2440 50%, #0A1A2F 100%)' }}
    >
      {/* Subtle radial glow behind declaration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${pillar?.color || '#FAD98D'} 0%, transparent 70%)` }} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4 flex-shrink-0">
        <button onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Declaration Mode</p>
          <p className="text-white/70 text-xs mt-0.5">{idx + 1} of {declarations.length}</p>
        </div>
        <div className="flex gap-1">
          {declarations.slice(0, Math.min(declarations.length, 7)).map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${
              i === idx ? 'w-5 h-1.5' : 'w-1.5 h-1.5'
            }`}
              style={{ background: i <= idx ? (pillar?.color || '#FAD98D') : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Pillar badge */}
        <motion.div
          key={decl.id + '-badge'}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 mb-6"
        >
          <span className="text-sm">{pillar?.emoji}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: pillar?.color || '#FAD98D' }}>
            {decl.pillar}
          </span>
        </motion.div>

        {/* The declaration */}
        <AnimatePresence mode="wait">
          <motion.div key={decl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <p className="text-white/40 text-sm mb-3 italic" style={{ fontFamily: 'Georgia, serif' }}>
              Say it aloud:
            </p>
            <h2 className="text-white font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
              "{decl.truth}"
            </h2>
            <p className="text-sm font-bold" style={{ color: pillar?.color || '#FAD98D' }}>{decl.verse}</p>
          </motion.div>
        </AnimatePresence>

        {/* Scripture */}
        <AnimatePresence mode="wait">
          <motion.div key={decl.id + '-verse'}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white/8 rounded-2xl px-6 py-4 mb-8 max-w-xs border border-white/10"
          >
            <p className="text-white/60 text-sm italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              "{decl.fullVerse}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Speak it button */}
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div key="confirmed"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl"
              style={{ background: pillar?.color || '#FAD98D' }}
            >
              <Check className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">Declared!</span>
            </motion.div>
          ) : (
            <motion.button key="speak"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={markSpoken}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 text-white font-bold text-sm hover:bg-white/10 transition-colors"
              style={{ borderColor: pillar?.color || '#FAD98D', color: pillar?.color || '#FAD98D' }}
            >
              <Mic className="w-4 h-4" />
              I declared this
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="relative z-10 flex items-center justify-between px-8 pb-12 flex-shrink-0">
        <button onClick={goPrev} disabled={isFirst}
          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
            isFirst ? 'border-white/10 text-white/15' : 'border-white/25 text-white/70 hover:bg-white/10'
          }`}>
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-white/30 text-[10px]">
            {spoken.size} declared this session
          </p>
        </div>

        {isLast ? (
          <button onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold transition-all border"
            style={{ borderColor: pillar?.color || '#FAD98D', color: pillar?.color || '#FAD98D' }}>
            Finish
          </button>
        ) : (
          <button onClick={goNext}
            className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:bg-white/10 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Declaration card (browse view) ──────────────────────────────────────────
function DeclarationCard({ decl, isFav, isMemorized, onToggleFav, onToggleMemorized, onDeclare, index }) {
  const [expanded, setExpanded] = useState(false);
  const pillar = PILLAR_MAP[decl.pillar];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className={`bg-white rounded-2xl border overflow-hidden transition-all ${
        isMemorized ? 'border-emerald-200' : 'border-[#F2F6FA]'
      }`}
    >
      {/* Pillar color bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${pillar?.color}, transparent)` }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            style={{ background: `${pillar?.color}18` }}>
            {pillar?.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: pillar?.color }}>
              {decl.pillar}
            </p>
            <h3 className="font-bold text-sm text-[#0A1A2F] leading-snug">{decl.truth}</h3>
            <p className="text-[11px] text-[#0A1A2F]/40 mt-0.5">{decl.verse}</p>
          </div>
          {/* Action icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onToggleFav(decl.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isFav ? 'text-amber-400' : 'text-[#0A1A2F]/20 hover:text-amber-300'
              }`}>
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scripture quote */}
        <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background: `${pillar?.color}0f`, borderLeft: `2px solid ${pillar?.color}40` }}>
          <p className="text-xs text-[#0A1A2F]/65 italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            "{decl.fullVerse}"
          </p>
        </div>

        {/* Explanation expand */}
        <button onClick={() => setExpanded(e => !e)}
          className="w-full text-left text-xs font-semibold text-[#0A1A2F]/40 hover:text-[#0A1A2F]/60 transition-colors flex items-center gap-1 mb-3">
          <BookOpen className="w-3 h-3" />
          {expanded ? 'Hide explanation' : 'What this means'}
          <span className="ml-auto">{expanded ? '−' : '+'}</span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-[#0A1A2F]/65 leading-relaxed pb-3">
                {decl.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer: Declare + Memorized buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onDeclare(decl)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all text-white"
            style={{ background: `linear-gradient(135deg, ${pillar?.color}, ${pillar?.color}cc)` }}
          >
            <Mic className="w-3 h-3" />
            Declare
          </button>
          <button
            onClick={() => onToggleMemorized(decl.id)}
            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isMemorized
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-[#F2F6FA] border-[#F2F6FA] text-[#0A1A2F]/40 hover:border-emerald-200'
            }`}
          >
            <Check className="w-3 h-3" />
            {isMemorized ? 'Memorized' : 'Know it'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IdentityInChristPage() {
  const [pillarFilter, setPillarFilter] = useState('all');
  const [favs,         setFavs]         = useState(loadFavs);
  const [memorized,    setMemorized]    = useState(loadMemorized);
  const [declareMode,  setDeclareMode]  = useState(null); // { declarations, startIndex }
  const [showFavOnly,  setShowFavOnly]  = useState(false);

  const today = getTodaysDeclaration();
  const todayPillar = PILLAR_MAP[today.pillar];

  const toggleFav = useCallback((id) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(FAVS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleMemorized = useCallback((id) => {
    setMemorized(prev => {
      const next = prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id];
      localStorage.setItem(MEMORIZED_KEY, JSON.stringify(next));
      if (!prev.includes(id)) toast.success('Marked as memorized 🎉', { duration: 1500 });
      return next;
    });
  }, []);

  const startDeclareAll = () => {
    const list = pillarFilter === 'all' ? DECLARATIONS : DECLARATIONS.filter(d => d.pillar === pillarFilter);
    setDeclareMode({ declarations: list, startIndex: 0 });
  };

  const startDeclareSingle = (decl) => {
    const list = [decl];
    setDeclareMode({ declarations: list, startIndex: 0 });
  };

  // Filtered list
  let filtered = DECLARATIONS;
  if (showFavOnly)         filtered = filtered.filter(d => favs.includes(d.id));
  if (pillarFilter !== 'all') filtered = filtered.filter(d => d.pillar === pillarFilter);

  const memorizedCount = memorized.length;
  const favCount = favs.length;

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] pb-28">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-white border-b border-[#F2F6FA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Link to={createPageUrl('PersonalGrowth')}
              className="w-9 h-9 rounded-full bg-[#F2F6FA] hover:bg-white flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
            </Link>
            <div className="flex-1">
              <h1 className="text-base font-bold text-[#0A1A2F]">Identity in Christ</h1>
              <p className="text-xs text-[#0A1A2F]/45">
                {memorizedCount > 0 ? `${memorizedCount} memorized · ` : ''}{DECLARATIONS.length} declarations
              </p>
            </div>
            <button onClick={startDeclareAll}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] rounded-xl px-3 py-1.5 hover:opacity-90 transition-opacity">
              <Mic className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Declare All</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

          {/* ── Today's featured declaration ─────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest">Today's Declaration</p>
            </div>
            <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-3xl p-6 shadow-lg border border-[#FAD98D]/15 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle at 100% 0%, ${todayPillar?.color || '#FAD98D'}20 0%, transparent 70%)` }} />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{todayPillar?.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: todayPillar?.color || '#FAD98D' }}>
                    {today.pillar}
                  </span>
                </div>

                <h2 className="text-white font-bold text-xl leading-tight mb-2"
                  style={{ fontFamily: 'Georgia, serif' }}>
                  "{today.truth}"
                </h2>
                <p className="text-sm font-semibold mb-3" style={{ color: todayPillar?.color || '#FAD98D' }}>
                  {today.verse}
                </p>
                <p className="text-white/55 text-xs italic leading-relaxed mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  "{today.fullVerse}"
                </p>

                <div className="flex gap-2">
                  <button onClick={() => startDeclareSingle(today)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#0A1A2F] text-xs font-bold hover:opacity-90 transition-opacity"
                    style={{ background: todayPillar?.color || '#FAD98D' }}>
                    <Mic className="w-3.5 h-3.5" />
                    Declare now
                  </button>
                  <button onClick={() => toggleFav(today.id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      favs.includes(today.id)
                        ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                        : 'bg-white/10 border-white/15 text-white/50 hover:bg-white/15'
                    }`}>
                    <Star className={`w-3.5 h-3.5 ${favs.includes(today.id) ? 'fill-amber-400' : ''}`} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Stats ────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="grid grid-cols-3 gap-3">
            {[
              { value: DECLARATIONS.length, label: 'Total',     sub: 'declarations', color: '#FAD98D' },
              { value: memorizedCount,       label: 'Memorized', sub: 'committed',    color: '#10b981' },
              { value: favCount,             label: 'Saved',     sub: 'favorites',    color: '#f59e0b' },
            ].map(({ value, label, sub, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-[#F2F6FA] p-3.5 text-center">
                <p className="font-bold text-xl text-[#0A1A2F]" style={value > 0 ? { color } : {}}>{value}</p>
                <p className="text-xs font-bold text-[#0A1A2F] mt-0.5">{label}</p>
                <p className="text-[10px] text-[#0A1A2F]/35">{sub}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Filter row ───────────────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-0.5 scrollbar-none">
              {PILLARS.map(p => (
                <button key={p.id} onClick={() => { setPillarFilter(p.id); setShowFavOnly(false); }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                    pillarFilter === p.id && !showFavOnly
                      ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                      : 'bg-white text-[#0A1A2F]/50 border-[#F2F6FA] hover:border-[#FAD98D]/40'
                  }`}>
                  <span>{p.emoji}</span>
                  {p.label}
                  <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
                    pillarFilter === p.id && !showFavOnly ? 'bg-white/20' : 'bg-[#F2F6FA]'
                  }`}>
                    {p.id === 'all' ? DECLARATIONS.length : DECLARATIONS.filter(d => d.pillar === p.id).length}
                  </span>
                </button>
              ))}
              {/* Favorites toggle */}
              <button onClick={() => { setShowFavOnly(f => !f); setPillarFilter('all'); }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                  showFavOnly
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-[#0A1A2F]/50 border-[#F2F6FA] hover:border-amber-300'
                }`}>
                <Star className={`w-3 h-3 ${showFavOnly ? 'fill-white' : ''}`} />
                Saved
              </button>
            </div>

            {/* Declare pillar button */}
            {pillarFilter !== 'all' && !showFavOnly && (
              <motion.button
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  const list = DECLARATIONS.filter(d => d.pillar === pillarFilter);
                  setDeclareMode({ declarations: list, startIndex: 0 });
                }}
                className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                style={{
                  borderColor: PILLAR_MAP[pillarFilter]?.color + '60',
                  color: PILLAR_MAP[pillarFilter]?.color,
                  background: PILLAR_MAP[pillarFilter]?.color + '10',
                }}
              >
                <Mic className="w-3 h-3" />
                Declare all {pillarFilter} truths ({DECLARATIONS.filter(d => d.pillar === pillarFilter).length})
              </motion.button>
            )}
          </div>

          {/* ── Declaration cards ─────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-8 h-8 text-[#0A1A2F]/15 mx-auto mb-3" />
              <p className="text-sm text-[#0A1A2F]/40">No saved declarations yet</p>
              <p className="text-xs text-[#0A1A2F]/25 mt-1">Tap the ⭐ on any card to save it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((decl, i) => (
                <DeclarationCard
                  key={decl.id}
                  decl={decl}
                  isFav={favs.includes(decl.id)}
                  isMemorized={memorized.includes(decl.id)}
                  onToggleFav={toggleFav}
                  onToggleMemorized={toggleMemorized}
                  onDeclare={startDeclareSingle}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* ── Cross-link to Growth Pathways ─────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to={createPageUrl('GrowthPathwaysPage')}
              className="flex items-center gap-3 bg-white rounded-2xl border border-[#F2F6FA] hover:border-[#FAD98D]/40 p-4 transition-all group">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#0A1A2F]">Identity in Christ Pathway</p>
                <p className="text-xs text-[#0A1A2F]/45">5-step guided journey into your true identity</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 group-hover:text-[#0A1A2F]/40 transition-colors" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* ── Declaration Mode overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {declareMode && (
          <DeclarationMode
            declarations={declareMode.declarations}
            startIndex={declareMode.startIndex}
            onClose={() => setDeclareMode(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}