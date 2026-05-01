import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

import { createPageUrl } from '@/utils';
import {
  Heart, Users, Copy, CheckCircle, BookOpen, MessageCircle,
  Target, Sparkles, ChevronRight, RefreshCw, Send, Lock
} ArrowLeft } from 'lucide-react';
import { getVerseOfDay } from '@/components/bible/BibleData';

// ─── Partner linking helpers ──────────────────────────────────────────────────
function generateInviteCode() {
  return 'PR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── Couples devotional prompts ───────────────────────────────────────────────
const COUPLES_DEVOTIONALS = [
  { day: 1,  title: 'Foundation of Love',      verse: '1 Corinthians 13:4-7', prompt: 'What does patient love look like in our daily life together?' },
  { day: 2,  title: 'Communication',            verse: 'Proverbs 18:13',      prompt: 'When do I feel most heard by you? When do I struggle to listen?' },
  { day: 3,  title: 'Forgiveness',              verse: 'Colossians 3:13',     prompt: 'Is there anything unresolved between us that we can release tonight?' },
  { day: 4,  title: 'Serving Each Other',       verse: 'Galatians 5:13',      prompt: 'How can I serve you better this week? What act of service means most to you?' },
  { day: 5,  title: 'Gratitude for Each Other', verse: 'Philippians 1:3',     prompt: 'Name 3 specific things you appreciate about your partner.' },
  { day: 6,  title: 'Praying Together',         verse: 'Matthew 18:19-20',    prompt: 'What is one thing we can agree to pray for together this week?' },
  { day: 7,  title: 'Growing Together',         verse: 'Ecclesiastes 4:9-10', prompt: 'Where do we want to be as a couple one year from now?' },
  { day: 8,  title: 'Trust & Vulnerability',    verse: 'Proverbs 3:5-6',      prompt: 'What makes you feel safe enough to be vulnerable with me?' },
  { day: 9,  title: 'Conflict Resolution',      verse: 'Ephesians 4:26-27',   prompt: 'How can we fight more fairly? What ground rules should we set?' },
  { day: 10, title: 'Intimacy & Connection',    verse: 'Song of Solomon 8:6', prompt: 'What makes you feel most connected to me — emotionally and spiritually?' },
  { day: 11, title: 'Shared Purpose',           verse: 'Amos 3:3',            prompt: 'What mission or purpose do we share as a couple?' },
  { day: 12, title: 'Financial Stewardship',    verse: 'Proverbs 21:5',       prompt: 'How can we be better stewards of what God has given us together?' },
  { day: 13, title: 'Encouraging Words',        verse: 'Hebrews 3:13',        prompt: 'Write your partner a short note of encouragement right now.' },
  { day: 14, title: 'Legacy & Future',          verse: 'Psalm 127:1',         prompt: 'What legacy do we want to build together? What does our future look like?' },
];

const DATE_IDEAS = [
  { emoji: '🌅', title: 'Sunrise Prayer Walk', desc: 'Wake up early, walk together, and pray for each other.' },
  { emoji: '📖', title: 'Bible Study Date', desc: 'Pick a book of the Bible and read a chapter together over coffee.' },
  { emoji: '🍳', title: 'Cook Together Night', desc: 'Try a new recipe. No phones. Just conversation and chopping.' },
  { emoji: '📝', title: 'Letter Writing', desc: 'Write each other a handwritten letter. Read them aloud.' },
  { emoji: '🏃', title: 'Active Date', desc: 'Hike, bike, or workout together. Push each other.' },
  { emoji: '🙏', title: 'Service Date', desc: 'Volunteer together at a local shelter, food bank, or church.' },
  { emoji: '🎵', title: 'Worship Night', desc: 'Put on worship music, sing together, pray over your home.' },
  { emoji: '🌙', title: 'Stargazing + Psalms', desc: 'Go outside, look at the stars, read Psalm 19 together.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CouplesMode() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [inviteCode, setInviteCode] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [prayerText, setPrayerText] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const partnerEmail = user?.partner_email || null;
  const isLinked = !!partnerEmail;
  const myCode = user?.couples_invite_code || null;

  // Generate invite code
  const generateCode = useMutation({
    mutationFn: async () => {
      const code = generateInviteCode();
      await base44.auth.updateMe({ couples_invite_code: code });
      return code;
    },
    onSuccess: (code) => {
      setInviteCode(code);
      queryClient.invalidateQueries(['user']);
      toast.success('Invite code generated!');
    },
    onError: () => toast.error('Failed to generate code'),
  });

  // Link partner via code
  const linkPartner = useMutation({
    mutationFn: async (code) => {
      // In production, this would search for the user with this invite code
      // and create a bidirectional link. For now, we store the intent.
      await base44.auth.updateMe({
        partner_invite_entered: code,
        couples_mode_enabled: true,
      });
    },
    onSuccess: () => {
      toast.success('Partner code submitted! You\'ll be linked once they confirm.');
      setPartnerCode('');
    },
    onError: () => toast.error('Invalid code or partner not found'),
  });

  // Shared prayer wall
  const { data: sharedPrayers = [] } = useQuery({
    queryKey: ['couplesPrayers', user?.email],
    queryFn: async () => {
      try {
        const mine = await base44.entities.JournalEntry.filter({
          created_by: user?.email,
          entry_type: 'couples_prayer',
        });
        return mine.sort((a, b) => (b.created_date || '').localeCompare(a.created_date || ''));
      } catch { return []; }
    },
    enabled: !!user?.email,
  });

  const addPrayer = useMutation({
    mutationFn: async (text) => {
      return base44.entities.JournalEntry.create({
        title: 'Couples Prayer',
        content: text,
        entry_type: 'couples_prayer',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['couplesPrayers']);
      setPrayerText('');
      toast.success('Prayer added');
    },
  });

  const verse = getVerseOfDay();
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const todayDevotional = COUPLES_DEVOTIONALS[dayOfYear % COUPLES_DEVOTIONALS.length];
  const todayDate = DATE_IDEAS[dayOfYear % DATE_IDEAS.length];

  const TABS = [
    { id: 'home', label: 'Together', icon: Heart },
    { id: 'devotional', label: 'Devotional', icon: BookOpen },
    { id: 'prayer', label: 'Prayer Wall', icon: MessageCircle },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#F472B6] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Couples Mode</h1>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Grow closer together</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {/* ══ HOME TAB ══ */}
        {activeTab === 'home' && (
          <>
            {/* Partner linking */}
            {!isLinked && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-rose-100 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-rose-500" />
                  <h3 className="font-bold text-[#0A1A2F] dark:text-white text-sm">Link Your Partner</h3>
                </div>

                {/* Generate code */}
                <div className="mb-4">
                  <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mb-2">Share your invite code:</p>
                  {myCode || inviteCode ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl px-4 py-3 font-mono font-bold text-[#0A1A2F] dark:text-white text-center tracking-widest">
                        {myCode || inviteCode}
                      </div>
                      <button onClick={() => {
                        navigator.clipboard.writeText(myCode || inviteCode);
                        toast.success('Code copied!');
                      }} className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => generateCode.mutate()}
                      disabled={generateCode.isPending}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-400 text-white font-bold text-sm rounded-xl shadow-sm dark:shadow-none">
                      {generateCode.isPending ? 'Generating...' : 'Generate Invite Code'}
                    </button>
                  )}
                </div>

                {/* Enter partner's code */}
                <div>
                  <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mb-2">Or enter your partner's code:</p>
                  <div className="flex gap-2">
                    <input
                      value={partnerCode}
                      onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                      placeholder="PR-XXXXXX"
                      maxLength={9}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] border border-gray-200 dark:border-white/10 text-sm font-mono tracking-wider text-center focus:outline-none focus:border-rose-300"
                    />
                    <button onClick={() => linkPartner.mutate(partnerCode)}
                      disabled={!partnerCode.trim() || linkPartner.isPending}
                      className="px-4 py-2.5 bg-[#0A1A2F] text-white text-sm font-bold rounded-xl disabled:opacity-40">
                      Link
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Today's Scripture (shared) */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:to-pink-900/10 rounded-2xl p-5 border border-rose-100/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-rose-400 rounded-full" />
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Today's Verse Together</span>
                </div>
                <p className="text-[#0A1A2F] dark:text-white text-sm leading-relaxed italic mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  "{verse.text}"
                </p>
                <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">{verse.book} {verse.chapter}:{verse.verse}</p>
                <p className="text-xs text-rose-400 mt-3 font-semibold">
                  Read this together. Discuss what it means for your relationship.
                </p>
              </div>
            </motion.div>

            {/* Date night suggestion */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
                <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">Date Night Idea</p>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{todayDate.emoji}</span>
                  <div>
                    <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">{todayDate.title}</p>
                    <p className="text-xs text-[#0A1A2F]/55 dark:text-white/55 mt-0.5 leading-relaxed">{todayDate.desc}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const { shareContent } = await import('@/utils/sharing');
                    const result = await shareContent({
                      title: `Date Night: ${todayDate.title}`,
                      text: `${todayDate.desc}\n\nFrom Prosperity Revived Couples Mode 💕`,
                    });
                    if (result.method === 'clipboard') toast.success('Copied!');
                  }}
                  className="mt-3 w-full py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-xs font-bold rounded-xl">
                  Share with Partner 💕
                </button>
              </div>
            </motion.div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('devotional')}
                className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none text-left">
                <BookOpen className="w-5 h-5 text-rose-400 mb-2" />
                <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Devotional</p>
                <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">Day {todayDevotional.day}</p>
              </button>
              <button onClick={() => setActiveTab('prayer')}
                className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none text-left">
                <MessageCircle className="w-5 h-5 text-rose-400 mb-2" />
                <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Prayer Wall</p>
                <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">{sharedPrayers.length} prayers</p>
              </button>
            </div>
          </>
        )}

        {/* ══ DEVOTIONAL TAB ══ */}
        {activeTab === 'devotional' && (
          <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-rose-500 to-pink-400 rounded-2xl p-6 text-white shadow-md dark:shadow-none">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Day {todayDevotional.day} of 14</p>
              <h2 className="text-xl font-black mb-1">{todayDevotional.title}</h2>
              <p className="text-white/70 text-sm">{todayDevotional.verse}</p>
            </motion.div>

            <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none space-y-4">
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-2">Discussion Prompt</p>
                <p className="text-[#0A1A2F] dark:text-white text-sm leading-relaxed">{todayDevotional.prompt}</p>
              </div>
              <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl p-4">
                <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mb-1 font-semibold">How to use this:</p>
                <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40 leading-relaxed">
                  Read the scripture together. Take turns answering the prompt honestly.
                  Listen without interrupting. End with prayer for each other.
                </p>
              </div>
            </div>

            {/* All 14 days overview */}
            <div>
              <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">14-Day Journey</p>
              <div className="space-y-2">
                {COUPLES_DEVOTIONALS.map((d, i) => {
                  const isCurrent = d.day === todayDevotional.day;
                  const isPast = d.day < todayDevotional.day;
                    if (!user) {
                      return (
                        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                        </div>
                      );
                    }

                  return (
                    <div key={d.day}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isCurrent ? 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200' : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10'
                      }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        isPast ? 'bg-green-100 dark:bg-green-900/25 text-green-600' :
                        isCurrent ? 'bg-rose-50 dark:bg-rose-900/200 text-white' :
                        'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-300'
                      }`}>
                        {isPast ? <CheckCircle className="w-3.5 h-3.5" /> : d.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${isCurrent ? 'text-rose-600' : 'text-[#0A1A2F] dark:text-white dark:text-white'} truncate`}>{d.title}</p>
                        <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35">{d.verse}</p>
                      </div>
                      {isCurrent && <Sparkles className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ══ PRAYER WALL TAB ══ */}
        {activeTab === 'prayer' && (
          <>
            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
              <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">
                <Lock className="w-3 h-3 inline mr-1" />
                Private Prayer Wall
              </p>
              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Share a prayer request or praise..."
                maxLength={500}
                className="w-full p-3 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] border border-gray-200 dark:border-white/10 text-sm resize-none focus:outline-none focus:border-rose-300"
                rows={3}
              />
              <button onClick={() => { if (prayerText.trim()) addPrayer.mutate(prayerText.trim()); }}
                disabled={!prayerText.trim() || addPrayer.isPending}
                className="mt-2 w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-400 text-white font-bold text-sm rounded-xl disabled:opacity-40 flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" /> Add to Prayer Wall
              </button>
            </div>

            {sharedPrayers.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-400 dark:text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 dark:text-gray-300 font-semibold">No prayers yet</p>
                <p className="text-xs text-gray-300 dark:text-gray-400 dark:text-gray-300 mt-1">Start by sharing what's on your heart.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sharedPrayers.map((prayer, i) => (
                  <motion.div key={prayer.id || i}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
                    <p className="text-sm text-[#0A1A2F] dark:text-white leading-relaxed">{prayer.content}</p>
                    <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 mt-2">
                      {new Date(prayer.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ GOALS TAB ══ */}
        {activeTab === 'goals' && (
          <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-[#0A1A2F] dark:text-white dark:text-white">Joint Goals</h3>
              </div>
              <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mb-4">Set goals you'll pursue together as a couple.</p>

              {[
                { emoji: '📖', label: 'Read through a book of the Bible together', category: 'spiritual' },
                { emoji: '🙏', label: 'Pray together every night for 30 days', category: 'spiritual' },
                { emoji: '💪', label: 'Work out together 3x per week', category: 'fitness' },
                { emoji: '🍽️', label: 'Cook healthy meals together on Sundays', category: 'nutrition' },
                { emoji: '📅', label: 'Weekly date night (no phones)', category: 'relationship' },
                { emoji: '💰', label: 'Save for a shared financial goal', category: 'stewardship' },
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
                  <span className="text-lg">{goal.emoji}</span>
                  <p className="text-sm text-[#0A1A2F] dark:text-white flex-1">{goal.label}</p>
                  <button className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-[10px] font-bold rounded-full">
                    Start
                  </button>
                </div>
              ))}
            </motion.div>

            {/* Date ideas library */}
            <div>
              <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">Date Night Ideas</p>
              <div className="grid grid-cols-2 gap-3">
                {DATE_IDEAS.map((idea, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
                    <span className="text-2xl block mb-2">{idea.emoji}</span>
                    <p className="text-xs font-bold text-[#0A1A2F] dark:text-white mb-0.5">{idea.title}</p>
                    <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 leading-relaxed">{idea.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

