import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GratitudeJournal() {
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
      toast.success('Gratitude saved! 🙏');
      setGratitudeItems(['', '', '']);
    } catch (error) {
      toast.error('Failed to save gratitude');
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-6 h-6 text-pink-500" />
        <h3 className="text-lg font-bold text-[#0A1A2F]">Gratitude Journal</h3>
      </div>

      <p className="text-sm text-[#0A1A2F]/70 mb-4">What are you grateful for today?</p>

      <div className="space-y-3 mb-4">
        {gratitudeItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-pink-500 font-bold">{index + 1}.</span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="I'm grateful for..."
              className="bg-white border-pink-200 focus:border-pink-400 text-black"
            />
          </div>
        ))}
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        {saving ? 'Saving...' : 'Save Gratitude'}
      </Button>
    </motion.div>
  );
}