import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Send, Users, Plus, Check, Bell, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { todayKey } from '@/utils/localDate';
import { toast } from 'sonner';

class PageErrorBoundary extends React.Component {
  constructor(p){super(p);this.state={e:null};}
  static getDerivedStateFromError(e){return{e};}
  render(){if(this.state.e)return<div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6"><p className="text-lg font-bold dark:text-white mb-2">Something went wrong</p><button onClick={()=>this.setState({e:null})} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button></div>;return this.props.children;}
}

function PrayerPartnersInner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRequest, setNewRequest] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const today = todayKey();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

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

  const addPartner = useMutation({
    mutationFn: (email) => base44.entities.PrayerPartnership.create({
      user_email: user.email,
      partner_email: email.toLowerCase().trim(),
      status: 'pending',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerPartners']);
      setPartnerEmail('');
      toast.success('Prayer partner request sent!');
    },
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

  if (!user) {
    return <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const activePartners = partnerships.filter(p => p.status === 'accepted');
  const pendingPartners = partnerships.filter(p => p.status === 'pending');

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#0A1A2F] dark:text-white">Prayer Partners</h1>
            <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Bear one another's burdens — Galatians 6:2</p>
          </div>
        </div>

        {/* Intro card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/20 to-indigo-900/15 dark:from-purple-900/15 dark:to-indigo-900/10 rounded-2xl p-5 border border-purple-200/20 dark:border-purple-800/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">🙏</div>
            <div>
              <h2 className="text-base font-bold text-[#0A1A2F] dark:text-white">Pray Together</h2>
              <p className="text-xs text-[#0A1A2F]/50 dark:text-white/45">Share requests privately with a trusted partner</p>
            </div>
          </div>
          <p className="text-xs text-[#0A1A2F]/60 dark:text-white/50 leading-relaxed">
            When you pray for your partner, they'll receive a notification: "Someone prayed for you today." No details shared — just the knowledge that someone lifted them up.
          </p>
        </motion.div>

        {/* Add Partner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
          <p className="text-sm font-bold text-[#0A1A2F] dark:text-white mb-3">Add a Prayer Partner</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              placeholder="Partner's email address"
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white placeholder:text-gray-400"
            />
            <Button
              onClick={() => partnerEmail && addPartner.mutate(partnerEmail)}
              disabled={!partnerEmail || addPartner.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 min-h-[44px]"
            >
              {addPartner.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Active Partners */}
        {activePartners.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest px-1">Your Partners</p>
            {activePartners.map((p, i) => {
              const partnerEmail = p.user_email === user.email ? p.partner_email : p.user_email;
              return (
                <div key={p.id} className="bg-white dark:bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-white/10">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/25 flex items-center justify-center text-sm font-bold text-purple-600">
                    {partnerEmail[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white truncate">{partnerEmail}</p>
                    <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/35">Prayer partner</p>
                  </div>
                  <Heart className="w-4 h-4 text-purple-400" />
                </div>
              );
            })}
          </div>
        )}

        {/* My Prayer Requests */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest">My Prayer Requests</p>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
            <textarea
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              placeholder="Share what's on your heart..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white placeholder:text-gray-400 resize-none mb-2"
            />
            <Button
              onClick={() => newRequest.trim() && addRequest.mutate(newRequest.trim())}
              disabled={!newRequest.trim() || addRequest.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl min-h-[44px]"
            >
              {addRequest.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Share Prayer Request
            </Button>
          </div>

          {requests.filter(r => r.is_active).map(req => (
            <div key={req.id} className="bg-white dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/10">
              <p className="text-sm text-[#0A1A2F] dark:text-white leading-relaxed">{req.text}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/30">
                  {req.prayed_by?.length || 0} prayers
                </p>
                {req.is_answered ? (
                  <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">✓ Answered</span>
                ) : (
                  <button onClick={() => {
                    base44.entities.PrayerRequest.update(req.id, { is_answered: true });
                    queryClient.invalidateQueries(['prayerRequests']);
                    toast.success('Praise God! 🙌');
                  }}
                    className="text-[10px] font-bold text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                    Mark Answered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Partner's Requests — Pray for them */}
        {partnerRequests.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest px-1">Pray for Your Partners</p>
            {partnerRequests.map(req => {
              const alreadyPrayed = req.prayed_by?.includes(user.email) && req.last_prayed_date === today;
              return (
                <div key={req.id} className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10">
                  <p className="text-sm text-[#0A1A2F] dark:text-white leading-relaxed mb-3">{req.text}</p>
                  <button
                    onClick={() => !alreadyPrayed && markPrayed.mutate(req)}
                    disabled={alreadyPrayed}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all min-h-[44px] ${
                      alreadyPrayed
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100'
                    }`}
                  >
                    {alreadyPrayed ? '✓ You prayed for this today' : '🙏 I Prayed for This'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrayerPartners() {
  return <PageErrorBoundary><PrayerPartnersInner /></PageErrorBoundary>;
}
