import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';

export default function AchievementsTab({ userProgress }) {
  if (!userProgress) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No achievements yet</p>
        <p className="text-gray-400 text-sm mt-2">Complete activities to earn achievements</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Level & Points Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600">{userProgress.level || 1}</div>
            <p className="text-sm text-gray-600 mt-2">Level</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">{userProgress.total_points || 0}</div>
            <p className="text-sm text-gray-600 mt-2">Points</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600">{userProgress.current_streak || 0}</div>
            <p className="text-sm text-gray-600 mt-2">Streak</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Progress to Next Level</h3>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((userProgress.total_points % 1000) / 10, 100)}%` }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {userProgress.total_points % 1000} / 1000 points to next level
        </p>
      </div>

      {/* Badges */}
      {userProgress.badges && userProgress.badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">{userProgress.badges.length} Badges Earned</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {userProgress.badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
                  🏅
                </div>
                <p className="text-xs text-gray-600 text-center mt-2">Badge {index + 1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">Community Posts</span>
            <span className="font-semibold text-gray-900">{userProgress.community_posts || 0}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">Workouts Completed</span>
            <span className="font-semibold text-gray-900">{userProgress.workouts_completed || 0}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">Meditations Completed</span>
            <span className="font-semibold text-gray-900">{userProgress.meditations_completed || 0}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">Comments Made</span>
            <span className="font-semibold text-gray-900">{userProgress.comments_count || 0}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-gray-600">Friends</span>
            <span className="font-semibold text-gray-900">{userProgress.friends_count || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Photos Uploaded</span>
            <span className="font-semibold text-gray-900">{userProgress.photos_uploaded || 0}</span>
          </div>
        </div>
      </div>

      {/* Streaks */}
      {(userProgress.current_streak > 0 || userProgress.longest_streak > 0) && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔥 Streaks</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="text-2xl font-bold text-purple-600">{userProgress.current_streak || 0} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Longest Streak</span>
              <span className="text-2xl font-bold text-pink-600">{userProgress.longest_streak || 0} days</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}