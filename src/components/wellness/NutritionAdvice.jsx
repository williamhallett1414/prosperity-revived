import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Droplets, Heart, Activity, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import CommentSection from './CommentSection';

export default function NutritionAdvice() {
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `As a nutrition expert, provide clear, evidence-based advice for this question: "${question}". 
        Keep the response practical, safe, and encourage consulting healthcare professionals for personalized plans.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            tips: { type: 'array', items: { type: 'string' } },
            foods_to_include: { type: 'array', items: { type: 'string' } },
            caution: { type: 'string' }
          }
        }
      });
      setAdvice(response);
    } catch (error) {
      console.error('Failed to get advice', error);
    }
    setLoading(false);
  };

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
      <div className="grid grid-cols-2 gap-3 mb-6">
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

      {/* AI Nutrition Advisor */}
      <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
        <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">Ask a Nutrition Question</h3>
        
        <Textarea
          placeholder="E.g., What foods help with energy? Best pre-workout snacks?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mb-3 min-h-[80px]"
        />
        
        <Button
          onClick={handleGetAdvice}
          disabled={!question.trim() || loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting Advice...
            </>
          ) : (
            'Get Personalized Advice'
          )}
        </Button>

        {advice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-4"
          >
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{advice.summary}</p>
            </div>

            {advice.tips && advice.tips.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-2 text-sm">Tips:</h4>
                <ul className="space-y-1">
                  {advice.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">✓ {tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {advice.foods_to_include && advice.foods_to_include.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-2 text-sm">Foods to Include:</h4>
                <div className="flex flex-wrap gap-2">
                  {advice.foods_to_include.map((food, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full text-xs">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {advice.caution && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">{advice.caution}</p>
              </div>
            )}
          </motion.div>
        )}

        <CommentSection contentId="nutrition_guide" contentType="nutrition_plan" />
      </div>
    </div>
  );
}