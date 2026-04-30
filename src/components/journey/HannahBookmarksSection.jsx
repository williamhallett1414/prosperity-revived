import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const typeColors = {
  exercise: 'bg-[#AFC7E3]/25 text-[#3C4E53]',
  book_summary: 'bg-[#c9a227]/20 text-[#C9A227]',
  insight: 'bg-green-100 dark:bg-green-900/25 text-green-800'
};

const typeLabels = {
  exercise: 'Exercise',
  book_summary: 'Book Insight',
  insight: 'Insight'
};

export default function HannahBookmarksSection({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['hannahBookmarks', userEmail],
    queryFn: () => base44.entities.HannahBookmark.filter({ user_email: userEmail }, '-created_date'),
    enabled: !!userEmail
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.HannahBookmark.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hannahBookmarks', userEmail] });
      toast.success('Bookmark removed');
    }
  });

  if (isLoading) return null;
  if (bookmarks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#AFC7E3]/20 to-[#3C4E53]/10 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Hannah's Saved Modules</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-300">Bookmarked exercises & insights from your coaching modules</p>
            </div>
            <Badge variant="secondary" className="ml-auto text-base px-3 py-1">{bookmarks.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:bg-white/5 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={`text-xs border-0 ${typeColors[bookmark.item_type]}`}>
                      {typeLabels[bookmark.item_type]}
                    </Badge>
                    <span className="text-xs text-gray-400 dark:text-gray-300 font-medium">{bookmark.module_name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-300 flex items-center gap-1 ml-auto">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(bookmark.created_date), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{bookmark.item_title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">{bookmark.item_content}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-gray-300 dark:text-gray-400 dark:text-gray-300 hover:text-red-400 h-7 w-7"
                  onClick={() => deleteMutation.mutate(bookmark.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}