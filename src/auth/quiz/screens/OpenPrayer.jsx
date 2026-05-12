import React from 'react';
import QuizScreen from '../QuizScreen';

const MAX_LEN = 500;

export default function OpenPrayer({ value, onChange, stepIndex, totalSteps, onBack, onContinue, onSkip }) {
  const text = typeof value === 'string' ? value : '';

  return (
    <QuizScreen
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      heading="Last one — and you can skip it."
      sub="If you had five quiet minutes with God this week, what would you want to ask Him? No one but you sees this."
      onBack={onBack}
      onContinue={onContinue}
      canContinue={true}
      onSkip={onSkip}
      skipLabel="Skip this one"
    >
      <div className="pb-4">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LEN))}
          placeholder="I'd ask Him…"
          rows={6}
          className="w-full p-4 bg-white dark:bg-white/5 border-2 border-[#2A3A3F]/10 dark:border-white/10 rounded-2xl text-[#2A3A3F] dark:text-white placeholder:text-[#2A3A3F]/40 dark:placeholder:text-white/30 focus:outline-none focus:border-[#FD9C2D] resize-none leading-relaxed"
          style={{ fontFamily: 'inherit', fontSize: '15px' }}
        />
        <div className="flex justify-end mt-2">
          <span className="text-[10px] text-[#2A3A3F]/40 dark:text-white/30">
            {text.length} / {MAX_LEN}
          </span>
        </div>
      </div>
    </QuizScreen>
  );
}
