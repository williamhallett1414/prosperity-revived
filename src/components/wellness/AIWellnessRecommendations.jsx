import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Dumbbell, UtensilsCrossed, BookOpen, PenLine, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categoryIcons = {
  meditation: Sparkles,
  workout: Dumbbell,
  nutrition: UtensilsCrossed,
  selfcare: Brain,
  scripture: BookOpen,
  journaling: PenLine,
  stress: Heart
};

export default function AIWellnessRecommendations({ user, signupAnswers }) {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const prompt = `Based on this user profile:
${signupAnswers ? JSON.stringify(signupAnswers) : 'Default user'}

Generate personalized wellness recommendations for TODAY across these categories:
1. MEDITATION - Specific 5-10min guided meditation (include duration, focus area, benefit)
2. WORKOUT - Specific workout recommendation (intensity, duration, type)
3. NUTRITION - Specific meal or hydration tip
4. SELF-CARE - Specific activity recommendation (5-15 min)
5. SCRIPTURE & SPIRITUAL - Specific verse theme or prayer focus
6. JOURNALING - Specific journaling prompt or theme
7. STRESS & MOOD - Specific technique or activity

For each, include:
- A 1-2 sentence personalized recommendation
- Why it's good for them today
- Time commitment

Format as JSON with keys: meditation, workout, nutrition, selfcare, scripture, journaling, stress`;

        const response = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              meditation: { type: 'object', properties: { recommendation: { type: 'string' }, why: { type: 'string' }, time: { type: 'string' } } },
              workout: { type: 'object', properties: { recommendation: { type: 'string' }, why: { type: 'string' }, time: { type: 'string' } } },
              nutrition: { type: 'object', properties: { recommendation: { type: 'string' }, why: { type: 'string' }, time: { type: 'string' } } },
              selfcare: { type: 'object', properties: { recommendation: { type: 'string' }, why: { type: 'string' }, time: { type: 'string' } } },
              scripture: { type: 'object', properties: { recommendation: { type: 'string' }, why: { type: 'string' }, time: { type: 'string' } } },
              journaling: { type: 'object', properties: { recommendation: { type: 'string' }, why: { type: 'string' }, time: { type: 'string' } } },
              stress: { type: 'object', properties: { recommendation: { type: 'string' }, why: { type: 'string' }, time: { type: 'string' } } }
            }
          }
        });

        setRecommendations(response.data || {});
      } catch (error) {
        console.error('Failed to generate recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [user, signupAnswers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#D9B878]" />
      </div>
    );
  }

  const recommendationItems = [
    { key: 'meditation', title: 'Meditation', icon: 'meditation', link: createPageUrl('DiscoverMeditations') },
    { key: 'workout', title: 'Workout', icon: 'workout', link: `${createPageUrl('Wellness')}?tab=workouts` },
    { key: 'nutrition', title: 'Nutrition', icon: 'nutrition', link: `${createPageUrl('Wellness')}?tab=nutrition` },
    { key: 'selfcare', title: 'Self-Care', icon: 'selfcare', link: createPageUrl('SelfCare') },
    { key: 'scripture', title: 'Scripture', icon: 'scripture', link: createPageUrl('Bible') },
    { key: 'journaling', title: 'Journaling', icon: 'journaling', link: `${createPageUrl('Wellness')}?tab=selfcare` },
    { key: 'stress', title: 'Stress & Mood', icon: 'stress', link: createPageUrl('SelfCare') }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-[#0A1A2F]">Today's AI Recommendations</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {recommendationItems.map((item, index) => {
          const rec = recommendations[item.key];
          if (!rec) return null;
          
          const Icon = categoryIcons[item.icon];
          
          return (
            <Link key={item.key} to={item.link}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-[#D9B878]/20 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-[#D9B878]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0A1A2F] text-sm">{item.title}</h3>
                    <p className="text-xs text-[#0A1A2F]/70 line-clamp-2 mt-1">{rec.recommendation}</p>
                    <p className="text-xs text-[#D9B878] mt-1 font-medium">{rec.time}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}