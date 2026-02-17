import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function WellnessHub() {
  const categories = [
    {
      name: 'Workouts',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop',
      path: createPageUrl('Wellness?selectedTab=workouts')
    },
    {
      name: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
      path: createPageUrl('Wellness?selectedTab=nutrition')
    },
    {
      name: 'Bible',
      image: 'https://images.unsplash.com/photo-1507842732509-fd09843a75f6?w=500&h=300&fit=crop',
      path: createPageUrl('Bible')
    },
    {
      name: 'Personal Growth',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      path: createPageUrl('Wellness?selectedTab=personalGrowth')
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4 px-4">Wellness Hub</h2>
      <div className="grid grid-cols-2 gap-4 px-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={category.path}>
              <div
                className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                style={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white font-bold text-lg text-center px-3">
                    {category.name}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}