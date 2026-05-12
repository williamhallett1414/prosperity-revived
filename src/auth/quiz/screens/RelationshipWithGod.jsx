import React from 'react';
import QuizScreen, { OptionCard } from '../QuizScreen';

export const GOD_RELATIONSHIP_OPTIONS = [
  { id: 'close', emoji: '🌅', label: 'Close — I feel His presence' },
  { id: 'going_through_motions', emoji: '📖', label: 'Going through the motions' },
  { id: 'dry_distant', emoji: '🌫️', label: 'A dry or distant season' },
  { id: 'wrestling', emoji: '⚔️', label: 'Wrestling — honest questions' },
  { id: 'curious', emoji: '🚪', label: 'Curious, still exploring' },
  { id: 'want_but_lost', emoji: '🌑', label: "I want a relationship with Him, but I don't know how" },
];

export default function RelationshipWithGod({ value, onChange, stepIndex, totalSteps, onBack, onContinue }) {
  return (
    <QuizScreen
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      heading="And your walk with God?"
      sub="Wherever you are, He's not surprised. Pick the one that fits today."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={!!value}
    >
      <div className="pb-4">
        {GOD_RELATIONSHIP_OPTIONS.map(opt => (
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
