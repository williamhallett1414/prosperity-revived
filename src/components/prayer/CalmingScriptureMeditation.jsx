import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, RotateCw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CalmingScriptureMeditation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('worship');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const backgrounds = [
  {
    id: 'worship',
    label: 'Soft Worship Pad',
    emoji: '🎹',
    url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3'
  },
  {
    id: 'piano',
    label: 'Gentle Piano',
    emoji: '🎼',
    url: 'https://www.bensound.com/bensound-music/bensound-pianomoment.mp3'
  },
  {
    id: 'nature',
    label: 'Nature Sounds',
    emoji: '🌿',
    url: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3'
  },
  {
    id: 'meditation',
    label: 'Scripture Meditation',
    emoji: '📖',
    url: 'https://www.bensound.com/bensound-music/bensound-inspire.mp3'
  }];


  const currentAudio = backgrounds.find((b) => b.id === selectedBackground);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = async () => {
    // Loop the audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Audio playback failed on loop:', error);
      }
    }
  };

  const handleBackgroundChange = async (newBackground) => {
    const wasPlaying = isPlaying;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    setSelectedBackground(newBackground);
    setCurrentTime(0);

    // Resume playing if it was playing before
    setTimeout(async () => {
      if (wasPlaying && audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Audio playback failed after background change:', error);
        }
      }
    }, 100);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6">
      <div className="bg-gradient-to-br from-[#AFC7E3]/20 to-[#D9B878]/20 rounded-2xl p-6 border border-[#AFC7E3]/30 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="w-5 h-5 text-[#AFC7E3]" />
          <h3 className="text-lg font-bold text-[#0A1A2F]">Calming Scripture Meditation</h3>
        </div>
        <p className="text-sm text-[#0A1A2F]/70 mb-4">Relax, breathe, and meditate on God's Word</p>

        {/* Background Selection */}
        <div className="mb-4">
          <label className="text-xs text-[#0A1A2F]/60 mb-2 block">Choose Background</label>
          <Select value={selectedBackground} onValueChange={handleBackgroundChange}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {backgrounds.map((bg) => (
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
              className="text-[#0A1A2F]">

              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              onClick={handlePlayPause}
              size="lg"
              className="bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] hover:from-[#AFC7E3]/90 hover:to-[#D9B878]/90 text-[#0A1A2F] rounded-full w-16 h-16">

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
              className="text-[#0A1A2F]">

              <RotateCw className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#AFC7E3] to-[#D9B878]"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />

          </div>

          <div className="flex justify-between text-xs text-[#0A1A2F]/60 mb-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {isPlaying && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[#0A1A2F]/60">

              🎵 Playing {currentAudio?.label}
            </motion.p>
          )}
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentAudio?.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          loop />


        <p className="text-xs text-[#0A1A2F]/50 text-center mt-4 italic">
          Close your eyes, breathe deeply, and let God's peace wash over you
        </p>
      </div>
      


































































































    </motion.div>);

}