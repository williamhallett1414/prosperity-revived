import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Dumbbell, 
  ChefHat, 
  BookOpen,
  ThumbsUp,
  Sparkles,
  MessageCircle,
  Send,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

const chatbotIcons = {
  Hannah: Heart,
  CoachDavid: Dumbbell,
  ChefDaniel: ChefHat,
  Gideon: BookOpen,
  general: Sparkles
};

const chatbotColors = {
  Hannah: 'from-purple-500 to-pink-500',
  CoachDavid: 'from-blue-500 to-cyan-500',
  ChefDaniel: 'from-orange-500 to-red-500',
  Gideon: 'from-green-500 to-emerald-500',
  general: 'from-gray-500 to-gray-600'
};

const encouragementTypes = [
  { type: 'heart', label: '❤️ Love', color: 'text-red-500' },
  { type: 'praise', label: '👏 Praise', color: 'text-yellow-500' },
  { type: 'strength', label: '💪 Strength', color: 'text-blue-500' },
  { type: 'pray', label: '🙏 Pray', color: 'text-purple-500' },
  { type: 'celebrate', label: '🎉 Celebrate', color: 'text-green-500' }
];

export default function CommunityFeed({ user }) {
  const [expandedShare, setExpandedShare] = useState(null);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: shares = [], isLoading } = useQuery({
    queryKey: ['communityShares'],
    queryFn: async () => {
      const allShares = await base44.entities.CommunityShare.filter({
        visibility: 'public'
      }, '-created_date', 50);
      return allShares;
    }
  });

  const { data: myEncouragements = [] } = useQuery({
    queryKey: ['myEncouragements', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Encouragement.filter({
        created_by: user.email
      });
    },
    enabled: !!user?.email
  });

  const addEncouragementMutation = useMutation({
    mutationFn: async ({ shareId, type, message }) => {
      await base44.entities.Encouragement.create({
        share_id: shareId,
        encouragement_type: type,
        message: message || null,
        is_anonymous: false,
        user_display_name: user.full_name
      });

      // Update encouragement count
      const share = shares.find(s => s.id === shareId);
      if (share) {
        await base44.entities.CommunityShare.update(shareId, {
          encouragement_count: (share.encouragement_count || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityShares'] });
      queryClient.invalidateQueries({ queryKey: ['myEncouragements'] });
      queryClient.invalidateQueries({ queryKey: ['shareEncouragements'] });
      setEncouragementMessage('');
    }
  });

  const { data: encouragementsForShare } = useQuery({
    queryKey: ['shareEncouragements', expandedShare],
    queryFn: async () => {
      if (!expandedShare) return [];
      return await base44.entities.Encouragement.filter({
        share_id: expandedShare
      }, '-created_date', 20);
    },
    enabled: !!expandedShare
  });

  const hasEncouraged = (shareId, type) => {
    return myEncouragements.some(e => e.share_id === shareId && e.encouragement_type === type);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shares.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No milestones yet</h3>
            <p className="text-gray-600">Be the first to share your progress with the community!</p>
          </CardContent>
        </Card>
      ) : (
        shares.map((share) => {
          const Icon = chatbotIcons[share.chatbot_source] || Sparkles;
          const isExpanded = expandedShare === share.id;

          return (
            <motion.div
              key={share.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${chatbotColors[share.chatbot_source]} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {share.is_anonymous ? 'Anonymous' : share.user_display_name}
                          </p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {share.share_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(new Date(share.created_date), 'MMM d, yyyy \'at\' h:mm a')} • via {share.chatbot_source}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{share.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{share.content}</p>
                  </div>

                  {/* Encouragement Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {encouragementTypes.map((enc) => {
                      const encouraged = hasEncouraged(share.id, enc.type);
                      return (
                        <Button
                          key={enc.type}
                          onClick={() => !encouraged && addEncouragementMutation.mutate({ 
                            shareId: share.id, 
                            type: enc.type 
                          })}
                          disabled={encouraged || addEncouragementMutation.isPending}
                          variant={encouraged ? "default" : "outline"}
                          size="sm"
                          className={encouraged ? enc.color : ''}
                        >
                          {enc.label}
                        </Button>
                      );
                    })}
                    <Button
                      onClick={() => setExpandedShare(isExpanded ? null : share.id)}
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {share.encouragement_count || 0}
                    </Button>
                  </div>

                  {/* Expanded Encouragements */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-3 border-t"
                      >
                        {/* Encouragement Form */}
                        <div className="flex gap-2">
                          <Textarea
                            value={encouragementMessage}
                            onChange={(e) => setEncouragementMessage(e.target.value)}
                            placeholder="Write an encouraging message..."
                            className="flex-1 min-h-[80px]"
                          />
                          <Button
                            onClick={() => addEncouragementMutation.mutate({
                              shareId: share.id,
                              type: 'heart',
                              message: encouragementMessage
                            })}
                            disabled={!encouragementMessage.trim() || addEncouragementMutation.isPending}
                            size="icon"
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Encouragement List */}
                        <div className="space-y-2">
                          {encouragementsForShare?.map((enc) => (
                            <div
                              key={enc.id}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg">
                                  {encouragementTypes.find(t => t.type === enc.encouragement_type)?.label.split(' ')[0]}
                                </span>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm text-gray-900">
                                    {enc.is_anonymous ? 'Anonymous' : enc.user_display_name}
                                  </p>
                                  {enc.message && (
                                    <p className="text-sm text-gray-700 mt-1">{enc.message}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    {format(new Date(enc.created_date), 'MMM d \'at\' h:mm a')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );
}