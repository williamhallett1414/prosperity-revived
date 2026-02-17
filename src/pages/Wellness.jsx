import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Heart, Plus, Sparkles, Search, BookOpen, Brain, Target, Crown, Calendar, CheckCircle2, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import PullToRefresh from '@/components/ui/PullToRefresh';
import MealTracker from '@/components/wellness/MealTracker';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
import TrendingNutritionArticles from '@/components/nutrition/TrendingNutritionArticles';
import MeditationGuide from '@/components/wellness/MeditationGuide';
import RecipeCollections from '@/components/wellness/RecipeCollections';
import CommunityRecipes from '@/components/wellness/CommunityRecipes';
import PersonalizedNutritionPlan from '@/components/wellness/PersonalizedNutritionPlan';
import AIMealPlanner from '@/components/wellness/AIMealPlanner';
import CustomPrayerBuilder from '@/components/wellness/CustomPrayerBuilder';


import ContextualSuggestions from '@/components/ai/ContextualSuggestions';

import MoodEnergyChart from '@/components/wellness/MoodEnergyChart';
import SelfCareGuides from '@/components/wellness/SelfCareGuides';
import ReeVibeFitness from '@/components/wellness/ReeVibeFitness';
import CommunityRecipeFeed from '@/components/wellness/CommunityRecipeFeed';

import WellnessHubCard from '@/components/wellness/WellnessHubCard';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';

import ChefDaniel from '@/components/wellness/ChefDaniel';
import Hannah from '@/components/wellness/Hannah.jsx';



import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import MeditationTracker from '@/components/wellness/MeditationTracker';
import PersonalizedWorkouts from '@/components/recommendations/PersonalizedWorkouts';
import { Input } from '@/components/ui/input';




export default function Wellness() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    // Read URL parameter for selectedTab immediately
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTabParam = urlParams.get('selectedTab');
    if (selectedTabParam) {
      const tabMapping = {
        'nutrition': 'nutrition',
        'personalGrowth': 'mind'
      };
      return tabMapping[selectedTabParam] || 'nutrition';
    }
    return 'nutrition';
  });
  const [workoutCategory, setWorkoutCategory] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
    
    // Ensure default challenges exist
    base44.functions.invoke('ensureChallengesExist', {}).catch(err => {
      console.error('Failed to ensure challenges exist:', err);
    });
    
    // Ensure category workouts exist
    base44.functions.invoke('ensureCategoryWorkouts', {}).catch(err => {
      console.error('Failed to ensure category workouts exist:', err);
    });
    
    // Populate missing workout exercises (first time only)
    const hasPopulated = localStorage.getItem('workouts_populated');
    if (!hasPopulated) {
      base44.functions.invoke('populateMissingWorkoutExercises', {}).then(() => {
        localStorage.setItem('workouts_populated', 'true');
        queryClient.invalidateQueries(['workoutPlans']);
      }).catch(err => {
        console.error('Failed to populate workout exercises:', err);
      });
    }
  }, []);



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

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: () => base44.entities.MeditationSession.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: async () => {
      try {
        return await base44.entities.Meditation.filter({});
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      try {
        return await base44.entities.Recipe.filter({}, '-created_date', 50);
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const allPosts = await base44.entities.Post.filter({}, '-created_date', 100);
        return allPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
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

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      try {
        return await base44.entities.JournalEntry.filter({ created_by: user?.email }, '-created_date');
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: prayerJournals = [] } = useQuery({
    queryKey: ['prayerJournals'],
    queryFn: async () => {
      try {
        return await base44.entities.PrayerJournal.filter({ created_by: user?.email }, '-created_date');
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

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries(['recipes']),
      queryClient.invalidateQueries(['meditations']),
      queryClient.invalidateQueries(['mealLogs']),
      queryClient.invalidateQueries(['waterLogs'])
    ]);
  };

       return (
         <div className="min-h-screen bg-[#F2F6FA] pb-24">
           {/* Top Navigation */}
           <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
             <div className="max-w-2xl mx-auto flex items-center justify-between mb-3">
               <Link
                 to={createPageUrl('Home')}
                 className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
               >
                 <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
               </Link>
               <h1 className="text-lg font-bold text-[#0A1A2F]">Wellness</h1>
               <div className="w-10" />
             </div>
        
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 p-1 rounded-xl bg-[#E6EBEF]">
            <TabsTrigger value="nutrition" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Nutrition</TabsTrigger>
            <TabsTrigger value="mind" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Personal Growth</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-4 pt-6 pb-6">
        <PullToRefresh onRefresh={handleRefresh}>
        {/* Weekly Theme */}
        <WeeklyThemeBanner />

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          {/* Nutrition Tab */}
           <TabsContent value="nutrition" className="space-y-8 max-w-2xl mx-auto">
             {/* Today's Nutrition Section */}
             <div className="pt-2">
               <NutritionDashboard mealLogs={mealLogs} />
             </div>

             {/* Suggested Meals Section */}
             <div className="pt-2">
               <MealSuggestions />
             </div>

             {/* Discover Recipes Section */}
             <div className="pt-2">
               <Link to={createPageUrl('DiscoverRecipes')}>
                 <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
                   <div className="flex items-center gap-3 mb-2">
                     <UtensilsCrossed className="w-6 h-6" />
                     <h3 className="text-lg font-semibold">Discover Recipes</h3>
                   </div>
                   <p className="text-[#0A1A2F]/70 text-sm">Browse and create delicious recipes</p>
                 </div>
               </Link>
             </div>

             {/* Trending Nutrition Articles Section */}
             <div className="pt-2">
               <TrendingNutritionArticles />
             </div>

             {/* Meal Tracker Section */}
             <div className="pt-2">
               <MealTracker />
             </div>

             {/* Personalized Nutrition Plan Section */}
             <div className="pt-2">
               <PersonalizedNutritionPlan />
             </div>

             {/* Community Feed Section */}
             <div className="pt-2">
               <CommunityRecipeFeed user={user} />
             </div>
            </TabsContent>



            {/* Personal Growth Tab */}
            <TabsContent value="mind" className="max-w-2xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">Personal Growth</h2>
                <p className="text-sm text-[#0A1A2F]/60">Tools to strengthen your mind, emotions, and spiritual life.</p>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* My Journal */}
                <Link to={createPageUrl('MyJournalEntries')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">My Journal</h3>
                        <p className="text-xs text-[#0A1A2F]/60">View reflections</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Daily Mindset Reset */}
                <Link to={createPageUrl('MindsetResetPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Mindset Reset</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Daily prompts</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Emotional Check-In */}
                <Link to={createPageUrl('EmotionalCheckInPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Emotional Check-In</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Track feelings</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Scripture Affirmations */}
                <Link to={createPageUrl('AffirmationsPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#AFC7E3]/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#AFC7E3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Affirmations</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Daily truths</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Growth Pathways */}
                <Link to={createPageUrl('GrowthPathwaysPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-[#AFC7E3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Growth Pathways</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Personal development</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Habit Builder */}
                <Link to={createPageUrl('HabitBuilderPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Habit Builder</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Daily tracking</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Identity in Christ */}
                <Link to={createPageUrl('IdentityInChristPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Identity in Christ</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Know who you are</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Weekly Reflection */}
                <Link to={createPageUrl('WeeklyReflectionPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#AFC7E3]/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#AFC7E3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Weekly Reflection</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Review your week</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Self-Care Challenges */}
                <Link to={createPageUrl('SelfCareChallengesPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Self-Care Challenges</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Build habits</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Gratitude Journal */}
                <Link to={createPageUrl('GratitudeJournalPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Gratitude Journal</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Count blessings</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </TabsContent>

            </Tabs>
        </PullToRefresh>
      </div>



      {/* Chef Daniel - Nutrition Chat */}
      {activeTab === 'nutrition' && (
       <ChefDaniel 
          user={user} 
          userRecipes={[]}
          mealLogs={mealLogs}
        />
      )}
      </div>
      );
      }