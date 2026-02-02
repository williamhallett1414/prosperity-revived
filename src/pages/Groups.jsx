import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import GroupCard from '@/components/groups/GroupCard';

export default function Groups() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    is_private: false
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list('-created_date')
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['memberships'],
    queryFn: () => base44.entities.GroupMember.list(),
    enabled: !!user
  });

  const createGroup = useMutation({
    mutationFn: async (data) => {
      const group = await base44.entities.StudyGroup.create(data);
      // Add creator as admin member
      await base44.entities.GroupMember.create({
        group_id: group.id,
        user_email: user.email,
        role: 'admin'
      });
      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['memberships']);
      setShowCreate(false);
      setNewGroup({ name: '', description: '', is_private: false });
    }
  });

  const handleCreateGroup = () => {
    if (newGroup.name.trim()) {
      createGroup.mutate(newGroup);
    }
  };

  const myGroupIds = memberships.map(m => m.group_id);
  const myGroups = groups.filter(g => myGroupIds.includes(g.id));
  const publicGroups = groups.filter(g => !g.is_private && !myGroupIds.includes(g.id));

  const filteredGroups = (groupList) => {
    if (!search) return groupList;
    return groupList.filter(g =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Study Groups</h1>
          <p className="text-gray-500">Join or create groups to study together</p>
        </motion.div>

        {/* Search & Create */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white rounded-xl h-12"
            />
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-[#1a1a2e] hover:bg-[#2d2d4a] h-12 px-6"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my" className="mb-6">
          <TabsList className="grid grid-cols-2 bg-white p-1">
            <TabsTrigger value="my">My Groups</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-6">
            {myGroups.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">You haven't joined any groups yet</p>
                <Button
                  onClick={() => setShowCreate(true)}
                  className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
                >
                  Create Your First Group
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGroups(myGroups).map((group, index) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onClick={() => window.location.href = createPageUrl(`GroupDetail?id=${group.id}`)}
                    index={index}
                    isMember={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredGroups(publicGroups).map((group, index) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onClick={() => window.location.href = createPageUrl(`GroupDetail?id=${group.id}`)}
                  index={index}
                  isMember={false}
                />
              ))}
            </div>
            {filteredGroups(publicGroups).length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No public groups found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Group Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Study Group</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Group Name</Label>
              <Input
                placeholder="e.g., Daily Bible Study"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="What is this group about?"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                className="mt-2 min-h-[80px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Private Group</Label>
              <Switch
                checked={newGroup.is_private}
                onCheckedChange={(checked) => setNewGroup({ ...newGroup, is_private: checked })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!newGroup.name.trim()}
                className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
              >
                Create Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}