import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function StudyNotes({ section, subsection, notes, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteContent, setNoteContent] = useState(notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(noteContent);
    setIsSaving(false);
    setIsOpen(false);
  };

  return (
    <div className="mt-3">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-sm text-[#c9a227] hover:text-[#b8931f] transition-colors"
          >
            <FileText className="w-4 h-4" />
            {notes ? 'Edit notes' : 'Add notes'}
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-[#c9a227]">
              <div className="space-y-3">
                <Textarea
                  placeholder="Take notes on this section..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-24 text-sm"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      setNoteContent(notes || '');
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#c9a227] hover:bg-[#b8931f] text-white"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}