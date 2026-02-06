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
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-6">Guided Sessions</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GUIDED_MEDITATIONS.map((session, index) => (
            <MeditationSessionCard
              key={session.id}
              session={session}
              onBegin={handleBeginSession}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Active meditation session */}
      {activeSession && (
        <GuidedMeditationSession
          session={activeSession}
          user={user}
          onComplete={() => {
            onSessionComplete?.();
            setActiveSession(null);
          }}
          onClose={() => setActiveSession(null)}
        />
      )}
    </>
  );
}