import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, RefreshCw, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';
import GideonReadAloud from '@/components/bible/GideonReadAloud';

// ─── 28 affirmations — full 4-week rotation ────────────────────────────────
const AFFIRMATIONS = [
  {
    text: "I am fearfully and wonderfully made",
    verse: "Psalm 139:14",
    fullVerse: "I will give thanks to you, for I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
    explanation: "You are not an accident or an afterthought. God crafted every detail of who you are with intention and delight. Your uniqueness is not a flaw — it is the signature of your Maker."
  },
  {
    text: "I can do all things through Christ who strengthens me",
    verse: "Philippians 4:13",
    fullVerse: "I can do all things through Christ, who strengthens me.",
    explanation: "The strength you need is not your own to manufacture. Christ is the source, and He gives freely. What feels impossible today is possible in Him."
  },
  {
    text: "God has plans to prosper me and give me hope",
    verse: "Jeremiah 29:11",
    fullVerse: "For I know the thoughts that I think toward you, declares the Lord, thoughts of peace, and not of evil, plans to give you hope and a future.",
    explanation: "Even in uncertainty, God is not improvising. His plans for you are good, purposeful, and forward-looking. Hope is not wishful thinking — it's grounded in His promise."
  },
  {
    text: "I am more than a conqueror through Christ",
    verse: "Romans 8:37",
    fullVerse: "No, in all these things we are more than conquerors through him who loved us.",
    explanation: "You don't just survive — you overcome. Every trial, every hardship, every opposition — you are equipped not just to endure but to triumph through the love of Christ."
  },
  {
    text: "The Lord is my strength and my shield",
    verse: "Psalm 28:7",
    fullVerse: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
    explanation: "You don't have to defend yourself or generate your own courage. God stands between you and what threatens you, and He fortifies you from within."
  },
  {
    text: "I am chosen, holy, and dearly loved",
    verse: "Colossians 3:12",
    fullVerse: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
    explanation: "Your identity is not based on your performance. God chose you, set you apart, and loves you deeply — not because of what you do, but because of who He is."
  },
  {
    text: "Perfect love casts out all fear",
    verse: "1 John 4:18",
    fullVerse: "There is no fear in love. But perfect love drives out fear.",
    explanation: "Anxiety and fear lose their grip when you are rooted in the love of God. You don't have to fear rejection, failure, or the unknown — perfect love has made you secure."
  },
  {
    text: "I am a new creation in Christ",
    verse: "2 Corinthians 5:17",
    fullVerse: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    explanation: "Your past does not define your future. In Christ, the old you — with its shame, patterns, and regrets — has been replaced. You are genuinely, completely new."
  },
  {
    text: "I am the light of the world",
    verse: "Matthew 5:14",
    fullVerse: "You are the light of the world. A town built on a hill cannot be hidden.",
    explanation: "God placed you where you are on purpose. Your life, your presence, your witness — they matter. You carry light into every room and relationship you enter."
  },
  {
    text: "God's grace is sufficient for me",
    verse: "2 Corinthians 12:9",
    fullVerse: "My grace is sufficient for you, for my power is made perfect in weakness.",
    explanation: "Your weakness is not disqualifying — it is the very place where God's power shows up most clearly. You don't need to have it all together. His grace covers every gap."
  },
  {
    text: "I have not been given a spirit of fear",
    verse: "2 Timothy 1:7",
    fullVerse: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
    explanation: "Fear is not your inheritance. God has given you power to act, love to connect, and a sound mind to navigate life. You are equipped, not paralyzed."
  },
  {
    text: "I am rooted and built up in Christ",
    verse: "Colossians 2:7",
    fullVerse: "Rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.",
    explanation: "A rooted tree doesn't topple in the storm. When you are anchored in Christ, the pressures of life cannot uproot you — they only deepen the roots further."
  },
  {
    text: "God will meet all my needs",
    verse: "Philippians 4:19",
    fullVerse: "And my God will meet all your needs according to the riches of his glory in Christ Jesus.",
    explanation: "You don't have to anxiously strive for what you need. God has unlimited resources and He knows what you require before you ask. Trust Him as your provider."
  },
  {
    text: "I am clothed with strength and dignity",
    verse: "Proverbs 31:25",
    fullVerse: "She is clothed with strength and dignity; she can laugh at the days to come.",
    explanation: "Strength and dignity are already part of who you are in God. You can face the future with confidence, not dread — because you know who holds it."
  },
  {
    text: "The peace of God guards my heart and mind",
    verse: "Philippians 4:7",
    fullVerse: "And the peace of God, which transcends all understanding, will guard your heart and your mind in Christ Jesus.",
    explanation: "God's peace is not the absence of trouble — it's a supernatural calm that exists in the middle of trouble. It doesn't make sense by human logic, and it doesn't need to."
  },
  {
    text: "I am God's handiwork, created for good works",
    verse: "Ephesians 2:10",
    fullVerse: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared before that we would walk in them.",
    explanation: "You are not here by chance. God prepared specific works for you before you were born. Your life has a divine assignment — lean into it."
  },
  {
    text: "I have been redeemed and forgiven",
    verse: "Colossians 1:14",
    fullVerse: "In whom we have our redemption, the forgiveness of our sins.",
    explanation: "Your failures and shortcomings do not have the final word. You have been bought back, restored, and fully forgiven. Walk in that freedom today."
  },
  {
    text: "I am held in God's right hand",
    verse: "Isaiah 41:10",
    fullVerse: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    explanation: "You are not navigating life alone. God is with you, strengthening you, and literally holding you up. You cannot fall beyond His reach."
  },
  {
    text: "Nothing can separate me from God's love",
    verse: "Romans 8:38–39",
    fullVerse: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers... will be able to separate us from the love of God.",
    explanation: "There is no circumstance, no failure, no spiritual force that can cut you off from God's love. It is the most stable thing in the universe — completely unconditional."
  },
  {
    text: "I walk in the Spirit, not in the flesh",
    verse: "Galatians 5:16",
    fullVerse: "So I say, walk by the Spirit, and you will not gratify the desires of the flesh.",
    explanation: "You have been given a new nature and a new power source. The Spirit in you is greater than every old habit or impulse. You have the ability to walk in freedom."
  },
  {
    text: "I have the mind of Christ",
    verse: "1 Corinthians 2:16",
    fullVerse: "For who has known the mind of the Lord so as to instruct him? But we have the mind of Christ.",
    explanation: "You have access to divine wisdom. You don't have to think like the world or be limited by conventional understanding. Christ's clarity and perspective are available to you."
  },
  {
    text: "My body is a temple of the Holy Spirit",
    verse: "1 Corinthians 6:19",
    fullVerse: "Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God?",
    explanation: "God himself dwells in you. That means how you treat your body, your thoughts, and your health matters spiritually. You are set apart and filled with holiness."
  },
  {
    text: "I am an ambassador of Christ",
    verse: "2 Corinthians 5:20",
    fullVerse: "We are therefore Christ's ambassadors, as though God were making his appeal through us.",
    explanation: "You represent the Kingdom of God wherever you go. Every interaction you have is an opportunity for God to speak through you. Your life is a message."
  },
  {
    text: "I will not grow weary in doing good",
    verse: "Galatians 6:9",
    fullVerse: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
    explanation: "Faithfulness is worth it even when results are invisible. God sees every act of obedience, every quiet sacrifice. A harvest is coming — don't quit before it arrives."
  },
  {
    text: "I am sealed with the Holy Spirit",
    verse: "Ephesians 1:13",
    fullVerse: "You also were included in Christ when you heard the message of truth... Having believed, you were marked in him with a seal, the promised Holy Spirit.",
    explanation: "You are marked, guaranteed, and secured by God himself. The Holy Spirit in you is His promise that He will finish what He started in your life."
  },
  {
    text: "God causes all things to work together for my good",
    verse: "Romans 8:28",
    fullVerse: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    explanation: "Nothing in your story is wasted — not the painful chapters, not the detours, not the failures. God is an expert at turning what seems broken into something beautiful."
  },
  {
    text: "I have been given every spiritual blessing",
    verse: "Ephesians 1:3",
    fullVerse: "Praise be to the God and Father of our Lord Jesus Christ, who has blessed us in the heavenly realms with every spiritual blessing in Christ.",
    explanation: "You are not spiritually impoverished. Everything you need to live a godly, fruitful, and purposeful life has already been given to you in Christ. You lack nothing."
  },
  {
    text: "The joy of the Lord is my strength",
    verse: "Nehemiah 8:10",
    fullVerse: "Do not grieve, for the joy of the Lord is your strength.",
    explanation: "Joy is not dependent on circumstances — it is a gift from God that fuels your endurance. When everything around you is shaking, this deep joy holds you together."
  },
];

export default function AffirmationsPage() {
  const navigate = useNavigate();
  const todayIndex = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  ) % AFFIRMATIONS.length;

  const [currentIndex, setCurrentIndex] = useState(todayIndex);
  const [savedIds,      setSavedIds]     = useState(new Set());
  const [user,          setUser]          = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const [saving,        setSaving]       = useState(false);
  const [expanded,      setExpanded]     = useState(false);
  const [showAll,       setShowAll]      = useState(false);

  const current = AFFIRMATIONS[currentIndex];

  // Load existing bookmarks to mark already-saved affirmations
  const { data: bookmarks = [] } = useQuery({
    queryKey: ['affirmationBookmarks'],
    queryFn: () => base44.entities.Bookmark.filter({ book: 'Affirmation' }),
    onSuccess: (data) => {
      const verses = new Set(data.map(b => b.verse_text?.split(' - ')[0]));
      setSavedIds(verses);
    },
  });

  // Sync savedIds when bookmarks load
  useEffect(() => {
    if (bookmarks.length) {
      const verses = new Set(bookmarks.map(b => b.verse_text?.split(' - ')[0]));
      setSavedIds(verses);
    }
  }, [bookmarks]);

  const isSaved = savedIds.has(current.text);

  const handleShuffle = () => {
    setExpanded(false);
    let next;
    do { next = Math.floor(Math.random() * AFFIRMATIONS.length); }
    while (next === currentIndex && AFFIRMATIONS.length > 1);
    setCurrentIndex(next);
  };

  const handleSave = async () => {
    if (isSaved || saving) return;
    setSaving(true);
    try {
      await base44.entities.Bookmark.create({
        book: 'Affirmation',
        chapter: 1,
        verse: currentIndex + 1,
        verse_text: `${current.text} - ${current.verse}`,
        note: current.fullVerse,
        highlight_color: 'yellow',
      });
      setSavedIds(prev => new Set([...prev, current.text]));
      toast.success('Saved to favorites!');
    } catch {
      toast.error('Failed to save');
    }
    setSaving(false);
  };


  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/20 hover:bg-[#AFC7E3]/30 flex items-center justify-center transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Scripture Affirmations</h1>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Speak truth over yourself daily</p>
          </div>
          <button onClick={handleShuffle}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/20 hover:bg-[#AFC7E3]/30 flex items-center justify-center transition-colors flex-shrink-0"
            title="Show a different affirmation">
            <RefreshCw className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* ── Featured card ── */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="bg-gradient-to-br from-[#AFC7E3]/25 to-[#FAD98D]/20 rounded-2xl border border-[#AFC7E3]/30 overflow-hidden">

            {/* Label pill */}
            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#AFC7E3]" />
              <span className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">
                {currentIndex === todayIndex ? "Today's Affirmation" : "Affirmation"}
              </span>
            </div>

            {/* Affirmation text */}
            <div className="px-5 py-4">
              <p className="text-xl font-bold text-[#0A1A2F] dark:text-white leading-snug italic mb-3">
                "{current.text}"
              </p>
              <p className="text-xs font-semibold text-[#c9a227]">{current.verse}</p>
            </div>

            {/* Full verse */}
            <div className="mx-5 mb-4 bg-white/70 rounded-xl p-4 border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5">
              <p className="text-sm text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed italic">
                {current.fullVerse}
              </p>
            </div>

            {/* Explanation (expandable) */}
            <button onClick={() => setExpanded(e => !e)}
              className="w-full flex items-center justify-between px-5 py-3 border-t border-[#AFC7E3]/20 text-xs font-semibold text-[#0A1A2F]/50 dark:text-white/50 hover:text-[#0A1A2F]/70 dark:text-white/70 transition-colors">
              <span>{expanded ? 'Hide reflection' : 'Read reflection'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed">
                    {current.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* ── Action row ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 pt-1">
          <GideonReadAloud text={`${current.text}. ${current.fullVerse}`} label="Listen" />
          <button onClick={handleShuffle}
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-white/5 border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 text-[#0A1A2F] dark:text-white hover:bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8 hover:border-[#FAD98D]/50 dark:border-[#FAD98D]/20 active:scale-95 transition-all duration-200 shadow-sm dark:shadow-none">
            <RefreshCw className="w-3.5 h-3.5" />
            New
          </button>
          <button onClick={handleSave} disabled={isSaved || saving}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              isSaved
                ? 'bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 border border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 text-[#c9a227] shadow-sm dark:shadow-none'
                : 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white shadow-md dark:shadow-none hover:shadow-lg dark:shadow-none active:scale-98'
            }`}>
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#c9a227]' : ''}`} />
            {isSaved ? 'Saved' : saving ? 'Saving…' : 'Save'}
          </button>
          <ShareToFeedButton
            type="spiritual_insight"
            title="Today's affirmation 🌟"
            content={`"${current.text}" — ${current.verse}\n\nSpoke this truth over myself today on Prosperity Revived.`}
            source="Hannah"
            variant="icon"
            color="#C9A227"
            user={user}
          />
        </motion.div>

        {/* ── All affirmations ── */}
        <div>
          <button onClick={() => setShowAll(s => !s)}
            className="w-full flex items-center justify-between py-3 text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest hover:text-[#0A1A2F]/60 dark:text-white/60 transition-colors">
            <span>All Affirmations ({AFFIRMATIONS.length})</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {showAll && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="space-y-2 pb-2">
                  {AFFIRMATIONS.map((a, i) => (
                    <button key={i} onClick={() => { setCurrentIndex(i); setExpanded(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-full text-left rounded-2xl p-4 border transition-all ${
                        i === currentIndex
                          ? 'bg-gradient-to-r from-[#AFC7E3]/25 to-[#FAD98D]/15 border-[#AFC7E3]/40'
                          : 'bg-white dark:bg-white/5 border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:border-[#AFC7E3]/40 hover:bg-[#F2F6FA] dark:bg-[#0A1A2F]'
                      }`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white leading-snug italic">
                            "{a.text}"
                          </p>
                          <p className="text-[11px] text-[#c9a227] font-semibold mt-1">{a.verse}</p>
                        </div>
                        {savedIds.has(a.text) && (
                          <Heart className="w-3.5 h-3.5 fill-[#c9a227] text-[#c9a227] flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}