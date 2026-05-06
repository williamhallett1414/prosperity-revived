import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Send, Plus, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todayKey } from '@/utils/localDate';
import { toast } from 'sonner';
import SanctuaryBackground from '@/components/prayer/SanctuaryBackground';
import { getDisplayNameFromString, getInitialFromString } from '@/lib/userName';

// Tiny serif label used to introduce sections — matches Prayer.jsx's
// SectionHeader pattern (gold accent bar + uppercase tracked label).
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <div className="w-1 h-4 rounded-full bg-[#fbbf24]/60" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: 'rgba(251,191,36,0.85)' }}>
        {children}
      </p>
    </div>
  );
}

class PageErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { e: null }; }
  static getDerivedStateFromError(e) { return { e }; }
  render() {
    if (this.state.e) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0f1729', color: '#f5f1e8' }}>
          <p className="text-lg font-bold mb-2" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}>Something went wrong</p>
          <button onClick={() => this.setState({ e: null })}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))', color: '#0f1729' }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PrayerPartnersInner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [newRequest, setNewRequest] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const today = todayKey();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  // ── Data ─────────────────────────────────────────────────────────────────
  const { data: partnerships = [] } = useQuery({
    queryKey: ['prayerPartners'],
    queryFn: async () => {
      const [a, b] = await Promise.all([
        base44.entities.PrayerPartnership.filter({ user_email: user.email }),
        base44.entities.PrayerPartnership.filter({ partner_email: user.email }),
      ]);
      return [...a, ...b];
    },
    enabled: !!user,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['prayerRequests', user?.email],
    queryFn: () => base44.entities.PrayerRequest.filter({ created_by: user.email }),
    enabled: !!user,
  });

  const { data: partnerRequests = [] } = useQuery({
    queryKey: ['partnerPrayerRequests'],
    queryFn: async () => {
      const partnerEmails = partnerships.map(p => p.user_email === user.email ? p.partner_email : p.user_email);
      const all = [];
      for (const email of partnerEmails) {
        try {
          const r = await base44.entities.PrayerRequest.filter({ created_by: email, is_active: true });
          all.push(...r);
        } catch {}
      }
      return all;
    },
    enabled: !!user && partnerships.length > 0,
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends', user?.email],
    queryFn: async () => {
      const [sent, received] = await Promise.all([
        base44.entities.Friend.filter({ user_email: user.email, status: 'accepted' }),
        base44.entities.Friend.filter({ friend_email: user.email, status: 'accepted' }),
      ]);
      return [...sent, ...received];
    },
    enabled: !!user,
  });

  // ── Derived ──────────────────────────────────────────────────────────────
  const activePartners = partnerships.filter(p => p.status === 'accepted');

  const alreadyPartnerEmails = new Set(partnerships.map(p =>
    p.user_email === user?.email ? p.partner_email : p.user_email
  ));

  const filteredFriends = friends.filter(f => {
    const email = f.user_email === user?.email ? f.friend_email : f.user_email;
    const name  = f.user_email === user?.email ? f.friend_name  : f.user_name;
    if (alreadyPartnerEmails.has(email)) return false;
    if (!friendSearch.trim()) return true;
    const q = friendSearch.toLowerCase();
    return email.toLowerCase().includes(q) || (name || '').toLowerCase().includes(q);
  });

  // ── Mutations ────────────────────────────────────────────────────────────
  const addPartner = useMutation({
    mutationFn: (email) => base44.entities.PrayerPartnership.create({
      user_email: user.email,
      partner_email: email.toLowerCase().trim(),
      status: 'pending',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerPartners']);
      setPartnerEmail('');
      setFriendSearch('');
      toast.success('Prayer partner request sent!');
    },
    onError: () => toast.error('Failed to send partner request'),
  });

  const addRequest = useMutation({
    mutationFn: (text) => base44.entities.PrayerRequest.create({
      text,
      is_active: true,
      is_answered: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
      setNewRequest('');
      toast.success('Prayer request shared with your partners');
    },
    onError: () => toast.error('Failed to share request'),
  });

  const markPrayed = useMutation({
    mutationFn: (req) => base44.entities.PrayerRequest.update(req.id, {
      prayed_by: [...(req.prayed_by || []), user.email],
      last_prayed_date: today,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerPrayerRequests']);
      toast.success('Your prayer partner has been notified 🙏');
    },
  });

  const markAnswered = useMutation({
    mutationFn: (id) => base44.entities.PrayerRequest.update(id, { is_answered: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
      toast.success('Praise God! 🙌');
    },
  });

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-28 relative" style={{ background: '#0f1729' }}>
      {/* Ambient backdrop — same as Prayer.jsx so the visual transition is seamless */}
      <SanctuaryBackground />

      <div className="relative max-w-lg mx-auto px-4 pt-4 space-y-5" style={{ zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: '#f5f1e8' }} />
          </button>
          <div>
            <h1
              className="text-xl"
              style={{
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                color: '#f5f1e8',
                fontWeight: 500,
                letterSpacing: '-0.005em',
              }}
            >
              Prayer Partners
            </h1>
            <p
              className="text-xs italic"
              style={{
                color: 'rgba(245,241,232,0.55)',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
              }}
            >
              Bear one another's burdens — Galatians 6:2
            </p>
          </div>
        </div>

        {/* ── Intro card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(251,191,36,0.20)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="absolute -top-6 left-0 right-0 h-24 pointer-events-none opacity-50"
            style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 100%, rgba(251,191,36,0.18) 0%, transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.30)' }}
            >
              🙏
            </div>
            <div>
              <h2
                className="text-base"
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  color: '#f5f1e8',
                  fontWeight: 500,
                }}
              >
                Pray together
              </h2>
              <p className="text-xs" style={{ color: 'rgba(245,241,232,0.60)' }}>
                Share requests privately with a trusted partner
              </p>
            </div>
          </div>
          <p
            className="relative text-[13px] leading-relaxed"
            style={{
              color: 'rgba(245,241,232,0.75)',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
            }}
          >
            When you pray for your partner, they'll receive a quiet notification: "Someone prayed for you today." No details shared — just the knowledge that someone lifted them up.
          </p>
        </motion.div>

        {/* ── Add a partner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[20px] p-4 space-y-4"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(251,191,36,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: '#f5f1e8' }}>
            Add a prayer partner
          </p>

          {/* Search friends */}
          {friends.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(245,241,232,0.45)' }}>
                Pick from your friends
              </p>
              <div className="relative mb-2.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'rgba(245,241,232,0.4)' }} />
                <input
                  value={friendSearch}
                  onChange={e => setFriendSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: '#f5f1e8',
                  }}
                />
              </div>

              {filteredFriends.length > 0 && (
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {filteredFriends.map(f => {
                    const email = f.user_email === user?.email ? f.friend_email : f.user_email;
                    const rawName = f.user_email === user?.email ? f.friend_name : f.user_name;
                    const displayName = getDisplayNameFromString(rawName, '');
                    const initial = displayName ? getInitialFromString(displayName) : email[0].toUpperCase();
                    return (
                      <button
                        key={f.id}
                        onClick={() => addPartner.mutate(email)}
                        disabled={addPartner.isPending}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left min-h-[44px]"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #1a2547, #243154)',
                            border: '1px solid rgba(251,191,36,0.18)',
                            color: '#f5f1e8',
                          }}
                        >
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          {displayName && (
                            <p className="text-xs font-semibold truncate" style={{ color: '#f5f1e8' }}>
                              {displayName}
                            </p>
                          )}
                          <p className="text-[11px] truncate" style={{ color: 'rgba(245,241,232,0.50)' }}>
                            {email}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(251,191,36,0.75)' }} />
                      </button>
                    );
                  })}
                </div>
              )}

              {friendSearch.trim() && filteredFriends.length === 0 && (
                <p className="text-xs text-center py-2" style={{ color: 'rgba(245,241,232,0.45)' }}>
                  No friends found matching "{friendSearch}"
                </p>
              )}

              {!friendSearch.trim() && filteredFriends.length === 0 && friends.length > 0 && (
                <p className="text-xs text-center py-2" style={{ color: 'rgba(245,241,232,0.45)' }}>
                  All your friends are already prayer partners 🙏
                </p>
              )}

              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(245,241,232,0.40)' }}>
                  or add by email
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>
            </div>
          )}

          {/* Email fallback (always shown — for when the partner isn't a friend yet) */}
          <div className="flex gap-2">
            <input
              type="email"
              value={partnerEmail}
              onChange={e => setPartnerEmail(e.target.value)}
              placeholder="Partner's email address"
              className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#f5f1e8',
              }}
            />
            <button
              onClick={() => partnerEmail && addPartner.mutate(partnerEmail)}
              disabled={!partnerEmail || addPartner.isPending}
              className="rounded-xl px-4 min-h-[44px] flex items-center justify-center disabled:opacity-40 transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                color: '#0f1729',
                boxShadow: '0 4px 12px -4px rgba(251,191,36,0.4)',
              }}
              aria-label="Add partner by email"
            >
              {addPartner.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {friends.length === 0 && (
            <p className="text-[11px] italic text-center" style={{ color: 'rgba(245,241,232,0.50)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              Add friends from the Friends tab to pick partners directly.
            </p>
          )}
        </motion.div>

        {/* ── Active partners ── */}
        {activePartners.length > 0 && (
          <div>
            <SectionLabel>Your partners</SectionLabel>
            <div className="space-y-2">
              {activePartners.map(p => {
                const email = p.user_email === user.email ? p.partner_email : p.user_email;
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl p-3 flex items-center gap-3"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(251,191,36,0.10)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #1a2547, #243154)',
                        border: '1px solid rgba(251,191,36,0.18)',
                        color: '#f5f1e8',
                      }}
                    >
                      {email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#f5f1e8' }}>{email}</p>
                      <p className="text-[10px]" style={{ color: 'rgba(245,241,232,0.45)' }}>Prayer partner</p>
                    </div>
                    <Heart className="w-4 h-4" style={{ color: 'rgba(251,191,36,0.65)' }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── My prayer requests ── */}
        <div>
          <SectionLabel>My prayer requests</SectionLabel>

          <div
            className="rounded-2xl p-4 mb-3"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(251,191,36,0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <textarea
              value={newRequest}
              onChange={e => setNewRequest(e.target.value)}
              placeholder="Share what's on your heart…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl text-sm resize-none outline-none mb-3 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#f5f1e8',
                caretColor: '#fbbf24',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '15px',
                lineHeight: '1.7',
              }}
            />
            <button
              onClick={() => newRequest.trim() && addRequest.mutate(newRequest.trim())}
              disabled={!newRequest.trim() || addRequest.isPending}
              className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                color: '#0f1729',
                boxShadow: '0 4px 16px -4px rgba(251,191,36,0.4)',
              }}
            >
              {addRequest.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Share prayer request
            </button>
          </div>

          {requests.filter(r => r.is_active).length === 0 && (
            <p className="text-xs italic text-center py-2" style={{ color: 'rgba(245,241,232,0.45)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              No active requests yet — share what's on your heart above.
            </p>
          )}

          <div className="space-y-2">
            {requests.filter(r => r.is_active).map(req => (
              <div
                key={req.id}
                className="rounded-xl p-3.5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'rgba(245,241,232,0.85)',
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '15px',
                    lineHeight: '1.65',
                  }}
                >
                  {req.text}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[10px]" style={{ color: 'rgba(245,241,232,0.40)' }}>
                    {req.prayed_by?.length || 0} {(req.prayed_by?.length || 0) === 1 ? 'prayer' : 'prayers'}
                  </p>
                  {req.is_answered ? (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(110,231,183,0.10)',
                        border: '1px solid rgba(110,231,183,0.30)',
                        color: '#6ee7b7',
                      }}
                    >
                      ✓ Answered
                    </span>
                  ) : (
                    <button
                      onClick={() => markAnswered.mutate(req.id)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors"
                      style={{
                        background: 'rgba(251,191,36,0.10)',
                        border: '1px solid rgba(251,191,36,0.30)',
                        color: '#fcd34d',
                      }}
                    >
                      Mark answered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pray for partners ── */}
        {partnerRequests.length > 0 && (
          <div>
            <SectionLabel>Pray for your partners</SectionLabel>
            <div className="space-y-2">
              {partnerRequests.map(req => {
                const alreadyPrayed = req.prayed_by?.includes(user.email) && req.last_prayed_date === today;
                return (
                  <div
                    key={req.id}
                    className="rounded-xl p-4"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(251,191,36,0.10)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <p
                      className="leading-relaxed mb-3"
                      style={{
                        color: '#f5f1e8',
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: '15px',
                        lineHeight: '1.65',
                      }}
                    >
                      {req.text}
                    </p>
                    <button
                      onClick={() => !alreadyPrayed && markPrayed.mutate(req)}
                      disabled={alreadyPrayed}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] active:scale-[0.98]"
                      style={
                        alreadyPrayed
                          ? {
                              background: 'rgba(110,231,183,0.10)',
                              border: '1px solid rgba(110,231,183,0.30)',
                              color: '#6ee7b7',
                              cursor: 'default',
                            }
                          : {
                              background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                              color: '#0f1729',
                              boxShadow: '0 4px 16px -4px rgba(251,191,36,0.4)',
                            }
                      }
                    >
                      {alreadyPrayed ? '✓ You prayed for this today' : '🙏 I prayed for this'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrayerPartners() {
  return <PageErrorBoundary><PrayerPartnersInner /></PageErrorBoundary>;
}
