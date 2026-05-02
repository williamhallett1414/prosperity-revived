import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const notificationTypes = [
  {
    id: 'friend_requests',
    label: 'Friend Requests',
    description: 'Get notified when someone sends you a friend request',
    icon: '👋'
  },
  {
    id: 'comments',
    label: 'Comments',
    description: 'Get notified when someone comments on your posts',
    icon: '💬'
  },
  {
    id: 'mentions',
    label: 'Mentions',
    description: 'Get notified when someone mentions you',
    icon: '📣'
  },
  {
    id: 'likes',
    label: 'Likes',
    description: 'Get notified when someone likes your posts',
    icon: '❤️'
  },
  {
    id: 'group_activity',
    label: 'Group Activity',
    description: 'Get notified about activity in your groups',
    icon: '👥'
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Get notified when you receive new messages',
    icon: '✉️'
  },
  {
    id: 'achievements',
    label: 'Achievements',
    description: 'Get notified when you unlock badges or reach milestones',
    icon: '🏆'
  }
];

export default function NotificationSettings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setSettings(u.notification_settings || {
        friend_requests: true,
        comments: true,
        mentions: true,
        likes: true,
        group_activity: true,
        messages: true,
        achievements: true
      });
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await base44.auth.updateMe({ notification_settings: settings });
      toast.success('Notification settings saved');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white">Notifications</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Manage your alerts</p>
          </div>
        </div>
      </div>

        <Loader2 className="w-8 h-8 text-[#c9a227] animate-spin" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] text-white px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notification Settings
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Choose what notifications you want to receive
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
        <div className="space-y-3 mb-6">
          {notificationTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-white/5 dark:bg-[#0A1A2F] rounded-xl p-4 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl mt-0.5">{type.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0A1A2F] dark:text-white mb-1">
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-300">
                      {type.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings[type.id] !== false}
                  onCheckedChange={() => handleToggle(type.id)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] hover:from-[#E89020] hover:to-[#C9A227] h-12"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
