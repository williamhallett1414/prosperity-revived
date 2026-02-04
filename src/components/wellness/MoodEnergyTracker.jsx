import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Smile, Frown, Meh, TrendingUp, TrendingDown, Battery, BatteryLow, BatteryFull } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function MoodEnergyTracker({ isOpen, onClose, onSubmit }) {
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState('');
  const [notes, setNotes] = useState('');

  const moods = [
    { value: 'very_low', label: 'Very Low', icon: Frown, color: 'text-red-600' },
    { value: 'low', label: 'Low', icon: Frown, color: 'text-orange-600' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-yellow-600' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-green-600' },
    { value: 'excellent', label: 'Excellent', icon: Smile, color: 'text-emerald-600' }
  ];

  const energyLevels = [
    { value: 'exhausted', label: 'Exhausted', icon: BatteryLow, color: 'text-red-600' },
    { value: 'low', label: 'Low', icon: BatteryLow, color: 'text-orange-600' },
    { value: 'moderate', label: 'Moderate', icon: Battery, color: 'text-yellow-600' },
    { value: 'high', label: 'High', icon: BatteryFull, color: 'text-green-600' },
    { value: 'energized', label: 'Energized', icon: BatteryFull, color: 'text-emerald-600' }
  ];

  const handleSubmit = () => {
    onSubmit({
      date: new Date().toISOString(),
      mood,
      energy_level: energy,
      notes
    });
    
    // Reset
    setMood('');
    setEnergy('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Track Your Day</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mood Selection */}
          <div>
            <Label className="mb-3 block">How are you feeling?</Label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                      mood === m.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${m.color}`} />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy Level Selection */}
          <div>
            <Label className="mb-3 block">What's your energy level?</Label>
            <div className="grid grid-cols-5 gap-2">
              {energyLevels.map(e => {
                const Icon = e.icon;
                return (
                  <button
                    key={e.value}
                    onClick={() => setEnergy(e.value)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                      energy === e.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${e.color}`} />
                    <span className="text-xs">{e.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Anything specific affecting your mood or energy today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!mood || !energy}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}