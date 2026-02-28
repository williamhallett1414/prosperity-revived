import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FriendsTab({ friends, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Get the actual friend objects (email addresses)
  const friendEmails = friends.map(f => 
    f.user_email === user?.email ? f.friend_email : f.user_email
  );

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: showSearchModal
  });

  const { data: sentRequests = [] } = useQuery({
    queryKey: ['sentRequests'],
    queryFn: () => base44.entities.Friend.filter({ user_email: user?.email }),
    enabled: showSearchModal && !!user
  });

  const sendFriendRequest = useMutation({
    mutationFn: (friendEmail) => base44.entities.Friend.create({
      user_email: user.email,
      friend_email: friendEmail,
      user_name: user.full_name,
      friend_name: allUsers.find(u => u.email === friendEmail)?.full_name || friendEmail,
      status: 'pending'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['sentRequests']);
      toast.success('Friend request sent!');
    }
  });

  const filteredFriends = useMemo(() => {
    if (!searchTerm) return friends;
    return friends.filter(f => {
      const friendEmail = f.user_email === user?.email ? f.friend_email : f.user_email;
      const friendName = f.user_email === user?.email ? f.friend_name : f.user_name;
      return friendName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             friendEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [friends, searchTerm, user]);

  const searchResults = useMemo(() => {
    if (!userSearchTerm) return [];
    return allUsers.filter(u => 
      u.email !== user?.email &&
      !friendEmails.includes(u.email) &&
      !sentRequests.some(r => r.friend_email === u.email) &&
      (u.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
       u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
    ).slice(0, 20);
  }, [allUsers, userSearchTerm, user, friendEmails, sentRequests]);

  if (friends.length === 0) {
    return (
      <>
        <div className="bg-white rounded-xl shadow-sm p-12 sm:p-16 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <p className="text-gray-600 text-lg font-semibold">No friends yet</p>
          <p className="text-gray-400 text-sm mt-2 mb-4">Start connecting with others</p>
          <Button
            onClick={() => setShowSearchModal(true)}
            className="bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        </div>
        {showSearchModal && renderSearchModal()}
      </>
    );
  }

  const renderSearchModal = () => (
    <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Friends</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((searchUser) => (
                <div
                  key={searchUser.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] flex items-center justify-center text-white font-bold">
                      {searchUser.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{searchUser.full_name}</p>
                      <p className="text-xs text-gray-500">{searchUser.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => sendFriendRequest.mutate(searchUser.email)}
                    size="sm"
                    className="bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
                    disabled={sendFriendRequest.isPending}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : userSearchTerm ? (
            <p className="text-center text-gray-500 py-8">No users found</p>
          ) : (
            <p className="text-center text-gray-400 py-8">Search for users to add as friends</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
          </h2>
          <Button
            onClick={() => setShowSearchModal(true)}
            className="bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search your friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

      {filteredFriends.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No friends found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFriends.map((friend, index) => {
          const friendEmail = friend.user_email === user?.email ? friend.friend_email : friend.user_email;
          const friendName = friend.user_email === user?.email ? friend.friend_name : friend.user_name;

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                {friendName?.charAt(0).toUpperCase() || 'F'}
              </div>
              <p className="font-semibold text-gray-900 text-center text-sm line-clamp-2 mb-1">
                {friendName || friendEmail}
              </p>
              <p className="text-xs text-gray-500 text-center truncate w-full px-1">{friendEmail}</p>
            </motion.div>
          );
        })}
        </div>
      )}
    </motion.div>
    {renderSearchModal()}
    </>
  );
}