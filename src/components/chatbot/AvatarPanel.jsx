import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ChatbotAvatar3D from './ChatbotAvatar3D';

// ─── Audio waveform when speaking ────────────────────────────────────────────
function SpeakingWave({ active }) {
  const bars = [5,9,7,13,8,12,6,10,14,7,11,5];
  return (
    <span className="flex items-end gap-[2px] ml-2" style={{ height:14 }}>
      {bars.map((h,i) => (
        <motion.span
          key={i}
          style={{ width:2, borderRadius:2, background:'rgba(255,255,255,0.90)' }}
          animate={active
            ? { height:[`${h*0.45}px`,`${h}px`,`${h*0.45}px`] }
            : { height:'3px', opacity:0.25 }
          }
          transition={active
            ? { duration:0.48+i*0.04, repeat:Infinity, delay:i*0.055, ease:'easeInOut' }
            : { duration:0.25 }
          }
        />
      ))}
    </span>
  );
}

// ─── Expanding pulse rings while listening ───────────────────────────────────
function ListenRings({ active, color }) {
  if (!active) return null;
  return (
    <>
      {[0,1,2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{ border:`2px solid ${color}`, borderRadius:'50%' }}
          initial={{ scale:1, opacity:0.55 }}
          animate={{ scale:1.28+i*0.14, opacity:0 }}
          transition={{ duration:1.4, repeat:Infinity, delay:i*0.42, ease:'easeOut' }}
        />
      ))}
    </>
  );
}

// ─── State badge ─────────────────────────────────────────────────────────────
function StateBadge({ state, color }) {
  const cfg = {
    speaking:  { label:'Speaking',  dot:'🔊', bg:`${color}28`, border:`${color}55`, text:color },
    listening: { label:'Listening', dot:'👂', bg:'#86efac28', border:'#86efac55', text:'#86efac' },
    idle:      { label:'Online',    dot:'●',  bg:'rgba(255,255,255,0.08)', border:'rgba(255,255,255,0.18)', text:'rgba(255,255,255,0.65)' },
  };
  const s = cfg[state] || cfg.idle;
  return (
    <motion.span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
      style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.text }}
      layout
      animate={{ scale: state==='speaking' ? [1,1.05,1] : 1 }}
      transition={{ duration:0.75, repeat: state==='speaking' ? Infinity : 0, ease:'easeInOut' }}
    >
      <span style={{ fontSize:9 }}>{s.dot}</span>
      <span>{s.label}</span>
    </motion.span>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function AvatarPanel({
  character, isSpeaking, isListening,
  name, subtitle, gradientFrom, gradientTo,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';

  return (
    <div style={{ borderBottom:'1px solid rgba(0,0,0,0.09)' }}>

      {/* Header strip — always visible */}
      <div
        role="button"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer select-none"
        style={{ background:`linear-gradient(130deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
      >
        <div className="flex items-center min-w-0">
          <span className="text-white text-[11px] font-extrabold tracking-[0.12em] uppercase">{name}</span>
          {isSpeaking  && <SpeakingWave active={true} />}
          {isListening && !isSpeaking && (
            <motion.span
              className="text-white/65 text-[10px] italic ml-2"
              animate={{ opacity:[0.5,1,0.5] }}
              transition={{ duration:1.2, repeat:Infinity }}
            >
              listening…
            </motion.span>
          )}
        </div>
        <motion.div
          className="text-white/60 hover:text-white transition-colors ml-2 flex-shrink-0"
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration:0.22, ease:'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </div>

      {/* Collapsible avatar body */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="av"
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:0.26, ease:[0.4,0,0.2,1] }}
            style={{ overflow:'hidden' }}
          >
            <div
              className="flex items-center gap-4 py-4 px-5"
              style={{
                background:`linear-gradient(155deg, ${gradientFrom}14 0%, ${gradientTo}2a 100%)`,
              }}
            >
              {/* Avatar + glow + rings */}
              <div className="relative flex-shrink-0">
                {/* Ambient glow behind */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    inset:'-8px', borderRadius:'50%',
                    background:gradientTo,
                    filter:'blur(18px)',
                  }}
                  animate={{ opacity: isSpeaking ? 0.38 : isListening ? 0.18 : 0.09 }}
                  transition={{ duration:0.5 }}
                />

                {/* Avatar canvas with ring border */}
                <div
                  className="relative rounded-full overflow-hidden"
                  style={{
                    transition:'box-shadow 0.45s ease',
                    boxShadow: isSpeaking
                      ? `0 0 0 3px ${gradientTo}80, 0 6px 22px ${gradientTo}50`
                      : isListening
                      ? `0 0 0 2px ${gradientTo}55, 0 4px 14px rgba(0,0,0,0.14)`
                      : '0 3px 14px rgba(0,0,0,0.11)',
                  }}
                >
                  <ChatbotAvatar3D
                    character={character}
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                    size={112}
                  />
                </div>

                <ListenRings active={isListening && !isSpeaking} color={gradientTo} />
              </div>

              {/* Text info */}
              <div className="flex flex-col gap-2 min-w-0">
                <div>
                  <p
                    className="text-sm font-bold leading-tight"
                    style={{ color:gradientTo }}
                  >
                    {name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{subtitle}</p>
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
