import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Share2, BookOpen, Trophy } from 'lucide-react';
import { toast } from 'sonner';

import CommunityFeed from '@/components/community/CommunityFeed';
import GroupChallenges from '@/components/community/GroupChallenges';
import ShareMilestoneModal from '@/components/community/ShareMilestoneModal';
import AIBlogWriter from '@/components/community/AIBlogWriter';
import ModerationPanel from '@/components/community/ModerationPanel';
import BlogFeed from '@/components/community/BlogFeed';

export default function Community() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBlogWriter, setShowBlogWriter] = useState(false);
  const queryClient = useQueryClient();

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // Set active tab from URL if specified
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['feed', 'challenges', 'blog', 'groups'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 border-4 border-[#FD9C2D]/30 border-t-[#FD9C2D] rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="sticky top-16 bg-white dark:bg-[#0A1A2F] border-b border-gray-200 dark:border-gray-700 z-30 -mx-4 px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0A1A2F] dark:text-white">Community</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect, share, and grow together</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowBlogWriter(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Write
              </Button>
              <Button
                onClick={() => setShowShareModal(true)}
                size="sm"
                className="bg-[#FD9C2D] hover:bg-[#e88d1f] text-white gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              {user?.role === 'admin' && <TabsTrigger value="moderation">Moderation</TabsTrigger>}
            </TabsList>
          </Tabs>
        </div>

        {/* Content Sections */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'feed' && (
              <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CommunityFeed />
              </motion.div>
            )}

            {activeTab === 'challenges' && (
              <motion.div key="challenges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GroupChallenges />
              </motion.div>
            )}

            {activeTab === 'blog' && (
              <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BlogFeed />
              </motion.div>
            )}

            {activeTab === 'moderation' && user?.role === 'admin' && (
              <motion.div key="moderation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ModerationPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
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

      {showBlogWriter && (
        <AIBlogWriter
          user={user}
          onClose={() => setShowBlogWriter(false)}
          onPublish={() => {
            setShowBlogWriter(false);
            queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
            setActiveTab('blog');
          }}
        />
      )}
    </div>
  );
}