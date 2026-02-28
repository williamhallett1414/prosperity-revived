import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Dumbbell, 
  ChefHat, 
  BookOpen,
  Sparkles,
  Users,
  TrendingUp,
  Plus,
  MessageCircle
} from 'lucide-react';
import CommunityFeed from '@/components/community/CommunityFeed';
import GroupChallenges from '@/components/community/GroupChallenges';
import ShareMilestoneModal from '@/components/community/ShareMilestoneModal';

const chatbotColors = {
  Hannah: 'from-[#c9a227] to-[#D9B878]',
  CoachDavid: 'from-[#AFC7E3] to-[#7ab3d4]',
  ChefDaniel: 'from-orange-500 to-red-500',
  Gideon: 'from-green-500 to-emerald-500'
};

export default function Community() {
  const [showShareModal, setShowShareModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: stats } = useQuery({
    queryKey: ['communityStats'],
    queryFn: async () => {
      const [shares, challenges, participants] = await Promise.all([
        base44.entities.CommunityShare.filter({ visibility: 'public' }),
        base44.entities.GroupChallenge.filter({ is_active: true }),
        base44.entities.ChallengeParticipation.list()
      ]);

      return {
        totalShares: shares.length,
        activeChallenges: challenges.length,
        totalParticipants: new Set(participants.map(p => p.user_email)).size
      };
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F6FA] to-[#EDF2F7] pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Community</h1>
                <p className="text-gray-600">Grow together, support each other</p>
              </div>
            </div>
            <Button
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:opacity-90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Milestone
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#8a6e1a]">{stats?.totalShares || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Milestones Shared</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#3C4E53]">{stats?.activeChallenges || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Active Challenges</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats?.totalParticipants || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Community Members</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Community Feed
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Group Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <CommunityFeed user={user} />
          </TabsContent>

          <TabsContent value="challenges">
            <GroupChallenges user={user} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareMilestoneModal
          user={user}
          onClose={() => setShowShareModal(false)}
          onSuccess={() => {
            setShowShareModal(false);
            queryClient.invalidateQueries({ queryKey: ['communityShares'] });
          }}
        />
      )}
    </div>
  );
}