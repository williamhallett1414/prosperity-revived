import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

const SELF_CARE_POINTS = {
  morning_ritual: 15,
  emotional_wellness: 20,
  mental_clarity: 15,
  joyful_activity: 10,
  creative_expression: 20,
  rest_recovery: 15,
  affirmations: 10,
  growth_mindset: 15,
  boundary_setting: 25,
  self_compassion: 15,
  mood_booster: 10
};

export default function SelfCareActivityLogger({ isOpen, onClose, activityType, activityName, category, user }) {
  const [reflection, setReflection] = useState('');
  const [moodBefore, setMoodBefore] = useState('neutral');
  const [moodAfter, setMoodAfter] = useState('good');
  const [energyBefore, setEnergyBefore] = useState('moderate');
  const [energyAfter, setEnergyAfter] = useState('high');
  const [duration, setDuration] = useState(15);
  const [isLogging, setIsLogging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();

  const logActivityMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.SelfCareActivity.create(data);
    },
    onSuccess: async () => {
      const pointsEarned = SELF_CARE_POINTS[activityType] || 10;
      await awardPoints(user?.email, pointsEarned, { 
        self_care_activities_completed: 1 
      });
      await checkAndAwardBadges(user?.email);
      queryClient.invalidateQueries(['selfCareActivities']);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  });

  const handleSubmit = async () => {
    setIsLogging(true);
    try {
      await logActivityMutation.mutateAsync({
        activity_type: activityType,
        activity_name: activityName,
        category,
        date_completed: new Date().toISOString().split('T')[0],
        duration_minutes: parseInt(duration),
        points_earned: SELF_CARE_POINTS[activityType] || 10,
        reflection: reflection.trim(),
        mood_before: moodBefore,
        mood_after: moodAfter,
        energy_before: energyBefore,
        energy_after: energyAfter
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const moodImproved = moodAfter > moodBefore;
  const energyImproved = energyAfter > energyBefore;
  const pointsEarned = SELF_CARE_POINTS[activityType] || 10;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
              >
                <Check className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <p className="text-lg font-bold text-gray-900 mb-2">Activity Logged!</p>
              <p className="text-sm text-gray-600 mb-4">You earned {pointsEarned} points 🎉</p>
              {moodImproved && (
                <p className="text-xs text-emerald-600">Your mood improved! Keep it up!</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle className="text-base">{activityName}</DialogTitle>
                <p className="text-xs text-gray-500 mt-2">
                  You'll earn <span className="font-bold text-emerald-600">{pointsEarned} points</span>
                </p>
              </DialogHeader>

              {/* Duration */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                  max="180"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* Before/After Mood */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Mood Before</label>
                  <Select value={moodBefore} onValueChange={setMoodBefore}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very_low">Very Low 😢</SelectItem>
                      <SelectItem value="low">Low 😞</SelectItem>
                      <SelectItem value="neutral">Neutral 😐</SelectItem>
                      <SelectItem value="good">Good 😊</SelectItem>
                      <SelectItem value="excellent">Excellent 🤩</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Mood After</label>
                  <Select value={moodAfter} onValueChange={setMoodAfter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very_low">Very Low 😢</SelectItem>
                      <SelectItem value="low">Low 😞</SelectItem>
                      <SelectItem value="neutral">Neutral 😐</SelectItem>
                      <SelectItem value="good">Good 😊</SelectItem>
                      <SelectItem value="excellent">Excellent 🤩</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Before/After Energy */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Energy Before</label>
                  <Select value={energyBefore} onValueChange={setEnergyBefore}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exhausted">Exhausted 😴</SelectItem>
                      <SelectItem value="low">Low 🔋</SelectItem>
                      <SelectItem value="moderate">Moderate ⚡</SelectItem>
                      <SelectItem value="high">High 🚀</SelectItem>
                      <SelectItem value="energized">Energized 💥</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Energy After</label>
                  <Select value={energyAfter} onValueChange={setEnergyAfter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exhausted">Exhausted 😴</SelectItem>
                      <SelectItem value="low">Low 🔋</SelectItem>
                      <SelectItem value="moderate">Moderate ⚡</SelectItem>
                      <SelectItem value="high">High 🚀</SelectItem>
                      <SelectItem value="energized">Energized 💥</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reflection */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  How did it feel? (optional)
                </label>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Share your thoughts and feelings..."
                  className="min-h-[80px] text-sm resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLogging}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLogging ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Log Activity
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}