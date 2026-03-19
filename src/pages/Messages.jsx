import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  MessageCircle, Search, ArrowLeft, Send, Loader2,
  ChevronRight, X, Bot, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { awardPoints } from '@/components/gamification/ProgressManager';
import { format, isToday, isYesterday } from 'date-fns';

// ─── AI Coach shortcuts ───────────────────────────────────────────────────────
const AI_COACHES = [
  { key: 'Gideon',      name: 'Gideon',        role: 'Biblical Wisdom',         icon: 'G', color: '#c9a227', bg: 'from-[#1a0f00] to-[#7c5a00]' },
  { key: 'Hannah',      name: 'Hannah',         role: 'Mindset & Growth',        icon: 'H', color: '#AFC7E3', bg: 'from-[#1a2d3d] to-[#3C4E53]' },
  { key: 'CoachDavid',  name: 'Coach David',    role: 'Fitness & Wellness',      icon: 'D', color: '#38BDF8', bg: 'from-[#0a1628] to-[#1e3a5f]' },
  { key: 'ChefDaniel',  name: 'Chef Daniel',    role: 'Nutrition & Meals',       icon: 'C', color: '#22c55e', bg: 'from-[#052e16] to-[#166534]' },
  { key: 'CoachPaul',   name: 'Coach Paul',     role: 'Discipline & Leadership', icon: 'P', color: '#A78BFA', bg: 'from-[#0A1A2F] to-[#0A1A2F]' },
];

// ─── Date formatting ──────────────────────────────────────────────────────────
function formatMsgDate(dateStr) {
  const d = new Date(dateStr);
  if (isToday(d))     return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
}

// ─── Avatar (initials) ────────────────────────────────────────────────────────
function Avatar({ name = '', size = 'md' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = ['from-violet-500 to-purple-400', 'from-rose-500 to-pink-400',
    'from-amber-500 to-yellow-400', 'from-sky-500 to-cyan-400',
    'from-emerald-500 to-teal-400', 'from-orange-500 to-amber-400'];
  const color = colors[(name.charCodeAt(0) || 0) % colors.length];
  const sz = size === 'lg' ? 'w-12 h-12 text-base' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Build conversations from message list ────────────────────────────────────
function buildConversations(messages, userEmail) {
  const map = new Map();
  messages.forEach(msg => {
    const other = msg.sender_email === userEmail ? msg.receiver_email : msg.sender_email;
    const name  = msg.sender_email === userEmail
      ? (msg.receiver_name || msg.receiver_email)
      : (msg.sender_name  || msg.sender_email);
    if (!map.has(other)) map.set(other, { email: other, name, messages: [], unread: 0 });
    const c = map.get(other);
    c.messages.push(msg);
    if (msg.receiver_email === userEmail && !msg.read) c.unread++;
  });
  return [...map.values()]
    .map(c => ({ ...c, last: c.messages.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0] }))
    .sort((a, b) => new Date(b.last.created_date) - new Date(a.last.created_date));
}

// ─── Conversation row ─────────────────────────────────────────────────────────
function ConvRow({ conv, isSelected, userEmail, onClick, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
        isSelected ? 'bg-white' : 'hover:bg-[#F2F6FA]'
      }`}
    >
      <Avatar name={conv.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-[#0A1A2F]' : 'font-semibold text-[#0A1A2F]'}`}>
            {conv.name}
          </p>
          <span className="text-[10px] text-[#0A1A2F]/35 flex-shrink-0 ml-2">
            {formatMsgDate(conv.last.created_date)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs truncate ${conv.unread > 0 ? 'text-[#0A1A2F]/70 font-medium' : 'text-[#0A1A2F]/45'}`}>
            {conv.last.sender_email === userEmail && <span className="text-[#0A1A2F]/30">You: </span>}
            {conv.last.content}
          </p>
          {conv.unread > 0 && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#c9a227] text-white text-[10px] font-bold flex items-center justify-center">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Chat thread ──────────────────────────────────────────────────────────────
function ChatThread({ conv, messages, userEmail, onSend, isSending, onBack }) {
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const thread = messages
    .filter(m =>
      (m.sender_email === userEmail && m.receiver_email === conv.email) ||
      (m.sender_email === conv.email && m.receiver_email === userEmail)
    )
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread.length]);
  useEffect(() => { inputRef.current?.focus(); }, [conv.email]);

  const handleSend = () => {
    const t = text.trim();
    if (!t || isSending) return;
    onSend(conv.email, t);
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F2F6FA] bg-white flex-shrink-0">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#F2F6FA] hover:bg-white flex items-center justify-center transition-colors lg:hidden">
          <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
        </button>
        <Avatar name={conv.name} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#0A1A2F] truncate">{conv.name}</p>
          <p className="text-xs text-[#0A1A2F]/40 truncate">{conv.email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#F2F6FA]">
        {thread.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Avatar name={conv.name} size="lg" />
            <p className="text-sm font-semibold text-[#0A1A2F] mt-3 mb-1">{conv.name}</p>
            <p className="text-xs text-[#0A1A2F]/40">Start the conversation</p>
          </div>
        )}
        {thread.map((msg, i) => {
          const isOwn = msg.sender_email === userEmail;
          const showDate = i === 0 ||
            format(new Date(thread[i-1].created_date), 'yyyy-MM-dd') !== format(new Date(msg.created_date), 'yyyy-MM-dd');
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center justify-center my-3">
                  <span className="text-[10px] font-semibold text-[#0A1A2F]/30 bg-white border border-[#F2F6FA] rounded-full px-3 py-1">
                    {isToday(new Date(msg.created_date)) ? 'Today' : isYesterday(new Date(msg.created_date)) ? 'Yesterday' : format(new Date(msg.created_date), 'MMM d')}
                  </span>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? 'bg-[#0A1A2F] text-white rounded-br-md'
                    : 'bg-white text-[#0A1A2F] border border-[#F2F6FA] rounded-bl-md'
                }`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/40' : 'text-[#0A1A2F]/30'}`}>
                    {format(new Date(msg.created_date), 'h:mm a')}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-[#F2F6FA] bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message…"
            className="flex-1 bg-[#F2F6FA] rounded-2xl px-4 py-2.5 text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/30 outline-none border border-transparent focus:border-[#FAD98D]/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30"
            style={{ background: text.trim() ? 'linear-gradient(135deg, #FAD98D, #c9a227)' : '#F2F6FA' }}
          >
            {isSending
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className={`w-4 h-4 ${text.trim() ? 'text-[#0A1A2F]' : 'text-[#0A1A2F]/30'}`} />
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Messages() {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const [user, setUser]             = useState(null);
  const [selectedEmail, setSelected] = useState(null);
  const [search, setSearch]         = useState('');
  const [tab, setTab]               = useState('dms'); // 'dms' | 'coaches'

  // Load current user + open conversation from URL
  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      const params = new URLSearchParams(window.location.search);
      // Support both ?recipient= (from UserProfile) and ?friend= (from Friends page)
      const email = params.get('recipient') || params.get('friend');
      const name  = params.get('name');
      if (email) {
        setSelected(email);
        // Seed the conversation stub so it appears even before first message
        if (name) queryClient.setQueryData(['conv-name', email], name);
      }
    });
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const all = await base44.entities.Message.list('-created_date', 500);
      return all.filter(m => m.sender_email === user?.email || m.receiver_email === user?.email);
    },
    enabled: !!user,
    refetchInterval: 8000,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const sendMessage = useMutation({
    mutationFn: async ({ receiverEmail, content }) => {
      const receiver = users.find(u => u.email === receiverEmail);
      return base44.entities.Message.create({
        sender_email:   user.email,
        receiver_email: receiverEmail,
        content,
        sender_name:    user.full_name || user.email,
        receiver_name:  receiver?.full_name || receiverEmail,
        read: false,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(['messages']);
      if (user) await awardPoints(user.email, 2, 'message_sent', 'messages_sent');
    },
  });

  const markRead = useMutation({
    mutationFn: ids => Promise.all(ids.map(id => base44.entities.Message.update(id, { read: true }))),
    onSuccess: () => queryClient.invalidateQueries(['messages']),
  });

  // Mark unread when opening a thread
  useEffect(() => {
    if (!selectedEmail || !user) return;
    const unread = messages.filter(m =>
      m.sender_email === selectedEmail && m.receiver_email === user.email && !m.read
    );
    if (unread.length) markRead.mutate(unread.map(m => m.id));
  }, [selectedEmail, messages.length]);

  const conversations = useMemo(() =>
    user ? buildConversations(messages, user.email) : [],
    [messages, user]
  );

  const filtered = useMemo(() =>
    conversations.filter(c =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [conversations, search]
  );

  const selectedConv = useMemo(() => {
    if (!selectedEmail) return null;
    const existing = conversations.find(c => c.email === selectedEmail);
    if (existing) return existing;
    // Stub for new conversation (no messages yet)
    const u = users.find(u => u.email === selectedEmail);
    return { email: selectedEmail, name: u?.full_name || selectedEmail, messages: [], unread: 0 };
  }, [selectedEmail, conversations, users]);

  const totalUnread = messages.filter(m => m.receiver_email === user?.email && !m.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] flex flex-col" style={{ maxHeight: '100dvh' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#F2F6FA] px-4 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <h1 className="text-base font-bold text-[#0A1A2F] flex items-center gap-2 flex-1">
            Messages
            {totalUnread > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#c9a227] text-white rounded-full">
                {totalUnread}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* ── Two-pane layout ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden max-w-2xl mx-auto w-full lg:max-w-5xl">

        {/* LEFT: conversation list (hidden on mobile when thread open) */}
        <div className={`flex flex-col flex-shrink-0 w-full lg:w-80 lg:border-r lg:border-[#F2F6FA] bg-white ${selectedConv ? 'hidden lg:flex' : 'flex'}`}>

          {/* Tab switcher: DMs | Coaches */}
          <div className="flex border-b border-[#F2F6FA] flex-shrink-0">
            {[
              { id: 'dms',     label: 'Messages', icon: Users },
              { id: 'coaches', label: 'AI Coaches', icon: Bot },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-colors border-b-2 ${
                  tab === t.id
                    ? 'border-[#c9a227] text-[#0A1A2F]'
                    : 'border-transparent text-[#0A1A2F]/40 hover:text-[#0A1A2F]/60'
                }`}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'dms' && (
            <>
              {/* Search */}
              <div className="px-4 py-3 border-b border-[#F2F6FA] flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1A2F]/30" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search conversations…"
                    className="w-full pl-9 pr-3 py-2 bg-[#F2F6FA] rounded-xl text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/30 outline-none"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-3.5 h-3.5 text-[#0A1A2F]/30" />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#F2F6FA]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-[#c9a227] animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <MessageCircle className="w-10 h-10 text-[#0A1A2F]/10 mb-3" />
                    <p className="text-sm font-semibold text-[#0A1A2F]/40">
                      {search ? 'No conversations found' : 'No messages yet'}
                    </p>
                    {!search && (
                      <p className="text-xs text-[#0A1A2F]/25 mt-1 leading-relaxed">
                        Go to Friends and tap "Message" to start a conversation
                      </p>
                    )}
                    {!search && (
                      <button onClick={() => navigate(createPageUrl('Friends'))}
                        className="mt-4 text-xs font-bold text-[#c9a227] hover:text-[#C9A227] transition-colors">
                        Go to Friends →
                      </button>
                    )}
                  </div>
                ) : (
                  filtered.map((conv, i) => (
                    <ConvRow
                      key={conv.email}
                      conv={conv}
                      isSelected={selectedEmail === conv.email}
                      userEmail={user.email}
                      onClick={() => setSelected(conv.email)}
                      index={i}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {tab === 'coaches' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-xs text-[#0A1A2F]/35 leading-relaxed">
                Your AI coaches are available 24/7. Each specialises in a different area of your growth journey.
              </p>
              {AI_COACHES.map((coach, i) => (
                <motion.button
                  key={coach.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(createPageUrl(`ChatScreen?bot=${coach.key}`))}
                  className="w-full flex items-center gap-3 bg-white rounded-2xl border border-[#F2F6FA] hover:border-[#FAD98D]/40 hover:shadow-sm p-4 transition-all text-left"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${coach.bg} flex items-center justify-center flex-shrink-0`}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: 0 }}>{coach.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#0A1A2F]">{coach.name}</p>
                    <p className="text-xs text-[#0A1A2F]/45">{coach.role}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: chat thread / empty state */}
        <div className={`flex-1 flex flex-col overflow-hidden ${selectedConv ? 'flex' : 'hidden lg:flex'}`}>
          {selectedConv ? (
            <ChatThread
              conv={selectedConv}
              messages={messages}
              userEmail={user.email}
              onSend={(email, content) => sendMessage.mutate({ receiverEmail: email, content })}
              isSending={sendMessage.isPending}
              onBack={() => setSelected(null)}
            />
          ) : (
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center text-center p-8">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="w-16 h-16 rounded-2xl bg-[#F2F6FA] flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-[#0A1A2F]/20" />
                </div>
                <p className="text-sm font-semibold text-[#0A1A2F]/40 mb-1">No conversation selected</p>
                <p className="text-xs text-[#0A1A2F]/25">Pick one from the list or start a new one via Friends</p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
