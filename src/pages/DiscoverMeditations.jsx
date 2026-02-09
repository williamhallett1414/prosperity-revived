import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import GuidedMeditationPlayer from '@/components/wellness/GuidedMeditationPlayer';

export default function DiscoverMeditations() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 p-8 text-white text-center shadow-lg">
        <Link
          to={createPageUrl('Wellness')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-4xl font-bold mb-2">Moments of Revival</h1>
        <p className="text-white/90">Find peace, prayer, and spiritual renewal</p>
      </div>

      {/* Content */}
      <div className="px-4 pt-8">
        <div className="max-w-6xl mx-auto">
          <GuidedMeditationPlayer />
        </div>
      </div>
    </div>
  );
}