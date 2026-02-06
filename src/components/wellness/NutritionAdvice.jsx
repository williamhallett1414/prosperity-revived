import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Droplets, Heart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function NutritionAdvice() {

  const featuredArticles = [
    { 
      icon: Apple, 
      title: 'Eat Whole Foods', 
      desc: 'Focus on fruits, vegetables, whole grains'
    },
    { 
      icon: Droplets, 
      title: 'Stay Hydrated', 
      desc: 'Drink adequate water daily'
    },
    { 
      icon: Activity, 
      title: 'Lower Blood Sugar', 
      desc: 'Balance glucose for better energy'
    },
    { 
      icon: Heart, 
      title: 'Healthy Fats', 
      desc: 'Include omega-3s from fish, nuts, seeds'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Featured Image */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600" 
          alt="Nutrition" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <h2 className="text-white font-bold text-xl p-4">Nutrition Guidance</h2>
        </div>
      </div>

      {/* Featured Nutrition Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {featuredArticles.map((article, index) => {
          const Icon = article.icon;
          return (
            <Link
              key={index}
              to={createPageUrl('NutritionGuidance')}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 text-center hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
              >
                <Icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm text-[#1a1a2e] dark:text-white mb-1">{article.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{article.desc}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* View More Button */}
      <Link to={createPageUrl('NutritionGuidance')}>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          View More
        </Button>
      </Link>
    </div>
  );
}