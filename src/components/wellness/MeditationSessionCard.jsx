import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { queueTTSJob } from '@/functions/queueTTSJob';
import { runTTSWorker } from '@/functions/runTTSWorker';
import { base44 } from '@/api/base44Client';

export default function MeditationSessionCard({ session, onBegin, index }) {
  const [generating, setGenerating] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-[#2d2d4a] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
      onClick={() => onBegin(session)}
    >
      {/* Image */}
      {(session.image_url || session._original?.image_url) && (
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={session.image_url || session._original?.image_url}
            alt={session.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute top-3 right-3 inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-gray-900">
            {session.duration}m
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {session.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {session.description}
        </p>

        {/* Session type and duration */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="capitalize">{session.type?.replace('_', ' ') || 'Meditation'}</span>
        </div>

        {/* Begin button */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            let updatedSession = session;

            // If no audio exists, queue and poll for TTS job completion
            if (!session.tts_audio_url && session.id) {
              setGenerating(true);
              try {
                // 1. Queue the TTS job
                await queueTTSJob({ meditationId: session.id });
                
                // 2. Poll for job completion
                const updated = await runTTSWorker({ meditationId: session.id });
                
                if (updated) {
                  updatedSession = { ...session, ...updated };
                }
              } catch (error) {
                console.error('Failed to process TTS:', error);
              } finally {
                setGenerating(false);
              }
            }

            onBegin(updatedSession);
          }}
          disabled={generating}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group/btn disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Audio...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              Begin Session
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}