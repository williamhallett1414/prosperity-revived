import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, RotateCw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CalmingScriptureMeditation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('worship');
  const audioRef = useRef(null);

  const backgrounds = [
    { id: 'worship', label: 'Soft Worship Pad', emoji: '🎹' },
    { id: 'piano', label: 'Gentle Piano', emoji: '🎼' },
    { id: 'nature', label: 'Nature Sounds', emoji: '🌿' },
    { id: 'meditation', label: 'Scripture Meditation', emoji: '📖' }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    // 15 second rewind logic
  };

  const handleForward = () => {
    // 15 second forward logic
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      <div className="bg-gradient-to-br from-[#AFC7E3]/20 to-[#D9B878]/20 rounded-2xl p-6 border border-[#AFC7E3]/30 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="w-5 h-5 text-[#AFC7E3]" />
          <h3 className="text-lg font-bold text-[#0A1A2F]">Calming Scripture Meditation</h3>
        </div>
        <p className="text-sm text-[#0A1A2F]/70 mb-4">Relax, breathe, and meditate on God's Word</p>

        {/* Background Selection */}
        <div className="mb-4">
          <label className="text-xs text-[#0A1A2F]/60 mb-2 block">Choose Background</label>
          <Select value={selectedBackground} onValueChange={setSelectedBackground}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {backgrounds.map(bg => (
                <SelectItem key={bg.id} value={bg.id}>
                  <span className="flex items-center gap-2">
                    <span>{bg.emoji}</span>
                    <span>{bg.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audio Player Controls */}
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              onClick={handleRewind}
              size="sm"
              variant="ghost"
              className="text-[#0A1A2F]"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              onClick={handlePlayPause}
              size="lg"
              className="bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] hover:from-[#AFC7E3]/90 hover:to-[#D9B878]/90 text-[#0A1A2F] rounded-full w-16 h-16"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>

            <Button
              onClick={handleForward}
              size="sm"
              variant="ghost"
              className="text-[#0A1A2F]"
            >
              <RotateCw className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#AFC7E3] to-[#D9B878]"
              initial={{ width: '0%' }}
              animate={{ width: isPlaying ? '100%' : '0%' }}
              transition={{ duration: 300, ease: 'linear' }}
            />
          </div>

          {isPlaying && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[#0A1A2F]/60 mt-4"
            >
              🎵 Playing {backgrounds.find(b => b.id === selectedBackground)?.label}
            </motion.p>
          )}
        </div>

        <p className="text-xs text-[#0A1A2F]/50 text-center mt-4 italic">
          Close your eyes, breathe deeply, and let God's peace wash over you
        </p>
      </div>
    </motion.div>
  );
}