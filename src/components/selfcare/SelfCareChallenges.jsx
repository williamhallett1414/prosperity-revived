import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Book, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SelfCareChallenges({ challenges = [], participations = [] }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const queryClient = useQueryClient();

  const completeDay = useMutation({
    mutationFn: async ({ participationId, dayNumber, completedDays }) => {
      if (!completedDays.includes(dayNumber)) {
        const newCompletedDays = [...completedDays, dayNumber];
        return await base44.entities.ChallengeParticipant.update(participationId, {
          completed_days: newCompletedDays
        });
      }
    },
    onSuccess: () => {
      toast.success('Day completed! 🎉');
      queryClient.invalidateQueries(['challengeParticipants']);
    }
  });

  const startChallenge = useMutation({
    mutationFn: async (challengeId) => {
      try {
        return await base44.entities.ChallengeParticipant.create({
          challenge_id: challengeId,
          status: 'active',
          completed_days: []
        });
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Challenge started!');
      queryClient.invalidateQueries(['challengeParticipants']);
    }
  });

  const defaultChallenges = [
    {
      id: 'gratitude-7',
      title: '7-Day Gratitude Challenge',
      description: 'Cultivate thankfulness through daily practice',
      icon: Trophy,
      duration: 7,
      gradient: 'from-[#D9B878] to-[#AFC7E3]',
      tasks: [
        { day: 1, title: 'Write 3 things you\'re grateful for', content: 'List three blessings from today, no matter how small.' },
        { day: 2, title: 'Send someone encouragement', content: 'Text, call, or message someone to tell them you appreciate them.' },
        { day: 3, title: 'Reflect on answered prayers', content: 'Think of 2-3 prayers God has answered in your life.' },
        { day: 4, title: 'Gratitude for challenges', content: 'Write about a difficulty that helped you grow.' },
        { day: 5, title: 'Thank God in prayer', content: 'Spend 5 minutes in prayer focusing only on thanksgiving.' },
        { day: 6, title: 'Gratitude walk', content: 'Take a 10-minute walk and notice things to be grateful for.' },
        { day: 7, title: 'Share your gratitude', content: 'Post or share one thing you\'re grateful for with others.' }
      ]
    },
    {
      id: 'stress-reset-5',
      title: '5-Day Stress Reset',
      description: 'Find peace through spiritual practices',
      icon: Target,
      duration: 5,
      gradient: 'from-[#AFC7E3] to-[#AFC7E3]',
      tasks: [
        { day: 1, title: '2-minute breathing exercise', content: 'Breathe in for 4 counts, hold 4, exhale 6. Repeat 10 times.' },
        { day: 2, title: 'Scripture meditation', content: 'Read Philippians 4:6-7 slowly 3 times. Meditate on it.' },
        { day: 3, title: '5-minute gentle walk', content: 'Walk outside and pray, giving your worries to God.' },
        { day: 4, title: 'Digital detox hour', content: 'Spend 1 hour without screens. Read, pray, or rest.' },
        { day: 5, title: 'Surrender prayer', content: 'Write down your worries, pray over them, then tear up the paper.' }
      ]
    },
    {
      id: 'scripture-memory',
      title: 'Scripture Memory Challenge',
      description: 'Hide God\'s Word in your heart',
      icon: Book,
      duration: 7,
      gradient: 'from-[#0A1A2F] to-[#AFC7E3]',
      tasks: [
        { day: 1, title: 'Philippians 4:13', content: '"I can do all things through Christ who strengthens me."' },
        { day: 2, title: 'Psalm 46:10', content: '"Be still, and know that I am God."' },
        { day: 3, title: 'Proverbs 3:5-6', content: '"Trust in the Lord with all your heart..."' },
        { day: 4, title: 'Jeremiah 29:11', content: '"For I know the plans I have for you..."' },
        { day: 5, title: 'Isaiah 40:31', content: '"But those who hope in the Lord will renew their strength..."' },
        { day: 6, title: 'Romans 8:28', content: '"And we know that in all things God works for the good..."' },
        { day: 7, title: 'Joshua 1:9', content: '"Be strong and courageous. Do not be afraid..."' }
      ]
    }
  ];

  const displayChallenges = challenges.length > 0 ? challenges : defaultChallenges;

  const getProgress = (challengeId) => {
    const participation = participations.find(p => p.challenge_id === challengeId);
    if (!participation) return { percentage: 0, completed: 0, total: 0, participation: null };
    
    const challenge = displayChallenges.find(c => c.id === challengeId);
    const totalDays = challenge?.duration || challenge?.tasks?.length || 7;
    const completedDays = participation.completed_days?.length || 0;
    
    return {
      percentage: (completedDays / totalDays) * 100,
      completed: completedDays,
      total: totalDays,
      participation
    };
  };

  const handleDayComplete = (challenge, dayNumber) => {
    const progress = getProgress(challenge.id);
    if (progress.participation) {
      completeDay.mutate({
        participationId: progress.participation.id,
        dayNumber,
        completedDays: progress.participation.completed_days || []
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Self-Care Challenges</h2>
        <div className="space-y-3">
          {displayChallenges.map((challenge, index) => {
            const Icon = challenge.icon;
            const progress = getProgress(challenge.id);
            const isParticipating = !!progress.participation;

            return (
              <motion.button
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => setSelectedChallenge(challenge)}
                className={`w-full bg-gradient-to-r ${challenge.gradient} rounded-2xl p-5 text-[#0A1A2F] shadow-lg text-left`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-[#0A1A2F]/10 rounded-full p-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{challenge.title}</h3>
                    <p className="text-sm opacity-90">{challenge.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-70" />
                </div>

                {isParticipating ? (
                  <>
                    <Progress value={progress.percentage} className="mb-2 bg-[#0A1A2F]/20" />
                    <div className="flex items-center justify-between text-sm">
                      <span>{progress.completed} / {progress.total} days completed</span>
                      {progress.percentage === 100 && (
                        <span className="bg-[#D9B878] px-2 py-1 rounded-full text-xs">
                          🏆 Completed!
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm opacity-80 mt-2">{challenge.duration} days • Tap to start</p>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Challenge Detail Modal */}
      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {React.createElement(selectedChallenge.icon, { className: "w-5 h-5" })}
                  {selectedChallenge.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-gray-600">{selectedChallenge.description}</p>

                <div className="space-y-2">
                  {selectedChallenge.tasks?.map((task, index) => {
                    const progress = getProgress(selectedChallenge.id);
                    const isCompleted = progress.participation?.completed_days?.includes(task.day);
                    const isParticipating = !!progress.participation;

                    return (
                      <div
                        key={task.day}
                        className={`border rounded-lg p-4 ${
                          isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {isCompleted ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-white text-sm font-bold">{task.day}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                              {task.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{task.content}</p>
                            {isParticipating && !isCompleted && (
                              <Button
                                size="sm"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDayComplete(selectedChallenge, task.day);
                                }}
                              >
                                Complete Day {task.day}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!getProgress(selectedChallenge.id).participation && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      startChallenge.mutate(selectedChallenge.id);
                      setSelectedChallenge(null);
                    }}
                  >
                    Start Challenge
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}