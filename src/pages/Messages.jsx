import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const params = new URLSearchParams(window.location.search);
  const friendEmail = params.get('friend');
  const friendName = params.get('name');

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', friendEmail],
    queryFn: async () => {
      const all = await base44.entities.Message.list();
      return all
        .filter(m => 
          (m.sender_email === user?.email && m.receiver_email === friendEmail) ||
          (m.sender_email === friendEmail && m.receiver_email === user?.email)
        )
        .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    },
    enabled: !!user && !!friendEmail,
    refetchInterval: 3000 // Poll for new messages
  });

  const sendMessage = useMutation({
    mutationFn: (content) => base44.entities.Message.create({
      sender_email: user.email,
      receiver_email: friendEmail,
      sender_name: user.full_name || user.email,
      content
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      setMessage('');
    }
  });

  // Mark messages as read
  useEffect(() => {
    if (user && messages.length > 0) {
      const unreadMessages = messages.filter(
        m => m.receiver_email === user.email && !m.read
      );
      unreadMessages.forEach(m => {
        base44.entities.Message.update(m.id, { read: true });
      });
    }
  }, [messages, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage.mutate(message.trim());
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <Link
          to={createPageUrl('Friends')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold">
            {friendName?.charAt(0) || friendEmail?.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-[#1a1a2e]">{friendName}</h2>
            <p className="text-xs text-gray-500">{friendEmail}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_email === user.email;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isMe
                        ? 'bg-[#1a1a2e] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {format(new Date(msg.created_date), 'h:mm a')}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessage.isPending}
            className="bg-[#1a1a2e]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}