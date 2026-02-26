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
      </Card>);

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
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">

          {generateDevotional.isPending ?
          <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </> :

          <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate My Devotional
            </>
          }
        </Button>
      </Card>);

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
      className="mb-6">

      <Card className="overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
        











































































































































      </Card>
    </motion.div>);

}