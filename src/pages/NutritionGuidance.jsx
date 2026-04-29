import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { nutritionArticles } from '@/components/nutrition/nutritionArticlesData';

export default function NutritionGuidance() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = useMemo(() => {
    return nutritionArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Wellness?tab=nutrition')}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 flex items-center justify-center transition-colors">

            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F] dark:text-white dark:text-white">Nutrition Guidance</h1>
            <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60">Healthy eating made simple</p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      






      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 relative">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10" />

        </motion.div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ?
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12">

            <p className="text-[#0A1A2F]/60 dark:text-white/60">No articles found</p>
          </motion.div> :

        <div className="grid grid-cols-1 gap-4">
            {filteredArticles.map((article, idx) =>
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}>

                <Link to={createPageUrl(`NutritionArticle?id=${article.id}`)}>
                  <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow p-4 cursor-pointer">
                    <h3 className="font-semibold text-[#0A1A2F] dark:text-white mb-2">{article.title}</h3>
                    <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60">{article.description}</p>
                  </div>
                </Link>
              </motion.div>
          )}
          </div>
        }
      </div>
    </div>);

}