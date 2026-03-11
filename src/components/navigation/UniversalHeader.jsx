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
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
      className="bg-white border-b border-gray-200 px-4 py-3"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between">

        {/* Left: Back Button */}
        <button
          onClick={handleBack}
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 active:bg-gray-200"
        >
          <ArrowLeft className="w-4 h-4 text-gray-800" />
        </button>

        {/* Center: Title */}
        <h1 className="text-base font-bold text-gray-900 truncate px-2">{title}</h1>

        {/* Right */}
        {rightAction || <div className="w-9" />}
      </div>
    </div>
  );
}