import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lock, Globe } from 'lucide-react';

const CATEGORY_COLORS = {
  bible_study: 'from-[#c9a227] to-[#FAD98D]',
  workout:     'from-[#0A1A2F] to-[#0A1A2F]',
  cooking:     'from-[#FAD98D] to-[#FAD98D]',
  prayer:      'from-[#AFC7E3] to-[#3C4E53]',
  wellness:    'from-[#3C4E53] to-[#AFC7E3]',
  youth:       'from-[#c9a227] to-[#AFC7E3]',
  parents:     'from-[#FAD98D] to-[#AFC7E3]',
  marriage:    'from-[#c9a227] to-[#0A1A2F]',
  other:       'from-[#3C4E53] to-[#FAD98D]',
};

const CATEGORY_EMOJI = {
  bible_study: '📖', workout: '💪', cooking: '🍳', prayer: '🙏',
  wellness: '🧘', youth: '👥', parents: '👨‍👩‍👧‍👦', marriage: '💑', other: '💬',
};

const CATEGORY_LABEL = {
  bible_study: 'Bible Study', workout: 'Workout', cooking: 'Cooking',
  prayer: 'Prayer', wellness: 'Wellness', youth: 'Youth',
  parents: 'Parents', marriage: 'Marriage', other: 'Community',
};

// Deterministic warm member-count colour
function getMemberColour(count) {
  if (count >= 150) return { bar: 'bg-[#c9a227]', text: 'text-[#c9a227]' };
  if (count >= 75)  return { bar: 'bg-[#AFC7E3]', text: 'text-[#3C4E53]' };
  return { bar: 'bg-[#F2F6FA] dark:bg-[#0A1A2F]', text: 'text-[#0A1A2F]/30 dark:text-white/30' };
}

export default function GroupCard({ group, onClick, index, isMember }) {
  const gradient = CATEGORY_COLORS[group.category] || CATEGORY_COLORS.other;
  const emoji    = CATEGORY_EMOJI[group.category]  || '💬';
  const label    = CATEGORY_LABEL[group.category]  || 'Community';
  const count    = group.member_count || 0;
  const mc       = getMemberColour(count);
  // Cap bar at 100% using 300 members as "full"
  const barPct   = Math.min(100, Math.round((count / 300) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#FAD98D]/20 hover:border-[#c9a227]/40 hover:shadow-md transition-all active:scale-[0.98]"
    >
      {/* Cover */}
      <div className="relative h-28 overflow-hidden">
        {group.cover_image ? (
          <img
            src={group.cover_image}
            alt={group.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-4xl opacity-50">{emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
          {isMember ? (
            <span className="bg-[#c9a227] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              ✓ Member
            </span>
          ) : (
            <span className="bg-black/25 backdrop-blur-sm text-white/80 text-[9px] font-semibold px-2 py-0.5 rounded-full">
              {label}
            </span>
          )}
          {group.is_private
            ? <Lock className="w-3 h-3 text-white/70" />
            : <Globe className="w-3 h-3 text-white/40" />}
        </div>

        {/* Bottom emoji when no image */}
        {!group.cover_image && (
          <div className="absolute bottom-2 right-2.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
            {label}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="font-bold text-[#0A1A2F] dark:text-white text-sm leading-snug mb-1 line-clamp-2">{group.name}</p>
        {group.description && (
          <p className="text-[11px] text-[#0A1A2F]/45 dark:text-white/45 line-clamp-2 mb-2.5 leading-relaxed">{group.description}</p>
        )}

        {/* Member count + bar */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[#0A1A2F]/30 dark:text-white/30" />
            <span className={`text-[10px] font-bold ${mc.text}`}>{count.toLocaleString()}</span>
            <span className="text-[10px] text-[#0A1A2F]/25 dark:text-white/25">{count === 1 ? 'member' : 'members'}</span>
          </div>
          <div className="h-1 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${mc.bar}`} style={{ width: `${barPct}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
