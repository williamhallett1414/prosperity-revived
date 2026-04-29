/**
 * Scripture Attribution — World English Bible (Public Domain)
 *
 * The World English Bible (WEB) is a public domain translation of the Bible.
 * It is not copyrighted and may be freely used, quoted, and reproduced
 * without permission or royalty payment.
 *
 * This file provides:
 * 1. The attribution constant for display
 * 2. A small React component for inline attribution
 */

import React from 'react';

export const BIBLE_TRANSLATION = 'WEB';
export const BIBLE_TRANSLATION_FULL = 'World English Bible';
export const BIBLE_ATTRIBUTION = 'Scripture quotations are from the World English Bible (WEB), a public domain translation. No copyright restrictions apply.';

/**
 * Small inline attribution component for any page that displays scripture.
 * Usage: <ScriptureAttribution /> or <ScriptureAttribution className="mt-4" />
 */
export function ScriptureAttribution({ className = '' }) {
  return (
    <p className={`text-[9px] text-[#0A1A2F]/25 dark:text-white/25 text-center leading-relaxed ${className}`}>
      Scripture from the World English Bible (WEB) — Public Domain
    </p>
  );
}

export default ScriptureAttribution;
