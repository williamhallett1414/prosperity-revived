import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ChatbotAvatar3D from './ChatbotAvatar3D';

function SpeakingDots({ isSpeaking }) {
  if (!isSpeaking) return null;
  return (
    <span className="flex items-end gap-0.5 h-3 ml-1.5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-white"
          style={{ opacity: 0.85 }}
          animate={{ height: ['4px', '10px', '4px'] }}
          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

/**
 * AvatarPanel — collapsible 3D avatar strip shown inside each chatbot.
 *
 * Props:
 *   character     'hannah' | 'coach' | 'chef' | 'gideon'
 *   isSpeaking    boolean
 *   isListening   boolean
 *   name          string
 *   subtitle      string
 *   gradientFrom  hex color string e.g. '#AFC7E3'
 *   gradientTo    hex color string e.g. '#3C4E53'
 */
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

  const statusLabel = isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Online';
  const statusBg    = isSpeaking ? gradientTo + '22' : isListening ? '#dcfce7' : '#f1f5f9';
  const statusColor = isSpeaking ? gradientTo        : isListening ? '#16a34a' : '#64748b';

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
      {/* Clickable header row */}
      <div
        role="button"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-between px-4 py-2 cursor-pointer select-none"
        style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
      >
        <div className="flex items-center">
          <span className="text-white text-xs font-semibold tracking-wide">{name}</span>
          <SpeakingDots isSpeaking={isSpeaking} />
          {isListening && !isSpeaking && (
            <span className="text-white/70 text-[10px] italic ml-2">listening…</span>
          )}
        </div>
        <span className="text-white/60 hover:text-white transition-colors">
          {collapsed
            ? <ChevronDown className="w-3.5 h-3.5" />
            : <ChevronUp className="w-3.5 h-3.5" />
          }
        </span>
      </div>

      {/* Collapsible avatar body */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="avatar-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="flex items-center py-4 px-5"
              style={{ background: `linear-gradient(160deg, ${gradientFrom}18, ${gradientTo}30)` }}
            >
              {/* 3D avatar with glow when speaking */}
              <div
                className="relative flex-shrink-0"
                style={{
                  filter: isSpeaking ? `drop-shadow(0 0 16px ${gradientTo}99)` : 'none',
                  transition: 'filter 0.35s ease',
                }}
              >
                <ChatbotAvatar3D
                  character={character}
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  size={110}
                />
                {/* Listening pulse ring */}
                {isListening && !isSpeaking && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ border: `2px solid ${gradientTo}`, borderRadius: '50%' }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.2, 0.7] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Name, role, status */}
              <div className="ml-4 flex flex-col gap-1.5">
                <span className="text-sm font-bold" style={{ color: gradientTo }}>
                  {name}
                </span>
                <span className="text-xs text-gray-500">{subtitle}</span>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full w-fit"
                  style={{ background: statusBg, color: statusColor }}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
