import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlighter, StickyNote, BookOpen, X, Save, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const HIGHLIGHT_COLORS = [
  { name: 'yellow', color: '#FCD34D', label: 'Yellow' },
  { name: 'blue', color: '#60A5FA', label: 'Blue' },
  { name: 'green', color: '#34D399', label: 'Green' },
  { name: 'pink', color: '#F472B6', label: 'Pink' }
];

export default function VerseActionMenu({ 
  verse, 
  bookName,
  chapter,
  existingBookmark,
  onHighlight,
  onAddNote,
  onUpdateNote,
  onRemoveHighlight,
  onSaveToJournal,
  onClose 
}) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(existingBookmark?.note || '');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAIInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleHighlightSelect = (color) => {
    if (existingBookmark && existingBookmark.highlight_color === color) {
      // Remove highlight if same color is selected
      onRemoveHighlight();
      onClose();
    } else {
      onHighlight(color, existingBookmark?.note || '');
      if (!showNoteInput) {
        onClose();
      }
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) {
      toast.error('Please write a note');
      return;
    }

    if (existingBookmark) {
      onUpdateNote(noteText);
    } else {
      onAddNote(noteText);
    }
    setShowNoteInput(false);
    toast.success('Note saved!');
  };

  const handleSaveToJournal = async () => {
    if (!existingBookmark?.note && !noteText.trim()) {
      toast.error('Add a note first before saving to journal');
      return;
    }
    
    // If there's unsaved text in the input, save it first
    if (showNoteInput && noteText.trim() && noteText !== existingBookmark?.note) {
      if (existingBookmark) {
        await onUpdateNote(noteText);
      } else {
        await onAddNote(noteText);
      }
      // Small delay to ensure bookmark is updated
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    onSaveToJournal();
    onClose();
  };

  const handleGetAIInsights = async () => {
    setLoadingAI(true);
    setShowAIInsights(true);
    
    const verseRef = `${bookName} ${chapter}:${verse.verse}`;
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Gideon, a warm biblical scholar providing deep insights into Scripture.

Analyze this verse: ${verseRef}
Text: "${verse.text}"

Provide:

**📜 Historical & Cultural Context**
Explain the time period, cultural setting, and original audience. What was happening when this was written?

**⛪ Theological Interpretation**
What does this verse reveal about God's character, His promises, or His ways? What kingdom principles are taught here?

**🔗 Scripture Connections**
List 3-4 related verses that connect to this theme or expand on this truth. Reference them clearly.

**💡 Key Themes & Message**
What are the main spiritual themes? What is God communicating through this?

**🎯 Practical Application**
How does this apply to our lives today? What action or mindset shift does it call for?

Keep it warm, accessible, and spiritually enriching - like Dr. Myles Munroe's kingdom revelation combined with Joel Osteen's encouragement.`,
        add_context_from_internet: true
      });

      setAIInsights(response);
    } catch (error) {
      toast.error('Failed to get AI insights');
      console.error(error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden"
        style={{ minWidth: '280px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0A1A2F]" />
            <span className="text-sm font-semibold text-[#0A1A2F]">
              {bookName} {chapter}:{verse.verse}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#0A1A2F]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* AI Insights Button */}
          <Button
            onClick={handleGetAIInsights}
            disabled={loadingAI}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loadingAI ? 'Getting Insights...' : 'Get AI Insights with Gideon'}
          </Button>

          {/* AI Insights Display */}
          {showAIInsights && aiInsights && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-900">Gideon's Insights</span>
              </div>
              <div className="prose prose-sm text-gray-700 text-xs leading-relaxed">
                {aiInsights.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Highlight Colors */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Highlighter className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">Highlight</span>
            </div>
            <div className="flex gap-2">
              {HIGHLIGHT_COLORS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => handleHighlightSelect(colorOption.name)}
                  className={`flex-1 h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                    existingBookmark?.highlight_color === colorOption.name
                      ? 'border-[#0A1A2F] ring-2 ring-[#0A1A2F]/20'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                  title={colorOption.label}
                >
                  {existingBookmark?.highlight_color === colorOption.name && (
                    <span className="text-[#0A1A2F] font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
            {existingBookmark && (
              <button
                onClick={() => {
                  onRemoveHighlight();
                  onClose();
                }}
                className="mt-2 w-full text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Remove Highlight
              </button>
            )}
          </div>

          {/* Note Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700">Note</span>
              </div>
              {!showNoteInput && existingBookmark?.note && (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="text-xs text-[#D9B878] hover:text-[#D9B878]/80 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {showNoteInput ? (
              <div className="space-y-2">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write your reflection..."
                  className="min-h-[100px] text-sm bg-gray-50 border-gray-200"
                  autoFocus
                />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveNote}
                      size="sm"
                      className="flex-1 bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save Note
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNoteInput(false);
                        setNoteText(existingBookmark?.note || '');
                      }}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                  {noteText.trim() && (
                    <Button
                      onClick={handleSaveToJournal}
                      size="sm"
                      className="w-full bg-[#8fa68a] hover:bg-[#8fa68a]/90 text-white"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Save to Journal
                    </Button>
                  )}
                </div>
              </div>
            ) : existingBookmark?.note ? (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="text-sm text-gray-700">{existingBookmark.note}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveToJournal}
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Save to Journal
                  </Button>
                  <button
                    onClick={() => {
                      onUpdateNote('');
                      setNoteText('');
                      toast.success('Note deleted');
                    }}
                    className="px-3 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowNoteInput(true)}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <StickyNote className="w-3 h-3 mr-2" />
                Add Note
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}