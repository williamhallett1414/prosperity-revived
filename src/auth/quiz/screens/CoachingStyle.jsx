import React from 'react';
import QuizScreen, { OptionCard } from '../QuizScreen';

export const COACHING_STYLE_OPTIONS = [
  { id: 'gentle', emoji: '🌿', label: 'Gentle', desc: 'Patient, kind, soft on hard days' },
  { id: 'direct', emoji: '🎯', label: 'Direct', desc: 'Straight talk, honest accountability' },
  { id: 'strategic', emoji: '🗺️', label: 'Strategic', desc: 'Frameworks, plans, clear next steps' },
  { id: 'contemplative', emoji: '🕯️', label: 'Contemplative', desc: 'Slow, reflective, scripture-anchored' },
];

export default function CoachingStyle({ value, onChange, stepIndex, totalSteps, onBack, onContinue }) {
  return (
    <QuizScreen
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      heading="How do you want to be walked with?"
      sub="Your guides will adjust their voice."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!value}
    >
      <div className="pb-4">
        {COACHING_STYLE_OPTIONS.map(opt => (
          <OptionCard
            key={opt.id}
            emoji={opt.emoji}
            label={opt.label}
            desc={opt.desc}
            selected={value === opt.id}
            onClick={() => onChange(opt.id)}
          />
        ))}
      </div>
    </QuizScreen>
  );
}
