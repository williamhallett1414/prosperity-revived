import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function JournalTagManager({ entry, onUpdate }) {
  const [tags, setTags] = useState(entry?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSuggestedTags();
  }, []);

  const loadSuggestedTags = async () => {
    try {
      // Get all unique tags from user's entries to suggest
      const entries = await base44.entities.JournalEntry.filter({}, '-created_date', 50);
      const allTags = new Set();
      entries.forEach(e => {
        e.tags?.forEach(tag => allTags.add(tag));
      });
      setSuggestedTags(Array.from(allTags).slice(0, 10));
    } catch (error) {
      console.log('Loading suggested tags...');
    }
  };

  const addTag = (tag) => {
    const cleanTag = tag.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      const updated = [...tags, cleanTag];
      setTags(updated);
      setNewTag('');
      if (entry?.id) {
        updateEntryTags(updated);
      }
    }
  };

  const removeTag = (tagToRemove) => {
    const updated = tags.filter(t => t !== tagToRemove);
    setTags(updated);
    if (entry?.id) {
      updateEntryTags(updated);
    }
  };

  const updateEntryTags = async (updatedTags) => {
    setIsLoading(true);
    try {
      await base44.entities.JournalEntry.update(entry.id, {
        tags: updatedTags
      });
      if (onUpdate) {
        onUpdate({ ...entry, tags: updatedTags });
      }
    } catch (error) {
      console.log('Updating tags...');
    } finally {
      setIsLoading(false);
    }
  };

  const tagColors = [
    'bg-[#FAD98D]/20 text-[#1a1a2e]',
    'bg-[#FAD98D]/20 text-pink-800',
    'bg-[#AFC7E3]/20 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
          placeholder="Add a tag..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={() => addTag(newTag)}
          disabled={!newTag.trim() || isLoading}
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <motion.div
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tagColors[idx % tagColors.length]}`}
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {suggestedTags.length > 0 && tags.length < 5 && (
        <div>
          <p className="text-xs text-gray-600 mb-2 font-medium">Suggested tags:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter(tag => !tags.includes(tag))
              .slice(0, 5)
              .map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  + {tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}