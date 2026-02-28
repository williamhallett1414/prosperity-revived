import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Dumbbell, Heart, Camera, MessageCircle, Users } from 'lucide-react';

export default function ActivityTab({ userProgress }) {
  if (!userProgress) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 sm:p-16 text-center border border-[#D9B878]/25">
        <div className="w-20 h-20 bg-[#FAD98D]/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📊</span>
        </div>
        <p className="text-[#0A1A2F]/70 text-lg font-semibold">No activity yet</p>
        <p className="text-[#0A1A2F]/50 text-sm mt-2">Start engaging to see your activity</p>
      </div>
    );
  }

  const activities = [
    {
      icon: BookOpen,
      label: 'Reading Plans Completed',
      value: userProgress.reading_plans_completed || 0,
      color: 'from-[#c9a227] to-[#D9B878]',
      emoji: '📖'
    },
    {
      icon: MessageCircle,
      label: 'Community Posts',
      value: userProgress.community_posts || 0,
      color: 'from-[#D9B878] to-[#c9a227]',
      emoji: '💬'
    },
    {
      icon: Dumbbell,
      label: 'Workouts Completed',
      value: userProgress.workouts_completed || 0,
      color: 'from-[#0A1A2F] to-[#1a3a5c]',
      emoji: '💪'
    },
    {
      icon: Heart,
      label: 'Meditations Completed',
      value: userProgress.meditations_completed || 0,
      color: 'from-[#c9a227] to-[#FAD98D]',
      emoji: '🧘'
    },
    {
      icon: Users,
      label: 'Friends',
      value: userProgress.friends_count || 0,
      color: 'from-[#0A1A2F] to-[#c9a227]',
      emoji: '👥'
    },
    {
      icon: MessageCircle,
      label: 'Comments Made',
      value: userProgress.comments_count || 0,
      color: 'from-[#D9B878] to-[#FAD98D]',
      emoji: '💭'
    },
    {
      icon: MessageCircle,
      label: 'Messages Sent',
      value: userProgress.messages_sent || 0,
      color: 'from-[#c9a227] to-[#0A1A2F]',
      emoji: '✉️'
    },
    {
      icon: Camera,
      label: 'Photos Uploaded',
      value: userProgress.photos_uploaded || 0,
      color: 'from-[#FAD98D] to-[#c9a227]',
      emoji: '📸'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#D9B878]/25">
        <h2 className="text-2xl font-bold text-[#0A1A2F] mb-6">Activity Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-br ${activity.color} rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{activity.emoji}</div>
                  <Icon className="w-6 h-6 opacity-80" />
                </div>
                <div className="text-3xl font-bold mb-1">{activity.value}</div>
                <div className="text-sm opacity-90 font-medium">{activity.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#D9B878]/25">
        <h3 className="text-xl font-bold text-[#0A1A2F] mb-5">Recent Milestones</h3>
        <div className="space-y-4">
          {userProgress.reading_plans_completed > 0 && (
            <div className="flex items-start gap-3 p-3 bg-[#FAD98D]/10 rounded-lg border border-[#D9B878]/25">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-white flex-shrink-0">
                📖
              </div>
              <div>
                <p className="font-semibold text-[#0A1A2F]">Completed Reading Plans</p>
                <p className="text-sm text-[#0A1A2F]/70">{userProgress.reading_plans_completed} plan{userProgress.reading_plans_completed !== 1 ? 's' : ''} completed</p>
              </div>
            </div>
          )}
          {userProgress.workouts_completed > 0 && (
            <div className="flex items-start gap-3 p-3 bg-[#FAD98D]/10 rounded-lg border border-[#D9B878]/25">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-white flex-shrink-0">
                💪
              </div>
              <div>
                <p className="font-semibold text-[#0A1A2F]">Fitness Journey</p>
                <p className="text-sm text-[#0A1A2F]/70">{userProgress.workouts_completed} workout{userProgress.workouts_completed !== 1 ? 's' : ''} completed</p>
              </div>
            </div>
          )}
          {userProgress.meditations_completed > 0 && (
            <div className="flex items-start gap-3 p-3 bg-[#FAD98D]/10 rounded-lg border border-[#D9B878]/25">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-white flex-shrink-0">
                🧘
              </div>
              <div>
                <p className="font-semibold text-[#0A1A2F]">Mindfulness Practice</p>
                <p className="text-sm text-[#0A1A2F]/70">{userProgress.meditations_completed} meditation{userProgress.meditations_completed !== 1 ? 's' : ''} completed</p>
              </div>
            </div>
          )}
          {userProgress.friends_count > 0 && (
            <div className="flex items-start gap-3 p-3 bg-[#FAD98D]/10 rounded-lg border border-[#D9B878]/25">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-white flex-shrink-0">
                👥
              </div>
              <div>
                <p className="font-semibold text-[#0A1A2F]">Building Community</p>
                <p className="text-sm text-[#0A1A2F]/70">{userProgress.friends_count} friend{userProgress.friends_count !== 1 ? 's' : ''} connected</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}