/**
 * FoundingMemberBadge — small inline badge identifying a user as one of
 * The Revived 500. Used in the Awakening event UI and reusable on profile,
 * Prayer Wall, etc.
 *
 * Variants:
 *   - 'pill'  (default) Compact horizontal pill, e.g. "👑 FOUNDING 500"
 *   - 'seal'  Circular gold seal for completion screens / share graphics
 */
import React from 'react';

export default function FoundingMemberBadge({ variant = 'pill', className = '' }) {
  if (variant === 'seal') {
    return (
      <div
        className={[
          'inline-flex items-center justify-center rounded-full',
          'bg-gradient-to-br from-[#FAD98D] to-[#FD9C2D]',
          'text-[#2A3A3F] shadow-[0_8px_24px_-8px_rgba(253,156,45,0.6)]',
          'w-24 h-24',
          className,
        ].join(' ')}
        aria-label="Founding Member of The Revived 500"
      >
        <div className="text-center leading-tight">
          <div className="text-[10px] tracking-[0.25em] font-semibold opacity-80">
            THE
          </div>
          <div className="font-serif italic text-2xl">Revived</div>
          <div className="text-xl font-bold tracking-widest">500</div>
        </div>
      </div>
    );
  }

  // pill (default)
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'bg-gradient-to-r from-[#FAD98D]/30 to-[#FD9C2D]/30',
        'border border-[#FD9C2D]/40',
        'text-[10px] tracking-[0.2em] font-semibold uppercase',
        'text-[#7a4a0a] dark:text-[#FAD98D]',
        className,
      ].join(' ')}
      aria-label="Founding Member of The Revived 500"
    >
      <span aria-hidden="true">👑</span>
      <span>Founding 500</span>
    </span>
  );
}
