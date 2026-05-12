import React from 'react';
import QuizScreen, { OptionCard } from '../QuizScreen';

export const PRIORITY_OPTIONS = [
  { id: 'deeper_spiritual_life', emoji: '🙏', label: 'A deeper spiritual life' },
  { id: 'stronger_body', emoji: '💪', label: 'A stronger, healthier body' },
  { id: 'calmer_mind', emoji: '🧘', label: 'A calmer mind, less anxiety' },
  { id: 'better_relationships', emoji: '❤️', label: 'A better marriage or relationships' },
  { id: 'clearer_purpose', emoji: '🧭', label: 'Clearer purpose' },
  { id: 'more_discipline', emoji: '⚡', label: 'More discipline and consistency' },
  { id: 'more_rest', emoji: '🛌', label: 'More rest and peace' },
  { id: 'better_nutrition', emoji: '🍎', label: 'Better food and nutrition habits' },
];

const MAX_SELECT = 3;

export default function Priorities({ value, onChange, stepIndex, totalSteps, onBack, onContinue }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else if (selected.length < MAX_SELECT) {
      onChange([...selected, id]);
    }
    // else: silently ignore — user is at max
  };

  return (
    <QuizScreen
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      heading="Three months from now, what do you want to be true?"
      sub={`Pick up to ${MAX_SELECT}. This isn't a contract — it's a direction.`}
      onBack={onBack}
      onContinue={onContinue}
      canContinue={selected.length > 0}
    >
      <div className="pb-4">
        {PRIORITY_OPTIONS.map(opt => {
          const isSelected = selected.includes(opt.id);
          const atMax = selected.length >= MAX_SELECT && !isSelected;
          return (
            <div key={opt.id} className={atMax ? 'opacity-40' : ''}>
              <OptionCard
                emoji={opt.emoji}
                label={opt.label}
                selected={isSelected}
                onClick={() => toggle(opt.id)}
              />
            </div>
          );
        })}
        {selected.length === MAX_SELECT && (
          <p className="text-xs text-center text-[#2A3A3F]/60 dark:text-white/50 mt-2">
            {MAX_SELECT} picked. Tap to swap.
          </p>
        )}
      </div>
    </QuizScreen>
  );
}
