import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ChatbotAvatar3D from './ChatbotAvatar3D';

// ─── 12-bar audio waveform ────────────────────────────────────────────────────
function SpeakingWave({ active }) {
  const bars = [5, 9, 7, 13, 8, 12, 6, 10, 14, 7, 11, 5];
  return (
    <span className="flex items-end gap-[2px] ml-2" style={{ height: 14 }}>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          style={{ width: 2, borderRadius: 2, background: 'rgba(255,255,255,0.88)' }}
          animate={
            active
              ? { height: [`${h * 0.45}px`, `${h}px`, `${h * 0.45}px`] }
              : { height: '3px', opacity: 0.22 }
          }
          transition={
            active
              ? { duration: 0.48 + i * 0.04, repeat: Infinity, delay: i * 0.055, ease: 'easeInOut' }
              : { duration: 0.25 }
          }
        />
      ))}
    </span>
  );
}

// ─── State badge ──────────────────────────────────────────────────────────────
function StateBadge({ state, color }) {
  const cfg = {
    speaking:  { label: 'Speaking',  icon: '🔊', bg: `${color}2a`, border: `${color}55`, text: color },
    listening: { label: 'Listening', icon: '👂', bg: '#86efac28', border: '#86efac55', text: '#86efac' },
    idle:      { label: 'Online',    icon: '●',  bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.18)', text: 'rgba(255,255,255,0.60)' },
  };
  const s = cfg[state] || cfg.idle;
  return (
    <motion.span
      layout
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
      animate={{ scale: state === 'speaking' ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 0.75, repeat: state === 'speaking' ? Infinity : 0, ease: 'easeInOut' }}
    >
      <span style={{ fontSize: 9 }}>{s.icon}</span>
      <span>{s.label}</span>
    </motion.span>
  );
}

// ─── Pulse ring (listen indicator on card edge) ───────────────────────────────
function ListenPulse({ active, color }) {
  if (!active) return null;
  return (
    <>
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ border: `2px solid ${color}`, borderRadius: 12 }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.04 + i * 0.04, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function AvatarPanel({
  character,
  isSpeaking,
  isListening,
  name,
  subtitle,
  gradientFrom,
  gradientTo,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';

  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.09)' }}>

      {/* ── Gradient header strip — always visible ── */}
      <div
        role="button"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer select-none"
        style={{ background: `linear-gradient(130deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
      >
        <div className="flex items-center min-w-0">
          <span className="text-white text-[11px] font-extrabold tracking-[0.13em] uppercase">{name}</span>
          {isSpeaking && <SpeakingWave active />}
          {isListening && !isSpeaking && (
            <motion.span
              className="text-white/65 text-[10px] italic ml-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              listening…
            </motion.span>
          )}
        </div>
        <motion.div
          className="text-white/60 hover:text-white transition-colors ml-2 flex-shrink-0"
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </div>

      {/* ── Collapsible full-body avatar panel ── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="av"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="relative"
              style={{
                background: `linear-gradient(170deg, ${gradientFrom}18 0%, ${gradientTo}30 100%)`,
              }}
            >
              <ListenPulse active={isListening && !isSpeaking} color={gradientTo} />

              {/* Full-body avatar — full width, tall card */}
              <div className="relative flex justify-center" style={{ height: 260 }}>
                {/* Ambient glow behind avatar */}
                <motion.div
                  className="absolute bottom-0 left-1/2 pointer-events-none"
                  style={{
                    transform: 'translateX(-50%)',
                    width: 160,
                    height: 80,
                    borderRadius: '50%',
                    background: gradientTo,
                    filter: 'blur(32px)',
                    opacity: 0,
                  }}
                  animate={{ opacity: isSpeaking ? 0.35 : isListening ? 0.18 : 0.10 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Speaking ring around whole panel */}
                {isSpeaking && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 pointer-events-none"
                    style={{
                      height: 3,
                      background: `linear-gradient(90deg, transparent, ${gradientTo}, transparent)`,
                    }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}

                <ChatbotAvatar3D
                  character={character}
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  width={220}
                  height={260}
                />
              </div>

              {/* Name + status row below avatar */}
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                <div>
                  <p className="text-sm font-bold leading-tight" style={{ color: gradientTo }}>
                    {name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
                </div>
                <StateBadge state={state} color={gradientTo} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}