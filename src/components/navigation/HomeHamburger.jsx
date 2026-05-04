import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, MessageCircle, UtensilsCrossed, BookOpen, LogOut } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function HomeHamburger() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  const items = [
    { icon: Bell, label: 'Notifications', action: () => navigate(createPageUrl('Notifications')) },
    { icon: MessageCircle, label: 'Messages', action: () => navigate(createPageUrl('Messages')) },
    { icon: UtensilsCrossed, label: 'Log Food', action: () => navigate(createPageUrl('Nutrition') + '?logFood=true') },
    { icon: BookOpen, label: 'My Plan', action: () => navigate(createPageUrl('Plans')) },
    { icon: LogOut, label: 'Sign Out', action: async () => {
      if (window.confirm('Are you sure you want to sign out?')) {
        try { await base44.auth.signOut(); } catch {}
        window.location.href = '/';
      }
    }, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
        style={{
          background: open ? 'rgba(201,162,39,0.15)' : 'transparent',
        }}
      >
        {open ? (
          <X className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
        ) : (
          <Menu className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-12 w-56 bg-white dark:bg-[#1A2540] rounded-2xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden z-50"
          >
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => { setOpen(false); item.action(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors min-h-[44px] ${
                    item.danger
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 border-t border-gray-100 dark:border-white/8'
                      : 'text-[#0A1A2F] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${item.danger ? 'text-red-400' : 'text-[#c9a227]'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
