import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function UniversalHeader({ title, rightAction = null, backTo = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Root pages that shouldn't show a back button
  const rootPages = ['/', '/Home', '/Wellness', '/Bible', '/Groups', '/Profile'];
  const isRootPage = rootPages.includes(location.pathname);

  const handleBack = () => {
    if (backTo) {
      navigate(createPageUrl(backTo));
    } else {
      window.history.back();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 pt-[env(safe-area-inset-top)]">
      <div className="max-w-2xl mx-auto flex items-center justify-between">

        {/* Left: Back Button or spacer */}
        {!isRootPage ? (
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        {/* Center: Title */}
        <h1 className="text-base font-bold text-[#0A1A2F] truncate px-2">{title}</h1>

        {/* Right: Actions or spacer */}
        {rightAction || <div className="w-9" />}
      </div>
    </div>
  );
}
