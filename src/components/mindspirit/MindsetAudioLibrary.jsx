import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const audioTracks = [
  {
    id: 'morning',
    title: 'Morning Reset',
    duration: '5:00',
    description: 'Start your day with clarity and purpose',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    gradient: 'from-yellow-100 to-orange-100'
  },
  {
    id: 'evening',
    title: 'Evening Peace',
    duration: '7:00',
    description: 'Release the day and find rest',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    gradient: 'from-blue-100 to-purple-100'
  },
  {
    id: 'stress',
    title: 'Letting Go of Stress',
    duration: '6:00',
    description: 'Calm your mind and body',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    gradient: 'from-green-100 to-teal-100'
  },
  {
    id: 'scripture',
    title: 'Scripture Meditation',
    duration: '8:00',
    description: 'Meditate on God\'s Word',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    gradient: 'from-[#FAD98D]/20 to-[#FFF8E7]'
  }
];

export default function MindsetAudioLibrary() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const handleSkip = (direction) => {
    if (!audioRef.current) return;
    const skipAmount = direction === 'forward' ? 15 : -15;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + skipAmount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Volume2 className="w-6 h-6 text-[#D9B878]" />
        <h3 className="text-lg font-bold text-[#0A1A2F]">Mindset Audio Library</h3>
      </div>

      <div className="space-y-3">
        {audioTracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-gradient-to-r ${track.gradient} rounded-xl p-4 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-[#0A1A2F] mb-1">{track.title}</h4>
                <p className="text-xs text-[#0A1A2F]/70 mb-1">{track.description}</p>
                <p className="text-xs text-[#0A1A2F]/50">{track.duration}</p>
              </div>
              <div className="flex items-center gap-2">
                {currentTrack?.id === track.id && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSkip('back')}
                      className="h-8 w-8 p-0"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  onClick={() => handlePlayPause(track)}
                  className="h-10 w-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F] p-0"
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
                {currentTrack?.id === track.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSkip('forward')}
                    className="h-8 w-8 p-0"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}
    </motion.div>
  );
}