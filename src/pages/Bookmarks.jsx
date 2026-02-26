import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Filter, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BookmarkCard from '@/components/bookmarks/BookmarkCard';

export default function Bookmarks() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list('-created_date')
  });

  const deleteBookmark = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['bookmarks'])
  });

  const handleOpenVerse = (bookmark) => {
    window.location.href = createPageUrl(`Bible?book=${bookmark.book}&chapter=${bookmark.chapter}`);
  };

  const filteredBookmarks = filter === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.highlight_color === filter);

  const colors = ['all', 'yellow', 'green', 'blue', 'pink', 'purple'];

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to={createPageUrl('Home')}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a1a2e] hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Saved Verses</h1>
            </div>
            <p className="text-gray-500 ml-[52px]">{bookmarks.length} verses saved</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {colors.map(color => (
                <DropdownMenuItem
                  key={color}
                  onClick={() => setFilter(color)}
                  className="flex items-center gap-2 capitalize"
                >
                  {color !== 'all' && (
                    <div className={`w-3 h-3 rounded-full bg-${color}-400`} />
                  )}
                  {color}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Bookmarks List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#c9a227]/10 flex items-center justify-center">
              <Bookmark className="w-10 h-10 text-[#c9a227]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">No saved verses yet</h3>
            <p className="text-gray-500 mb-4">
              Tap on any verse while reading to highlight and save it
            </p>
            <Button
              onClick={() => window.location.href = createPageUrl('Bible')}
              className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
            >
              Start Reading
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredBookmarks.map((bookmark, index) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={deleteBookmark.mutate}
                  onOpen={handleOpenVerse}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}