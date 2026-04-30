import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SpiritualInsightsDashboard from '@/components/gideon/SpiritualInsightsDashboard';

export default function SpiritualInsights() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F] dark:text-white dark:text-white">Spiritual Insights</h1>
            <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60">Gideon's analysis of your journey</p>
          </div>
        </div>
      </div>

      <SpiritualInsightsDashboard />
    </div>
  );
}