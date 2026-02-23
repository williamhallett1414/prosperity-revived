import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Calendar, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ChallengeDetailModal({ challenge, user, participation, onClose }) {
  const [reflection, setReflection] = useState('');
  const queryClient = useQueryClient();

  const completeDay Mutation = useMutation({
    mutationFn: async ({ day, reflectionText }) => {
      const updatedCompletedDays = [...(participation.completed_days || []), day];
      const updatedReflections = [
        ...(participation.reflection_entries || []),
        {
          day: day,
          reflection: reflectionText,
          date: new Date().toISOString()
        }
      ];

      await base44.entities.ChallengeParticipation.update(participation.id, {
        completed_days: updatedCompletedDays,
        current_day: day + 1,
        reflection_entries: updatedReflections
      });
    },
    onSuccess: () => {
      toast.success('Day completed! Keep going!');
      setReflection('');
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
    }
  });

  const currentDay = participation?.current_day || 1;
  const completedDays = participation?.completed_days || [];
  const dailyPrompt = challenge.daily_prompts?.find(p => p.day === currentDay);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{challenge.title}</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                {challenge.duration_days} days
              </Badge>
              <Badge variant="outline">
                Facilitated by {challenge.chatbot_facilitator}
              </Badge>
            </div>
          </div>

          {participation && (
            <>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Your Progress</h3>
                  <Badge className="bg-purple-600">
                    Day {currentDay} of {challenge.duration_days}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.from({ length: challenge.duration_days }, (_, i) => i + 1).map((day) => (
                    <div
                      key={day}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                        completedDays.includes(day)
                          ? 'bg-green-500 text-white'
                          : day === currentDay
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {completedDays.includes(day) ? <CheckCircle2 className="w-5 h-5" /> : day}
                    </div>
                  ))}
                </div>
              </div>

              {dailyPrompt && !completedDays.includes(currentDay) && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Today's Prompt</h3>
                  <p className="text-gray-700 mb-4">{dailyPrompt.prompt}</p>
                  
                  <Textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write your reflection..."
                    className="mb-3 min-h-[100px]"
                  />
                  
                  <Button
                    onClick={() => completeDayMutation.mutate({ 
                      day: currentDay, 
                      reflectionText: reflection 
                    })}
                    disabled={!reflection.trim() || completeDayMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Complete Day {currentDay}
                  </Button>
                </div>
              )}

              {participation.reflection_entries && participation.reflection_entries.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Your Reflections</h3>
                  <div className="space-y-3">
                    {participation.reflection_entries.slice().reverse().map((entry, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 border">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Day {entry.day}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{entry.reflection}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}