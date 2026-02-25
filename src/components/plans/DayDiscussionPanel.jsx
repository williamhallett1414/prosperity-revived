import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Heart, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import moment from 'moment';

export default function DayDiscussionPanel({ groupId, dayNumber, currentUser }) {
  const [newPost, setNewPost] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ['planDiscussions', groupId, dayNumber],
    queryFn: async () => {
      return await base44.entities.PlanDiscussion.filter({
        group_id: groupId,
        day_number: dayNumber
      }, '-created_date');
    }
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['discussionReplies', groupId, dayNumber],
    queryFn: async () => {
      const discussionIds = discussions.map(d => d.id);
      if (discussionIds.length === 0) return [];
      
      const allReplies = await base44.entities.DiscussionReply.list();
      return allReplies.filter(r => discussionIds.includes(r.discussion_id));
    },
    enabled: discussions.length > 0
  });

  const createDiscussion = useMutation({
    mutationFn: async (content) => {
      return await base44.entities.PlanDiscussion.create({
        group_id: groupId,
        day_number: dayNumber,
        user_email: currentUser.email,
        user_name: currentUser.full_name,
        content
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planDiscussions'] });
      setNewPost('');
      toast.success('Posted!');
    }
  });

  const createReply = useMutation({
    mutationFn: async ({ discussionId, content }) => {
      const discussion = discussions.find(d => d.id === discussionId);
      await base44.entities.DiscussionReply.create({
        discussion_id: discussionId,
        user_email: currentUser.email,
        user_name: currentUser.full_name,
        content
      });
      
      // Update reply count
      await base44.entities.PlanDiscussion.update(discussionId, {
        reply_count: (discussion.reply_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planDiscussions'] });
      queryClient.invalidateQueries({ queryKey: ['discussionReplies'] });
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply posted!');
    }
  });

  const likeDiscussion = useMutation({
    mutationFn: async (discussionId) => {
      const discussion = discussions.find(d => d.id === discussionId);
      return await base44.entities.PlanDiscussion.update(discussionId, {
        likes: (discussion.likes || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planDiscussions'] });
    }
  });

  const getRepliesForDiscussion = (discussionId) => {
    return replies.filter(r => r.discussion_id === discussionId);
  };

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* New Post */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {currentUser?.full_name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <Textarea
              placeholder={`Share your thoughts on Day ${dayNumber}...`}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[80px] mb-2"
            />
            <Button
              onClick={() => createDiscussion.mutate(newPost)}
              disabled={!newPost.trim() || createDiscussion.isPending}
              className="bg-[#8fa68a] hover:bg-[#7a9179] text-white"
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </Card>

      {/* Discussions */}
      <div className="space-y-3">
        {discussions.length === 0 && (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No discussions yet for this day</p>
            <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
          </Card>
        )}

        {discussions.map((discussion) => {
          const discussionReplies = getRepliesForDiscussion(discussion.id);
          const isReplying = replyingTo === discussion.id;

          return (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {discussion.user_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-gray-900">{discussion.user_name}</p>
                      <span className="text-xs text-gray-500">
                        {moment(discussion.created_date).fromNow()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {discussion.content}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pl-11">
                  <button
                    onClick={() => likeDiscussion.mutate(discussion.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{discussion.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(isReplying ? null : discussion.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">{discussion.reply_count || 0}</span>
                  </button>
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                  {isReplying && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pl-11"
                    >
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 text-sm"
                          rows={2}
                        />
                        <Button
                          onClick={() => createReply.mutate({ 
                            discussionId: discussion.id, 
                            content: replyText 
                          })}
                          disabled={!replyText.trim() || createReply.isPending}
                          size="sm"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Replies */}
                {discussionReplies.length > 0 && (
                  <div className="mt-3 pl-11 space-y-2 border-l-2 border-gray-200 ml-4">
                    {discussionReplies.map((reply) => (
                      <div key={reply.id} className="pl-3">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {reply.user_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-xs text-gray-900">{reply.user_name}</p>
                              <span className="text-xs text-gray-400">
                                {moment(reply.created_date).fromNow()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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