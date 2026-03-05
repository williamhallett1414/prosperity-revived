import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function UniversalHeader({ title, rightAction = null, backTo = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Root pages that shouldn't show back button
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#2d2d4a] border-b border-gray-200 dark:border-gray-700 px-4 py-3 pt-[env(safe-area-inset-top)]">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Left: Back Button */}
        {!isRootPage ? null :







        <div className="w-10" />
        }

        {/* Center: Title */}
        <h1 className="text-lg font-bold text-[#0A1A2F] dark:text-white">{title}</h1>

        {/* Right: Actions or Spacer */}
        {rightAction || <div className="w-10" />}
      </div>
    </div>);

}