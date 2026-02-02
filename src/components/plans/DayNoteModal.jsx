import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BookOpen } from 'lucide-react';

export default function DayNoteModal({ isOpen, onClose, day, note, onSave }) {
  const [noteText, setNoteText] = useState(note?.note || '');

  useEffect(() => {
    setNoteText(note?.note || '');
  }, [note]);

  const handleSave = () => {
    if (noteText.trim()) {
      onSave(day, noteText.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c9a227]" />
            Day {day} Notes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Your Reflections</Label>
            <Textarea
              placeholder="Write your thoughts, insights, or reflections for this day's reading..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[180px] mt-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!noteText.trim()}
              className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
            >
              Save Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}