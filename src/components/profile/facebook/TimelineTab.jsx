import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function TimelineTab({ user, posts, comments }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No posts yet</p>
        <p className="text-gray-400 text-sm mt-2">Posts will appear here when you share them</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A1A2F] to-[#c9a227] flex items-center justify-center text-white font-semibold">
              {post.user_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#0A1A2F]">{post.user_name || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">{post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : ''}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3 leading-relaxed">{post.content}</p>
          {post.image_url && <img src={post.image_url} alt="Post" className="w-full rounded-lg mb-3 max-h-96 object-cover" />}
          {post.video_url && <video src={post.video_url} controls className="w-full rounded-lg mb-3 max-h-96" />}
        </motion.div>
      ))}
    </motion.div>
  );
}