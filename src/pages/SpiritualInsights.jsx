import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import SpiritualInsightsDashboard from '@/components/gideon/SpiritualInsightsDashboard';

export default function SpiritualInsights() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAD98D]/10 via-pink-50 to-[#F2F6FA] dark:from-[#1a1a2e] dark:via-[#2d2d4a] dark:to-[#1a1a2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#b89320] via-pink-600 to-[#3C4E53] text-white px-4 py-6 shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <Link
            to={createPageUrl('Bible')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Spiritual Insights</h1>
            <p className="text-sm text-white/80">Gideon's analysis of your journey</p>
          </div>
        </div>
      </div>

      <SpiritualInsightsDashboard />
    </div>
  );
}