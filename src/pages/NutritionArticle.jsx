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
      <div className="min-h-screen bg-[#F2F6FA] pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-[#0A1A2F]/60">Article not found</p>
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
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('NutritionGuidance')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F] line-clamp-1">{article.title}</h1>
            <p className="text-xs text-[#0A1A2F]/60">Nutrition Guide</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl overflow-hidden shadow-md"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        </motion.div>

        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-[#0A1A2F] mb-3">{article.title}</h1>
          <p className="text-lg text-[#0A1A2F]/70">{article.description}</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-8 shadow-sm"
        >
          <p className="text-[#0A1A2F] leading-relaxed">{article.content}</p>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">Related Articles</h3>
            <div className="space-y-3">
              {relatedArticles.map((related, idx) => (
                <Link key={related.id} to={createPageUrl(`NutritionArticle?id=${related.id}`)}>
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer">
                    <h4 className="font-semibold text-[#0A1A2F]">{related.title}</h4>
                    <p className="text-sm text-[#0A1A2F]/60 mt-1">{related.description}</p>
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