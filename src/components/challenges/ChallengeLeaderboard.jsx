import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';

export default function ChallengeLeaderboard({ participants, challenge }) {
  const sortedParticipants = [...participants].sort((a, b) => b.current_progress - a.current_progress);
  
  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-gray-400">#{index + 1}</span>;
  };

  const getProgressBar = (participant) => {
    const percentage = (participant.current_progress / challenge.goal_value) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="space-y-3">
      {sortedParticipants.map((participant, index) => (
        <motion.div
          key={participant.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-3 p-3 rounded-xl ${
            index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center w-10">
            {getRankIcon(index)}
          </div>

          <Avatar className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
            {participant.user_name?.charAt(0)?.toUpperCase() || '?'}
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{participant.user_name}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${getProgressBar(participant)}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {participant.current_progress} / {challenge.goal_value}
              </span>
            </div>
          </div>

          {participant.completed && (
            <div className="text-green-600 font-semibold text-sm">
              ✓ Done
            </div>
          )}
        </motion.div>
      ))}

      {sortedParticipants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No participants yet. Be the first to join!</p>
        </div>
      )}
    </div>
  );
}