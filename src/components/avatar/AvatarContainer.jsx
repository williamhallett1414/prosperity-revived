import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AVATAR_STATES, AVATAR_CONFIG } from './avatarStateMachine.js';

// Animated ring that pulses around the avatar based on state
function StateRing({ state, color }) {
  const ringColors = {
    [AVATAR_STATES.IDLE]: 'rgba(0,0,0,0.06)',
    [AVATAR_STATES.LISTENING]: '#60a5fa',
    [AVATAR_STATES.THINKING]: '#a78bfa',
    [AVATAR_STATES.SPEAKING]: color,
    [AVATAR_STATES.CELEBRATE]: '#f59e0b',
    [AVATAR_STATES.REFLECT]: '#6ee7b7',
  };

  const shouldPulse = [AVATAR_STATES.LISTENING, AVATAR_STATES.THINKING, AVATAR_STATES.SPEAKING].includes(state);

  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{ border: `3px solid ${ringColors[state] || 'transparent'}` }}
      animate={shouldPulse ? { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.5 }}
      transition={shouldPulse ? { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } : { duration: 0.3 }}
    />
  );
}

// Floating particles for celebrate state
function CelebrationParticles({ active }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
      {['⭐', '✨', '🌟', '💫'].map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-sm"
          style={{ left: `${20 + i * 18}%`, bottom: '10%' }}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -60, opacity: 0 }}
          transition={{ delay: i * 0.15, duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

// Thinking dots animation
function ThinkingDots({ active, color }) {
  if (!active) return null;
  return (
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
          animate={{ y: [0, -4, 0] }}
          transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.7 }}
        />
      ))}
    </div>
  );
}

// Sound wave for speaking state
function SpeakingWave({ active, color }) {
  if (!active) return null;
  return (
    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
      {[3, 5, 7, 5, 3].map((h, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ background: color }}
          animate={{ height: [h, h * 2, h] }}
          transition={{ delay: i * 0.08, repeat: Infinity, duration: 0.5 }}
        />
      ))}
    </div>
  );
}

export default function AvatarContainer({ characterName, avatarState = AVATAR_STATES.IDLE, size = 'md' }) {
  const config = AVATAR_CONFIG[characterName];
  const [imgError, setImgError] = useState(false);

  if (!config) return null;

  const sizeMap = { sm: 'w-16 h-16', md: 'w-20 h-20', lg: 'w-24 h-24' };
  const containerSize = sizeMap[size] || sizeMap.md;

  const stateEmoji = {
    [AVATAR_STATES.IDLE]: config.idleEmoji,
    [AVATAR_STATES.LISTENING]: config.listeningEmoji,
    [AVATAR_STATES.THINKING]: config.thinkingEmoji,
    [AVATAR_STATES.SPEAKING]: config.speakingEmoji,
    [AVATAR_STATES.CELEBRATE]: config.celebrateEmoji,
    [AVATAR_STATES.REFLECT]: config.reflectEmoji,
  }[avatarState] || config.idleEmoji;

  const avatarVariants = {
    [AVATAR_STATES.IDLE]: { scale: 1, rotate: 0 },
    [AVATAR_STATES.LISTENING]: { scale: 1.04, rotate: [-1, 1, -1] },
    [AVATAR_STATES.THINKING]: { scale: 1, rotate: 0, y: [0, -3, 0] },
    [AVATAR_STATES.SPEAKING]: { scale: [1, 1.03, 1] },
    [AVATAR_STATES.CELEBRATE]: { scale: [1, 1.12, 1], rotate: [-5, 5, -5, 5, 0] },
    [AVATAR_STATES.REFLECT]: { scale: 0.97, rotate: 0 },
  };

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className={`relative ${containerSize}`}>
        {/* Avatar image / fallback */}
        <motion.div
          className={`${containerSize} rounded-full overflow-hidden shadow-lg relative`}
          animate={avatarVariants[avatarState] || avatarVariants[AVATAR_STATES.IDLE]}
          transition={
            avatarState === AVATAR_STATES.CELEBRATE
              ? { duration: 0.6, repeat: 2 }
              : avatarState === AVATAR_STATES.LISTENING
              ? { duration: 1.2, repeat: Infinity, repeatType: 'mirror' }
              : avatarState === AVATAR_STATES.THINKING
              ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              : avatarState === AVATAR_STATES.SPEAKING
              ? { duration: 0.4, repeat: Infinity, repeatType: 'mirror' }
              : { duration: 0.4 }
          }
        >
          {!imgError ? (
            <img
              src={config.portrait}
              alt={config.displayName}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-3xl"
              style={{ background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` }}
            >
              {config.emoji}
            </div>
          )}

          {/* Overlay tint for certain states */}
          {avatarState === AVATAR_STATES.REFLECT && (
            <div className="absolute inset-0 bg-emerald-400/10 rounded-full" />
          )}
          {avatarState === AVATAR_STATES.THINKING && (
            <div className="absolute inset-0 bg-violet-400/10 rounded-full" />
          )}
        </motion.div>

        {/* State ring */}
        <StateRing state={avatarState} color={config.primaryColor} />

        {/* Celebration particles */}
        <CelebrationParticles active={avatarState === AVATAR_STATES.CELEBRATE} />

        {/* State indicator badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={avatarState}
            className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full shadow-md w-6 h-6 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {stateEmoji}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thinking / speaking indicators below avatar */}
      <div className="relative h-6 flex items-center">
        <ThinkingDots active={avatarState === AVATAR_STATES.THINKING} color={config.primaryColor} />
        <SpeakingWave active={avatarState === AVATAR_STATES.SPEAKING} color={config.primaryColor} />
      </div>

      {/* Name + state label */}
      <div className="text-center">
        <p className="text-xs font-semibold" style={{ color: config.secondaryColor }}>
          {config.displayName}
        </p>
        <p className="text-[10px] text-gray-400 capitalize">{avatarState}</p>
      </div>
    </div>
  );
}