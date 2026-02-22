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
        className="mb-6"
      >
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Daily Reflection from Gideon</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{todayReflection.spiritual_theme}</p>
                </div>
              </div>
              {!isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-purple-700 dark:text-purple-300 italic">
                {todayReflection.context_note}
              </p>

              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white mb-3">
                  {todayReflection.reflection_question}
                </p>

                {todayReflection.scripture_suggestion && (
                  <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <Book className="w-4 h-4" />
                    <span className="font-medium">{todayReflection.scripture_suggestion}</span>
                  </div>
                )}
              </div>

              {!isExpanded ? (
                <Button
                  onClick={() => setIsExpanded(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Reflect & Respond
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <Textarea
                    placeholder="Take a moment to reflect... What comes to mind?"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsExpanded(false);
                        setResponse('');
                      }}
                      className="flex-1"
                    >
                      Later
                    </Button>
                    <Button
                      onClick={() => submitResponse.mutate(response)}
                      disabled={!response.trim() || submitResponse.isPending}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Save Reflection
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}