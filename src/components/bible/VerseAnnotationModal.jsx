import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const highlightColors = {
  yellow: { bg: 'bg-yellow-200', label: 'Yellow' },
  green: { bg: 'bg-green-200', label: 'Green' },
  blue: { bg: 'bg-blue-200', label: 'Blue' },
  pink: { bg: 'bg-pink-200', label: 'Pink' },
  purple: { bg: 'bg-[#D9B878]/30', label: 'Purple' }
};

export default function VerseAnnotationModal({ isOpen, onClose, verse, bookmark, onSave }) {
  const [note, setNote] = useState(bookmark?.note || '');
  const [color, setColor] = useState(bookmark?.highlight_color || 'yellow');

  const handleSave = () => {
    onSave({ note, color });
    onClose();
  };

  if (!verse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Annotate Verse</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Verse Display */}
          <div className="bg-[#faf8f5] rounded-lg p-4 border-l-4 border-[#c9a227]">
            <p className="font-serif text-gray-800 leading-relaxed mb-2">
              {verse.text}
            </p>
            <p className="text-sm text-gray-600">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
          </div>

          {/* Highlight Color */}
          <div>
            <Label className="mb-2 block">Highlight Color</Label>
            <div className="flex gap-2">
              {Object.entries(highlightColors).map(([key, { bg, label }]) => (
                <button
                  key={key}
                  onClick={() => setColor(key)}
                  className={`w-10 h-10 rounded-full ${bg} border-2 ${
                    color === key ? 'border-[#1a1a2e] scale-110' : 'border-white'
                  } transition-all hover:scale-105`}
                  title={label}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="note" className="mb-2 block">Personal Notes</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your thoughts, reflections, or insights about this verse..."
              className="min-h-[120px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#1a1a2e]">
              Save Annotation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}