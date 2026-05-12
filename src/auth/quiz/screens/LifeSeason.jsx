import React from 'react';
import QuizScreen, { OptionCard } from '../QuizScreen';

export const LIFE_SEASON_OPTIONS = [
  { id: 'anxious_overwhelmed', emoji: '🌪️', label: 'Anxious or overwhelmed' },
  { id: 'going_through_motions', emoji: '💤', label: 'Going through the motions' },
  { id: 'stuck', emoji: '🪨', label: 'Stuck — same patterns, same place' },
  { id: 'rebuilding', emoji: '🌱', label: 'Starting to rebuild' },
  { id: 'hungry_for_more', emoji: '🔥', label: 'Hungry for more' },
  { id: 'steady_searching', emoji: '🕊️', label: 'Steady, but searching' },
  { id: 'unsure', emoji: '❓', label: "Honestly, I don't know" },
];

export default function LifeSeason({ value, onChange, stepIndex, totalSteps, onBack, onContinue }) {
  return (
    <QuizScreen
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      heading="Where are you, really?"
      sub="Grace meets us where we are, not where we should be. Pick the one closest to today."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!value}
    >
      <div className="pb-4">
        {LIFE_SEASON_OPTIONS.map(opt => (
          <OptionCard
            key={opt.id}
            emoji={opt.emoji}
            label={opt.label}
            selected={value === opt.id}
            onClick={() => onChange(opt.id)}
          />
        ))}
      </div>
    </QuizScreen>
  );
}
