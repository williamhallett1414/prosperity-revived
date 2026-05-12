import React from 'react';

// Map quiz answer IDs to humanized phrases used in the moment-of-arrival copy.
const LIFE_SEASON_PHRASES = {
  anxious_overwhelmed: 'feeling overwhelmed',
  going_through_motions: 'running on autopilot',
  stuck: 'feeling stuck',
  rebuilding: 'ready to rebuild',
  hungry_for_more: 'hungry for more',
  steady_searching: 'steady but seeking',
  unsure: 'where you are',
};

const PRIORITY_PHRASES = {
  deeper_spiritual_life: 'a deeper walk with God',
  stronger_body: 'a stronger, healthier body',
  calmer_mind: 'more peace and less anxiety',
  better_relationships: 'stronger relationships',
  clearer_purpose: 'clearer purpose',
  more_discipline: 'deeper consistency',
  more_rest: 'real rest',
  better_nutrition: 'healthier fuel for your body',
};

const COACHING_STYLE_PHRASES = {
  gentle: 'gentle, patient',
  direct: 'honest, accountable',
  strategic: 'clear, step-by-step',
  contemplative: 'slow, scripture-anchored',
};

// Safe lookups with a sensible fallback if a key is missing or empty.
function lifeSeasonText(id) {
  return LIFE_SEASON_PHRASES[id] || 'where you are';
}
function topPriorityText(priorities) {
  const first = Array.isArray(priorities) ? priorities[0] : null;
  return PRIORITY_PHRASES[first] || 'what matters most to you';
}
function coachingStyleText(id) {
  return COACHING_STYLE_PHRASES[id] || 'steady';
}

export default function MomentOfArrival({ answers, onContinue }) {
  const seasonText = lifeSeasonText(answers.life_season);
  const priorityText = topPriorityText(answers.priorities);
  const styleText = coachingStyleText(answers.coaching_style);

  return (
    <div
      className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F] flex flex-col px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 2rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
      }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        {/* Headline */}
        <h2
          className="text-3xl text-[#2A3A3F] dark:text-white mb-6 tracking-tight leading-tight text-center"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          Grace meets you here.
        </h2>

        {/* Dynamic body */}
        <p className="text-base text-[#2A3A3F]/85 dark:text-white/80 leading-relaxed mb-4">
          You came in honest about <span className="font-bold text-[#0A1A2F] dark:text-white">{seasonText}</span>. Over the next 90 days, we're going to walk with you toward <span className="font-bold text-[#0A1A2F] dark:text-white">{priorityText}</span> — at a <span className="font-bold text-[#0A1A2F] dark:text-white">{styleText}</span> pace.
        </p>
        <p className="text-base text-[#2A3A3F]/85 dark:text-white/80 leading-relaxed mb-8">
          No performance. No shame. Just steady steps with people who are walking it too.
        </p>

        {/* Guides */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 mb-8 border border-[#2A3A3F]/10 dark:border-white/10">
          <p className="text-xs font-bold text-[#2A3A3F]/60 dark:text-white/60 uppercase tracking-widest mb-3">
            Five guides for the journey
          </p>
          <ul className="space-y-2.5 text-sm text-[#2A3A3F] dark:text-white/90">
            <li><span className="font-bold">Gideon</span> — Scripture and study</li>
            <li><span className="font-bold">Hannah</span> — prayer and the deeper life</li>
            <li><span className="font-bold">Coach Paul</span> — emotional and personal growth</li>
            <li><span className="font-bold">Coach David</span> — fitness and strength</li>
            <li><span className="font-bold">Chef Daniel</span> — nutrition and fuel</li>
          </ul>
        </div>

        {/* Verse */}
        <p className="text-center text-sm text-[#2A3A3F]/60 dark:text-white/50 italic mb-8 leading-relaxed">
          "My grace is sufficient for you, for my power is made perfect in weakness." — 2 Corinthians 12:9
        </p>
      </div>

      {/* CTA */}
      <div className="max-w-md w-full mx-auto">
        <button
          type="button"
          onClick={onContinue}
          className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px]"
        >
          Create my account →
        </button>
      </div>
    </div>
  );
}
