import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Mic, Calendar, Book, ListChecks, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function SermonNotes() {
  const [showCreate, setShowCreate] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    speaker: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    scripture_reference: '',
    notes: '',
    key_points: [''],
    action_items: [''],
    audio_url: ''
  });

  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ['sermonNotes'],
    queryFn: () => base44.entities.SermonNote.list('-date', 50)
  });

  const createNote = useMutation({
    mutationFn: (data) => {
      const cleanData = {
        ...data,
        key_points: data.key_points.filter(p => p.trim()),
        action_items: data.action_items.filter(a => a.trim())
      };
      return base44.entities.SermonNote.create(cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sermonNotes']);
      setShowCreate(false);
      setNewNote({
        title: '',
        speaker: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        scripture_reference: '',
        notes: '',
        key_points: [''],
        action_items: [''],
        audio_url: ''
      });
    }
  });

  const handleAddKeyPoint = () => {
    setNewNote({ ...newNote, key_points: [...newNote.key_points, ''] });
  };

  const handleAddActionItem = () => {
    setNewNote({ ...newNote, action_items: [...newNote.action_items, ''] });
  };

  const handleSubmit = () => {
    if (newNote.title.trim()) {
      createNote.mutate(newNote);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowCreate(true)}
        className="w-full bg-[#1a1a2e] hover:bg-[#2d2d4a]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Sermon Notes
      </Button>

      {notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Mic className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No sermon notes yet</p>
          <Button onClick={() => setShowCreate(true)}>
            Add Your First Note
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] text-lg">{note.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    {note.speaker && (
                      <span className="flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        {note.speaker}
                      </span>
                    )}
                    {note.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(note.date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                {note.audio_url && (
                  <a
                    href={note.audio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c9a227] hover:text-[#b89320]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {note.scripture_reference && (
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Book className="w-4 h-4 text-[#c9a227]" />
                  <span className="font-medium text-[#c9a227]">{note.scripture_reference}</span>
                </div>
              )}

              {note.notes && (
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.notes}</p>
              )}

              {note.key_points && note.key_points.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Key Points:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {note.key_points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.action_items && note.action_items.length > 0 && (
                <div className="bg-[#faf8f5] rounded-lg p-3">
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-2 flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Action Items:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {note.action_items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#c9a227]">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Note Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Sermon Notes</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sermon Title *</label>
              <Input
                placeholder="e.g., The Power of Faith"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Speaker</label>
                <Input
                  placeholder="Pastor name"
                  value={newNote.speaker}
                  onChange={(e) => setNewNote({ ...newNote, speaker: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  type="date"
                  value={newNote.date}
                  onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Scripture Reference</label>
              <Input
                placeholder="e.g., Matthew 5:1-12"
                value={newNote.scripture_reference}
                onChange={(e) => setNewNote({ ...newNote, scripture_reference: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                placeholder="Write your notes here..."
                value={newNote.notes}
                onChange={(e) => setNewNote({ ...newNote, notes: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Key Points</label>
              {newNote.key_points.map((point, index) => (
                <Input
                  key={index}
                  placeholder={`Point ${index + 1}`}
                  value={point}
                  onChange={(e) => {
                    const updated = [...newNote.key_points];
                    updated[index] = e.target.value;
                    setNewNote({ ...newNote, key_points: updated });
                  }}
                  className="mb-2"
                />
              ))}
              <Button variant="outline" size="sm" onClick={handleAddKeyPoint}>
                + Add Point
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Action Items</label>
              {newNote.action_items.map((item, index) => (
                <Input
                  key={index}
                  placeholder={`Action ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...newNote.action_items];
                    updated[index] = e.target.value;
                    setNewNote({ ...newNote, action_items: updated });
                  }}
                  className="mb-2"
                />
              ))}
              <Button variant="outline" size="sm" onClick={handleAddActionItem}>
                + Add Action
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Audio/Video URL (Optional)</label>
              <Input
                placeholder="https://..."
                value={newNote.audio_url}
                onChange={(e) => setNewNote({ ...newNote, audio_url: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!newNote.title.trim()}
                className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
              >
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}