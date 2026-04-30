import React from 'react';
import { Menu, RotateCcw, Video, PhoneCall } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatInputMenu({
  open,
  onToggle,
  onRestart,
  onVideoMessage,
  onVideoCall,
  disabled,
}) {
  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={onToggle}
        disabled={disabled}
        aria-label="Open actions menu"
        className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
        style={{
          background: open ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.11)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <Menu className="w-4 h-4 text-white/75" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-14 left-0 w-48 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl"
            style={{
              background: 'rgba(8,18,38,0.96)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <MenuAction icon={RotateCcw} label="Restart chat" onClick={onRestart} />
            <MenuAction icon={Video} label="Video message" onClick={onVideoMessage} />
            <MenuAction icon={PhoneCall} label="Start call" onClick={onVideoCall} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white/85 hover:bg-white/10 transition-colors"
    >
      <Icon className="w-4 h-4 text-white/65" />
      <span>{label}</span>
    </button>
  );
}