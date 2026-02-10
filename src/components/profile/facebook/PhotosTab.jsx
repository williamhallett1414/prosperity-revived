import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function PhotosTab({ user }) {
  const { data: photos = [] } = useQuery({
    queryKey: ['userPhotos'],
    queryFn: async () => {
      return await base44.entities.Photo.filter({ created_by: user?.email });
    },
    enabled: !!user
  });

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 sm:p-16 text-center border border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📸</span>
        </div>
        <p className="text-gray-600 text-lg font-semibold">No photos yet</p>
        <p className="text-gray-400 text-sm mt-2">Photos you upload will appear here</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="relative overflow-hidden rounded-xl bg-gray-200 aspect-square group cursor-pointer shadow-sm hover:shadow-lg transition-all"
          >
            {photo.image_url && (
              <img
                src={photo.image_url}
                alt="Photo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-white text-xs font-semibold drop-shadow-md">
                {photo.created_date ? new Date(photo.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}