import React from 'react';
import { motion } from 'framer-motion';
import PostCard from '@/components/community/PostCard';

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
        >
          <PostCard
            post={post}
            comments={comments.filter(c => c.post_id === post.id)}
            onLike={() => {}}
            onComment={() => {}}
            index={index}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}