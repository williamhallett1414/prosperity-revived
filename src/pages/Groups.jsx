import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const navigate = useNavigate();
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'other',
    is_private: false
  });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('my');

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
      setNewGroup({ name: '', description: '', category: 'other', is_private: false });
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
    let filtered = groupList;
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(g => g.category === categoryFilter);
    }
    
    if (search) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Home')}
              className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 shadow-sm flex items-center justify-center text-[#0A1A2F] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F]">Study Groups</h1>
          </div>
          <p className="text-[#0A1A2F]/60 ml-[52px]">Join or create groups to study together</p>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-6">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-[#E6EBEF] border-[#E6EBEF] rounded-xl h-12">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bible_study">📖 Bible Study</SelectItem>
              <SelectItem value="workout">💪 Workout</SelectItem>
              <SelectItem value="cooking">🍳 Cooking</SelectItem>
              <SelectItem value="prayer">🙏 Prayer</SelectItem>
              <SelectItem value="wellness">🧘 Wellness</SelectItem>
              <SelectItem value="youth">👥 Youth</SelectItem>
              <SelectItem value="parents">👨‍👩‍👧‍👦 Parents</SelectItem>
              <SelectItem value="marriage">💑 Marriage</SelectItem>
              <SelectItem value="other">💬 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search & Create */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
            <Input
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#E6EBEF] border-[#E6EBEF] rounded-xl h-12"
            />
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] h-12 px-6 shadow-md"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my" className="mb-6">
          <TabsList className="grid grid-cols-2 bg-[#E6EBEF] p-1 rounded-xl">
            <TabsTrigger value="my" className="data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">My Groups</TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-6">
            {myGroups.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#FD9C2D]/10 to-[#FAD98D]/20 border border-[#FD9C2D]/30 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-bold text-[#0A1A2F] text-lg mb-2">Grow together</h3>
                <p className="text-sm text-[#0A1A2F]/70 mb-4">
                  Join a group to share your journey, stay accountable, and encourage others walking the same path.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      const discoverTab = document.querySelector('[value="discover"]');
                      if (discoverTab) discoverTab.click();
                    }}
                    className="bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] text-[#3C4E53] font-semibold w-full"
                  >
                    Browse Groups
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreate(true)}
                    className="w-full"
                  >
                    Create Your Own Group
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGroups(myGroups).map((group, index) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onClick={() => navigate(createPageUrl(`GroupDetail?id=${group.id}`))}
                    index={index}
                    isMember={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            {filteredGroups(publicGroups).length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#0A1A2F]/60 mb-2">No public groups found</p>
                {search && (
                  <p className="text-sm text-[#0A1A2F]/40">Try a different search term</p>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGroups(publicGroups).map((group, index) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onClick={() => navigate(createPageUrl(`GroupDetail?id=${group.id}`))}
                    index={index}
                    isMember={false}
                  />
                ))}
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

            <div>
              <Label>Category</Label>
              <Select 
                value={newGroup.category} 
                onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bible_study">📖 Bible Study</SelectItem>
                  <SelectItem value="workout">💪 Workout</SelectItem>
                  <SelectItem value="cooking">🍳 Cooking</SelectItem>
                  <SelectItem value="prayer">🙏 Prayer</SelectItem>
                  <SelectItem value="wellness">🧘 Wellness</SelectItem>
                  <SelectItem value="youth">👥 Youth</SelectItem>
                  <SelectItem value="parents">👨‍👩‍👧‍👦 Parents</SelectItem>
                  <SelectItem value="marriage">💑 Marriage</SelectItem>
                  <SelectItem value="other">💬 Other</SelectItem>
                </SelectContent>
              </Select>
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
                className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
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