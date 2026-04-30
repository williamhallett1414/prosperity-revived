import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function UniversalHeader({ title, rightAction = null, backTo = null }) {
  const handleBack = () => {
    if (backTo) {
      window.location.href = createPageUrl(backTo);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#0A1A2F] border-b border-gray-200 dark:border-white/10 px-4 py-3 pt-[env(safe-area-inset-top)]">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 text-[#3C4E53] dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        {title && (
          <h1 className="text-base font-bold text-[#3C4E53] dark:text-white truncate">{title}</h1>
        )}
        {rightAction && <div className="ml-auto">{rightAction}</div>}
      </div>
    </div>
  );























}