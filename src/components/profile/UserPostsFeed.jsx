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
        <p className="text-[#0A1A2F]/60">No posts yet</p>
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
              <div className="p-4 border-b border-[#D9B878]/25 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center font-bold text-white">
                      {post.user_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1A2F]">
                        {post.user_name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-[#0A1A2F]/60">
                        {new Date(post.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Menu */}
                {isOwnProfile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-[#FAD98D]/10 rounded-full">
                        <MoreVertical className="w-5 h-5 text-[#0A1A2F]/50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(post)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.id)}
                        className="text-[#c9a227]"
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
                        className="flex-1 bg-[#c9a227] hover:bg-[#b89320] text-white"
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
                    <p className="text-[#0A1A2F]/80 mb-3">{post.content}</p>

                    {/* Post Image */}
                    {post.image_url && (
                      <div className="mb-3 rounded-lg overflow-hidden bg-[#F2F6FA] max-h-96">
                        <img
                          src={post.image_url}
                          alt="Post"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Verse if included */}
                    {post.verse_text && (
                      <div className="mb-3 p-3 bg-gradient-to-br from-[#c9a227]/10 to-[#FAD98D]/10 rounded-lg border-l-4 border-[#c9a227]">
                        <p className="font-semibold text-sm text-[#0A1A2F] mb-1">
                          {post.verse_book} {post.verse_chapter}:{post.verse_number}
                        </p>
                        <p className="text-sm text-[#0A1A2F]/75 italic">
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
                  <div className="px-4 py-2 border-t border-[#D9B878]/25 flex items-center justify-between text-sm text-[#0A1A2F]/60">
                    <span>{post.likes || 0} likes</span>
                    <span>{postComments.length} comments</span>
                  </div>

                  <div className="px-4 py-3 border-t border-[#D9B878]/25 flex items-center gap-4">
                    <button
                      onClick={() =>
                        toggleLikeMutation.mutate({
                          postId: post.id,
                          currentLikes: post.likes || 0
                        })
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-[#0A1A2F]/60 hover:text-[#c9a227] transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Like
                    </button>
                  </div>

                  {/* Comments Preview */}
                  {postComments.length > 0 && (
                    <div className="px-4 pb-4 space-y-2">
                      {postComments.slice(0, 2).map(comment => (
                        <div key={comment.id} className="bg-[#FAD98D]/10 rounded-lg p-3">
                          <p className="font-semibold text-sm text-[#0A1A2F]">
                            {comment.user_name}
                          </p>
                          <p className="text-sm text-[#0A1A2F]/75">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                      {postComments.length > 2 && (
                        <p className="text-xs text-[#0A1A2F]/50">
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