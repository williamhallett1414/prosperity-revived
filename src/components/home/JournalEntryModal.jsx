import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Video, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import VideoRecorder from '@/components/video/VideoRecorder';

export default function JournalEntryModal({ isOpen, onClose }) {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [mode, setMode] = useState('text');
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoTranscript, setVideoTranscript] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);
  const queryClient = useQueryClient();

  const createEntry = useMutation({
    mutationFn: async (data) => {
      if (videoBlob) {
        try {
          const uploaded = await base44.entities.JournalEntry.uploadFile(videoBlob, `vlog-${Date.now()}.webm`);
          data.video_url = uploaded?.file_url || '';
          data.video_duration = videoDuration;
        } catch (e) {
          console.warn('Video upload not supported, saving transcript only:', e);
        }
      }
      return base44.entities.JournalEntry.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      resetForm();
      onClose();
      toast.success(videoBlob ? 'Video journal saved!' : 'Entry created!');
    }
  });

  const resetForm = () => {
    setNewTitle(''); setNewContent(''); setMode('text');
    setVideoBlob(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null); setVideoDuration(0); setVideoTranscript(''); setShowRecorder(false);
  };

  const handleCreateEntry = () => {
    if (mode === 'text' && !newContent.trim()) { toast.error('Please write something in your entry'); return; }
    if (mode === 'video' && !videoBlob && !videoTranscript) { toast.error('Please record a video first'); return; }
    createEntry.mutate({
      title: newTitle || (mode === 'video' ? 'Video Journal' : 'Untitled Entry'),
      content: mode === 'video'
        ? (videoTranscript || '[Video journal — no transcript available]') + (newContent ? '\n\n' + newContent : '')
        : newContent,
      entry_type: mode === 'video' ? 'video_journal' : 'general',
    });
  };

  const handleRecordingComplete = (blob, duration) => {
    setVideoBlob(blob); setVideoDuration(duration);
    const url = URL.createObjectURL(blob);
    setVideoUrl(url); setShowRecorder(false);
  };

  const handleTranscript = (text) => {
    setVideoTranscript(text);
    if (text && !newContent) setNewContent(text);
  };

  const handleClose = () => { resetForm(); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create Journal Entry</DialogTitle></DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-2">
          <button onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'text' ? 'bg-white shadow-sm text-[#0A1A2F]' : 'text-gray-500'}`}>
            <FileText className="w-4 h-4" /> Write
          </button>
          <button onClick={() => setMode('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'video' ? 'bg-white shadow-sm text-[#0A1A2F]' : 'text-gray-500'}`}>
            <Video className="w-4 h-4" /> Video
          </button>
        </div>

        <div className="space-y-4">
          <Input placeholder="Entry title (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            className="bg-gray-100 border-[#F2F6FA] text-black" />

          {mode === 'text' && (
            <Textarea placeholder="What's on your mind?" value={newContent} onChange={(e) => setNewContent(e.target.value)}
              className="min-h-[200px] bg-gray-100 border-[#F2F6FA] text-black" />
          )}

          {mode === 'video' && (
            <div className="space-y-3">
              {!videoBlob && !showRecorder && (
                <button onClick={() => setShowRecorder(true)}
                  className="w-full flex flex-col items-center justify-center gap-3 py-10 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#FD9C2D] hover:bg-[#FD9C2D]/5 transition-all">
                  <Video className="w-10 h-10 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-500">Tap to Record Video Journal</span>
                  <span className="text-[10px] text-gray-400">Max 3 minutes · Your speech will be transcribed</span>
                </button>
              )}
              <AnimatePresence>
                {showRecorder && (
                  <VideoRecorder onRecordingComplete={handleRecordingComplete} onTranscript={handleTranscript}
                    maxDurationSec={180} onClose={() => setShowRecorder(false)} />
                )}
              </AnimatePresence>
              {videoBlob && videoUrl && !showRecorder && (
                <div className="space-y-2">
                  <video src={videoUrl} controls playsInline className="w-full rounded-2xl bg-black" style={{ maxHeight: 240 }} />
                  <button onClick={() => { setVideoBlob(null); URL.revokeObjectURL(videoUrl); setVideoUrl(null); setShowRecorder(true); }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    Re-record
                  </button>
                </div>
              )}
              <Textarea placeholder={videoBlob ? "Edit transcript or add notes..." : "Your speech will appear here after recording..."}
                value={newContent || videoTranscript} onChange={(e) => setNewContent(e.target.value)}
                className="min-h-[100px] bg-gray-100 border-[#F2F6FA] text-black text-sm" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCreateEntry} disabled={createEntry.isPending}
              className="flex-1 bg-gradient-to-r from-[#FAD98D] to-[#AFC7E3] hover:from-[#FAD98D]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]">
              <Save className="w-4 h-4 mr-2" />
              {createEntry.isPending ? 'Saving...' : mode === 'video' ? 'Save Video Journal' : 'Save Entry'}
            </Button>
            <Button onClick={handleClose} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
