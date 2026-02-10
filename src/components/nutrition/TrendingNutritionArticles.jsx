import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { nutritionArticles } from './nutritionArticlesData';

export default function TrendingNutritionArticles() {
  const trendingArticles = nutritionArticles.filter(a => a.trending).slice(0, 4);

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0A1A2F]">Trending Nutrition Articles</h2>
      </div>
      
      <div className="space-y-3 mb-4">
        {trendingArticles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link to={createPageUrl(`NutritionArticle?id=${article.id}`)}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-3">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-20 h-20 object-cover flex-shrink-0 rounded-lg"
                />
                <div className="flex-1 p-3 min-w-0">
                  <h3 className="font-semibold text-sm text-[#0A1A2F] line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-[#0A1A2F]/60 mt-1 line-clamp-1">{article.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link to={createPageUrl('NutritionGuidance')}>
        <button className="text-sm font-semibold text-[#D9B878] hover:text-[#D9B878]/80 transition-colors">
          View More →
        </button>
      </Link>
    </div>
  );
}