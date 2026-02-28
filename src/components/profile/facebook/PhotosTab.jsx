import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function PhotosTab({ user }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: photos = [] } = useQuery({
    queryKey: ['userPhotos'],
    queryFn: async () => {
      return await base44.entities.Photo.filter({ created_by: user?.email });
    },
    enabled: !!user
  });

  const createPhoto = useMutation({
    mutationFn: (data) => base44.entities.Photo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userPhotos']);
      setShowUploadModal(false);
      toast.success('Photo uploaded successfully!');
    },
    onError: () => {
      toast.error('Failed to upload photo');
    }
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await createPhoto.mutateAsync({ image_url: file_url });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 sm:p-16 text-center border border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📸</span>
        </div>
        <p className="text-gray-600 text-lg font-semibold">No photos yet</p>
        <p className="text-gray-400 text-sm mt-2 mb-4">Photos you upload will appear here</p>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-br from-[#c9a227] to-[#D9B878] hover:opacity-90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
          </h2>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
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

    <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              id="photo-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
          {uploading && (
            <div className="text-center">
              <div className="animate-spin w-6 h-6 border-4 border-[#D9B878] border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}