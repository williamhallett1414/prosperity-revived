import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Flame, ChevronRight } from 'lucide-react';
import { RitualButton, QuickNav, ResumeCard, ActiveChallengesWidget, StartHereCard } from '@/components/home/HomeComponents';
import gideonImg from '@/assets/gideon-avatar.png';
import hannahImg from '@/assets/hannah-avatar.png';
import coachDavidImg from '@/assets/coach-david-avatar.png';
import chefDanielImg from '@/assets/chef-daniel-avatar.png';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Good Night',    emoji: '🌙', isMorning: false };
  if (h < 12) return { text: 'Good Morning',  emoji: '🌅', isMorning: true  };
  if (h < 17) return { text: 'Good Afternoon',emoji: '☀️', isMorning: false };
  if (h < 21) return { text: 'Good Evening',  emoji: '🌇', isMorning: false };
  return       { text: 'Good Night',    emoji: '🌙', isMorning: false };
}

function getFirstName(user) {
  return user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'friend';
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function Home() {
  const [user, setUser] = useState(null);
  const greeting = getGreeting();
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
  const ritualKey = greeting.isMorning ? `ritual_morning_${today}` : `ritual_evening_${today}`;
  const [ritualDone, setRitualDone] = useState(() => !!localStorage.getItem(ritualKey));

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      try {
        const list = await base44.entities.UserProgress.filter({ created_by: user?.email });
        return list[0] || null;
      } catch { return null; }
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-[#F2F6FA]">
      <div className="max-w-lg mx-auto px-4 pb-28 space-y-4">
        {/* Prosperity Revived Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 pt-4 pb-2">
          <svg width="32" height="32" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M200 70C200 70 180 100 180 130C180 150 190 160 200 160C210 160 220 150 220 130C220 100 200 70 200 70Z" fill="black"/>
            <path d="M140 110C140 110 120 135 115 160C110 180 120 195 135 200C150 205 165 190 170 165C175 135 155 110 140 110Z" fill="black"/>
            <path d="M260 110C260 110 280 135 285 160C290 180 280 195 265 200C250 205 235 190 230 165C225 135 245 110 260 110Z" fill="black"/>
            <path d="M120 170C120 170 100 200 100 230C100 250 110 265 125 270C140 275 155 260 160 235C165 200 140 170 120 170Z" fill="black"/>
            <path d="M280 170C280 170 300 200 300 230C300 250 290 265 275 270C260 275 245 260 240 235C235 200 260 170 280 170Z" fill="black"/>
            <path d="M150 240C150 240 145 265 155 285C165 300 180 305 195 300C210 295 210 280 205 260C200 245 165 240 150 240Z" fill="black"/>
            <path d="M250 240C250 240 255 265 245 285C235 300 220 305 205 300C190 295 190 280 195 260C200 245 235 240 250 240Z" fill="black"/>
            <path d="M195 170L200 230L205 170" stroke="black" strokeWidth="2" fill="none"/>
            <path d="M190 200C190 200 180 210 175 225" stroke="black" strokeWidth="1.5" fill="none"/>
            <path d="M210 200C210 200 220 210 225 225" stroke="black" strokeWidth="1.5" fill="none"/>
            <rect x="190" y="310" width="20" height="40" fill="black"/>
          </svg>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">Prosperity Revived</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-[#0A1A2F]/40 uppercase tracking-widest mb-0.5">
            {getTodayFormatted()}
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0A1A2F]">
              {greeting.text}, {getFirstName(user)} {greeting.emoji}
            </h1>
            {userProgress && (
              <Link to={createPageUrl('Achievements')}>
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-[#FAD98D]/40">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-bold text-[#0A1A2F] text-xs">{userProgress.current_streak || 0}</span>
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        {!ritualDone && (
          <RitualButton
            isMorning={greeting.isMorning}
            onStartDay={() => {}}
            onEndDay={() => {}}
          />
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Link to={createPageUrl('Bible')}>
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FAD98D]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <span className="text-6xl">📖</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-[#c9a227] rounded-full" />
                <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Today's Scripture</span>
              </div>
              <p className="text-[#0A1A2F] text-base leading-relaxed font-medium mb-3">
                "Trust in the Lord with all your heart, and lean not on your own understanding."
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#0A1A2F]/50 font-medium">Proverbs 3:5</p>
                <span className="text-xs text-[#c9a227] font-semibold flex items-center gap-1">
                  Read more <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#0A1A2F] to-[#1a3a5c] rounded-2xl px-4 py-3 shadow-md">
            <span className="text-xl flex-shrink-0">💛</span>
            <p className="text-xs text-white/80 leading-relaxed flex-1">What would help you grow today?</p>
            <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <Link to={createPageUrl('Prayer')}>
            <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 rounded-3xl p-5 shadow-sm border border-[#FAD98D]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <span className="text-4xl">🕊️</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🕊️</span>
                <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Grace Moment</span>
              </div>
              <p className="text-[#0A1A2F] text-[15px] leading-relaxed font-semibold mb-2">God's grace doesn't run out. Not today, not ever.</p>
              <p className="text-[#0A1A2F]/60 text-xs leading-relaxed italic">
                "My grace is sufficient for you, for my power is made perfect in weakness." — 2 Corinthians 12:9
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">💬</span>
            <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Talk to Your Guides</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {[
              { name: 'Gideon', role: 'Biblical Wisdom', bot: 'Gideon', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', img: gideonImg },
              { name: 'Hannah', role: 'Mindset Coach', bot: 'Hannah', color: 'from-sky-400 to-sky-500', bg: 'bg-sky-50', img: hannahImg },
              { name: 'Coach David', role: 'Fitness', bot: 'CoachDavid', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', img: coachDavidImg },
              { name: 'Chef Daniel', role: 'Nutrition', bot: 'ChefDaniel', color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50', img: chefDanielImg },
            ].map(({ name, role, bot, color, bg, img }) => (
              <Link key={bot} to={createPageUrl(`ChatScreen?bot=${bot}`)} className="flex-shrink-0" style={{ width: 140 }}>
                <div className={`${bg} rounded-2xl p-3 shadow-sm border border-gray-100/80 h-full`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} mx-auto mb-2 flex items-center justify-center shadow-sm overflow-hidden`}>
                    <img src={img} alt={name} className="w-full h-full object-cover object-top" />
                  </div>
                  <p className="text-xs font-bold text-[#0A1A2F] text-center leading-tight">{name}</p>
                  <p className="text-[9px] text-[#0A1A2F]/40 text-center font-medium">{role}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Link to={createPageUrl('CoachingPlans')}>
            <div className="bg-gradient-to-br from-[#0D4F3C] to-[#1a8a6a] rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-white/10" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-base leading-tight">Coaching Plans</p>
                  <p className="text-white/70 text-xs mt-0.5">8-week guided programs for body, mind & spirit</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/50" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;