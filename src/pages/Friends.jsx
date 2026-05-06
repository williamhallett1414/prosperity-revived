import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, UserPlus, MessageCircle, Check, X,
  Users, Sparkles, ChevronDown, ChevronUp, Bell, Clock, Send
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { checkInteractionAllowed } from '@/utils/MinorSafety';
import AIFriendSuggestions from '@/components/friends/AIFriendSuggestions';
import { getDisplayName, getDisplayNameFromString } from '@/lib/userName';

// ─── Avatar helper ─────────────────────────────────────────────────────────
function Avatar({ name, email, imageUrl, size = 'md' }) {
  const initials = (name || email || '?').charAt(0).toUpperCase();
  const sizeClasses = size === 'sm' ? 'w-10 h-10 text-sm' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-12 h-12 text-base';
  const colors = ['from-[#c9a227] to-[#AFC7E3]', 'from-[#AFC7E3] to-[#3C4E53]', 'from-[#FD9C2D] to-[#c9a227]', 'from-[#AFC7E3] to-[#AFC7E3]'];
  const colorIdx = (email || '').charCodeAt(0) % colors.length;
  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden`}>
      {imageUrl ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
}

// ─── Pending request card ──────────────────────────────────────────────────
function RequestCard({ request, onAccept, onDecline, accepting, declining }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-4 flex items-center gap-3"
    >
      <Avatar name={getDisplayNameFromString(request.user_name, '')} email={request.user_email} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#0A1A2F] dark:text-white text-sm truncate">{getDisplayNameFromString(request.user_name, request.user_email)}</p>
        <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40 truncate">{request.user_email}</p>
        <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 mt-0.5">wants to connect</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onAccept(request.id)}
          disabled={accepting}
          className="w-9 h-9 rounded-xl bg-[#AFC7E3] hover:bg-[#AFC7E3] flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => onDecline(request.id)}
          disabled={declining}
          className="w-9 h-9 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-red-50 dark:bg-red-900/20 border border-[#F2F6FA] hover:border-red-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[#0A1A2F]/40 dark:text-white/40" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Friend card ───────────────────────────────────────────────────────────
function FriendCard({ friend, currentUserEmail, navigate }) {
  const friendEmail = friend.user_email === currentUserEmail ? friend.friend_email : friend.user_email;
  const friendName = getDisplayNameFromString(
    friend.user_email === currentUserEmail ? friend.friend_name : friend.user_name,
    ''
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-4 flex items-center gap-3 hover:border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:shadow-sm dark:shadow-none transition-all"
    >
      <Link to={createPageUrl(`UserProfile?email=${friendEmail}`)}>
        <Avatar name={friendName} email={friendEmail} size="md" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={createPageUrl(`UserProfile?email=${friendEmail}`)}>
          <p className="font-bold text-[#0A1A2F] dark:text-white text-sm truncate hover:text-[#c9a227] transition-colors">{friendName || friendEmail}</p>
        </Link>
        <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35 truncate">{friendEmail}</p>
      </div>
      <button
        onClick={() => navigate(createPageUrl(`Messages?friend=${friendEmail}&name=${friendName}`))}
        className="w-10 h-10 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8 border border-[#F2F6FA] hover:border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 flex items-center justify-center transition-all"
      >
        <MessageCircle className="w-4 h-4 text-[#c9a227]" />
      </button>
    </motion.div>
  );
}

// ─── Empty friends state ───────────────────────────────────────────────────
function EmptyFriends({ onFocusAdd }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-[#c9a227]" />
      </div>
      <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-2">No connections yet</h3>
      <p className="text-sm text-[#0A1A2F]/45 dark:text-white/45 leading-relaxed mb-5">
        Add friends to message, encourage each other, and share your wellness journey.
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={onFocusAdd}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm"
        >
          Add a Friend
        </button>
        <Link to={createPageUrl('Community')}>
          <button className="w-full py-2.5 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/60 dark:text-white/60 font-semibold text-sm hover:bg-white dark:bg-white/5 transition-colors">
            Browse Community
          </button>
        </Link>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function Friends() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [addFocused, setAddFocused] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const addInputRef = React.useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => f.user_email === user?.email || f.friend_email === user?.email);
    },
    enabled: !!user
  });

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const sendRequest = useMutation({
    mutationFn: async (friendEmail) => {
      // Age-tier safety check
      const ageCheck = await checkInteractionAllowed(user, friendEmail);
      if (!ageCheck.allowed) {
        throw new Error(ageCheck.reason);
      }
      const friendUser = users.find(u => u.email === friendEmail);
      return base44.entities.Friend.create({
        user_email: user.email,
        friend_email: friendEmail,
        user_name: getDisplayName(user, user.email || 'Member'),
        friend_name: getDisplayName(friendUser, friendEmail),
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['friends']);
      toast.success('Friend request sent!');
      setSearchEmail('');
      setAddFocused(false);
    },
    onError: (err) => toast.error(err.message?.includes('safety') ? err.message : 'Could not send request. Check the email and try again.')
  });

  const acceptRequest = useMutation({
    mutationFn: (id) => base44.entities.Friend.update(id, { status: 'accepted' }),
    onSuccess: async () => {
      queryClient.invalidateQueries(['friends']);
      toast.success('Friend added! 🎉');
      if (user) {
        const { awardPoints } = await import('@/components/gamification/ProgressManager');
        await awardPoints(user.email, 20, 'friend_accepted', 'friends_count');
      }
    },
    onError: () => toast.error('Failed to accept request'),
  });

  const declineRequest = useMutation({
    mutationFn: (id) => base44.entities.Friend.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['friends']),
    onError: () => toast.error('Failed to decline request'),
  });

  const cancelRequest = useMutation({
    mutationFn: (id) => base44.entities.Friend.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['friends']);
      toast.success('Request cancelled');
    },
    onError: () => toast.error('Failed to cancel request'),
  });

  const handleSendRequest = () => {
    const email = searchEmail.trim().toLowerCase();
    if (!email) return;
    if (email === user?.email) { toast.error("That's your own email!"); return; }
    const alreadyConnected = friends.some(f =>
      f.user_email === email || f.friend_email === email
    );
    if (alreadyConnected) { toast.error('Already connected or request pending'); return; }
    sendRequest.mutate(email);
  };

  const myFriends = friends.filter(f => f.status === 'accepted');
  const pendingRequests = friends.filter(f => f.status === 'pending' && f.friend_email === user?.email);
  const sentRequests = friends.filter(f => f.status === 'pending' && f.user_email === user?.email);

  const focusAdd = () => {
    setAddFocused(true);
    setTimeout(() => addInputRef.current?.focus(), 100);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Header ── */}
      <div className="sticky top-14 z-30 bg-white dark:bg-white/5 border-b border-[#F2F6FA]/60 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to={createPageUrl('Profile')}
            className="w-9 h-9 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Friends</h1>
            <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">
              {myFriends.length > 0 ? `${myFriends.length} connection${myFriends.length !== 1 ? 's' : ''}` : 'Connect with others'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingRequests.length > 0 && (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-full px-2.5 py-1">
                <Bell className="w-3 h-3 text-red-400" />
                <span className="text-xs font-bold text-red-500">{pendingRequests.length}</span>
              </div>
            )}
            <button
              onClick={focusAdd}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FAD98D] to-[#c9a227] flex items-center justify-center shadow-sm dark:shadow-none hover:opacity-90 transition-opacity"
            >
              <UserPlus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* ── Add friend panel ── */}
        <AnimatePresence>
          {addFocused && (
            <motion.div
              key="add-panel"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <UserPlus className="w-4 h-4 text-[#FAD98D]" />
                  <h3 className="text-sm font-bold text-white">Add a Friend</h3>
                  <button onClick={() => { setAddFocused(false); setSearchEmail(''); }}
                    className="ml-auto text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    ref={addInputRef}
                    type="email"
                    placeholder="Enter their email address…"
                    value={searchEmail}
                    onChange={e => setSearchEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendRequest()}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#FAD98D]/50 dark:border-[#FAD98D]/20 transition-colors"
                  />
                  <button
                    onClick={handleSendRequest}
                    disabled={!searchEmail.trim() || sendRequest.isPending}
                    className="px-4 py-2.5 rounded-xl bg-[#FAD98D] text-[#0A1A2F] dark:text-white font-bold text-sm disabled:opacity-40 hover:bg-[#c9a227] transition-colors flex items-center gap-1.5 min-h-[44px] min-w-[44px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </div>
                <p className="text-[11px] text-white/30 mt-2.5">They'll receive a connection request to accept.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Incoming requests (prominent, not in a tab) ── */}
        <AnimatePresence>
          {pendingRequests.length > 0 && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
                  Connection Requests
                </h2>
                <span className="ml-auto text-[10px] text-[#0A1A2F]/35 dark:text-white/35 font-semibold uppercase tracking-widest">
                  {pendingRequests.length} pending
                </span>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {pendingRequests.map(r => (
                    <RequestCard
                      key={r.id}
                      request={r}
                      onAccept={id => acceptRequest.mutate(id)}
                      onDecline={id => declineRequest.mutate(id)}
                      accepting={acceptRequest.isPending}
                      declining={declineRequest.isPending}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI Suggestions ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#c9a227]" />
            <h2 className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">People You May Know</h2>
          </div>
          <AIFriendSuggestions user={user} limit={5} showHeader={false} />
        </div>

        {/* ── Friends list ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#AFC7E3]" />
            <h2 className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
              My Friends {myFriends.length > 0 && <span className="text-[#0A1A2F]/35 dark:text-white/35 font-normal">({myFriends.length})</span>}
            </h2>
          </div>

          {myFriends.length === 0 ? (
            <EmptyFriends onFocusAdd={focusAdd} />
          ) : (
            <div className="space-y-2">
              {myFriends.map(f => (
                <FriendCard key={f.id} friend={f} currentUserEmail={user.email} navigate={navigate} />
              ))}
            </div>
          )}
        </div>

        {/* ── Sent requests (collapsible) ── */}
        {sentRequests.length > 0 && (
          <div>
            <button
              onClick={() => setShowSent(s => !s)}
              className="flex items-center gap-2 w-full py-2 text-left"
            >
              <Clock className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
              <span className="text-sm font-semibold text-[#0A1A2F]/50 dark:text-white/50">
                Sent Requests ({sentRequests.length})
              </span>
              {showSent
                ? <ChevronUp className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30 ml-auto" />
                : <ChevronDown className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30 ml-auto" />}
            </button>

            <AnimatePresence>
              {showSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-2 mt-2"
                >
                  {sentRequests.map(f => (
                    <motion.div key={f.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-3.5 flex items-center gap-3"
                    >
                      <Avatar name={getDisplayNameFromString(f.friend_name, '')} email={f.friend_email} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white truncate">{getDisplayNameFromString(f.friend_name, f.friend_email)}</p>
                        <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35">Awaiting response…</p>
                      </div>
                      <button
                        onClick={() => cancelRequest.mutate(f.id)}
                        disabled={cancelRequest.isPending}
                        className="text-xs text-[#0A1A2F]/30 dark:text-white/30 hover:text-red-400 font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:bg-red-900/20"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
