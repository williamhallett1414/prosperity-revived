import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { BookOpen, Heart, Users, Plus, Settings, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerseOfDay from '@/components/home/VerseOfDay';
import DailyDevotional from '@/components/home/DailyDevotional';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import { readingPlans } from '@/components/bible/BibleData';
import DailyVerseSettings from '@/components/settings/DailyVerseSettings';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import GamificationBanner from '@/components/gamification/GamificationBanner';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { Trophy } from 'lucide-react';

export default function Home() {
  const [showDailyVerseSettings, setShowDailyVerseSettings] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (!u.onboarding_completed) {
        setShowOnboarding(true);
      }
    });
  }, []);

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list('-created_date', 100);
      // Filter out group posts and sort by likes (trending) then by date
      return allPosts
        .filter(p => !p.group_id)
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 20);
    }
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list('-created_date', 200)
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['myMemberships'],
    queryFn: async () => {
      const all = await base44.entities.GroupMember.list();
      return all.filter(m => m.user_email === user?.email);
    },
    enabled: !!user
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list()
  });

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.find(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 50),
    enabled: !!user
  });

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: () => base44.entities.MeditationSession.list('-date', 50),
    enabled: !!user
  });

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date', 50)
  });

  const { data: myPosts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const all = await base44.entities.Post.list('-created_date', 100);
      return all.filter(p => p.created_by === user?.email && !p.group_id);
    },
    enabled: !!user
  });

  const createBookmark = useMutation({
    mutationFn: (data) => base44.entities.Bookmark.create(data),
    onSuccess: () => queryClient.invalidateQueries(['bookmarks'])
  });

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.Post.create({
      ...data,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: () => queryClient.invalidateQueries(['posts'])
  });

  const updatePost = useMutation({
    mutationFn: ({ id, likes }) => base44.entities.Post.update(id, { likes }),
    onSuccess: () => queryClient.invalidateQueries(['posts'])
  });

  const createComment = useMutation({
    mutationFn: ({ postId, content }) => base44.entities.Comment.create({
      post_id: postId,
      content,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: () => queryClient.invalidateQueries(['comments'])
  });

  const handleBookmarkVerse = (verse) => {
    createBookmark.mutate({
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      verse_text: verse.text,
      highlight_color: 'yellow'
    });
  };

  const getProgressForPlan = (planId) => {
    return planProgress.find(p => p.plan_id === planId);
  };

  const activePlans = readingPlans.filter(plan => getProgressForPlan(plan.id));

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

  useEffect(() => {
    if (user?.theme) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = user.theme === 'dark' || (user.theme === 'auto' && systemDark);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [user?.theme]);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e]">
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={() => {
            setShowOnboarding(false);
            base44.auth.me().then(setUser);
          }} 
        />
      )}
      
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/d9b97f241_ProsperityRevivedSymbol.jpeg" 
              alt="Prosperity Revived" 
              className="w-10 h-10 object-contain mix-blend-mode: lighten"
              style={{ mixBlendMode: 'lighten', backgroundColor: 'transparent' }}
            />
            <h1 className="text-3xl font-bold text-[#1a1a2e] dark:text-white">
              {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.full_name?.split(' ')[0] || 'friend'}</p>
        </motion.div>

        {/* Gamification Banner */}
        <GamificationBanner userProgress={userProgress} />
        
        {/* Quick Link to Leaderboard */}
        {userProgress && (
          <Link 
            to={createPageUrl('Achievements')}
            className="block bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 mb-4 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                <div>
                  <p className="font-semibold">View Leaderboard</p>
                  <p className="text-sm text-white/80">See how you rank!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{userProgress.total_points || 0}</p>
                <p className="text-xs text-white/80">points</p>
              </div>
            </div>
          </Link>
        )}

        {/* Verse of the Day */}
        <div className="mb-6 relative">
          <VerseOfDay onBookmark={handleBookmarkVerse} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDailyVerseSettings(true)}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#c9a227]"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Daily Devotional */}
        <DailyDevotional />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link to={createPageUrl('Bible')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-40 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/70 to-[#2d2d4a]/60 flex flex-col items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#c9a227] mb-2" />
                <span className="text-white font-semibold text-lg">Bible</span>
                <p className="text-white/70 text-xs mt-1">Study & Learn</p>
              </div>
            </motion.div>
          </Link>
          
          <Link to={createPageUrl('Community')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-40 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 to-pink-600/60 flex flex-col items-center justify-center">
                <Users className="w-8 h-8 text-white mb-2" />
                <span className="text-white font-semibold text-lg">Community</span>
                <p className="text-white/70 text-xs mt-1">Connect & Share</p>
              </div>
            </motion.div>
          </Link>
          
          <Link to={createPageUrl('Wellness')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-40 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/70 to-teal-600/60 flex flex-col items-center justify-center">
                <Dumbbell className="w-8 h-8 text-white mb-2" />
                <span className="text-white font-semibold text-lg">Wellness</span>
                <p className="text-white/70 text-xs mt-1">Health & Fitness</p>
              </div>
            </motion.div>
          </Link>

          <Link to={createPageUrl('Achievements')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-40 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579263657449-d0ed08fbe4d7?w=500&h=300&fit=crop)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/70 to-orange-600/60 flex flex-col items-center justify-center">
                <Trophy className="w-8 h-8 text-white mb-2" />
                <span className="text-white font-semibold text-lg">Progress</span>
                <p className="text-white/70 text-xs mt-1">Achievements & Stats</p>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Active Plans */}
        {activePlans.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">Continue Reading</h2>
              <Link to={createPageUrl('Plans')} className="text-sm text-[#c9a227] font-medium">
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {activePlans.slice(0, 2).map((plan, index) => (
                <ReadingPlanCard
                  key={plan.id}
                  plan={plan}
                  progress={getProgressForPlan(plan.id)}
                  onClick={() => window.location.href = createPageUrl(`PlanDetail?id=${plan.id}`)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Your Activity */}
        {(myPosts.length > 0 || workoutSessions.length > 0 || meditationSessions.length > 0) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white mb-3">Your Recent Activity</h2>
            <div className="space-y-2">
              {myPosts.slice(0, 2).map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#2d2d4a] rounded-lg p-3 text-sm border-l-4 border-purple-600"
                >
                  <p className="text-gray-700 dark:text-gray-300">Posted: <span className="font-medium">"{post.content.slice(0, 40)}..."</span></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(post.created_date).toLocaleDateString()}</p>
                </motion.div>
              ))}
              {workoutSessions.slice(0, 2).map(session => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#2d2d4a] rounded-lg p-3 text-sm border-l-4 border-emerald-600"
                >
                  <p className="text-gray-700 dark:text-gray-300">Workout: <span className="font-medium">{session.workout_title}</span> ({session.duration_minutes}m)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(session.date).toLocaleDateString()}</p>
                </motion.div>
              ))}
              {meditationSessions.slice(0, 2).map(session => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#2d2d4a] rounded-lg p-3 text-sm border-l-4 border-pink-600"
                >
                  <p className="text-gray-700 dark:text-gray-300">Meditation: <span className="font-medium">{session.meditation_title}</span></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(session.date).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Community Feed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">Community</h2>
            <Link to={createPageUrl('Community')} className="text-sm text-[#c9a227] font-medium">
              See All
            </Link>
          </div>
          
          <Button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 mb-4 rounded-xl shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Share Your Thoughts
          </Button>

          {posts.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-[#2d2d4a] rounded-2xl">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post, index) => (
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
      </div>

      {/* Modals */}
      <DailyVerseSettings
        isOpen={showDailyVerseSettings}
        onClose={() => setShowDailyVerseSettings(false)}
      />
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(data) => createPost.mutate(data)}
      />
    </div>
  );
}