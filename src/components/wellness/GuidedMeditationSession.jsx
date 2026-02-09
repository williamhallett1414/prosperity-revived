import React, { useEffect, useRef, useState } from "react";
import { X, Rewind, FastForward, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

export default function GuidedMeditationSession({ session, onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioUrl = session?.tts_audio_url;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    audio.src = audioUrl;
    audio.load();

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl, session]);

  const togglePlay = async () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio play error:", err);
      }
    }
  };

  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime += 15;
  };

  const skipBackward = () => {
    if (audioRef.current) audioRef.current.currentTime -= 15;
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col"
    >
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold text-white">{session?.title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-300 mb-6 max-w-md">{session?.description}</p>

        {!audioUrl && (
          <p className="text-red-400 text-sm mb-4">
            Audio is still being generated. Please check back shortly.
          </p>
        )}

        {audioUrl && (
          <>
            {/* Hidden but functional audio element */}
            <audio ref={audioRef} />

            <div className="w-full max-w-xs mb-6">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-600"
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      duration > 0
                        ? `${(currentTime / duration) * 100}%`
                        : "0%",
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            </>
          )}

        <div className="flex items-center gap-6">
          <button
            onClick={skipBackward}
            disabled={!audioUrl}
            className="p-2 hover:bg-white/10 rounded-full transition disabled:opacity-50"
          >
            <Rewind className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={togglePlay}
            className="bg-purple-600 hover:bg-purple-700 p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={!audioUrl}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>

          <button
            onClick={skipForward}
            disabled={!audioUrl}
            className="p-2 hover:bg-white/10 rounded-full transition disabled:opacity-50"
          >
            <FastForward className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}