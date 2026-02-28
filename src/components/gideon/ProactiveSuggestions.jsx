import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Book, Heart, MessageCircle, ThumbsUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProactiveSuggestions() {
  const queryClient = useQueryClient();

  const { data: suggestions = [] } = useQuery({
    queryKey: ['proactiveSuggestions'],
    queryFn: async () => {
      return await base44.entities.GideonProactiveSuggestion.filter(
        { read: false },
        '-created_date',
        3
      );
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.GideonProactiveSuggestion.update(id, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['proactiveSuggestions']);
    }
  });

  const markAsHelpful = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.GideonProactiveSuggestion.update(id, { helpful: true, read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['proactiveSuggestions']);
    }
  });

  if (suggestions.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'scripture': return Book;
      case 'reflection': return MessageCircle;
      case 'encouragement': return Heart;
      case 'prayer_prompt': return Sparkles;
      default: return Sparkles;
    }
  };

  const getGradient = (type) => {
    switch (type) {
      case 'scripture': return 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20';
      case 'reflection': return 'from-[#FAD98D]/10 to-[#FAD98D]/10 dark:from-[#FAD98D]/5 dark:to-[#FAD98D]/5';
      case 'encouragement': return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
      case 'prayer_prompt': return 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20';
      default: return 'from-[#FAD98D]/10 to-[#FAD98D]/10 dark:from-[#FAD98D]/5 dark:to-[#FAD98D]/5';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {suggestions.map((suggestion, index) => {
        const Icon = getIcon(suggestion.suggestion_type);
        const gradient = getGradient(suggestion.suggestion_type);

        return (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${gradient} border-[#D9B878]/40 dark:border-[#D9B878]/20`}>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/50 dark:bg-black/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#8a6e1a] dark:text-[#c9a227]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {suggestion.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {suggestion.based_on_context}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {suggestion.content}
                </p>

                {suggestion.scripture_reference && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-white/50 dark:bg-black/20 rounded-lg">
                    <Book className="w-4 h-4 text-[#8a6e1a] dark:text-[#c9a227]" />
                    <span className="text-sm font-medium text-[#3C4E53] dark:text-[#D9B878]">
                      {suggestion.scripture_reference}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead.mutate(suggestion.id)}
                    className="flex-1"
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => markAsHelpful.mutate(suggestion.id)}
                    className="flex-1 bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Helpful
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}