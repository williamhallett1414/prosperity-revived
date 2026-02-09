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
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No friends yet</p>
        <p className="text-gray-400 text-sm mt-2">Add friends to see them here</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{friends.length} Friends</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {friends.map((friend, index) => {
          const friendEmail = friend.user_email === user?.email ? friend.friend_email : friend.user_email;
          const friendName = friend.user_email === user?.email ? friend.friend_name : friend.user_name;

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                {friendName?.charAt(0) || 'F'}
              </div>
              <p className="font-semibold text-gray-900 text-center text-sm line-clamp-2">
                {friendName || friendEmail}
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">{friendEmail}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}