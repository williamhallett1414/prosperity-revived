import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CreatePostModal({ isOpen, onClose, onSubmit, initialVerse = null }) {
  const [content, setContent] = useState('');
  const [verse, setVerse] = useState(initialVerse);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({
        content: content.trim(),
        ...(verse && {
          verse_book: verse.book,
          verse_chapter: verse.chapter,
          verse_number: verse.verse,
          verse_text: verse.text
        })
      });
      setContent('');
      setVerse(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Your Thoughts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {verse && (
            <div className="bg-[#faf8f5] rounded-xl p-3 border-l-4 border-[#c9a227]">
              <p className="font-serif text-sm text-gray-800 mb-1">"{verse.text}"</p>
              <p className="text-xs text-gray-600">
                {verse.book} {verse.chapter}:{verse.verse}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVerse(null)}
                className="mt-2 h-7 text-xs"
              >
                Remove verse
              </Button>
            </div>
          )}

          <div>
            <Label>Your Thoughts</Label>
            <Textarea
              placeholder="Share your insights, reflections, or questions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] mt-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}