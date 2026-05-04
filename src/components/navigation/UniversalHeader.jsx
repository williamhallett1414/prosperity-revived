import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UniversalHeader({ title, rightAction = null, backTo = null }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(createPageUrl(backTo));
    } else {
      navigate(-1);
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