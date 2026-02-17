import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { BookOpen, Heart, Users, Plus, Settings, Dumbbell, Sparkles } from 'lucide-react';
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
import StartMyDayModal from '@/components/home/StartMyDayModal';
import EndMyDayModal from '@/components/home/EndMyDayModal';
import TodaysOverview from '@/components/home/TodaysOverview';
import WellnessHub from '@/components/home/WellnessHub';
import TodaysRecommendations from '@/components/home/TodaysRecommendations';


import { Trophy } from 'lucide-react';

export default function Home() {
  const [showDailyVerseSettings, setShowDailyVerseSettings] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStartDay, setShowStartDay] = useState(false);
  const [showEndDay, setShowEndDay] = useState(false);
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
    queryFn: async () => {
      try {
        return await base44.entities.Bookmark.filter({ created_by: user?.email });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

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

  const { data: memberships = [] } = useQuery({
    queryKey: ['myMemberships'],
    queryFn: async () => {
      try {
        return await base44.entities.GroupMember.filter({ user_email: user?.email });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      try {
        return await base44.entities.StudyGroup.filter({});
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

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: async () => {
      try {
        return await base44.entities.Meditation.filter({}, '-created_date', 20);
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: workoutPlans = [] } = useQuery({
    queryKey: ['workoutPlans'],
    queryFn: async () => {
      try {
        return await base44.entities.WorkoutPlan.filter({}, '-created_date', 10);
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challengeParticipants'],
    queryFn: async () => {
      try {
        if (!user?.email) return [];
        return await base44.entities.ChallengeParticipant.filter({ user_email: user.email, status: 'active' });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      try {
        if (!user?.email) return [];
        return await base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 10);
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
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

  const { data: myPosts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      try {
        return await base44.entities.Post.filter({ created_by: user?.email });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
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
    <div className="min-h-screen bg-[#F2F6FA]">
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#0A1A2F] mb-1">
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
          </h1>
          <p className="text-[#0A1A2F]/60">Welcome back, {user?.full_name?.split(' ')[0] || 'friend'}</p>
        </motion.div>

        {/* Start/End Day Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 mb-8 px-4"
        >
          <Button
            onClick={() => setShowStartDay(true)}
            className="h-20 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] rounded-2xl shadow-md font-bold text-base flex flex-col items-center gap-1"
          >
            <span className="text-2xl">🌅</span>
            Start My Day
          </Button>
          <Button
            onClick={() => setShowEndDay(true)}
            className="h-20 bg-gradient-to-r from-[#0A1A2F] to-[#AFC7E3] hover:from-[#0A1A2F]/90 hover:to-[#AFC7E3]/90 text-white rounded-2xl shadow-md font-bold text-base flex flex-col items-center gap-1"
          >
            <span className="text-2xl">🌙</span>
            End My Day
          </Button>
        </motion.div>

        {/* Today's Overview */}
        <TodaysOverview 
          meditations={meditations}
          workoutPlans={workoutPlans}
          challenges={challenges}
          user={user}
          onBookmark={handleBookmarkVerse}
        />

        {/* Today's Recommendations */}
        <TodaysRecommendations 
          user={user}
          mealLogs={mealLogs}
          workoutSessions={workoutSessions}
          waterLogs={waterLogs}
          meditationSessions={meditationSessions}
        />

        {/* Wellness Hub */}
        <WellnessHub />

        {/* Gamification Banner */}
        {userProgress !== undefined && (
          <GamificationBanner userProgress={userProgress} />
        )}



        {/* Active Plans */}
        {activePlans.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-[#0A1A2F]">Continue Reading</h2>
              <Link to={createPageUrl('Plans')} className="text-sm text-[#D9B878] font-semibold">
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
            <h2 className="text-xl font-bold text-[#0A1A2F] mb-3">Your Recent Activity</h2>
            <div className="space-y-2">
              {myPosts.slice(0, 2).map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#E6EBEF] rounded-xl p-4 text-sm border-l-4 border-[#D9B878] shadow-sm"
                >
                  <p className="text-[#0A1A2F]">Posted: <span className="font-semibold">"{post.content.slice(0, 40)}..."</span></p>
                  <p className="text-xs text-[#0A1A2F]/50 mt-1">{new Date(post.created_date).toLocaleDateString()}</p>
                </motion.div>
              ))}
              {workoutSessions.slice(0, 2).map(session => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#E6EBEF] rounded-xl p-4 text-sm border-l-4 border-[#AFC7E3] shadow-sm"
                >
                  <p className="text-[#0A1A2F]">Workout: <span className="font-semibold">{session.workout_title}</span> ({session.duration_minutes}m)</p>
                  <p className="text-xs text-[#0A1A2F]/50 mt-1">{new Date(session.date).toLocaleDateString()}</p>
                </motion.div>
              ))}
              {meditationSessions.slice(0, 2).map(session => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#E6EBEF] rounded-xl p-4 text-sm border-l-4 border-[#D9B878] shadow-sm"
                >
                  <p className="text-[#0A1A2F]">Meditation: <span className="font-semibold">{session.meditation_title}</span></p>
                  <p className="text-xs text-[#0A1A2F]/50 mt-1">{new Date(session.date).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Community Feed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-[#0A1A2F]">Community</h2>
            <Link to={createPageUrl('Community')} className="text-sm text-[#D9B878] font-semibold">
              See All
            </Link>
          </div>
          
          <Button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] h-12 mb-4 rounded-xl shadow-md font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Share Your Thoughts
          </Button>

          {posts.length === 0 ? (
            <div className="text-center py-8 bg-[#E6EBEF] rounded-2xl">
              <Users className="w-12 h-12 text-[#0A1A2F]/30 mx-auto mb-3" />
              <p className="text-[#0A1A2F]/50">No posts yet</p>
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
      <StartMyDayModal
        isOpen={showStartDay}
        onClose={() => setShowStartDay(false)}
        meditations={meditations}
        workoutPlans={workoutPlans}
        user={user}
      />
      <EndMyDayModal
        isOpen={showEndDay}
        onClose={() => setShowEndDay(false)}
        meditations={meditations}
      />
    </div>
  );
}