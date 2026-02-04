import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { awardPoints } from '@/components/gamification/ProgressManager';

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: photos = [] } = useQuery({
    queryKey: ['photos'],
    queryFn: () => base44.entities.Photo.list('-created_date', 50)
  });

  const createPhoto = useMutation({
    mutationFn: (data) => base44.entities.Photo.create(data),
    onSuccess: async () => {
      queryClient.invalidateQueries(['photos']);
      setShowAddPhoto(false);
      setCaption('');
      if (user) {
        await awardPoints(user.email, 5, 'photo_uploaded', 'photos_uploaded');
      }
    }
  });

  const deletePhoto = useMutation({
    mutationFn: (id) => base44.entities.Photo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['photos']);
      setSelectedPhoto(null);
    }
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await createPhoto.mutateAsync({
        image_url: file_url,
        caption: caption || '',
        is_profile_visible: true
      });
    } catch (error) {
      console.error('Upload failed', error);
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white">Photo Gallery</h2>
        <Button
          onClick={() => setShowAddPhoto(true)}
          size="sm"
          className="bg-[#c9a227] hover:bg-[#b89120]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No photos yet</p>
          <Button
            onClick={() => setShowAddPhoto(true)}
            variant="outline"
          >
            Add Your First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPhoto(photo)}
              className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={photo.image_url}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <Dialog open={showAddPhoto} onOpenChange={setShowAddPhoto}>
        <DialogContent>
          <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-white mb-4">Add Photo</h3>
          <div className="space-y-4">
            <Input
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="gallery-photo-upload"
              />
              <Button
                onClick={() => document.getElementById('gallery-photo-upload').click()}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Choose Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#2d2d4a] rounded-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="relative">
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.caption || 'Photo'}
                  className="w-full max-h-[60vh] object-contain"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {selectedPhoto.caption && (
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300">{selectedPhoto.caption}</p>
                </div>
              )}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(selectedPhoto.created_date).toLocaleDateString()}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deletePhoto.mutate(selectedPhoto.id)}
                >
                  Delete Photo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}