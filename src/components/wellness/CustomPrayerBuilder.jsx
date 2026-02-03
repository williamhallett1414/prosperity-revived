import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CustomPrayerBuilder() {
  const [prayer, setPrayer] = useState({
    title: '',
    type: 'prayer',
    duration_minutes: 5,
    elements: []
  });
  const [currentElement, setCurrentElement] = useState({ text: '', duration: 30 });
  const queryClient = useQueryClient();

  const createPrayer = useMutation({
    mutationFn: (data) => {
      const script = data.elements.map(e => e.text).join('\n\n');
      return base44.entities.Meditation.create({
        title: data.title,
        type: data.type,
        duration_minutes: data.duration_minutes,
        script
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meditations']);
      setPrayer({ title: '', type: 'prayer', duration_minutes: 5, elements: [] });
    }
  });

  const generateWithAI = async () => {
    const prompt = `Create a guided ${prayer.type} session titled "${prayer.title}".
Duration: ${prayer.duration_minutes} minutes.

Create a calming, spiritual script that guides someone through this session.
Include:
- Opening (gratitude, centering)
- Main content (meditation/prayer focus)
- Closing (affirmations, peace)

Make it meaningful and easy to follow.`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt });
    setPrayer({ ...prayer, elements: [{ text: response, duration: prayer.duration_minutes * 60 }] });
  };

  const addElement = () => {
    if (currentElement.text.trim()) {
      setPrayer({ ...prayer, elements: [...prayer.elements, currentElement] });
      setCurrentElement({ text: '', duration: 30 });
    }
  };

  const removeElement = (index) => {
    setPrayer({ ...prayer, elements: prayer.elements.filter((_, i) => i !== index) });
  };

  const handleCreate = () => {
    if (prayer.title.trim() && prayer.elements.length > 0) {
      createPrayer.mutate(prayer);
    }
  };

  return (
    <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
      <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-4">Create Custom Prayer/Meditation</h3>

      <div className="space-y-3">
        <Input
          placeholder="Title (e.g., Evening Gratitude Prayer)"
          value={prayer.title}
          onChange={(e) => setPrayer({ ...prayer, title: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select value={prayer.type} onValueChange={(v) => setPrayer({ ...prayer, type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prayer">Prayer</SelectItem>
              <SelectItem value="meditation">Meditation</SelectItem>
              <SelectItem value="breathing">Breathing</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Duration (min)"
            value={prayer.duration_minutes}
            onChange={(e) => setPrayer({ ...prayer, duration_minutes: parseInt(e.target.value) || 5 })}
          />
        </div>

        <Button
          onClick={generateWithAI}
          variant="outline"
          className="w-full"
          disabled={!prayer.title.trim()}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate with AI
        </Button>

        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prayer Elements</p>
          
          <div className="space-y-2 mb-3 max-h-[200px] overflow-y-auto">
            {prayer.elements.map((element, index) => (
              <div key={index} className="flex gap-2 items-start p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="flex-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{element.text}</p>
                <Button variant="ghost" size="icon" onClick={() => removeElement(index)} className="h-6 w-6">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Textarea
            placeholder="Add a prayer element or guidance..."
            value={currentElement.text}
            onChange={(e) => setCurrentElement({ ...currentElement, text: e.target.value })}
            className="h-24 mb-2"
          />

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Duration (sec)"
              value={currentElement.duration}
              onChange={(e) => setCurrentElement({ ...currentElement, duration: parseInt(e.target.value) || 30 })}
              className="w-32"
            />
            <Button onClick={addElement} variant="outline" className="flex-1">
              <Plus className="w-4 h-4 mr-1" />
              Add Element
            </Button>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={!prayer.title.trim() || prayer.elements.length === 0}
        >
          Create Session
        </Button>
      </div>
    </div>
  );
}