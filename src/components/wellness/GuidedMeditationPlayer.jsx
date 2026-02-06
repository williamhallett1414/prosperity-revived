import React, { useState } from 'react';
import MeditationSessionCard from './MeditationSessionCard';
import GuidedMeditationSession from './GuidedMeditationSession';

const GUIDED_MEDITATIONS = [
  { id: 1, title: '5-Min Breathing', duration: 5, type: 'breathing', description: 'Simple breath awareness exercise to calm your mind' },
  { id: 2, title: '10-Min Body Scan', duration: 10, type: 'body_scan', description: 'Release tension throughout your body systematically' },
  { id: 3, title: '15-Min Loving Kindness', duration: 15, type: 'loving_kindness', description: 'Cultivate compassion for yourself and others' },
  { id: 4, title: '20-Min Mindfulness', duration: 20, type: 'mindfulness', description: 'Present moment awareness and acceptance meditation' },
  { id: 5, title: '10-Min Sleep Prep', duration: 10, type: 'sleep', description: 'Relax and prepare your mind for restful sleep' },
  { id: 6, title: '7-Min Stress Relief', duration: 7, type: 'stress_relief', description: 'Quick and effective calm reset for busy days' },
];

export default function GuidedMeditationPlayer({ user, onSessionComplete }) {
  const [activeSession, setActiveSession] = useState(null);

  const handleBeginSession = (session) => {
    setActiveSession(session);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Guided Sessions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GUIDED_MEDITATIONS.map(session => (
          <motion.button
            key={session.id}
            onClick={() => handlePlaySession(session)}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-white text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{session.title}</h4>
              <Play className="w-4 h-4" />
            </div>
            <p className="text-sm text-white/80 mb-2">{session.description}</p>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <Clock className="w-3 h-3" />
              {session.duration} min
            </div>
          </motion.button>
        ))}
      </div>

      {/* Mood Selector Modal */}
      {showMoodSelector && selectedSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              {selectedSession.title}
            </h3>

            {!isPlaying ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  How are you feeling before meditation?
                </p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {['stressed', 'anxious', 'calm', 'energetic', 'sad', 'neutral'].map(mood => (
                    <button
                      key={mood}
                      onClick={() => setMoodBefore(mood)}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        moodBefore === mood
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => setIsPlaying(true)}
                  className="w-full bg-purple-500 hover:bg-purple-600 mb-2"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Session ({selectedSession.duration}min)
                </Button>
                <Button
                  onClick={() => setShowMoodSelector(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-8 text-white text-center mb-6">
                  <Volume2 className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                  <p className="text-sm mb-2">Now Playing</p>
                  <p className="font-semibold">{selectedSession.title}</p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  How do you feel after meditation?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['stressed', 'anxious', 'calm', 'energetic', 'sad', 'neutral'].map(mood => (
                    <button
                      key={mood}
                      onClick={() => handleCompleteSession(mood)}
                      className="p-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-[#1a1a2e] text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white transition-colors"
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}