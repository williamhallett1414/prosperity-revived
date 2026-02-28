import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

export default function ProfileGroupsTab({ user }) {
  const navigate = useNavigate();

  const { data: memberships = [] } = useQuery({
    queryKey: ['myMemberships', user?.email],
    queryFn: () => base44.entities.GroupMember.filter({ user_email: user.email }),
    enabled: !!user?.email
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['allGroups'],
    queryFn: () => base44.entities.StudyGroup.list('-created_date'),
    enabled: memberships.length > 0
  });

  const myGroupIds = memberships.map(m => m.group_id);
  const myGroups = groups.filter(g => myGroupIds.includes(g.id));

  if (myGroups.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-[#FD9C2D]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-[#FD9C2D]" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">No groups yet</h3>
        <p className="text-sm text-gray-500 mb-4">Join a group to grow together with others.</p>
        <Link to={createPageUrl('Groups')}>
          <Button className="bg-gradient-to-br from-[#c9a227] to-[#D9B878] hover:opacity-90 text-white gap-2">
            <Plus className="w-4 h-4" /> Browse Groups
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {myGroups.map((group, index) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => navigate(createPageUrl(`GroupDetail?id=${group.id}`))}
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <img
            src={group.cover_image || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=100'}
            alt={group.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{group.name}</h4>
            {group.description && (
              <p className="text-sm text-gray-500 truncate">{group.description}</p>
            )}
            <p className="text-xs text-[#FD9C2D] font-medium mt-1">{group.member_count || 1} members</p>
          </div>
        </motion.div>
      ))}
      <div className="pt-2 text-center">
        <Link to={createPageUrl('Groups')}>
          <Button variant="outline" size="sm" className="text-sm">Discover More Groups</Button>
        </Link>
      </div>
    </div>
  );
}