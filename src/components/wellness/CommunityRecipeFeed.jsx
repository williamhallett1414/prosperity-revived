import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Upload, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
'@/components/ui/dialog';
import { toast } from 'sonner';
import PostCard from '@/components/community/PostCard';

export default function CommunityRecipeFeed({ user }) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['communityRecipePosts'],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list('-created_date', 50);
      return allPosts.filter((p) => p.topic === 'general' && p.group_id === undefined);
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.Post.create({
        content: data.content,
        user_name: user?.full_name || 'Anonymous',
        image_url: data.imageUrl,
        video_url: data.videoUrl,
        topic: 'general'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityRecipePosts']);
      setPostContent('');
      setSelectedFile(null);
      setFilePreview(null);
      setUploadedFileUrl(null);
      setShowCreatePost(false);
      toast.success('Recipe shared with community!');
    },
    onError: () => {
      toast.error('Failed to share recipe');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, currentLikes }) => {
      return base44.entities.Post.update(postId, { likes: currentLikes + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityRecipePosts']);
    }
  });

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file: selectedFile });
      setUploadedFileUrl(result.file_url);
      toast.success('Image/video uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!postContent.trim() && !uploadedFileUrl) {
      toast.error('Please add content or an image/video');
      return;
    }

    let imageUrl = null;
    let videoUrl = null;

    if (uploadedFileUrl) {
      if (selectedFile?.type.startsWith('video/')) {
        videoUrl = uploadedFileUrl;
      } else {
        imageUrl = uploadedFileUrl;
      }
    }

    createPostMutation.mutate({
      content: postContent,
      imageUrl,
      videoUrl
    });
  };

  return (
    <div className="space-y-4">
      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogTrigger asChild>
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              {user?.profile_image ?
              <img src={user.profile_image} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" /> :

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8fa68a] to-[#6b8f72]" />
              }
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 text-left px-4 py-2 rounded-full bg-gray-100 dark:bg-[#3d3d5a] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#4d4d6a] transition-colors">

                Share a recipe...
              </button>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" className="text-[#4a6b50]">
                <Upload className="w-4 h-4 mr-2" />
                Media
              </Button>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share a Recipe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Share your recipe, cooking tips, or food story..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-32 resize-none" />


            {/* File Upload Preview */}
            {filePreview &&
            <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-[#3d3d5a]">
                {selectedFile?.type.startsWith('video/') ?
              <video src={filePreview} className="w-full h-64 object-cover" controls /> :

              <img src={filePreview} alt="Preview" className="w-full h-64 object-cover" />
              }
                <button
                onClick={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                  setUploadedFileUrl(null);
                }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors">

                  <X className="w-4 h-4" />
                </button>
              </div>
            }

            {/* File Input */}
            {!uploadedFileUrl &&
            <div className="flex gap-2">
                <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input" />

                <label
                htmlFor="file-input"
                className="flex-1 cursor-pointer">

                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-[#8fa68a] transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload image or video</p>
                  </div>
                </label>
              </div>
            }

            {/* Upload Button */}
            {selectedFile && !uploadedFileUrl &&
            <Button
              onClick={handleUploadFile}
              disabled={isUploading}
              className="w-full">

                {isUploading ?
              <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </> :

              'Upload'
              }
              </Button>
            }

            {/* Submit Button */}
            <Button
              onClick={handleSubmitPost}
              disabled={createPostMutation.isPending || isUploading}
              className="w-full bg-gradient-to-r from-[#8fa68a] to-[#6b8f72] hover:opacity-90">

              {createPostMutation.isPending ?
              <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Sharing...
                </> :

              'Share Recipe'
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feed */}
      <div className="space-y-3">
        <h3 className="text-slate-900 text-lg font-semibold">Community Recipes</h3>
        {isLoading ?
        <div className="flex justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-[#4a6b50]" />
          </div> :
        posts.length === 0 ?
        <div className="text-center py-8 text-gray-400">
            <p>No recipes shared yet. Be the first!</p>
          </div> :

        <AnimatePresence>
            {posts.map((post, index) =>
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}>

                <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8fa68a] to-[#6b8f72]" />
                    <div>
                      <p className="font-semibold text-sm text-[#1a1a2e] dark:text-white">{post.user_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  {post.content &&
              <p className="text-sm text-[#1a1a2e] dark:text-gray-200 mb-3">{post.content}</p>
              }

                  {/* Media */}
                  {post.image_url &&
              <img
                src={post.image_url}
                alt="Recipe"
                className="w-full rounded-lg mb-3 h-48 object-cover" />

              }
                  {post.video_url &&
              <video
                src={post.video_url}
                controls
                className="w-full rounded-lg mb-3 h-48 object-cover" />

              }

                  {/* Interactions */}
                  <div className="flex gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                  onClick={() => likePostMutation.mutate({ postId: post.id, currentLikes: post.likes })}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm">

                      <Heart className="w-4 h-4" />
                      {post.likes || 0}
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-[#AFC7E3] transition-colors text-sm">
                      <MessageCircle className="w-4 h-4" />
                      Comment
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors text-sm">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>
          )}
          </AnimatePresence>
        }
      </div>
    </div>);

}