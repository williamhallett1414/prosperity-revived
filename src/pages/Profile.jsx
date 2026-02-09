import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, CheckCircle, Edit2, Users, MessageCircle, Loader2, Settings, Trophy, MapPin, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { readingPlans } from '@/components/bible/BibleData';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import PostCard from '@/components/community/PostCard';
import GamificationBanner from '@/components/gamification/GamificationBanner';


export default function Profile() {
  const [user, setUser] = useState(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [status, setStatus] = useState('');
  const [bio, setBio] = useState('');
  const [spiritualGoal, setSpiritualGoal] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list();
      return allPosts.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => 
        (f.user_email === user?.email || f.friend_email === user?.email) && f.status === 'accepted'
      );
    },
    enabled: !!user
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => f.friend_email === user?.email && f.status === 'pending');
    },
    enabled: !!user
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['myMemberships'],
    queryFn: async () => {
      const all = await base44.entities.GroupMember.list();
      return all.filter(m => m.user_email === user?.email);
    },
    enabled: !!user
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list()
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list()
  });

  const updateUser = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      base44.auth.me().then(setUser);
      setEditingStatus(false);
    }
  });

  const activePlans = progress.filter(p => !p.completed_date);
  const completedPlans = progress.filter(p => p.completed_date);
  
  const totalDaysRead = progress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...progress.map(p => p.longest_streak || 0), 0);

  const handleStatusUpdate = () => {
    updateUser.mutate({ status_message: status });
  };

  const handleBioUpdate = () => {
    updateUser.mutate({ bio });
    setEditingBio(false);
  };

  const handleGoalUpdate = () => {
    updateUser.mutate({ spiritual_goal: spiritualGoal });
    setEditingGoal(false);
  };

  const toggleFavoriteVerse = async (bookmarkId) => {
    const currentFavorites = user.favorite_verse_ids || [];
    const newFavorites = currentFavorites.includes(bookmarkId)
      ? currentFavorites.filter(id => id !== bookmarkId)
      : currentFavorites.length < 3
        ? [...currentFavorites, bookmarkId]
        : currentFavorites;
    
    await updateUser.mutateAsync({ favorite_verse_ids: newFavorites });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await updateUser.mutateAsync({ profile_image_url: file_url });
    } catch (error) {
      console.error('Upload failed', error);
    }
    setUploadingImage(false);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await updateUser.mutateAsync({ cover_image_url: file_url });
    } catch (error) {
      console.error('Upload failed', error);
    }
    setUploadingCover(false);
  };

  const userGroups = groups.filter(g => memberships.some(m => m.group_id === g.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a2e] pb-24">
      {/* Navigation Header */}
      <div className="sticky top-0 bg-white dark:bg-[#2d2d4a] border-b border-gray-200 dark:border-gray-700 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a1a2e] dark:text-white" />
          </Link>
          <h2 className="text-lg font-bold text-[#1a1a2e] dark:text-white">{user.full_name || 'Profile'}</h2>
          <Link
            to={createPageUrl('Settings')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-[#1a1a2e] dark:text-white" />
          </Link>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] overflow-hidden group">
        {user.cover_image_url ? (
          <img src={user.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#c9a227]/20 to-[#8fa68a]/20" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
          id="cover-image-upload"
        />
        <button 
          onClick={() => document.getElementById('cover-image-upload').click()}
          disabled={uploadingCover}
          className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors z-20"
        >
          {uploadingCover ? (
            <Loader2 className="w-5 h-5 text-[#1a1a2e] animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-[#1a1a2e]" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 mb-6">
        <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-lg p-4 flex items-end gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-[#1a1a2e] shadow-lg">
              {user.profile_image_url ? (
                <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                user.full_name?.charAt(0) || user.email.charAt(0)
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image-upload"
            />
            <button 
              onClick={() => document.getElementById('profile-image-upload').click()}
              disabled={uploadingImage}
              className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
            >
              {uploadingImage ? (
                <Loader2 className="w-5 h-5 text-[#1a1a2e] animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-[#1a1a2e]" />
              )}
            </button>
          </div>

          {/* Name & Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{user.full_name || 'User'}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{friends.length} Friends</p>
          </div>
        </div>
      </div>

      {/* Profile Stats & Actions */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Link to={createPageUrl('Friends')}>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <Users className="w-4 h-4" />
              Friends
            </motion.button>
          </Link>

          <Link to={createPageUrl('Messages')}>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[#1a1a2e] dark:text-white font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Message
            </motion.button>
          </Link>

          <Link to={createPageUrl('Achievements')}>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[#1a1a2e] dark:text-white font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <Trophy className="w-3.5 h-3.5" />
              Achievements
            </motion.button>
          </Link>
        </div>

        {/* Gamification Banner */}
        <GamificationBanner />
      </div>

      {/* Tabs Section */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white dark:bg-[#2d2d4a] rounded-lg border-b border-gray-200 dark:border-gray-700 flex gap-4 overflow-x-auto">
          <Link 
            to={createPageUrl('PhotoGallery')}
            className="px-4 py-3 border-b-2 border-blue-500 text-blue-500 font-semibold whitespace-nowrap"
          >
            Photos
          </Link>
          <button className="px-4 py-3 text-gray-600 dark:text-gray-400 font-semibold hover:text-[#1a1a2e] dark:hover:text-white whitespace-nowrap">
            Posts
          </button>
          <button className="px-4 py-3 text-gray-600 dark:text-gray-400 font-semibold hover:text-[#1a1a2e] dark:hover:text-white whitespace-nowrap">
            About
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1a1a2e] dark:text-white">About</h3>
            {!editingBio && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingBio(true);
                  setBio(user.bio || '');
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {editingBio ? (
            <div className="space-y-3">
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleBioUpdate}
                  className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
                  disabled={updateUser.isPending}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingBio(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 italic">
              {user.bio || 'Add a bio to tell others about yourself'}
            </p>
          )}
        </div>
      </div>

      {/* Spiritual Goal */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 shadow-lg text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="text-xl">🎯</span>
              My Spiritual Goal
            </h3>
            {!editingGoal && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingGoal(true);
                  setSpiritualGoal(user.spiritual_goal || '');
                }}
                className="text-white hover:bg-white/20"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {editingGoal ? (
            <div className="space-y-3">
              <Textarea
                value={spiritualGoal}
                onChange={(e) => setSpiritualGoal(e.target.value)}
                placeholder="Set a spiritual goal for accountability..."
                className="min-h-[80px] bg-white/90 text-[#1a1a2e] border-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleGoalUpdate}
                  className="bg-white text-indigo-600 hover:bg-white/90"
                  disabled={updateUser.isPending}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingGoal(false)}
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-white/90 italic">
              {user.spiritual_goal || 'Set a spiritual goal to stay accountable and inspire others'}
            </p>
          )}
        </div>
      </div>

      {/* Favorite Verses */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3 flex items-center gap-2">
            <span className="text-xl">✨</span>
            Favorite Verses
          </h3>
          
          {bookmarks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              Bookmark verses from the Bible to showcase your favorites here
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-3">
                {bookmarks.filter(b => user.favorite_verse_ids?.includes(b.id)).map(bookmark => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-[#c9a227]/10 to-[#8fa68a]/10 rounded-xl p-3 border-l-4 border-[#c9a227]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm text-[#1a1a2e] dark:text-white">
                        {bookmark.book_name} {bookmark.chapter_number}:{bookmark.verse_number}
                      </p>
                      <button
                        onClick={() => toggleFavoriteVerse(bookmark.id)}
                        className="text-amber-500 text-xl"
                      >
                        ⭐
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                      "{bookmark.verse_text}"
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {user.favorite_verse_ids?.length < 3 && bookmarks.length > 0 && (
                <details className="mt-3">
                  <summary className="text-sm text-[#c9a227] cursor-pointer hover:underline">
                    {user.favorite_verse_ids?.length > 0 
                      ? 'Change favorites (tap star to add/remove)'
                      : 'Select up to 3 favorite verses'}
                  </summary>
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    {bookmarks.filter(b => !user.favorite_verse_ids?.includes(b.id)).map(bookmark => (
                      <div
                        key={bookmark.id}
                        className="bg-gray-50 dark:bg-[#1a1a2e] rounded-lg p-3 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-xs text-[#1a1a2e] dark:text-white">
                            {bookmark.book_name} {bookmark.chapter_number}:{bookmark.verse_number}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                            {bookmark.verse_text}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavoriteVerse(bookmark.id)}
                          className="text-gray-400 hover:text-amber-500 text-lg ml-2"
                          disabled={user.favorite_verse_ids?.length >= 3}
                        >
                          ☆
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status Update */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Status</h3>
            {!editingStatus && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingStatus(true);
                  setStatus(user.status_message || '');
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {editingStatus ? (
            <div className="space-y-3">
              <Textarea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Share what you're learning..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleStatusUpdate}
                  className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
                  disabled={updateUser.isPending}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingStatus(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 italic">
              {user.status_message || 'No status yet. Share what you\'re learning!'}
            </p>
          )}
        </div>
      </div>

      {/* Groups */}
      {userGroups.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">My Groups</h2>
          <div className="grid grid-cols-2 gap-3">
            {userGroups.map(group => (
              <Link
                key={group.id}
                to={createPageUrl(`GroupDetail?id=${group.id}`)}
                className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-[#1a1a2e] text-sm mb-1">{group.name}</h3>
                <p className="text-xs text-gray-500">{group.member_count} members</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {posts.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {posts.slice(0, 3).map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                comments={comments}
                onLike={() => {}}
                onComment={() => {}}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Current Plans */}
      {activePlans.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Current Plans</h2>
          <div className="space-y-3">
            {activePlans.map(p => {
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
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#8fa68a]" />
            Completed Plans ({completedPlans.length})
          </h2>
          <div className="space-y-3">
            {completedPlans.map(p => {
              const plan = p.is_custom 
                ? { id: p.plan_id, name: p.plan_name, duration: p.total_days, description: `${p.total_days} days of custom readings`, category: 'Custom', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400' }
                : readingPlans.find(rp => rp.id === p.plan_id);
              return plan ? (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-[#8fa68a]"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-[#8fa68a]" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1a1a2e]">{plan.name}</h3>
                      <p className="text-sm text-gray-500">
                        Completed {new Date(p.completed_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#8fa68a]">100%</p>
                    </div>
                  </div>
                </motion.div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Activity Summary */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Activity</h2>
        <div className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Community Posts</span>
            <span className="font-semibold text-[#1a1a2e] dark:text-white">{posts.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Active Plans</span>
            <span className="font-semibold text-[#1a1a2e] dark:text-white">{activePlans.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Plans Completed</span>
            <span className="font-semibold text-[#8fa68a]">{completedPlans.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}