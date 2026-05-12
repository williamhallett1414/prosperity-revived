import React from 'react';
import { ChevronLeft } from 'lucide-react';

/**
 * Shared layout for individual quiz screens. Renders:
 * - Top safe-area + progress bar
 * - Back button (top-left)
 * - Step indicator (e.g. "2 of 6")
 * - Heading + sub
 * - Children (options or inputs)
 * - Sticky footer with Continue button + optional Skip
 */
export default function QuizScreen({
  stepIndex,        // 0-indexed
  totalSteps,
  heading,
  sub,
  children,
  onBack,
  onContinue,
  canContinue = true,
  continueLabel = 'Continue',
  onSkip,           // if provided, shows a Skip link in the footer
  skipLabel = 'Skip this one',
}) {
  const pct = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div
      className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F] flex flex-col"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
      }}
    >
      {/* Header row: back button + step counter */}
      <div className="flex items-center justify-between px-4 mb-3 min-h-[44px]">
        {onBack ? (
          <button
            onClick={onBack}
            type="button"
            className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-[#2A3A3F] dark:text-white" />
          </button>
        ) : (
          <div className="w-11" />
        )}
        <span className="text-xs font-bold text-[#2A3A3F]/50 dark:text-white/50 uppercase tracking-wider">
          {stepIndex + 1} of {totalSteps}
        </span>
        <div className="w-11" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <div className="h-1 w-full bg-[#2A3A3F]/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FD9C2D] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Heading + sub */}
      <div className="px-6 mb-6 max-w-md w-full mx-auto">
        <h2
          className="text-2xl text-[#2A3A3F] dark:text-white mb-2 tracking-tight leading-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          {heading}
        </h2>
        {sub && (
          <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60 leading-relaxed">
            {sub}
          </p>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 px-6 max-w-md w-full mx-auto overflow-y-auto">
        {children}
      </div>

      {/* Footer: continue button + optional skip */}
      <div className="px-6 pt-4 max-w-md w-full mx-auto">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px]"
        >
          {continueLabel}
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-center text-sm text-[#2A3A3F]/60 dark:text-white/50 mt-3 py-2 hover:text-[#2A3A3F] dark:hover:text-white/80 transition-colors min-h-[44px]"
          >
            {skipLabel}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Single-select option card. Big tap target, emoji on left, label, check on right.
 */
export function OptionCard({ emoji, label, desc, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all flex items-center gap-3 mb-2.5 min-h-[60px] ${
        selected
          ? 'border-[#FD9C2D] bg-[#FD9C2D]/8'
          : 'border-[#2A3A3F]/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#2A3A3F]/20'
      }`}
    >
      {emoji && <span className="text-2xl flex-shrink-0" aria-hidden="true">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${selected ? 'text-[#0A1A2F] dark:text-white' : 'text-[#2A3A3F] dark:text-white/90'}`}>
          {label}
        </p>
        {desc && (
          <p className="text-xs text-[#2A3A3F]/60 dark:text-white/50 mt-1 leading-snug">
            {desc}
          </p>
        )}
      </div>
      {selected && (
        <div className="w-6 h-6 rounded-full bg-[#FD9C2D] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </button>
  );
}
