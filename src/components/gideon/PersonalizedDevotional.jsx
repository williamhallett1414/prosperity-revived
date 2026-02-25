import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Book, ChevronDown, ChevronUp, RefreshCw, Heart, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PersonalizedDevotional() {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  // Fetch today's personalized devotional
  const { data: todayReflection, isLoading } = useQuery({
    queryKey: ['todayPersonalizedDevotional'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const reflections = await base44.entities.GideonDailyReflection.filter(
        { date: today },
        '-created_date',
        1
      );
      return reflections[0] || null;
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Generate new personalized devotional
  const generateDevotional = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('generatePersonalizedDevotional', {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayPersonalizedDevotional'] });
      toast.success('Your personalized devotional is ready! 🙏');
    },
    onError: () => {
      toast.error('Failed to generate devotional. Please try again.');
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading your personalized devotional...</p>
        </div>
      </Card>
    );
  }

  if (!todayReflection) {
    return (
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white">Personalized Daily Devotional</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tailored to your spiritual journey</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Gideon can create a devotional specifically for you based on your recent journal entries, 
          prayers, reading progress, and current spiritual state.
        </p>
        
        <Button
          onClick={() => generateDevotional.mutate()}
          disabled={generateDevotional.isPending}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
        >
          {generateDevotional.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate My Devotional
            </>
          )}
        </Button>
      </Card>
    );
  }

  // Parse full content if available
  let fullContent = null;
  try {
    fullContent = todayReflection.full_content ? JSON.parse(todayReflection.full_content) : null;
  } catch (e) {
    console.error('Failed to parse devotional content:', e);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Your Personal Devotional</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{todayReflection.spiritual_theme}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateDevotional.mutate()}
              disabled={generateDevotional.isPending}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${generateDevotional.isPending ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Opening Message */}
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              {fullContent?.opening_message || todayReflection.context_note}
            </p>
          </div>

          {/* Scripture */}
          <div className="flex items-start gap-3 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
            <Book className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                {fullContent?.scripture_passage || todayReflection.scripture_suggestion}
              </p>
              {fullContent?.scripture_text && (
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "{fullContent.scripture_text}"
                </p>
              )}
            </div>
          </div>

          {/* Main Reflection Question (always visible) */}
          <div className="bg-indigo-100/50 dark:bg-indigo-900/30 rounded-lg p-4 mb-4">
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {todayReflection.reflection_question}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Read Full Devotional <ChevronDown className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && fullContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 mt-4"
              >
                {/* Meditation */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Meditation
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {fullContent.meditation}
                  </p>
                </div>

                {/* Practical Step */}
                {fullContent.practical_step && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-green-600" />
                      Today's Action
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {fullContent.practical_step}
                    </p>
                  </div>
                )}

                {/* Additional Reflection Questions */}
                {fullContent.reflection_questions && fullContent.reflection_questions.length > 1 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Deeper Reflection
                    </h4>
                    <ul className="space-y-2">
                      {fullContent.reflection_questions.slice(1).map((question, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-indigo-300 dark:border-indigo-600">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prayer */}
                {fullContent.personalized_prayer && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Prayer</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      {fullContent.personalized_prayer}
                    </p>
                  </div>
                )}

                {/* Closing Encouragement */}
                {fullContent.closing_encouragement && (
                  <div className="border-t border-indigo-200 dark:border-indigo-700 pt-4">
                    <p className="text-sm text-center text-indigo-700 dark:text-indigo-300 font-medium">
                      {fullContent.closing_encouragement}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}