import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { nutritionArticles } from '@/components/nutrition/nutritionArticlesData';

export default function NutritionArticle() {
  const [searchParams] = useSearchParams();
  const articleId = parseInt(searchParams.get('id'));
  
  const article = nutritionArticles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 text-center">
          <p className="text-[#0A1A2F]/60 dark:text-white/60">Article not found</p>
          <Link to={createPageUrl('NutritionGuidance')} className="mt-4">
            <Button>Back to Guidance</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = nutritionArticles
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('NutritionGuidance')}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F] dark:text-white line-clamp-1">{article.title}</h1>
            <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60">Nutrition Guide</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-[#0A1A2F] dark:text-white mb-3">{article.title}</h1>
          <p className="text-lg text-[#0A1A2F]/70 dark:text-white/70">{article.description}</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 mb-8 shadow-sm dark:shadow-none"
        >
          <div className="text-[#0A1A2F] dark:text-white leading-relaxed whitespace-pre-wrap text-sm">
            {article.content}
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-4">Related Articles</h3>
            <div className="space-y-3">
              {relatedArticles.map((related, idx) => (
                <Link key={related.id} to={createPageUrl(`NutritionArticle?id=${related.id}`)}>
                  <div className="bg-white dark:bg-white/5 rounded-lg shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow p-4 cursor-pointer">
                    <h4 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">{related.title}</h4>
                    <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60 mt-1">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}