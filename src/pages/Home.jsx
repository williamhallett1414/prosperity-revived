import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { BookOpen, Heart, Dumbbell, Users, Utensils, MessageCircle } from 'lucide-react';

// Helper functions
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return { text: 'Good Night', emoji: '🌙', isMorning: false };
  if (h < 12) return { text: 'Good Morning', emoji: '🌅', isMorning: true };
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️', isMorning: false };
  if (h < 21) return { text: 'Good Evening', emoji: '🌇', isMorning: false };
  return { text: 'Good Night', emoji: '🌙', isMorning: false };
}

function getFirstName(user) {
  return user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'friend';
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Quick nav items
const QUICK_NAV = [
  { label: 'Bible', icon: BookOpen, page: 'Bible', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
  { label: 'Fitness', icon: Dumbbell, page: 'Wellness', color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50' },
  { label: 'Prayer', icon: Heart, page: 'Prayer', color: 'from-rose-400 to-rose-500', bg: 'bg-rose-50' },
  { label: 'Nutrition', icon: Utensils, page: 'Nutrition', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Community', icon: Users, page: 'Community', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
];

const AI_GUIDES = [
  { name: 'Gideon', role: 'Biblical Wisdom', bot: 'Gideon', bg: 'bg-amber-50' },
  { name: 'Hannah', role: 'Mindset & Prayer', bot: 'Hannah', bg: 'bg-sky-50' },
  { name: 'Coach David', role: 'Fitness Coach', bot: 'CoachDavid', bg: 'bg-blue-50' },
  { name: 'Chef Daniel', role: 'Nutrition Guide', bot: 'ChefDaniel', bg: 'bg-orange-50' },
  { name: 'Coach Paul', role: 'Discipline Mentor', bot: 'CoachPaul', bg: 'bg-violet-50' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const greeting = getGreeting();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F6FA]">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-[#0A1A2F]/40 uppercase tracking-widest mb-0.5">
            {getTodayFormatted()}
          </p>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">
            {greeting.text}, {getFirstName(user)} {greeting.emoji}
          </h1>
        </motion.div>

        {/* Guides Section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-[#c9a227]" />
            <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Talk to Your Guides</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {AI_GUIDES.map(({ name, role, bot, bg }) => (
              <Link key={bot} to={createPageUrl(`ChatScreen?bot=${bot}`)} className="flex-shrink-0" style={{ width: 140 }}>
                <motion.div whileTap={{ scale: 0.95 }} className={`${bg} rounded-2xl p-3 shadow-sm border border-gray-100/80 h-full`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 mx-auto mb-2 flex items-center justify-center shadow-sm">
                    <span className="text-xl text-white font-bold">{name[0]}</span>
                  </div>
                  <p className="text-xs font-bold text-[#0A1A2F] text-center">{name}</p>
                  <p className="text-[9px] text-[#0A1A2F]/40 text-center">{role}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Nav */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">Explore</p>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_NAV.map(({ label, icon: Icon, page, color, bg }) => (
              <Link key={page} to={createPageUrl(page)}>
                <motion.div whileTap={{ scale: 0.95 }} className={`${bg} rounded-2xl p-3.5 flex flex-col items-center gap-2 shadow-sm border border-gray-100/80`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-[#0A1A2F]/70">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}