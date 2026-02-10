import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Plus, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PrayForMeFeed({ user }) {
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['prayer-posts'],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list('-created_date');
      return allPosts.filter(p => p.topic === 'prayer');
    },
    enabled: !!user
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['prayer-comments'],
    queryFn: () => base44.entities.Comment.list('-created_date'),
    enabled: !!user
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!content.trim()) {
        toast.error('Please write a prayer request');
        return;
      }

      let mediaUrl = null;
      let mediaUrlType = null;

      if (mediaFile) {
        const result = await base44.integrations.Core.UploadFile({ file: mediaFile });
        mediaUrl = result.file_url;
        mediaUrlType = mediaType;
      }

      const postData = {
        content,
        topic: 'prayer',
        user_name: user?.full_name || 'Anonymous',
        likes: 0,
        ...(mediaUrlType === 'image' && { image_url: mediaUrl }),
        ...(mediaUrlType === 'video' && { video_url: mediaUrl })
      };

      return base44.entities.Post.create(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prayer-posts']);
      setContent('');
      setMediaFile(null);
      setMediaType(null);
      setMediaPreview(null);
      setShowCreateModal(false);
      toast.success('Prayer request shared!');
    },
    onError: () => toast.error('Failed to share prayer request')
  });

  const likePost = useMutation({
    mutationFn: async (post) => {
      const newLikes = (post.likes || 0) + 1;
      return base44.entities.Post.update(post.id, { likes: newLikes });
    },
    onSuccess: () => queryClient.invalidateQueries(['prayer-posts'])
  });

  const createComment = useMutation({
    mutationFn: async ({ postId, text }) => {
      return base44.entities.Comment.create({
        post_id: postId,
        content: text,
        user_name: user?.full_name || 'Anonymous',
        likes: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prayer-comments']);
      setCommentText({});
    },
    onError: () => toast.error('Failed to post comment')
  });

  const handleMediaSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image' && !file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }

      setMediaFile(file);
      setMediaType(type);

      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const postComments = (postId) => comments.filter(c => c.post_id === postId);

  return (
    <div className="space-y-4 mt-6">
      {/* Header */}
      <h3 className="text-lg font-semibold text-black">Pray for Me</h3>

      {/* Facebook-style Post Box */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black rounded-xl p-4 space-y-3"
        >
          {/* Input Area */}
          <div className="flex gap-3">
            <div className="flex-1">
              <button
                onClick={() => setShowCreateBox(!showCreateBox)}
                className="w-full bg-white/10 hover:bg-white/20 transition rounded-full px-4 py-2.5 text-left text-white/60 text-sm"
              >
                What's on your heart?
              </button>
            </div>
          </div>

          {/* Expanded Input */}
          {showCreateBox && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 border-t border-white/10 pt-3"
            >
              <textarea
                autoFocus
                placeholder="Share your prayer request..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-white/50"
                rows={3}
              />

              {/* Media Preview */}
              {mediaPreview && (
                <div className="relative">
                  {mediaType === 'image' && (
                    <img src={mediaPreview} alt="preview" className="w-full rounded-lg max-h-48 object-cover" />
                  )}
                  {mediaType === 'video' && (
                    <video src={mediaPreview} controls className="w-full rounded-lg max-h-48" />
                  )}
                  <button
                    onClick={() => {
                      setMediaFile(null);
                      setMediaType(null);
                      setMediaPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Media Buttons */}
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaSelect(e, 'image')}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 p-2 rounded cursor-pointer hover:bg-white/10 transition text-white/60 hover:text-white text-sm">
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo</span>
                  </div>
                </label>

                <label className="flex-1">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleMediaSelect(e, 'video')}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 p-2 rounded cursor-pointer hover:bg-white/10 transition text-white/60 hover:text-white text-sm">
                    <VideoIcon className="w-4 h-4" />
                    <span>Video</span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateBox(false);
                    setContent('');
                    setMediaFile(null);
                    setMediaType(null);
                    setMediaPreview(null);
                  }}
                  className="flex-1 text-white border-white/20 hover:bg-white/10"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => createPost.mutate()}
                  disabled={createPost.isPending || !content.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  {createPost.isPending ? 'Sharing...' : 'Post'}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">No prayer requests yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3"
            >
              {/* Post Header */}
              <div>
                <p className="font-semibold text-white text-sm">{post.user_name}</p>
                <p className="text-xs text-white/50">{new Date(post.created_date).toLocaleDateString()}</p>
              </div>

              {/* Post Content */}
              <p className="text-white text-sm">{post.content}</p>

              {/* Media */}
              {post.image_url && (
                <img src={post.image_url} alt="prayer" className="w-full rounded-lg max-h-64 object-cover" />
              )}
              {post.video_url && (
                <video src={post.video_url} controls className="w-full rounded-lg max-h-64" />
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => likePost.mutate(post)}
                  className="flex items-center gap-2 text-white/60 hover:text-red-400 transition"
                >
                  <Heart className="w-4 h-4" fill="currentColor" />
                  <span className="text-xs">{post.likes || 0}</span>
                </button>

                <button
                  onClick={() => setExpandedComments({ ...expandedComments, [post.id]: !expandedComments[post.id] })}
                  className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{postComments(post.id).length}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.share?.({ text: post.content }) || toast.success('Share link copied');
                  }}
                  className="flex items-center gap-2 text-white/60 hover:text-purple-400 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  {/* Existing Comments */}
                  {postComments(post.id).map((comment) => (
                    <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                      <p className="font-semibold text-white text-xs">{comment.user_name}</p>
                      <p className="text-white text-xs mt-1">{comment.content}</p>
                    </div>
                  ))}

                  {/* Add Comment */}
                  {user && (
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add a prayer..."
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && commentText[post.id]) {
                            createComment.mutate({ postId: post.id, text: commentText[post.id] });
                          }
                        }}
                        className="flex-1 bg-white/10 border border-white/20 rounded text-white text-xs px-3 py-2 placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          if (commentText[post.id]) {
                            createComment.mutate({ postId: post.id, text: commentText[post.id] });
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={createComment.isPending || !commentText[post.id]}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}