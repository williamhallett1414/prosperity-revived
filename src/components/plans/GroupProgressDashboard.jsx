import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GroupProgressDashboard({ groupId, totalDays }) {
  const { data: members = [] } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: async () => {
      return await base44.entities.GroupReadingMember.filter({ group_id: groupId });
    }
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allMemberProgress', groupId],
    queryFn: async () => {
      const progressIds = members.map(m => m.progress_id).filter(Boolean);
      if (progressIds.length === 0) return [];
      
      const allProgress = await base44.entities.ReadingPlanProgress.list();
      return allProgress.filter(p => progressIds.includes(p.id));
    },
    enabled: members.length > 0
  });

  const getMemberProgress = (member) => {
    if (!member.progress_id) return null;
    return allProgress.find(p => p.id === member.progress_id);
  };

  const visibleMembers = members.filter(m => m.share_progress);
  const averageCompletion = visibleMembers.length > 0
    ? Math.round(
        visibleMembers.reduce((sum, member) => {
          const progress = getMemberProgress(member);
          return sum + ((progress?.completed_days?.length || 0) / totalDays) * 100;
        }, 0) / visibleMembers.length
      )
    : 0;

  return (
    <div className="space-y-4">
      {/* Overall Stats */}
      <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Group Progress</h3>
            <p className="text-xs text-gray-600">{members.length} members</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Average Completion</span>
            <span className="text-lg font-bold text-green-600">{averageCompletion}%</span>
          </div>
          <Progress value={averageCompletion} className="h-2" />
        </div>
      </Card>

      {/* Member List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Member Progress
        </h4>
        
        {members.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">No members yet</p>
        )}

        {members.map((member, idx) => {
          const progress = getMemberProgress(member);
          const completedCount = progress?.completed_days?.length || 0;
          const progressPercent = Math.round((completedCount / totalDays) * 100);

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
                      {member.user_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{member.user_name}</p>
                      {member.role === 'admin' && (
                        <span className="text-xs text-green-600">Admin</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {member.share_progress ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {completedCount}/{totalDays}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        <EyeOff className="w-4 h-4" />
                        <span className="text-xs">Private</span>
                      </div>
                    )}
                  </div>
                </div>

                {member.share_progress && progress && (
                  <div>
                    <Progress value={progressPercent} className="h-1.5" />
                    <p className="text-xs text-gray-500 mt-1">
                      {progressPercent}% complete • {progress.current_streak || 0} day streak
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}