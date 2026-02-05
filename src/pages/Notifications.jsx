import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Settings, Heart, MessageCircle, UserPlus, Users, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const notificationIcons = {
  friend_request: '👋',
  friend_accepted: '🤝',
  comment: '💬',
  mention: '📣',
  group_invite: '👥',
  group_post: '📝',
  like: '❤️',
  message: '✉️',
  plan_completed: '✅',
  achievement: '🏆'
};

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      const all = await base44.entities.Notification.list('-created_date', 100);
      return all.filter(n => n.recipient_email === user?.email);
    },
    enabled: !!user
  });

  const markAsRead = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      await Promise.all(unreadIds.map(id => base44.entities.Notification.update(id, { is_read: true })));
    },
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  const deleteNotification = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'social') return ['friend_request', 'friend_accepted', 'comment', 'mention', 'like'].includes(n.type);
    if (filter === 'groups') return ['group_invite', 'group_post'].includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] text-white px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-white/70 text-sm mt-1">{unreadCount} unread</p>
              )}
            </div>
            <Link to={createPageUrl('NotificationSettings')}>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsRead.mutate()}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm transition-all ${
                    !notification.is_read ? 'border-l-4 border-[#FD9C2D]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">
                      {notification.icon || notificationIcons[notification.type] || '🔔'}
                    </div>
                    
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold text-[#1a1a2e] dark:text-white ${
                          !notification.is_read ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-[#FD9C2D] rounded-full ml-2 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(notification.created_date).toLocaleDateString()} at{' '}
                        {new Date(notification.created_date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification.mutate(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}