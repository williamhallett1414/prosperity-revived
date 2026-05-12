import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * Shared layout for all auth screens.
 *
 * Two display modes:
 * 1. Default (no heroImage): paper background, centered title, form vertically centered.
 *    Used for Verify, ForgotPassword, ResetPassword — functional screens.
 * 2. Hero mode (heroImage prop): image fills top ~38vh of viewport with a soft fade to
 *    paper/teal. Back button overlays the image. Form sits below on the paper area.
 *    Used for Login + Signup — first-impression screens.
 */
export default function AuthLayout({ children, showBack = false, backTo = '/login', verse, heroImage }) {
  if (heroImage) {
    return (
      <div className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F] flex flex-col">
        {/* Hero image with fade-out gradient at bottom */}
        <div className="relative w-full" style={{ height: '38vh', minHeight: 240, maxHeight: 360 }}>
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover select-none"
            draggable="false"
          />
          {/* Light-mode fade: image → paper */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 dark:hidden pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(251,246,236,0) 0%, #FBF6EC 100%)' }}
          />
          {/* Dark-mode fade: image → deep teal */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 hidden dark:block pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(10,26,47,0) 0%, #0A1A2F 100%)' }}
          />
          {/* Back button overlays the hero — high contrast for readability over any photo */}
          {showBack && (
            <div
              className="absolute left-3"
              style={{ top: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
            >
              <Link
                to={backTo}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/45 transition-colors"
                aria-label="Back"
              >
                <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
              </Link>
            </div>
          )}
        </div>

        {/* Form area — paper background, generous padding, overlaps fade slightly */}
        <div
          className="flex-1 flex flex-col px-6 -mt-6"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
        >
          <div className="flex-1 flex flex-col justify-start max-w-md w-full mx-auto pt-2">
            {children}
          </div>
          {verse && (
            <p className="text-center text-xs text-[#2A3A3F]/60 dark:text-white/50 italic mt-8">
              {verse}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default mode (no hero image): keep the original clean paper layout
  return (
    <div
      className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F] flex flex-col px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
      }}
    >
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

      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        {children}
      </div>

      {verse && (
        <p className="text-center text-xs text-[#2A3A3F]/60 dark:text-white/50 italic mt-8">
          {verse}
        </p>
      )}
    </div>
  );
}
