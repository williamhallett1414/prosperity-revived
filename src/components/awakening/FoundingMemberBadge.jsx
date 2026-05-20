/**
 * FoundingMemberBadge — small inline badge identifying a user as one of
 * The Revived 500. Used in the Awakening event UI and reusable on profile,
 * Prayer Wall, etc.
 *
 * Variants:
 *   - 'pill'         (default) Compact horizontal pill, e.g. "👑 FOUNDING 500"
 *                    Best in tight inline spaces (banners, list rows).
 *   - 'seal'         Large circular gold seal for completion screens and
 *                    share graphics (w-24 h-24, "THE Revived 500" stacked).
 *   - 'corner-seal'  Small circular seal designed to sit at the top-right
 *                    corner of an avatar. Stamped/heraldic feel rather than
 *                    sticker feel.
 *   - 'wordmark'     Editorial letterspaced wordmark for placement beneath
 *                    a user's name on profile. Reads "— FOUNDING MEMBER —"
 *                    in small caps with subtle dividers, matching the
 *                    classical/serif brand voice.
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

  if (variant === 'corner-seal') {
    // Small heraldic-style seal designed to sit at the top-right of an avatar.
    // A simple stylized star/sparkle in a gold-gradient disc — clear at very
    // small sizes (24px+) and reads as a "mark of distinction" rather than a
    // crown emoji sticker.
    return (
      <div
        className={[
          'inline-flex items-center justify-center rounded-full',
          'p-[2px] bg-gradient-to-br from-[#FBF6EC] via-white to-[#FBF6EC]',
          'shadow-[0_2px_8px_-2px_rgba(253,156,45,0.65)]',
          className,
        ].join(' ')}
        aria-label="Founding Member of The Revived 500"
        title="Founding Member · The Revived 500"
      >
        <div
          className={[
            'rounded-full w-7 h-7 sm:w-8 sm:h-8',
            'bg-gradient-to-br from-[#FAD98D] via-[#FD9C2D] to-[#c9a227]',
            'flex items-center justify-center',
            'text-white',
            'border border-[#7a4a0a]/20',
          ].join(' ')}
        >
          {/* Stylized 4-point star with two crossed lines, evokes a compass
              rose / heraldic mark. Clear at small sizes, no text required. */}
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'wordmark') {
    // Editorial caption — letterspaced uppercase with a single flanking
    // ornament rather than a full divider rail, keeps it compact on narrow
    // screens. Uses an interpunct (·) via JSX to avoid encoding issues.
    return (
      <div
        className={[
          'inline-flex items-center gap-2',
          'text-[#7a4a0a] dark:text-[#FAD98D]',
          className,
        ].join(' ')}
        aria-label="Founding Member of The Revived 500"
      >
        <span
          className="text-[10px] tracking-[0.32em] font-bold uppercase whitespace-nowrap"
        >
          Founding Member
        </span>
        <span className="text-[10px] opacity-50" aria-hidden="true">{'\u00B7'}</span>
        <span
          className="text-[11px] italic font-serif whitespace-nowrap"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          The Revived 500
        </span>
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
