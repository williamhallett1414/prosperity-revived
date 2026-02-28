import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';

export default function AchievementsTab({ userProgress }) {
  if (!userProgress) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 sm:p-16 text-center border border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🏆</span>
        </div>
        <p className="text-gray-600 text-lg font-semibold">No achievements yet</p>
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
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-xl shadow-sm p-6 sm:p-8 border border-yellow-200">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold text-yellow-600 mb-2">{userProgress.level || 1}</div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Level</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold text-orange-600 mb-2">{userProgress.total_points || 0}</div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Points</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold text-red-600 mb-2">{userProgress.current_streak || 0}</div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Streak</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Progress to Next Level</h3>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((userProgress.total_points % 1000) / 10, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 h-4 rounded-full shadow-inner"
          />
        </div>
        <p className="text-sm text-gray-600 mt-3 font-medium">
          {userProgress.total_points % 1000} / 1,000 points to level {(userProgress.level || 1) + 1}
        </p>
      </div>

      {/* Badges */}
      {userProgress.badges && userProgress.badges.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">{userProgress.badges.length} {userProgress.badges.length === 1 ? 'Badge' : 'Badges'} Earned</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {userProgress.badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                  🏅
                </div>
                <p className="text-xs text-gray-600 text-center mt-2 font-medium">Badge {index + 1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-5">Activity Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-[#FAD98D]/10 rounded-lg border border-[#D9B878]/40">
            <span className="text-gray-700 font-medium">Community Posts</span>
            <span className="font-bold text-[#3C4E53] text-xl">{userProgress.community_posts || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="text-gray-700 font-medium">Workouts Completed</span>
            <span className="font-bold text-green-700 text-xl">{userProgress.workouts_completed || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-100">
            <span className="text-gray-700 font-medium">Meditations Completed</span>
            <span className="font-bold text-pink-700 text-xl">{userProgress.meditations_completed || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-gray-700 font-medium">Comments Made</span>
            <span className="font-bold text-blue-700 text-xl">{userProgress.comments_count || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <span className="text-gray-700 font-medium">Friends</span>
            <span className="font-bold text-indigo-700 text-xl">{userProgress.friends_count || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
            <span className="text-gray-700 font-medium">Photos Uploaded</span>
            <span className="font-bold text-amber-700 text-xl">{userProgress.photos_uploaded || 0}</span>
          </div>
        </div>
      </div>

      {/* Streaks */}
      {(userProgress.current_streak > 0 || userProgress.longest_streak > 0) && (
        <div className="bg-gradient-to-br from-[#FAD98D]/10 via-[#FAD98D]/10 to-red-50 rounded-xl shadow-sm p-6 border border-[#D9B878]/40">
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-2xl">🔥</span> Streaks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-5 bg-white rounded-lg border border-[#D9B878]/40">
              <span className="text-sm text-gray-600 font-medium mb-2">Current Streak</span>
              <span className="text-4xl font-bold text-[#8a6e1a]">{userProgress.current_streak || 0}</span>
              <span className="text-xs text-gray-500 mt-1">days</span>
            </div>
            <div className="flex flex-col items-center p-5 bg-white rounded-lg border border-pink-200">
              <span className="text-sm text-gray-600 font-medium mb-2">Longest Streak</span>
              <span className="text-4xl font-bold text-pink-600">{userProgress.longest_streak || 0}</span>
              <span className="text-xs text-gray-500 mt-1">days</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}