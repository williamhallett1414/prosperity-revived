import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, TrendingUp, UserPlus, UserCheck, MessageCircle, Loader2, Target, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { readingPlans } from '@/components/bible/BibleData';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import PostCard from '@/components/community/PostCard';
import UserPostsFeed from '@/components/profile/UserPostsFeed';
import BannerCustomizer from '@/components/profile/BannerCustomizer';

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileEmail, setProfileEmail] = useState(null);
  const [showBannerCustomizer, setShowBannerCustomizer] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setCurrentUser);
    const params = new URLSearchParams(window.location.search);
    setProfileEmail(params.get('email'));
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list()
  });

  const profileUser = users.find(u => u.email === profileEmail);

  const { data: progress = [] } = useQuery({
    queryKey: ['userProgress', profileEmail],
    queryFn: async () => {
      const all = await base44.entities.ReadingPlanProgress.list();
      return all.filter(p => p.created_by === profileEmail);
    },
    enabled: !!profileEmail
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['userBookmarks', profileEmail],
    queryFn: async () => {
      const all = await base44.entities.Bookmark.list();
      return all.filter(b => b.created_by === profileEmail);
    },
    enabled: !!profileEmail
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['userPosts', profileEmail],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list('-created_date', 50);
      return allPosts.filter(p => p.created_by === profileEmail);
    },
    enabled: !!profileEmail
  });

  const { data: photos = [] } = useQuery({
    queryKey: ['userPhotos', profileEmail],
    queryFn: async () => {
      const all = await base44.entities.Photo.list('-created_date', 50);
      return all.filter(p => p.created_by === profileEmail && p.is_profile_visible);
    },
    enabled: !!profileEmail
  });

  const { data: userProgressList = [] } = useQuery({
    queryKey: ['userProgress', profileEmail],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.filter(p => p.created_by === profileEmail);
    },
    enabled: !!profileEmail
  });

  const userProgressData = userProgressList[0];

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: () => base44.entities.Friend.list(),
    enabled: !!currentUser
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list()
  });

  const sendFriendRequest = useMutation({
    mutationFn: (data) => base44.entities.Friend.create(data),
    onSuccess: () => queryClient.invalidateQueries(['friends'])
  });

  const updateFriendRequest = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Friend.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries(['friends'])
  });

  const existingFriendship = friends.find(f => 
    (f.user_email === currentUser?.email && f.friend_email === profileEmail) ||
    (f.friend_email === currentUser?.email && f.user_email === profileEmail)
  );

  const activePlans = progress.filter(p => !p.completed_date);
  const completedPlans = progress.filter(p => p.completed_date);
  
  const totalDaysRead = progress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...progress.map(p => p.longest_streak || 0), 0);

  const handleFriendAction = () => {
    if (!existingFriendship) {
      sendFriendRequest.mutate({
        user_email: currentUser.email,
        friend_email: profileEmail,
        user_name: currentUser.full_name || currentUser.email,
        friend_name: profileUser.full_name || profileUser.email,
        status: 'pending'
      });
    } else if (existingFriendship.status === 'pending' && existingFriendship.friend_email === currentUser.email) {
      updateFriendRequest.mutate({ id: existingFriendship.id, status: 'accepted' });
    }
  };

  if (!profileUser || !currentUser) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  const isOwnProfile = currentUser.email === profileEmail;
  const isFriend = existingFriendship?.status === 'accepted';
  const isPending = existingFriendship?.status === 'pending';
  const sentRequest = isPending && existingFriendship?.user_email === currentUser.email;
  const receivedRequest = isPending && existingFriendship?.friend_email === currentUser.email;

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {/* Header with Banner */}
      <div className="relative text-white">
        {/* Banner Image */}
        <div className="h-48 overflow-hidden relative">
          {profileUser.banner_image_url ? (
            <img
              src={profileUser.banner_image_url}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a]" />
          )}
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Banner Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {isOwnProfile && (
              <button
                onClick={() => setShowBannerCustomizer(true)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
            {!isOwnProfile && (
              <Link
                to={createPageUrl(`Messages?recipient=${profileEmail}`)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-xl">
              {profileUser.profile_image_url ? (
                <img src={profileUser.profile_image_url} alt={profileUser.full_name} className="w-full h-full object-cover" />
              ) : (
                profileUser.full_name?.charAt(0) || profileUser.email.charAt(0)
              )}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold drop-shadow-lg">{profileUser.full_name || 'User'}</h1>
              <p className="text-white/90 text-sm drop-shadow">{profileUser.email}</p>
            </div>

            {!isOwnProfile && (
              <Button
                onClick={handleFriendAction}
                disabled={sentRequest}
                className="mb-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
                size="sm"
              >
                {isFriend ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Friends
                  </>
                ) : receivedRequest ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Accept Request
                  </>
                ) : sentRequest ? (
                  'Request Sent'
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="text-3xl mb-1">⭐</div>
            <p className="text-2xl font-bold">Level {userProgressData?.level || 1}</p>
            <p className="text-xs opacity-80">{userProgressData?.total_points || 0} pts</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg"
          >
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{userProgressData?.badges?.length || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Badges</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg"
          >
            <TrendingUp className="w-6 h-6 text-[#8fa68a] mb-2" />
            <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{longestStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
          </motion.div>
        </div>
      </div>

      {/* Spiritual Goal */}
      {profileUser.spiritual_goal && (
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-lg text-white">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Spiritual Goal
            </h3>
            <p className="text-white/90 italic">{profileUser.spiritual_goal}</p>
          </div>
        </div>
      )}

      {/* Favorite Verses */}
      {profileUser.favorite_verse_ids && profileUser.favorite_verse_ids.length > 0 && (
        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3 flex items-center gap-2">
              <span className="text-xl">✨</span>
              Favorite Verses
            </h3>
            <div className="space-y-3">
              {bookmarks.filter(b => profileUser.favorite_verse_ids.includes(b.id)).map(bookmark => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-[#c9a227]/10 to-[#8fa68a]/10 rounded-xl p-3 border-l-4 border-[#c9a227]"
                >
                  <p className="font-semibold text-sm text-[#1a1a2e] dark:text-white mb-2">
                    {bookmark.book_name} {bookmark.chapter_number}:{bookmark.verse_number}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                    "{bookmark.verse_text}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Preview */}
      {userProgressData && userProgressData.badges && userProgressData.badges.length > 0 && (
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 shadow-lg text-white">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">🏆</span>
              Recent Achievements
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {userProgressData.badges.slice(-4).map(badgeId => (
                <div key={badgeId} className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
                  {badgeId === 'first_plan' && '📖'}
                  {badgeId === 'social_butterfly' && '🦋'}
                  {badgeId === 'streak_7' && '🔥'}
                  {badgeId === 'streak_30' && '⭐'}
                  {badgeId === 'fitness_fan' && '💪'}
                  {badgeId === 'meditation_master' && '🧘'}
                  {badgeId === 'friend_maker' && '👥'}
                  {badgeId === 'commentator' && '💬'}
                  {badgeId === 'messenger' && '✉️'}
                  {badgeId === 'photographer' && '📸'}
                  {badgeId === 'level_5' && '🌟'}
                  {badgeId === 'level_10' && '👑'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bio */}
      {profileUser.bio && (
        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Bio</h3>
            <p className="text-gray-600 dark:text-gray-400">{profileUser.bio}</p>
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Photos</h2>
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(0, 6).map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || 'Photo'}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">
          {isOwnProfile ? 'My Posts' : 'Posts'}
        </h2>
        <UserPostsFeed userEmail={profileEmail} isOwnProfile={isOwnProfile} />
      </div>

      {/* Current Plans */}
      {activePlans.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Current Plans</h2>
          <div className="space-y-3">
            {activePlans.slice(0, 3).map(p => {
              const plan = p.is_custom 
                ? { id: p.plan_id, name: p.plan_name, duration: p.total_days, description: `${p.total_days} days of custom readings`, category: 'Custom', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400' }
                : readingPlans.find(rp => rp.id === p.plan_id);
              return plan ? <ReadingPlanCard key={p.id} plan={plan} progress={p} /> : null;
            })}
          </div>
        </div>
      )}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#8fa68a]" />
            Completed Plans ({completedPlans.length})
          </h2>
        </div>
      )}

      {/* Banner Customizer Modal */}
      {isOwnProfile && (
        <BannerCustomizer
          isOpen={showBannerCustomizer}
          onClose={() => setShowBannerCustomizer(false)}
          currentBanner={profileUser.banner_image_url}
          onSave={() => {
            queryClient.invalidateQueries(['users']);
            base44.auth.me().then(setCurrentUser);
          }}
        />
      )}
    </div>
  );
}