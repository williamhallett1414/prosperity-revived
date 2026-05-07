import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, UserPlus, UserCheck, Loader2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { getDisplayName, getDisplayNameFromString, getInitialFromString } from '@/lib/userName';

/**
 * UserProfilePreview
 * ─────────────────────────────────────────────────────────────────────
 * Lightweight bottom-sheet preview of another user's profile. Used as
 * a tap-to-view experience from posts, comments, friends list, and
 * group member chips.
 *
 * Why a bottom sheet instead of navigating to UserProfile.jsx:
 *   1. Stays in context — user doesn't lose their place in the feed
 *   2. Faster — no route transition, no full-page render
 *   3. Minimal scope (per Will's preference): picture + name + actions,
 *      not a full social profile page
 *
 * Why NOT navigate to /UserProfile?email=… :
 *   The existing UserProfile page calls base44.entities.User.list() and
 *   filters client-side, which depends on every user being able to read
 *   every other user's full record. Base44's docs suggest regular users
 *   can only read their own user record, so that page is likely broken
 *   for viewing others. We work around this here by:
 *     (a) accepting name + email as props (already known by the caller)
 *     (b) trying a single User.filter() to get the profile picture,
 *         falling back gracefully to the initial-circle if it fails.
 *   Net result: always works, even when the User entity isn't readable
 *   across users.
 *
 * Props:
 *   open       boolean — control visibility
 *   onClose    () => void
 *   email      string — the OTHER user's email (lookup key)
 *   name       string — best-known name (from post.user_name, etc.)
 *   currentUser the viewing user, used to gate self-views and friendships
 */
export default function UserProfilePreview({
  open,
  onClose,
  email,
  name,
  currentUser,
}) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [profilePic, setProfilePic] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const [createdDate, setCreatedDate] = useState(null);

  // Try to fetch the user's profile picture. We attempt User.filter first
  // (cheaper if it works, returns just the matching user). If that fails
  // or returns nothing, we silently give up — the preview falls back to
  // the initial-circle, which is what posts already show in the feed.
  // We never log errors loudly because the failure is the expected state
  // when row-level security blocks cross-user reads.
  useEffect(() => {
    if (!open || !email) return;
    setProfilePic(null);
    setCreatedDate(null);
    setPicLoading(true);
    let cancelled = false;
    (async () => {
      try {
        const matches = await base44.entities.User.filter({ email });
        if (cancelled) return;
        const u = Array.isArray(matches) ? matches[0] : null;
        if (u?.profile_image_url) setProfilePic(u.profile_image_url);
        if (u?.created_date) setCreatedDate(u.created_date);
      } catch (_e) {
        // Permission denied or any other error — fall back silently
      } finally {
        if (!cancelled) setPicLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, email]);

  // Friendship status — read from the Friend entity. The current user can
  // always read their own friend records, so this query is reliable.
  const { data: friendships = [] } = useQuery({
    queryKey: ['friendships', currentUser?.email],
    queryFn: () => base44.entities.Friend.filter({ user_email: currentUser?.email })
      .then(mine => base44.entities.Friend.filter({ friend_email: currentUser?.email })
        .then(theirs => [...(mine || []), ...(theirs || [])])),
    enabled: !!currentUser?.email && open,
  });

  const friendship = friendships.find(
    f => (f.user_email === currentUser?.email && f.friend_email === email) ||
         (f.friend_email === currentUser?.email && f.user_email === email)
  );

  const isOwnProfile = currentUser?.email === email;
  const isFriend = friendship?.status === 'accepted';
  const isPending = friendship?.status === 'pending';
  const sentByMe = isPending && friendship?.user_email === currentUser?.email;

  const sendFriendRequest = useMutation({
    mutationFn: () => base44.entities.Friend.create({
      user_email: currentUser.email,
      friend_email: email,
      user_name: getDisplayName(currentUser, currentUser.email || 'Member'),
      friend_name: getDisplayNameFromString(name, email || 'Member'),
      status: 'pending',
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['friendships'] });
      toast.success('Friend request sent');
    },
    onError: () => toast.error("Couldn't send friend request — please try again"),
  });

  const handleMessage = () => {
    onClose();
    // Brief delay so the sheet animates out cleanly before navigation.
    // Messages page accepts ?recipient=<email>&name=<displayName> to seed
    // a new conversation stub before the first message has been sent.
    setTimeout(() => {
      const params = new URLSearchParams({
        recipient: email,
        ...(name ? { name: getDisplayNameFromString(name, email) } : {}),
      });
      navigate(createPageUrl(`Messages?${params.toString()}`));
    }, 200);
  };

  // Render
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="bg-white dark:bg-[#0A1A2F] rounded-t-[28px] px-6 pt-4 relative"
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Drag handle */}
            <div
              className="w-10 h-1 rounded-full mx-auto mb-5"
              style={{ background: 'rgba(0,0,0,0.15)' }}
            />

            {/* Close button (top right) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile picture or initial fallback */}
            <div className="flex justify-center mb-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: profilePic
                    ? 'transparent'
                    : 'linear-gradient(135deg, #FD9C2D, #FAD98D)',
                  boxShadow: '0 4px 16px -4px rgba(0,0,0,0.15)',
                }}
              >
                {picLoading && !profilePic ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : profilePic ? (
                  <img
                    src={profilePic}
                    alt={`${getDisplayNameFromString(name, 'Member')}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {getInitialFromString(name)}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <h2 className="text-center text-xl font-bold text-[#0A1A2F] dark:text-white mb-1">
              {getDisplayNameFromString(name, 'Member')}
            </h2>

            {/* Joined date — small subtle line, only shown if we have it.
                Builds a little trust without revealing anything sensitive. */}
            {createdDate && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-6">
                Member since {new Date(createdDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
            )}
            {!createdDate && <div className="mb-4" />}

            {/* Action buttons.
                If this is the user's OWN preview (e.g. they tapped on
                themselves in a feed), we don't show friend/message buttons
                — just close. They'd be confusing. */}
            {!isOwnProfile && (
              <div className="space-y-2.5">
                <button
                  onClick={handleMessage}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm text-white"
                  style={{
                    background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)',
                    boxShadow: '0 6px 20px -6px rgba(253, 156, 45, 0.5)',
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>

                {/* Friend button shows the right state: not friends → Add Friend,
                    pending sent by me → Request Sent (disabled), pending sent
                    to me → Accept (out of scope for minimal preview, send
                    them to FriendsTab to handle), already friends → Friends ✓
                */}
                {isFriend ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm border-2"
                    style={{
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      color: '#065f46',
                    }}
                  >
                    <UserCheck className="w-4 h-4" />
                    Friends
                  </button>
                ) : sentByMe ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm border-2 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500"
                  >
                    <Clock className="w-4 h-4" />
                    Request Sent
                  </button>
                ) : isPending ? (
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => navigate(createPageUrl('Profile?tab=friends')), 200);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm border-2"
                    style={{
                      borderColor: '#FD9C2D',
                      color: '#FD9C2D',
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Respond to Request
                  </button>
                ) : (
                  <button
                    onClick={() => sendFriendRequest.mutate()}
                    disabled={sendFriendRequest.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm border-2 border-gray-300 dark:border-white/15 text-[#0A1A2F] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    {sendFriendRequest.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    Add Friend
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
