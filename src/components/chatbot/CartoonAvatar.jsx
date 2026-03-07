/**
 * CartoonAvatar — Custom SVG cartoon avatars for each chatbot character
 * Replaces the Three.js 3D models with clean, animated cartoon illustrations
 */
import React from 'react';
import { motion } from 'framer-motion';

// ─── Hannah — warm counselor, blue tones ─────────────────────────────────────
function HannahAvatar({ isSpeaking, isListening }) {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair */}
      <ellipse cx="100" cy="72" rx="52" ry="55" fill="#3D2314"/>
      <ellipse cx="100" cy="95" rx="52" ry="40" fill="#3D2314"/>
      {/* Side hair */}
      <ellipse cx="54" cy="105" rx="14" ry="30" fill="#3D2314"/>
      <ellipse cx="146" cy="105" rx="14" ry="30" fill="#3D2314"/>
      {/* Neck */}
      <rect x="86" y="148" width="28" height="28" rx="8" fill="#FDBCB4"/>
      {/* Body / top */}
      <ellipse cx="100" cy="200" rx="55" ry="30" fill="#AFC7E3"/>
      <rect x="55" y="185" width="90" height="35" rx="12" fill="#AFC7E3"/>
      {/* Collar */}
      <path d="M85 176 L100 190 L115 176" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Face */}
      <ellipse cx="100" cy="108" rx="44" ry="48" fill="#FDBCB4"/>
      {/* Cheeks */}
      <ellipse cx="75" cy="118" rx="10" ry="7" fill="#F4A0A0" opacity="0.5"/>
      <ellipse cx="125" cy="118" rx="10" ry="7" fill="#F4A0A0" opacity="0.5"/>
      {/* Eyes */}
      <ellipse cx="84" cy="102" rx="9" ry="10" fill="white"/>
      <ellipse cx="116" cy="102" rx="9" ry="10" fill="white"/>
      <ellipse cx="86" cy="103" rx="5.5" ry="6" fill="#5B3A29"/>
      <ellipse cx="118" cy="103" rx="5.5" ry="6" fill="#5B3A29"/>
      <ellipse cx="88" cy="101" rx="2" ry="2.5" fill="white"/>
      <ellipse cx="120" cy="101" rx="2" ry="2.5" fill="white"/>
      {/* Eyelashes */}
      <path d="M76 96 Q80 93 84 95" stroke="#3D2314" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M108 95 Q112 93 117 96" stroke="#3D2314" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Eyebrows */}
      <path d="M76 93 Q84 88 92 92" stroke="#3D2314" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M108 92 Q116 88 124 93" stroke="#3D2314" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <ellipse cx="100" cy="116" rx="4" ry="3" fill="#E8958A"/>
      {/* Mouth */}
      <motion.path
        d={isSpeaking
          ? "M88 128 Q100 140 112 128"
          : "M88 128 Q100 136 112 128"}
        stroke="#C0504D" strokeWidth="2.5" fill={isSpeaking ? "#F4A0A0" : "none"}
        strokeLinecap="round"
        animate={{ d: isSpeaking ? ["M88 128 Q100 140 112 128","M88 128 Q100 134 112 128","M88 128 Q100 140 112 128"] : "M88 128 Q100 136 112 128" }}
        transition={{ duration: 0.4, repeat: isSpeaking ? Infinity : 0 }}
      />
      {/* Hair highlight */}
      <ellipse cx="85" cy="68" rx="12" ry="8" fill="#5C3520" opacity="0.5"/>
      {/* Earrings */}
      <circle cx="56" cy="112" r="4" fill="#AFC7E3" stroke="white" strokeWidth="1.5"/>
      <circle cx="144" cy="112" r="4" fill="#AFC7E3" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
}

// ─── Coach David — athletic, energetic, dark blue ─────────────────────────────
function CoachDavidAvatar({ isSpeaking, isListening }) {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body / athletic shirt */}
      <rect x="45" y="180" width="110" height="40" rx="14" fill="#0f172a"/>
      <ellipse cx="100" cy="200" rx="58" ry="28" fill="#0f172a"/>
      {/* Shirt stripe */}
      <rect x="92" y="178" width="16" height="42" rx="4" fill="#38BDF8" opacity="0.6"/>
      {/* Neck */}
      <rect x="85" y="148" width="30" height="32" rx="8" fill="#C68642"/>
      {/* Head */}
      <ellipse cx="100" cy="105" rx="48" ry="50" fill="#C68642"/>
      {/* Short hair */}
      <ellipse cx="100" cy="68" rx="48" ry="22" fill="#1a0a00"/>
      <ellipse cx="100" cy="60" rx="42" ry="16" fill="#2d1100"/>
      {/* Fade sides */}
      <rect x="52" y="68" width="16" height="25" rx="8" fill="#1a0a00"/>
      <rect x="132" y="68" width="16" height="25" rx="8" fill="#1a0a00"/>
      {/* Cheeks */}
      <ellipse cx="73" cy="118" rx="11" ry="8" fill="#B5762E" opacity="0.5"/>
      <ellipse cx="127" cy="118" rx="11" ry="8" fill="#B5762E" opacity="0.5"/>
      {/* Eyes */}
      <ellipse cx="83" cy="100" rx="10" ry="10" fill="white"/>
      <ellipse cx="117" cy="100" rx="10" ry="10" fill="white"/>
      <ellipse cx="85" cy="101" rx="6" ry="6.5" fill="#1a0a00"/>
      <ellipse cx="119" cy="101" rx="6" ry="6.5" fill="#1a0a00"/>
      <ellipse cx="87" cy="99" rx="2.5" ry="2.5" fill="white"/>
      <ellipse cx="121" cy="99" rx="2.5" ry="2.5" fill="white"/>
      {/* Eyebrows — thick */}
      <path d="M73 88 Q83 83 93 88" stroke="#1a0a00" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M107 88 Q117 83 127 88" stroke="#1a0a00" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M96 112 Q100 118 104 112" stroke="#9B6830" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Mouth */}
      <motion.path
        d={isSpeaking ? "M84 130 Q100 142 116 130" : "M84 128 Q100 137 116 128"}
        stroke="#7B4A20" strokeWidth="3" fill={isSpeaking ? "#B5762E" : "none"}
        strokeLinecap="round"
        animate={{ d: isSpeaking ? ["M84 130 Q100 142 116 130","M84 130 Q100 136 116 130","M84 130 Q100 142 116 130"] : "M84 128 Q100 137 116 128" }}
        transition={{ duration: 0.35, repeat: isSpeaking ? Infinity : 0 }}
      />
      {/* Jawline definition */}
      <path d="M60 120 Q64 148 100 158 Q136 148 140 120" stroke="#B5762E" strokeWidth="1.5" fill="none" opacity="0.4"/>
      {/* Cap visor hint */}
      <path d="M52 72 Q100 58 148 72" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Chef Daniel — friendly chef, green tones ─────────────────────────────────
function ChefDanielAvatar({ isSpeaking, isListening }) {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chef coat body */}
      <rect x="42" y="178" width="116" height="42" rx="14" fill="white"/>
      <ellipse cx="100" cy="205" rx="60" ry="26" fill="white"/>
      {/* Coat buttons */}
      <circle cx="97" cy="188" r="3" fill="#e5e7eb"/>
      <circle cx="97" cy="200" r="3" fill="#e5e7eb"/>
      <circle cx="97" cy="212" r="3" fill="#e5e7eb"/>
      {/* Green trim */}
      <rect x="42" y="178" width="14" height="42" rx="7" fill="#22c55e" opacity="0.7"/>
      <rect x="144" y="178" width="14" height="42" rx="7" fill="#22c55e" opacity="0.7"/>
      {/* Neck */}
      <rect x="86" y="150" width="28" height="30" rx="8" fill="#FDBCB4"/>
      {/* Head */}
      <ellipse cx="100" cy="108" rx="46" ry="50" fill="#FDBCB4"/>
      {/* Chef hat */}
      <rect x="65" y="52" width="70" height="28" rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
      <ellipse cx="100" cy="52" rx="42" ry="18" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
      <ellipse cx="100" cy="42" rx="32" ry="22" fill="white"/>
      <ellipse cx="100" cy="30" rx="22" ry="16" fill="white"/>
      {/* Hat band */}
      <rect x="62" y="72" width="76" height="10" rx="4" fill="#22c55e" opacity="0.8"/>
      {/* Cheeks */}
      <ellipse cx="74" cy="120" rx="11" ry="8" fill="#F4A0A0" opacity="0.55"/>
      <ellipse cx="126" cy="120" rx="11" ry="8" fill="#F4A0A0" opacity="0.55"/>
      {/* Eyes */}
      <ellipse cx="83" cy="104" rx="10" ry="10" fill="white"/>
      <ellipse cx="117" cy="104" rx="10" ry="10" fill="white"/>
      <ellipse cx="85" cy="105" rx="6" ry="6.5" fill="#3C4E53"/>
      <ellipse cx="119" cy="105" rx="6" ry="6.5" fill="#3C4E53"/>
      <ellipse cx="87" cy="103" rx="2.5" ry="2.5" fill="white"/>
      <ellipse cx="121" cy="103" rx="2.5" ry="2.5" fill="white"/>
      {/* Eyebrows */}
      <path d="M74 92 Q83 87 92 91" stroke="#5a3e28" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M108 91 Q117 87 126 92" stroke="#5a3e28" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <ellipse cx="100" cy="118" rx="4.5" ry="3.5" fill="#E8958A"/>
      {/* Mustache */}
      <path d="M86 128 Q93 132 100 129 Q107 132 114 128" stroke="#5a3e28" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Mouth */}
      <motion.path
        d={isSpeaking ? "M88 135 Q100 146 112 135" : "M88 134 Q100 141 112 134"}
        stroke="#C0504D" strokeWidth="2.5" fill={isSpeaking ? "#F4A0A0" : "none"}
        strokeLinecap="round"
        animate={{ d: isSpeaking ? ["M88 135 Q100 146 112 135","M88 135 Q100 140 112 135","M88 135 Q100 146 112 135"] : "M88 134 Q100 141 112 134" }}
        transition={{ duration: 0.38, repeat: isSpeaking ? Infinity : 0 }}
      />
      {/* Ears */}
      <ellipse cx="54" cy="108" rx="9" ry="11" fill="#FDBCB4"/>
      <ellipse cx="146" cy="108" rx="9" ry="11" fill="#FDBCB4"/>
    </svg>
  );
}

// ─── Gideon — wise biblical mentor, warm gold tones ──────────────────────────
function GideonAvatar({ isSpeaking, isListening }) {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Robe / body */}
      <ellipse cx="100" cy="205" rx="65" ry="28" fill="#7c5a00"/>
      <rect x="38" y="178" width="124" height="42" rx="16" fill="#7c5a00"/>
      {/* Robe detail */}
      <path d="M100 178 L88 220 M100 178 L112 220" stroke="#c9a227" strokeWidth="2" opacity="0.6"/>
      {/* Gold trim */}
      <path d="M38 188 Q100 196 162 188" stroke="#FAD98D" strokeWidth="3" fill="none"/>
      {/* Neck */}
      <rect x="85" y="150" width="30" height="30" rx="8" fill="#D4A574"/>
      {/* Head */}
      <ellipse cx="100" cy="108" rx="47" ry="51" fill="#D4A574"/>
      {/* Long beard */}
      <path d="M60 128 Q58 160 100 175 Q142 160 140 128 Q130 145 100 152 Q70 145 60 128Z" fill="#8B7355"/>
      {/* Beard highlight */}
      <path d="M80 138 Q100 148 120 138 Q110 155 100 158 Q90 155 80 138Z" fill="#A08B6E" opacity="0.5"/>
      {/* Hair / head cloth */}
      <ellipse cx="100" cy="72" rx="50" ry="30" fill="#5a3e00"/>
      {/* Head cloth wrap */}
      <path d="M50 80 Q100 60 150 80 L148 90 Q100 72 52 90Z" fill="#7c5a00"/>
      <path d="M50 80 L45 110 Q48 115 55 108 L58 85" fill="#6b4e00"/>
      <path d="M150 80 L155 110 Q152 115 145 108 L142 85" fill="#6b4e00"/>
      {/* Cloth gold band */}
      <path d="M50 82 Q100 65 150 82" stroke="#FAD98D" strokeWidth="2.5" fill="none"/>
      {/* Eyes — wise, warm */}
      <ellipse cx="83" cy="103" rx="10" ry="10" fill="white"/>
      <ellipse cx="117" cy="103" rx="10" ry="10" fill="white"/>
      <ellipse cx="85" cy="104" rx="6" ry="6.5" fill="#3D2314"/>
      <ellipse cx="119" cy="104" rx="6" ry="6.5" fill="#3D2314"/>
      <ellipse cx="87" cy="102" rx="2.5" ry="2.5" fill="white"/>
      <ellipse cx="121" cy="102" rx="2.5" ry="2.5" fill="white"/>
      {/* Eyebrows — wise, slightly arched */}
      <path d="M73 90 Q83 85 93 90" stroke="#3D2314" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M107 90 Q117 85 127 90" stroke="#3D2314" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Wrinkle lines — wise elder */}
      <path d="M73 90 Q70 87 72 84" stroke="#B8926A" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M127 90 Q130 87 128 84" stroke="#B8926A" strokeWidth="1" fill="none" opacity="0.5"/>
      {/* Nose — strong */}
      <path d="M95 114 Q100 122 105 114" stroke="#B8926A" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="100" cy="118" rx="5" ry="3.5" fill="#C49A6C"/>
      {/* Mustache — flowing into beard */}
      <path d="M82 126 Q91 130 100 127 Q109 130 118 126" stroke="#6B5343" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Mouth */}
      <motion.path
        d={isSpeaking ? "M88 134 Q100 145 112 134" : "M88 132 Q100 139 112 132"}
        stroke="#8B6347" strokeWidth="2.5" fill={isSpeaking ? "#C49A6C" : "none"}
        strokeLinecap="round"
        animate={{ d: isSpeaking ? ["M88 134 Q100 145 112 134","M88 134 Q100 138 112 134","M88 134 Q100 145 112 134"] : "M88 132 Q100 139 112 132" }}
        transition={{ duration: 0.42, repeat: isSpeaking ? Infinity : 0 }}
      />
      {/* Cheeks */}
      <ellipse cx="72" cy="116" rx="10" ry="7" fill="#C49A6C" opacity="0.3"/>
      <ellipse cx="128" cy="116" rx="10" ry="7" fill="#C49A6C" opacity="0.3"/>
    </svg>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
const AVATAR_MAP = {
  hannah: HannahAvatar,
  coach: CoachDavidAvatar,
  chef: ChefDanielAvatar,
  gideon: GideonAvatar,
};

export default function CartoonAvatar({ character, isSpeaking, isListening, size = 200 }) {
  const AvatarComponent = AVATAR_MAP[character] || HannahAvatar;

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={{
        y: isSpeaking ? [0, -6, 0] : isListening ? [0, -3, 0] : [0, -4, 0],
        rotate: isSpeaking ? [0, 1, -1, 0] : 0,
      }}
      transition={{
        y: { duration: isSpeaking ? 0.4 : 3, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 0.3, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' },
      }}
    >
      <AvatarComponent isSpeaking={isSpeaking} isListening={isListening} />
    </motion.div>
  );
}
