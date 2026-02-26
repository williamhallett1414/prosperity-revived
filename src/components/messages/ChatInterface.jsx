import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';

export default function ChatInterface({ 
  selectedEmail, 
  messages, 
  user, 
  onBack, 
  onSendMessage,
  isSending 
}) {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const conversationMessages = messages
    .filter(m => 
      (m.sender_email === user.email && m.receiver_email === selectedEmail) ||
      (m.sender_email === selectedEmail && m.receiver_email === user.email)
    )
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  const otherUser = conversationMessages[0]?.sender_email === user.email 
    ? conversationMessages[0]?.receiver_name || selectedEmail
    : conversationMessages[0]?.sender_name || selectedEmail;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedEmail]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(selectedEmail, messageText);
      setMessageText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d4a]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="lg:hidden w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a2e] flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(createPageUrl(`UserProfile?email=${selectedEmail}`))}
            className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold">
              {otherUser.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1a1a2e] dark:text-white">{otherUser}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedEmail}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#1a1a2e]">
        {conversationMessages.map((msg, index) => {
          const isOwn = msg.sender_email === user.email;
          const showDate = index === 0 || 
            format(new Date(conversationMessages[index - 1].created_date), 'yyyy-MM-dd') !== 
            format(new Date(msg.created_date), 'yyyy-MM-dd');

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center mb-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-[#2d2d4a] px-3 py-1 rounded-full">
                    {format(new Date(msg.created_date), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-[#1a1a2e] text-white rounded-br-md'
                      : 'bg-white dark:bg-[#2d2d4a] text-gray-800 dark:text-white rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {format(new Date(msg.created_date), 'HH:mm')}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d4a]">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none min-h-[44px] max-h-32"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
            className="bg-[#1a1a2e] hover:bg-[#2d2d4a] px-4"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}