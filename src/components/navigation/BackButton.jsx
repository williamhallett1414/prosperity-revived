import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BackButton({ to = null, label = 'Back', className = '' }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(createPageUrl(to));
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label={label}
      className={`flex items-center gap-1.5 text-[#0A1A2F]/60 dark:text-white/60 hover:text-[#0A1A2F] dark:hover:text-white transition-colors min-h-[44px] ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}