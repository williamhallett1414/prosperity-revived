import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Heart, Sparkles, Target, CheckCircle2, Crown, Calendar, Wind, Star, ArrowRight } from 'lucide-react';
import { Link, useNavigate} from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Get a time-of-day recommendation
const getFeatured = () => {
  const h = new Date().getHours();
  if (h < 10) return {
    page: 'MindsetResetPage', icon: Brain,
    label: 'Start with a Mindset Reset',
    sub: 'Set a powerful intention for today before the day sets one for you.',
    badge: 'Morning Pick 🌅',
    gradient: 'from-[#3C4E53] to-[#AFC7E3]',
  };
  if (h < 14) return {
    page: 'EmotionalCheckInPage', icon: Heart,
    label: 'Midday Check-In',
    sub: "Pause and ask: what's really going on inside right now?",
    badge: 'Midday Pick ☀️',
    gradient: 'from-[#AFC7E3] to-[#3C4E53]',
  };
  if (h < 18) return {
    page: 'GuidedMeditationsPage', icon: Wind,
    label: 'Afternoon Meditation',
    sub: 'A guided session to clear afternoon fog and return to peace.',
    badge: 'Afternoon Pick 🌤️',
    gradient: 'from-[#3C4E53] to-[#AFC7E3]',
  };
  return {
    page: 'WeeklyReflectionPage', icon: Calendar,
    label: 'Evening Reflection',
    sub: 'What did today teach you? Capture it before it fades.',
    badge: 'Evening Pick 🌙',
    gradient: 'from-[#AFC7E3] to-[#3C4E53]',
  };
};

const GRID_CARDS = [
  { page: 'MyJournalEntries',     icon: BookOpen,     iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'My Journal',          sub: 'Read past reflections',       delay: 0 },
  { page: 'MindsetResetPage',     icon: Brain,        iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Mindset Reset',        sub: 'Rewire your thinking',        delay: 0.04 },
  { page: 'EmotionalCheckInPage', icon: Heart,        iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Emotional Check-In',   sub: "What's weighing on you?",     delay: 0.08 },
  { page: 'AffirmationsPage',     icon: Sparkles,     iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Affirmations',         sub: 'Speak truth over yourself',   delay: 0.12 },
  { page: 'GrowthPathwaysPage',   icon: Target,       iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Growth Pathways',      sub: 'Choose your next step',       delay: 0.16 },
  { page: 'HabitBuilderPage',     icon: CheckCircle2, iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Habit Builder',        sub: 'Track what you do daily',     delay: 0.20 },
  { page: 'IdentityInChristPage', icon: Crown,        iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Identity in Christ',   sub: 'Remember who you really are', delay: 0.24 },
  { page: 'WeeklyReflectionPage', icon: Calendar,     iconBg: 'from-[#3C4E53] to-[#AFC7E3]', label: 'Weekly Reflection',    sub: 'Process the week that was',   delay: 0.28 },
  { page: 'GratitudeJournalPage', icon: Star,         iconBg: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Gratitude Journal',    sub: 'Name three gifts from today', delay: 0.32 },
];


// Floating chat button that navigates to ChatScreen
function ChatFAB({ bot, gradFrom, gradTo }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/ChatScreen?bot=' + bot)}
      style={{
        position: 'fixed', bottom: '6rem', right: '1rem', zIndex: 40,
        background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        color: 'white', borderRadius: '9999px', padding: '1rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '56px', height: '56px',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      title={`Chat with ${bot}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}

export default function PersonalGrowth() {
  const [user, setUser] = useState(null);
  const featured = getFeatured();
  const FeaturedIcon = featured.icon;

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto">

          {/* Page Header */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#0A1A2F] mb-1">Personal Growth</h2>
            <p className="text-sm text-[#0A1A2F]/60">Strengthen your mind, emotions, and spirit.</p>
          </div>

          {/* Featured Card — time-of-day pick */}
          <Link to={createPageUrl(featured.page)}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${featured.gradient} rounded-2xl p-5 mb-5 shadow-sm border border-[#AFC7E3]/25 cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-white/75 bg-white/15 rounded-full px-2.5 py-1">{featured.badge}</span>
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <FeaturedIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg leading-tight mb-1">{featured.label}</h3>
              <p className="text-white/75 text-sm leading-relaxed mb-4">{featured.sub}</p>
              <div className="flex items-center gap-1.5 text-white/90 text-sm font-semibold">
                Begin now <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>

          {/* Guided Meditations — wide featured card */}
          <Link to={createPageUrl('GuidedMeditationsPage')}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="bg-gradient-to-br from-[#AFC7E3]/25 to-[#3C4E53]/15 rounded-2xl p-5 mb-5 border border-[#AFC7E3]/30 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-[#0A1A2F] text-base">Guided Meditations</h3>
                    <span className="text-[10px] font-bold text-[#3C4E53] bg-[#AFC7E3]/25 rounded-full px-2 py-0.5 flex-shrink-0">26 sessions</span>
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">AI voice narration · ambient music · scripture</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0A1A2F]/40 flex-shrink-0" />
              </div>
            </motion.div>
          </Link>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-2 gap-3">
            {GRID_CARDS.map(({ page, icon: Icon, iconBg, label, sub, delay }) => (
              <Link key={page} to={createPageUrl(page)}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay }}
                  className="bg-gradient-to-br from-[#AFC7E3]/20 to-[#3C4E53]/8 rounded-xl p-4 border border-[#AFC7E3]/25 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-10 h-10 bg-gradient-to-br ${iconBg} rounded-full flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0A1A2F] leading-tight">{label}</h3>
                      <p className="text-xs text-[#0A1A2F]/55 mt-0.5 leading-tight">{sub}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

        </div>
      </div>
      <ChatFAB bot="Hannah" gradFrom="#AFC7E3" gradTo="#3C4E53" />
</div>
  );
}
