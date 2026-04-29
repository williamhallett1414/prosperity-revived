import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
      <Card className="p-6 bg-gradient-to-br from-[#F2F6FA] to-[#FAD98D]/10 dark:from-indigo-900/20 dark:to-[#0A1A2F]/20 border-[#AFC7E3]/40 dark:border-indigo-700">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#3C4E53]" />
          <p className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">Loading your personalized devotional...</p>
        </div>
      </Card>);

  }

  if (!todayReflection) {
    return null;



































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

      













































































































































    </motion.div>);

}