import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

export default function DailyVerseSettings({ isOpen, onClose }) {
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState('08:00');
  const queryClient = useQueryClient();

  const { data: reminder } = useQuery({
    queryKey: ['dailyVerseReminder'],
    queryFn: async () => {
      const reminders = await base44.entities.DailyVerseReminder.list();
      return reminders[0] || null;
    }
  });

  useEffect(() => {
    if (reminder) {
      setEnabled(reminder.enabled);
      setTime(reminder.reminder_time);
    }
  }, [reminder]);

  const saveReminder = useMutation({
    mutationFn: async (data) => {
      if (reminder) {
        return base44.entities.DailyVerseReminder.update(reminder.id, data);
      } else {
        return base44.entities.DailyVerseReminder.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dailyVerseReminder']);
      onClose();
    }
  });

  const handleSave = () => {
    saveReminder.mutate({
      enabled,
      reminder_time: time,
      last_sent_date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#c9a227]" />
            Daily Verse Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enabled" className="text-base font-semibold">Enable Daily Verse</Label>
              <p className="text-sm text-gray-500 mt-1">
                Receive a daily Bible verse notification
              </p>
            </div>
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {enabled && (
            <div>
              <Label htmlFor="time" className="mb-2 block">Notification Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                You'll receive a new verse of the day at this time
              </p>
            </div>
          )}

          <div className="bg-[#faf8f5] rounded-lg p-4">
            <p className="text-sm text-gray-600">
              📖 Daily verses are curated to provide inspiration, encouragement, and wisdom for your spiritual journey.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#1a1a2e]" disabled={saveReminder.isPending}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}