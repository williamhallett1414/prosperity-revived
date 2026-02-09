import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { UserPlus, Sparkles, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function AIFriendSuggestions({ user, limit = 5, showHeader = true }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list()
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: () => base44.entities.Friend.list(),
    enabled: !!user
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date', 100)
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['memberships'],
    queryFn: () => base44.entities.GroupMember.list()
  });

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: () => base44.entities.Meditation.list()
  });

  const sendRequest = useMutation({
    mutationFn: async (friendEmail) => {
      const friendUser = allUsers.find(u => u.email === friendEmail);
      return base44.entities.Friend.create({
        user_email: user.email,
        friend_email: friendEmail,
        user_name: user.full_name || user.email,
        friend_name: friendUser?.full_name || friendEmail,
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['friends']);
      toast.success('Friend request sent!');
    }
  });

  useEffect(() => {
    if (!user || allUsers.length === 0) return;

    const analyzeAndSuggest = async () => {
      setIsAnalyzing(true);
      
      try {
        // Get user's interests
        const myPosts = posts.filter(p => p.created_by === user.email);
        const myGroups = memberships.filter(m => m.user_email === user.email).map(m => m.group_id);
        const myMeditations = meditations.filter(m => m.created_by === user.email);
        
        // Get existing friends and pending requests
        const existingConnections = friends
          .filter(f => f.user_email === user.email || f.friend_email === user.email)
          .map(f => f.user_email === user.email ? f.friend_email : f.user_email);

        // Filter out self and existing connections
        const potentialFriends = allUsers.filter(u => 
          u.email !== user.email && !existingConnections.includes(u.email)
        );

        if (potentialFriends.length === 0) {
          setSuggestions([]);
          setIsAnalyzing(false);
          return;
        }

        // Build context for AI analysis
        const userContext = `
User interests based on activity:
- Posted ${myPosts.length} times with topics: ${myPosts.map(p => p.topic || 'general').join(', ')}
- Member of ${myGroups.length} groups
- Completed ${myMeditations.length} meditation sessions (types: ${myMeditations.map(m => m.type).join(', ')})
- Spiritual goal: ${user.spiritual_goal || 'Not set'}
- Bio: ${user.bio || 'No bio'}

Analyze these potential friends and suggest the top ${limit} most compatible based on shared interests:
${potentialFriends.slice(0, 20).map((u, i) => {
  const theirPosts = posts.filter(p => p.created_by === u.email);
  const theirGroups = memberships.filter(m => m.user_email === u.email).map(m => m.group_id);
  const sharedGroups = theirGroups.filter(g => myGroups.includes(g)).length;
  
  return `${i + 1}. ${u.full_name || u.email} - Posts: ${theirPosts.length}, Shared groups: ${sharedGroups}, Bio: ${u.bio || 'None'}`;
}).join('\n')}

Return ONLY a JSON array with top ${limit} email addresses in order of compatibility, like: ["email1@example.com", "email2@example.com"]
        `.trim();

        const result = await base44.integrations.Core.InvokeLLM({
          prompt: userContext,
          response_json_schema: {
            type: "object",
            properties: {
              suggested_emails: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        });

        const suggestedEmails = result.suggested_emails || [];
        const suggestedUsers = suggestedEmails
          .map(email => potentialFriends.find(u => u.email === email))
          .filter(Boolean)
          .slice(0, limit);

        setSuggestions(suggestedUsers);
      } catch (error) {
        console.error('AI suggestion failed:', error);
        // Fallback: suggest users with most shared groups
        const potentialFriends = allUsers.filter(u => 
          u.email !== user.email && 
          !friends.some(f => 
            (f.user_email === user.email && f.friend_email === u.email) ||
            (f.friend_email === user.email && f.user_email === u.email)
          )
        );

        const scored = potentialFriends.map(u => {
          const theirGroups = memberships.filter(m => m.user_email === u.email).map(m => m.group_id);
          const myGroups = memberships.filter(m => m.user_email === user.email).map(m => m.group_id);
          const sharedGroups = theirGroups.filter(g => myGroups.includes(g)).length;
          return { user: u, score: sharedGroups };
        });

        scored.sort((a, b) => b.score - a.score);
        setSuggestions(scored.slice(0, limit).map(s => s.user));
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeAndSuggest();
  }, [user, allUsers, posts, memberships, meditations, friends, limit]);

  if (isAnalyzing) {
    return (
      <div className="bg-white dark:bg-[#2d2d4a] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Finding friends for you...</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm">
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">People You May Know</h3>
        </div>
      )}
      
      <div className="space-y-3">
        {suggestions.map((suggestedUser, index) => {
          const alreadySent = friends.some(f => 
            f.user_email === user.email && f.friend_email === suggestedUser.email && f.status === 'pending'
          );

          return (
            <motion.div
              key={suggestedUser.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg"
            >
              <Link 
                to={createPageUrl(`UserProfile?email=${suggestedUser.email}`)}
                className="flex items-center gap-3 flex-1"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold">
                  {suggestedUser.profile_image_url ? (
                    <img src={suggestedUser.profile_image_url} alt={suggestedUser.full_name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    suggestedUser.full_name?.charAt(0) || suggestedUser.email.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a1a2e] dark:text-white truncate">
                    {suggestedUser.full_name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {suggestedUser.bio?.slice(0, 40) || suggestedUser.email}
                  </p>
                </div>
              </Link>
              
              <Button
                size="sm"
                onClick={() => sendRequest.mutate(suggestedUser.email)}
                disabled={alreadySent || sendRequest.isPending}
                className="bg-[#c9a227] hover:bg-[#b89120] ml-2"
              >
                {alreadySent ? (
                  'Sent'
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}