import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function JourneyFeedbackModal({ 
  isOpen, 
  onClose, 
  type, // 'workout' or 'recipe'
  item, // workout or recipe data
  onSubmit 
}) {
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState('');
  const [enjoyment, setEnjoyment] = useState(0);
  const [wouldMakeAgain, setWouldMakeAgain] = useState(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const feedback = {
      rating,
      notes,
      date: new Date().toISOString()
    };

    if (type === 'workout') {
      feedback.difficulty = difficulty;
      feedback.enjoyment = enjoyment;
      feedback.workout_id = item.id;
    } else {
      feedback.would_make_again = wouldMakeAgain;
      feedback.recipe_id = item.id;
    }

    onSubmit(feedback);
    onClose();
    
    // Reset
    setRating(0);
    setDifficulty('');
    setEnjoyment(0);
    setWouldMakeAgain(null);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Rate Your {type === 'workout' ? 'Workout' : 'Recipe'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {item?.title || item?.name}
            </p>
          </div>

          {/* Overall Rating */}
          <div>
            <Label>Overall Rating</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Workout-specific */}
          {type === 'workout' && (
            <>
              <div>
                <Label>Difficulty Level</Label>
                <div className="flex gap-2 mt-2">
                  {[
                    { value: 'too_easy', label: 'Too Easy' },
                    { value: 'just_right', label: 'Just Right' },
                    { value: 'too_hard', label: 'Too Hard' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setDifficulty(option.value)}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                        difficulty === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Enjoyment Level</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setEnjoyment(value)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm transition-all ${
                        value <= enjoyment
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Recipe-specific */}
          {type === 'recipe' && (
            <div>
              <Label>Would you make this again?</Label>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setWouldMakeAgain(true)}
                  className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                    wouldMakeAgain === true
                      ? 'border-green-600 bg-green-50 text-green-600'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  Yes
                </button>
                <button
                  onClick={() => setWouldMakeAgain(false)}
                  className={`flex-1 py-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                    wouldMakeAgain === false
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                  No
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder={
                type === 'workout'
                  ? 'How did this workout make you feel? Any exercises you particularly liked or disliked?'
                  : 'What did you think? Any modifications you made?'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}