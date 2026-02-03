import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Crown, UserMinus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function MemberManagement({ groupId, isAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: async () => {
      const all = await base44.entities.GroupMember.list();
      return all.filter(m => m.group_id === groupId);
    },
    enabled: !!groupId
  });

  const removeMember = useMutation({
    mutationFn: async (memberId) => {
      await base44.entities.GroupMember.delete(memberId);
      const group = await base44.entities.StudyGroup.list();
      const currentGroup = group.find(g => g.id === groupId);
      if (currentGroup) {
        await base44.entities.StudyGroup.update(groupId, {
          member_count: Math.max((currentGroup.member_count || 1) - 1, 0)
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groupMembers']);
      queryClient.invalidateQueries(['group']);
    }
  });

  const promoteToAdmin = useMutation({
    mutationFn: (memberId) => base44.entities.GroupMember.update(memberId, { role: 'admin' }),
    onSuccess: () => queryClient.invalidateQueries(['groupMembers'])
  });

  const handleInvite = async () => {
    if (inviteEmail.trim()) {
      // Send email invitation
      await base44.integrations.Core.SendEmail({
        to: inviteEmail,
        subject: 'You\'ve been invited to join a Bible Study Group',
        body: `You've been invited to join a study group! Click here to join: ${window.location.origin}`
      });
      setInviteEmail('');
      alert('Invitation sent!');
    }
  };

  if (!isAdmin) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
        className="w-full"
      >
        <Users className="w-4 h-4 mr-2" />
        View Members ({members.length})
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="w-full bg-white border border-gray-200 text-[#1a1a2e] hover:bg-gray-50"
      >
        <Users className="w-4 h-4 mr-2" />
        Manage Members ({members.length})
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
          </DialogHeader>

          {isAdmin && (
            <div className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#c9a227] flex items-center justify-center text-white font-semibold">
                    {member.user_email?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e]">
                      {member.user_email}
                    </p>
                    {member.role === 'admin' && (
                      <Badge className="bg-[#c9a227] text-white text-xs mt-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>

                {isAdmin && member.role !== 'admin' && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => promoteToAdmin.mutate(member.id)}
                      title="Promote to admin"
                    >
                      <Crown className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember.mutate(member.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove member"
                    >
                      <UserMinus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}