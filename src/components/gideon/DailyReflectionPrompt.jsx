import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Book } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DailyReflectionPrompt() {
  const [response, setResponse] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: todayReflection } = useQuery({
    queryKey: ['todayReflection'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const reflections = await base44.entities.GideonDailyReflection.filter(
        { date: today, completed: false },
        '-created_date',
        1
      );
      return reflections[0] || null;
    }
  });

  const submitResponse = useMutation({
    mutationFn: async (responseText) => {
      return await base44.entities.GideonDailyReflection.update(todayReflection.id, {
        response: responseText,
        completed: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todayReflection']);
      toast.success('Reflection saved! 🙏');
      setResponse('');
      setIsExpanded(false);
    }
  });

  if (!todayReflection) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6">

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 overflow-hidden">
          

















































































        </Card>
      </motion.div>
    </AnimatePresence>);

}