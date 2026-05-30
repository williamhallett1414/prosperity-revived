import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UniversalHeader({ title, rightAction = null, backTo = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Prefer browser back when the user actually navigated to this page from
    // somewhere else in the app — this respects where they came from (a
    // coaching plan, search results, etc.) rather than always teleporting
    // them to a single hardcoded page. backTo is used as a fallback when
    // this is the user's entry point to the app (deep links, push
    // notifications, fresh installs landing directly on a sub-page).
    //
    // React Router sets location.key to 'default' for the very first
    // navigation in the session and a unique random key for every push/
    // replace after that. So a non-'default' key means we have something
    // meaningful to pop back to.
    const isEntryPoint = location.key === 'default';
    if (!isEntryPoint) {
      navigate(-1);
    } else if (backTo) {
      navigate(createPageUrl(backTo));
    } else {
      // No history AND no fallback — go home as a last resort
      navigate(createPageUrl('Home'));
    }
  };

  return (
    <div
      className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A1A2F]/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/10 px-4 pb-3 flex items-center gap-3"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
    >
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white" />
      </button>
      <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white flex-1 truncate">{title}</h1>
      {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
    </div>
  );
}