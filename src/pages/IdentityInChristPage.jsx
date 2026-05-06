import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Star, ChevronRight, ChevronLeft,
  BookOpen, X, Check, Mic, ArrowRight, Sparkles, PenLine, RefreshCw, Info
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { todayKey } from '@/utils/localDate';
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
    explanation: "You are not an orphan navigating life alone. God didn't just tolerate your existence — He gave you the legal right to be called His child. That is your permanent address in the universe." },
  {
    id: 'chosen-loved',
    truth: 'I am chosen and dearly loved',
    pillar: 'Beloved',
    verse: 'Colossians 3:12',
    fullVerse: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
    explanation: "God didn't choose you reluctantly or as a last resort. He handpicked you with deliberate intention before the world was made. You are not chosen despite your flaws — you are chosen, full stop." },
  {
    id: 'lavished-love',
    truth: 'I am lavishly loved by the Father',
    pillar: 'Beloved',
    verse: '1 John 3:1',
    fullVerse: 'See how great a love the Father has given to us, that we should be called children of God! And that is what we are!',
    explanation: "John uses the word 'lavished' — extravagant, over-the-top, wasteful by human standards. God's love for you is not measured or earned. It is poured out without restraint." },
  {
    id: 'known-fully',
    truth: 'I am fully known and still fully loved',
    pillar: 'Beloved',
    verse: 'Psalm 139:1–3',
    fullVerse: 'You have searched me, Lord, and you know me. You know when I sit and when I rise; you perceive my thoughts from afar.',
    explanation: "God has seen everything — every failure, every secret, every darkest thought — and He has not moved. You cannot lose His love by being fully seen. He already knows and He already chose you." },
  {
    id: 'wonderfully-made',
    truth: 'I am fearfully and wonderfully made',
    pillar: 'Beloved',
    verse: 'Psalm 139:14',
    fullVerse: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',
    explanation: "The word 'fearfully' means with reverence and awe — as if God stepped back from His work and marveled. That is how you were made. Not hastily. Not accidentally. With wonder." },
  {
    id: 'engraved-hands',
    truth: 'I am engraved on the palms of His hands',
    pillar: 'Beloved',
    verse: 'Isaiah 49:16',
    fullVerse: 'See, I have engraved you on the palms of my hands; your walls are ever before me.',
    explanation: "Engravings are permanent. God doesn't have you on a sticky note that might fall off. Your name is carved into Him — a permanent part of who He is toward you." },
  // ── REDEEMED ─────────────────────────────────────────────────────────────
  {
    id: 'new-creation',
    truth: 'I am a new creation',
    pillar: 'Redeemed',
    verse: '2 Corinthians 5:17',
    fullVerse: 'Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.',
    explanation: "This is not renovation — it's recreation. God didn't patch up the old version of you and call it good. He made you new. Your past does not have a vote on your present identity." },
  {
    id: 'forgiven',
    truth: 'I am completely forgiven',
    pillar: 'Redeemed',
    verse: 'Colossians 1:14',
    fullVerse: 'In whom we have our redemption, the forgiveness of our sins.',
    explanation: "Forgiven means the debt is gone — not deferred, not on a payment plan, not held over you. The record has been cleared. You don't have to keep paying for what has already been paid." },
  {
    id: 'redeemed',
    truth: 'I am redeemed and set free',
    pillar: 'Redeemed',
    verse: 'Galatians 5:1',
    fullVerse: 'It is for freedom that Christ has set us free. Stand firm, then, and do not let yourselves be burdened again by a yoke of slavery.',
    explanation: "Redemption means to buy back what was lost. Christ paid the price to get you back — not so you'd live cautiously, but so you'd live free. The chains are gone. Stop picking them back up." },
  {
    id: 'not-condemned',
    truth: 'I am free from condemnation',
    pillar: 'Redeemed',
    verse: 'Romans 8:1',
    fullVerse: 'There is therefore now no condemnation to those who are in Christ Jesus.',
    explanation: "Condemnation is the voice that says you are what you've done. Paul says that voice has no legal standing. 'No condemnation' is not qualified. It doesn't say 'usually' or 'mostly.' It says none." },
  {
    id: 'seated-with-christ',
    truth: 'I am seated with Christ in heavenly places',
    pillar: 'Redeemed',
    verse: 'Ephesians 2:6',
    fullVerse: 'And God raised us up with Christ and seated us with him in the heavenly realms in Christ Jesus.',
    explanation: "You are not beneath your circumstances — you are above them. Positionally, you have already been raised and seated in victory. The battle you're facing has already been won from that vantage point." },
  {
    id: 'citizenship',
    truth: 'My citizenship is in heaven',
    pillar: 'Redeemed',
    verse: 'Philippians 3:20',
    fullVerse: 'But our citizenship is in heaven. And we eagerly await a Savior from there, the Lord Jesus Christ.',
    explanation: "This world is not your home — it's your assignment. You carry a different passport. That means earthly rejection, failure, and loss don't have final authority over who you are." },
  // ── EQUIPPED ─────────────────────────────────────────────────────────────
  {
    id: 'more-than-conqueror',
    truth: 'I am more than a conqueror',
    pillar: 'Equipped',
    verse: 'Romans 8:37',
    fullVerse: 'No, in all these things we are more than conquerors through him who loved us.',
    explanation: "More than a conqueror means you don't just win — you win decisively, and the victory costs you less than it would cost the enemy. Through Christ, you don't just get through hard things — you become stronger for them." },
  {
    id: 'no-fear',
    truth: 'I have a spirit of power, love, and a sound mind',
    pillar: 'Equipped',
    verse: '2 Timothy 1:7',
    fullVerse: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
    explanation: "Fear is not your inheritance. God didn't give you anxiety as a default setting. He gave you power to act, love to connect deeply, and a sound mind to think clearly — even when circumstances say otherwise." },
  {
    id: 'strength-in-christ',
    truth: 'I can do all things through Christ',
    pillar: 'Equipped',
    verse: 'Philippians 4:13',
    fullVerse: 'I can do all things through Christ, who strengthens me.',
    explanation: "Paul wrote this from prison — not from a victory lap. Confidence in Christ doesn't depend on your circumstances. The strength is available in the valley, not just on the mountaintop." },
  {
    id: 'grace-sufficient',
    truth: `God's grace is sufficient for me`,
    pillar: 'Equipped',
    verse: '2 Corinthians 12:9',
    fullVerse: 'My grace is sufficient for you, for my power is made perfect in weakness.',
    explanation: "Your weakness is not disqualifying — it's the very place God shows up most clearly. Where you run out, He begins. Sufficient means exactly enough. Not barely enough. Exactly enough." },
  {
    id: 'wisdom',
    truth: `I have access to God's wisdom`,
    pillar: 'Equipped',
    verse: 'James 1:5',
    fullVerse: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.',
    explanation: "You are not on your own when it comes to decisions, discernment, or understanding. God gives wisdom generously — the word means 'lavishly, without reproach.' Ask without shame." },
  {
    id: 'rooted',
    truth: 'I am rooted and built up in Christ',
    pillar: 'Equipped',
    verse: 'Colossians 2:7',
    fullVerse: 'Rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.',
    explanation: "A rooted tree doesn't topple in a storm — the wind that would uproot a shallow tree only drives the roots deeper. When you are grounded in Christ, the pressures of life deepen rather than destroy you." },
  // ── CALLED ───────────────────────────────────────────────────────────────
  {
    id: 'light-of-world',
    truth: 'I am the light of the world',
    pillar: 'Called',
    verse: 'Matthew 5:14',
    fullVerse: 'You are the light of the world. A town built on a hill cannot be hidden.',
    explanation: "Light doesn't try to shine — it just is what it is. You are not supposed to perform or manufacture influence. Your presence, your character, your faithfulness — these carry light naturally into every space you enter." },
  {
    id: 'salt-earth',
    truth: 'I am the salt of the earth',
    pillar: 'Called',
    verse: 'Matthew 5:13',
    fullVerse: 'You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again?',
    explanation: "Salt preserves and flavors. You have been placed where you are to prevent decay and add meaning. Your presence in your workplace, family, and community is not accidental — it is strategic." },
  {
    id: 'handiwork',
    truth: `I am God's handiwork, created for good works`,
    pillar: 'Called',
    verse: 'Ephesians 2:10',
    fullVerse: `For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.`,
    explanation: "The Greek word for handiwork is poiema — the root of 'poem.' You are God's masterwork, not a mass-produced item. And the good works He prepared for you are specific to you — not generic volunteer work, but your particular assignment." },
  {
    id: 'royal-priesthood',
    truth: 'I am part of a royal priesthood',
    pillar: 'Called',
    verse: '1 Peter 2:9',
    fullVerse: "But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light.",
    explanation: "Royalty speaks to authority. Priesthood speaks to access. You have both. You are not a commoner hoping for an audience with God — you are a member of His household with full access and delegated authority." },
  {
    id: 'ambassador',
    truth: 'I am an ambassador for Christ',
    pillar: 'Called',
    verse: '2 Corinthians 5:20',
    fullVerse: `We are therefore Christ's ambassadors, as though God were making his appeal through us.`,
    explanation: "An ambassador carries the full weight of the nation they represent. When you speak, when you love, when you serve — God is making an appeal through you. You represent the Kingdom in every room you enter." },
  // ── PROTECTED ────────────────────────────────────────────────────────────
  {
    id: 'upheld',
    truth: "I am upheld by God's right hand",
    pillar: 'Protected',
    verse: 'Isaiah 41:10',
    fullVerse: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    explanation: "Uphold means to support from beneath so you do not fall. God is not watching you from a distance hoping you make it — He is actively holding you up. You cannot fall beyond His reach." },
  {
    id: 'peace-guards',
    truth: 'The peace of God guards my heart',
    pillar: 'Protected',
    verse: 'Philippians 4:7',
    fullVerse: 'And the peace of God, which transcends all understanding, will guard your heart and your mind in Christ Jesus.',
    explanation: "The peace of God doesn't wait for your circumstances to improve before it shows up. It transcends understanding — meaning it operates outside of logic. It guards your heart even when your mind can't figure out why it should be okay." },
  {
    id: 'nothing-separate',
    truth: "Nothing can separate me from God's love",
    pillar: 'Protected',
    verse: 'Romans 8:38–39',
    fullVerse: 'For I am convinced that neither death nor life, neither angels nor demons... will be able to separate us from the love of God that is in Christ Jesus our Lord.',
    explanation: "Paul lists every conceivable category — supernatural, natural, past, future, height, depth — and says none of it is enough to cut you off. The love of God is not a fragile thread. It is an unbreakable bond." },
  {
    id: 'shepherd',
    truth: 'The Lord is my shepherd — I lack nothing',
    pillar: 'Protected',
    verse: 'Psalm 23:1',
    fullVerse: 'The Lord is my shepherd, I lack nothing.',
    explanation: "A shepherd doesn't just occasionally check on the flock — they give their life for it. When the Lord is your shepherd, the promise isn't comfort everywhere. It's provision and presence everywhere, including the darkest valleys." },
  {
    id: 'needs-met',
    truth: 'God will meet all my needs',
    pillar: 'Protected',
    verse: 'Philippians 4:19',
    fullVerse: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
    explanation: "Not some of your needs. All of them. And the source isn't your paycheck or your connections — it's 'the riches of his glory.' That is an inexhaustible account. You can make requests without fear of running out." },
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
// Real recall-test results — supersedes the binary `_memorized` checkbox.
// Shape: { [declarationId]: { passed: true, ts: 1700000000000, attempts: 2 } }
// We keep MEMORIZED_KEY around for backward compat (legacy users have entries
// there) but new "memorized" claims go through the recall test. The progress
// indicator counts a declaration as "recalled" if recallResults[id]?.passed.
const RECALL_KEY  = 'identity_recall_v1';
// Per-day "spoke this aloud" tracker, parallel to AffirmationsPage's design.
// Resets each day. Shape: { 'YYYY-MM-DD': { [declarationId]: count } }
const SPOKEN_KEY  = 'identity_spoken_v1';

const loadFavs       = () => { try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); } catch { return []; } };
const loadMemorized  = () => { try { return JSON.parse(localStorage.getItem(MEMORIZED_KEY) || '[]'); } catch { return []; } };
const loadRecall     = () => { try { return JSON.parse(localStorage.getItem(RECALL_KEY) || '{}'); } catch { return {}; } };
const loadSpokenToday = () => {
  try {
    const all = JSON.parse(localStorage.getItem(SPOKEN_KEY) || '{}');
    return all[todayKey()] || {};
  } catch { return {}; }
};
const saveSpokenToday = (next) => {
  try { localStorage.setItem(SPOKEN_KEY, JSON.stringify({ [todayKey()]: next })); } catch {}
};

// ─── Keyword extraction for the recall test ──────────────────────────────────
// Picks ~3 substantive content words from a verse to mask. Algorithm:
//   1. Tokenize on word boundaries (preserve apostrophes for contractions).
//   2. Drop stopwords + short words (<4 chars).
//   3. Dedupe by 5-char stem so e.g. "wonderfully" and "wonderful" don't both
//      get masked (the user would type the same thing).
//   4. Sort by length desc — longest words tend to be the most semantically
//      loaded (Christ, redemption, righteousness, etc.).
//   5. Take the first 3.
// We compute these once per declaration via useMemo; the verse text never
// changes at runtime, so the extracted keywords are stable across renders.
const STOP = new Set([
  'the','and','for','that','with','this','from','your','have','will','they','their','them','they',
  'when','what','which','were','was','been','being','where','here','there','then','than',
  'all','any','our','ours','yours','his','her','him','its','about','into','out','off','over','under',
  'above','below','before','after','during','through','because','since','while','until',
  'a','an','as','of','in','on','at','to','by','is','are','be','am','do','did','does',
  'i','you','he','she','it','we','me','my','us','if','so','or','but','not','no'
]);
function extractRecallKeywords(verse, n = 3) {
  const tokens = (verse.match(/[A-Za-z][A-Za-z']+/g) || []);
  const seenStems = new Set();
  const candidates = [];
  for (const w of tokens) {
    const wl = w.toLowerCase().replace(/'.*$/, ''); // drop apostrophe + rest ("God's" → "god")
    if (wl.length < 4) continue;
    if (STOP.has(wl)) continue;
    const stem = wl.slice(0, 5);
    if (seenStems.has(stem)) continue;
    seenStems.add(stem);
    candidates.push(w);
  }
  candidates.sort((a, b) => b.length - a.length);
  return candidates.slice(0, n);
}

// String comparison for the recall test. Strips punctuation, normalizes case.
// Tolerates pluralization differences and the word's apostrophe variants
// ("Gods" vs "God's"). Not lemmatization — just enough to be forgiving.
const recallNormalize = (s) => (s || '').trim().toLowerCase().replace(/['"\.,;:!?]/g, '').replace(/s$/, '');
const recallMatches = (typed, target) => recallNormalize(typed) === recallNormalize(target);

function getTodaysDeclaration() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DECLARATIONS[dayOfYear % DECLARATIONS.length];
}

// ─── Recall test (real memorization mechanic) ────────────────────────────────
// Replaces the old binary "I know it" checkbox. The verse is rendered with 3
// keywords masked as input fields; the user types what's missing and submits.
// Pass = at least 2 of 3 correct (typo-tolerant, case-insensitive). Pass
// updates RECALL_KEY localStorage. Fail offers a retry with the keywords
// hinted by their first letter.
//
// Why 2/3 not 3/3: scripture memory work is probabilistic in real life — a
// single typo or remembered synonym shouldn't fail the user. The signal "I
// roughly recall this verse" is what we want to capture; perfectionism would
// punish exactly the users this feature is meant to help.
function RecallTest({ decl, onPass, onClose }) {
  const keywords = useMemo(() => extractRecallKeywords(decl.fullVerse, 3), [decl.fullVerse]);
  const pillar = PILLAR_MAP[decl.pillar];

  // Build a render plan: array of { kind: 'text'|'blank', value, idx? } that
  // the verse splits into. We mask the FIRST occurrence of each keyword so we
  // don't ask the user to fill in the same word twice in one verse.
  const segments = useMemo(() => {
    const remaining = new Set(keywords.map(k => k.toLowerCase()));
    const out = [];
    const re = /[A-Za-z][A-Za-z']+|[^A-Za-z]+/g;
    let blankIdx = 0;
    let m;
    while ((m = re.exec(decl.fullVerse)) !== null) {
      const tok = m[0];
      const isWord = /^[A-Za-z]/.test(tok);
      const tokLower = tok.toLowerCase();
      if (isWord && remaining.has(tokLower)) {
        remaining.delete(tokLower);
        out.push({ kind: 'blank', target: tok, idx: blankIdx++ });
      } else {
        out.push({ kind: 'text', value: tok });
      }
    }
    return out;
  }, [decl.fullVerse, keywords]);

  const numBlanks = segments.filter(s => s.kind === 'blank').length;
  const [answers, setAnswers] = useState(() => Array(numBlanks).fill(''));
  const [result, setResult] = useState(null); // null | 'pass' | 'fail'
  const [showHints, setShowHints] = useState(false);
  const inputRefs = useRef([]);

  const submit = () => {
    let correct = 0;
    segments.forEach(s => {
      if (s.kind !== 'blank') return;
      if (recallMatches(answers[s.idx], s.target)) correct++;
    });
    const passed = correct >= Math.max(2, Math.ceil(numBlanks * 2 / 3));
    setResult(passed ? 'pass' : 'fail');
    if (passed) {
      const map = loadRecall();
      const prev = map[decl.id] || { attempts: 0 };
      map[decl.id] = {
        passed: true,
        ts: Date.now(),
        attempts: prev.attempts + 1,
      };
      try { localStorage.setItem(RECALL_KEY, JSON.stringify(map)); } catch {}
      onPass?.(decl.id);
    } else {
      // Track the failed attempt too so the user sees their persistence
      const map = loadRecall();
      const prev = map[decl.id] || { attempts: 0 };
      map[decl.id] = { ...prev, attempts: prev.attempts + 1 };
      try { localStorage.setItem(RECALL_KEY, JSON.stringify(map)); } catch {}
    }
  };

  const retry = () => { setAnswers(Array(numBlanks).fill('')); setResult(null); setShowHints(true); inputRefs.current[0]?.focus(); };

  return (
    <div className="rounded-2xl p-4 border" style={{ borderColor: `${pillar?.color}33`, background: `${pillar?.color}08` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: pillar?.color }}>
          Recall Test · {decl.verse}
        </p>
        {onClose && (
          <button onClick={onClose} className="text-[#0A1A2F]/30 dark:text-white/30 hover:text-[#0A1A2F]/60">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* The verse with blanks inline */}
      <div className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'Georgia, serif', color: '#0A1A2F' }}>
        {segments.map((s, i) => {
          if (s.kind === 'text') return <span key={i} className="dark:text-white/85">{s.value}</span>;
          const targetLen = s.target.length;
          const isPass = result === 'pass';
          const isFail = result === 'fail';
          const correct = recallMatches(answers[s.idx], s.target);
          return (
            <input
              key={i}
              ref={(el) => { inputRefs.current[s.idx] = el; }}
              type="text"
              value={answers[s.idx]}
              onChange={(e) => {
                const v = e.target.value;
                setAnswers(a => { const next = [...a]; next[s.idx] = v; return next; });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Tab to next blank or submit if last
                  if (s.idx < numBlanks - 1) inputRefs.current[s.idx + 1]?.focus();
                  else submit();
                }
              }}
              disabled={result !== null}
              placeholder={showHints ? s.target[0] + '…' : '_'.repeat(Math.max(3, Math.min(targetLen, 8)))}
              className="inline-block mx-0.5 px-1.5 py-0.5 rounded border-b-2 outline-none text-center font-bold"
              style={{
                width: `${Math.max(targetLen + 1, 4)}ch`,
                borderColor: result === null ? `${pillar?.color}80` : (correct ? '#10b981' : '#ef4444'),
                background: result === null ? '#fff' : (correct ? '#ecfdf5' : '#fef2f2'),
                color: result === null ? '#0A1A2F' : (correct ? '#059669' : '#dc2626'),
                fontFamily: '-apple-system, sans-serif',
              }}
            />
          );
        })}
      </div>

      {/* Action / result */}
      {result === null && (
        <button
          onClick={submit}
          disabled={answers.every(a => !a.trim())}
          className="w-full py-2.5 rounded-xl text-xs font-bold transition-all text-white disabled:opacity-40 min-h-[44px]"
          style={{ background: `linear-gradient(135deg, ${pillar?.color}, ${pillar?.color}cc)` }}
        >
          Check my recall
        </button>
      )}
      {result === 'pass' && (
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: '#ecfdf5', borderLeft: '3px solid #10b981' }}>
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-semibold text-emerald-700">
            You've internalized this. It's part of you now.
          </p>
        </div>
      )}
      {result === 'fail' && (
        <div className="space-y-2">
          <div className="rounded-xl px-3 py-2.5" style={{ background: '#fef2f2', borderLeft: '3px solid #ef4444' }}>
            <p className="text-xs font-semibold text-red-700 mb-1">Almost there.</p>
            <p className="text-[11px] text-red-700/85 leading-relaxed">
              Memorization is repetition. Try once more — the hints below will help.
            </p>
          </div>
          <button
            onClick={retry}
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all border min-h-[44px]"
            style={{ borderColor: pillar?.color, color: pillar?.color }}
          >
            <RefreshCw className="w-3 h-3 inline mr-1" />
            Try again with hints
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Reflection journaling ───────────────────────────────────────────────────
// Writing area that saves to JournalEntry. Bridges this page's content to the
// user's actual journal so reflections aren't a silo. Uses entry_type
// 'identity_reflection' — visible from the main journal alongside other types.
function ReflectionJournal({ decl, onSaved }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const pillar = PILLAR_MAP[decl.pillar];

  const save = async () => {
    if (!text.trim() || saving) return;
    setSaving(true);
    try {
      const entry = await base44.entities.JournalEntry.create({
        entry_type: 'identity_reflection',
        content: `Identity in Christ — ${decl.truth} (${decl.verse})\n\n${text.trim()}`,
        // Tag a few fields so future surfacing can filter by declaration if we want
        category: 'identity_reflection',
        prompt: `What does "${decl.truth}" mean for me today?`,
      });
      setSavedId(entry?.id || 'saved');
      setText('');
      toast.success('Saved to your journal 📖', { duration: 1500 });
      onSaved?.(decl.id);
    } catch (e) {
      toast.error('Could not save — try again');
    }
    setSaving(false);
  };

  return (
    <div className="rounded-2xl p-4 border" style={{ borderColor: `${pillar?.color}33`, background: `${pillar?.color}08` }}>
      <div className="flex items-center gap-2 mb-2">
        <PenLine className="w-3.5 h-3.5" style={{ color: pillar?.color }} />
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: pillar?.color }}>
          Reflect
        </p>
      </div>
      <p className="text-xs italic mb-3" style={{ color: '#0A1A2F', fontFamily: 'Georgia, serif' }}>
        What does "{decl.truth}" mean for you today?
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Write what surfaces…"
        disabled={!!savedId}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors mb-3 resize-none"
        style={{
          background: '#fff',
          border: '1px solid rgba(10,26,47,0.10)',
          color: '#0A1A2F',
          fontFamily: 'Georgia, serif',
          lineHeight: 1.6,
        }}
      />
      {savedId ? (
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 bg-emerald-50 border-l-2 border-emerald-500">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-semibold text-emerald-700">Saved to your journal</p>
        </div>
      ) : (
        <button
          onClick={save}
          disabled={!text.trim() || saving}
          className="w-full py-2.5 rounded-xl text-xs font-bold transition-all text-white disabled:opacity-40 min-h-[44px]"
          style={{ background: `linear-gradient(135deg, ${pillar?.color}, ${pillar?.color}cc)` }}
        >
          {saving ? 'Saving…' : 'Save to journal'}
        </button>
      )}
    </div>
  );
}

// ─── Focused practice — Read → Reflect → Speak → Recall ──────────────────────
// One-declaration deep practice. Used when the user lands via ?focus=<id>
// from a coaching plan, or when they tap "Practice" on a card. The four
// steps are presented as collapsible sections rather than a forced-march
// stepper — the user can engage with whichever step calls to them and skip
// the rest. We mark the declaration as fully-practiced when speak + recall
// both fire, but neither is required.
function FocusedPractice({ decl, onClose, onSpoken, onPassed, isMemorized, isFav, onToggleFav }) {
  const pillar = PILLAR_MAP[decl.pillar];
  const [openStep, setOpenStep] = useState('reflect');

  const Step = ({ id, label, icon, children, badge }) => {
    const isOpen = openStep === id;
    return (
      <div className="rounded-2xl bg-white dark:bg-white/5 border overflow-hidden"
        style={{ borderColor: isOpen ? `${pillar?.color}55` : 'rgba(10,26,47,0.08)' }}>
        <button
          onClick={() => setOpenStep(isOpen ? null : id)}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${pillar?.color}18`, color: pillar?.color }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0A1A2F] dark:text-white">{label}</p>
          </div>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${pillar?.color}18`, color: pillar?.color }}>
              {badge}
            </span>
          )}
          <ChevronRight className="w-4 h-4 transition-transform"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', color: '#0A1A2F33' }} />
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const [spokenLocal, setSpokenLocal] = useState(false);
  const handleSpeakConfirm = () => {
    setSpokenLocal(true);
    onSpoken?.(decl.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Hero card showing what we're practicing */}
      <div className="rounded-3xl p-5 relative overflow-hidden border"
        style={{
          background: 'linear-gradient(160deg, #0A1A2F 0%, #0f2440 100%)',
          borderColor: `${pillar?.color}30`,
        }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle at 100% 0%, ${pillar?.color} 0%, transparent 70%)` }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{pillar?.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: pillar?.color }}>
                {decl.pillar}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => onToggleFav?.(decl.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isFav ? 'text-amber-400' : 'text-white/30 hover:text-amber-300'
                }`}>
                <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
              </button>
              {onClose && (
                <button onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white/80">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <h2 className="text-white font-bold leading-tight mb-2"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontFamily: 'Georgia, serif' }}>
            "{decl.truth}"
          </h2>
          <p className="text-sm font-bold mb-3" style={{ color: pillar?.color }}>{decl.verse}</p>
          <p className="text-white/70 text-sm leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
            "{decl.fullVerse}"
          </p>
        </div>
      </div>

      {/* The 4 steps, accordion-style */}
      <Step id="read" label="Read what this means" icon={<BookOpen className="w-4 h-4" />}>
        <p className="text-sm leading-relaxed text-[#0A1A2F]/75 dark:text-white/75" style={{ fontFamily: 'Georgia, serif' }}>
          {decl.explanation}
        </p>
      </Step>

      <Step id="reflect" label="Reflect" icon={<PenLine className="w-4 h-4" />}>
        <ReflectionJournal decl={decl} onSaved={() => {}} />
      </Step>

      <Step id="speak" label="Speak it aloud"
        icon={<Mic className="w-4 h-4" />}
        badge={spokenLocal ? '✓' : null}
      >
        <div className="space-y-3">
          <p className="text-xs italic text-[#0A1A2F]/60 dark:text-white/60" style={{ fontFamily: 'Georgia, serif' }}>
            Speak it out loud. Repetition is how truth becomes belief.
          </p>
          <p className="text-base font-bold leading-snug" style={{ fontFamily: 'Georgia, serif', color: '#0A1A2F' }}>
            "{decl.truth}"
          </p>
          {spokenLocal ? (
            <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 bg-emerald-50 border-l-2 border-emerald-500">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-semibold text-emerald-700">Declared today</p>
            </div>
          ) : (
            <button
              onClick={handleSpeakConfirm}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all min-h-[44px]"
              style={{ background: `linear-gradient(135deg, ${pillar?.color}, ${pillar?.color}cc)` }}
            >
              <Mic className="w-3 h-3 inline mr-1" />
              I declared this
            </button>
          )}
        </div>
      </Step>

      <Step id="recall" label={isMemorized ? 'Recall — already passed' : 'Recall test'}
        icon={<Sparkles className="w-4 h-4" />}
        badge={isMemorized ? '✓' : null}
      >
        <RecallTest decl={decl} onPass={onPassed} />
      </Step>
    </motion.div>
  );
}

// ─── Explainer card distinguishing this from Affirmations ────────────────────
// Affirmations and identity declarations look superficially similar
// (scripture-backed truths to declare). The theological distinction matters:
// affirmations are general truths to internalize; identity declarations are
// specifically about who you are *in Christ* — positional, derived from union
// with Him. This card surfaces the distinction once and dismisses (stored in
// localStorage so we don't nag returning users).
function ExplainerCard({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 border bg-gradient-to-br from-amber-50/80 to-rose-50/80 border-amber-200/60"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center flex-shrink-0">
          <Crown className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#0A1A2F] mb-1">What is "Identity in Christ"?</p>
          <p className="text-xs text-[#0A1A2F]/70 leading-relaxed mb-2">
            These aren't just affirmations. Each declaration is a <em>positional truth</em> — who Scripture says you are because you're in Christ. Not aspirational. Already true.
          </p>
          <p className="text-[11px] text-[#0A1A2F]/55 leading-relaxed">
            Affirmations build mindset. Identity declarations build foundation.
          </p>
        </div>
        <button onClick={onDismiss}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#0A1A2F]/30 hover:text-[#0A1A2F]/60 flex-shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Progress bar — meaningful counts ────────────────────────────────────────
// Shows three real signals: how many declarations the user has spoken today,
// reflected on (any time), and passed the recall test on. Counts are derived
// from existing state — nothing new to track.
function ProgressBar({ spokenTodayCount, reflectedCount, recalledCount, total }) {
  const Bar = ({ label, count, color }) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/45 dark:text-white/45">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{count}<span className="text-[#0A1A2F]/30 dark:text-white/30 font-normal">/{total}</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-[#F2F6FA] dark:bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(count / total) * 100}%`, background: color }} />
      </div>
    </div>
  );
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-white/5 border border-[#F2F6FA] dark:border-white/5">
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#c9a227]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/55 dark:text-white/55">Your practice</p>
      </div>
      <div className="flex gap-4">
        <Bar label="Spoken today" count={spokenTodayCount} color="#FAD98D" />
        <Bar label="Reflected" count={reflectedCount} color="#8B5CF6" />
        <Bar label="Recalled" count={recalledCount} color="#10b981" />
      </div>
    </div>
  );
}

// ─── Declaration Mode (full-screen speak-aloud practice) ─────────────────────
function DeclarationMode({ declarations, startIndex, onClose, onSpoken }) {
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
    onSpoken?.(decl.id); // bubble up to the page so the progress bar updates
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
function DeclarationCard({ decl, isFav, isMemorized, onToggleFav, onDeclare, onPractice, index }) {
  const [expanded, setExpanded] = useState(false);
  const pillar = PILLAR_MAP[decl.pillar];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
      className={`bg-white dark:bg-white/5 rounded-2xl border overflow-hidden transition-all ${
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
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: pillar?.color }}>
                {decl.pillar}
              </p>
              {isMemorized && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Check className="w-2.5 h-2.5" />
                  Recalled
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm text-[#0A1A2F] dark:text-white leading-snug">{decl.truth}</h3>
            <p className="text-[11px] text-[#0A1A2F]/40 dark:text-white/40 mt-0.5">{decl.verse}</p>
          </div>
          {/* Action icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onToggleFav(decl.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isFav ? 'text-amber-400' : 'text-[#0A1A2F]/20 dark:text-white/20 hover:text-amber-300'
              }`}>
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scripture quote */}
        <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background: `${pillar?.color}0f`, borderLeft: `2px solid ${pillar?.color}40` }}>
          <p className="text-xs text-[#0A1A2F]/65 dark:text-white/65 italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            "{decl.fullVerse}"
          </p>
        </div>

        {/* Explanation expand */}
        <button onClick={() => setExpanded(e => !e)}
          className="w-full text-left text-xs font-semibold text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F]/60 dark:text-white/60 transition-colors flex items-center gap-1 mb-3">
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
              <p className="text-xs text-[#0A1A2F]/65 dark:text-white/65 leading-relaxed pb-3">
                {decl.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer: Declare + Practice buttons.
            Practice opens FocusedPractice (Read → Reflect → Speak → Recall),
            which includes the real recall test. The binary "Know it" toggle
            is gone — memorization is now claimed through real recall, not a
            checkbox. A small ✓ chip in the header surfaces memorized state. */}
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
            onClick={() => onPractice?.(decl)}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all bg-white dark:bg-white/5 hover:border-[#FAD98D]/60"
            style={{ borderColor: `${pillar?.color}40`, color: pillar?.color }}
          >
            <Sparkles className="w-3 h-3" />
            Practice
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IdentityInChristPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pillarFilter, setPillarFilter] = useState('all');
  const [favs,         setFavs]         = useState(loadFavs);
  const [memorized,    setMemorized]    = useState(loadMemorized);
  const [recallResults, setRecallResults] = useState(loadRecall);
  const [spokenToday,  setSpokenToday]  = useState(loadSpokenToday);
  const [declareMode,  setDeclareMode]  = useState(null); // { declarations, startIndex }
  const [showFavOnly,  setShowFavOnly]  = useState(false);

  // Reflection tracking — derived from JournalEntry but cached locally so the
  // progress bar updates immediately without a network round-trip. We mark a
  // declaration as "reflected on" once the user successfully saves a journal
  // entry from its FocusedPractice flow this session. The map persists in
  // localStorage so the count survives page refresh; full server-side counts
  // would require a JournalEntry query and aren't worth the complexity.
  const REFLECTED_KEY = 'identity_reflected_v1';
  const [reflectedSet, setReflectedSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(REFLECTED_KEY) || '[]')); } catch { return new Set(); }
  });

  // Explainer dismissal — once the user has seen and dismissed the "What is
  // Identity in Christ?" card, we don't show it again on this device.
  const EXPLAINER_KEY = 'identity_explainer_dismissed_v1';
  const [explainerOpen, setExplainerOpen] = useState(() => {
    try { return localStorage.getItem(EXPLAINER_KEY) !== '1'; } catch { return true; }
  });
  const dismissExplainer = () => {
    try { localStorage.setItem(EXPLAINER_KEY, '1'); } catch {}
    setExplainerOpen(false);
  };

  // ── URL-param-driven focused practice ──
  // Coaching plans deep-link via ?focus=<declaration-id> to land the user on
  // a single declaration in focused practice mode. We resolve it once on
  // mount + when search params change. Invalid IDs fall back to no-focus.
  const focusId = searchParams.get('focus');
  const focusedDecl = focusId ? DECLARATIONS.find(d => d.id === focusId) : null;

  const closeFocus = () => {
    // Strip the param from the URL while staying on this page
    const next = new URLSearchParams(searchParams);
    next.delete('focus');
    setSearchParams(next, { replace: true });
  };

  const today = getTodaysDeclaration();
  const todayPillar = PILLAR_MAP[today.pillar];

  const toggleFav = useCallback((id) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(FAVS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Legacy "Memorized" toggle — kept for users who don't engage with the
  // recall test. New flows should prefer recordRecallPass below.
  const toggleMemorized = useCallback((id) => {
    setMemorized(prev => {
      const next = prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id];
      localStorage.setItem(MEMORIZED_KEY, JSON.stringify(next));
      if (!prev.includes(id)) toast.success('Marked as memorized 🎉', { duration: 1500 });
      return next;
    });
  }, []);

  // Called by RecallTest.onPass — records a passed recall test for the
  // declaration. The user is now genuinely "memorized" by a real signal.
  const recordRecallPass = useCallback((id) => {
    setRecallResults(loadRecall()); // re-read what RecallTest just persisted
    // Auto-mark legacy memorized too so the existing UI is consistent
    setMemorized(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(MEMORIZED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Called when user taps "I declared this" anywhere. Bumps the per-day
  // spoken count for the declaration. Resets automatically each day.
  const recordSpoken = useCallback((id) => {
    setSpokenToday(prev => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 };
      saveSpokenToday(next);
      return next;
    });
  }, []);

  // Called when ReflectionJournal saves successfully. Marks the declaration
  // as having been reflected on at least once.
  const recordReflected = useCallback((id) => {
    setReflectedSet(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem(REFLECTED_KEY, JSON.stringify([...next])); } catch {}
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

  // Open a single declaration in focused practice mode (the new 4-step UI).
  const openFocus = (decl) => {
    const next = new URLSearchParams(searchParams);
    next.set('focus', decl.id);
    setSearchParams(next, { replace: false });
  };

  // Filtered list
  let filtered = DECLARATIONS;
  if (showFavOnly)         filtered = filtered.filter(d => favs.includes(d.id));
  if (pillarFilter !== 'all') filtered = filtered.filter(d => d.pillar === pillarFilter);

  const memorizedCount = memorized.length;
  const favCount = favs.length;

  // Derived progress counts for the bar
  const spokenTodayCount = Object.keys(spokenToday).length;
  const recalledCount = Object.values(recallResults).filter(r => r?.passed).length;
  const reflectedCount = reflectedSet.size;

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

        {/* ── Sub-action bar (page title is in Layout's UniversalHeader) ── */}
        <div className="sticky top-14 z-30 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">
              {recalledCount > 0 ? `${recalledCount} recalled · ` : ''}{DECLARATIONS.length} declarations
            </p>
            <button onClick={startDeclareAll}
              className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white rounded-xl px-3 py-1.5 hover:opacity-90 transition-opacity">
              <Mic className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Declare All</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-5 space-y-5">

          {/* ── Focused practice mode ──
              When ?focus=<id> is in the URL, render a focused single-
              declaration practice surface INSTEAD of the normal list view.
              Used by coaching plans deep-linking to a specific declaration.
              The user can dismiss the focus mode (X button or the close
              callback) to return to the normal page. */}
          {focusedDecl && (
            <>
              <button
                onClick={closeFocus}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#0A1A2F]/55 dark:text-white/55 hover:text-[#0A1A2F]/80 transition-colors min-h-[44px]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to all declarations
              </button>
              <FocusedPractice
                decl={focusedDecl}
                onClose={closeFocus}
                onSpoken={recordSpoken}
                onPassed={(id) => { recordRecallPass(id); recordReflected(id); }}
                isMemorized={memorized.includes(focusedDecl.id) || !!recallResults[focusedDecl.id]?.passed}
                isFav={favs.includes(focusedDecl.id)}
                onToggleFav={toggleFav}
              />
            </>
          )}

          {/* ── Default landing (only when not in focus mode) ── */}
          {!focusedDecl && (
            <>
              {/* Explainer card — shown until dismissed */}
              {explainerOpen && <ExplainerCard onDismiss={dismissExplainer} />}

              {/* Progress bar — meaningful counts of practice */}
              <ProgressBar
                spokenTodayCount={spokenTodayCount}
                reflectedCount={reflectedCount}
                recalledCount={recalledCount}
                total={DECLARATIONS.length}
              />

          {/* ── Today's featured declaration ─────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest">Today's Declaration</p>
            </div>
            <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-3xl p-6 shadow-lg dark:shadow-none border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 relative overflow-hidden">
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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[#0A1A2F] dark:text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    style={{ background: todayPillar?.color || '#FAD98D' }}>
                    <Mic className="w-3.5 h-3.5" />
                    Declare now
                  </button>
                  <button onClick={() => toggleFav(today.id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      favs.includes(today.id)
                        ? 'bg-amber-50 dark:bg-amber-900/200/20 border-amber-500/30 text-amber-400'
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
            className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: DECLARATIONS.length, label: 'Total',     sub: 'declarations', color: '#FAD98D' },
              { value: memorizedCount,       label: 'Memorized', sub: 'committed',    color: '#10b981' },
              { value: favCount,             label: 'Saved',     sub: 'favorites',    color: '#f59e0b' },
            ].map(({ value, label, sub, color }) => (
              <div key={label} className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] p-3.5 text-center">
                <p className="font-bold text-xl text-[#0A1A2F] dark:text-white dark:text-white" style={value > 0 ? { color } : {}}>{value}</p>
                <p className="text-xs font-bold text-[#0A1A2F] dark:text-white mt-0.5">{label}</p>
                <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35">{sub}</p>
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
                      : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8'
                  }`}>
                  <span>{p.emoji}</span>
                  {p.label}
                  <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
                    pillarFilter === p.id && !showFavOnly ? 'bg-white/20' : 'bg-[#F2F6FA] dark:bg-[#0A1A2F]'
                  }`}>
                    {p.id === 'all' ? DECLARATIONS.length : DECLARATIONS.filter(d => d.pillar === p.id).length}
                  </span>
                </button>
              ))}
              {/* Favorites toggle */}
              <button onClick={() => { setShowFavOnly(f => !f); setPillarFilter('all'); }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                  showFavOnly
                    ? 'bg-amber-50 dark:bg-amber-900/200 text-white border-amber-500'
                    : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-amber-300'
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
                  background: PILLAR_MAP[pillarFilter]?.color + '10' }}
              >
                <Mic className="w-3 h-3" />
                Declare all {pillarFilter} truths ({DECLARATIONS.filter(d => d.pillar === pillarFilter).length})
              </motion.button>
            )}
          </div>

          {/* ── Declaration cards ─────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15 mx-auto mb-3" />
              <p className="text-sm text-[#0A1A2F]/40 dark:text-white/40">No saved declarations yet</p>
              <p className="text-xs text-[#0A1A2F]/25 dark:text-white/25 mt-1">Tap the ⭐ on any card to save it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((decl, i) => (
                <DeclarationCard
                  key={decl.id}
                  decl={decl}
                  isFav={favs.includes(decl.id)}
                  isMemorized={memorized.includes(decl.id) || !!recallResults[decl.id]?.passed}
                  onToggleFav={toggleFav}
                  onDeclare={startDeclareSingle}
                  onPractice={openFocus}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* ── Cross-link to Growth Pathways ──
              Promoted visually — this is how users find the curriculum side
              of identity work (the 4-step Identity pathway lives there). */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to={createPageUrl('GrowthPathwaysPage')}
              className="block rounded-2xl p-4 transition-all group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fce7f3 100%)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
              }}>
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)' }} />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-amber-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-0.5">
                    Want guided structure?
                  </p>
                  <p className="font-bold text-sm text-[#0A1A2F] mb-0.5">Identity in Christ Pathway</p>
                  <p className="text-xs text-[#0A1A2F]/65">Step-by-step journey into your true identity</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-700 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>
            </>
          )}

        </div>
      </div>

      {/* ── Declaration Mode overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {declareMode && (
          <DeclarationMode
            declarations={declareMode.declarations}
            startIndex={declareMode.startIndex}
            onClose={() => setDeclareMode(null)}
            onSpoken={recordSpoken}
          />
        )}
      </AnimatePresence>
    </>
  );
}