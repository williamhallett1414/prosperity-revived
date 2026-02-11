import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Send, Image, Video, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Prayer() {
  const [user, setUser] = useState(null);
  const [prayerText, setPrayerText] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: prayerRequests = [] } = useQuery({
    queryKey: ['prayerRequests'],
    queryFn: () => base44.entities.PrayerRequest.list('-created_date', 100)
  });

  const createRequest = useMutation({
    mutationFn: async (data) => base44.entities.PrayerRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
      setPrayerText('');
      setPhotoFile(null);
      setVideoFile(null);
      setIsAnonymous(false);
      toast.success('Prayer request submitted');
    }
  });

  const updatePrayerCount = useMutation({
    mutationFn: async (request) => {
      return base44.entities.PrayerRequest.update(request.id, {
        prayer_count: (request.prayer_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
      toast.success('🙏 Prayer recorded');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prayerText.trim()) {
      toast.error('Please enter your prayer request');
      return;
    }

    setIsUploading(true);

    try {
      let photoUrl = null;
      let videoUrl = null;

      if (photoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: photoFile });
        photoUrl = file_url;
      }

      if (videoFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: videoFile });
        videoUrl = file_url;
      }

      await createRequest.mutateAsync({
        user_name: isAnonymous ? 'Anonymous' : user?.full_name || 'Anonymous',
        prayer_text: prayerText,
        photo_url: photoUrl,
        video_url: videoUrl,
        is_anonymous: isAnonymous
      });
    } catch (error) {
      toast.error('Failed to submit prayer request');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Bible')}
              className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 shadow-sm flex items-center justify-center text-[#0A1A2F] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F]">Prayer</h1>
          </div>
        </div>

        {/* Pray for Me Submission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#D9B878]" />
            Pray for Me
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="prayer-text">Your Prayer Request</Label>
              <Textarea
                id="prayer-text"
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Share what's on your heart..."
                className="min-h-[120px] mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#D9B878] transition-colors">
                    <Image className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {photoFile ? photoFile.name : 'Add Photo'}
                    </span>
                  </div>
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              <div>
                <Label htmlFor="video-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#D9B878] transition-colors">
                    <Video className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {videoFile ? videoFile.name : 'Add Video'}
                    </span>
                  </div>
                </Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="anonymous" className="cursor-pointer text-sm">
                Post anonymously
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isUploading || !prayerText.trim()}
              className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Prayer Request
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Prayer Wall */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Prayer Wall</h2>
          
          {prayerRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500">No prayer requests yet. Be the first to share!</p>
            </div>
          ) : (
            prayerRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#0A1A2F]">
                      {request.user_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.created_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePrayerCount.mutate(request)}
                    className="text-xs"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Prayed ({request.prayer_count || 0})
                  </Button>
                </div>

                <p className="text-[#0A1A2F] mb-4 whitespace-pre-wrap">
                  {request.prayer_text}
                </p>

                {request.photo_url && (
                  <img
                    src={request.photo_url}
                    alt="Prayer request"
                    className="w-full rounded-lg mb-4 max-h-64 object-cover"
                  />
                )}

                {request.video_url && (
                  <video
                    src={request.video_url}
                    controls
                    className="w-full rounded-lg mb-4 max-h-64"
                  />
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}