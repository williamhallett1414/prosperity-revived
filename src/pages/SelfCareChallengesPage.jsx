import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import WellnessTabBar from '@/components/wellness/WellnessTabBar';

export default function SelfCareChallengesPage() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      try {
        return await base44.entities.Challenge.filter({});
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants'],
    queryFn: async () => {
      try {
        return await base44.entities.ChallengeParticipant.filter({ user_email: user?.email });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <WellnessTabBar activeTab="mind" />

      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-bold text-[#0A1A2F]">Self-Care Challenges</h1>
          <p className="text-xs text-[#0A1A2F]/60">Build healthy habits</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <SelfCareChallenges challenges={challenges} participations={challengeParticipants} />
      </div>
    </div>
  );
}