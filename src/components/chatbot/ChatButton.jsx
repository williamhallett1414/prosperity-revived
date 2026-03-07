/**
 * ChatButton — Floating "Chat with X" button that navigates to the
 * full-screen ChatScreen experience with the new 3D cloud avatar.
 *
 * Drop-in replacement for the legacy embedded modal components:
 *   <Hannah user={user} />           →  <ChatButton bot="Hannah" />
 *   <CoachDavid user={user} />       →  <ChatButton bot="CoachDavid" />
 *   <ChefDaniel user={user} />       →  <ChatButton bot="ChefDaniel" />
 *   <GideonChatbot user={user} />    →  <ChatButton bot="Gideon" />
 *   <CoachPaul user={user} />        →  <ChatButton bot="CoachPaul" />
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const BOT_STYLES = {
  Hannah:     { label: 'Chat with Hannah',      emoji: '🧠', from: '#AFC7E3', to: '#3C4E53' },
  CoachDavid: { label: 'Chat with Coach David', emoji: '💪', from: '#1e40af', to: '#38BDF8' },
  ChefDaniel: { label: 'Chat with Chef Daniel', emoji: '🍽️', from: '#166534', to: '#22c55e' },
  Gideon:     { label: 'Chat with Gideon',      emoji: '📖', from: '#7c5a00', to: '#D9B878' },
  CoachPaul:  { label: 'Chat with Coach Paul',  emoji: '🛡️', from: '#3B0764', to: '#A78BFA' },
};

export default function ChatButton({ bot = 'Hannah' }) {
  const navigate = useNavigate();
  const style = BOT_STYLES[bot] || BOT_STYLES.Hannah;

  return (
    <motion.button
      onClick={() => navigate(createPageUrl(`ChatScreen?bot=${bot}`))}
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl text-white text-sm font-semibold"
      style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
      whileTap={{ scale: 0.92 }}
    >
      <span className="text-base leading-none">{style.emoji}</span>
      <span>{style.label}</span>
      <MessageCircle className="w-4 h-4 opacity-80" />
    </motion.button>
  );
}
