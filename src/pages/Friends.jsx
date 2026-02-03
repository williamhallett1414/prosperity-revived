import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, UserPlus, MessageCircle, Check, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Friends() {
  const [user, setUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => 
        f.user_email === user?.email || f.friend_email === user?.email
      );
    },
    enabled: !!user
  });

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const sendRequest = useMutation({
    mutationFn: async (friendEmail) => {
      const friendUser = users.find(u => u.email === friendEmail);
      return base44.entities.Friend.create({
        user_email: user.email,
        friend_email: friendEmail,
        user_name: user.full_name || user.email,
        friend_name: friendUser?.full_name || friendEmail,
        status: 'pending'
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['friends'])
  });

  const acceptRequest = useMutation({
    mutationFn: (id) => base44.entities.Friend.update(id, { status: 'accepted' }),
    onSuccess: () => queryClient.invalidateQueries(['friends'])
  });

  const declineRequest = useMutation({
    mutationFn: (id) => base44.entities.Friend.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['friends'])
  });

  const handleSendRequest = () => {
    if (searchEmail && searchEmail !== user?.email) {
      const alreadyFriends = friends.some(f => 
        (f.user_email === searchEmail || f.friend_email === searchEmail)
      );
      if (!alreadyFriends) {
        sendRequest.mutate(searchEmail);
        setSearchEmail('');
      }
    }
  };

  const myFriends = friends.filter(f => 
    f.status === 'accepted' && 
    (f.user_email === user?.email || f.friend_email === user?.email)
  );

  const pendingRequests = friends.filter(f => 
    f.status === 'pending' && f.friend_email === user?.email
  );

  const sentRequests = friends.filter(f => 
    f.status === 'pending' && f.user_email === user?.email
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to={createPageUrl('Profile')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Friends</h1>
        </div>

        {/* Add Friend */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter friend's email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendRequest()}
          />
          <Button
            onClick={handleSendRequest}
            className="bg-[#1a1a2e]"
            disabled={sendRequest.isPending}
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">
              Friends ({myFriends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Friends List */}
          <TabsContent value="friends" className="mt-4 space-y-3">
            {myFriends.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No friends yet</p>
                <p className="text-sm text-gray-400 mt-1">Add friends to connect and message</p>
              </div>
            ) : (
              myFriends.map(f => {
                const friendEmail = f.user_email === user.email ? f.friend_email : f.user_email;
                const friendName = f.user_email === user.email ? f.friend_name : f.user_name;
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold">
                        {friendName?.charAt(0) || friendEmail.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{friendName}</p>
                        <p className="text-sm text-gray-500">{friendEmail}</p>
                      </div>
                    </div>
                    <Link to={createPageUrl(`Messages?friend=${friendEmail}&name=${friendName}`)}>
                      <Button variant="ghost" size="icon">
                        <MessageCircle className="w-5 h-5 text-[#c9a227]" />
                      </Button>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </TabsContent>

          {/* Pending Requests */}
          <TabsContent value="requests" className="mt-4 space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No pending requests</p>
              </div>
            ) : (
              pendingRequests.map(f => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold">
                        {f.user_name?.charAt(0) || f.user_email.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{f.user_name}</p>
                        <p className="text-sm text-gray-500">{f.user_email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => acceptRequest.mutate(f.id)}
                      className="flex-1 bg-[#8fa68a] hover:bg-[#7a9179]"
                      disabled={acceptRequest.isPending}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => declineRequest.mutate(f.id)}
                      variant="outline"
                      className="flex-1"
                      disabled={declineRequest.isPending}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Sent Requests */}
          <TabsContent value="sent" className="mt-4 space-y-3">
            {sentRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No sent requests</p>
              </div>
            ) : (
              sentRequests.map(f => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold">
                      {f.friend_name?.charAt(0) || f.friend_email.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a1a2e]">{f.friend_name}</p>
                      <p className="text-sm text-gray-500">Pending...</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}