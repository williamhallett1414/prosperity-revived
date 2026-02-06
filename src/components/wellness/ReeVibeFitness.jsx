import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, ThumbsUp, MessageCircle, Share2, Play, 
  Plus, Image as ImageIcon, Video, Dumbbell 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import CommentSection from './CommentSection';

export default function ReeVibeFitness({ user }) {
  const [filter, setFilter] = useState('recent');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: fitnessPosts = [], isLoading } = useQuery({
    queryKey: ['fitnessPosts', filter],
    queryFn: async () => {
      const all = await base44.entities.Post.list('-created_date', 100);
      const fitnessPosts = all.filter(p => 
        p.topic === 'general' || p.group_id === null
      );
      
      if (filter === 'popular') {
        return fitnessPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      } else if (filter === 'trending') {
        const recent = fitnessPosts.filter(p => {
          const postDate = new Date(p.created_date);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return postDate >= dayAgo;
        });
        return recent.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }
      return fitnessPosts;
    },
    enabled: !!user
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData) => {
      return base44.entities.Post.create(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fitnessPosts']);
      setShowCreatePost(false);
      setPostContent('');
      setMediaUrl('');
      setMediaType('');
      toast.success('Post shared!');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, currentLikes }) => {
      return base44.entities.Post.update(postId, {
        likes: currentLikes + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fitnessPosts']);
    }
  });

  const handleMediaUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setMediaUrl(file_url);
      setMediaType(type);
    } catch (error) {
      toast.error('Failed to upload media');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && !mediaUrl) {
      toast.error('Please add content or media');
      return;
    }

    const postData = {
      content: postContent,
      user_name: user?.full_name || 'Anonymous',
      topic: 'general',
      image_url: mediaType === 'image' ? mediaUrl : undefined,
      video_url: mediaType === 'video' ? mediaUrl : undefined
    };

    createPostMutation.mutate(postData);
  };

  const handleShare = async (post) => {
    if (navigator.share) {
      await navigator.share({
        title: 'ReeVibe Fitness',
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-6 h-6" />
            <h3 className="text-lg font-semibold">ReeVibe Fitness</h3>
          </div>
          <Button
            onClick={() => setShowCreatePost(true)}
            size="sm"
            className="bg-white text-emerald-600 hover:bg-white/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Post
          </Button>
        </div>
        <p className="text-white/90 text-sm">
          Share your fitness journey with the community
        </p>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3 mt-4">
          {fitnessPosts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No posts yet. Be the first to share your fitness journey!
              </p>
            </div>
          ) : (
            fitnessPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {post.user_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {post.user_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(post.created_date), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Media */}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full rounded-lg mb-3 max-h-96 object-cover"
                  />
                )}
                {post.video_url && (
                  <video
                    src={post.video_url}
                    controls
                    className="w-full rounded-lg mb-3 max-h-96"
                  />
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likePostMutation.mutate({
                      postId: post.id,
                      currentLikes: post.likes || 0
                    })}
                    className="flex-1"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {post.likes || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Comment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post)}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {expandedPost === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 border-t pt-3"
                    >
                      <CommentSection
                        contentId={post.id}
                        contentType="post"
                        user={user}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Share Your Fitness Journey</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="What's your fitness story? Share your progress, workouts, or motivation..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={5}
              className="resize-none"
            />

            {/* Media Preview */}
            {mediaUrl && (
              <div className="relative">
                {mediaType === 'image' ? (
                  <img src={mediaUrl} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
                ) : (
                  <video src={mediaUrl} controls className="w-full rounded-lg max-h-64" />
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setMediaUrl('');
                    setMediaType('');
                  }}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            )}

            {/* Upload Buttons */}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMediaUpload(e, 'image')}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploadingMedia || !!mediaUrl}
                  asChild
                >
                  <span>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {uploadingMedia ? 'Uploading...' : 'Add Photo'}
                  </span>
                </Button>
              </label>

              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleMediaUpload(e, 'video')}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploadingMedia || !!mediaUrl}
                  asChild
                >
                  <span>
                    <Video className="w-4 h-4 mr-2" />
                    {uploadingMedia ? 'Uploading...' : 'Add Video'}
                  </span>
                </Button>
              </label>
            </div>

            <Button
              onClick={handleCreatePost}
              disabled={(!postContent.trim() && !mediaUrl) || createPostMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {createPostMutation.isPending ? 'Posting...' : 'Share Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}