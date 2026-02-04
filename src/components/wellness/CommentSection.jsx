import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Image, Video, Heart, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function CommentSection({ contentId, contentType }) {
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', contentType, contentId],
    queryFn: async () => {
      const all = await base44.entities.Comment.list('-created_date');
      return all.filter(c => c.content_id === contentId && c.content_type === contentType);
    },
    enabled: !!contentId
  });

  const createCommentMutation = useMutation({
    mutationFn: async (commentData) => {
      await base44.entities.Comment.create(commentData);
      
      // Award points for commenting
      const allProgress = await base44.entities.UserProgress.list();
      const userProgress = allProgress.find(p => p.created_by === user?.email);
      const commentCount = (userProgress?.comments_count || 0) + 1;
      
      const { awardPoints, checkAndAwardBadges } = await import('@/components/gamification/ProgressManager');
      await awardPoints(user?.email, 5, { comments_count: commentCount });
      await checkAndAwardBadges(user?.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', contentType, contentId]);
      setNewComment('');
      setImageUrl('');
      setVideoUrl('');
      toast.success('Comment posted!');
    }
  });

  const likeCommentMutation = useMutation({
    mutationFn: ({ commentId, currentLikes }) => 
      base44.entities.Comment.update(commentId, { likes: currentLikes + 1 }),
    onSuccess: () => queryClient.invalidateQueries(['comments', contentType, contentId])
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);
    setUploadingImage(false);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setVideoUrl(file_url);
    setUploadingVideo(false);
  };

  const handleSubmit = () => {
    if (!newComment.trim() && !imageUrl && !videoUrl) return;

    createCommentMutation.mutate({
      content_id: contentId,
      content_type: contentType,
      content: newComment,
      user_name: user?.full_name || 'Anonymous',
      image_url: imageUrl || undefined,
      video_url: videoUrl || undefined
    });
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        variant="ghost"
        onClick={() => setShowComments(!showComments)}
        className="w-full justify-start text-gray-600 hover:text-gray-900 mb-4"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </Button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Comment Input */}
            <div className="bg-gray-50 dark:bg-[#2d2d4a] rounded-xl p-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3 bg-white dark:bg-[#1a1a2e]"
                rows={3}
              />
              
              {/* Media Previews */}
              {imageUrl && (
                <div className="mb-3 relative">
                  <img src={imageUrl} alt="Upload" className="w-full h-40 object-cover rounded-lg" />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
              
              {videoUrl && (
                <div className="mb-3 relative">
                  <video src={videoUrl} controls className="w-full rounded-lg" />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setVideoUrl('')}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id={`image-upload-${contentId}`}
                />
                <label htmlFor={`image-upload-${contentId}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingImage || !!imageUrl}
                    asChild
                  >
                    <span>
                      <Image className="w-4 h-4 mr-2" />
                      {uploadingImage ? 'Uploading...' : 'Image'}
                    </span>
                  </Button>
                </label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id={`video-upload-${contentId}`}
                />
                <label htmlFor={`video-upload-${contentId}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingVideo || !!videoUrl}
                    asChild
                  >
                    <span>
                      <Video className="w-4 h-4 mr-2" />
                      {uploadingVideo ? 'Uploading...' : 'Video'}
                    </span>
                  </Button>
                </label>

                <Button
                  onClick={handleSubmit}
                  disabled={(!newComment.trim() && !imageUrl && !videoUrl) || createCommentMutation.isPending}
                  className="ml-auto bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">
                        {comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {comment.user_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.created_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      {comment.content && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {comment.content}
                        </p>
                      )}
                      
                      {comment.image_url && (
                        <img
                          src={comment.image_url}
                          alt="Comment"
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                      )}
                      
                      {comment.video_url && (
                        <video
                          src={comment.video_url}
                          controls
                          className="w-full rounded-lg mb-2"
                        />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeCommentMutation.mutate({
                          commentId: comment.id,
                          currentLikes: comment.likes || 0
                        })}
                        className="text-gray-500 hover:text-red-500 p-0 h-auto"
                      >
                        <Heart className={`w-4 h-4 mr-1 ${comment.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="text-xs">{comment.likes || 0}</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}