import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, BarChart3, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { todayKey } from '@/utils/localDate';
import { toast } from 'sonner';

const QUESTIONS = [
  { id: 'prayer', category: 'Prayer Life', question: 'How often do you pray?', options: ['Rarely', 'Weekly', 'A few times a week', 'Daily', 'Multiple times daily'], weights: [1, 2, 3, 4, 5] },
  { id: 'bible', category: 'Bible Engagement', question: 'How often do you read the Bible?', options: ['Almost never', 'Monthly', 'Weekly', 'A few times a week', 'Daily'], weights: [1, 2, 3, 4, 5] },
  { id: 'community', category: 'Community', question: 'How connected are you to a faith community?', options: ['Not at all', 'I attend sometimes', 'Regular attender', 'Active member', 'Leading/serving'], weights: [1, 2, 3, 4, 5] },
  { id: 'generosity', category: 'Generosity', question: 'How would you describe your giving?', options: ['I rarely give', 'Occasionally', 'Regular tither', 'Generous beyond tithe', 'Sacrificial giving'], weights: [1, 2, 3, 4, 5] },
  { id: 'forgiveness', category: 'Forgiveness', question: 'How quickly do you forgive others?', options: ['I hold grudges', 'It takes a long time', 'Eventually', 'Fairly quickly', 'I release it to God immediately'], weights: [1, 2, 3, 4, 5] },
  { id: 'purpose', category: 'Purpose', question: 'How clear is your sense of God-given purpose?', options: ['No idea', 'Searching', 'Starting to see it', 'Fairly clear', 'Walking in it daily'], weights: [1, 2, 3, 4, 5] },
  { id: 'worship', category: 'Worship', question: 'How often do you worship outside of church?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'It\'s a daily rhythm'], weights: [1, 2, 3, 4, 5] },
  { id: 'obedience', category: 'Obedience', question: 'When you feel God prompting you, how do you respond?', options: ['I usually ignore it', 'I hesitate a lot', 'Sometimes I act', 'Usually I obey', 'Immediate obedience'], weights: [1, 2, 3, 4, 5] },
  { id: 'sharing', category: 'Sharing Faith', question: 'How comfortable are you sharing your faith?', options: ['Very uncomfortable', 'Nervous', 'Okay with close friends', 'Fairly confident', 'Naturally share it'], weights: [1, 2, 3, 4, 5] },
  { id: 'trust', category: 'Trust in God', question: 'When life gets hard, where do you turn first?', options: ['Panic/anxiety', 'My own efforts', 'Friends/family', 'Prayer eventually', 'God is my first call'], weights: [1, 2, 3, 4, 5] },
];

function SpiritualAssessmentInner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(-1); // -1 = intro, 0-9 = questions, 10 = results
  const [answers, setAnswers] = useState({});
  const today = todayKey();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: pastAssessments = [] } = useQuery({
    queryKey: ['spiritualAssessments'],
    queryFn: () => base44.entities.SpiritualAssessment.filter({ created_by: user.email }),
    enabled: !!user,
  });


  const lastAssessment = pastAssessments.sort((a, b) => b.id - a.id)[0];
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = QUESTIONS.length * 5;
  const pct = Math.round((totalScore / maxScore) * 100);

  const getLevel = (score) => {
    const p = (score / maxScore) * 100;
    if (p >= 85) return { label: 'Deeply Rooted', color: '#22C55E', emoji: '🌳' };
    if (p >= 70) return { label: 'Growing Strong', color: '#84CC16', emoji: '🌿' };
    if (p >= 50) return { label: 'Budding Faith', color: '#FBBF24', emoji: '🌱' };
    if (p >= 30) return { label: 'Seeking', color: '#F97316', emoji: '🔍' };
    return { label: 'Beginning', color: '#EF4444', emoji: '🌅' };
  };

  const saveAssessment = async () => {
    await base44.entities.SpiritualAssessment.create({
      answers: JSON.stringify(answers),
      total_score: totalScore,
      max_score: maxScore,
      date: today,
    });
    queryClient.invalidateQueries(['spiritualAssessments']);
    toast.success('Assessment saved! Revisit in 90 days to see your growth.');
  };

  // Intro
  if (step === -1) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
        <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0A1A2F] to-[#1a3050] dark:from-white/8 dark:to-white/4 rounded-2xl p-6 border border-white/10 text-center">
            <span className="text-4xl block mb-3">🌱</span>
            <h1 className="text-xl font-bold text-white mb-2">Where are you in your walk?</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              10 honest questions about your faith journey. No right or wrong answers — just an honest look at where you are so you can see where God takes you.
            </p>
            <p className="text-white/30 text-[10px] mb-5">Takes about 3 minutes</p>
            <Button onClick={() => setStep(0)} className="w-full bg-[#c9a227] text-white text-base py-3 rounded-xl min-h-[44px]">
              Begin Assessment
            </Button>
          </motion.div>

          {/* Past Results */}
          {pastAssessments.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest px-1">Past Assessments</p>
              {pastAssessments.sort((a, b) => b.id - a.id).slice(0, 5).map(a => {
                const lvl = getLevel(a.total_score);
                const apct = Math.round((a.total_score / a.max_score) * 100);
                return (
                  <div key={a.id} className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10 flex items-center gap-3">
                    <span className="text-2xl">{lvl.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#0A1A2F] dark:text-white">{lvl.label}</p>
                      <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/35">{a.date} · {apct}% ({a.total_score}/{a.max_score})</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center" style={{ borderColor: lvl.color }}>
                      <span className="text-xs font-black" style={{ color: lvl.color }}>{apct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Questions
  if (step < QUESTIONS.length) {
    const q = QUESTIONS[step];
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
        <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(s => s - 1)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
            </button>
            <div className="flex-1 h-1.5 bg-[#0A1A2F]/8 dark:bg-white/8 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                className="h-full bg-[#c9a227] rounded-full" />
            </div>
            <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 dark:text-white/35">{step + 1}/{QUESTIONS.length}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-4">
              <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
                <p className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest mb-2">{q.category}</p>
                <p className="text-lg font-bold text-[#0A1A2F] dark:text-white leading-snug">{q.question}</p>
              </div>

              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <motion.button key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => {
                      setAnswers(prev => ({ ...prev, [q.id]: q.weights[i] }));
                      setTimeout(() => setStep(s => s + 1), 300);
                    }}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all min-h-[44px] ${
                      answers[q.id] === q.weights[i]
                        ? 'border-[#c9a227] bg-[#c9a227]/10 dark:bg-[#c9a227]/5'
                        : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200'
                    }`}
                  >
                    <p className="text-sm font-medium text-[#0A1A2F] dark:text-white">{opt}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Results
  const level = getLevel(totalScore);
  const lastLevel = lastAssessment ? getLevel(lastAssessment.total_score) : null;
  const lastPct = lastAssessment ? Math.round((lastAssessment.total_score / lastAssessment.max_score) * 100) : null;
  const growth = lastPct !== null ? pct - lastPct : null;

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#0A1A2F] to-[#1a3050] dark:from-white/8 dark:to-white/4 rounded-2xl p-6 border border-white/10 text-center">
          <span className="text-5xl block mb-3">{level.emoji}</span>
          <h2 className="text-2xl font-black text-white mb-1">{level.label}</h2>
          <p className="text-4xl font-black mb-1" style={{ color: level.color }}>{pct}%</p>
          <p className="text-white/40 text-xs mb-4">{totalScore} out of {maxScore} points</p>

          {growth !== null && (
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              growth > 0 ? 'bg-green-500/20 text-green-400' : growth < 0 ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {growth > 0 ? `↑ ${growth}% growth` : growth < 0 ? `↓ ${Math.abs(growth)}%` : 'No change'}
              {growth > 0 && ' since last assessment'}
            </div>
          )}
        </motion.div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 space-y-3">
          <p className="text-xs font-bold text-[#0A1A2F]/50 dark:text-white/50 dark:text-white/40 uppercase tracking-widest">Breakdown</p>
          {QUESTIONS.map(q => {
            const score = answers[q.id] || 0;
            const oldScore = lastAssessment ? (JSON.parse(lastAssessment.answers || '{}')[q.id] || 0) : null;
            return (
              <div key={q.id} className="flex items-center gap-3">
                <p className="text-xs font-medium text-[#0A1A2F]/70 dark:text-white/70 dark:text-white/60 w-24 flex-shrink-0">{q.category}</p>
                <div className="flex-1 h-2 bg-[#0A1A2F]/8 dark:bg-white/8 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(score / 5) * 100}%` }}
                    className="h-full rounded-full" style={{ background: level.color }} />
                </div>
                <p className="text-xs font-bold w-6 text-right" style={{ color: level.color }}>{score}</p>
                {oldScore !== null && score > oldScore && (
                  <span className="text-[9px] text-green-500 font-bold">↑</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => { saveAssessment(); navigate(-1); }}
            className="flex-1 bg-[#c9a227] text-white min-h-[44px]">
            <Sparkles className="w-4 h-4 mr-2" /> Save Results
          </Button>
          <Button onClick={() => { setStep(-1); setAnswers({}); }}
            variant="outline" className="min-h-[44px] dark:border-white/10 dark:text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SpiritualAssessment() {
  return <PageErrorBoundary><SpiritualAssessmentInner /></PageErrorBoundary>;
}

class PageErrorBoundary extends React.Component {
  constructor(p){super(p);this.state={e:null};}
  static getDerivedStateFromError(e){return{e};}
  render(){if(this.state.e)return<div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6"><p className="text-lg font-bold dark:text-white mb-2">Something went wrong</p><button onClick={()=>this.setState({e:null})} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button></div>;return this.props.children;}
}
