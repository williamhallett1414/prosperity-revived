import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Image, Video, Loader2, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import DailyGuidedPrayer from '@/components/prayer/DailyGuidedPrayer';
import CalmingScriptureMeditation from '@/components/prayer/CalmingScriptureMeditation';
import DailyPrayer from '@/components/selfcare/DailyPrayer';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';

function PrayerCard({ request, index, user, onPray, onLike, onComment, onShare }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const hasLiked = (request.liked_by || []).includes(user?.email);
  const comments = request.comments || [];

  const handleAddComment = () => {
    if (commentText.trim()) {
      onComment(commentText);
      setCommentText('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 shadow-sm">

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
          onClick={onPray}
          className="text-xs">

          <Heart className="w-4 h-4 mr-1" />
          Prayed ({request.prayer_count || 0})
        </Button>
      </div>

      <p className="text-[#0A1A2F] mb-4 whitespace-pre-wrap">
        {request.prayer_text}
      </p>

      {request.photo_url &&
      <img
        src={request.photo_url}
        alt="Prayer request"
        className="w-full rounded-lg mb-4 max-h-64 object-cover" />

      }

      {request.video_url &&
      <video
        src={request.video_url}
        controls
        className="w-full rounded-lg mb-4 max-h-64" />

      }

      {/* Interaction Buttons */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <Button
          size="sm"
          variant="ghost"
          onClick={onLike}
          className={`gap-1 ${hasLiked ? 'text-red-500' : 'text-gray-600'}`}>

          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500' : ''}`} />
          <span className="text-xs">{request.likes || 0}</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
          className="gap-1 text-gray-600">

          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{comments.length}</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onShare}
          className="gap-1 text-gray-600">

          <Share2 className="w-4 h-4" />
          <span className="text-xs">{request.shares || 0}</span>
        </Button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-100">

            {/* Comment Input */}
            <div className="flex gap-2 mb-4">
              <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()} />

              <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="bg-[#FD9C2D] hover:bg-[#FD9C2D]/90 text-white">

                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.
            sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).
            map((comment) =>
            <div
              key={comment.comment_id}
              className="bg-gray-50 rounded-lg p-3">

                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-[#0A1A2F]">
                        {comment.user_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      {comment.comment_text}
                    </p>
                  </div>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}

export default function Prayer() {
  const [user, setUser] = useState(null);
  const [prayerText, setPrayerText] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPrayerForm, setShowPrayerForm] = useState(false);

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

  const toggleLike = useMutation({
    mutationFn: async (request) => {
      const likedBy = request.liked_by || [];
      const hasLiked = likedBy.includes(user?.email);

      const updatedLikedBy = hasLiked ?
      likedBy.filter((email) => email !== user?.email) :
      [...likedBy, user?.email];

      return base44.entities.PrayerRequest.update(request.id, {
        liked_by: updatedLikedBy,
        likes: updatedLikedBy.length
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
    }
  });

  const addComment = useMutation({
    mutationFn: async ({ requestId, commentText, existingComments }) => {
      const newComment = {
        comment_id: Date.now().toString(),
        user_email: user?.email,
        user_name: user?.full_name || 'Anonymous',
        comment_text: commentText,
        timestamp: new Date().toISOString()
      };

      return base44.entities.PrayerRequest.update(requestId, {
        comments: [...existingComments, newComment]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
      toast.success('Comment added');
    }
  });

  const incrementShares = useMutation({
    mutationFn: async (request) => {
      return base44.entities.PrayerRequest.update(request.id, {
        shares: (request.shares || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
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

        {/* Daily Guided Prayer */}
        <DailyGuidedPrayer />

        {/* Calming Scripture Meditation */}
        <CalmingScriptureMeditation />

        {/* 2-Minute Prayer */}
        <DailyPrayer />

        {/* 2 Minutes With God */}
        <TakeTimeWithGod />

        {/* Pray for Me Submission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6">

          <Button
            onClick={() => setShowPrayerForm(!showPrayerForm)} className="bg-slate-50 text-[#3C4E53] px-4 py-2 text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 w-full from-[#FD9C2D] to-[#FAD98D] hover:from-[#FD9C2D]/90 hover:to-[#FAD98D]/90 h-12 shadow-md">


            <Heart className="w-5 h-5 mr-2" />
            Share Prayer Request
          </Button>
        </motion.div>

        {/* Prayer Request Form */}
        <AnimatePresence>
          {showPrayerForm &&
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6 overflow-hidden">

          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#FD9C2D]" />
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
                  className="min-h-[120px] mt-2" />

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#FD9C2D] transition-colors">
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
                    className="hidden" />

              </div>

              <div>
                <Label htmlFor="video-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#FD9C2D] transition-colors">
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
                    className="hidden" />

              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded" />

              <Label htmlFor="anonymous" className="cursor-pointer text-sm">
                Post anonymously
              </Label>
            </div>

            <Button
                type="submit"
                disabled={isUploading || !prayerText.trim()}
                className="w-full bg-[#FD9C2D] hover:bg-[#FD9C2D]/90 text-white">

              {isUploading ?
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </> :

                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Prayer Request
                </>
                }
            </Button>
          </form>
          </motion.div>
          }
        </AnimatePresence>

        {/* Prayer Wall */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Prayer Wall</h2>
          
          {prayerRequests.length === 0 ?
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500">No prayer requests yet. Be the first to share!</p>
              <Button
                className="mt-4 bg-[#FD9C2D] hover:bg-[#FD9C2D]/90 text-white"
                onClick={() => setShowPrayerForm(true)}
              >
                🙏 Add Your First Prayer Request
              </Button>
            </div> :

          prayerRequests.map((request, index) =>
          <PrayerCard
            key={request.id}
            request={request}
            index={index}
            user={user}
            onPray={() => updatePrayerCount.mutate(request)}
            onLike={() => toggleLike.mutate(request)}
            onComment={(text) => addComment.mutate({
              requestId: request.id,
              commentText: text,
              existingComments: request.comments || []
            })}
            onShare={() => {
              const shareData = {
                title: 'Prayer Request',
                text: request.prayer_text
              };

              if (navigator.share) {
                navigator.share(shareData).then(() => {
                  incrementShares.mutate(request);
                  toast.success('Prayer request shared');
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(request.prayer_text);
                incrementShares.mutate(request);
                toast.success('Copied to clipboard');
              }
            }} />

          )
          }
        </div>
      </div>
    </div>);

}