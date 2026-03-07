import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Loader2, Sparkles, Check } from 'lucide-react';

// ─── Pre-built templates (2-tap creation) ────────────────────────────────────
const TEMPLATES = [
  {
    title: '21-Day Prayer Streak',
    description: 'Commit to 5 minutes of prayer every day for 21 days.',
    challenge_type: 'prayer', type: 'prayer',
    duration_days: 21, goal_value: 5, goal_unit: 'minutes',
    reward_points: 210,
    daily_prompts: [
      { day: 1,  prompt: "Start simple — tell God one thing you're grateful for and one thing you need help with." },
      { day: 7,  prompt: "One week in. Thank God for your consistency and ask Him to deepen this habit." },
      { day: 14, prompt: "Halfway there. How has your prayer life shifted in the last two weeks?" },
      { day: 21, prompt: "Final day. Write a prayer of thanksgiving for who you are becoming." },
    ],
  },
  {
    title: '30-Day Gratitude Journal',
    description: 'Write 3 genuine things you\'re thankful for every day for 30 days.',
    challenge_type: 'reading', type: 'reading',
    duration_days: 30, goal_value: 3, goal_unit: 'entries',
    reward_points: 300,
    daily_prompts: [
      { day: 1,  prompt: "Write 3 specific things you're grateful for — be concrete, not generic." },
      { day: 10, prompt: "Write about a person in your life you're grateful for. What have they given you?" },
      { day: 30, prompt: "What has shifted in you over 30 days of gratitude? Write freely." },
    ],
  },
  {
    title: '14-Day Morning Devotional',
    description: 'Start every morning with 10 minutes of Scripture before touching your phone.',
    challenge_type: 'prayer', type: 'prayer',
    duration_days: 14, goal_value: 10, goal_unit: 'minutes',
    reward_points: 140,
    daily_prompts: [
      { day: 1,  prompt: "Read Psalm 5:3. What does it mean to bring your requests before God in the morning?" },
      { day: 7,  prompt: "One week in. Is this getting easier or harder? What does that tell you?" },
      { day: 14, prompt: "Last morning. How has starting your day differently changed the rest of your day?" },
    ],
  },
  {
    title: '7-Day Digital Detox',
    description: 'Limit social media to 15 minutes or less per day for one week.',
    challenge_type: 'meditation', type: 'meditation',
    duration_days: 7, goal_value: 15, goal_unit: 'min max',
    reward_points: 70,
    daily_prompts: [
      { day: 1, prompt: "Delete the apps from your home screen. How did it feel?" },
      { day: 4, prompt: "What have you done with the time you've reclaimed?" },
      { day: 7, prompt: "What do you want to carry forward? What do you want to leave behind?" },
    ],
  },
  {
    title: '21-Day Acts of Service',
    description: 'One intentional act of kindness every day for 21 days.',
    challenge_type: 'custom', type: 'custom',
    duration_days: 21, goal_value: 1, goal_unit: 'act per day',
    reward_points: 210,
    daily_prompts: [
      { day: 1,  prompt: "Start close — do something kind for someone you see every day." },
      { day: 7,  prompt: "Serve a stranger today. Someone you'll never see again." },
      { day: 21, prompt: "Which act of service surprised you the most — in terms of what it did for you?" },
    ],
  },
  {
    title: '30-Day Fitness Commitment',
    description: 'Move your body intentionally for at least 20 minutes every day.',
    challenge_type: 'workouts', type: 'workouts',
    duration_days: 30, goal_value: 20, goal_unit: 'minutes',
    reward_points: 300,
    daily_prompts: [
      { day: 1,  prompt: "Today is about showing up, not performance. What does your body need right now?" },
      { day: 15, prompt: "Halfway! How do you feel compared to day 1?" },
      { day: 30, prompt: "You did it. What does this 30 days prove to you about yourself?" },
    ],
  },
];

const TYPE_STYLES = {
  prayer:      { emoji: '🙏', gradient: 'from-violet-500 to-purple-400',  bg: 'bg-violet-50 text-violet-700'  },
  reading:     { emoji: '📝', gradient: 'from-amber-500 to-yellow-400',   bg: 'bg-amber-50 text-amber-700'    },
  workouts:    { emoji: '💪', gradient: 'from-blue-600 to-sky-400',       bg: 'bg-blue-50 text-blue-700'      },
  meditation:  { emoji: '📵', gradient: 'from-slate-600 to-slate-400',    bg: 'bg-slate-50 text-slate-700'    },
  water_intake:{ emoji: '🥗', gradient: 'from-green-600 to-lime-400',     bg: 'bg-green-50 text-green-700'    },
  custom:      { emoji: '🤝', gradient: 'from-emerald-600 to-teal-400',   bg: 'bg-emerald-50 text-emerald-700'},
};

export default function CreateChallengeModal({ isOpen, onClose, onSubmit, groupId = null }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!selected) return;
    setLoading(true);
    const today   = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + selected.duration_days);

    await onSubmit({
      ...selected,
      start_date:        today.toISOString().split('T')[0],
      end_date:          endDate.toISOString().split('T')[0],
      group_id:          groupId,
      status:            'active',
      is_active:         true,
      participant_count: 0,
      is_public:         !groupId,
    });
    setSelected(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FAD98D]" />
            <h2 className="font-bold text-white">New Challenge</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <p className="text-xs text-[#0A1A2F]/45 px-5 pt-4 pb-2 font-medium">Choose a template to get started:</p>

        {/* Template list */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-2">
          {TEMPLATES.map((t, i) => {
            const style   = TYPE_STYLES[t.challenge_type] || TYPE_STYLES.custom;
            const isChosen = selected?.title === t.title;
            return (
              <motion.button
                key={i}
                onClick={() => setSelected(isChosen ? null : t)}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                  isChosen
                    ? 'border-[#c9a227] bg-white shadow-sm'
                    : 'border-[#F2F6FA] bg-white hover:border-[#FAD98D]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{style.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#0A1A2F] leading-snug">{t.title}</p>
                      {isChosen && <Check className="w-4 h-4 text-[#c9a227] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[#0A1A2F]/45 leading-relaxed mt-0.5">{t.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${style.bg}`}>
                        {t.duration_days} days
                      </span>
                      <span className="text-[9px] text-[#0A1A2F]/30">{t.reward_points} pts</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[#F2F6FA] px-5 py-4 flex gap-3 bg-white flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#F2F6FA] text-[#0A1A2F]/50 font-semibold text-sm">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={!selected || loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Creating…' : 'Launch Challenge'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
