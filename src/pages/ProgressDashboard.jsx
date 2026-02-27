import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Trophy, 
  Heart, 
  Dumbbell, 
  ChefHat, 
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import Hannah from '@/components/mindspirit/Hannah';
import CoachDavid from '@/components/wellness/CoachDavid';
import ChefDaniel from '@/components/wellness/ChefDaniel';
import GideonChatbot from '@/components/bible/GideonChatbot';
import HolisticProgressReport from '@/components/journey/HolisticProgressReport';
import WelcomeOnboarding from '@/components/onboarding/WelcomeOnboarding';
import PersonalizedDevotional from '@/components/gideon/PersonalizedDevotional';
import DailyReflectionPrompt from '@/components/gideon/DailyReflectionPrompt';

const chatbotConfig = {
  Hannah: {
    name: 'Hannah',
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    category: 'Personal Growth',
    description: 'Personal growth, mindset & emotional wellbeing'
  },
  CoachDavid: {
    name: 'Coach David',
    icon: Dumbbell,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    category: 'Fitness',
    description: 'Fitness plans, workouts & accountability'
  },
  ChefDaniel: {
    name: 'Chef Daniel',
    icon: ChefHat,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    category: 'Nutrition',
    description: 'Nutrition advice, meal ideas & healthy eating'
  },
  Gideon: {
    name: 'Gideon',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    category: 'Spiritual Growth',
    description: 'Scripture, spiritual guidance & daily devotionals'
  }
};

const memoryTypeIcons = {
  goal: Target,
  milestone: TrendingUp,
  achievement: Trophy,
  success: CheckCircle2
};

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: allMemories, isLoading } = useQuery({
    queryKey: ['allChatbotMemories', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const memories = await base44.entities.ChatbotMemory.filter({
        created_by: user.email,
        memory_type: ['goal', 'milestone', 'achievement', 'success']
      });
      
      return memories.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      );
    },
    enabled: !!user?.email,
    initialData: []
  });

  // Aggregate stats
  const stats = React.useMemo(() => {
    const byType = {
      goal: allMemories.filter(m => m.memory_type === 'goal').length,
      milestone: allMemories.filter(m => m.memory_type === 'milestone').length,
      achievement: allMemories.filter(m => m.memory_type === 'achievement').length,
      success: allMemories.filter(m => m.memory_type === 'success').length
    };
    
    const byChatbot = {
      Hannah: allMemories.filter(m => m.chatbot_name === 'Hannah').length,
      CoachDavid: allMemories.filter(m => m.chatbot_name === 'CoachDavid').length,
      ChefDaniel: allMemories.filter(m => m.chatbot_name === 'ChefDaniel').length,
      Gideon: allMemories.filter(m => m.chatbot_name === 'Gideon').length
    };
    
    return { byType, byChatbot, total: allMemories.length };
  }, [allMemories]);

  // Group by chatbot
  const memoriesByChatbot = React.useMemo(() => {
    return {
      Hannah: allMemories.filter(m => m.chatbot_name === 'Hannah'),
      CoachDavid: allMemories.filter(m => m.chatbot_name === 'CoachDavid'),
      ChefDaniel: allMemories.filter(m => m.chatbot_name === 'ChefDaniel'),
      Gideon: allMemories.filter(m => m.chatbot_name === 'Gideon')
    };
  }, [allMemories]);

  // Check if user is new (no memories and onboarding not completed)
  useEffect(() => {
    if (user && allMemories.length === 0 && !user.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [user, allMemories]);

  // Handle onboarding completion
  const updateOnboardingMutation = useMutation({
    mutationFn: async () => {
      await base44.auth.updateMe({ onboarding_completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
  });

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    updateOnboardingMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-8">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <WelcomeOnboarding onComplete={handleOnboardingComplete} />
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Journey</h1>
                <p className="text-gray-600">Progress across all areas of growth</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(createPageUrl('Community'))}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Community
              </Button>
              <Button
                onClick={() => setShowOnboarding(true)}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Tour
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Holistic Progress Report */}
        {stats.total > 0 && <HolisticProgressReport user={user} />}

        {/* Personalized Devotional */}
        <PersonalizedDevotional />

        {/* Chat with Guides Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chat with Your Guides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(chatbotConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  onClick={() => setActiveChat(key)}
                  className={`h-auto py-4 px-3 flex flex-col items-center gap-2 bg-gradient-to-br ${config.color} hover:opacity-90 text-white shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-semibold text-center">{config.name}</span>
                  <span className="text-xs opacity-90">{config.category}</span>
                  <p className="text-xs opacity-70 mt-0.5 text-center leading-tight">{config.description}</p>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Goals Set', value: stats.byType.goal, icon: Target, color: 'text-blue-500' },
            { label: 'Milestones', value: stats.byType.milestone, icon: TrendingUp, color: 'text-purple-500' },
            { label: 'Achievements', value: stats.byType.achievement, icon: Trophy, color: 'text-yellow-500' },
            { label: 'Successes', value: stats.byType.success, icon: CheckCircle2, color: 'text-green-500' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Daily Reflection Prompt */}
        <DailyReflectionPrompt />

        {/* Progress by Chatbot */}
        <div className="space-y-6">
          {Object.entries(chatbotConfig).map(([key, config], idx) => {
            const Icon = config.icon;
            const memories = memoriesByChatbot[key] || [];
            
            if (memories.length === 0) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className={`${config.bgColor} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{config.name}</CardTitle>
                          <p className={`text-sm ${config.textColor}`}>{config.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                       <Badge variant="secondary" className="text-lg px-3 py-1">
                         {memories.length}
                       </Badge>
                       <Button
                         size="sm"
                         onClick={() => setActiveChat(key)}
                         className={`bg-gradient-to-br ${config.color} hover:opacity-90 text-white`}
                       >
                         <MessageCircle className="w-4 h-4 mr-1" />
                         Chat
                       </Button>
                      </div>
                      </div>
                      </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {memories.slice(0, 5).map((memory) => {
                        const TypeIcon = memoryTypeIcons[memory.memory_type] || Target;
                        return (
                          <div
                            key={memory.id}
                            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <TypeIcon className={`w-4 h-4 ${config.textColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {memory.memory_type}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(memory.created_date), 'MMM d, yyyy')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 leading-relaxed">
                                {memory.content}
                              </p>
                              {memory.context && (
                                <p className="text-xs text-gray-600 mt-1 italic">
                                  {memory.context}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {memories.length > 5 && (
                        <p className="text-sm text-gray-500 text-center pt-2">
                          + {memories.length - 5} more items
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {stats.total === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your Journey Awaits
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Start conversations with Hannah, Coach David, Chef Daniel, or Gideon to track your progress across personal growth, fitness, nutrition, and spiritual development.
            </p>
          </motion.div>
        )}
      </div>

      {/* Chatbot Modals */}
      {activeChat === 'Hannah' && user && (
        <Hannah user={user} />
      )}
      {activeChat === 'CoachDavid' && user && (
        <CoachDavid user={user} />
      )}
      {activeChat === 'ChefDaniel' && user && (
        <ChefDaniel user={user} />
      )}
      {activeChat === 'Gideon' && user && (
        <GideonChatbot user={user} />
      )}
    </div>
  );
}