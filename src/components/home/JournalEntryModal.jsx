import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function JournalEntryModal({ isOpen, onClose }) {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const queryClient = useQueryClient();

  const createEntry = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      setNewTitle('');
      setNewContent('');
      onClose();
      toast.success('Entry created!');
    }
  });

  const handleCreateEntry = () => {
    if (!newContent.trim()) {
      toast.error('Please write something in your entry');
      return;
    }
    createEntry.mutate({
      title: newTitle || 'Untitled Entry',
      content: newContent,
      entry_type: 'general'
    });
  };

  const handleClose = () => {
    setNewTitle('');
    setNewContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Entry title (optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-[#E6EBEF] border-[#E6EBEF] text-[#0A1A2F]"
          />
          <Textarea
            placeholder="What's on your mind?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="min-h-[200px] bg-[#E6EBEF] border-[#E6EBEF] text-[#0A1A2F]"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCreateEntry}
              disabled={createEntry.isPending}
              className="flex-1 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            >
              <Save className="w-4 h-4 mr-2" />
              {createEntry.isPending ? 'Saving...' : 'Save Entry'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}