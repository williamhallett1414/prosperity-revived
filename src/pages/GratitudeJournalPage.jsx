import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GratitudeJournalPage() {
  const [gratitudeItems, setGratitudeItems] = useState(['', '', '']);
  const [saving, setSaving] = useState(false);

  const updateItem = (index, value) => {
    const newItems = [...gratitudeItems];
    newItems[index] = value;
    setGratitudeItems(newItems);
  };

  const handleSave = async () => {
    const filledItems = gratitudeItems.filter(item => item.trim());
    if (filledItems.length === 0) {
      toast.error('Please add at least one thing you\'re grateful for');
      return;
    }

    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({
        entry_type: 'gratitude',
        content: filledItems.join('\n'),
        mood: 'grateful'
      });
      toast.success('Gratitude saved to My Journal! 🙏');
      setGratitudeItems(['', '', '']);
    } catch (error) {
      toast.error('Failed to save gratitude');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Wellness') + '?tab=mind'}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Gratitude Journal</h1>
            <p className="text-xs text-[#0A1A2F]/60">Count your blessings</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#AFC7E3]/15 to-[#AFC7E3]/15 rounded-2xl p-6 border border-[#AFC7E3]/40"
        >
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-10 h-10 text-[#3C4E53]" />
            <div>
              <h3 className="text-xl font-bold text-[#0A1A2F]">Today's Gratitude</h3>
              <p className="text-xs text-[#0A1A2F]/60">What are you grateful for today?</p>
            </div>
          </div>

          <p className="text-sm text-[#0A1A2F]/70 mb-6 leading-relaxed">
            Take a moment to reflect on the blessings in your life. Research shows that practicing gratitude daily can improve your mental health and overall well-being.
          </p>

          <div className="space-y-4 mb-6">
            {gratitudeItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-[#3C4E53] text-white rounded-full font-bold text-sm mt-1 flex-shrink-0">
                  {index + 1}
                </div>
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder="I'm grateful for..."
                  className="bg-white border-[#AFC7E3]/40 focus:border-[#AFC7E3] h-12 text-base"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#3C4E53] hover:bg-[#0A1A2F] text-white h-12 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save to My Journal'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}