import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp } from 'lucide-react';

export default function LogProgressModal({ isOpen, onClose, onSubmit, challenge, currentProgress }) {
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      value: parseFloat(value),
      note,
      date: new Date().toISOString()
    });
    setValue('');
    setNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Your Progress</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="bg-purple-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Progress</span>
              <span className="font-semibold text-purple-600">
                {currentProgress} / {challenge.goal_value} {challenge.goal_unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                style={{ width: `${(currentProgress / challenge.goal_value) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="value">
              Add Progress ({challenge.goal_unit})
            </Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`e.g., 8 ${challenge.goal_unit}`}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did it go today?"
              rows={3}
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Log Progress
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}