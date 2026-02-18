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
      


































































































      


































































































    </motion.div>);

}