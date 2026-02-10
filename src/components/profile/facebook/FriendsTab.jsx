import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FriendsTab({ friends, user }) {
  // Get the actual friend objects (email addresses)
  const friendEmails = friends.map(f => 
    f.user_email === user?.email ? f.friend_email : f.user_email
  );

  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 sm:p-16 text-center border border-gray-100">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">👥</span>
        </div>
        <p className="text-gray-600 text-lg font-semibold">No friends yet</p>
        <p className="text-gray-400 text-sm mt-2">Start connecting with others</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {friends.map((friend, index) => {
          const friendEmail = friend.user_email === user?.email ? friend.friend_email : friend.user_email;
          const friendName = friend.user_email === user?.email ? friend.friend_name : friend.user_name;

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                {friendName?.charAt(0).toUpperCase() || 'F'}
              </div>
              <p className="font-semibold text-gray-900 text-center text-sm line-clamp-2 mb-1">
                {friendName || friendEmail}
              </p>
              <p className="text-xs text-gray-500 text-center truncate w-full px-1">{friendEmail}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}