import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function PhotosTab({ user }) {
  const { data: photos = [] } = useQuery({
    queryKey: ['userPhotos'],
    queryFn: async () => {
      const allPhotos = await base44.entities.Photo.list();
      return allPhotos.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No photos yet</p>
        <p className="text-gray-400 text-sm mt-2">Photos you upload will appear here</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{photos.length} Photos</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative overflow-hidden rounded-lg bg-gray-200 aspect-square group cursor-pointer"
          >
            {photo.image_url && (
              <img
                src={photo.image_url}
                alt="Photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
              <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.created_date ? new Date(photo.created_date).toLocaleDateString() : 'Recent'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}