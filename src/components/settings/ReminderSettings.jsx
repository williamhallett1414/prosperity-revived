import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Dumbbell, Heart, Bell, Save } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function ReminderSettings() {
  const [user, setUser] = useState(null);
  const [reminders, setReminders] = useState({
    daily_verse: { enabled: false, time: '08:00' },
    reading_plan: { enabled: false, time: '07:00' },
    workout: { enabled: false, time: '06:00' },
    meditation: { enabled: false, time: '20:00' }
  });
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u.reminder_settings) {
        setReminders(u.reminder_settings);
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      reminder_settings: reminders
    });
    queryClient.invalidateQueries(['currentUser']);
    setSaving(false);
  };

  const reminderTypes = [
    { key: 'daily_verse', label: 'Daily Verse', icon: BookOpen, color: 'amber' },
    { key: 'reading_plan', label: 'Reading Plan', icon: BookOpen, color: 'indigo' },
    { key: 'workout', label: 'Workout', icon: Dumbbell, color: 'emerald' },
    { key: 'meditation', label: 'Meditation', icon: Heart, color: 'purple' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-[#c9a227]" />
        <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">Daily Reminders</h3>
      </div>

      {reminderTypes.map(({ key, label, icon: Icon, color }) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <p className="font-medium text-[#1a1a2e] dark:text-white">{label}</p>
            </div>
            <Button
              size="sm"
              variant={reminders[key].enabled ? 'default' : 'outline'}
              onClick={() => setReminders(prev => ({
                ...prev,
                [key]: { ...prev[key], enabled: !prev[key].enabled }
              }))}
              className={reminders[key].enabled ? `bg-${color}-600 hover:bg-${color}-700` : ''}
            >
              {reminders[key].enabled ? 'On' : 'Off'}
            </Button>
          </div>

          {reminders[key].enabled && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Time:</label>
              <Input
                type="time"
                value={reminders[key].time}
                onChange={(e) => setReminders(prev => ({
                  ...prev,
                  [key]: { ...prev[key], time: e.target.value }
                }))}
                className="w-32 h-8"
              />
            </div>
          )}
        </motion.div>
      ))}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gradient-to-r from-[#c9a227] to-[#8fa68a] hover:opacity-90"
      >
        {saving ? (
          'Saving...'
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Reminders
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Note: Reminders are currently visual only. Push notifications coming soon!
      </p>
    </div>
  );
}