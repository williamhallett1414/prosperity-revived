import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, TrendingUp, UserPlus, UserCheck, MessageCircle, Loader2, Target, Camera, Pencil, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { readingPlans } from '@/components/bible/BibleData';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import PostCard from '@/components/community/PostCard';
import UserPostsFeed from '@/components/profile/UserPostsFeed';
import BannerCustomizer from '@/components/profile/BannerCustomizer';
import ProfileStats from '@/components/profile/ProfileStats';
import { notifyFriendRequest, notifyFriendAccepted } from '@/components/notifications/NotificationHelper';

export default function UserProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileEmail, setProfileEmail] = useState(null);
  const [showBannerCustomizer, setShowBannerCustomizer] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
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
      return await base44.entities.ReadingPlanProgress.filter({ created_by: profileEmail });
    },
    enabled: !!profileEmail
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['userBookmarks', profileEmail],
    queryFn: async () => {
      return await base44.entities.Bookmark.filter({ created_by: profileEmail });
    },
    enabled: !!profileEmail
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['userPosts', profileEmail],
    queryFn: async () => {
      return await base44.entities.Post.filter({ created_by: profileEmail }, '-created_date', 50);
    },
    enabled: !!profileEmail
  });

  const { data: photos = [] } = useQuery({
    queryKey: ['userPhotos', profileEmail],
    queryFn: async () => {
      return await base44.entities.Photo.filter({ 
        created_by: profileEmail, 
        is_profile_visible: true 
      }, '-created_date', 50);
    },
    enabled: !!profileEmail
  });

  const { data: userProgressList = [] } = useQuery({
    queryKey: ['userProgressData', profileEmail],
    queryFn: async () => {
      return await base44.entities.UserProgress.filter({ created_by: profileEmail });
    },
    enabled: !!profileEmail
  });

  const userProgressData = userProgressList[0];

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['profileWorkouts', profileEmail],
    queryFn: () => base44.entities.WorkoutSession.filter({ created_by: profileEmail }),
    enabled: !!profileEmail
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['profileJournals', profileEmail],
    queryFn: () => base44.entities.JournalEntry.filter({ created_by: profileEmail }),
    enabled: !!profileEmail
  });

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['profileMeditations', profileEmail],
    queryFn: () => base44.entities.MeditationSession.filter({ created_by: profileEmail }),
    enabled: !!profileEmail
  });

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

  // Get mutual friends
  const myFriends = friends.filter(f => 
    f.status === 'accepted' && 
    (f.user_email === currentUser?.email || f.friend_email === currentUser?.email)
  ).map(f => f.user_email === currentUser?.email ? f.friend_email : f.user_email);

  const profileUserFriends = friends.filter(f => 
    f.status === 'accepted' && 
    (f.user_email === profileEmail || f.friend_email === profileEmail)
  ).map(f => f.user_email === profileEmail ? f.friend_email : f.user_email);

  const mutualFriendEmails = myFriends.filter(email => profileUserFriends.includes(email));
  const mutualFriends = users.filter(u => mutualFriendEmails.includes(u.email));

  const activePlans = progress.filter(p => !p.completed_date);
  const completedPlans = progress.filter(p => p.completed_date);
  
  const totalDaysRead = (progress || []).reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...(progress || []).map(p => p.longest_streak || 0), 0);

  const handleFriendAction = async () => {
    if (!existingFriendship) {
      sendFriendRequest.mutate({
        user_email: currentUser.email,
        friend_email: profileEmail,
        user_name: currentUser.full_name || currentUser.email,
        friend_name: profileUser.full_name || profileUser.email,
        status: 'pending'
      });
      
      // Notify recipient
      await notifyFriendRequest(
        currentUser.email,
        currentUser.full_name || currentUser.email,
        profileEmail
      );
    } else if (existingFriendship.status === 'pending' && existingFriendship.friend_email === currentUser.email) {
      updateFriendRequest.mutate({ id: existingFriendship.id, status: 'accepted' });
      
      // Notify the sender that their request was accepted
      await notifyFriendAccepted(
        currentUser.email,
        currentUser.full_name || currentUser.email,
        existingFriendship.user_email
      );
    }
  };

  if (!profileUser || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
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
    <div className="min-h-screen bg-[#FFFDF7] pb-24">
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
            <div className="w-full h-full bg-gradient-to-br from-[#0A1A2F] via-[#c9a227] to-[#D9B878]" />
          )}
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Banner Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {isOwnProfile && (
              <>
                <button
                  onClick={() => setShowBannerCustomizer(true)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="px-3 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center gap-1.5 hover:bg-white/30 transition-colors text-white text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
              </>
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
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-3xl font-bold border-4 border-white shadow-xl">
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



      {/* Stats */}
      <div className="px-4 mt-4 mb-4">
        <ProfileStats
          userProgress={userProgressData}
          workoutSessions={workoutSessions}
          journalEntries={journalEntries}
          meditationSessions={meditationSessions}
        />
      </div>

      {/* Spiritual Goal */}
      {profileUser.spiritual_goal && (
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-br from-[#0A1A2F] to-[#1a3a5c] rounded-2xl p-4 shadow-lg text-white">
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
          <div className="bg-white border border-[#D9B878]/20 rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-[#0A1A2F] mb-3 flex items-center gap-2">
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
                  <p className="font-semibold text-sm text-[#0A1A2F] mb-2">
                    {bookmark.book_name} {bookmark.chapter_number}:{bookmark.verse_number}
                  </p>
                  <p className="text-[#0A1A2F]/75 text-sm italic">
                    "{bookmark.verse_text}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* Mutual Friends */}
      {!isOwnProfile && mutualFriends.length > 0 && (
        <div className="px-4 mb-6">
          <div className="bg-white border border-[#D9B878]/20 rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-[#0A1A2F] mb-3">
              {mutualFriends.length} Mutual Friend{mutualFriends.length !== 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {mutualFriends.slice(0, 6).map((friend, index) => (
                <Link
                  key={friend.id}
                  to={createPageUrl(`UserProfile?email=${friend.email}`)}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-white font-semibold shadow-md"
                  >
                    {friend.profile_image_url ? (
                      <img src={friend.profile_image_url} alt={friend.full_name} className="w-full h-full object-cover" />
                    ) : (
                      friend.full_name?.charAt(0) || friend.email.charAt(0)
                    )}
                  </motion.div>
                  <p className="text-xs text-center text-[#0A1A2F]/75 line-clamp-2 w-full">
                    {friend.full_name?.split(' ')[0] || 'User'}
                  </p>
                </Link>
              ))}
            </div>
            {mutualFriends.length > 6 && (
              <p className="text-sm text-[#0A1A2F]/50 mt-3 text-center">
                and {mutualFriends.length - 6} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bio */}
      {profileUser.bio ? (
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D9B878]/20">
            <h3 className="font-semibold text-[#0A1A2F] mb-2">Bio</h3>
            <p className="text-[#0A1A2F]/70">{profileUser.bio}</p>
          </div>
        </div>
      ) : isOwnProfile ? (
        <div className="px-4 mb-6">
          <button
            onClick={() => setShowEditProfile(true)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-dashed border-[#D9B878]/50 text-[#0A1A2F]/50 text-sm flex items-center justify-center gap-2 hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add a bio to tell people about yourself
          </button>
        </div>
      ) : null}

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Photos</h2>
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(0, 6).map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square rounded-xl overflow-hidden bg-[#F2F6FA]"
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
        <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">
          {isOwnProfile ? 'My Posts' : 'Posts'}
        </h2>
        <UserPostsFeed userEmail={profileEmail} isOwnProfile={isOwnProfile} />
      </div>

      {/* Current Plans */}
      {activePlans.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Current Plans</h2>
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
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#c9a227]" />
            Completed Plans ({completedPlans.length})
          </h2>
          <div className="space-y-3">
            {completedPlans.slice(0, 3).map(p => {
              const plan = p.is_custom
                ? { id: p.plan_id, name: p.plan_name, duration: p.total_days, description: `${p.total_days} days`, category: 'Custom', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400' }
                : readingPlans.find(rp => rp.id === p.plan_id);
              return plan ? <ReadingPlanCard key={p.id} plan={plan} progress={p} /> : null;
            })}
          </div>
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

      {/* Edit Profile Sheet */}
      <EditProfileSheet
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        currentUser={profileUser}
        onSave={async (data) => {
          await base44.auth.updateMe(data);
          await base44.auth.me().then(setCurrentUser);
          queryClient.invalidateQueries(['users']);
          setShowEditProfile(false);
        }}
      />
    </div>
  );
}

function EditProfileSheet({ open, onOpenChange, currentUser, onSave }) {
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profileImageUrl, setProfileImageUrl] = useState(currentUser?.profile_image_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setBio(currentUser.bio || '');
      setProfileImageUrl(currentUser.profile_image_url || '');
    }
  }, [currentUser?.email]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setProfileImageUrl(file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ full_name: fullName, bio, profile_image_url: profileImageUrl });
    setSaving(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto bg-[#FFFDF7] border-t border-[#D9B878]/30">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-[#0A1A2F] text-lg font-bold">Edit Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 pb-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-2xl font-bold text-white border-2 border-[#D9B878]/40">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                currentUser?.full_name?.charAt(0) || '?'
              )}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D9B878]/50 text-[#0A1A2F]/70 text-sm cursor-pointer hover:border-[#c9a227] hover:text-[#c9a227] transition-colors bg-white">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#0A1A2F] mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-[#D9B878]/30 bg-white text-[#0A1A2F] placeholder-[#0A1A2F]/40 focus:outline-none focus:border-[#c9a227] transition-colors"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-[#0A1A2F] mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[#D9B878]/30 bg-white text-[#0A1A2F] placeholder-[#0A1A2F]/40 focus:outline-none focus:border-[#c9a227] transition-colors resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full py-3 rounded-xl bg-[#c9a227] text-white font-semibold hover:bg-[#b8911e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}