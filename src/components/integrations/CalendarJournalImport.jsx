import React, { useState } from 'react';
import { Heart, Check, Info, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const SOURCE_OPTIONS = [
  {
    id: 'weekly_schedule',
    name: 'Weekly Schedule',
    icon: '📅',
    description: 'Share your schedule so Hannah can align growth practices with your life',
    placeholder: 'e.g.\nMon: Work 9-6, gym 7pm\nTue: Work 9-5, free evening\nWed: Therapy 12pm, date night 7pm\nFri: Flexible, need wind-down time\nWeekend: Family time, church Sunday...',
  },
  {
    id: 'journal_entries',
    name: 'Journal Entries',
    icon: '📓',
    description: 'Import past journal entries to help Hannah understand your patterns',
    placeholder: 'Paste 2-3 recent journal entries or reflections here...',
  },
  {
    id: 'goals_intentions',
    name: 'Goals & Intentions',
    icon: '🎯',
    description: 'Share your current life goals, intentions, or vision board ideas',
    placeholder: 'e.g.\nThis year I want to:\n- Build a consistent morning routine\n- Work on my confidence in relationships\n- Get clear on my career direction\n- Feel more present and less anxious...',
  },
  {
    id: 'life_events',
    name: 'Recent Life Events',
    icon: '🌱',
    description: 'Share major changes or challenges you\'re navigating right now',
    placeholder: 'e.g.\nJust moved to a new city and feeling isolated. Going through a breakup. Starting a new job next month. Mom\'s health has been on my mind...',
  },
  {
    id: 'spiritual_practices',
    name: 'Spiritual Practices',
    icon: '✨',
    description: 'Share your current spiritual routines for deeper growth alignment',
    placeholder: 'e.g.\nMorning: 10min meditation, gratitude journal\nRead Bible daily\nAttend church Sunday\nCurrently working through feeling disconnected from faith...',
  },
];

export default function CalendarJournalImport({ user }) {
  const [selectedSource, setSelectedSource] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImport = async () => {
    if (!user?.email || !textInput.trim()) return;
    setIsLoading(true);
    try {
      const summary = await base44.integrations.Core.InvokeLLM({
        prompt: `As Hannah (a personal growth guide), analyze this user's ${selectedSource?.name} data and extract 2-3 key insights about their emotional patterns, growth opportunities, scheduling constraints, or life context. Be concise, empathetic, and specific. This will be used to personalize future coaching conversations.

Data:
${textInput}`,
        add_context_from_internet: false,
      });

      await base44.entities.ChatbotMemory.create({
        chatbot_name: 'Hannah',
        memory_type: selectedSource?.id === 'goals_intentions' ? 'goal' : 'insight',
        content: `${selectedSource?.name} import: ${(summary || '').slice(0, 500)}`,
        context: 'external_data_import',
        importance: 9,
        conversation_date: new Date().toISOString().split('T')[0],
        last_referenced: new Date().toISOString(),
      });

      // Also save journal entries directly if that's what was imported
      if (selectedSource?.id === 'journal_entries' && user?.email) {
        try {
          await base44.entities.JournalEntry.create({
            content: textInput,
            entry_type: 'reflection',
            tags: ['imported'],
          });
        } catch (e) {
          // silent - memory is the primary save
        }
      }

      setSuccess(true);
      toast.success("Hannah now has deeper context to support your growth journey.");
    } catch (err) {
      toast.error('Import failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-purple-600" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Context Added!</h3>
        <p className="text-sm text-gray-500 mb-4">Hannah now has richer context from your {selectedSource?.name} to align spiritual and personal growth with your daily life.</p>
        <Button variant="outline" size="sm" onClick={() => { setSuccess(false); setSelectedSource(null); setTextInput(''); }}>
          Add More
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 bg-purple-50 rounded-xl p-3 text-xs text-purple-700">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <p>Help Hannah understand your life context — your schedule, journal reflections, and goals — so she can connect your spiritual and personal growth to your real daily life.</p>
      </div>

      {!selectedSource ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Choose Type</p>
          {SOURCE_OPTIONS.map(source => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all text-left"
            >
              <span className="text-2xl">{source.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{source.name}</p>
                <p className="text-xs text-gray-500 truncate">{source.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedSource(null)} className="text-xs text-purple-600 hover:underline">← Back</button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedSource.icon}</span>
            <div>
              <p className="font-bold text-gray-900">{selectedSource.name}</p>
              <p className="text-xs text-gray-500">{selectedSource.description}</p>
            </div>
          </div>

          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={selectedSource.placeholder}
            className="w-full text-sm border border-gray-200 rounded-xl p-3 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <Button
            onClick={handleImport}
            disabled={isLoading || !textInput.trim()}
            className="w-full bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] text-white"
          >
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</> : <><Heart className="w-4 h-4 mr-2" /> Share with Hannah</>}
          </Button>
        </div>
      )}
    </div>
  );
}