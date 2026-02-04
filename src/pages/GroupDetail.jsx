import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Users, Lock, Globe, UserPlus, Plus, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import MemberManagement from '@/components/groups/MemberManagement';
import CreateChallengeModal from '@/components/challenges/CreateChallengeModal';
import ChallengeCard from '@/components/challenges/ChallengeCard';

export default function GroupDetail() {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get('id');
  const [user, setUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
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

  const { data: challenges = [] } = useQuery({
    queryKey: ['groupChallenges', groupId],
    queryFn: async () => {
      const all = await base44.entities.Challenge.list('-created_date');
      return all.filter(c => c.group_id === groupId);
    }
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants', groupId],
    queryFn: async () => {
      const all = await base44.entities.ChallengeParticipant.list();
      return all.filter(p => challenges.some(c => c.id === p.challenge_id));
    },
    enabled: challenges.length > 0
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

  const createChallenge = useMutation({
    mutationFn: (data) => base44.entities.Challenge.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['groupChallenges']);
      setShowCreateChallenge(false);
    }
  });

  const joinChallenge = useMutation({
    mutationFn: async (challengeId) => {
      await base44.entities.ChallengeParticipant.create({
        challenge_id: challengeId,
        user_email: user.email,
        user_name: user.full_name || user.email,
        current_progress: 0,
        progress_percentage: 0,
        progress_logs: []
      });

      const challenge = challenges.find(c => c.id === challengeId);
      await base44.entities.Challenge.update(challengeId, {
        participant_count: (challenge?.participant_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groupChallenges']);
      queryClient.invalidateQueries(['challengeParticipants']);
    }
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
  const isAdmin = user && memberships.some(m => m.user_email === user.email && m.role === 'admin');

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
          <p className="text-gray-700 mb-4">{group.description}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{group.member_count} members</span>
            </div>
            
            {!isMember && user && (
              <Button
                onClick={() => joinGroup.mutate()}
                className="w-full bg-[#1a1a2e] hover:bg-[#2d2d4a]"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join Group
              </Button>
            )}

            {isMember && (
              <MemberManagement groupId={groupId} isAdmin={isAdmin} />
            )}
          </div>
        </div>

        {/* Actions */}
        {isMember && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-[#1a1a2e] hover:bg-[#2d2d4a] h-12 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Post
            </Button>
            <Button
              onClick={() => setShowCreateChallenge(true)}
              className="bg-purple-600 hover:bg-purple-700 h-12 rounded-xl"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Create Challenge
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="challenges">
              Challenges {challenges.length > 0 && `(${challenges.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
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
          </TabsContent>

          <TabsContent value="challenges">
            <div className="space-y-4">
              {challenges.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No challenges yet</p>
                  {isMember && (
                    <Button
                      onClick={() => setShowCreateChallenge(true)}
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                    >
                      Create First Challenge
                    </Button>
                  )}
                </div>
              ) : (
                challenges.map((challenge, index) => {
                  const participation = challengeParticipants.find(
                    p => p.challenge_id === challenge.id && p.user_email === user?.email
                  );
                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      participation={participation}
                      onJoin={() => joinChallenge.mutate(challenge.id)}
                      onClick={() => window.location.href = createPageUrl(`ChallengeDetail?id=${challenge.id}`)}
                      index={index}
                    />
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(data) => createPost.mutate(data)}
      />

      <CreateChallengeModal
        isOpen={showCreateChallenge}
        onClose={() => setShowCreateChallenge(false)}
        onSubmit={(data) => createChallenge.mutate(data)}
        groupId={groupId}
      />
    </div>
  );
}