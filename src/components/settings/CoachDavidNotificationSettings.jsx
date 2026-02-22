import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dumbbell } from 'lucide-react';

export default function CoachDavidNotificationSettings({ user }) {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const results = await base44.entities.CoachDavidNotificationSettings.filter({
        user_email: user.email
      });

      if (results.length > 0) {
        setSettings(results[0]);
      } else {
        const newSettings = {
          user_email: user.email,
          morning_enabled: true,
          morning_time: '07:00',
          midday_enabled: true,
          midday_time: '12:00',
          afternoon_enabled: true,
          afternoon_time: '17:00',
          evening_enabled: true,
          evening_time: '21:00'
        };
        const created = await base44.entities.CoachDavidNotificationSettings.create(newSettings);
        setSettings(created);
      }
    } catch (error) {
      toast.error('Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates) => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const updated = await base44.entities.CoachDavidNotificationSettings.update(settings.id, updates);
      setSettings(updated);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Dumbbell className="w-6 h-6 text-[#D9B878]" />
        <h3 className="text-xl font-bold text-[#0A1A2F]">Coach David Notifications</h3>
      </div>

      <div className="space-y-6">
        {/* Morning */}
        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-[#0A1A2F]">🔥 Morning Discipline</h4>
              <p className="text-sm text-gray-600">Start your day with discipline & planning</p>
            </div>
            <Switch
              checked={settings.morning_enabled}
              onCheckedChange={(checked) =>
                updateSettings({ morning_enabled: checked })
              }
            />
          </div>
          {settings.morning_enabled && (
            <input
              type="time"
              value={settings.morning_time}
              onChange={(e) => updateSettings({ morning_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          )}
        </div>

        {/* Midday */}
        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-[#0A1A2F]">⚡ Midday Movement</h4>
              <p className="text-sm text-gray-600">Hydration & movement check-in</p>
            </div>
            <Switch
              checked={settings.midday_enabled}
              onCheckedChange={(checked) =>
                updateSettings({ midday_enabled: checked })
              }
            />
          </div>
          {settings.midday_enabled && (
            <input
              type="time"
              value={settings.midday_time}
              onChange={(e) => updateSettings({ midday_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          )}
        </div>

        {/* Afternoon */}
        <div className="border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-[#0A1A2F]">💪 Afternoon Accountability</h4>
              <p className="text-sm text-gray-600">Motivation & performance push</p>
            </div>
            <Switch
              checked={settings.afternoon_enabled}
              onCheckedChange={(checked) =>
                updateSettings({ afternoon_enabled: checked })
              }
            />
          </div>
          {settings.afternoon_enabled && (
            <input
              type="time"
              value={settings.afternoon_time}
              onChange={(e) => updateSettings({ afternoon_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          )}
        </div>

        {/* Evening */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-[#0A1A2F]">😴 Evening Recovery</h4>
              <p className="text-sm text-gray-600">Rest & reflection</p>
            </div>
            <Switch
              checked={settings.evening_enabled}
              onCheckedChange={(checked) =>
                updateSettings({ evening_enabled: checked })
              }
            />
          </div>
          {settings.evening_enabled && (
            <input
              type="time"
              value={settings.evening_time}
              onChange={(e) => updateSettings({ evening_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        💡 Coach David will send you personalized motivational messages, fitness insights, and coaching questions at these times to keep you accountable and inspired.
      </div>
    </motion.div>
  );
}