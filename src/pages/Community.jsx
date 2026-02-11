import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Loader2, TrendingUp, Filter, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import PullToRefresh from '@/components/ui/PullToRefresh';

export default function Community() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [user, setUser] = useState(null);
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [displayCount, setDisplayCount] = useState(10);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.filter({ group_id: null }, '-created_date', 200)
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list('-created_date', 500)
  });

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => 
        (f.user_email === user?.email || f.friend_email === user?.email) && f.status === 'accepted'
      );
    },
    enabled: !!user
  });

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.Post.create({
      ...data,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: async () => {
      queryClient.invalidateQueries(['posts']);
      if (user) {
        await awardPoints(user.email, 10, 'post_created', 'community_posts');
      }
    }
  });

  const updatePost = useMutation({
    mutationFn: ({ id, likes }) => base44.entities.Post.update(id, { likes }),
    onMutate: async ({ id, likes }) => {
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], old => 
        old?.map(p => p.id === id ? { ...p, likes } : p) || []
      );
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
    onSuccess: () => queryClient.invalidateQueries(['posts'])
  });

  const createComment = useMutation({
    mutationFn: ({ postId, content }) => base44.entities.Comment.create({
      post_id: postId,
      content,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: async () => {
      queryClient.invalidateQueries(['comments']);
      if (user) {
        await awardPoints(user.email, 5, 'comment_created', 'comments_count');
      }
    }
  });

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

  // Get friend emails
  const friendEmails = useMemo(() => {
    if (!user) return [];
    return friends.map(f => 
      f.user_email === user.email ? f.friend_email : f.user_email
    );
  }, [friends, user]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by topic
    if (filterTopic !== 'all') {
      filtered = filtered.filter(p => p.topic === filterTopic);
    }

    // Filter by type
    if (filterType === 'friends' && user) {
      filtered = filtered.filter(p => friendEmails.includes(p.created_by));
    } else if (filterType === 'verses') {
      filtered = filtered.filter(p => p.verse_text);
    }

    // Sort posts
    const sorted = [...filtered];
    if (sortBy === 'popular') {
      sorted.sort((a, b) => {
        const aScore = (a.likes || 0) + (comments.filter(c => c.post_id === a.id).length * 2);
        const bScore = (b.likes || 0) + (comments.filter(c => c.post_id === b.id).length * 2);
        return bScore - aScore;
      });
    } else if (sortBy === 'trending') {
      // Trending = recent posts with high engagement
      const now = new Date();
      sorted.sort((a, b) => {
        const aDate = new Date(a.created_date);
        const bDate = new Date(b.created_date);
        const aAge = (now - aDate) / (1000 * 60 * 60); // hours
        const bAge = (now - bDate) / (1000 * 60 * 60);
        
        const aScore = ((a.likes || 0) + comments.filter(c => c.post_id === a.id).length * 2) / Math.max(aAge, 1);
        const bScore = ((b.likes || 0) + comments.filter(c => c.post_id === b.id).length * 2) / Math.max(bAge, 1);
        return bScore - aScore;
      });
    }

    return sorted;
  }, [posts, comments, filterTopic, filterType, sortBy, friendEmails, user]);

  // Paginated posts for infinite scroll
  const displayedPosts = useMemo(() => {
    return filteredAndSortedPosts.slice(0, displayCount);
  }, [filteredAndSortedPosts, displayCount]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayCount < filteredAndSortedPosts.length) {
        setDisplayCount(prev => Math.min(prev + 10, filteredAndSortedPosts.length));
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [displayCount, filteredAndSortedPosts.length]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(10);
  }, [filterTopic, filterType, sortBy]);

  // Trending posts (top 3 by engagement score)
  const trendingPosts = useMemo(() => {
    return [...posts]
      .map(post => ({
        ...post,
        score: (post.likes || 0) + (comments.filter(c => c.post_id === post.id).length * 2)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(p => p.score > 0);
  }, [posts, comments]);

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries(['posts']),
      queryClient.invalidateQueries(['comments'])
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-[#0A1A2F] mb-1">Community</h1>
          <p className="text-[#0A1A2F]/60">Share insights and connect with others</p>
        </motion.div>

        {/* Create Post Button */}
        <Button
          onClick={() => setShowCreatePost(true)}
          className="w-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] h-12 mb-6 rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Share Your Thoughts
        </Button>

        {/* Trending Posts */}
        {trendingPosts.length > 0 && (
          <div className="mb-6 bg-[#E6EBEF] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#D9B878]" />
              <h3 className="font-semibold text-[#0A1A2F]">Trending Now</h3>
            </div>
            <div className="space-y-2">
              {trendingPosts.map(post => (
                <div key={post.id} className="p-2 hover:bg-white rounded-lg cursor-pointer">
                  <p className="text-sm text-[#0A1A2F] line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#0A1A2F]/60">
                    <span>❤️ {post.likes || 0}</span>
                    <span>💬 {comments.filter(c => c.post_id === post.id).length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-[#E6EBEF]">
                  <SelectValue placeholder="Filter posts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  {user && <SelectItem value="friends"><Users className="w-4 h-4 inline mr-2" />Friends Only</SelectItem>}
                  <SelectItem value="verses"><BookOpen className="w-4 h-4 inline mr-2" />With Verses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-[#E6EBEF]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">📅 Most Recent</SelectItem>
                  <SelectItem value="popular">🔥 Most Liked</SelectItem>
                  <SelectItem value="trending">📈 Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Select value={filterTopic} onValueChange={setFilterTopic}>
              <SelectTrigger className="bg-[#E6EBEF]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="prayer">🙏 Prayer</SelectItem>
                <SelectItem value="bible_study">📖 Bible Study</SelectItem>
                <SelectItem value="testimony">✨ Testimony</SelectItem>
                <SelectItem value="question">❓ Question</SelectItem>
                <SelectItem value="encouragement">💝 Encouragement</SelectItem>
                <SelectItem value="general">💬 General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#D9B878]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#0A1A2F]/60 mb-4">No posts yet. Be the first to share!</p>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            >
              Create First Post
            </Button>
          </div>
        ) : filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12 bg-[#E6EBEF] rounded-2xl">
            <p className="text-[#0A1A2F]/60">No posts match your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                comments={comments}
                onLike={handleLike}
                onComment={handleComment}
                index={index}
              />
            ))}
            
            {/* Infinite scroll trigger */}
            {displayCount < filteredAndSortedPosts.length && (
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#D9B878]" />
              </div>
            )}

            {/* End message */}
            {displayCount >= filteredAndSortedPosts.length && filteredAndSortedPosts.length > 0 && (
              <div className="text-center py-8 text-[#0A1A2F]/40">
                <p className="text-sm">You've reached the end</p>
              </div>
            )}
          </div>
        )}
      </div>

      </PullToRefresh>
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(data) => createPost.mutate(data)}
      />
    </div>
  );
}