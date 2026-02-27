import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { BookOpen, Heart, Users, Plus, Settings, Dumbbell, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerseOfDay from '@/components/home/VerseOfDay';
import DailyDevotional from '@/components/home/DailyDevotional';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import ReadingPlanProgressTracker from '@/components/home/ReadingPlanProgressTracker';
import { readingPlans } from '@/components/bible/BibleData';
import DailyVerseSettings from '@/components/settings/DailyVerseSettings';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import GamificationBanner from '@/components/gamification/GamificationBanner';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import GideonOnboarding from '@/components/onboarding/GideonOnboarding';
import WellnessTour from '@/components/onboarding/WellnessTour';
import StartMyDayModal from '@/components/home/StartMyDayModal';
import EndMyDayModal from '@/components/home/EndMyDayModal';
import TodaysOverview from '@/components/home/TodaysOverview';
import WellnessHub from '@/components/home/WellnessHub';
import TodaysRecommendations from '@/components/home/TodaysRecommendations';
import HelpChatbot from '@/components/home/HelpChatbot';
import DailyReflectionPrompt from '@/components/gideon/DailyReflectionPrompt';
import ProactiveSuggestions from '@/components/gideon/ProactiveSuggestions';
import PersonalizedDevotional from '@/components/gideon/PersonalizedDevotional';

import { Trophy } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [showDailyVerseSettings, setShowDailyVerseSettings] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGideonOnboarding, setShowGideonOnboarding] = useState(false);
  const [showStartDay, setShowStartDay] = useState(false);
  const [showEndDay, setShowEndDay] = useState(false);
  const [showStartHere, setShowStartHere] = useState(true);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      if (!u.onboarding_completed) {
        setShowOnboarding(true);
      } else {
        // Check if Gideon onboarding is complete
        const gideonComplete = localStorage.getItem('gideon_onboarding_complete');
        if (!gideonComplete) {
          setShowGideonOnboarding(true);
        }
      }
    });
  }, []);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const allPosts = await base44.entities.Post.filter({}, '-created_date', 100);
        return allPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 20);
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      try {
        return await base44.entities.Comment.filter({}, '-created_date', 200);
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: async () => {
      try {
        return await base44.entities.ReadingPlanProgress.filter({ created_by: user?.email });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      try {
        const list = await base44.entities.UserProgress.filter({ created_by: user?.email });
        return list[0] || null;
      } catch (error) {
        return null;
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.WorkoutSession.filter({ created_by: user?.email }, '-date', 50);
      } catch {
        return [];
      }
    },
    enabled: !!user
  });

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.MeditationSession.filter({ created_by: user?.email }, '-date', 50);
      } catch {
        return [];
      }
    },
    enabled: !!user
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['waterLogs'],
    queryFn: () => base44.entities.WaterLog.list('-date', 100),
    initialData: [],
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
    onMutate: async ({ id, likes }) => {
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) =>
      old?.map((p) => p.id === id ? { ...p, likes } : p) || []
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
    return planProgress.find((p) => p.plan_id === planId);
  };

  const activePlans = readingPlans.filter((plan) => getProgressForPlan(plan.id));

  const handleLike = (postId, isLiked) => {
    const post = posts.find((p) => p.id === postId);
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
      const isDark = user.theme === 'dark' || user.theme === 'auto' && systemDark;

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [user?.theme]);

  return (
    <div className="min-h-screen bg-[#F2F6FA]">
      {showOnboarding &&
      <OnboardingFlow
        onComplete={() => {
          setShowOnboarding(false);
          base44.auth.me().then(setUser);
          // Show Gideon onboarding after general onboarding
          const gideonComplete = localStorage.getItem('gideon_onboarding_complete');
          if (!gideonComplete) {
            setTimeout(() => setShowGideonOnboarding(true), 500);
          } else {
            if ('Notification' in window && Notification.permission === 'default') {
              setTimeout(() => setShowNotifPrompt(true), 800);
            }
          }
        }} />

      }
      
      {showGideonOnboarding &&
      <GideonOnboarding
        onComplete={() => {
          setShowGideonOnboarding(false);
          if ('Notification' in window && Notification.permission === 'default') {
            setTimeout(() => setShowNotifPrompt(true), 800);
          }
        }} />

      }
      
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">

          <h1 className="text-3xl font-bold text-[#0A1A2F] mb-1">
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
          </h1>
          <p className="text-[#0A1A2F]/60">Welcome back, {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'friend'}</p>
        </motion.div>

        {/* Start/End Day Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 mb-8 px-4">

          <Button
            onClick={() => setShowStartDay(true)}
            className="h-20 bg-gradient-to-r from-[#FAD98D] to-[#FD9C2D] hover:from-[#FAD98D]/90 hover:to-[#FD9C2D]/90 text-[#3C4E53] rounded-2xl shadow-md font-bold text-base flex flex-col items-center gap-1">

            <span className="text-2xl">🌅</span>
            Start My Day
          </Button>
          <Button
            onClick={() => setShowEndDay(true)}
            className="h-20 bg-gradient-to-r from-[#3C4E53] to-[#FD9C2D] hover:from-[#3C4E53]/90 hover:to-[#FD9C2D]/90 text-white rounded-2xl shadow-md font-bold text-base flex flex-col items-center gap-1">

            <span className="text-2xl">🌙</span>
            End My Day
          </Button>
        </motion.div>

        {/* Start Here card for new users */}
        {showStartHere && planProgress.length === 0 && workoutSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 mx-4 bg-gradient-to-br from-[#FD9C2D]/10 to-[#FAD98D]/20 border border-[#FD9C2D]/30 rounded-2xl p-5"
          >
            <h2 className="text-lg font-bold text-[#0A1A2F] mb-3">👋 Here's where to start</h2>
            <div className="space-y-2">
              <Link to={createPageUrl('Bible')}>
                <div className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <span className="text-2xl">📖</span>
                  <div>
                    <p className="font-semibold text-sm text-[#0A1A2F]">Read today's verse</p>
                    <p className="text-xs text-[#0A1A2F]/60">Start your spiritual journey</p>
                  </div>
                </div>
              </Link>
              <Link to={createPageUrl('Plans')}>
                <div className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-sm text-[#0A1A2F]">Start a reading plan</p>
                    <p className="text-xs text-[#0A1A2F]/60">Build a daily Bible habit</p>
                  </div>
                </div>
              </Link>
              <Link to={createPageUrl('Workouts')}>
                <div className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                  <span className="text-2xl">💪</span>
                  <div>
                    <p className="font-semibold text-sm text-[#0A1A2F]">Log your first workout</p>
                    <p className="text-xs text-[#0A1A2F]/60">Track your fitness progress</p>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Gideon Proactive Engagement */}
        <ProactiveSuggestions />
        <PersonalizedDevotional />
        <DailyReflectionPrompt />

        {/* Today's Overview */}
        <TodaysOverview
          user={user}
          onBookmark={handleBookmarkVerse} />


        {/* Today's Recommendations */}
        <TodaysRecommendations
          user={user}
          mealLogs={mealLogs}
          workoutSessions={workoutSessions}
          waterLogs={waterLogs}
          meditationSessions={meditationSessions} />


        {/* Wellness Hub */}
        <WellnessHub />

        {/* Progress Dashboard Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to={createPageUrl('ProgressDashboard')}>
            <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 border border-[#D9B878]/40 rounded-2xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Your Journey Dashboard
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    View progress across all areas: personal growth, fitness, nutrition, and spiritual development
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Gamification Banner */}
        {userProgress !== undefined &&
        <GamificationBanner userProgress={userProgress} />
        }



        {/* Reading Plan Progress Tracker */}
        <ReadingPlanProgressTracker 
          planProgress={planProgress} 
          plans={readingPlans}
        />

        {/* Active Plans */}
        {activePlans.length > 0 &&
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#0A1A2F]">Continue Reading</h2>
              <Link to={createPageUrl('Plans')} className="text-sm text-[#FD9C2D] font-semibold">
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {activePlans.slice(0, 2).map((plan, index) =>
            <ReadingPlanCard
              key={plan.id}
              plan={plan}
              progress={getProgressForPlan(plan.id)}
              onClick={() => navigate(createPageUrl(`PlanDetail?id=${plan.id}`))}
              index={index} />

            )}
            </div>
          </div>
        }

        {/* Your Activity */}
        








































        {/* Community Feed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-[#0A1A2F]">Community</h2>
            <Link to={createPageUrl('Community')} className="text-sm text-[#FD9C2D] font-semibold">
              See All
            </Link>
          </div>
          
          <p className="text-xs text-[#0A1A2F]/50 text-center mb-3">
            Share encouragement, updates or thoughts with your community
          </p>

          <Button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] hover:from-[#FD9C2D]/90 hover:to-[#FAD98D]/90 text-[#3C4E53] h-12 mb-4 rounded-xl shadow-md font-semibold">

            <Plus className="w-5 h-5 mr-2" />
            Post to Community
          </Button>

          {posts.length === 0 ?
          <div className="text-center py-8 bg-[#E6EBEF] rounded-2xl">
              <Users className="w-12 h-12 text-[#0A1A2F]/30 mx-auto mb-3" />
              <p className="text-[#0A1A2F]/50">No posts yet</p>
            </div> :

          <div className="space-y-4">
              {posts.slice(0, 3).map((post, index) =>
            <PostCard
              key={post.id}
              post={post}
              comments={comments}
              onLike={handleLike}
              onComment={handleComment}
              index={index} />

            )}
            </div>
          }
        </div>
      </div>

      {/* Modals */}
      <DailyVerseSettings
        isOpen={showDailyVerseSettings}
        onClose={() => setShowDailyVerseSettings(false)} />

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(data) => createPost.mutate(data)} />

      <StartMyDayModal
        isOpen={showStartDay}
        onClose={() => setShowStartDay(false)}
        user={user} />

      <EndMyDayModal
        isOpen={showEndDay}
        onClose={() => setShowEndDay(false)} />

      {/* Notification Permission Prompt */}
      {showNotifPrompt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-2">Stay on track daily</h3>
              <p className="text-sm text-[#0A1A2F]/60">
                Get your morning verse, Gideon's daily guidance, workout reminders, and evening reflections delivered to you every day.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={async () => {
                  await Notification.requestPermission();
                  setShowNotifPrompt(false);
                }}
                className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] text-[#3C4E53] font-semibold h-12 rounded-xl"
              >
                Enable Daily Reminders
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowNotifPrompt(false)}
                className="w-full text-[#0A1A2F]/50 text-sm"
              >
                Maybe later
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Help Chatbot */}
      <HelpChatbot />
    </div>);

}