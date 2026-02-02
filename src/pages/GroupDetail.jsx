import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Users, Lock, Globe, UserPlus, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';

export default function GroupDetail() {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get('id');
  const [user, setUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const groups = await base44.entities.StudyGroup.list();
      return groups.find(g => g.id === groupId);
    }
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['groupMemberships', groupId],
    queryFn: async () => {
      const all = await base44.entities.GroupMember.list();
      return all.filter(m => m.group_id === groupId);
    }
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['groupPosts', groupId],
    queryFn: () => base44.entities.Post.filter({ group_id: groupId }, '-created_date')
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list('-created_date', 200)
  });

  const joinGroup = useMutation({
    mutationFn: () => base44.entities.GroupMember.create({
      group_id: groupId,
      user_email: user.email,
      role: 'member'
    }),
    onSuccess: async () => {
      await base44.entities.StudyGroup.update(groupId, {
        member_count: (group?.member_count || 0) + 1
      });
      queryClient.invalidateQueries(['groupMemberships']);
      queryClient.invalidateQueries(['group']);
    }
  });

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.Post.create({
      ...data,
      group_id: groupId,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: () => queryClient.invalidateQueries(['groupPosts'])
  });

  const updatePost = useMutation({
    mutationFn: ({ id, likes }) => base44.entities.Post.update(id, { likes }),
    onSuccess: () => queryClient.invalidateQueries(['groupPosts'])
  });

  const createComment = useMutation({
    mutationFn: ({ postId, content }) => base44.entities.Comment.create({
      post_id: postId,
      content,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: () => queryClient.invalidateQueries(['comments'])
  });

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#c9a227]" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p>Group not found</p>
      </div>
    );
  }

  const isMember = user && memberships.some(m => m.user_email === user.email);

  const handleLike = (postId, isLiked) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost.mutate({
        id: postId,
        likes: (post.likes || 0) + (isLiked ? 1 : -1)
      });
    }
  };

  const handleComment = (postId, content) => {
    createComment.mutate({ postId, content });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      {/* Hero */}
      <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a]">
        <img
          src={group.cover_image}
          alt={group.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <Link
          to={createPageUrl('Groups')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            {group.is_private ? (
              <Lock className="w-4 h-4 text-white" />
            ) : (
              <Globe className="w-4 h-4 text-white" />
            )}
            <span className="text-white text-sm">
              {group.is_private ? 'Private' : 'Public'} Group
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{group.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Group Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="text-gray-700 mb-3">{group.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{group.member_count} members</span>
            </div>
            
            {!isMember && user && (
              <Button
                onClick={() => joinGroup.mutate()}
                className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join Group
              </Button>
            )}
          </div>
        </div>

        {/* Create Post (Members Only) */}
        {isMember && (
          <Button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-[#1a1a2e] hover:bg-[#2d2d4a] h-12 mb-6 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Share with Group
          </Button>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No posts in this group yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                comments={comments}
                onLike={handleLike}
                onComment={handleComment}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(data) => createPost.mutate(data)}
      />
    </div>
  );
}