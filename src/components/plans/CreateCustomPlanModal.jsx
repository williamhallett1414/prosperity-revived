import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { bibleBooks } from '@/components/bible/BibleData';

export default function CreateCustomPlanModal({ isOpen, onClose, onSubmit }) {
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [readings, setReadings] = useState([{ book: '', chapter: '' }]);

  const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];

  const addReading = () => {
    setReadings([...readings, { book: '', chapter: '' }]);
  };

  const removeReading = (index) => {
    setReadings(readings.filter((_, i) => i !== index));
  };

  const updateReading = (index, field, value) => {
    const updated = [...readings];
    updated[index][field] = value;
    setReadings(updated);
  };

  const handleSubmit = () => {
    const validReadings = readings.filter(r => r.book && r.chapter);
    if (planName.trim() && validReadings.length > 0) {
      onSubmit({
        name: planName.trim(),
        description: description.trim(),
        readings: validReadings
      });
      setPlanName('');
      setDescription('');
      setReadings([{ book: '', chapter: '' }]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Reading Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Plan Name</Label>
            <Input
              placeholder="e.g., Journey Through Psalms"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Describe your reading plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[60px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Daily Readings</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addReading}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Day
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {readings.map((reading, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500 w-12">Day {index + 1}</span>
                  <Select
                    value={reading.book}
                    onValueChange={(value) => updateReading(index, 'book', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select book" />
                    </SelectTrigger>
                    <SelectContent>
                      {allBooks.map(book => (
                        <SelectItem key={book.name} value={book.name}>
                          {book.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Ch"
                    min="1"
                    value={reading.chapter}
                    onChange={(e) => updateReading(index, 'chapter', e.target.value)}
                    className="w-20"
                  />
                  {readings.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReading(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!planName.trim() || readings.filter(r => r.book && r.chapter).length === 0}
              className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
            >
              Create Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}