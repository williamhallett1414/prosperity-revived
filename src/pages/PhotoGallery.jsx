import React from 'react';
import { } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PhotoGalleryComponent from '@/components/profile/PhotoGallery';

export default function PhotoGalleryPage() {
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">

      {/* (Page header is provided by Layout's UniversalHeader) */}

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] text-white px-4 pt-4 pb-6">
        <h1 className="text-2xl font-bold">My Gallery</h1>
      </div>

      {/* Gallery Content */}
      <div className="px-4 pt-6">
        <PhotoGalleryComponent />
      </div>
    </div>
  );
}
