import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Flame, ChevronRight } from 'lucide-react';
import { RitualButton, QuickNav, ResumeCard, ActiveChallengesWidget, StartHereCard } from '@/components/home/HomeComponents';
import HelpChatbot from '@/components/home/HelpChatbot';
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
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F]">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-0.5">
            {getTodayFormatted()}
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0A1A2F] dark:text-white">
              {greeting.text}, {getFirstName(user)} {greeting.emoji}
            </h1>
            {userProgress && (
              <Link to={createPageUrl('Achievements')}>
                <div className="flex items-center gap-1.5 bg-white dark:bg-white/10 rounded-full px-3 py-1.5 shadow-sm dark:shadow-none border border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 dark:border-white/10">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-bold text-[#0A1A2F] dark:text-white text-xs">{userProgress.current_streak || 0}</span>
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        {!ritualDone && (
          <RitualButton
            isMorning={greeting.isMorning}
            onStartDay={async () => {
              // Mark ritual as done
              localStorage.setItem(ritualKey, '1');
              setRitualDone(true);
              // Award XP
              try {
                if (userProgress?.id) {
                  const pts = (userProgress.total_points || 0) + 15;
                  const streak = (userProgress.current_streak || 0) + 1;
                  await base44.entities.UserProgress.update(userProgress.id, {
                    total_points: pts,
                    current_streak: streak,
                    last_activity_date: today,
                  });
                }
              } catch {}
              // Navigate to a morning flow: Scripture → Affirmation → Intention
              navigate(createPageUrl('Bible'));
            }}
            onEndDay={async () => {
              localStorage.setItem(ritualKey, '1');
              setRitualDone(true);
              try {
                if (userProgress?.id) {
                  const pts = (userProgress.total_points || 0) + 15;
                  await base44.entities.UserProgress.update(userProgress.id, {
                    total_points: pts,
                    last_activity_date: today,
                  });
                }
              } catch {}
              // Navigate to evening flow: Gratitude → Reflection
              navigate(createPageUrl('GratitudeJournalPage'));
            }}
          />
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Link to={createPageUrl('Bible')}>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none border border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 dark:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <span className="text-6xl">📖</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-[#c9a227] rounded-full" />
                <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Today's Scripture</span>
              </div>
              <p className="text-[#0A1A2F] dark:text-white text-base leading-relaxed font-medium mb-3">
                "Trust in the Lord with all your heart, and lean not on your own understanding."
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#0A1A2F]/50 dark:text-white/50 font-medium">Proverbs 3:5</p>
                <span className="text-xs text-[#c9a227] font-semibold flex items-center gap-1">
                  Read more <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#0A1A2F] to-[#1a3a5c] rounded-2xl px-4 py-3 shadow-md dark:shadow-none">
            <span className="text-xl flex-shrink-0">💛</span>
            <p className="text-xs text-white/80 leading-relaxed flex-1">What would help you grow today?</p>
            <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <Link to={createPageUrl('Prayer')}>
            <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 dark:from-white/5 dark:to-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 dark:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <span className="text-4xl">🕊️</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🕊️</span>
                <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Grace Moment</span>
              </div>
              <p className="text-[#0A1A2F] dark:text-white text-[15px] leading-relaxed font-semibold mb-2">God's grace doesn't run out. Not today, not ever.</p>
              <p className="text-[#0A1A2F]/60 dark:text-white/60 text-xs leading-relaxed italic">
                "My grace is sufficient for you, for my power is made perfect in weakness." — 2 Corinthians 12:9
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">💬</span>
            <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">Talk to Your Guides</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {[
              { name: 'Gideon', role: 'Biblical Wisdom', bot: 'Gideon', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', img: gideonImg },
              { name: 'Hannah', role: 'Mindset Coach', bot: 'Hannah', color: 'from-sky-400 to-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20', img: hannahImg },
              { name: 'Coach David', role: 'Fitness', bot: 'CoachDavid', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', img: coachDavidImg },
              { name: 'Chef Daniel', role: 'Nutrition', bot: 'ChefDaniel', color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', img: chefDanielImg },
            ].map(({ name, role, bot, color, bg, img }) => (
              <Link key={bot} to={createPageUrl(`ChatScreen?bot=${bot}`)} className="flex-shrink-0" style={{ width: 140 }}>
                <div className={`${bg} dark:bg-white/5 rounded-2xl p-3 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 dark:border-white/10/80 dark:border-white/10 h-full`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} mx-auto mb-2 flex items-center justify-center shadow-sm dark:shadow-none overflow-hidden`}>
                    <img src={img} alt={name} className="w-full h-full object-cover object-top" />
                  </div>
                  <p className="text-xs font-bold text-[#0A1A2F] dark:text-white text-center leading-tight">{name}</p>
                  <p className="text-[9px] text-[#0A1A2F]/40 dark:text-white/40 text-center font-medium">{role}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Link to={createPageUrl('CoachingPlans')}>
            <div className="bg-gradient-to-br from-[#0D4F3C] to-[#1a8a6a] rounded-3xl p-5 shadow-md dark:shadow-none relative overflow-hidden">
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

      {/* Help Chatbot — floating guide button */}
      <HelpChatbot />
    </div>
  );
}

export default Home;