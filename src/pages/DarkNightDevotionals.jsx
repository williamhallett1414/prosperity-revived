import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, BookOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todayKey } from '@/utils/localDate';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

const DARK_NIGHT_DEVOTIONALS = [
  { day: 1, title: "When God Feels Silent", verse: "Psalm 22:1-2", text: "My God, my God, why have you forsaken me? David cried these words. Jesus quoted them on the cross. If you feel God is silent right now, you are in sacred company. Silence is not absence. Sometimes God is closest when He feels farthest — because in the silence, you learn to seek Him with everything you have, not just when it's convenient.", prompt: "When was the last time you felt God was close? What has changed since then?" },
  { day: 2, title: "The Valley", verse: "Psalm 23:4", text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Notice: David didn't say God took him around the valley. He said through. Some seasons of pain cannot be avoided — they must be walked through. But you don't walk alone. The Shepherd walks with you, even when you can't see Him.", prompt: "What valley are you walking through right now? Can you invite God into it?" },
  { day: 3, title: "Permission to Lament", verse: "Psalm 88:1-2", text: "Psalm 88 is the only psalm that ends in darkness. No resolution. No 'but God.' Just pain. God included it in His Word because He wants you to know: it's okay to hurt. It's okay to cry out. You don't have to perform faith. You can bring your raw, unfiltered anguish to God. He is not offended by your honesty.", prompt: "What would you say to God if you held nothing back?" },
  { day: 4, title: "Job's Question", verse: "Job 3:11", text: "Job lost everything — children, health, wealth, dignity. His friends told him he must have sinned. His wife told him to curse God and die. Job refused both. Instead, he asked God the hardest question: Why? God never answered why. But He showed up. Sometimes the answer isn't an explanation — it's a presence.", prompt: "What 'why' question have you been afraid to ask God?" },
  { day: 5, title: "Gethsemane", verse: "Matthew 26:38-39", text: "Jesus, the Son of God, said: My soul is overwhelmed with sorrow to the point of death. He begged His Father for another way. He sweat drops of blood. If Jesus himself trembled before suffering, you have permission to tremble too. Strength is not the absence of fear — it's choosing to trust when everything in you wants to run.", prompt: "What are you trying to carry that you need to surrender to God tonight?" },
  { day: 6, title: "Beauty from Ashes", verse: "Isaiah 61:3", text: "He gives beauty for ashes, the oil of joy for mourning, the garment of praise for the spirit of heaviness. This is not a promise that pain will disappear. It's a promise that God will make something meaningful out of what was destroyed. Your worst chapter can become someone else's survival guide — but only if you let God write the next one.", prompt: "Can you see anything — even something small — that God has built from your pain?" },
  { day: 7, title: "The God Who Weeps", verse: "John 11:35", text: "Jesus wept. He stood at the grave of His friend Lazarus — knowing He was about to raise him from the dead — and He still cried. God does not observe your pain from a distance. He enters it. He feels it. Your tears are not wasted. They are collected by a God who weeps with you.", prompt: "Have you let yourself fully feel your grief, or have you been pushing it away?" },
];

const HARD_QUESTIONS = [
  { week: 1, question: "What are you currently choosing over God and calling it necessary?", verse: "Matthew 6:33", context: "We all have something we've elevated above God — work, comfort, approval, control. The first step isn't to fix it. It's to name it honestly." },
  { week: 2, question: "If your children inherited your current faith habits, would you be satisfied?", verse: "Deuteronomy 6:6-7", context: "Your children won't follow your advice. They'll follow your example. What does your daily life teach them about who God is?" },
  { week: 3, question: "What would you do differently if you truly believed God is who He says He is?", verse: "Jeremiah 29:11", context: "Most of us live as if God might be real. Few of us live as if He definitely is. What would radical belief look like in your decisions this week?" },
  { week: 4, question: "Who have you written off that God hasn't?", verse: "Romans 5:8", context: "God loved you at your worst. Is there someone you've decided doesn't deserve your grace? That's not your call to make." },
  { week: 5, question: "What is the lie you tell yourself most often — and what does God say instead?", verse: "John 8:32", context: "I'm not enough. I'll never change. God is disappointed in me. These feel like truth. They're not. What has God actually said about you?" },
  { week: 6, question: "Are you building something that will last, or something that just feels productive?", verse: "Matthew 7:24-27", context: "Busyness is not faithfulness. Activity is not obedience. Are you building on rock or sand?" },
  { week: 7, question: "When was the last time you did something generous that no one saw?", verse: "Matthew 6:3-4", context: "Secret generosity reveals the true state of your heart. If no one would ever know, would you still give?" },
  { week: 8, question: "What conversation are you avoiding that God keeps bringing to mind?", verse: "Ephesians 4:15", context: "There's someone you need to talk to. You know who it is. What's stopping you?" },
  { week: 9, question: "Is your prayer life a monologue or a conversation?", verse: "Psalm 46:10", context: "Most of us talk to God. Few of us listen. When was the last time you sat in silence and let Him speak?" },
  { week: 10, question: "What part of yourself are you hiding from God — as if He doesn't already see it?", verse: "Psalm 139:1-4", context: "Adam hid in the garden. We still do. What are you covering up that God already knows about?" },
];

function DarkNightInner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [reflection, setReflection] = useState('');
  const today = todayKey();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: completedDays = [] } = useQuery({
    queryKey: ['darkNightProgress'],
    queryFn: () => base44.entities.JournalEntry.filter({ category: 'dark_night', created_by: user.email }),
    enabled: !!user,
  });

  const saveReflection = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create({
      ...data, category: 'dark_night', date: today,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['darkNightProgress']);
      setReflection('');
      setSelectedDay(null);
      toast.success('Your reflection has been saved');
    },
  });


  const completedDayNums = completedDays.map(d => d.title?.match(/Day (\d+)/)?.[1]).filter(Boolean).map(Number);

  if (selectedDay) {
    const dev = DARK_NIGHT_DEVOTIONALS[selectedDay - 1];
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
        <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
          <button onClick={() => setSelectedDay(null)} className="flex items-center gap-2 text-sm text-[#0A1A2F]/60 dark:text-white/60 dark:text-white/50 min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-gradient-to-br from-[#0A1A2F] to-[#1a2d4a] dark:from-white/8 dark:to-white/4 rounded-2xl p-6 border border-white/10">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Day {dev.day} of 7</p>
              <h2 className="text-xl font-bold text-white mb-1">{dev.title}</h2>
              <p className="text-xs text-[#c9a227] font-medium mb-4">{dev.verse}</p>
              <p className="text-white/80 text-sm leading-relaxed">{dev.text}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
            <p className="text-sm font-bold text-[#0A1A2F] dark:text-white mb-1">Reflection</p>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 dark:text-white/45 italic mb-3">"{dev.prompt}"</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your honest reflection..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white placeholder:text-gray-400 resize-none mb-3"
            />
            <button
              onClick={() => reflection.trim() && saveReflection.mutate({ title: `Day ${dev.day}: ${dev.title}`, content: reflection.trim(), prompt: dev.prompt })}
              disabled={!reflection.trim()}
              className="w-full py-3 rounded-xl bg-[#0A1A2F] dark:bg-white/15 text-white font-bold text-sm min-h-[44px]">
              Save Reflection
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0A1A2F] dark:text-white">Dark Night Devotionals</h1>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">For seasons of suffering and doubt</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-white/6 dark:to-white/3 rounded-2xl p-5 border border-white/10">
          <p className="text-white text-sm leading-relaxed">
            This isn't a "cheer up" devotional. This is for the valley — when God feels distant, when life doesn't make sense, when faith costs everything. These 7 readings walk through the Bible's most honest moments of pain.
          </p>
          <p className="text-white/30 text-[10px] mt-3">Psalm 34:18 — The Lord is close to the brokenhearted.</p>
        </motion.div>

        {/* Hard Questions (Coach Paul) */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3 px-1">
            <MessageCircle className="w-4 h-4 text-[#6366F1]" />
            <p className="text-xs font-bold text-[#6366F1] uppercase tracking-widest">Coach Paul's Hard Question</p>
          </div>
          {(() => {
            const weekIdx = Math.floor(Date.now() / (7 * 86400000)) % HARD_QUESTIONS.length;
            const q = HARD_QUESTIONS[weekIdx];
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-900/20 to-purple-900/15 dark:from-indigo-900/15 dark:to-purple-900/10 rounded-2xl p-5 border border-indigo-200/20 dark:border-indigo-800/20">
                <p className="text-[#0A1A2F] dark:text-white text-base font-bold leading-relaxed mb-2">
                  "{q.question}"
                </p>
                <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60 dark:text-white/50 leading-relaxed mb-2">{q.context}</p>
                <p className="text-[10px] text-[#6366F1] font-medium">{q.verse}</p>
                <button onClick={() => navigate(createPageUrl(`ChatScreen?bot=CoachPaul`))}
                  className="mt-3 w-full py-2.5 rounded-xl bg-[#6366F1]/15 text-[#6366F1] font-bold text-xs min-h-[44px] hover:bg-[#6366F1]/25 transition-all">
                  Discuss with Coach Paul →
                </button>
              </motion.div>
            );
          })()}
        </div>

        {/* 7-Day Devotional List */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/30 uppercase tracking-widest px-1">7-Day Journey</p>
          {DARK_NIGHT_DEVOTIONALS.map((dev, i) => {
            const done = completedDayNums.includes(dev.day);
            return (
              <motion.button key={dev.day}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedDay(dev.day)}
                className="w-full text-left bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10 flex items-center gap-3 hover:shadow-md transition-all">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  done ? 'bg-green-100 dark:bg-green-900/25 text-green-600' : 'bg-[#0A1A2F]/8 dark:bg-white/10 text-[#0A1A2F]/60 dark:text-white/50'
                }`}>
                  {done ? '✓' : dev.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white truncate">{dev.title}</p>
                  <p className="text-[10px] text-[#c9a227]">{dev.verse}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 flex-shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DarkNightDevotionals() {
  return <PageErrorBoundary><DarkNightInner /></PageErrorBoundary>;
}

class PageErrorBoundary extends React.Component {
  constructor(p){super(p);this.state={e:null};}
  static getDerivedStateFromError(e){return{e};}
  render(){if(this.state.e)return<div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6"><p className="text-lg font-bold dark:text-white mb-2">Something went wrong</p><button onClick={()=>this.setState({e:null})} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button></div>;return this.props.children;}
}
