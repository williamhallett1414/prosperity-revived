import React from 'react';
import { ArrowLeft, Camera} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PhotoGalleryComponent from '@/components/profile/PhotoGallery';

export default function PhotoGalleryPage() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F]">Photo Gallery</h1>
            <p className="text-xs text-[#0A1A2F]/45">Your progress photos</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] text-white px-4 pt-4 pb-6">
        <Link
          to={createPageUrl('Profile')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">My Gallery</h1>
      </div>

      {/* Gallery Content */}
      <div className="px-4 pt-6">
        <PhotoGalleryComponent />
      </div>
    </div>
  );
}
