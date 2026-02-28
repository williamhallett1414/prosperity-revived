import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
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
import PersonalizedDevotional from '@/components/gideon/PersonalizedDevotional';
import DailyReflectionPrompt from '@/components/gideon/DailyReflectionPrompt';

const chatbotConfig = {
  Hannah: {
    name: 'Hannah',
    icon: '🧠',
    color: 'from-[#AFC7E3] to-[#7ab3d4]',
    bgColor: 'bg-[#AFC7E3]/20',
    textColor: 'text-[#3C4E53]',
    borderColor: 'border-[#AFC7E3]',
    category: 'Personal Growth & Mindset',
    description: 'Personal growth, mindset & emotional wellbeing'
  },
  CoachDavid: {
    name: 'Coach David',
    icon: '💪',
    color: 'from-[#0A0A0A] to-[#38BDF8]',
    bgColor: 'bg-[#38BDF8]/15',
    textColor: 'text-[#4a6b50]',
    borderColor: 'border-[#8fa68a]',
    category: 'Fitness & Wellness',
    description: 'Fitness plans, workouts & accountability'
  },
  ChefDaniel: {
    name: 'Chef Daniel',
    icon: '🍽️',
    color: 'from-[#8fa68a] to-[#6b8f72]',
    bgColor: 'bg-[#8fa68a]/20',
    textColor: 'text-[#b86e10]',
    borderColor: 'border-[#FD9C2D]',
    category: 'Nutrition & Meals',
    description: 'Nutrition advice, meal ideas & healthy eating'
  },
  Gideon: {
    name: 'Gideon',
    icon: '📖',
    color: 'from-[#c9a227] to-[#D9B878]',
    bgColor: 'bg-[#D9B878]/20',
    textColor: 'text-[#8a6e1a]',
    borderColor: 'border-[#D9B878]',
    category: 'Scripture & Spiritual Growth',
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
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.filter({ created_by: user.email });
      return list[0] || null;
    },
    enabled: !!user?.email
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
    <div className="min-h-screen bg-[#F2F6FA] pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center">
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
                className="text-[#3C4E53] border-[#AFC7E3]/60 hover:bg-[#F2F6FA]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Community
              </Button>

            </div>
          </div>
        </motion.div>

        {/* Getting started state for new users */}
        {(!userProgress || (
          !userProgress.workouts_completed &&
          !userProgress.prayers_logged &&
          !userProgress.journal_entries
        )) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 border border-[#D9B878]/40 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">You're just getting started!</h3>
                <p className="text-xs text-gray-500">Your journey insights will appear here as you log activity</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Link to={createPageUrl('Bible')}>
                <div className="bg-white rounded-xl p-3 text-center hover:shadow-sm transition-shadow cursor-pointer">
                  <p className="text-xl mb-1">📖</p>
                  <p className="text-xs font-medium text-gray-700">Read Bible</p>
                </div>
              </Link>
              <Link to={createPageUrl('Workouts')}>
                <div className="bg-white rounded-xl p-3 text-center hover:shadow-sm transition-shadow cursor-pointer">
                  <p className="text-xl mb-1">💪</p>
                  <p className="text-xs font-medium text-gray-700">Log Workout</p>
                </div>
              </Link>
              <Link to={createPageUrl('Prayer')}>
                <div className="bg-white rounded-xl p-3 text-center hover:shadow-sm transition-shadow cursor-pointer">
                  <p className="text-xl mb-1">🙏</p>
                  <p className="text-xs font-medium text-gray-700">Pray</p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}

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
              return (
                <Button
                 key={key}
                 onClick={() => setActiveChat(key)}
                 className={`h-auto py-3 px-2 flex flex-col items-center gap-1.5 bg-gradient-to-br ${config.color} hover:opacity-90 text-white shadow-md`}
                >
                 <span className="text-xl leading-none">{config.icon}</span>
                 <span className="text-xs font-bold text-center leading-tight">{config.name}</span>
                 <span className="text-[10px] opacity-90 leading-tight text-center">{config.category}</span>
                 <p className="text-[10px] opacity-70 text-center leading-tight line-clamp-2">{config.description}</p>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Goals Set', value: stats.byType.goal, icon: Target, color: 'text-[#AFC7E3]' },
            { label: 'Milestones', value: stats.byType.milestone, icon: TrendingUp, color: 'text-[#c9a227]' },
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
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-xl`}>
                          {config.icon}
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