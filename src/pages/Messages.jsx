import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MessageCircle, Loader2 } from 'lucide-react';
import ConversationList from '@/components/messages/ConversationList';
import ChatInterface from '@/components/messages/ChatInterface';
import { awardPoints } from '@/components/gamification/ProgressManager';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
    
    // Check for recipient in URL params
    const params = new URLSearchParams(window.location.search);
    const recipient = params.get('recipient');
    if (recipient) {
      setSelectedEmail(recipient);
    }
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const all = await base44.entities.Message.list('-created_date', 500);
      return all.filter(m => 
        m.sender_email === user?.email || m.receiver_email === user?.email
      );
    },
    enabled: !!user
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list()
  });

  const sendMessage = useMutation({
    mutationFn: async ({ receiverEmail, content }) => {
      const receiver = users.find(u => u.email === receiverEmail);
      return base44.entities.Message.create({
        sender_email: user.email,
        receiver_email: receiverEmail,
        content,
        sender_name: user.full_name || user.email,
        receiver_name: receiver?.full_name || receiverEmail,
        read: false
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(['messages']);
      if (user) {
        await awardPoints(user.email, 2, 'message_sent', 'messages_sent');
      }
    }
  });

  const markAsRead = useMutation({
    mutationFn: (ids) => {
      return Promise.all(ids.map(id => 
        base44.entities.Message.update(id, { read: true })
      ));
    },
    onSuccess: () => queryClient.invalidateQueries(['messages'])
  });

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (selectedEmail && user) {
      const unreadMessages = messages.filter(m => 
        m.sender_email === selectedEmail && 
        m.receiver_email === user.email && 
        !m.read
      );
      if (unreadMessages.length > 0) {
        markAsRead.mutate(unreadMessages.map(m => m.id));
      }
    }
  }, [selectedEmail, messages, user]);

  const handleSendMessage = (receiverEmail, content) => {
    sendMessage.mutate({ receiverEmail, content });
  };

  const handleSelectConversation = (email) => {
    setSelectedEmail(email);
  };

  const handleBack = () => {
    setSelectedEmail(null);
  };

  // Get unread count
  const unreadCount = messages.filter(m => 
    m.receiver_email === user?.email && !m.read
  ).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-20">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] text-white px-4 py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-7 h-7" />
            Messages
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-[#c9a227] text-white text-sm font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden bg-white dark:bg-[#2d2d4a]">
          {/* Conversation List - Hidden on mobile when chat is open */}
          <div className={`w-full lg:w-96 border-r border-gray-200 dark:border-gray-700 ${
            selectedEmail ? 'hidden lg:block' : 'block'
          }`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin" />
              </div>
            ) : (
              <ConversationList
                messages={messages}
                user={user}
                onSelectConversation={handleSelectConversation}
                selectedEmail={selectedEmail}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
          </div>

          {/* Chat Interface */}
          <div className={`flex-1 ${
            selectedEmail ? 'block' : 'hidden lg:block'
          }`}>
            {selectedEmail ? (
              <ChatInterface
                selectedEmail={selectedEmail}
                messages={messages}
                user={user}
                onBack={handleBack}
                onSendMessage={handleSendMessage}
                isSending={sendMessage.isPending}
              />
            ) : (
              <div className="hidden lg:flex h-full items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}