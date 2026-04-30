import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, ChevronRight, Calendar } from 'lucide-react';

/**
 * AgeVerificationGate
 * Hard-blocks access until the user confirms they meet the minimum age requirement.
 * Must be shown BEFORE the main onboarding flow begins.
 *
 * Props:
 *   onVerified(ageGroup) — called when user passes (18plus or 13to17)
 */
export default function AgeVerificationGate({ onVerified }) {
  const [selected, setSelected] = useState('');
  const [blocked, setBlocked] = useState(false);

  const AGE_OPTIONS = [
    {
      id: 'under13',
      label: 'Under 13',
      emoji: '🚫',
      red: true,
      desc: 'Not eligible',
    },
    {
      id: '13to17',
      label: '13 – 17 years old',
      emoji: '👦',
      red: false,
      desc: 'Parental consent required',
    },
    {
      id: '18plus',
      label: '18 or older',
      emoji: '✅',
      red: false,
      desc: 'Full access',
    },
  ];

  const handleConfirm = () => {
    if (!selected) return;
    if (selected === 'under13') {
      setBlocked(true);
      return;
    }
    onVerified(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      style={{ background: 'linear-gradient(160deg, #0A1A2F 0%, #0f2744 60%, #0A1A2F 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(ellipse, #C9A227, transparent 70%)' }} />
        {[...Array(16)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white dark:bg-white/5"
            style={{ width: 2, height: 2, left: `${5 + (i * 14) % 88}%`, top: `${4 + (i * 19) % 82}%`, opacity: 0.04 + (i % 5) * 0.04 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Icon + heading */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(201,162,39,0.18)', border: '1px solid rgba(201,162,39,0.3)' }}>
            <Shield className="w-8 h-8 text-[#C9A227]" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Age Verification
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            To keep our community safe, please confirm your age before continuing.
          </p>
        </motion.div>

        {/* Blocked state */}
        <AnimatePresence>
          {blocked && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="mb-5 rounded-2xl p-4 flex gap-3 items-start"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-bold text-sm">Sorry — you must be at least 13</p>
                <p className="text-red-400/70 text-xs mt-1 leading-relaxed">
                  Prosperity Revived is not available to users under 13 in compliance with COPPA. Please close this app.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Age options */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="space-y-3 mb-6">
          {AGE_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => { setBlocked(false); setSelected(opt.id); }}
              className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                selected === opt.id
                  ? opt.red
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/200/10'
                    : 'border-[#C9A227] bg-[#C9A227]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}>
              <span className="text-xl flex-shrink-0">{opt.emoji}</span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${
                  selected === opt.id
                    ? opt.red ? 'text-red-300' : 'text-white'
                    : 'text-white/70'
                }`}>{opt.label}</p>
                <p className={`text-xs mt-0.5 ${
                  selected === opt.id
                    ? opt.red ? 'text-red-400/70' : 'text-[#C9A227]/70'
                    : 'text-white/35'
                }`}>{opt.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                selected === opt.id
                  ? opt.red ? 'border-red-400 bg-red-400' : 'border-[#C9A227] bg-[#C9A227]'
                  : 'border-white/20'
              }`}>
                {selected === opt.id && <div className="w-2 h-2 rounded-full bg-white dark:bg-white/5" />}
              </div>
            </button>
          ))}
        </motion.div>

        {/* 13–17 parental notice */}
        <AnimatePresence>
          {selected === '13to17' && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-5 rounded-2xl p-3 flex gap-2 items-start"
              style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300/80 text-xs leading-relaxed">
                <strong className="text-amber-300">Parental consent required.</strong> A parent or guardian must review and approve your use of this app before you proceed.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm button */}
        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
            selected && selected !== 'under13'
              ? 'text-white shadow-lg'
              : selected === 'under13'
              ? 'bg-red-50 dark:bg-red-900/200/20 text-red-400 cursor-not-allowed'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
          style={selected && selected !== 'under13' ? { background: 'linear-gradient(135deg, #C9A227, #FD9C2D)' } : {}}>
          {selected === 'under13' ? 'Access Not Permitted' : 'Confirm & Continue'}
          {selected && selected !== 'under13' && <ChevronRight className="w-4 h-4" />}
        </motion.button>

        <p className="text-center text-white/20 text-[10px] mt-4 leading-relaxed">
          By continuing you confirm that the age you selected above is accurate.
          Prosperity Revived complies with COPPA and applicable age-restriction laws.
        </p>
      </div>
    </motion.div>
  );
}