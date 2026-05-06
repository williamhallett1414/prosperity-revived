import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { getDisplayName, getDisplayNameFromString, getInitialFromString } from '@/lib/userName';

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
      user_name: getDisplayName(user, user.email || 'Member'),
      friend_name: getDisplayName(allUsers.find(u => u.email === friendEmail), friendEmail),
      status: 'pending'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['sentRequests']);
      toast.success('Friend request sent!');
    },
    onError: () => toast.error('Failed to send friend request'),
  });

  const filteredFriends = useMemo(() => {
    if (!searchTerm) return friends;
    return friends.filter(f => {
      const friendEmail = f.user_email === user?.email ? f.friend_email : f.user_email;
      const friendName = getDisplayNameFromString(
        f.user_email === user?.email ? f.friend_name : f.user_name,
        ''
      );
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
      (getDisplayName(u, '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
       u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
    ).slice(0, 20);
  }, [allUsers, userSearchTerm, user, friendEmails, sentRequests]);

  const renderSearchModal = () => (
    <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Friends</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
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
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 dark:text-white rounded-lg hover:bg-gray-100 dark:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#AFC7E3] to-[#FAD98D] flex items-center justify-center text-white font-bold">
                      {(getDisplayName(searchUser, '').charAt(0) || searchUser.email?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{getDisplayName(searchUser, searchUser.email || 'User')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">{searchUser.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => sendFriendRequest.mutate(searchUser.email)}
                    size="sm"
                    className="bg-[#FAD98D] hover:bg-[#FAD98D]/90 text-[#0A1A2F] dark:text-white dark:text-white"
                    disabled={sendFriendRequest.isPending}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : userSearchTerm ? (
            <p className="text-center text-gray-500 dark:text-gray-300 py-8">No users found</p>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-300 py-8">Search for users to add as friends</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (friends.length === 0) {
    return (
      <>
        <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm dark:shadow-none p-12 sm:p-16 text-center border border-gray-100 dark:border-white/10 dark:border-white/10">
          <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">No friends yet</p>
          <p className="text-gray-400 dark:text-gray-300 text-sm mt-2 mb-4">Start connecting with others</p>
          <Button
            onClick={() => setShowSearchModal(true)}
            className="bg-gradient-to-br from-[#c9a227] to-[#FAD98D] hover:opacity-90 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        </div>
        {showSearchModal && renderSearchModal()}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-white/5 rounded-xl shadow-sm dark:shadow-none p-6 border border-gray-100 dark:border-white/10 dark:border-white/10"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
          </h2>
          <Button
            onClick={() => setShowSearchModal(true)}
            className="bg-gradient-to-br from-[#c9a227] to-[#FAD98D] hover:opacity-90 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Find Friends
            </Button>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
          <Input
            placeholder="Search your friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

      {filteredFriends.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300 py-8">No friends found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFriends.map((friend, index) => {
          const friendEmail = friend.user_email === user?.email ? friend.friend_email : friend.user_email;
          const rawName = friend.user_email === user?.email ? friend.friend_name : friend.user_name;
          const friendName = getDisplayNameFromString(rawName, '');

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="flex flex-col items-center p-4 hover:bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#AFC7E3] to-[#FAD98D] flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md dark:shadow-none group-hover:shadow-lg dark:shadow-none transition-shadow">
                {(friendName.charAt(0) || friendEmail?.charAt(0) || 'F').toUpperCase()}
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-center text-sm line-clamp-2 mb-1">
                {friendName || friendEmail}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300 text-center truncate w-full px-1">{friendEmail}</p>
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