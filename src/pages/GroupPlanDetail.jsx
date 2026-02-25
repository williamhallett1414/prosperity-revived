import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Users, Share2, Settings, UserPlus, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import GroupProgressDashboard from '@/components/plans/GroupProgressDashboard';
import DayDiscussionPanel from '@/components/plans/DayDiscussionPanel';
import { toast } from 'sonner';

export default function GroupPlanDetail() {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get('id');
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showInvite, setShowInvite] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: group, isLoading } = useQuery({
    queryKey: ['groupReadingPlan', groupId],
    queryFn: async () => {
      const groups = await base44.entities.GroupReadingPlan.list();
      return groups.find(g => g.id === groupId);
    }
  });

  const { data: membership } = useQuery({
    queryKey: ['groupMembership', groupId, user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const members = await base44.entities.GroupReadingMember.filter({
        group_id: groupId,
        user_email: user.email
      });
      return members[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: myProgress } = useQuery({
    queryKey: ['myGroupProgress', membership?.progress_id],
    queryFn: async () => {
      if (!membership?.progress_id) return null;
      const allProgress = await base44.entities.ReadingPlanProgress.list();
      return allProgress.find(p => p.id === membership.progress_id);
    },
    enabled: !!membership?.progress_id
  });

  const updateMemberSettings = useMutation({
    mutationFn: async (settings) => {
      return await base44.entities.GroupReadingMember.update(membership.id, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupMembership'] });
      toast.success('Settings updated');
    }
  });

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}${createPageUrl('Plans')}?join=${groupId}&code=${group.invite_code}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied!');
  };

  if (isLoading || !group) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const days = Array.from({ length: group.total_days }, (_, i) => i + 1);
  const completedDays = myProgress?.completed_days || [];

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6">
        <button
          onClick={() => window.history.back()}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">{group.group_name}</h1>
        </div>
        <p className="text-white/90 mb-1">{group.plan_name}</p>
        <p className="text-sm text-white/80">{group.description}</p>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setShowInvite(!showInvite)}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
          {group.invite_code && (
            <Button
              onClick={copyInviteLink}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          )}
        </div>

        {showInvite && group.invite_code && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg"
          >
            <p className="text-xs text-white/80 mb-1">Invite Code:</p>
            <code className="text-sm font-mono bg-white/20 px-3 py-1 rounded">
              {group.invite_code}
            </code>
          </motion.div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Privacy Setting */}
        {membership && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 mb-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Share my progress with group</Label>
                <p className="text-xs text-gray-500">Let others see your completion status</p>
              </div>
              <Switch
                checked={membership.share_progress}
                onCheckedChange={(checked) => 
                  updateMemberSettings.mutate({ share_progress: checked })
                }
              />
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="discuss">Discuss</TabsTrigger>
          </TabsList>

          {/* Group Progress Tab */}
          <TabsContent value="progress">
            <GroupProgressDashboard groupId={groupId} totalDays={group.total_days} />
          </TabsContent>

          {/* Daily Readings Tab */}
          <TabsContent value="daily">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Daily Readings</h3>
              {days.map(day => {
                const isCompleted = completedDays.includes(day);
                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${
                      isCompleted 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : day}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Day {day}</h4>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(day);
                        }}
                      >
                        View Discussion
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discuss">
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Select Day</Label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white"
              >
                {days.map(day => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
            </div>

            {user && (
              <DayDiscussionPanel 
                groupId={groupId} 
                dayNumber={selectedDay} 
                currentUser={user}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}