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

export default function StudyGuideCard({ guide, onClick, index }) {
  const t = T_COLORS[guide.testament || 'ot'];
  const emoji = BOOK_ICONS[guide.id] || '📖';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.035, type: 'spring', stiffness: 320, damping: 26 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group w-full text-left rounded-2xl overflow-hidden transition-all duration-300 bg-gradient-to-br ${t.bg} border border-white/8 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-md`}
    >
      <div className="relative p-4">
        {/* Glow dot */}
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-[0.07]"
          style={{ background: `radial-gradient(circle, ${t.accent}, transparent)` }} />

        <div className="flex items-start gap-3 relative">
          {/* Emoji badge */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: `${t.accent}18`, border: `1px solid ${t.accent}22` }}>
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
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
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#0A1A2F]/35 dark:text-white/30">
                  <BookOpen className="w-3 h-3" /> {guide.chapters} ch
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                  style={{ background: `${t.accent}12`, color: t.accent }}>
                  {(guide.testament || 'ot') === 'ot' ? 'OT' : 'NT'}
                </span>
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-bold group-hover:translate-x-0.5 transition-transform"
                style={{ color: t.accent }}>
                Study <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
