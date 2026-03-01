import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import SpiritualInsightsDashboard from '@/components/gideon/SpiritualInsightsDashboard';

export default function SpiritualInsights() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E6EBEF] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Bible')}
            className="w-9 h-9 rounded-full bg-[#E6EBEF] hover:bg-[#D9DFE4] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Spiritual Insights</h1>
            <p className="text-xs text-[#0A1A2F]/60">Gideon's analysis of your journey</p>
          </div>
        </div>
      </div>

      <SpiritualInsightsDashboard />
    </div>
  );
}