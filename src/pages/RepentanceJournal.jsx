import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Heart, Trash2, Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { todayKey } from '@/utils/localDate';
import { toast } from 'sonner';

const PROMPTS = {
  repentance: [
    "What habit or pattern am I holding onto that I know doesn't honor God?",
    "Is there something I said recently that I wish I could take back?",
    "Where have I chosen comfort over obedience this week?",
    "Am I being honest with myself about an area where I've fallen short?",
    "What would I confess if no one would ever know?",
    "Have I been living as if I need God, or as if I'm doing fine on my own?",
  ],
  forgiveness: [
    "Who am I holding a grudge against, even quietly?",
    "Is there someone I avoid because of unresolved hurt?",
    "What bitterness am I carrying that's weighing me down?",
    "Can I pray for the person who hurt me — genuinely?",
    "Am I waiting for an apology that may never come? Can I release it anyway?",
    "Have I forgiven myself for past mistakes, or am I still punishing myself?",
  ],
};

function RepentanceJournalInner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('repentance');
  const [showNew, setShowNew] = useState(false);
  const [entry, setEntry] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const today = todayKey();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  useEffect(() => {
    setPromptIdx(Math.floor(Date.now() / 86400000) % PROMPTS[tab].length);
  }, [tab]);

  const { data: entries = [] } = useQuery({
    queryKey: ['repentanceEntries', tab],
    queryFn: () => base44.entities.RepentanceEntry.filter({ category: tab, created_by: user.email }),
    enabled: !!user,
  });

  const saveEntry = useMutation({
    mutationFn: (text) => base44.entities.RepentanceEntry.create({
      text, category: tab, date: today,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['repentanceEntries']);
      setEntry('');
      setShowNew(false);
      toast.success(tab === 'repentance' ? 'God hears your heart' : 'Freedom is coming');
    },
  });

  const deleteEntry = useMutation({
    mutationFn: (id) => base44.entities.RepentanceEntry.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['repentanceEntries']),
  });

  if (!user) {
    return <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#0A1A2F] dark:text-white">Heart Journal</h1>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Private. Encrypted. Between you and God.</p>
          </div>
          <Lock className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
        </div>

        {/* Privacy banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-[#0A1A2F]/5 dark:bg-white/5 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#0A1A2F]/40 dark:text-white/40 flex-shrink-0" />
          <p className="text-[10px] text-[#0A1A2F]/50 dark:text-white/45 leading-relaxed">
            These entries are completely private. They never appear in your community feed, profile, or coach conversations.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-[#0A1A2F]/5 dark:bg-white/5 rounded-xl p-1">
          {[
            { key: 'repentance', label: 'Repentance', icon: '🕊️' },
            { key: 'forgiveness', label: 'Forgiveness', icon: '❤️‍🩹' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                tab === t.key ? 'bg-[#0A1A2F] dark:bg-white/15 text-white shadow-sm' : 'text-[#0A1A2F]/50 dark:text-white/40'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Daily Prompt */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0A1A2F] to-[#1a3050] dark:from-white/8 dark:to-white/4 rounded-2xl p-5 border border-white/10">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Today's Reflection</p>
          <p className="text-white text-sm leading-relaxed font-medium italic">
            "{PROMPTS[tab][promptIdx]}"
          </p>
          <p className="text-white/30 text-[10px] mt-3">
            {tab === 'repentance' ? '1 John 1:9 — If we confess our sins, He is faithful and just to forgive us.' : 'Colossians 3:13 — Bear with each other and forgive one another.'}
          </p>
        </motion.div>

        {/* New Entry */}
        {showNew ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder={tab === 'repentance' ? "What do you need to lay down before God?" : "Who or what do you need to release?"}
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white placeholder:text-gray-400 resize-none mb-3"
            />
            <div className="flex gap-2">
              <Button onClick={() => setShowNew(false)} variant="outline" className="flex-1 min-h-[44px] dark:border-white/10 dark:text-white">Cancel</Button>
              <Button
                onClick={() => entry.trim() && saveEntry.mutate(entry.trim())}
                disabled={!entry.trim() || saveEntry.isPending}
                className="flex-1 bg-[#0A1A2F] dark:bg-white/15 text-white min-h-[44px]"
              >
                {saveEntry.isPending ? 'Saving...' : 'Save to God'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <button onClick={() => setShowNew(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-[#0A1A2F]/15 dark:border-white/10 text-sm font-medium text-[#0A1A2F]/50 dark:text-white/40 hover:border-[#0A1A2F]/30 dark:hover:border-white/20 transition-all min-h-[44px] flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Write an Entry
          </button>
        )}

        {/* Past Entries */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/30 uppercase tracking-widest px-1">Past Entries</p>
            {entries.sort((a, b) => b.id - a.id).map(e => (
              <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10 group">
                <p className="text-sm text-[#0A1A2F]/80 dark:text-white/75 leading-relaxed">{e.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/25">{e.date}</p>
                  <button onClick={() => { if (window.confirm('Delete this entry?')) deleteEntry.mutate(e.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

class PageErrorBoundary extends React.Component {
  constructor(p){super(p);this.state={e:null};}
  static getDerivedStateFromError(e){return{e};}
  render(){if(this.state.e)return<div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6"><p className="text-lg font-bold dark:text-white mb-2">Something went wrong</p><button onClick={()=>this.setState({e:null})} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button></div>;return this.props.children;}
}

export default function RepentanceJournal() {
  return <PageErrorBoundary><RepentanceJournalInner /></PageErrorBoundary>;
}