import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, Dumbbell, Utensils, Brain, ChevronRight, Play, CheckCircle2, Star } from 'lucide-react';

// ─── Self-contained data (no external import needed) ─────────────────────────
const PLAN_ID = 'prosperity-revived-8week-v1';
const STORAGE_KEY = 'coaching_progress_' + PLAN_ID;

const WEEK_THEMES = [
  { week: 1, theme: 'Foundation',            subtitle: 'Knowing Who You Are in Christ'        },
  { week: 2, theme: 'Renewing Your Mind',    subtitle: 'Rewiring Thoughts for Transformation' },
  { week: 3, theme: 'Nourishing the Temple', subtitle: 'Food as Fuel, Not Comfort'            },
  { week: 4, theme: 'Strengthening Your Body', subtitle: 'Training with Purpose and Power'    },
  { week: 5, theme: 'Deepening Your Faith',  subtitle: 'Going Beyond Surface Religion'        },
  { week: 6, theme: 'Building Holy Habits',  subtitle: 'Making the Good Easy'                 },
  { week: 7, theme: 'Walking in Purpose',    subtitle: "Aligning With God's Call"             },
  { week: 8, theme: 'Living Abundantly',     subtitle: 'The Life You Were Created For'        },
];

const DAY_TITLES = {
  1:'Made in His Image',          2:"God's Masterpiece",          3:'Rest as Worship',
  4:'Fear Not — You Are Known',   5:'Your Body is a Temple',      6:'Transformed, Not Conformed',
  7:'Trust in the Lord',          8:'As a Man Thinketh',          9:'Take Every Thought Captive',
  10:'Peace That Guards Your Mind',11:'Renewing Through the Word', 12:'Confidence From God',
  13:'Guard Your Heart',          14:'The Renewed Mind',          15:'Eat to Honor',
  16:'The Garden Diet',           17:'Fasting as Focus',          18:'Drink the Living Water',
  19:'Provision and Contentment', 20:'Sweet to the Taste',        21:'Give Thanks Always',
  22:'Run With Endurance',        23:'Strong in the Lord',        24:'Rest and Recover',
  25:'The Discipline of the Body',26:'The Strength of Joy',       27:'Build Each Other Up',
  28:'The Transformed Body',      29:'Seek First His Kingdom',    30:'Abiding in the Vine',
  31:'Prayer as Power',           32:'Spiritual Hunger',          33:'Worship in Spirit and Truth',
  34:'His Word Does Not Return Empty',35:'Grow in Grace',         36:'Train Yourself in Godliness',
  37:'Small Beginnings',          38:'The Anchor of Accountability',39:'Faithful in Little',
  40:'Forty Days',                41:'The Test of Temptation',    42:'Habits as Holiness',
  43:'Created for Good Works',    44:'Light of the World',        45:'Seek Wisdom',
  46:'The Servant Leader',        47:'Fruit of the Spirit',       48:'What Does Your Life Preach?',
  49:'Eyes on the Finish',        50:'The Abundant Life',         51:'New Every Morning',
  52:'The Altar of Daily Offering',53:'The Peace of Completion',  54:'What God Has Done',
  55:'The Legacy',                56:'Well Done, Good and Faithful',
};

const DAY_REFS = {
  1:'Genesis 1:27',    2:'Ephesians 2:10',   3:'Genesis 2:2',     4:'Isaiah 43:1',
  5:'1 Cor 6:19-20',  6:'Romans 12:2',       7:'Proverbs 3:5-6',  8:'Proverbs 23:7',
  9:'2 Cor 10:5',     10:'Philippians 4:7',  11:'Psalm 119:105',  12:'Philippians 4:13',
  13:'Proverbs 4:23', 14:'Romans 12:2',       15:'1 Cor 10:31',    16:'Genesis 1:29',
  17:'Matthew 6:16',  18:'John 4:13-14',      19:'Philippians 4:19',20:'Psalm 119:103',
  21:'1 Thess 5:18',  22:'Hebrews 12:1',      23:'Ephesians 6:10', 24:'Psalm 23:2-3',
  25:'1 Cor 9:25',    26:'Nehemiah 8:10',     27:'1 Thess 5:11',   28:'1 Timothy 4:8',
  29:'Matthew 6:33',  30:'John 15:5',         31:'Philippians 4:6',32:'Matthew 5:6',
  33:'John 4:23',     34:'Isaiah 55:11',      35:'2 Peter 3:18',   36:'1 Timothy 4:7',
  37:'Zechariah 4:10',38:'Ecclesiastes 4:9',  39:'Matthew 25:21',  40:'Luke 4:1-2',
  41:'1 Cor 10:13',   42:'1 Cor 10:31',       43:'Ephesians 2:10', 44:'Matthew 5:14',
  45:'James 1:5',     46:'Mark 10:43-45',     47:'Galatians 5:22', 48:'Matthew 5:14',
  49:'Galatians 6:9', 50:'John 10:10',        51:'Lamentations 3:22',52:'Romans 12:1',
  53:'2 Timothy 4:7', 54:'Philippians 1:6',   55:'Proverbs 13:22', 56:'Matthew 25:23',
};

const PILLARS = [
  { key: 'devotion',  Icon: BookOpen, color: '#c9a227', label: 'Devotion'   },
  { key: 'workout',   Icon: Dumbbell, color: '#38BDF8', label: 'Workout'    },
  { key: 'nutrition', Icon: Utensils, color: '#22C55E', label: 'Nutrition'  },
  { key: 'growth',    Icon: Brain,    color: '#a78bfa', label: 'Growth'     },
];

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

export default function CoachingSection() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadProgress);

  const completedDays = Object.keys(progress).filter(
    k => k.startsWith('day_') && progress[k] && progress[k].completed
  ).length;

  const currentDay    = Math.max(1, Math.min(completedDays + 1, 56));
  const weekIndex     = Math.floor((currentDay - 1) / 7);
  const weekInfo      = WEEK_THEMES[weekIndex] || WEEK_THEMES[0];
  const overallPct    = Math.round((completedDays / 56) * 100);
  const dayKey        = 'day_' + currentDay;
  const todayPillars  = (progress[dayKey] && progress[dayKey].pillars) || {};
  const doneCount     = PILLARS.filter(p => !!todayPillars[p.key]).length;

  function togglePillar(pillarKey) {
    setProgress(prev => {
      const existing  = prev[dayKey] || {};
      const pillars   = Object.assign({}, existing.pillars || {}, { [pillarKey]: !((existing.pillars || {})[pillarKey]) });
      const allDone   = PILLARS.every(p => pillars[p.key]);
      const next      = Object.assign({}, prev, { [dayKey]: Object.assign({}, existing, { pillars, completed: allDone }) });
      saveProgress(next);
      return next;
    });
  }

  function openPlan(day) {
    navigate(createPageUrl('CoachingPlanPage') + (day ? '?day=' + day : ''));
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center shadow-sm">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0A1A2F] dark:text-white dark:text-white">Coaching Plan</h2>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Prosperity Revived · 8 Weeks</p>
          </div>
        </div>
        <button
          onClick={() => openPlan(null)}
          className="flex items-center gap-1 text-xs font-semibold text-[#c9a227] hover:opacity-75"
        >
          Full Plan <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress card */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-[#FAD98D]/25 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
              Week {weekInfo.week}:{' '}
              <span className="text-[#c9a227]">{weekInfo.theme}</span>
            </p>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mt-0.5">{weekInfo.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#0A1A2F] dark:text-white dark:text-white">
              {overallPct}<span className="text-sm font-normal text-[#0A1A2F]/40 dark:text-white/40">%</span>
            </p>
            <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">complete</p>
          </div>
        </div>
        <div className="h-2 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D]"
            initial={{ width: 0 }}
            animate={{ width: overallPct + '%' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35">Day {completedDays}/56</span>
          <span className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35">{56 - completedDays} days remaining</span>
        </div>
      </div>

      {/* Today card */}
      <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-2xl p-5 shadow-md mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest">Day {currentDay}</span>
            <span className="text-white/20 text-[10px]">·</span>
            <span className="text-white/50 text-[10px]">Week {weekInfo.week}</span>
          </div>
          {doneCount === 4 && (
            <div className="flex items-center gap-1 text-[#c9a227]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">Complete!</span>
            </div>
          )}
        </div>

        <h3 className="text-white font-bold text-lg leading-tight mb-1">{DAY_TITLES[currentDay]}</h3>
        <p className="text-[#c9a227]/70 text-xs mb-4">{DAY_REFS[currentDay]}</p>

        {/* Progress track */}
        <div className="flex gap-1.5 mb-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={'flex-1 h-1 rounded-full transition-all duration-300 ' + (i < doneCount ? 'bg-[#c9a227]' : 'bg-white/12')} />
          ))}
        </div>

        {/* Four Pillars */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {PILLARS.map(({ key, Icon, color, label }) => {
            const done = !!todayPillars[key];
            return (
              <button
                key={key}
                onClick={() => togglePillar(key)}
                className={'flex items-center gap-2.5 p-3 rounded-xl text-left transition-all border ' + (done ? 'bg-[#c9a227]/15 border-[#c9a227]/35' : 'bg-white/5 border-white/8 hover:bg-white/10')}
              >
                <div className={'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ' + (done ? 'bg-[#c9a227]' : 'bg-white/8')}>
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-white" />
                    : <Icon className="w-3.5 h-3.5" style={{ color }} />
                  }
                </div>
                <span className={'text-xs font-semibold ' + (done ? 'text-[#c9a227]' : 'text-white/50')}>{label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => openPlan(currentDay)}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Play className="w-4 h-4" />
          Open Today's Plan
        </button>
      </div>

      {/* This Week grid */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-[#F2F6FA] shadow-sm">
        <p className="text-[10px] font-bold text-[#0A1A2F]/45 dark:text-white/45 uppercase tracking-wider mb-3">
          Week {weekInfo.week} — {weekInfo.theme}
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 7 }, (_, i) => {
            const dayNum  = weekIndex * 7 + i + 1;
            const k       = 'day_' + dayNum;
            const done    = !!(progress[k] && progress[k].completed);
            const isToday = dayNum === currentDay;
            const isPast  = dayNum < currentDay;
            return (
              <button
                key={dayNum}
                onClick={() => openPlan(dayNum)}
                className={'aspect-square rounded-lg flex flex-col items-center justify-center transition-all ' + (
                  done    ? 'bg-[#c9a227] shadow-sm'
                  : isToday ? 'bg-[#c9a227]/15 border-2 border-[#c9a227]/60'
                  : isPast  ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F]'
                  :            'bg-[#F2F6FA] dark:bg-[#0A1A2F] opacity-40'
                )}
              >
                <span className={'text-[10px] font-bold ' + (done ? 'text-white' : isToday ? 'text-[#c9a227]' : 'text-[#0A1A2F]/40 dark:text-white/40')}>
                  {dayNum}
                </span>
                {done && <CheckCircle2 className="w-2.5 h-2.5 text-white mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
