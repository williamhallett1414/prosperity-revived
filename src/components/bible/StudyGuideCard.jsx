import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';

const BOOK_ICONS = {
  genesis:'🌍',exodus:'🔥',leviticus:'⛪',numbers:'🏜️',deuteronomy:'📜',
  joshua:'⚔️',judges:'⚖️',ruth:'🌾','1samuel':'👑','2samuel':'🏰',
  '1kings':'👑','2kings':'🔱','1chronicles':'📋','2chronicles':'🏛️',
  ezra:'🔨',nehemiah:'🧱',esther:'👸',job:'🙏',psalms:'🎵',
  proverbs:'💡',ecclesiastes:'🤔',songofsolomon:'❤️',isaiah:'🕊️',
  jeremiah:'😢',lamentations:'💔',ezekiel:'👁️',daniel:'🦁',
  hosea:'💕',joel:'🦗',amos:'⚡',obadiah:'⛰️',jonah:'🐋',
  micah:'🌟',nahum:'🌊',habakkuk:'🗼',zephaniah:'🔥',haggai:'🏗️',
  zechariah:'🐴',malachi:'✉️',
  matthew:'📖',mark:'🏃',luke:'🩺',john:'✝️',acts:'🌍',
  romans:'⚖️','1corinthians':'💌','2corinthians':'💪',galatians:'🕊️',
  ephesians:'⛪',philippians:'😊',colossians:'👑','1thessalonians':'☁️',
  '2thessalonians':'⏳','1timothy':'🎓','2timothy':'🔥',titus:'🏝️',
  philemon:'🤝',hebrews:'🏔️',james:'💎','1peter':'🪨','2peter':'🌅',
  '1john':'❤️','2john':'💌','3john':'🤗',jude:'🛡️',revelation:'🌈',
};

const T_COLORS = {
  ot: { accent: '#FBBF24', label: 'Old Testament', bg: 'from-amber-900/15 to-amber-800/5' },
  nt: { accent: '#60A5FA', label: 'New Testament', bg: 'from-blue-900/15 to-blue-800/5' },
};

export default function StudyGuideCard({ guide, imageUrl, onClick, index }) {
  const t = T_COLORS[guide.testament || 'ot'];
  const emoji = BOOK_ICONS[guide.id] || '📖';

  // Show the Recraft image when we have it, otherwise the brand-aligned
  // emoji badge. We intentionally do NOT fall back to guide.image (legacy
  // Unsplash stock) — those photos pre-date the Recraft work and were the
  // source of the flash bug. The emoji badge is always available and
  // visually intentional, so it covers both "loading" and "generation
  // hasn't run yet" cases without any flash.
  const cover = imageUrl;
  const showEmoji = !cover;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.035, type: 'spring', stiffness: 320, damping: 26 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 bg-gradient-to-br ${t.bg} border border-white/8 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-md`}
    >
      {/* Large cover image at the top (falls back to emoji badge while generating) */}
      <div className="relative w-full h-32 overflow-hidden">
        {cover && !showEmoji ? (
          <img src={cover} alt="" loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: `linear-gradient(135deg, ${t.accent}22, ${t.accent}08)` }}>
            {emoji}
          </div>
        )}
        {/* Bottom fade for text legibility of the badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="absolute top-2.5 right-2.5 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full backdrop-blur-sm"
          style={{ background: `${t.accent}dd`, color: '#fff' }}>
          {(guide.testament || 'ot') === 'ot' ? 'OT' : 'NT'}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-[#0A1A2F] dark:text-white text-sm leading-tight mb-0.5 truncate">
          {guide.title.replace(/:.+/, '')}
        </h3>
        <p className="text-[10px] font-medium mb-1.5 truncate" style={{ color: t.accent }}>
          {guide.subtitle}
        </p>
        <p className="text-[11px] text-[#0A1A2F]/50 dark:text-white/45 line-clamp-2 leading-relaxed mb-2.5">
          {guide.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#0A1A2F]/35 dark:text-white/30">
            <BookOpen className="w-3 h-3" /> {guide.chapters} ch
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold group-hover:translate-x-0.5 transition-transform"
            style={{ color: t.accent }}>
            Study <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}