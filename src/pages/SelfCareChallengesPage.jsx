import { useState, useEffect } from "react";
import { base44 } from '@/api/base44Client';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';

// ─── Challenge Catalogue ─────────────────────────────────────────────────────
const CHALLENGES = [
  {
    id: "gratitude-7", title: "7-Day Gratitude", emoji: "🙏", category: "Faith",
    duration: 7, color: "#D9A84A", bg: "linear-gradient(135deg,#f59e0b,#FAD98D)",
    tagline: "Cultivate a thankful heart in one week", xpPerDay: 40,
    tasks: [
      { day: 1, title: "Three blessings", content: "Write down three things you're grateful for — no matter how small. Look for God's fingerprints in ordinary moments.", prompt: "What three moments today revealed something beautiful?" },
      { day: 2, title: "Send encouragement", content: "Text, call, or message someone to tell them you appreciate them. Gratitude multiplies when shared.", prompt: "Who did you reach out to, and what did it feel like?" },
      { day: 3, title: "Answered prayers", content: "Recall 2-3 prayers God has answered in your life. Write them down and spend a moment in praise.", prompt: "How has God shown up for you in unexpected ways?" },
      { day: 4, title: "Grateful for hardship", content: "Name one difficulty that helped you grow. How did God use it? What would you have missed without it?", prompt: "What hard season turned out to be a gift in disguise?" },
      { day: 5, title: "Prayer of thanks only", content: "Spend 5 minutes in prayer focused entirely on thanksgiving. No requests - just gratitude.", prompt: "What surprised you when you prayed only in thanksgiving?" },
      { day: 6, title: "Gratitude walk", content: "Take a 10-minute walk outside. With every step, name something you're grateful for. Let it fill you.", prompt: "What did you notice on your walk that you usually overlook?" },
      { day: 7, title: "Share your gratitude", content: "Post, write, or tell someone one thing you're grateful for. Let your testimony encourage someone else.", prompt: "How has a week of gratitude changed your perspective?" },
    ],
  },
  {
    id: "stress-reset-5", title: "5-Day Stress Reset", emoji: "🕊️", category: "Mindset",
    duration: 5, color: "#0ea5e9", bg: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    tagline: "Find peace through prayer and practice", xpPerDay: 35,
    tasks: [
      { day: 1, title: "Box breathing", content: "Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 10 times. Give God your anxiety with each exhale.", prompt: "How did intentional breathing shift your body and mind?" },
      { day: 2, title: "Scripture anchor", content: "Read Philippians 4:6-7 three times slowly. Write what it means to you today. Carry it as your mantra.", prompt: "What did this verse unlock in you today?" },
      { day: 3, title: "Prayer walk", content: "Walk for 10 minutes outside while praying aloud. Give God your specific stressors one by one.", prompt: "What specific stressor did you hand over, and how did it feel?" },
      { day: 4, title: "Digital sabbath hour", content: "Spend one hour without any screens. Read, pray, sit in stillness, or journal. Let your nervous system rest.", prompt: "What surprised you about the silence?" },
      { day: 5, title: "Surrender ritual", content: "Write your top three worries. Pray over each one, giving them to God. Then physically let them go.", prompt: "What shifted when you chose to release control?" },
    ],
  },
  {
    id: "morning-ritual-5", title: "5-Day Morning Ritual", emoji: "🌅", category: "Mindset",
    duration: 5, color: "#f97316", bg: "linear-gradient(135deg,#f97316,#fb923c)",
    tagline: "Own the first hour, own the day", xpPerDay: 35,
    tasks: [
      { day: 1, title: "Phone-free first 30", content: "Don't check your phone for the first 30 minutes after waking. Use that time to pray, breathe, and set your intention.", prompt: "How did starting without your phone change your morning energy?" },
      { day: 2, title: "Three intentions", content: "Before anything else, write three intentions for today - not tasks, but how you want to show up.", prompt: "What intentions did you set, and did you live them out?" },
      { day: 3, title: "Move your body first", content: "Do 10 minutes of movement before checking any screen.", prompt: "How did moving first change the rest of your morning?" },
      { day: 4, title: "Scripture before social", content: "Read one chapter of Scripture before opening any social media.", prompt: "What did God say to you before the world got a word in?" },
      { day: 5, title: "The full ritual", content: "Combine everything: no phone for 30 min, 3 intentions, movement, Scripture.", prompt: "What would it mean to make this your every morning?" },
    ],
  },
  {
    id: "kindness-5", title: "5-Day Kindness Challenge", emoji: "💛", category: "Relationships",
    duration: 5, color: "#f43f5e", bg: "linear-gradient(135deg,#f43f5e,#fb7185)",
    tagline: "Love your neighbour in concrete ways", xpPerDay: 30,
    tasks: [
      { day: 1, title: "Compliment three people", content: "Give a genuine, specific compliment to three different people today.", prompt: "Who did you compliment, and how did it land?" },
      { day: 2, title: "Anonymous service", content: "Do something kind for someone who won't know it was you.", prompt: "What did you do, and how did it feel to serve unseen?" },
      { day: 3, title: "Reconnect with someone", content: "Reach out to someone you haven't spoken to in a while.", prompt: "Who did you reconnect with? What was meaningful about it?" },
      { day: 4, title: "Listen deeply", content: "In your next conversation, practice listening to understand - not to respond.", prompt: "What did you hear that you might have missed before?" },
      { day: 5, title: "Pray for five people", content: "Write down five people and pray specifically for each one.", prompt: "Who did you pray for, and what did you sense for each of them?" },
    ],
  },
  {
    id: "rest-7", title: "7-Day Rest Challenge", emoji: "😴", category: "Body",
    duration: 7, color: "#6366f1", bg: "linear-gradient(135deg,#6366f1,#818cf8)",
    tagline: "Honor your body with real rest", xpPerDay: 40,
    tasks: [
      { day: 1, title: "Bedtime by 10:30pm", content: "Commit to being in bed by 10:30pm.", prompt: "How did getting to bed earlier affect how you woke up?" },
      { day: 2, title: "No screens after 9pm", content: "Put devices down by 9pm.", prompt: "What did you do with that screen-free time?" },
      { day: 3, title: "Afternoon reset", content: "Take a 10-20 minute rest after lunch.", prompt: "How did your afternoon feel after intentional rest?" },
      { day: 4, title: "Sabbath hour", content: "Carve out one hour today for something completely restful and joyful.", prompt: "What did you do, and did it feel genuinely restful?" },
      { day: 5, title: "No alarm", content: "If possible, let yourself wake naturally.", prompt: "What did your body's natural rhythm tell you?" },
      { day: 6, title: "Wind-down ritual", content: "Create a 15-minute bedtime routine: dim lights, prayer, light reading.", prompt: "How did a wind-down ritual change how you fell asleep?" },
      { day: 7, title: "Reflect on rest", content: "Write about this week.", prompt: "How did intentional rest transform your mood, energy, and faith?" },
    ],
  },
  {
    id: "movement-7", title: "7-Day Movement Challenge", emoji: "🏃", category: "Body",
    duration: 7, color: "#22c55e", bg: "linear-gradient(135deg,#22c55e,#22C55E)",
    tagline: "Move your body, lift your spirit", xpPerDay: 40,
    tasks: [
      { day: 1, title: "10-minute walk", content: "Go for a 10-minute walk - outside if possible. Pray while you walk.", prompt: "What happened when movement and prayer merged?" },
      { day: 2, title: "Stretch for 10 minutes", content: "Spend 10 minutes stretching. Release tension you've been carrying.", prompt: "What tension did you release - physical or emotional?" },
      { day: 3, title: "Push to 20 minutes", content: "Extend your walk or movement to 20 minutes.", prompt: "What did your mind do when your body moved longer?" },
      { day: 4, title: "Try something new", content: "Do a movement you don't normally do - dance, swim, cycle, jump rope.", prompt: "What new movement did you try, and how did it feel?" },
      { day: 5, title: "Move with someone", content: "Walk, run, or work out with another person today.", prompt: "How did shared movement deepen the connection?" },
      { day: 6, title: "Active recovery", content: "Take a gentle rest day - a slow walk or light stretching.", prompt: "How did intentional recovery feel compared to just stopping?" },
      { day: 7, title: "Reflect and commit", content: "Write down how 7 days of intentional movement changed you.", prompt: "What will you carry forward from this week?" },
    ],
  },
  {
    id: "scripture-memory-7", title: "Scripture Memory", emoji: "📖", category: "Faith",
    duration: 7, color: "#8b5cf6", bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
    tagline: "Hide God's Word deep in your heart", xpPerDay: 45,
    tasks: [
      { day: 1, title: "Philippians 4:13", content: "I can do all things through Christ who strengthens me. Say it ten times aloud.", prompt: "Where do you most need this truth today?" },
      { day: 2, title: "Psalm 46:10", content: "Be still, and know that I am God. Sit in 2 minutes of silence first.", prompt: "What did stillness reveal to you?" },
      { day: 3, title: "Proverbs 3:5-6", content: "Trust in the Lord with all your heart and lean not on your own understanding.", prompt: "Where are you leaning on yourself instead of trusting God?" },
      { day: 4, title: "Jeremiah 29:11", content: "For I know the plans I have for you, declares the Lord.", prompt: "What worry did this verse speak to today?" },
      { day: 5, title: "Isaiah 40:31", content: "Those who hope in the Lord will renew their strength.", prompt: "When did you feel renewed strength today?" },
      { day: 6, title: "Romans 8:28", content: "In all things God works for the good of those who love him.", prompt: "What situation is God currently redeeming in your life?" },
      { day: 7, title: "Joshua 1:9", content: "Be strong and courageous. Do not be afraid.", prompt: "What courage has a week of Scripture built in you?" },
    ],
  },
];

const CATS = ["All", "Faith", "Mindset", "Body", "Relationships"];
const CAT_COLORS = { Faith: "#D9A84A", Mindset: "#0ea5e9", Body: "#22c55e", Relationships: "#f43f5e" };

// ─── Storage ──────────────────────────────────────────────────────────────────
const LOCAL_KEY = "pr_selfcare_v3";
function loadLocal() { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}"); } catch { return {}; } }
function saveLocal(d) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(d)); } catch {} }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function getDayTs(val) { return typeof val === "number" ? val : (val?.ts ?? 0); }
function getDayXP(val, fallback) { return typeof val === "number" ? fallback : (val?.xp ?? fallback); }

function getCompletedDays(cData) {
  if (!cData?.days) return [];
  return Object.keys(cData.days).map(Number).sort((a, b) => a - b);
}
function completedToday(cData) {
  if (!cData?.days) return false;
  return Object.values(cData.days).some(val => new Date(getDayTs(val)).toISOString().slice(0, 10) === todayStr());
}
function calcStreak(cData) {
  if (!cData?.days) return 0;
  const byDate = {};
  Object.values(cData.days).forEach(val => { byDate[new Date(getDayTs(val)).toISOString().slice(0, 10)] = true; });
  const today = todayStr();
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const yesterday = yd.toISOString().slice(0, 10);
  const start = byDate[today] ? new Date() : byDate[yesterday] ? yd : null;
  if (!start) return 0;
  let n = 0; const d = new Date(start);
  while (byDate[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function getTotalXP(localData) {
  return CHALLENGES.reduce((sum, c) => {
    const cData = localData[c.id];
    if (!cData?.days) return sum;
    return sum + Object.values(cData.days).reduce((s, val) => s + getDayXP(val, c.xpPerDay), 0);
  }, 0);
}
function getLevel(xp) {
  const L = [
    { min: 0,    max: 99,       label: "Seedling",   emoji: "🌱" },
    { min: 100,  max: 299,      label: "Grower",     emoji: "🌿" },
    { min: 300,  max: 599,      label: "Bloomer",    emoji: "🌸" },
    { min: 600,  max: 999,      label: "Thriver",    emoji: "🌳" },
    { min: 1000, max: Infinity, label: "Flourisher", emoji: "🌟" },
  ];
  return L.find(l => xp >= l.min && xp <= l.max) || L[0];
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  const colors = ["#FAD98D","#f43f5e","#0ea5e9","#22c55e","#8b5cf6","#f97316","#fbbf24"];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      <style>{`@keyframes cf{to{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {Array.from({length:24},(_,i)=>(
        <div key={i} style={{
          position:"absolute",left:`${4+(i*3.8)%92}%`,top:"-20px",
          width:i%3===0?10:6,height:i%3===0?10:6,
          borderRadius:i%2===0?"50%":"2px",
          background:colors[i%colors.length],
          animation:`cf ${1.4+(i%3)*0.4}s ease-in ${i*0.05}s forwards`,
        }}/>
      ))}
    </div>
  );
}

// ─── XP Toast ─────────────────────────────────────────────────────────────────
function XPToast({ show, xp }) {
  return (
    <div style={{
      position:"fixed",top:70,right:16,zIndex:9998,
      background:"linear-gradient(135deg,#FAD98D,#c9a227)",
      color:"#0A1A2F",borderRadius:20,padding:"10px 18px",
      fontFamily:"Nunito,sans-serif",fontWeight:900,fontSize:15,
      boxShadow:"0 8px 32px rgba(217,184,120,0.5)",
      transition:"all 0.35s cubic-bezier(.34,1.56,.64,1)",
      transform:show?"translateY(0) scale(1)":"translateY(-80px) scale(0.8)",
      opacity:show?1:0,pointerEvents:"none",
    }}>✨ +{xp} XP earned!</div>
  );
}

// ─── Journey Map ──────────────────────────────────────────────────────────────
function JourneyMap({ challenge, completedDays }) {
  const nextDay = completedDays.length + 1;
  return (
    <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",padding:"8px 0"}}>
      {challenge.tasks.map((t, i) => {
        const done = completedDays.includes(t.day);
        const cur  = !done && t.day === nextDay;
        return (
          <div key={t.day} style={{display:"flex",alignItems:"center"}}>
            <div style={{
              width:30,height:30,borderRadius:"50%",
              background: done ? challenge.color : cur ? challenge.color+"33" : "#F2F6FA",
              border:`2px solid ${done ? challenge.color : cur ? challenge.color : "#F2F6FA"}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:done?13:10,color:done?"white":cur?challenge.color:"#94a3b8",
              fontWeight:800,
            }}>{done?"✓":t.day}</div>
            {i < challenge.tasks.length-1 && (
              <div style={{width:8,height:2,background:done?"#FAD98D":"#F2F6FA",borderRadius:1}}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Challenge Detail View (NOT an overlay — renders as normal page content) ─
function ChallengeDetail({ challenge, localData, onBack, onStart, onComplete, onReset, onOpenChallenge, user }) {
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const cData        = localData[challenge.id] || null;
  const completedDays = getCompletedDays(cData);
  const isStarted    = !!cData;
  const isDone       = completedDays.length >= challenge.duration;
  const alreadyToday = completedToday(cData);
  const nextDayNum   = completedDays.length + 1;
  const currentTask  = !isDone ? challenge.tasks[completedDays.length] : null;
  const pct          = Math.round((completedDays.length / challenge.duration) * 100);
  const streak       = isStarted ? calcStreak(cData) : 0;
  const bonus        = streak >= 3 ? 10 : 0;
  const xpToday      = challenge.xpPerDay + bonus;
  const chars        = reflection.length;

  const handleComplete = async () => {
    if (!reflection.trim() || saving) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const isLast = nextDayNum >= challenge.duration;
    onComplete(challenge.id, nextDayNum, xpToday);
    setSaving(false);
    setReflection("");
    setXpEarned(xpToday);
    setShowXP(true); setTimeout(() => setShowXP(false), 2500);
    if (isLast) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500); }
  };

  const suggested = CHALLENGES.filter(c => c.id !== challenge.id && !localData[c.id]).slice(0, 2);

  return (
    <div style={{background:"#F8F4EE",fontFamily:"Nunito,sans-serif",minHeight:"100vh",paddingBottom:32}}>
      <Confetti show={showConfetti}/>
      <XPToast show={showXP} xp={xpEarned}/>

      {/* Back header */}
      <div style={{background:"white",borderBottom:"1px solid #F2F6FA",padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
        <button
          onClick={onBack}
          style={{width:38,height:38,borderRadius:"50%",background:"#F8F4EE",border:"none",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#0A1A2F",cursor:"pointer"}}
        >←</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:15,color:"#0A1A2F"}}>{challenge.title}</div>
          <div style={{fontSize:10,color:"#0A1A2F55",fontWeight:700,textTransform:"uppercase",letterSpacing:1.1}}>
            {challenge.duration} days · {challenge.category}{streak>1?` · 🔥 ${streak}-day streak`:""}
          </div>
        </div>
        <div style={{background:"linear-gradient(135deg,#FAD98D,#c9a227)",borderRadius:12,padding:"4px 10px",fontSize:11,fontWeight:900,color:"#0A1A2F"}}>
          +{challenge.xpPerDay} XP/day
        </div>
        {isStarted && (
          <button onClick={() => setConfirmReset(true)}
            style={{width:36,height:36,borderRadius:"50%",background:"#F8F4EE",border:"none",cursor:"pointer",fontSize:16,color:"#94a3b8"}}>↺</button>
        )}
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"0 16px"}}>

        {/* Hero card */}
        <div style={{marginTop:16,borderRadius:24,padding:20,background:challenge.bg,boxShadow:"0 12px 40px rgba(0,0,0,0.15)"}}>
          <div style={{fontSize:32,marginBottom:6}}>{challenge.emoji}</div>
          <div style={{color:"white",fontFamily:"Lora,serif",fontWeight:700,fontSize:20,lineHeight:1.2,marginBottom:4}}>{challenge.title}</div>
          <div style={{color:"rgba(255,255,255,0.75)",fontSize:13,marginBottom:isDone||!isStarted?0:14}}>{challenge.tagline}</div>

          {isStarted && !isDone && (
            <>
              <JourneyMap challenge={challenge} completedDays={completedDays}/>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"10px 14px",marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",color:"white",fontSize:11,fontWeight:800,marginBottom:6}}>
                  <span>{completedDays.length}/{challenge.duration} days</span><span>{pct}%</span>
                </div>
                <div style={{height:7,background:"rgba(255,255,255,0.25)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"white",borderRadius:99}}/>
                </div>
              </div>
            </>
          )}

          {isDone && (
            <div style={{marginTop:14,background:"rgba(255,255,255,0.2)",borderRadius:16,padding:20,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:8}}>🏆</div>
              <div style={{color:"white",fontFamily:"Lora,serif",fontWeight:700,fontSize:18}}>Challenge Complete!</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:4}}>All {challenge.duration} days done</div>
            </div>
          )}
        </div>

        {/* Post-completion */}
        {isDone && (
          <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
            {suggested.length > 0 && (
              <div style={{background:"white",borderRadius:20,border:"1px solid #F2F6FA",padding:"16px 20px"}}>
                <div style={{fontFamily:"Lora,serif",fontWeight:600,fontSize:14,color:"#0A1A2F",marginBottom:4}}>🌱 What's Next?</div>
                <div style={{fontSize:12,color:"#0A1A2F55",marginBottom:12}}>You've built real momentum. Keep growing.</div>
                {suggested.map(next => (
                  <button key={next.id} onClick={() => onOpenChallenge(next)}
                    style={{width:"100%",background:"#F8F4EE",borderRadius:14,border:"1px solid #F2F6FA",
                      padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:24}}>{next.emoji}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#0A1A2F"}}>{next.title}</div>
                      <div style={{fontSize:11,color:"#0A1A2F44"}}>{next.duration} days · {next.xpPerDay} XP/day</div>
                    </div>
                    <span style={{marginLeft:"auto",color:"#FAD98D",fontWeight:900}}>→</span>
                  </button>
                ))}
              </div>
            )}
            <div style={{display:"flex",justifyContent:"center"}}>
              <ShareToFeedButton
                type="general_win"
                title={`Completed the ${challenge.title} challenge! 🏆`}
                content={`Just finished all ${challenge.duration} days of the "${challenge.title}" self-care challenge on Prosperity Revived. Consistency is built one day at a time. 🙏`}
                source="Hannah"
                label="Share this win"
                color="#FD9C2D"
                user={user}
              />
            </div>
            <button onClick={() => onReset(challenge.id)}
              style={{background:"white",border:"1px solid #F2F6FA",borderRadius:16,padding:"12px",
                color:"#94a3b8",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              ↺ Repeat This Challenge
            </button>
          </div>
        )}

        {/* Today's task */}
        {isStarted && !isDone && currentTask && (
          <div style={{marginTop:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>
              {alreadyToday ? "✅ Completed Today" : `Today — Day ${nextDayNum} of ${challenge.duration}`}
            </div>

            {alreadyToday ? (
              <div style={{background:"white",borderRadius:20,border:"1px solid #D1FAE5",padding:20,display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"#ECFDF5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>✅</div>
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:"#059669"}}>Day {completedDays[completedDays.length-1]} Complete!</div>
                  <div style={{fontSize:12,color:"#059669aa",marginTop:2}}>Beautifully done. Come back tomorrow for Day {nextDayNum}.</div>
                </div>
              </div>
            ) : (
              <div style={{background:"white",borderRadius:24,border:`2px solid ${challenge.color}44`,padding:20,boxShadow:`0 4px 24px ${challenge.color}15`}}>
                {/* Day badge */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:challenge.bg,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:14}}>
                    {nextDayNum}
                  </div>
                  <div>
                    <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:16,color:"#0A1A2F"}}>{currentTask.title}</div>
                    <div style={{fontSize:10,color:"#0A1A2F44",fontWeight:700}}>Day {nextDayNum} Challenge</div>
                  </div>
                </div>

                {/* Task content */}
                <div style={{background:"#F8F4EE",borderRadius:14,padding:"12px 14px",fontSize:13,color:"#0A1A2F88",lineHeight:1.7,marginBottom:16}}>
                  {currentTask.content}
                </div>

                {/* Reflection */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>
                    📝 Your Reflection <span style={{color:"#f43f5e"}}>*</span>
                  </div>
                  <div style={{background:"#F0EBE0",borderRadius:12,padding:"8px 12px",fontSize:11,color:challenge.color,fontWeight:700,marginBottom:8,fontStyle:"italic"}}>
                    💭 {currentTask.prompt}
                  </div>
                  <div style={{position:"relative"}}>
                    <textarea
                      value={reflection}
                      onChange={e => setReflection(e.target.value)}
                      placeholder="Write freely — what did God show you today?"
                      rows={4}
                      style={{
                        width:"100%",background:"#F8F4EE",borderRadius:14,
                        padding:"12px 14px",fontSize:13,color:"#0A1A2F",
                        border:`1.5px solid ${chars>0?challenge.color+"66":"#F2F6FA"}`,
                        outline:"none",resize:"none",lineHeight:1.7,
                        fontFamily:"Nunito,sans-serif",boxSizing:"border-box",
                      }}
                    />
                    <div style={{position:"absolute",bottom:10,right:12,fontSize:10,color:chars>20?"#22c55e":"#94a3b8",fontWeight:700}}>
                      {chars} chars
                    </div>
                  </div>
                </div>

                {bonus > 0 && (
                  <div style={{background:"linear-gradient(135deg,#fef3c7,#fde68a)",borderRadius:12,padding:"8px 12px",fontSize:11,fontWeight:800,color:"#92400e",marginBottom:12}}>
                    🔥 {streak}-day streak! +{bonus} bonus XP
                  </div>
                )}

                <button
                  onClick={handleComplete}
                  disabled={saving || !reflection.trim()}
                  style={{
                    width:"100%",padding:"15px",borderRadius:18,
                    background:reflection.trim()?challenge.bg:"#F2F6FA",
                    border:"none",color:reflection.trim()?"white":"#94a3b8",
                    fontFamily:"Nunito,sans-serif",fontWeight:900,fontSize:15,
                    cursor:reflection.trim()?"pointer":"not-allowed",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                    boxShadow:reflection.trim()?`0 8px 24px ${challenge.color}44`:"none",
                  }}
                >
                  {saving ? "Saving…" : `✓ Complete Day ${nextDayNum} · +${xpToday} XP`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* All days accordion */}
        <div style={{marginTop:20}}>
          <button onClick={() => setShowAllDays(s => !s)}
            style={{width:"100%",background:"none",border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,padding:0}}>
            <span style={{fontSize:10,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1.5}}>
              All {challenge.duration} Days
            </span>
            <span style={{color:"#0A1A2F33",fontSize:16,display:"inline-block",transform:showAllDays?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span>
          </button>
          {showAllDays && (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {challenge.tasks.map(task => {
                const done   = completedDays.includes(task.day);
                const isCurr = isStarted && task.day === nextDayNum && !isDone && !alreadyToday;
                const locked = isStarted && task.day > nextDayNum;
                return (
                  <div key={task.day} style={{
                    background:done?"#ECFDF5":isCurr?"white":"#F8F4EE",
                    border:`1.5px solid ${done?"#A7F3D0":isCurr?challenge.color+"44":"#F2F6FA"}`,
                    borderRadius:18,padding:"12px 14px",display:"flex",gap:12,alignItems:"flex-start",
                    opacity:locked?0.45:1,
                  }}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:done?"#10b981":isCurr?challenge.color:"#F2F6FA",color:done||isCurr?"white":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,flexShrink:0}}>
                      {done?"✓":locked?"🔒":task.day}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:13,color:done?"#059669":"#0A1A2F",marginBottom:3}}>Day {task.day}: {task.title}</div>
                      {!locked
                        ? <div style={{fontSize:11,color:done?"#059669aa":"#0A1A2F55",lineHeight:1.6}}>{task.content}</div>
                        : <div style={{fontSize:11,color:"#0A1A2F33"}}>Unlocks after Day {task.day-1}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Start CTA */}
      {!isStarted && (
        <div style={{padding:"16px",marginTop:16}}>
          <button onClick={() => onStart(challenge.id)}
            style={{width:"100%",padding:"16px",borderRadius:20,
              background:"linear-gradient(135deg,#FAD98D,#c9a227)",
              border:"none",color:"#0A1A2F",fontFamily:"Nunito,sans-serif",
              fontWeight:900,fontSize:16,cursor:"pointer",
              boxShadow:"0 8px 24px rgba(217,184,120,0.4)"}}>
            ★ Start This Challenge · Earn up to {challenge.xpPerDay * challenge.duration} XP
          </button>
        </div>
      )}

      {/* Reset confirm */}
      {confirmReset && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 16px 32px",zIndex:200}}>
          <div style={{background:"white",borderRadius:28,padding:28,width:"100%",maxWidth:380,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:18,color:"#0A1A2F",textAlign:"center",marginBottom:6}}>Reset Challenge?</div>
            <div style={{fontSize:12,color:"#0A1A2F55",textAlign:"center",marginBottom:24,lineHeight:1.6}}>Your progress will be cleared. Journal entries will stay.</div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={() => setConfirmReset(false)}
                style={{flex:1,padding:14,borderRadius:16,border:"1px solid #F2F6FA",background:"white",cursor:"pointer",fontWeight:700,fontSize:13,color:"#0A1A2F66"}}>Cancel</button>
              <button onClick={() => { onReset(challenge.id); setConfirmReset(false); }}
                style={{flex:1,padding:14,borderRadius:16,border:"none",background:"#f43f5e",color:"white",cursor:"pointer",fontWeight:800,fontSize:13}}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Challenge Card (list view) ───────────────────────────────────────────────
function ChallengeCard({ challenge, localData, onOpen }) {
  const cData         = localData[challenge.id] || null;
  const completedDays = getCompletedDays(cData);
  const isStarted     = !!cData;
  const isDone        = completedDays.length >= challenge.duration;
  const pct           = (completedDays.length / challenge.duration) * 100;
  const streak        = isStarted ? calcStreak(cData) : 0;
  const doneToday     = completedToday(cData);
  const catColor      = CAT_COLORS[challenge.category];

  return (
    <button onClick={() => onOpen(challenge)}
      style={{width:"100%",background:"white",borderRadius:22,border:"1.5px solid #F2F6FA",
        cursor:"pointer",textAlign:"left",overflow:"hidden",padding:0}}>
      <div style={{height:3,background:challenge.bg}}/>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
          <div style={{width:44,height:44,borderRadius:14,background:challenge.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
            {challenge.emoji}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:4}}>
              <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:14,color:"#0A1A2F",lineHeight:1.2}}>{challenge.title}</div>
              <span style={{color:"#CBD5E1",fontSize:18,flexShrink:0}}>›</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,margin:"5px 0"}}>
              <span style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:1,padding:"2px 7px",borderRadius:99,background:catColor+"18",color:catColor,border:`1px solid ${catColor}33`}}>{challenge.category}</span>
              <span style={{fontSize:10,color:"#0A1A2F44"}}>{challenge.duration} days</span>
              <span style={{fontSize:10,color:"#FAD98D",fontWeight:700}}>· {challenge.xpPerDay*challenge.duration} XP</span>
              {isStarted && !isDone && streak>0 && <span style={{fontSize:10,fontWeight:800,color:"#f97316"}}>🔥 {streak}d</span>}
              {doneToday && !isDone && <span style={{fontSize:10,fontWeight:800,color:"#22c55e"}}>✓ Done</span>}
              {isDone && <span style={{fontSize:10,fontWeight:800,color:"#8b5cf6"}}>🏆 Complete</span>}
            </div>
            <div style={{fontSize:11,color:"#0A1A2F44",lineHeight:1.4}}>{challenge.tagline}</div>
          </div>
        </div>
        {isStarted && (
          <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #F8F4EE"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:10,color:"#0A1A2F44"}}>{isDone?"🎉 Finished!":`Day ${completedDays.length+1} of ${challenge.duration}`}</span>
              <span style={{fontSize:10,fontWeight:800,color:challenge.color}}>{Math.round(pct)}%</span>
            </div>
            <div style={{height:5,background:"#F0EBE0",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:challenge.bg,borderRadius:99}}/>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SelfCareChallengesPage() {
  const [localData,   setLocalData]   = useState(loadLocal);
  const [selectedId,  setSelectedId]  = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const [activeCat,   setActiveCat]   = useState("All");

  const selected      = selectedId ? CHALLENGES.find(c => c.id === selectedId) : null;
  const activeList    = CHALLENGES.filter(c => localData[c.id] && getCompletedDays(localData[c.id]).length < c.duration);
  const completedCount = CHALLENGES.filter(c => localData[c.id] && getCompletedDays(localData[c.id]).length >= c.duration).length;
  const totalXP       = getTotalXP(localData);
  const level         = getLevel(totalXP);
  const hasAny        = Object.keys(localData).length > 0;

  const handleStart    = id => { const u = {...localData,[id]:{startedAt:Date.now(),days:{}}}; setLocalData(u); saveLocal(u); };
  const handleComplete = (id, dayNum, xp) => {
    const ex = localData[id] || {startedAt:Date.now(),days:{}};
    const days = {...(ex.days||{}),[dayNum]:{ts:Date.now(),xp}};
    const u = {...localData,[id]:{...ex,days}};
    setLocalData(u); saveLocal(u);
  };
  const handleReset    = id => { const u={...localData}; delete u[id]; setLocalData(u); saveLocal(u); setSelectedId(null); };

  const filtered = [...(activeCat==="All" ? CHALLENGES : CHALLENGES.filter(c=>c.category===activeCat))]
    .sort((a,b)=>{
      const aA=localData[a.id]&&getCompletedDays(localData[a.id]).length<a.duration;
      const bA=localData[b.id]&&getCompletedDays(localData[b.id]).length<b.duration;
      const aD=localData[a.id]&&getCompletedDays(localData[a.id]).length>=a.duration;
      const bD=localData[b.id]&&getCompletedDays(localData[b.id]).length>=b.duration;
      if(aA&&!bA)return -1; if(bA&&!aA)return 1;
      if(aD&&!bD)return 1;  if(bD&&!aD)return -1;
      return 0;
    });

  // ── If a challenge is selected, render it as the full page ──────────────────
  if (selected) {
    return (
      <ChallengeDetail
        key={selected.id}
        challenge={selected}
        localData={localData}
        onBack={() => setSelectedId(null)}
        onStart={handleStart}
        onComplete={handleComplete}
        onReset={handleReset}
        onOpenChallenge={c => setSelectedId(c.id)}
        user={user}
      />
    );
  }

  // ── List view ───────────────────────────────────────────────────────────────
  return (
    <div style={{background:"#F8F4EE",fontFamily:"Nunito,sans-serif",minHeight:"100vh",paddingBottom:32}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=Nunito:wght@400;600;700;800;900&display=swap');
        .sc-cat::-webkit-scrollbar{display:none}
      `}</style>

      {/* Header */}
      <div style={{background:"white",borderBottom:"1px solid #F2F6FA",padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:18,color:"#0A1A2F",margin:0}}>Self-Care Challenges</h1>
          <p style={{fontSize:11,color:"#0A1A2F55",margin:0}}>
            {activeList.length>0 ? `${activeList.length} active challenge${activeList.length>1?"s":""}` : "Build healthy habits one day at a time"}
            {completedCount>0 ? ` · ${completedCount} completed` : ""}
          </p>
        </div>
        <div style={{background:"linear-gradient(135deg,#FAD98D,#c9a227)",borderRadius:20,padding:"6px 14px",display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 12px rgba(217,184,120,0.3)"}}>
          <span style={{fontSize:14}}>{level.emoji}</span>
          <div>
            <div style={{fontSize:11,fontWeight:900,color:"#0A1A2F"}}>{totalXP} XP</div>
            <div style={{fontSize:8,fontWeight:800,color:"#0A1A2F77",textTransform:"uppercase",letterSpacing:0.8}}>{level.label}</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"16px 16px 0"}}>

        {/* Active challenges hero */}
        {activeList.length>0 && (
          <div style={{marginBottom:20}}>
            {activeList.map(c => {
              const cData = localData[c.id];
              const cDays = getCompletedDays(cData);
              const todayDone = completedToday(cData);
              const nextDay = cDays.length+1;
              const streak = calcStreak(cData);
              return (
                <div key={c.id} onClick={()=>setSelectedId(c.id)}
                  style={{borderRadius:24,background:c.bg,padding:"18px 20px",cursor:"pointer",
                    boxShadow:"0 12px 40px rgba(0,0,0,0.15)",marginBottom:10,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:0.12,pointerEvents:"none"}}>{c.emoji}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{background:"rgba(255,255,255,0.2)",borderRadius:99,padding:"3px 10px",fontSize:10,color:"white",fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>🎯 Today's Focus</div>
                    {streak>1&&<div style={{background:"rgba(255,255,255,0.2)",borderRadius:99,padding:"3px 10px",fontSize:10,color:"white",fontWeight:800}}>🔥 {streak}-day streak</div>}
                  </div>
                  <div style={{color:"white",fontFamily:"Lora,serif",fontWeight:700,fontSize:17,marginBottom:4}}>{c.title}</div>
                  {todayDone
                    ? <div style={{color:"rgba(255,255,255,0.85)",fontSize:13}}>✅ Day {cDays.length} done! Return tomorrow for Day {nextDay}.</div>
                    : <div style={{color:"rgba(255,255,255,0.85)",fontSize:13}}>Day {nextDay}: {c.tasks[cDays.length]?.title} →</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {hasAny && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
            {[
              {label:"Active",value:activeList.length,emoji:"🔥"},
              {label:"Done",value:completedCount,emoji:"🏆"},
              {label:"Level",value:level.label,emoji:level.emoji},
            ].map(s=>(
              <div key={s.label} style={{background:"white",borderRadius:20,border:"1px solid #F2F6FA",padding:"12px 8px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{s.emoji}</div>
                <div style={{fontSize:15,fontWeight:900,color:"#0A1A2F"}}>{s.value}</div>
                <div style={{fontSize:9,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1}}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Onboarding */}
        {!hasAny && (
          <div style={{background:"linear-gradient(135deg,#0A1A2F,#0A1A2F)",borderRadius:24,padding:"20px",marginBottom:20,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-10,top:-10,fontSize:80,opacity:0.08}}>🌱</div>
            <div style={{color:"#FAD98D",fontFamily:"Lora,serif",fontWeight:700,fontSize:18,marginBottom:6}}>Start Your Growth Journey</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,lineHeight:1.6,marginBottom:14}}>Each challenge builds one positive habit — for your faith, mind, body, and relationships.</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Complete a day","Write your reflection","Earn XP & level up","Build real habits"].map(s=>(
                <div key={s} style={{background:"rgba(217,184,120,0.15)",border:"1px solid rgba(217,184,120,0.3)",borderRadius:99,padding:"4px 10px",fontSize:11,color:"#FAD98D",fontWeight:700}}>✦ {s}</div>
              ))}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="sc-cat" style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,paddingBottom:4,scrollbarWidth:"none",msOverflowStyle:"none"}}>
          {CATS.map(cat=>(
            <button key={cat} onClick={()=>setActiveCat(cat)}
              style={{flexShrink:0,fontSize:12,fontWeight:800,padding:"7px 16px",borderRadius:99,border:"1.5px solid",
                borderColor:activeCat===cat?"#0A1A2F":"#F2F6FA",
                background:activeCat===cat?"#0A1A2F":"white",
                color:activeCat===cat?"white":"#0A1A2F66",cursor:"pointer"}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Challenge list */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(c=>(
            <ChallengeCard key={c.id} challenge={c} localData={localData} onOpen={c=>setSelectedId(c.id)}/>
          ))}
        </div>

        {/* All-done nudge */}
        {hasAny && activeList.length===0 && completedCount>0 && (
          <div style={{marginTop:24,background:"white",borderRadius:22,border:"1px solid #F2F6FA",padding:"18px 20px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>🌟</div>
            <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:16,color:"#0A1A2F",marginBottom:4}}>You're on a roll!</div>
            <div style={{fontSize:13,color:"#0A1A2F55"}}>Pick a new challenge below and keep growing.</div>
          </div>
        )}
      </div>
    </div>
  );
}
