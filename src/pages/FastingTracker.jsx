import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Square, Clock, Flame, BookOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todayKey } from '@/utils/localDate';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FAST_TYPES = [
  { id: 'food', label: 'Food Fast', emoji: '🍽️', desc: 'Skip one or more meals, replacing them with prayer', verse: 'Matthew 6:16-18' },
  { id: 'social_media', label: 'Social Media Fast', emoji: '📱', desc: 'Step away from social media to hear God clearly', verse: 'Psalm 46:10' },
  { id: 'entertainment', label: 'Entertainment Fast', emoji: '📺', desc: 'Replace TV, gaming, or streaming with Scripture and prayer', verse: 'Romans 12:2' },
  { id: 'complaining', label: 'Complaining Fast', emoji: '🤐', desc: 'Replace every complaint with a gratitude or prayer', verse: 'Philippians 2:14-15' },
  { id: 'spending', label: 'Spending Fast', emoji: '💰', desc: 'Only essentials — give the rest to someone in need', verse: 'Isaiah 58:6-7' },
  { id: 'custom', label: 'Custom Fast', emoji: '✨', desc: 'Define your own spiritual discipline', verse: 'Isaiah 58:6' },
];

const DURATIONS = [
  { value: 1, label: '1 Day' }, { value: 3, label: '3 Days' },
  { value: 7, label: '1 Week' }, { value: 14, label: '2 Weeks' },
  { value: 21, label: '21 Days (Daniel Fast)' }, { value: 40, label: '40 Days' },
];

const DAILY_PROMPTS = [
  "What is God teaching you through this emptiness?",
  "What has this fast revealed about what you depend on?",
  "How has the discomfort pointed you toward God today?",
  "What prayers have been filling the space left by what you gave up?",
  "Is there something God is asking you to surrender permanently?",
  "What Scripture has spoken to you most during this fast?",
  "How has fasting changed the way you pray?",
];

function FastingTrackerInner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [fastType, setFastType] = useState('food');
  const [duration, setDuration] = useState(3);
  const [intention, setIntention] = useState('');
  const [journalText, setJournalText] = useState('');
  const today = todayKey();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: fasts = [] } = useQuery({
    queryKey: ['fasts'],
    queryFn: () => base44.entities.FastingLog.filter({ created_by: user.email }),
    enabled: !!user,
  });

  const createFast = useMutation({
    mutationFn: (data) => base44.entities.FastingLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fasts']);
      setShowNew(false);
      setIntention('');
      toast.success('Your fast has begun. God sees your sacrifice.');
    },
  });

  const updateFast = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FastingLog.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['fasts']),
  });


  const activeFast = fasts.find(f => f.status === 'active');
  const completedFasts = fasts.filter(f => f.status === 'completed');

  const getDaysIn = (fast) => {
    const start = new Date(fast.start_date);
    const now = new Date();
    return Math.floor((now - start) / 86400000) + 1;
  };

  const promptIdx = Math.floor(Date.now() / 86400000) % DAILY_PROMPTS.length;

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0A1A2F] dark:text-white">Fasting</h1>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Draw near to God through sacrifice</p>
          </div>
        </div>

        {/* Scripture banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-900/20 to-orange-900/15 dark:from-amber-900/15 dark:to-orange-900/10 rounded-2xl p-5 border border-amber-200/20 dark:border-amber-800/20">
          <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60 dark:text-white/50 italic leading-relaxed">
            "When you fast, do not look somber as the hypocrites do. But when you fast, put oil on your head and wash your face, so that it will not be obvious to others that you are fasting, but only to your Father, who is unseen."
          </p>
          <p className="text-[10px] text-[#c9a227] font-medium mt-2">Matthew 6:16-18</p>
        </motion.div>

        {/* Active Fast */}
        {activeFast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-[#c9a227]/20 dark:border-[#c9a227]/10 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest">Active Fast</p>
                <h3 className="text-lg font-bold text-[#0A1A2F] dark:text-white mt-0.5">
                  {FAST_TYPES.find(t => t.id === activeFast.fast_type)?.emoji} {FAST_TYPES.find(t => t.id === activeFast.fast_type)?.label}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#c9a227]">{getDaysIn(activeFast)}</p>
                <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/35">of {activeFast.duration} days</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[#0A1A2F]/8 dark:bg-white/8 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((getDaysIn(activeFast) / activeFast.duration) * 100, 100)}%` }}
                className="h-full bg-gradient-to-r from-[#c9a227] to-[#FD9C2D] rounded-full"
              />
            </div>

            {activeFast.intention && (
              <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60 dark:text-white/50 italic mb-3">Intention: "{activeFast.intention}"</p>
            )}

            {/* Daily prompt */}
            <div className="bg-[#F2F6FA] dark:bg-white/5 rounded-xl p-3 mb-3">
              <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/30 uppercase tracking-widest mb-1">Today's Reflection</p>
              <p className="text-xs text-[#0A1A2F]/70 dark:text-white/70 dark:text-white/60 italic">"{DAILY_PROMPTS[promptIdx]}"</p>
            </div>

            {/* Journal for today */}
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="What is God showing you today?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white placeholder:text-gray-400 resize-none mb-2"
            />
            <div className="flex gap-2">
              <Button onClick={() => {
                if (journalText.trim()) {
                  base44.entities.JournalEntry.create({
                    title: `Fast Day ${getDaysIn(activeFast)}: ${FAST_TYPES.find(t => t.id === activeFast.fast_type)?.label}`,
                    content: journalText.trim(),
                    category: 'fasting',
                    date: today,
                  });
                  setJournalText('');
                  toast.success('Fasting reflection saved');
                }
              }} disabled={!journalText.trim()} className="flex-1 bg-[#c9a227] text-white min-h-[44px]">
                Save Reflection
              </Button>
              {getDaysIn(activeFast) >= activeFast.duration && (
                <Button onClick={() => {
                  updateFast.mutate({ id: activeFast.id, data: { status: 'completed', end_date: today } });
                  toast.success('Fast complete! God honors your sacrifice. 🙌');
                }} className="bg-green-600 text-white min-h-[44px]">
                  <Flame className="w-4 h-4 mr-1" /> Complete
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Start New Fast */}
        {!activeFast && !showNew && (
          <button onClick={() => setShowNew(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-[#c9a227]/25 dark:border-[#c9a227]/15 text-[#c9a227] font-bold text-sm hover:bg-[#c9a227]/5 transition-all min-h-[44px] flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Begin a Fast
          </button>
        )}

        {/* New Fast Form */}
        {showNew && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold text-[#0A1A2F] dark:text-white">Choose Your Fast</h3>

            <div className="grid grid-cols-2 gap-2">
              {FAST_TYPES.map(ft => (
                <button key={ft.id} onClick={() => setFastType(ft.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    fastType === ft.id
                      ? 'border-[#c9a227] bg-[#c9a227]/10 dark:bg-[#c9a227]/5'
                      : 'border-gray-100 dark:border-white/10 hover:border-gray-200'
                  }`}>
                  <span className="text-xl">{ft.emoji}</span>
                  <p className="text-xs font-bold text-[#0A1A2F] dark:text-white mt-1">{ft.label}</p>
                  <p className="text-[9px] text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/35 mt-0.5">{ft.verse}</p>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium text-[#0A1A2F]/60 dark:text-white/60 dark:text-white/50 mb-1.5">Duration</p>
              <div className="flex flex-wrap gap-1.5">
                {DURATIONS.map(d => (
                  <button key={d.value} onClick={() => setDuration(d.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      duration === d.value
                        ? 'bg-[#c9a227] text-white'
                        : 'bg-[#0A1A2F]/5 dark:bg-white/8 text-[#0A1A2F]/60 dark:text-white/50'
                    }`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#0A1A2F]/60 dark:text-white/60 dark:text-white/50 mb-1.5">Your Intention (optional)</p>
              <input
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What are you seeking God for?"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowNew(false)} variant="outline" className="flex-1 min-h-[44px] dark:border-white/10 dark:text-white">Cancel</Button>
              <Button onClick={() => createFast.mutate({
                fast_type: fastType,
                duration,
                intention: intention.trim(),
                start_date: today,
                status: 'active',
              })} className="flex-1 bg-[#c9a227] text-white min-h-[44px]">
                Begin Fast
              </Button>
            </div>
          </motion.div>
        )}

        {/* Completed Fasts */}
        {completedFasts.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/30 uppercase tracking-widest px-1">Completed Fasts</p>
            {completedFasts.map(f => (
              <div key={f.id} className="bg-white dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/10 flex items-center gap-3">
                <span className="text-xl">{FAST_TYPES.find(t => t.id === f.fast_type)?.emoji || '✨'}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white">{FAST_TYPES.find(t => t.id === f.fast_type)?.label}</p>
                  <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/35">{f.duration} days · {f.start_date}</p>
                </div>
                <span className="text-green-500 text-xs font-bold">✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FastingTracker() {
  return <PageErrorBoundary><FastingTrackerInner /></PageErrorBoundary>;
}

class PageErrorBoundary extends React.Component {
  constructor(p){super(p);this.state={e:null};}
  static getDerivedStateFromError(e){return{e};}
  render(){if(this.state.e)return<div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6"><p className="text-lg font-bold dark:text-white mb-2">Something went wrong</p><button onClick={()=>this.setState({e:null})} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button></div>;return this.props.children;}
}
