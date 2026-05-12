import React from 'react';
import QuizScreen, { OptionCard } from '../QuizScreen';

export const HARDEST_AREA_OPTIONS = [
  { id: 'work_career', emoji: '💼', label: 'Work and career pressure' },
  { id: 'marriage_relationships', emoji: '💍', label: 'Marriage or relationships' },
  { id: 'parenting', emoji: '👶', label: 'Parenting' },
  { id: 'body_health', emoji: '💪', label: 'My body and health' },
  { id: 'anxiety_depression', emoji: '🌧️', label: 'Anxiety, depression, or fear' },
  { id: 'faith_doubt', emoji: '✝️', label: 'Faith or doubt' },
  { id: 'money_finances', emoji: '💰', label: 'Money and finances' },
  { id: 'purpose_direction', emoji: '🧭', label: 'Purpose and direction' },
];

export default function HardestArea({ value, onChange, stepIndex, totalSteps, onBack, onContinue }) {
  const selected = Array.isArray(value) ? value : [];
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  return (
    <QuizScreen
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      heading="What's been weighing on you?"
      sub="All of it is welcome here. Pick as many as fit."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={selected.length > 0}
    >
      <div className="pb-4">
        {HARDEST_AREA_OPTIONS.map(opt => (
          <OptionCard
            key={opt.id}
            emoji={opt.emoji}
            label={opt.label}
            selected={selected.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>
    </QuizScreen>
  );
}
