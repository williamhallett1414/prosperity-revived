import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function ChallengeCard({ challenge, participation, onJoin, onClick, index = 0 }) {
  const isParticipating = !!participation;
  const progress = participation?.progress_percentage || 0;
  
  const daysRemaining = Math.ceil(
    (new Date(challenge.end_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const getTypeIcon = () => {
    switch (challenge.type) {
      case 'water_intake': return '💧';
      case 'steps': return '👟';
      case 'workouts': return '💪';
      case 'meditation': return '🧘';
      case 'reading': return '📖';
      case 'prayer': return '🙏';
      default: return '🎯';
    }
  };

  const getStatusColor = () => {
    if (challenge.status === 'completed') return 'bg-gray-100 text-gray-600';
    if (daysRemaining <= 3) return 'bg-red-100 text-red-600';
    return 'bg-green-100 text-green-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getTypeIcon()}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
            <p className="text-xs text-gray-500">{challenge.description}</p>
          </div>
        </div>
        <Badge className={getStatusColor()}>
          {challenge.status === 'completed' ? 'Ended' : `${daysRemaining}d left`}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Target className="w-4 h-4" />
            <span>Goal: {challenge.goal_value} {challenge.goal_unit}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{challenge.participant_count} joined</span>
          </div>
        </div>

        {isParticipating && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Your Progress</span>
              <span className="font-semibold text-[#8a6e1a]">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {participation.current_progress} / {challenge.goal_value} {challenge.goal_unit}
            </p>
          </div>
        )}

        {challenge.reward_points > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            <Trophy className="w-4 h-4" />
            <span>{challenge.reward_points} points reward</span>
          </div>
        )}

        {!isParticipating && challenge.status === 'active' && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
            className="w-full bg-[#c9a227] hover:bg-[#b89320]"
          >
            Join Challenge
          </Button>
        )}
      </div>
    </motion.div>
  );
}