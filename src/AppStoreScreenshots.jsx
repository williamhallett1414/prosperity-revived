import { useState } from "react";

const BRAND = {
  navy: "#0A1A2F",
  gold: "#c9a227",
  goldLight: "#FAD98D",
  orange: "#FD9C2D",
  blue: "#AFC7E3",
  sky: "#38BDF8",
  green: "#22C55E",
  bg: "#F2F6FA",
  white: "#FFFFFF",
};

const W = 393;
const H = 852;

// ─── Screen 1: Homepage ─────────────────────────────────────────────────────
function HomeScreen() {
  return (
    <div style={{ width: W, height: H, background: BRAND.bg, fontFamily: "'SF Pro Display', -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      {/* Status bar */}
      <div style={{ height: 54, background: BRAND.white, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: BRAND.navy }}>9:41</span>
      </div>

      {/* Header */}
      <div style={{ background: BRAND.white, padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, color: `${BRAND.navy}60`, fontWeight: 600, margin: 0 }}>Good Morning</p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: BRAND.navy, margin: "2px 0 0" }}>Welcome back, Will</h1>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: BRAND.white }}>W</span>
          </div>
        </div>
      </div>

      {/* Daily Progress Ring */}
      <div style={{ margin: "12px 20px", background: BRAND.white, borderRadius: 24, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#F2F6FA" strokeWidth="8" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={BRAND.gold} strokeWidth="8" strokeDasharray="160 54" strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: BRAND.navy }}>75%</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: BRAND.navy, margin: 0 }}>Today's Progress</p>
            <p style={{ fontSize: 12, color: `${BRAND.navy}50`, margin: "4px 0 8px" }}>3 of 4 daily goals complete</p>
            <div style={{ display: "flex", gap: 6 }}>
              {["🙏", "💪", "📖"].map((e, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: `${BRAND.gold}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{e}</div>
              ))}
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, opacity: 0.4 }}>🥗</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scripture Card */}
      <div style={{ margin: "0 20px 12px", background: `linear-gradient(135deg, ${BRAND.navy}, #162944)`, borderRadius: 24, padding: "20px 20px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${BRAND.gold}20` }} />
        <p style={{ fontSize: 9, fontWeight: 900, color: BRAND.gold, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Today's Verse</p>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, margin: "8px 0 6px", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
          "I can do all things through Christ who strengthens me."
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>Philippians 4:13</p>
      </div>

      {/* Quick Nav */}
      <div style={{ margin: "0 20px 12px" }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: `${BRAND.navy}35`, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>Explore</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Bible", emoji: "📖", bg: "#FFF8EB", color: "#D97706" },
            { label: "Wellness", emoji: "💪", bg: "#EFF6FF", color: "#3B82F6" },
            { label: "Prayer", emoji: "🙏", bg: "#FFF1F2", color: "#F43F5E" },
            { label: "Nutrition", emoji: "🥗", bg: "#ECFDF5", color: "#10B981" },
            { label: "Community", emoji: "👥", bg: "#F5F3FF", color: "#7C3AED" },
            { label: "Couples", emoji: "💕", bg: "#FFF1F3", color: "#EC4899" },
          ].map((n, i) => (
            <div key={i} style={{ background: n.bg, borderRadius: 16, padding: "14px 8px", textAlign: "center" }}>
              <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>{n.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: n.color }}>{n.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Guides */}
      <div style={{ margin: "0 20px" }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: `${BRAND.navy}35`, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>Your AI Guides</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { name: "Gideon", emoji: "📖", sub: "Bible", bg: "#FFF8EB" },
            { name: "Hannah", emoji: "💛", sub: "Mindset", bg: "#EFF6FF" },
            { name: "David", emoji: "💪", sub: "Fitness", bg: "#DBEAFE" },
            { name: "Daniel", emoji: "🍽️", sub: "Nutrition", bg: "#FFF7ED" },
            { name: "Paul", emoji: "👑", sub: "Discipline", bg: "#F5F3FF" },
          ].map((g, i) => (
            <div key={i} style={{ flex: 1, background: g.bg, borderRadius: 14, padding: "10px 4px", textAlign: "center" }}>
              <span style={{ fontSize: 20 }}>{g.emoji}</span>
              <p style={{ fontSize: 10, fontWeight: 700, color: BRAND.navy, margin: "4px 0 0" }}>{g.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: BRAND.white, borderTop: `1px solid ${BRAND.navy}08`, padding: "8px 20px 28px", display: "flex", justifyContent: "space-around" }}>
        {[
          { icon: "🏠", label: "Home", active: true },
          { icon: "📖", label: "Bible", active: false },
          { icon: "❤️", label: "Wellness", active: false },
          { icon: "👥", label: "Community", active: false },
          { icon: "👤", label: "Profile", active: false },
        ].map((t, i) => (
          <div key={i} style={{ textAlign: "center", opacity: t.active ? 1 : 0.35 }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <p style={{ fontSize: 9, fontWeight: 700, color: t.active ? BRAND.gold : BRAND.navy, margin: "2px 0 0" }}>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen 2: AI Chat ──────────────────────────────────────────────────────
function ChatScreen() {
  return (
    <div style={{ width: W, height: H, background: "linear-gradient(180deg, #1a3a4a 0%, #0f2027 100%)", fontFamily: "'SF Pro Display', -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      <div style={{ height: 54, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>9:41</span>
      </div>

      {/* Header */}
      <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${BRAND.blue}, #7ab3d4)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20 }}>💛</span>
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "white", margin: 0 }}>Hannah (AI)</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>Mindset & Growth Coach</p>
        </div>
      </div>

      {/* Chat messages */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {/* Bot message */}
        <div style={{ maxWidth: "82%", background: "rgba(255,255,255,0.08)", borderRadius: "20px 20px 20px 6px", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
            Good morning, Will! I can see you've been consistent with your prayer life this week — 5 days straight. That's real growth. What's on your heart today?
          </p>
        </div>

        {/* User message */}
        <div style={{ maxWidth: "75%", alignSelf: "flex-end", background: `linear-gradient(135deg, ${BRAND.blue}, #7ab3d4)`, borderRadius: "20px 20px 6px 20px", padding: "14px 16px" }}>
          <p style={{ fontSize: 14, color: "white", lineHeight: 1.6, margin: 0 }}>
            I've been feeling stuck in my career and I'm not sure if I'm on the right path. Can you help me think through this?
          </p>
        </div>

        {/* Bot response */}
        <div style={{ maxWidth: "82%", background: "rgba(255,255,255,0.08)", borderRadius: "20px 20px 20px 6px", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
            I hear you, and that tension is actually a sign of growth — not failure. Let's unpack this together. First, when you imagine doing what you were <em>made</em> to do, what does that look like? Not what pays the bills — what makes you come alive?
          </p>
        </div>

        {/* User */}
        <div style={{ maxWidth: "75%", alignSelf: "flex-end", background: `linear-gradient(135deg, ${BRAND.blue}, #7ab3d4)`, borderRadius: "20px 20px 6px 20px", padding: "14px 16px" }}>
          <p style={{ fontSize: 14, color: "white", lineHeight: 1.6, margin: 0 }}>
            Honestly... helping people grow spiritually. That's what fires me up.
          </p>
        </div>

        {/* Bot */}
        <div style={{ maxWidth: "82%", background: "rgba(255,255,255,0.08)", borderRadius: "20px 20px 20px 6px", padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
            There it is. Jeremiah 29:11 says God has plans to prosper you and give you a future and a hope. That passion isn't random — it's a calling. Let's build a 90-day action plan around it. Ready?
          </p>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(15,32,39,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px 34px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)" }}>Message Hannah...</span>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${BRAND.blue}, #7ab3d4)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18, color: "white" }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 3: Prayer ───────────────────────────────────────────────────────
function PrayerScreen() {
  return (
    <div style={{ width: W, height: H, background: "linear-gradient(180deg, #050f18 0%, #0a1a2f 40%, #0d1f35 100%)", fontFamily: "'SF Pro Display', -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      <div style={{ height: 54, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>9:41</span>
      </div>

      <div style={{ padding: "8px 20px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: 0, fontFamily: "Georgia, serif" }}>Prayer</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: "#22C55E" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>24 requests · 148 prayers</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.gold, marginLeft: 8 }}>🔥 12d streak</span>
        </div>
      </div>

      {/* Scripture card */}
      <div style={{ margin: "0 20px 14px", padding: 16, borderRadius: 20, background: `${BRAND.gold}10`, border: `1px solid ${BRAND.gold}25` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: BRAND.gold }} />
          <span style={{ fontSize: 9, fontWeight: 900, color: BRAND.gold, letterSpacing: 2, textTransform: "uppercase" }}>Before You Pray</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontStyle: "italic", fontFamily: "Georgia, serif", margin: 0 }}>
          "Don't be anxious for anything, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God."
        </p>
        <p style={{ fontSize: 10, color: `${BRAND.gold}60`, margin: "8px 0 0" }}>Philippians 4:6 (WEB)</p>
      </div>

      {/* ACTS Guided Prayer */}
      <div style={{ margin: "0 20px 14px", borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.25)", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Guided Prayer</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "white", margin: "4px 0 0", fontFamily: "Georgia, serif" }}>ACTS Model</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[BRAND.gold, "#60a5fa", "#34d399", "#a78bfa"].map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 24, height: 4, borderRadius: 2, background: i === 0 ? c : "rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: 7, fontWeight: 800, color: "rgba(255,255,255,0.2)" }}>{["A", "C", "T", "S"][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.gold }}>Adoration</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: "0 0 12px" }}>Praise God for who He is — His holiness, goodness, faithfulness.</p>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, border: `1px solid ${BRAND.gold}30`, padding: "12px 14px", minHeight: 60 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>Lord, I praise You because You are…</span>
        </div>
      </div>

      {/* Prayer Wall preview */}
      <div style={{ margin: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase" }}>Prayer Wall</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>24 requests</span>
        </div>
        {[
          { name: "Sarah M.", text: "Please pray for my mother's surgery tomorrow.", count: 18, cat: "Healing" },
          { name: "Anonymous", text: "Struggling with anxiety about my finances. Need peace.", count: 12, cat: "Finances" },
        ].map((r, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: "linear-gradient(135deg, #1a3a4a, #2d5a70)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{r.name[0]}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{r.name}</span>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.25)", color: BRAND.gold, fontWeight: 700 }}>{r.cat}</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>{r.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              <span style={{ fontSize: 12 }}>🙏</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{r.count} praying</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen 4: Nutrition ────────────────────────────────────────────────────
function NutritionScreen() {
  return (
    <div style={{ width: W, height: H, background: BRAND.bg, fontFamily: "'SF Pro Display', -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      <div style={{ height: 54, background: BRAND.white, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: BRAND.navy }}>9:41</span>
      </div>

      <div style={{ background: BRAND.white, padding: "12px 20px 16px", borderBottom: `1px solid ${BRAND.goldLight}30` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>🍽️</span>
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: BRAND.navy, margin: 0 }}>Nutrition</h1>
            <p style={{ fontSize: 11, color: `${BRAND.navy}45`, margin: 0 }}>Thursday, Apr 3</p>
          </div>
        </div>
      </div>

      {/* Macro rings */}
      <div style={{ margin: "14px 20px", background: BRAND.white, borderRadius: 20, padding: "16px 20px", border: `1px solid ${BRAND.goldLight}25` }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: `${BRAND.navy}30`, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 14px" }}>Today's Progress</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {[
            { label: "Calories", val: 1480, target: 2000, pct: 74 },
            { label: "Protein", val: 98, target: 150, pct: 65, unit: "g" },
            { label: "Carbs", val: 185, target: 250, pct: 74, unit: "g" },
            { label: "Fat", val: 42, target: 65, pct: 65, unit: "g" },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: 52, height: 52, margin: "0 auto 6px" }}>
                <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#F2F6FA" strokeWidth="5" />
                  <circle cx="26" cy="26" r="22" fill="none" stroke={BRAND.gold} strokeWidth="5" strokeDasharray={`${m.pct * 1.38} ${138 - m.pct * 1.38}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: BRAND.navy }}>{m.val}</span>
                </div>
              </div>
              <p style={{ fontSize: 8, fontWeight: 800, color: `${BRAND.navy}35`, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: 8, color: `${BRAND.navy}25`, margin: 0 }}>{m.target}{m.unit || ""}</p>
            </div>
          ))}
        </div>
        {/* Calorie bar */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BRAND.goldLight}15` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
            <span style={{ color: `${BRAND.navy}50`, fontWeight: 600 }}>1,480 kcal eaten</span>
            <span style={{ color: `${BRAND.navy}30` }}>520 remaining</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "#F2F6FA", overflow: "hidden" }}>
            <div style={{ width: "74%", height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.goldLight})` }} />
          </div>
        </div>
      </div>

      {/* Water tracker */}
      <div style={{ margin: "0 20px 14px", background: BRAND.white, borderRadius: 20, padding: "14px 20px", border: `1px solid ${BRAND.goldLight}25` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `${BRAND.blue}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>💧</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, margin: 0 }}>Water Intake</p>
              <p style={{ fontSize: 11, color: `${BRAND.navy}40`, margin: 0 }}>6 / 8 glasses</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: 14, background: i < 6 ? BRAND.blue : "#F2F6FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>💧</div>
          ))}
        </div>
      </div>

      {/* Meals logged */}
      <div style={{ margin: "0 20px" }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: `${BRAND.navy}30`, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>Meals Logged Today · 3</p>
        {[
          { emoji: "🌅", name: "Scrambled Eggs & Toast", type: "breakfast", cal: 320 },
          { emoji: "☀️", name: "Grilled Chicken Salad", type: "lunch", cal: 420 },
          { emoji: "🌙", name: "Salmon & Broccoli", type: "dinner", cal: 480 },
        ].map((m, i) => (
          <div key={i} style={{ background: BRAND.white, borderRadius: 14, border: `1px solid ${BRAND.goldLight}15`, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{m.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: BRAND.navy, margin: 0 }}>{m.name}</p>
              <p style={{ fontSize: 10, color: `${BRAND.navy}30`, margin: 0, textTransform: "capitalize" }}>{m.type}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: BRAND.gold, margin: 0 }}>{m.cal}</p>
              <p style={{ fontSize: 8, color: `${BRAND.navy}25`, margin: 0 }}>kcal</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: BRAND.white, borderTop: `1px solid ${BRAND.navy}08`, padding: "8px 20px 28px", display: "flex", justifyContent: "space-around" }}>
        {[
          { icon: "🏠", label: "Home" },
          { icon: "📖", label: "Bible" },
          { icon: "❤️", label: "Wellness" },
          { icon: "👥", label: "Community" },
          { icon: "👤", label: "Profile" },
        ].map((t, i) => (
          <div key={i} style={{ textAlign: "center", opacity: 0.35 }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <p style={{ fontSize: 9, fontWeight: 700, color: BRAND.navy, margin: "2px 0 0" }}>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen 5: Workout ──────────────────────────────────────────────────────
function WorkoutScreen() {
  return (
    <div style={{ width: W, height: H, background: BRAND.bg, fontFamily: "'SF Pro Display', -apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
      <div style={{ height: 54, background: BRAND.white, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: BRAND.navy }}>9:41</span>
      </div>

      <div style={{ background: BRAND.white, padding: "12px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(135deg, #38BDF8, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>💪</span>
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: BRAND.navy, margin: 0 }}>Workouts</h1>
            <p style={{ fontSize: 11, color: `${BRAND.navy}45`, margin: 0 }}>Thursday, Apr 3</p>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div style={{ margin: "12px 20px", background: "linear-gradient(135deg, #f97316, #f59e0b)", borderRadius: 20, padding: 16, textAlign: "center" }}>
        <span style={{ fontSize: 28 }}>🔥</span>
        <p style={{ fontSize: 18, fontWeight: 900, color: "white", margin: "4px 0 2px" }}>14-Day Streak!</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Two weeks strong! This is becoming a habit.</p>
      </div>

      {/* Today's workout */}
      <div style={{ margin: "12px 20px" }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: `${BRAND.navy}30`, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>Today's Workout</p>
        <div style={{ background: BRAND.white, borderRadius: 20, overflow: "hidden", border: `1px solid ${BRAND.goldLight}25` }}>
          <div style={{ background: "linear-gradient(135deg, #0A1A2F, #1a3a5c)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 900, color: `${BRAND.sky}80`, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Strength</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "white", margin: "4px 0" }}>Full Body Power</p>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>⏱️ 45 min</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>🔥 ~380 cal</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>💪 8 exercises</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, color: `${BRAND.navy}40`, margin: 0 }}>Coach David says:</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: BRAND.navy, margin: "2px 0 0", fontStyle: "italic" }}>"Your body is a temple. Let's build it strong."</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${BRAND.sky}, #0EA5E9)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20, color: "white" }}>▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly overview */}
      <div style={{ margin: "12px 20px" }}>
        <p style={{ fontSize: 10, fontWeight: 900, color: `${BRAND.navy}30`, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>This Week</p>
        <div style={{ display: "flex", gap: 6 }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
            const done = i < 3;
            const today = i === 3;
            return (
              <div key={i} style={{ flex: 1, textAlign: "center", background: today ? `${BRAND.sky}15` : BRAND.white, borderRadius: 14, padding: "10px 0", border: today ? `2px solid ${BRAND.sky}40` : `1px solid ${BRAND.navy}08` }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: `${BRAND.navy}40`, margin: 0 }}>{d}</p>
                <div style={{ width: 24, height: 24, borderRadius: 12, margin: "6px auto 0", background: done ? "#22C55E" : today ? `${BRAND.sky}30` : "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done && <span style={{ fontSize: 12, color: "white" }}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ margin: "12px 20px", display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: BRAND.white, borderRadius: 16, padding: 14, textAlign: "center", border: `1px solid ${BRAND.navy}08` }}>
          <p style={{ fontSize: 24, fontWeight: 900, color: BRAND.sky, margin: 0 }}>47</p>
          <p style={{ fontSize: 9, fontWeight: 700, color: `${BRAND.navy}35`, margin: "2px 0 0", textTransform: "uppercase" }}>Total Workouts</p>
        </div>
        <div style={{ flex: 1, background: BRAND.white, borderRadius: 16, padding: 14, textAlign: "center", border: `1px solid ${BRAND.navy}08` }}>
          <p style={{ fontSize: 24, fontWeight: 900, color: "#22C55E", margin: 0 }}>14</p>
          <p style={{ fontSize: 9, fontWeight: 700, color: `${BRAND.navy}35`, margin: "2px 0 0", textTransform: "uppercase" }}>Day Streak</p>
        </div>
        <div style={{ flex: 1, background: BRAND.white, borderRadius: 16, padding: 14, textAlign: "center", border: `1px solid ${BRAND.navy}08` }}>
          <p style={{ fontSize: 24, fontWeight: 900, color: BRAND.orange, margin: 0 }}>12k</p>
          <p style={{ fontSize: 9, fontWeight: 700, color: `${BRAND.navy}35`, margin: "2px 0 0", textTransform: "uppercase" }}>Calories Burned</p>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: BRAND.white, borderTop: `1px solid ${BRAND.navy}08`, padding: "8px 20px 28px", display: "flex", justifyContent: "space-around" }}>
        {[
          { icon: "🏠", label: "Home" },
          { icon: "📖", label: "Bible" },
          { icon: "❤️", label: "Wellness", active: true },
          { icon: "👥", label: "Community" },
          { icon: "👤", label: "Profile" },
        ].map((t, i) => (
          <div key={i} style={{ textAlign: "center", opacity: t.active ? 1 : 0.35 }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <p style={{ fontSize: 9, fontWeight: 700, color: t.active ? BRAND.gold : BRAND.navy, margin: "2px 0 0" }}>{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
const SCREENS = [
  { id: "home", label: "Homepage", Component: HomeScreen },
  { id: "chat", label: "AI Chat", Component: ChatScreen },
  { id: "prayer", label: "Prayer", Component: PrayerScreen },
  { id: "nutrition", label: "Nutrition", Component: NutritionScreen },
  { id: "workout", label: "Workout", Component: WorkoutScreen },
];

export default function AppStoreScreenshots() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#111", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, marginBottom: 4, fontFamily: "-apple-system, sans-serif" }}>
          Prosperity Revived — App Store Screenshots
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>
          Click any screen to view full size. Right-click → Save Image to download.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {SCREENS.map(s => (
            <button key={s.id} onClick={() => setSelected(s.id === selected ? null : s.id)}
              style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: selected === s.id ? BRAND.gold : "rgba(255,255,255,0.1)", color: selected === s.id ? "white" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {s.label}
            </button>
          ))}
          <button onClick={() => setSelected(null)}
            style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: !selected ? BRAND.gold : "rgba(255,255,255,0.1)", color: !selected ? "white" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            All 5
          </button>
        </div>

        {selected ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ borderRadius: 40, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "8px solid #222" }}>
              {SCREENS.find(s => s.id === selected)?.Component()}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
            {SCREENS.map(s => (
              <div key={s.id} onClick={() => setSelected(s.id)} style={{ cursor: "pointer", flexShrink: 0 }}>
                <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.4)", border: "6px solid #222", transform: "scale(0.65)", transformOrigin: "top left", width: W, height: H }}>
                  <s.Component />
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textAlign: "center", marginTop: -200 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
