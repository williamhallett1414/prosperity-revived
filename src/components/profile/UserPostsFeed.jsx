import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trash2, Edit, MoreVertical, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserPostsFeed({ userEmail, isOwnProfile }) {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['userPostsFeed', userEmail],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list('-created_date', 100);
      return allPosts.filter(p => p.created_by === userEmail);
    },
    enabled: !!userEmail
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['allComments'],
    queryFn: () => base44.entities.Comment.list()
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId) => base44.entities.Post.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPostsFeed', userEmail] });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, content }) => 
      base44.entities.Post.update(postId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPostsFeed', userEmail] });
      setEditingPostId(null);
      setEditContent('');
    }
  });

  const toggleLikeMutation = useMutation({
    mutationFn: ({ postId, currentLikes }) =>
      base44.entities.Post.update(postId, { likes: currentLikes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPostsFeed', userEmail] });
    }
  });

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      updatePostMutation.mutate({ postId: editingPostId, content: editContent });
    }
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  const getPostComments = (postId) => {
    return comments.filter(c => c.post_id === postId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD9C2D]" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => {
        const postComments = getPostComments(post.id);
        const isEditing = editingPostId === post.id;

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] flex items-center justify-center font-bold text-white">
                      {post.user_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a1a2e] dark:text-white">
                        {post.user_name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Menu */}
                {isOwnProfile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(post)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Post Content */}
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-20"
                      placeholder="What's on your mind?"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        disabled={updatePostMutation.isPending}
                        className="flex-1 bg-[#FD9C2D] hover:bg-[#E89020] text-white"
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingPostId(null);
                          setEditContent('');
                        }}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>

                    {/* Post Image */}
                    {post.image_url && (
                      <div className="mb-3 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 max-h-96">
                        <img
                          src={post.image_url}
                          alt="Post"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Verse if included */}
                    {post.verse_text && (
                      <div className="mb-3 p-3 bg-gradient-to-br from-[#FD9C2D]/10 to-[#FAD98D]/10 rounded-lg border-l-4 border-[#FD9C2D]">
                        <p className="font-semibold text-sm text-[#1a1a2e] dark:text-white mb-1">
                          {post.verse_book} {post.verse_chapter}:{post.verse_number}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{post.verse_text}"
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Post Stats & Actions */}
              {!isEditing && (
                <>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{post.likes || 0} likes</span>
                    <span>{postComments.length} comments</span>
                  </div>

                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
                    <button
                      onClick={() =>
                        toggleLikeMutation.mutate({
                          postId: post.id,
                          currentLikes: post.likes || 0
                        })
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 dark:text-gray-400 hover:text-[#FD9C2D] transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Like
                    </button>
                  </div>

                  {/* Comments Preview */}
                  {postComments.length > 0 && (
                    <div className="px-4 pb-4 space-y-2">
                      {postComments.slice(0, 2).map(comment => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <p className="font-semibold text-sm text-[#1a1a2e] dark:text-white">
                            {comment.user_name}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                      {postComments.length > 2 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{postComments.length - 2} more comments
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}