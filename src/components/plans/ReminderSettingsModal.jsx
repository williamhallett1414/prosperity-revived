import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';

export default function ReminderSettingsModal({ isOpen, onClose, progress, onSave }) {
  const [reminderEnabled, setReminderEnabled] = useState(progress?.reminder_enabled || false);
  const [reminderTime, setReminderTime] = useState(progress?.reminder_time || '09:00');

  useEffect(() => {
    setReminderEnabled(progress?.reminder_enabled || false);
    setReminderTime(progress?.reminder_time || '09:00');
  }, [progress]);

  const handleSave = () => {
    onSave({
      reminder_enabled: reminderEnabled,
      reminder_time: reminderTime
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#c9a227]" />
            Daily Reminder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Reminders</Label>
              <p className="text-sm text-gray-500">Get daily notifications to read</p>
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>

          {reminderEnabled && (
            <div>
              <Label>Reminder Time</Label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll receive a notification at this time every day
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}