import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import GuidedMeditationPlayer from '@/components/wellness/GuidedMeditationPlayer';

export default function DiscoverMeditations() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 max-w-2xl mx-auto">
        <Link
          to={createPageUrl('Wellness')}
          className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors inline-flex"
        >
          <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
        </Link>
        <h1 className="text-3xl font-bold text-[#0A1A2F] mt-4 mb-1">Guided Meditations</h1>
        <p className="text-[#0A1A2F]/60 text-sm">Find peace and spiritual renewal</p>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 max-w-2xl mx-auto">
        <GuidedMeditationPlayer />
      </div>
    </div>
  );
}