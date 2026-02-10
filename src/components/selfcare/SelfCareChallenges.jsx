import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function SelfCareChallenges({ challenges = [], participations = [] }) {
  const defaultChallenges = [
    {
      id: 'gratitude-7',
      title: '7-Day Gratitude Challenge',
      description: 'Write down 3 things you\'re grateful for each day',
      icon: Trophy,
      duration: 7,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'stress-reset-5',
      title: '5-Day Stress Reset',
      description: 'Daily meditation and breathing exercises',
      icon: Target,
      duration: 5,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'scripture-memory',
      title: 'Scripture Memory Challenge',
      description: 'Memorize one verse each week',
      icon: Book,
      duration: 30,
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  const displayChallenges = challenges.length > 0 ? challenges : defaultChallenges;

  const getProgress = (challengeId) => {
    const participation = participations.find(p => p.challenge_id === challengeId);
    if (!participation) return 0;
    
    const challenge = displayChallenges.find(c => c.id === challengeId);
    const totalDays = challenge?.duration || 7;
    const completedDays = participation.completed_days?.length || 0;
    
    return (completedDays / totalDays) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold text-white mb-4">Self-Care Challenges</h2>
      <div className="space-y-3">
        {displayChallenges.map((challenge, index) => {
          const Icon = challenge.icon;
          const progress = getProgress(challenge.id);
          const isParticipating = participations.some(p => p.challenge_id === challenge.id);

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`bg-gradient-to-r ${challenge.gradient} rounded-2xl p-4 text-white shadow-lg`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{challenge.title}</h3>
                  <p className="text-sm opacity-90">{challenge.description}</p>
                </div>
              </div>

              {isParticipating ? (
                <>
                  <Progress value={progress} className="mb-2 bg-white/20" />
                  <div className="flex items-center justify-between text-sm">
                    <span>{Math.round(progress)}% complete</span>
                    {progress === 100 && (
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        🏆 Completed!
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-white/20 hover:bg-white/30 text-white mt-2"
                >
                  Start Challenge
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}