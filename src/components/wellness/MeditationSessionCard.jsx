import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MeditationSessionCard({ session, onBegin, index }) {
  const gradients = [
    'from-purple-600 to-pink-600',
    'from-blue-600 to-cyan-600',
    'from-emerald-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-indigo-600 to-purple-600',
    'from-rose-600 to-pink-600'
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all`}
      onClick={() => onBegin(session)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full blur-2xl" />
        <div className="absolute bottom-2 left-2 w-24 h-24 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header with icon and duration */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
              {session.duration}m
            </span>
          </div>
        </div>

        {/* Title and description */}
        <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
          {session.title}
        </h3>
        <p className="text-white/90 text-sm mb-4 leading-relaxed">
          {session.description}
        </p>

        {/* Session type tag */}
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-white/70" />
          <span className="text-xs text-white/70 capitalize">
            {session.type.replace('_', ' ')} meditation
          </span>
        </div>

        {/* Begin button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onBegin(session);
          }}
          className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 group/btn"
        >
          <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Begin Session
        </Button>
      </div>
    </motion.div>
  );
}