import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import PhotoGalleryComponent from '@/components/profile/PhotoGallery';

export default function PhotoGallery() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] text-white px-4 pt-4 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            to={createPageUrl('Profile')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Photo Gallery</h1>
        </div>
      </div>

      {/* Photo Gallery Component */}
      <div className="px-4 mt-6">
        <PhotoGalleryComponent />
      </div>
    </div>
  );
}