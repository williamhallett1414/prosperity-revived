import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * Shared layout for all auth screens (Login, Signup, VerifyEmail,
 * ForgotPassword, ResetPassword). Provides:
 * - iOS safe-area padding
 * - Brand-consistent paper background and logo
 * - Optional back button
 * - Optional bottom scripture
 */
export default function AuthLayout({ children, showBack = false, backTo = '/login', verse }) {
  return (
    <div
      className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F] flex flex-col px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
      }}
    >
      {/* Header: back button (optional) */}
      <div className="flex items-center justify-between mb-6 min-h-[44px]">
        {showBack ? (
          <Link
            to={backTo}
            className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-[#2A3A3F] dark:text-white" />
          </Link>
        ) : (
          <div className="w-11" />
        )}
        <h1
          className="text-xl text-[#2A3A3F] dark:text-white tracking-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          Prosperity Revived
        </h1>
        <div className="w-11" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        {children}
      </div>

      {/* Optional verse footer */}
      {verse && (
        <p className="text-center text-xs text-[#2A3A3F]/60 dark:text-white/50 italic mt-8">
          {verse}
        </p>
      )}
    </div>
  );
}
