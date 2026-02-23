import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Dumbbell, 
  ChefHat, 
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import ChallengeDetailModal from '@/components/community/ChallengeDetailModal';

const chatbotIcons = {
  Hannah: Heart,
  CoachDavid: Dumbbell,
  ChefDaniel: ChefHat,
  Gideon: BookOpen
};

const chatbotColors = {
  Hannah: 'from-purple-500 to-pink-500',
  CoachDavid: 'from-blue-500 to-cyan-500',
  ChefDaniel: 'from-orange-500 to-red-500',
  Gideon: 'from-green-500 to-emerald-500'
};

export default function GroupChallenges({ user }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['activeChallenges'],
    queryFn: async () => {
      return await base44.entities.GroupChallenge.filter({
        is_active: true
      }, '-created_date', 20);
    }
  });

  const { data: myParticipations = [] } = useQuery({
    queryKey: ['myParticipations', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ChallengeParticipation.filter({
        user_email: user.email
      });
    },
    enabled: !!user?.email
  });

  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId) => {
      const challenge = challenges.find(c => c.id === challengeId);
      await base44.entities.ChallengeParticipation.create({
        challenge_id: challengeId,
        user_email: user.email,
        current_day: 1,
        completed_days: [],
        is_anonymous: false,
        reflection_entries: []
      });

      // Update participant count
      await base44.entities.GroupChallenge.update(challengeId, {
        participant_count: (challenge.participant_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
    }
  });

  const isParticipating = (challengeId) => {
    return myParticipations.some(p => p.challenge_id === challengeId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {challenges.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No active challenges</h3>
              <p className="text-gray-600">Check back soon for new group challenges!</p>
            </CardContent>
          </Card>
        ) : (
          challenges.map((challenge) => {
            const Icon = chatbotIcons[challenge.chatbot_facilitator];
            const participating = isParticipating(challenge.id);
            const participation = myParticipations.find(p => p.challenge_id === challenge.id);
            const progressPercent = participation 
              ? ((participation.completed_days?.length || 0) / challenge.duration_days) * 100
              : 0;
            
            const daysRemaining = challenge.end_date 
              ? differenceInDays(new Date(challenge.end_date), new Date())
              : challenge.duration_days;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${chatbotColors[challenge.chatbot_facilitator]} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{challenge.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Facilitated by {challenge.chatbot_facilitator}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">
                        {challenge.challenge_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {challenge.participant_count || 0} participants
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {challenge.duration_days} days
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{challenge.description}</p>

                    {participating && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Your Progress</span>
                          <span className="text-sm text-gray-600">
                            {participation.completed_days?.length || 0} / {challenge.duration_days} days
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{daysRemaining} days remaining</span>
                      </div>
                      {participating && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Joined</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setSelectedChallenge(challenge)}
                        variant="outline"
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      {!participating && (
                        <Button
                          onClick={() => joinChallengeMutation.mutate(challenge.id)}
                          disabled={joinChallengeMutation.isPending}
                          className={`flex-1 bg-gradient-to-r ${chatbotColors[challenge.chatbot_facilitator]} hover:opacity-90 text-white`}
                        >
                          {joinChallengeMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Join Challenge'
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          user={user}
          participation={myParticipations.find(p => p.challenge_id === selectedChallenge.id)}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </>
  );
}