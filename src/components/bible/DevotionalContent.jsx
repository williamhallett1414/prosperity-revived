import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DevotionalCard from './DevotionalCard';
import DevotionalArticle from './DevotionalArticle';

const devotionals = [
  {
    id: 'identity-christ',
    title: 'Who God Says I Am',
    subtitle: 'A devotional on identity in Christ',
    description: 'Discover your true identity rooted in God\'s unchanging truth. Learn who you are beyond the world\'s labels and step into the freedom of being God\'s masterpiece.',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600'
  }
];

export default function DevotionalContent() {
  const [selectedDevotional, setSelectedDevotional] = useState(null);

  if (selectedDevotional) {
    return (
      <DevotionalArticle
        devotional={selectedDevotional}
        onBack={() => setSelectedDevotional(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-1">Featured Devotionals</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Deep dive articles on faith and spiritual growth</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {devotionals.map((devotional, index) => (
          <DevotionalCard
            key={devotional.id}
            devotional={devotional}
            onClick={() => setSelectedDevotional(devotional)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}