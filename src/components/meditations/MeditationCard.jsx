import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MeditationCard({ meditation, onPlay, onBookmark, isBookmarked, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        {meditation.image_url && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={meditation.image_url} alt={meditation.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#0A1A2F] truncate">{meditation.title}</h3>
          <p className="text-xs text-[#0A1A2F]/60 line-clamp-2 mb-2">{meditation.description}</p>
          
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-[#D9B878]" />
            <span className="text-xs text-[#0A1A2F]/60">{meditation.duration_minutes}m</span>
            <span className="text-xs bg-[#E6EBEF] text-[#0A1A2F]/70 px-2 py-0.5 rounded-full">
              {meditation.category}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 ml-2">
          <Button
            size="sm"
            onClick={() => onPlay(meditation)}
            disabled={!meditation.tts_audio_url}
            className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] h-8 w-8 p-0"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onBookmark(meditation)}
            className={`h-8 w-8 p-0 ${isBookmarked ? 'text-[#D9B878]' : 'text-[#0A1A2F]/40'}`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}