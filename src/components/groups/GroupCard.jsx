import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lock, Globe } from 'lucide-react';

const CATEGORY_COLORS = {
  bible_study: 'from-[#c9a227] to-[#D9B878]',
  workout:     'from-[#0A1A2F] to-[#1a3a5c]',
  cooking:     'from-[#D9B878] to-[#FAD98D]',
  prayer:      'from-[#AFC7E3] to-[#3C4E53]',
  wellness:    'from-[#3C4E53] to-[#AFC7E3]',
  youth:       'from-[#c9a227] to-[#AFC7E3]',
  parents:     'from-[#D9B878] to-[#AFC7E3]',
  marriage:    'from-[#c9a227] to-[#0A1A2F]',
  other:       'from-[#3C4E53] to-[#D9B878]',
};

const CATEGORY_EMOJI = {
  bible_study: '📖', workout: '💪', cooking: '🍳', prayer: '🙏',
  wellness: '🧘', youth: '👥', parents: '👨‍👩‍👧‍👦', marriage: '💑', other: '💬',
};

export default function GroupCard({ group, onClick, index, isMember }) {
  const gradient = CATEGORY_COLORS[group.category] || CATEGORY_COLORS.other;
  const emoji    = CATEGORY_EMOJI[group.category]  || '💬';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#D9B878]/25 hover:border-[#c9a227]/40 hover:shadow-md transition-all"
    >
      {/* Cover — image if present, gradient fallback */}
      <div className="relative h-24 overflow-hidden">
        {group.cover_image ? (
          <img
            src={group.cover_image}
            alt={group.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-3xl opacity-60">{emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          {group.is_private
            ? <Lock className="w-3.5 h-3.5 text-white/80" />
            : <Globe className="w-3.5 h-3.5 text-white/80" />}
        </div>
        {isMember && (
          <div className="absolute top-2.5 left-2.5 bg-[#c9a227] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Member
          </div>
        )}
      </div>

      <div className="p-3.5">
        <p className="font-bold text-[#0A1A2F] text-sm leading-tight mb-1">{group.name}</p>
        {group.description && (
          <p className="text-xs text-[#0A1A2F]/50 line-clamp-2 mb-2 leading-relaxed">{group.description}</p>
        )}
        <div className="flex items-center gap-1 text-[10px] text-[#0A1A2F]/35">
          <Users className="w-3 h-3" />
          <span>{group.member_count || 0} {group.member_count === 1 ? 'member' : 'members'}</span>
        </div>
      </div>
    </motion.div>
  );
}
