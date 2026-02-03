import React, { useState } from 'react';
import { X, Image, Loader2 } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function CreatePostModal({ isOpen, onClose, onSubmit, initialVerse = null }) {
  const [content, setContent] = useState('');
  const [verse, setVerse] = useState(initialVerse);
  const [topic, setTopic] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setMediaUrl(file_url);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    } catch (error) {
      console.error('Upload failed', error);
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({
        content: content.trim(),
        topic,
        ...(verse && {
          verse_book: verse.book,
          verse_chapter: verse.chapter,
          verse_number: verse.verse,
          verse_text: verse.text
        }),
        ...(mediaUrl && mediaType === 'image' && { image_url: mediaUrl }),
        ...(mediaUrl && mediaType === 'video' && { video_url: mediaUrl })
      });
      setContent('');
      setVerse(null);
      setTopic('general');
      setMediaUrl(null);
      setMediaType(null);
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
            <Label>Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">💬 General</SelectItem>
                <SelectItem value="prayer">🙏 Prayer</SelectItem>
                <SelectItem value="bible_study">📖 Bible Study</SelectItem>
                <SelectItem value="testimony">✨ Testimony</SelectItem>
                <SelectItem value="question">❓ Question</SelectItem>
                <SelectItem value="encouragement">💝 Encouragement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Your Thoughts</Label>
            <Textarea
              placeholder="Share your insights, reflections, or questions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] mt-2"
            />
          </div>

          {mediaUrl && (
            <div className="relative rounded-lg overflow-hidden">
              {mediaType === 'image' ? (
                <img src={mediaUrl} alt="Upload" className="w-full h-48 object-cover" />
              ) : (
                <video src={mediaUrl} controls className="w-full h-48" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setMediaUrl(null); setMediaType(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="media-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('media-upload').click()}
              disabled={uploading || mediaUrl}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4 mr-2" />
                  Add Image or Video
                </>
              )}
            </Button>
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