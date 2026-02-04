import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default function ConversationList({ messages, user, onSelectConversation, selectedEmail, searchQuery, onSearchChange }) {
  // Group messages by conversation
  const conversations = useMemo(() => {
    if (!user) return [];
    
    const convMap = new Map();
    
    messages.forEach(msg => {
      const otherEmail = msg.sender_email === user.email ? msg.receiver_email : msg.sender_email;
      const otherName = msg.sender_email === user.email ? 
        (msg.receiver_name || msg.receiver_email) : 
        (msg.sender_name || msg.sender_email);
      
      if (!convMap.has(otherEmail)) {
        convMap.set(otherEmail, {
          email: otherEmail,
          name: otherName,
          messages: [],
          unreadCount: 0
        });
      }
      
      const conv = convMap.get(otherEmail);
      conv.messages.push(msg);
      
      // Count unread messages (sent to current user and not read)
      if (msg.receiver_email === user.email && !msg.read) {
        conv.unreadCount++;
      }
    });
    
    // Sort by latest message
    return Array.from(convMap.values())
      .map(conv => ({
        ...conv,
        lastMessage: conv.messages.sort((a, b) => 
          new Date(b.created_date) - new Date(a.created_date)
        )[0]
      }))
      .filter(conv => 
        !searchQuery || 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => 
        new Date(b.lastMessage.created_date) - new Date(a.lastMessage.created_date)
      );
  }, [messages, user, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conv, index) => (
              <motion.button
                key={conv.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectConversation(conv.email)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-[#2d2d4a] transition-colors ${
                  selectedEmail === conv.email ? 'bg-gray-100 dark:bg-[#2d2d4a]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {conv.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#1a1a2e] dark:text-white truncate">
                        {conv.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                        {format(new Date(conv.lastMessage.created_date), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conv.lastMessage.sender_email === user.email && 'You: '}
                        {conv.lastMessage.content}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#c9a227] text-white text-xs font-bold rounded-full flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}